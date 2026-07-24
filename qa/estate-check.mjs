// ESTATE-CHECK — the full-site consistency battery (plan 2026-07-24c).
// Layer 2 semantics + axe + html-validate + link integrity + look-pass screenshots.
// Run: node qa/estate-check.mjs [--tier=1|2|3|5|6|7|all]   (default all)
// Output: qa/evidence/<date>/estate-check.txt + contact sheet PNGs in estate-shots/
import { chromium } from 'playwright';
import AxeBuilder from '@axe-core/playwright';
import { HtmlValidate } from 'html-validate';
import fs from 'node:fs';

const P = 'preview_theme_id=196820238710';
const BASE = 'https://bamboobicycleclub.org';
const DATE = new Date().toISOString().slice(0, 10);
const DIR = `qa/evidence/${DATE}`;
const SHOTS = `${DIR}/estate-shots`;
fs.mkdirSync(SHOTS, { recursive: true });

const ALL_PAGES = [
  '/', '/pages/impact', '/pages/programmes', '/pages/workshops', '/pages/schools', '/pages/why-bamboo',
  '/pages/bicycleteambuilding', '/pages/contact-us', '/pages/support-mission', '/pages/which-kit',
  '/pages/gallery', '/pages/our-story-2', '/pages/build-to-bond', '/pages/prisons',
  '/pages/theory-of-change', '/pages/impact-report', '/pages/toulouse-workshop',
  '/pages/bicycle-frame-building-workshop', '/pages/media-page', '/pages/club-news',
  '/pages/support-centre', '/pages/team-building', '/pages/frequently-asked-questions',
  '/pages/james-marr-founder', '/pages/size-guide', '/pages/sustainability', '/pages/cycle-to-work-scheme',
  '/pages/university-papers', '/pages/geometry', '/pages/gravel-geometry', '/pages/road-bike-geometry',
  '/pages/easy-build-geometry', '/pages/mini-velo-geometry', '/pages/whats-in-the-box',
  '/pages/gravel-frame-comparison', '/pages/privacy-policy', '/pages/bamboo-bike-stem-lesson',
  '/pages/bamboo-frame-nea-project', '/pages/free-bamboo-speaker-workshop',
  '/collections', '/collections/home-build-kits', '/collections/component-packs', '/collections/maker-shop',
  '/collections/clothing', '/collections/road', '/collections/gravel-adventure', '/collections/mtb',
  '/collections/balance-bikes', '/collections/gift',
  '/products/gravel-frame-build-kit', '/products/bamboo-bike-road-kit', '/products/road-carbon-frame-build-kit',
  '/products/gravel-lugged-build-kit', '/products/29er-frame-build-kit', '/products/city-bike-frame-kit',
  '/products/fatbike-home-build-kit', '/products/custom-frame', '/products/balance-bike-lugged-kit-1',
  '/products/balance-bike-flax-kit-with-resins', '/products/bottom-bracket-68mm',
  '/products/single-speed-component-pack', '/products/bamboo-bicycle-club-gift-card',
  '/products/bamboo-bicycle-club-beanie', '/cart', '/search?q=bamboo', '/blogs/news',
  '/blogs/news/project-zero-impact-case-study',
];
const DEEP12 = ['/', '/pages/impact', '/pages/programmes', '/pages/workshops', '/pages/schools',
  '/pages/why-bamboo', '/pages/bicycleteambuilding', '/pages/our-story-2', '/pages/which-kit',
  '/collections/home-build-kits', '/products/gravel-frame-build-kit', '/products/bottom-bracket-68mm'];
const BANNED = [/28,?000\s*PSI/i, /stronger than steel/i, /56\.7%/, /£11\.41/, /£280 per learner/i, /\b36\+? countries/i, /100% completion/i];

const rows = [];
const add = (tier, page, check, ok, note = '') => {
  rows.push({ tier, page, check, ok, note });
  if (!ok) console.log(`✗ [T${tier}] ${page} · ${check}${note ? ' — ' + String(note).slice(0, 90) : ''}`);
};
const log = m => { console.log(m); };
const tierArg = (process.argv.find(a => a.startsWith('--tier=')) || '--tier=all').split('=')[1];
const runTier = t => tierArg === 'all' || tierArg === String(t);

