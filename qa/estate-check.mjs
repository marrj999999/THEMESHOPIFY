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
// FORMULA §1 type-role conformance (B1). Ships observational so the first run inventories the
// real drift instead of blocking every push on day one; flip with TYPE_ROLES_BLOCKING=1 once the
// queue is drained. Findings land in qa/evidence/<date>/type-drift.txt either way.
const TYPE_ROLES_BLOCKING = process.env.TYPE_ROLES_BLOCKING === '1';
const typeDrift = [];
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
// Imported, not duplicated (2026-07-24). Two hand-maintained lists drift — that drift is exactly
// how "nationally recognised" sat live on two draft pages under two green gates. See
// qa/banned-claims.mjs for the reasoning and qa/canary.mjs for the behavioural sync assertion.
import { BANNED } from './banned-claims.mjs';

// NAMED WAIVERS — real findings owned outside the theme; reported as WAIVED, not FAIL.
const WAIVERS = [
  { check: /raster sharpness/, reason: 'asset-ceiling: source files smaller than srcset ceilings — James image picks (11 files + product photos)' },
  { check: /banned claims/, page: /frequently-asked-questions|project-zero-impact-case-study/, reason: 'store content: FAQ admin body + article — James list' },
  { check: /one h1/, page: /support-centre|size-guide|privacy-policy/, reason: 'admin body h1s (semantics now demoted at render; body itself is James\'s)' },
];
const rows = [];
const add = (tier, page, check, ok, note = '') => {
  if (!ok) {
    const w = WAIVERS.find(w => w.check.test(check) && (!w.page || w.page.test(page)));
    if (w) { rows.push({ tier, page, check, ok: 'waived', note: note + ' — WAIVED: ' + w.reason.slice(0, 60) }); return; }
  }
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
            // B3 cross-cutting sweeps (2026-07-24) — tracker rows that per-page work keeps missing.
            // Logo SVGs without a viewBox render as floating ~300px boxes (known recurring defect).
            logoNoViewBox: [...d.querySelectorAll('.rd-logocell svg, .rd-logowall svg, .bbc-press svg')]
              .filter(s => !s.getAttribute('viewBox')).length,
            // Contact address canon: info@ / james@ only. bamboobicycleclub@gmail.com is the
            // read/login account and must never appear as a public contact route.
            gmailLeak: (d.body.innerText.match(/bamboobicycleclub@gmail\.com/gi) || []).length,
            // FORMULA §1 — "ONE size per role, no exceptions" (B1, 2026-07-24).
            // Measured per breakpoint because the scale is clamp()-based and therefore
            // viewport-dependent BY DESIGN: comparing sizes across widths would be meaningless.
            // Roles are keyed on band-grammar classes where they exist, so a card h3 and a
            // pathway h3 (different roles in FORMULA §1) are not wrongly conflated.
            // Sizes rounded to 0.5px — sub-pixel rounding is not a design defect.
            typeRoles: (() => {
              const round = v => Math.round(parseFloat(v) * 2) / 2;
              // Third-party UI we neither own nor style must not be measured against OUR contract.
              // Shopify's consent banner renders an <h2>"Cookie consent" at 21.5px, which alone
              // produced 22 of 69 first-run findings — a gate that reports someone else's markup
              // as our defect is a gate people stop reading (see ESCAPES #10).
              const THIRD_PARTY = '#shopify-pc__banner, .shopify-pc__banner, #insta-feed, [id^="PBar"], .shopify-payment-button';
              const painted = e => {
                if (e.closest(THIRD_PARTY)) return false;
                if (e.checkVisibility && !e.checkVisibility({ checkVisibilityCSS: true, checkOpacity: false })) return false;
                const r = e.getBoundingClientRect();
                return r.height > 4 && r.width > 20 && getComputedStyle(e).visibility === 'visible';
              };
              const roles = {
                display: 'h1.ew-h1, .rd-hero h1, h1',
                h2: '.bbc-rd h2, h2',
                'card-title': '.rd-cscard h3, .rd-card h3',
                lede: '.rd-lede',
                eyebrow: '.rd-eyebrow',
                label: '.rd-lbl',
                button: '.rd-btn, .rd-cta',
              };
              const out = {};
              for (const [role, sel] of Object.entries(roles)) {
                const sizes = [...new Set([...d.querySelectorAll(sel)].filter(painted)
                  .map(e => round(getComputedStyle(e).fontSize)))].sort((a, b) => a - b);
                if (sizes.length) out[role] = sizes;
              }
              return out;
            })(),
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
        add(1, path + '@' + label, 'logo SVGs have viewBox', r.logoNoViewBox === 0, r.logoNoViewBox + ' missing');
        add(1, path + '@' + label, 'no gmail contact leak', r.gmailLeak === 0, r.gmailLeak + ' found');
        // FORMULA §1 conformance. NON-BLOCKING while the inventory is triaged with James
        // (TYPE_ROLES_BLOCKING=1 to enforce) — a check that instantly blocks every push is a
        // check people learn to route around. The inventory it produces IS the work queue.
        {
          // Named exception, not a silent pass: ROLLOUT-TRACKER Tier 3 is explicitly
          // "commerce: type/buttons pass, KEEP DENSITY". Forcing a related-products strip
          // heading to the 94.5px band-h2 would dominate a PDP and work against the page's job.
          // Scoped to product/collection/cart URLs and to h2 only — everything else still asserts.
          const commerceDensity = /^\/(products|collections|cart)/.test(path);
          const offenders = Object.entries(r.typeRoles || {})
            .filter(([role]) => !(commerceDensity && role === 'h2'))
            .filter(([, sizes]) => sizes.length > 1);
          const detail = offenders.map(([role, s]) => `${role}:${s.join('/')}`).join(' ');
          const ok = offenders.length === 0;
          if (TYPE_ROLES_BLOCKING) add(1, path + '@' + label, 'FORMULA §1 one size per role', ok, detail);
          else if (!ok) typeDrift.push(`${path}@${label} · ${detail}`);
        }
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
    // Retry on 503 as well as 429 (2026-07-24). Shopify sheds load with 503, not just 429, when the
    // crawl runs alongside other traffic — a run today reported ~dozens of "dead" links that all
    // returned 200 on a direct fetch seconds later. False positives are worse than a slow gate:
    // they train you to skim past FAIL lines. 3 attempts with a longer backoff.
    for (let i = 0; i < 3 && (st === 429 || st === 503 || st === 0); i++) {
      await new Promise(r => setTimeout(r, 5000 * (i + 1)));
      resp = await pg.request.get(url).catch(() => null);
      st = resp ? resp.status() : 0;
    }
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
  // dark-band link visibility + fonts + axe.
  // WIDENED 2026-07-24 (B3): was 4 pages of 72 — so 68 pages, including contact, cart, search,
  // 404 and every geometry page, had NEVER been accessibility-tested. For a CIC delivering
  // education and prison programmes that is a UX and compliance exposure, and axe was already
  // wired: it only needed the loop opening up. AXE_PAGES=key4 restores the fast set when
  // iterating on something else.
  const A11Y_PAGES = process.env.AXE_PAGES === 'key4'
    ? ['/', '/pages/impact', '/products/gravel-frame-build-kit', '/collections/home-build-kits']
    : ALL_PAGES;
  for (const path of A11Y_PAGES) {
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
  // WIDENED 2026-07-24 (B3): was 4 paths at desktop only. Mobile is where the users are and where
  // the numbers are worse, so the fence now runs at 390 as well as 1280 across the deep set —
  // a desktop-only performance gate measures the easy case.
  const VITALS_PAGES = ['/', '/pages/impact', '/pages/programmes', '/pages/workshops', '/pages/schools',
    '/pages/why-bamboo', '/products/gravel-frame-build-kit', '/collections/home-build-kits'];
  for (const [path, vw] of VITALS_PAGES.flatMap(p => [[p, 1280], [p, 390]])) {
    const ctx = await browser.newContext({ viewport: { width: vw, height: vw === 390 ? 844 : 800 } });
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
      // Mobile gets a realistic budget: the same 1500ms fence at 390 would fail on physics,
      // not on defects, and a gate that always fails is one people switch off.
      const lcpFence = vw === 390 ? 2500 : 1500;
      add(5, `${path}@${vw}`, `LCP ≤ ${lcpFence}ms`, v.lcp <= lcpFence, Math.round(v.lcp) + 'ms');
      add(5, `${path}@${vw}`, 'CLS ≤ 0.02', v.cls <= 0.02, v.cls.toFixed(3));
    } catch (e) { add(5, `${path}@${vw}`, 'LOAD', false, e.message.slice(0, 60)); }
    await ctx.close();
  }
  log('T5 done');
}

