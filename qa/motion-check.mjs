// MOTION-CHECK — the standing feedback loop for the motion system (qa/MOTION.md).
// Run: node qa/motion-check.mjs   (from repo root; uses system Chrome via playwright)
// Two contexts (normal + reduced-motion) over key pages; writes evidence table.
import { chromium } from 'playwright';
import fs from 'node:fs';

const PREVIEW = 'preview_theme_id=196820238710';
const PAGES = [
  ['home', `https://bamboobicycleclub.org/?${PREVIEW}&mc=1`],
  ['impact', `https://bamboobicycleclub.org/pages/impact?${PREVIEW}&mc=1`],
  ['pdp', `https://bamboobicycleclub.org/products/gravel-frame-build-kit?${PREVIEW}&mc=1`],
  ['collection', `https://bamboobicycleclub.org/collections/home-build-kits?${PREVIEW}&mc=1`],
];
const rows = [];
const add = (page, check, ok, note = '') => { rows.push({ page, check, ok, note }); console.log(`${ok ? '✓' : '✗'} ${page} · ${check}${note ? ' — ' + note : ''}`); };

const browser = await chromium.launch({ channel: 'chrome', headless: true });

// ---------- T2: mechanical no-support fallback guard (static parse) ----------
{
  const page = await (await browser.newContext()).newPage();
  await page.goto(PAGES[1][1], { waitUntil: 'domcontentloaded', timeout: 30000 });
  const bad = await page.evaluate(() => {
    const offenders = [];
    const scan = (rules, sheetName, inSupports) => {
      for (const r of rules) {
        if (r.type === CSSRule.SUPPORTS_RULE) { scan(r.cssRules, sheetName, /animation-timeline/.test(r.conditionText) || inSupports); continue; }
        if (r.type === CSSRule.MEDIA_RULE) { scan(r.cssRules, sheetName, inSupports); continue; }
        if (r.type !== CSSRule.STYLE_RULE) continue;
        if (inSupports) continue;
        const sel = r.selectorText || '';
        if (!/\.rd-|\.bbc-/.test(sel)) continue;
        const st = r.style;
        if (st.opacity === '0' && !/hover|focus|\[hidden\]|__probe|drop|menu|mega|bars|back-to-top|aria-expanded|dialog|modal|tooltip|overlay|drawer|popover|\[open\]/.test(sel)) offenders.push(sheetName + ' :: ' + sel.slice(0, 70));
      }
    };
    for (const sh of document.styleSheets) {
      const name = (sh.href || 'inline').split('/').pop().split('?')[0];
      if (!/bbc-|statement|redesign|universal/.test(name) && name !== 'inline') continue;
      try { scan(sh.cssRules, name, false); } catch (e) {}
    }
    return offenders;
  });
  add('estate', 'no opacity:0 initial state outside @supports (Firefox-blank guard)', bad.length === 0, bad.slice(0, 3).join(' | '));
  await page.context().close();
}