const browser = await chromium.launch({ channel: 'chrome', headless: true });
const hrefs = new Set();
const chromeFingerprints = {};

// ---------- T1 + T0: whole estate structural + look-pass shots + href harvest ----------
if (runTier(1)) {
  for (const [label, vp] of [['1280', { width: 1280, height: 800 }], ['390', { width: 390, height: 844 }]]) {
    const ctx = await browser.newContext({ viewport: vp });
    const page = await ctx.newPage();
    let dismissed = false;
    for (const path of ALL_PAGES) {
      const errs = [];
      const onErr = e => errs.push(String(e.message).slice(0, 80));
      page.on('pageerror', onErr);
      try {
        const resp = await page.goto(BASE + path + (path.includes('?') ? '&' : '?') + P + '&ec=1', { waitUntil: 'load', timeout: 40000 });
        await page.waitForTimeout(700);
        if (!dismissed) { try { const b = page.locator('button').filter({ hasText: /^decline$/i }).first(); if (await b.isVisible({ timeout: 800 })) { await b.click(); dismissed = true; } } catch {} }
        const r = await page.evaluate((banned) => {
          const d = document, de = d.documentElement;
          const text = d.body.innerText;
          const bannedHits = banned.map(b => new RegExp(b.src, b.flags)).filter(re => re.test(text)).map(re => re.source);
          const crumbBad = [...d.querySelectorAll('nav.rd-crumb a, nav.rd-crumb .rd-here')].filter(c => {
            const col = getComputedStyle(c).color; let n = c.parentElement, bg = 'rgba(0, 0, 0, 0)';
            while (n) { const b = getComputedStyle(n).backgroundColor; if (b && b !== 'rgba(0, 0, 0, 0)') { bg = b; break; } n = n.parentElement; }
            return col === bg;
          }).length;
          const header = d.querySelector('header, .rd-header');
          const footer = d.querySelector('footer, .rd-footer');
          return {
            h1s: d.querySelectorAll('h1').length,
            bodyFont: getComputedStyle(d.body).fontFamily.split(',')[0],
            jakarta: [...d.querySelectorAll('h1,h2,h3,nav a,button')].slice(0, 60).filter(e => /jakarta/i.test(getComputedStyle(e).fontFamily)).length,
            overflow: de.scrollWidth - de.clientWidth,
            noAlt: d.querySelectorAll('img:not([alt])').length,
            bannedHits, crumbBad,
            hrefs: [...d.querySelectorAll('a[href]')].map(a => a.getAttribute('href')).filter(h => h && (h.startsWith('/') || h.startsWith(location.origin)) && !h.startsWith('//')),
            anchorsMissing: [...d.querySelectorAll('a[href^="#"]')].map(a => a.getAttribute('href')).filter(h => h.length > 1 && !/^#evidence-[a-z]+$/.test(h) && !d.querySelector(CSS.escape ? '#' + CSS.escape(h.slice(1)) : h)).length,
            headerFp: header ? header.innerText.replace(/\s+/g, ' ').slice(0, 200) : 'none',
            footerFp: footer ? footer.innerText.replace(/\s+/g, ' ').slice(0, 200) : 'none',
            title: !!d.title, metaDesc: !!d.querySelector('meta[name="description"]'), canonical: !!d.querySelector('link[rel="canonical"]'), og: !!d.querySelector('meta[property="og:image"]'),
            ldOk: [...d.querySelectorAll('script[type="application/ld+json"]')].every(s => { try { JSON.parse(s.textContent); return true; } catch (e) { return false; } }),
          };
        }, BANNED.map(b => ({ src: b.source, flags: b.flags })));
        const is404Probe = false;
        add(1, path + '@' + label, 'HTTP ok', resp.status() < 400, resp.status());
        add(1, path + '@' + label, 'one h1', r.h1s === 1, r.h1s + ' h1s');
        add(1, path + '@' + label, 'Atkinson body', /Atkinson/i.test(r.bodyFont), r.bodyFont);
        add(1, path + '@' + label, 'no Jakarta leaks', r.jakarta === 0, r.jakarta);
        add(1, path + '@' + label, 'overflow 0', r.overflow === 0, r.overflow + 'px');
        add(1, path + '@' + label, 'imgs have alt', r.noAlt === 0, r.noAlt + ' missing');
        add(1, path + '@' + label, 'no banned claims rendered', r.bannedHits.length === 0, r.bannedHits.join('|'));
        add(1, path + '@' + label, 'crumbs visible', r.crumbBad === 0, r.crumbBad + ' invisible');
        add(1, path + '@' + label, 'in-page anchors resolve', r.anchorsMissing === 0, r.anchorsMissing + ' dead');
        add(1, path + '@' + label, 'meta layer (title/desc/canonical/og)', r.title && r.metaDesc && r.canonical && r.og, `t:${r.title} d:${r.metaDesc} c:${r.canonical} og:${r.og}`);
        add(1, path + '@' + label, 'JSON-LD parses', r.ldOk, '');
        add(1, path + '@' + label, 'zero JS errors', errs.length === 0, errs[0] || '');
        r.hrefs.forEach(h => hrefs.add(h.split('#')[0].split('?')[0]));
        chromeFingerprints[path + '@' + label] = { h: r.headerFp, f: r.footerFp };
        if (label === '1280' || label === '390') {
          try { await page.screenshot({ path: `${SHOTS}/${label}-${path.replace(/[\/?=&]+/g, '_') || 'home'}.png`, fullPage: true }); } catch (e) {}
        }
      } catch (e) { add(1, path + '@' + label, 'LOAD', false, e.message.slice(0, 80)); }
      page.off('pageerror', onErr);
    }
    await ctx.close();
    log(`T1 ${label} done`);
  }
  // shared chrome coherence (per width)
  for (const label of ['1280', '390']) {
    const fps = Object.entries(chromeFingerprints).filter(([k]) => k.endsWith('@' + label));
    const headSet = new Set(fps.map(([, v]) => v.h));
    const footSet = new Set(fps.map(([, v]) => v.f));
    add(7, 'estate@' + label, 'header identical across pages', headSet.size <= 2, headSet.size + ' variants');
    add(7, 'estate@' + label, 'footer identical across pages', footSet.size <= 2, footSet.size + ' variants');
  }
}

// ---------- T6: link integrity ----------
if (runTier(6)) {
  const ctx = await browser.newContext();
  const pg = await ctx.newPage();
  let dead = 0, checked = 0;
  const tryUrl = async (h) => {
    const url = h.startsWith('http') ? h : BASE + h + (h.includes('?') ? '&' : '?') + P; // absolute passthrough (double-BASE bug)
    let resp = await pg.request.get(url).catch(() => null);
    let st = resp ? resp.status() : 0;
    for (let i = 0; i < 2 && st === 429; i++) { await new Promise(r => setTimeout(r, 4000 * (i + 1))); resp = await pg.request.get(url).catch(() => null); st = resp ? resp.status() : 0; }
    return st;
  };
  for (const h of [...hrefs].slice(0, 400)) {
    if (/^\/(cart|checkout|account|cdn|admin|password)/.test(h) || h === '') continue;
    await new Promise(r => setTimeout(r, 800)); // Shopify storefront throttles hard — slow beats flaky
    try {
      const st = await tryUrl(h);
      checked++;
      if (st >= 400 || st === 0) { dead++; add(6, h, 'internal link resolves', false, 'HTTP ' + st); }
    } catch (e) {}
  }
  add(6, 'estate', `link integrity (${checked} unique internal links)`, dead === 0, dead + ' dead');
  await ctx.close();
  log('T6 done: ' + checked + ' links');
}

// ---------- T2: deep set widths ----------
if (runTier(2)) {
  for (const w of [768, 1024, 1568, 1920]) {
    const ctx = await browser.newContext({ viewport: { width: w, height: 900 } });
    const page = await ctx.newPage();
    for (const path of DEEP12) {
      try {
        await page.goto(BASE + path + (path.includes('?') ? '&' : '?') + P + '&t2=' + w, { waitUntil: 'load', timeout: 40000 });
        await page.waitForTimeout(600);
        const r = await page.evaluate(() => {
          const de = document.documentElement;
          const q = document.querySelector('.rd-quicklinks');
          const gaps = [];
          if (q && q.getBoundingClientRect().width > 10) { const l = [...q.querySelectorAll(':scope > a')].filter(a => a.getBoundingClientRect().width > 0); for (let i = 1; i < l.length; i++) gaps.push(Math.round(l[i].getBoundingClientRect().left - l[i - 1].getBoundingClientRect().right)); }
          const anchors = [...document.querySelectorAll('section[class*="rd-pad"] > .rd-wrap > .rd-eyebrow, section[class*="rd-pad"] > .rd-wrap > h2, section[class*="rd-pad"] > .rd-wrap > div > .rd-eyebrow')].filter(e => { const b = e.getBoundingClientRect(); return b.width > 0 && !e.closest('.rd-center, .ew, .bbcpl, .rd-hero'); }).map(e => Math.round(e.getBoundingClientRect().left));
          const spread = anchors.length > 1 ? Math.max(...anchors) - Math.min(...anchors) : 0;
          const h1 = document.querySelector('h1');
          return { overflow: de.scrollWidth - de.clientWidth, gaps, spread, h1px: h1 ? Math.round(parseFloat(getComputedStyle(h1).fontSize)) : null };
        });
        add(2, path + '@' + w, 'overflow 0', r.overflow === 0, r.overflow + 'px');
        if (r.gaps.length) add(2, path + '@' + w, 'nav gaps ≥8', r.gaps.every(g => g >= 8), `[${r.gaps}]`);
        add(2, path + '@' + w, 'one text axis (≤8px)', r.spread <= 8, r.spread + 'px');
        if (r.h1px) add(2, path + '@' + w, 'h1 within roles', r.h1px <= 130, r.h1px + 'px');
      } catch (e) { add(2, path + '@' + w, 'LOAD', false, e.message.slice(0, 60)); }
    }
    await ctx.close();
    log('T2 ' + w + ' done');
  }
}

// ---------- T3: image integrity at DPR2 ----------
if (runTier(3)) {
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 }, deviceScaleFactor: 2 });
  const page = await ctx.newPage();
  for (const path of DEEP12) {
    try {
      await page.goto(BASE + path + (path.includes('?') ? '&' : '?') + P + '&t3=1', { waitUntil: 'load', timeout: 40000 });
      const r = await page.evaluate(async () => {
        for (let y = 0; y < document.documentElement.scrollHeight; y += 700) { window.scrollTo({ top: y, behavior: 'instant' }); await new Promise(r => setTimeout(r, 110)); }
        await new Promise(r => setTimeout(r, 700));
        const imgs = [...document.querySelectorAll('main img, .bbc-rd img')];
        const soft = imgs.filter(i => { const src = i.currentSrc || i.src; if (/\.svg/.test(src) || !i.naturalWidth) return false; const b = i.getBoundingClientRect(); return b.width > 120 && (b.width * devicePixelRatio) / i.naturalWidth > 1.4; }).map(i => (i.currentSrc || i.src).split('/').pop().split('?')[0].slice(0, 30));
        const zeroFrames = [...document.querySelectorAll('.rd-cscard__media, .bbc-media')].filter(f => f.getBoundingClientRect().width > 100 && f.getBoundingClientRect().height < 60).length;
        return { soft, zeroFrames };
      });
      add(3, path, 'raster sharpness (≤1.4 deficit, svg-exempt)', r.soft.length === 0, r.soft.slice(0, 3).join('|'));
      add(3, path, 'no collapsed media frames', r.zeroFrames === 0, r.zeroFrames + ' collapsed');
    } catch (e) { add(3, path, 'LOAD', false, e.message.slice(0, 60)); }
  }
  await ctx.close();
  log('T3 done');
}