await browser.close();
const fails = rows.filter(r => r.ok === false);
const waived = rows.filter(r => r.ok === 'waived');
const byClass = {};
fails.forEach(f => { const k = f.check; byClass[k] = byClass[k] || []; byClass[k].push(f.page + (f.note ? ' [' + f.note + ']' : '')); });
let out = `ESTATE-CHECK ${DATE} — ${rows.length - fails.length - waived.length}/${rows.length} pass, ${fails.length} FAIL in ${Object.keys(byClass).length} classes, ${waived.length} WAIVED\n\n`;
if (waived.length) { out += 'WAIVED (named, owned):\n' + waived.map(w => `  ${w.page} · ${w.check} [${w.note.slice(0, 110)}]`).join('\n') + '\n\n'; }
for (const [k, v] of Object.entries(byClass)) out += `CLASS: ${k} (${v.length})\n` + v.slice(0, 20).map(x => '  ' + x).join('\n') + (v.length > 20 ? `\n  …+${v.length - 20} more` : '') + '\n\n';
out += 'PASS detail suppressed — full rows in estate-check.json\n';
fs.writeFileSync(`${DIR}/estate-check.txt`, out);
fs.writeFileSync(`${DIR}/estate-check.json`, JSON.stringify(rows, null, 1));

// FORMULA §1 inventory — the consistency work queue, written even when non-blocking.
if (typeDrift.length) {
  const header = `FORMULA §1 — ONE SIZE PER ROLE · ${DATE}\n` +
    `${typeDrift.length} page/width combinations render more than one size for a role.\n` +
    `Observational (set TYPE_ROLES_BLOCKING=1 to enforce). Measured per breakpoint because the\n` +
    `scale is clamp()-based; comparing across widths would be meaningless.\n\n`;
  fs.writeFileSync(`${DIR}/type-drift.txt`, header + typeDrift.join('\n') + '\n');
  console.log(`\nFORMULA §1: ${typeDrift.length} role-drift findings → ${DIR}/type-drift.txt (observational)`);
}
console.log(`\n${rows.length - fails.length}/${rows.length} — ${fails.length} fails in ${Object.keys(byClass).length} classes → ${DIR}/estate-check.txt`);
process.exit(fails.length ? 1 : 0);
