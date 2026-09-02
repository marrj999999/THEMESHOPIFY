// LIVE CHECK — the gate that reads the PUBLIC site, not the repo.
//
// Created 2026-09-02 after the Site-vs-Vault review (vault: Reports/Website Review vs Vault
// 2026-09-02). Eleven Claims Register breaches were live that day beneath green gates. Three
// reasons, and this file answers each:
//
//   1. claim-lint reads SOURCE. Template settings James edits in the theme editor, admin page
//      bodies, product descriptions and metafield SEO text never pass through it. estate-check
//      reads RENDERED pages but was scoped to the draft theme, run rarely, and carried a waiver
//      that hid the FAQ's "36 countries". This gate reads what a visitor reads, on the live theme,
//      with no waivers.
//   2. Nothing checked CONTRADICTIONS. "five prison sites" and "4 prison sites running" are both
//      individually plausible; only a cross-page pass sees that they disagree. Same for workshop
//      prices, cohort numbers and the minister's attribution.
//   3. CSS and UX drift had no cheap, repeatable measurement on the live theme: button-style
//      count, display-heading count, kicker case, sub-12px text, cookie card over the fold, H1
//      and primary CTA above the phone fold, page weight. All are measured here per page so a
//      regression shows up as a number moving, not as a feeling.
//
// It reports three lanes — CONTENT · CSS · UX — with FAIL / WARN / OK per check, writes
// qa/reports/live-check-<date>.{json,md}, and exits 1 under --assert if anything FAILS.
//
// Usage:
//   node qa/live-check.mjs                 # full estate (serial, rate-limited; ~15 min)
//   node qa/live-check.mjs --quick         # the 20 pages in qa/pages.txt
//   node qa/live-check.mjs /pages/impact /products/gravel-frame-build-kit
//   node qa/live-check.mjs --assert        # exit 1 on any FAIL (use in run-all / cron)
//   node qa/live-check.mjs --desktop-only
//
// Rules learned elsewhere in this repo and honoured here: serial navigation with a pause (the
// store 429s parallel crawls); wait for reveal animations to settle before measuring; numbers
// from a frozen animation frame are not numbers; no waivers — a live breach is a FAIL until the
// register changes.
import { chromium } from '@playwright/test';
import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import { ALL_PAGES, BASE } from './estate-pages.mjs';
import { BANNED } from './banned-claims.mjs';

const argv = process.argv.slice(2);
const flag = f => argv.includes(f);
const explicit = argv.filter(a => a.startsWith('/'));
const PAGES = explicit.length ? explicit
  : flag('--quick') ? readFileSync(new URL('./pages.txt', import.meta.url), 'utf8').split('\n').map(s => s.trim()).filter(Boolean)
  : ALL_PAGES.filter(p => !/^\/(cart|account|search)/.test(p));
const VIEWPORTS = flag('--desktop-only') ? [['desktop', 1440, 900]] : [['desktop', 1440, 900], ['mobile', 390, 844]];
const PAUSE_MS = 900;
const today = new Date().toISOString().slice(0, 10);

// ── Budgets. Change these here, in one place, with a reason in the commit. ────────────────────
const BUDGET = {
  pageBytesMobile: 4_000_000,    // 4 MB — the prisons page (no video) is 2–3 MB and scores 83
  pageBytesDesktop: 9_000_000,
  largestMediaMobile: 1_500_000, // one hero loop for phones
  displayH2Max: 2,               // 102px display headings per page (review: why-bamboo had 11)
  buttonStylesMax: 4,            // distinct computed button styles (review: 5–11 per page)
  tinyTextMax: 4,                // elements under 12px
  metaDescMin: 50, metaDescMax: 165,
};

// ── Contradiction detectors. Each yields a normalised VALUE; values are compared across pages.
const CONTRA = [
  { key: 'prison-site-count', re: /\b(four|4|five|5|three|3)\s+(?:UK\s+)?prison sites?\b/gi, norm: m => m[1].toLowerCase().replace(/^4$/, 'four').replace(/^5$/, 'five').replace(/^3$/, 'three') },
  { key: 'countries', re: /\b(\d{2})\+?\s+countries\b/gi, norm: m => m[1] },
  // Workshop price: only a £ figure within 40 chars AFTER the word "workshop" (kit prices on PDPs
  // were false-positiving when the detector also keyed on road/gravel/mtb — 2026-09-02).
  { key: 'workshop-price', re: /workshops?[^£.]{0,40}£(\d{3})\b/gi, norm: m => '£' + m[1], only: /\/pages\/(workshops|bicycle-frame-building-workshop|frequently-asked-questions)/i, onlyPath: true },
  { key: 'cohort-size', re: /\b(six|6|seven|7|eight|8|up to 8)\s+Makers\b/gi, norm: m => m[1].toLowerCase() },
  { key: 'timpson-attribution', re: /Lord Timpson,?\s+(then\s+)?Prisons Minister(?:\s*[—–-]\s*([A-Za-z ]+,\s*\w+ 20\d\d))?/g, norm: m => (m[1] ? 'then ' : '') + (m[2] ? 'dated' : 'UNDATED') },
  { key: 'design-museum-year', re: /Design Museum[^.]{0,80}\b(201[4-9])\b/gi, norm: m => m[1] },
  { key: 'cycle-to-work-saving', re: /\b(\d{2})\s*[–-]\s*(\d{2})%/g, norm: m => `${m[1]}–${m[2]}%`, only: /cycle to work/i },
];