// ---------- Context 1: normal motion ----------
for (const [label, url] of PAGES) {
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const page = await ctx.newPage();
  const errs = [];
  page.on('pageerror', e => errs.push(String(e.message).slice(0, 80)));
  try {
    await page.goto(url, { waitUntil: 'load', timeout: 40000 });
    await page.waitForTimeout(900);

    // 1. synthetic probe drives (guards the overflow-clip fix)
    const probe = await page.evaluate(async () => {
      const st = document.createElement('style');
      st.textContent = '@keyframes __t{from{opacity:.13}to{opacity:1}} .__probe{animation:__t both;animation-timeline:view();animation-range:entry 0% entry 50%;}';
      document.head.appendChild(st);
      const d = document.createElement('div');
      d.className = '__probe';
      /* display:block !important — the theme hides stray body-end divs, which made every
         previous probe silently display:none (discovered 2026-07-24); mount inside main */
      d.style.cssText = 'display:block !important; height:40px; margin-top:280vh;';
      (document.querySelector('main') || document.body).appendChild(d);
      await new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)));
      await new Promise(r => setTimeout(r, 200));
      if (getComputedStyle(d).display === 'none' || !d.getAnimations().length) { const v = 'probe-not-rendered(' + getComputedStyle(d).display + ',' + d.getAnimations().length + ')'; d.remove(); st.remove(); return v; }
      const op = getComputedStyle(d).opacity; d.remove(); st.remove();
      return op;
    });
    add(label, 'view() timeline drives (synthetic probe holds from-state)', Math.abs(parseFloat(probe) - 0.13) < 0.05, `opacity=${probe}`);

    // 2. real reveals: below-fold entry state → animate in
    const reveal = await page.evaluate(async () => {
      window.scrollTo({ top: 0, behavior: 'instant' });
      await new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)));
      await new Promise(r => setTimeout(r, 400));
      const below = [...document.querySelectorAll('.rd-reveal')].filter(el => el.getBoundingClientRect().top > innerHeight + 150);
      if (!below.length) return { skip: true };
      /* poll the pre-state: fresh contexts can attach timelines a beat late — a working
         reveal reaches its from-state within 2s; a broken one never does */
      let pre = 1;
      for (let i = 0; i < 10; i++) {
        pre = parseFloat(getComputedStyle(below[0]).opacity);
        if (pre < 0.95) break;
        await new Promise(r => setTimeout(r, 200));
      }
      const a = below[0].getAnimations()[0];
      const state = a ? (a.timeline ? a.timeline.constructor.name : 'no-timeline') + '/' + a.effect.getComputedTiming().progress : 'no-anim';
      below[0].scrollIntoView({ behavior: 'instant', block: 'center' });
      await new Promise(r => setTimeout(r, 800));
      return { pre, post: parseFloat(getComputedStyle(below[0]).opacity), state };
    });
    if (reveal.skip) add(label, 'reveal entry→in', true, 'no below-fold reveals (skip)');
    else add(label, 'reveal entry→in', reveal.pre < 0.95 && reveal.post > 0.95, `pre=${reveal.pre} post=${reveal.post} [${reveal.state}]`);

    // 3. stagger children (where present)
    const stag = await page.evaluate(async () => {
      const host = document.querySelector('.rd-stagger > *, .rd-cscard__outs li');
      if (!host) return { skip: true };
      window.scrollTo({ top: 0, behavior: 'instant' });
      await new Promise(r => setTimeout(r, 300));
      const el = document.querySelector('.rd-stagger > *') || document.querySelector('.rd-cscard__outs li');
      const off = el.getBoundingClientRect().top > innerHeight ? parseFloat(getComputedStyle(el).opacity) : null;
      el.scrollIntoView({ behavior: 'instant', block: 'center' });
      await new Promise(r => setTimeout(r, 700));
      return { off, on: parseFloat(getComputedStyle(el).opacity) };
    });
    if (stag.skip) add(label, 'stagger', true, 'none on page (skip)');
    else add(label, 'stagger entry→in', (stag.off === null || stag.off < 0.5) && stag.on > 0.95, `pre=${stag.off} post=${stag.on}`);

    // 4. marquees running + pausable
    const mq = await page.evaluate(() => {
      const track = document.querySelector('.bbc-press__track, .rd-qtrack');
      if (!track) return { skip: true };
      const running = getComputedStyle(track).animationPlayState;
      const btn = document.querySelector('.bbc-press__pause, .rd-qpause, [aria-label*="ause"]');
      return { running, pausable: !!btn };
    });
    if (mq.skip) add(label, 'marquee', true, 'none (skip)');
    else add(label, 'marquee running + pausable', mq.running === 'running' && mq.pausable, JSON.stringify(mq));

    // 5. overflow + errors + jank
    const tail = await page.evaluate(async () => {
      let longtasks = 0;
      try { new PerformanceObserver(l => { longtasks += l.getEntries().length; }).observe({ type: 'longtask' }); } catch (e) {}
      const h = document.documentElement.scrollHeight;
      for (let y = 0; y < h; y += 600) { window.scrollTo({ top: y, behavior: 'instant' }); await new Promise(r => setTimeout(r, 40)); }
      await new Promise(r => setTimeout(r, 300));
      return { overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth, longtasks };
    });
    add(label, 'overflow-x 0 @1280', tail.overflow === 0, `${tail.overflow}px`);
    add(label, 'scroll jank (longtasks ≤ 6)', tail.longtasks <= 6, `${tail.longtasks}`);
    add(label, 'zero JS errors', errs.length === 0, errs[0] || '');

    // mobile overflow
    await page.setViewportSize({ width: 390, height: 844 });
    await page.waitForTimeout(400);
    const m = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    add(label, 'overflow-x 0 @390', m === 0, `${m}px`);
  } catch (e) { add(label, 'LOAD', false, e.message.slice(0, 80)); }
  await ctx.close();
}

// ---------- Context 2: reduced motion ----------
for (const [label, url] of PAGES.slice(0, 2)) {
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 }, reducedMotion: 'reduce' });
  const page = await ctx.newPage();
  try {
    await page.goto(url, { waitUntil: 'load', timeout: 40000 });
    await page.waitForTimeout(900);
    const rm = await page.evaluate(() => {
      const bad = [];
      document.querySelectorAll('.rd-reveal, .rd-stagger > *, .rd-cscard__outs li, .bbc-wordmark a, .rd-duotone > img').forEach(el => {
        const cs = getComputedStyle(el);
        if (cs.animationName !== 'none' && parseFloat(cs.animationDuration) > 0 && cs.animationPlayState !== 'paused') bad.push(el.className.toString().slice(0, 30) + '→' + cs.animationName);
        if (parseFloat(cs.opacity) < 0.99) bad.push(el.className.toString().slice(0, 30) + '→opacity ' + cs.opacity);
      });
      const track = document.querySelector('.bbc-press__track, .rd-qtrack');
      if (track && getComputedStyle(track).animationName !== 'none') bad.push('marquee animating under reduce');
      return bad;
    });
    add(label + ' [reduce]', 'fully inert + fully visible', rm.length === 0, rm.slice(0, 3).join(' | '));
  } catch (e) { add(label + ' [reduce]', 'LOAD', false, e.message.slice(0, 80)); }
  await ctx.close();
}

await browser.close();
const pass = rows.filter(r => r.ok).length;
const table = rows.map(r => `${r.ok ? 'PASS' : 'FAIL'}  ${r.page.padEnd(20)} ${r.check}${r.note ? '  [' + r.note + ']' : ''}`).join('\n');
const out = `MOTION-CHECK ${new Date().toISOString().slice(0, 10)} — ${pass}/${rows.length} pass\n${table}\n`;
const dir = `qa/evidence/${new Date().toISOString().slice(0, 10)}`;
fs.mkdirSync(dir, { recursive: true });
fs.writeFileSync(`${dir}/motion-check.txt`, out);
console.log(`\n${pass}/${rows.length} → ${dir}/motion-check.txt`);
process.exit(pass === rows.length ? 0 : 1);