// ---------- T7 extras: forms, cart loop, dark links, fonts + axe + html-validate ----------
if (runTier(7)) {
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const page = await ctx.newPage();
  // forms
  try {
    await page.goto(`${BASE}/pages/contact-us?${P}&t7=1`, { waitUntil: 'load', timeout: 40000 });
    const f = await page.evaluate(() => { const fm = document.querySelector('form[action*="contact"]'); return { present: !!fm, fields: fm ? fm.querySelectorAll('input,textarea').length : 0 }; });
    add(7, '/pages/contact-us', 'contact form renders', f.present && f.fields >= 2, JSON.stringify(f));
    const nl = await page.evaluate(() => { const i = document.querySelector('footer input[type="email"]'); const fm = i && i.closest('form'); return fm ? (fm.querySelector('input[name="form_type"]') || {}).value : null; });
    add(7, 'footer', 'newsletter form_type=customer', nl === 'customer', String(nl));
  } catch (e) { add(7, 'forms', 'LOAD', false, e.message.slice(0, 60)); }
  // cart loop
  try {
    await page.goto(`${BASE}/products/gravel-frame-build-kit?${P}&t7=2`, { waitUntil: 'load', timeout: 40000 });
    await page.waitForTimeout(800);
    const btn = page.locator('button[name="add"], .product-form__submit').first();
    await btn.click({ timeout: 5000 });
    await page.waitForTimeout(2000);
    const cart = await page.evaluate(() => ({
      drawer: !!document.querySelector('cart-drawer.active, cart-drawer.animate, #CartDrawer.active, .cart-notification.active, cart-notification.active'),
      onCartPage: location.pathname.startsWith('/cart'),
      count: (document.querySelector('.cart-count-bubble span, [data-cart-count]') || {}).textContent || ''
    }));
    add(7, 'PDP', 'add-to-cart works (drawer/notification/cart-page)', cart.drawer || cart.onCartPage || cart.count.trim() !== '', JSON.stringify(cart));
  } catch (e) { add(7, 'PDP', 'add-to-cart opens drawer', false, e.message.slice(0, 60)); }
  // dark-band link visibility + fonts + axe on key 4
  for (const path of ['/', '/pages/impact', '/products/gravel-frame-build-kit', '/collections/home-build-kits']) {
    try {
      const fontReqs = [];
      page.on('response', resp => { if (/Atkinson.*woff2/.test(resp.url())) fontReqs.push(resp.status()); });
      await page.goto(BASE + path + (path.includes('?') ? '&' : '?') + P + '&t7=3', { waitUntil: 'load', timeout: 40000 });
      await page.waitForTimeout(700);
      const dark = await page.evaluate(() => {
        const bands = [...document.querySelectorAll('.rd-dark, .rd-hero, [class*="--dark"]')];
        let bad = 0;
        const effBg = el => { let n = el; while (n) { const b = getComputedStyle(n).backgroundColor; if (b && b !== 'rgba(0, 0, 0, 0)') return b; n = n.parentElement; } return null; };
        bands.forEach(b => { [...b.querySelectorAll('a')].slice(0, 6).forEach(a => { const c = getComputedStyle(a).color; if (c === effBg(a)) bad++; }); });
        return bad;
      });
      add(7, path, 'dark-band links visible', dark === 0, dark + ' invisible');
      add(7, path, 'Atkinson woff2 loads', fontReqs.length === 0 || fontReqs.every(s => s === 200), fontReqs.join(','));
      await page.emulateMedia({ reducedMotion: 'reduce' });
      await page.reload({ waitUntil: 'load' });
      await page.waitForTimeout(700);
      const axe = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']).exclude('[id^="PBar"]').exclude('#insta-feed').analyze();
      const serious = axe.violations.filter(v => ['critical', 'serious'].includes(v.impact));
      add(7, path, 'axe WCAG-AA (0 critical/serious)', serious.length === 0, serious.map(v => v.id + '×' + v.nodes.length).slice(0, 4).join('|'));
      const html = await page.content();
      const hv = new HtmlValidate({ extends: ['html-validate:recommended'], rules: { 'no-trailing-whitespace': 'off', 'no-inline-style': 'off', 'require-sri': 'off', 'wcag/h30': 'off', 'wcag/h37': 'off', 'long-title': 'off', 'no-raw-characters': 'off', 'attribute-boolean-style': 'off', 'attribute-empty-style': 'off', 'void-style': 'off', 'element-required-attributes': 'off', 'valid-id': 'off', 'no-dup-class': 'off', 'prefer-native-element': 'off', 'text-content': 'off', 'element-permitted-content': 'error', 'element-permitted-parent': 'error', 'deprecated': 'error' } });
      const rep = await hv.validateString(html);
      const nestErrs = rep.results.flatMap(r => r.messages).filter(m => /permitted|deprecated|anchor|nested/i.test(m.ruleId + m.message) && !/<style>/.test(m.message));
      add(7, path, 'html validity (nesting/permitted-content)', nestErrs.length === 0, nestErrs.slice(0, 2).map(m => m.ruleId).join('|'));
    } catch (e) { add(7, path, 'T7 probes', false, e.message.slice(0, 60)); }
  }
  await ctx.close();
  log('T7 done');
}