const results = [];   // {page, vp, lane, check, status, detail}
const values = {};    // contradiction values: key -> value -> Set(pages)
const push = (page, vp, lane, check, status, detail = '') => results.push({ page, vp, lane, check, status, detail: String(detail).slice(0, 160) });

const browser = await chromium.launch();
for (const path of PAGES) {
  for (const [vp, w, h] of VIEWPORTS) {
    const ctx = await browser.newContext({
      viewport: { width: w, height: h }, reducedMotion: 'reduce', isMobile: vp === 'mobile',
      userAgent: vp === 'mobile' ? 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 Mobile/15E148 Safari/604.1 bbc-live-check' : undefined,
    });
    const page = await ctx.newPage();
    let bytes = 0; const media = [];
    page.on('response', r => {
      try {
        const len = Number(r.headers()['content-length'] || 0);
        bytes += len;
        const ct = r.headers()['content-type'] || '';
        if (/video|image/.test(ct) && len > 0) media.push({ url: r.url().split('?')[0].slice(-70), bytes: len });
      } catch {}
    });
    let resp;
    try { resp = await page.goto(BASE + path, { waitUntil: 'networkidle', timeout: 60000 }); }
    catch (e) { push(path, vp, 'CONTENT', 'loads', 'FAIL', e.message.slice(0, 80)); await ctx.close(); continue; }
    if (!resp || resp.status() >= 400) { push(path, vp, 'CONTENT', 'loads', 'FAIL', `HTTP ${resp?.status()}`); await ctx.close(); continue; }
    await page.waitForTimeout(3000); // count-up stats + reveals settle (README gotcha)
    await page.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 700) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 60)); } window.scrollTo(0, 0); });
    await page.waitForTimeout(500);

    const m = await page.evaluate(({ banned, contra }) => {
      const d = document, de = d.documentElement, vpH = innerHeight, vpW = innerWidth;
      const text = d.body.innerText;
      const metaDesc = d.querySelector('meta[name="description"]')?.content || '';
      const og = [...d.querySelectorAll('meta[property^="og:"]')].map(e => e.content).join(' ');
      const all = [text, d.title, metaDesc, og].join('\n');
      const bannedHits = banned.map(b => all.match(new RegExp(b.src, b.flags.replace('g', '')))).filter(Boolean).map(x => x[0]);
      const contraHits = {};
      for (const c of contra) {
        if (c.only && !new RegExp(c.only.src, c.only.flags).test(c.onlyPath ? location.pathname : all)) continue;
        const re = new RegExp(c.re.src, c.re.flags.includes('g') ? c.re.flags : c.re.flags + 'g');
        contraHits[c.key] = [...all.matchAll(re)].map(mm => [...mm].map(String));
      }
      // UX — first viewport
      const h1 = d.querySelector('h1');
      const h1Rect = h1 ? h1.getBoundingClientRect() : null;
      const h1Top = h1Rect ? h1Rect.top + scrollY : null;
      const h1Visible = h1Rect ? (h1Rect.top < vpH && h1Rect.bottom > 0 && getComputedStyle(h1).visibility !== 'hidden') : false;
      const isBtn = e => e.matches('button, .rd-btn, .btn, [class*="btn"], [class*="button"]');
      const ctas = [...d.querySelectorAll('main a, main button, .rd-hero a, .rd-btn, a.button, button[type="submit"]')].filter(e => { const cs = getComputedStyle(e); return cs.display !== 'none' && cs.visibility !== 'hidden' && isBtn(e); });
      const ctaAboveFold = ctas.some(e => { const r = e.getBoundingClientRect(); return r.top >= 0 && r.bottom <= vpH && r.width > 0; });
      const cookie = d.querySelector('#shopify-pc__banner, .shopify-pc__banner, [id*="privacy-banner"], [class*="cookie"]');
      let cookieCover = 0;
      if (cookie && getComputedStyle(cookie).display !== 'none') { const r = cookie.getBoundingClientRect(); cookieCover = Math.max(0, Math.min(r.bottom, vpH) - Math.max(r.top, 0)) * Math.max(0, Math.min(r.right, vpW) - Math.max(r.left, 0)) / (vpW * vpH); }
      const imgs = [...d.querySelectorAll('img')];
      const noAlt = imgs.filter(i => !i.hasAttribute('alt')).length;
      // CSS lane
      const btnEls = [...d.querySelectorAll('a.rd-btn, .rd-btn, button, a.button, .btn, [class*="__btn"], [class*="-btn"]')].filter(e => { const cs = getComputedStyle(e); return cs.display !== 'none' && e.getBoundingClientRect().width > 0 && !/menu|search|cart|close|drawer|slider|carousel|tab|pc__|privacy/i.test(e.className + e.id); });
      const btnStyles = new Set(btnEls.map(e => { const cs = getComputedStyle(e); return [cs.backgroundColor, cs.color, cs.borderRadius, cs.fontSize, cs.borderColor].join('|'); }));
      const h2s = [...d.querySelectorAll('h2')].map(e => parseFloat(getComputedStyle(e).fontSize));
      const displayH2 = h2s.filter(s => s >= 80).length;
      const tiny = [...d.querySelectorAll('main *, footer *')].filter(e => e.children.length === 0 && e.textContent.trim().length > 2 && parseFloat(getComputedStyle(e).fontSize) < 12 && getComputedStyle(e).display !== 'none').length;
      const kickers = [...d.querySelectorAll('.rd-eyebrow, .rd-kicker, [class*="eyebrow"]')].map(e => getComputedStyle(e).textTransform);
      const kickerCaps = kickers.filter(t => t === 'uppercase').length;
      const fonts = new Set([...d.querySelectorAll('h1,h2,h3,p,a,button,li')].slice(0, 300).map(e => getComputedStyle(e).fontFamily.split(',')[0].replace(/"/g, '')));
      const overflow = de.scrollWidth - de.clientWidth;
      return { bannedHits, contraHits, title: d.title, metaDesc, h1Count: d.querySelectorAll('h1').length, h1Top, h1Visible, ctaAboveFold, cookieCover: +cookieCover.toFixed(2), noAlt, imgCount: imgs.length, btnStyles: btnStyles.size, btnCount: btnEls.length, displayH2, h2Count: h2s.length, tiny, kickerCaps, kickers: kickers.length, fonts: [...fonts], overflow, pageHeight: d.body.scrollHeight, words: text.split(/\s+/).length };
    }, { banned: BANNED.map(b => ({ src: b.source, flags: b.flags })), contra: CONTRA.map(c => ({ key: c.key, onlyPath: !!c.onlyPath, re: { src: c.re.source, flags: c.re.flags }, only: c.only ? { src: c.only.source, flags: c.only.flags } : null })) });

    // ── CONTENT lane
    push(path, vp, 'CONTENT', 'no banned claims rendered', m.bannedHits.length ? 'FAIL' : 'OK', m.bannedHits.join(' | '));
    for (const c of CONTRA) {
      const hits = m.contraHits[c.key] || [];
      for (const hit of hits) { const v = c.norm(hit); values[c.key] ??= {}; values[c.key][v] ??= new Set(); values[c.key][v].add(path); }
      if (c.key === 'timpson-attribution' && hits.some(hit => c.norm(hit).includes('UNDATED'))) push(path, vp, 'CONTENT', 'Timpson attribution dated', 'FAIL', 'present-tense minister with no date/source');
      if (c.key === 'countries' && hits.some(hit => c.norm(hit) !== '45')) push(path, vp, 'CONTENT', 'countries = 45', 'FAIL', hits.map(hit => hit[0]).join(' | '));
    }
    if (vp === 'desktop') {
      push(path, vp, 'CONTENT', 'title not bare brand', /^\s*Bamboo Bicycle Club\s*$/.test(m.title) ? 'FAIL' : 'OK', m.title);
      push(path, vp, 'CONTENT', 'meta description length', !m.metaDesc ? 'FAIL' : (m.metaDesc.length < BUDGET.metaDescMin || m.metaDesc.length > BUDGET.metaDescMax) ? 'WARN' : 'OK', `${m.metaDesc.length} chars`);
      push(path, vp, 'CONTENT', 'one h1', m.h1Count === 1 ? 'OK' : 'FAIL', `${m.h1Count} h1`);
    }
    // ── UX lane
    push(path, vp, 'UX', 'no horizontal overflow', m.overflow === 0 ? 'OK' : 'FAIL', `${m.overflow}px`);
    push(path, vp, 'UX', 'images have alt', m.noAlt === 0 ? 'OK' : (m.noAlt > 5 ? 'FAIL' : 'WARN'), `${m.noAlt}/${m.imgCount} missing`);
    if (vp === 'mobile') {
      push(path, vp, 'UX', 'h1 in first viewport (390)', m.h1Visible ? 'OK' : 'WARN', m.h1Top != null ? `h1 at ${Math.round(m.h1Top)}px` : 'no h1');
      push(path, vp, 'UX', 'primary CTA above the fold (390)', m.ctaAboveFold ? 'OK' : 'WARN', `${m.btnCount} buttons on page`);
      push(path, vp, 'UX', 'cookie card viewport cover', m.cookieCover > 0.35 ? 'FAIL' : m.cookieCover > 0.15 ? 'WARN' : 'OK', `${Math.round(m.cookieCover * 100)}% of viewport`);
    }
    push(path, vp, 'UX', 'page weight', bytes > (vp === 'mobile' ? BUDGET.pageBytesMobile : BUDGET.pageBytesDesktop) ? 'FAIL' : 'OK', `${(bytes / 1e6).toFixed(1)} MB, ${m.pageHeight}px tall, ${m.words} words`);
    const biggest = media.sort((a, b) => b.bytes - a.bytes)[0];
    if (vp === 'mobile' && biggest) push(path, vp, 'UX', 'largest media on phone', biggest.bytes > BUDGET.largestMediaMobile ? 'WARN' : 'OK', `${(biggest.bytes / 1e6).toFixed(1)} MB ${biggest.url}`);
    // ── CSS lane
    if (vp === 'desktop') {
      push(path, vp, 'CSS', 'button styles ≤ budget', m.btnStyles > BUDGET.buttonStylesMax ? 'WARN' : 'OK', `${m.btnStyles} distinct styles across ${m.btnCount} buttons`);
      push(path, vp, 'CSS', 'display h2 count ≤ budget', m.displayH2 > BUDGET.displayH2Max ? 'WARN' : 'OK', `${m.displayH2} of ${m.h2Count} h2 at ≥80px`);
      push(path, vp, 'CSS', 'kicker case (lowercase spec)', m.kickers && m.kickerCaps / m.kickers > 0.5 ? 'WARN' : 'OK', `${m.kickerCaps}/${m.kickers} uppercase`);
      push(path, vp, 'CSS', 'no font leaks', m.fonts.every(f => /Atkinson/i.test(f)) ? 'OK' : 'WARN', m.fonts.join(', '));
    }
    push(path, vp, 'CSS', 'text ≥ 12px', m.tiny > BUDGET.tinyTextMax ? 'WARN' : 'OK', `${m.tiny} elements under 12px`);

    await ctx.close();
    await new Promise(r => setTimeout(r, PAUSE_MS));
    process.stdout.write(`· ${path} @${vp}\n`);
  }
}
await browser.close();

// ── Cross-page contradictions
const contradictions = [];
for (const [key, byValue] of Object.entries(values)) {
  const vals = Object.keys(byValue);
  if (vals.length > 1) contradictions.push({ key, values: Object.fromEntries(vals.map(v => [v, [...byValue[v]]])) });
}

// ── Report
const fails = results.filter(r => r.status === 'FAIL'), warns = results.filter(r => r.status === 'WARN');
mkdirSync('qa/reports', { recursive: true });
const out = { date: today, pages: PAGES.length, fails: fails.length, warns: warns.length, contradictions, results };
writeFileSync(`qa/reports/live-check-${today}.json`, JSON.stringify(out, null, 2));
const md = [`# Live check — ${today}`, '', `${PAGES.length} pages · ${VIEWPORTS.length} viewports · **${fails.length} FAIL** · ${warns.length} WARN`, ''];
if (contradictions.length) { md.push('## Contradictions across pages', ''); for (const c of contradictions) { md.push(`- **${c.key}**`); for (const [v, pages] of Object.entries(c.values)) md.push(`  - \`${v}\` on ${pages.join(', ')}`); } md.push(''); }
for (const lane of ['CONTENT', 'UX', 'CSS']) {
  const rows = results.filter(r => r.lane === lane && r.status !== 'OK');
  md.push(`## ${lane} — ${rows.length} findings`, '', '| Page | VP | Check | Status | Detail |', '|---|---|---|---|---|');
  for (const r of rows) md.push(`| ${r.page} | ${r.vp} | ${r.check} | ${r.status} | ${r.detail.replace(/\|/g, '/')} |`);
  md.push('');
}
writeFileSync(`qa/reports/live-check-${today}.md`, md.join('\n'));
console.log(`\n${fails.length} FAIL · ${warns.length} WARN · ${contradictions.length} contradictions → qa/reports/live-check-${today}.md`);
for (const c of contradictions) console.log(`  ⚠ contradiction: ${c.key} → ${Object.keys(c.values).join(' vs ')}`);
for (const f of fails) console.log(`  ✗ ${f.page}@${f.vp} · ${f.check} — ${f.detail}`);
if (flag('--assert') && fails.length) process.exit(1);