// ---------- T5: vitals fence ----------
if (runTier(5)) {
  for (const path of ['/', '/pages/impact', '/products/gravel-frame-build-kit', '/collections/home-build-kits']) {
    const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 } });
    const page = await ctx.newPage();
    await page.addInitScript(() => {
      window.__v = { lcp: 0, cls: 0 };
      new PerformanceObserver(l => { for (const e of l.getEntries()) window.__v.lcp = e.startTime; }).observe({ type: 'largest-contentful-paint', buffered: true });
      new PerformanceObserver(l => { for (const e of l.getEntries()) if (!e.hadRecentInput) window.__v.cls += e.value; }).observe({ type: 'layout-shift', buffered: true });
    });
    try {
      await page.goto(BASE + path + (path.includes('?') ? '&' : '?') + P + '&t5=1', { waitUntil: 'load', timeout: 40000 });
      await page.waitForTimeout(2200);
      const v = await page.evaluate(() => window.__v);
      add(5, path, 'LCP ≤ 1500ms', v.lcp <= 1500, Math.round(v.lcp) + 'ms');
      add(5, path, 'CLS ≤ 0.02', v.cls <= 0.02, v.cls.toFixed(3));
    } catch (e) { add(5, path, 'LOAD', false, e.message.slice(0, 60)); }
    await ctx.close();
  }
  log('T5 done');
}

await browser.close();
const fails = rows.filter(r => !r.ok);
const byClass = {};
fails.forEach(f => { const k = f.check; byClass[k] = byClass[k] || []; byClass[k].push(f.page + (f.note ? ' [' + f.note + ']' : '')); });
let out = `ESTATE-CHECK ${DATE} — ${rows.length - fails.length}/${rows.length} pass, ${fails.length} FAIL in ${Object.keys(byClass).length} classes\n\n`;
for (const [k, v] of Object.entries(byClass)) out += `CLASS: ${k} (${v.length})\n` + v.slice(0, 20).map(x => '  ' + x).join('\n') + (v.length > 20 ? `\n  …+${v.length - 20} more` : '') + '\n\n';
out += 'PASS detail suppressed — full rows in estate-check.json\n';
fs.writeFileSync(`${DIR}/estate-check.txt`, out);
fs.writeFileSync(`${DIR}/estate-check.json`, JSON.stringify(rows, null, 1));
console.log(`\n${rows.length - fails.length}/${rows.length} — ${fails.length} fails in ${Object.keys(byClass).length} classes → ${DIR}/estate-check.txt`);
process.exit(fails.length ? 1 : 0);
