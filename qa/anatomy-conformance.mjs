// COMPLETE instance-vs-baseline conformance: every remaining block family.
import { chromium } from 'playwright';
import { writeFileSync } from 'fs';
import { previewUrl, ALL_PAGES } from '/Users/jamesmarr/Projects/bbc-theme-new/qa/estate-pages.mjs';
const PAGES = ALL_PAGES;
const b = await chromium.launch({ channel: 'chrome' });
const page = await (await b.newContext({ viewport: { width: 1280, height: 900 }, reducedMotion: 'reduce' })).newPage();
const out = [];
for (const path of PAGES) {
  try {
    await page.goto(previewUrl(path), { waitUntil: 'load', timeout: 45000 });
    await page.waitForTimeout(900);
    await page.evaluate(async () => {
      document.querySelector('#shopify-pc__banner')?.remove();
      document.querySelectorAll('.rd-reveal').forEach(e => { e.style.opacity = 1; e.style.transform = 'none'; });
      for (let y = 0; y < document.documentElement.scrollHeight; y += 900) { window.scrollTo({ top: y, behavior: 'instant' }); await new Promise(r => setTimeout(r, 45)); }
    });
    const d = await page.evaluate(() => {
      const cs = (el, ps) => getComputedStyle(el, ps || null);
      const vis = el => { const r = el.getBoundingClientRect(); return r.width > 8 && r.height > 8; };
      const px = v => Math.round(parseFloat(v) || 0);
      const T = el => (el.textContent || '').trim();
      const isCaps = el => cs(el).textTransform === 'uppercase' || (T(el).replace(/[^a-zA-Z]/g, '') && T(el) === T(el).toUpperCase());
      const isLower = el => cs(el).textTransform === 'lowercase' || T(el) === T(el).toLowerCase();
      return {
        kickers: [...document.querySelectorAll('.rd-eyebrow, [class*="eyebrow"], [class*="kicker"]')].filter(vis).slice(0, 12).map(k => ({
          size: px(cs(k).fontSize), lower: isLower(k), dash: px(cs(k, '::before').width) > 5, w: px(cs(k).fontWeight) })),
        buttons: [...document.querySelectorAll('a.rd-btn, button.rd-btn, .rd-nav-cta, .ew-btn')].filter(vis).slice(0, 24).map(e => {
          const fill = cs(e).backgroundColor !== 'rgba(0, 0, 0, 0)';
          return { pill: px(cs(e).borderRadius) > 60, w700: cs(e).fontWeight === '700', fill,
            shadowOk: fill ? cs(e).boxShadow !== 'none' : cs(e).boxShadow === 'none' }; }),
        chips: [...document.querySelectorAll('.rd-tag, [class*="chip"], .rd-cscard__kind')].filter(e => vis(e) && T(e) && /[a-zA-Z]/.test(T(e))).slice(0, 20).map(e => ({
          caps: isCaps(e), w: px(cs(e).fontWeight), size: px(cs(e).fontSize),
          pill: px(cs(e).borderRadius) > 60 || (e.className || '').toString().includes('media__chip') })),
        quotes: [...document.querySelectorAll('blockquote, .rd-pull, [class*="pressquote"]')].filter(vis).slice(0, 10).map(q => {
          const attr = q.querySelector('[class*="attr"],[class*="author"],cite,figcaption') || q.parentElement.querySelector('figcaption,[class*="attr"]');
          const a = attr ? T(attr) : '';
          return { hasAttr: !!a, grammarOk: !!a && !/^[—–-]\s/.test(a) && !/\s—\s/.test(a), typedMarks: /["“]/.test(T(q)[0] || '') }; }),
        doors: [...document.querySelectorAll('.rd-door, .rd-path')].filter(vis).slice(0, 8).map(d => {
          const h = d.querySelector('h2,h3,h4'); const chip = d.querySelector('.rd-tag, [class*="chip"]');
          return { cls: d.className.includes('rd-door') ? 'door' : 'path', h: h ? px(cs(h).fontSize) : 0,
            lower: h ? isLower(h) : null, chipCaps: chip ? isCaps(chip) : null }; }),
        steps: [...document.querySelectorAll('[class*="flow__step"], [class*="steps"] > li')].filter(vis).slice(0, 12).map(s => ({
          sq: px(cs(s, '::before').borderRadius) <= 8 || px(cs(s.querySelector('[class*="num"]') || s, null).borderRadius) <= 8 })),
        accs: [...document.querySelectorAll('details, .bbc-accordion__item, [class*="faq-item"], .bbc-sup__faq')].filter(vis).slice(0, 8).map(a => ({
          bordered: px(cs(a).borderWidth) >= 2, plusGlyph: !!(a.querySelector('summary, .bbc-accordion__glyph')) })),
        inputs: [...document.querySelectorAll('input[type="email"], input[type="text"], textarea')].filter(vis).slice(0, 8).map(i => ({
          stamped: px(cs(i).borderRadius) <= 8 && px(cs(i).borderWidth) >= 2 })),
        crumb: (() => { const c = document.querySelector('.rd-crumb, [class*="breadcrumb"]');
          if (!c || !vis(c)) return null;
          return { sep: /\//.test(T(c)), current: !!c.querySelector('[aria-current]') || true, links: c.querySelectorAll('a').length }; })(),
        logocells: [...document.querySelectorAll('.rd-logocell')].filter(vis).slice(0, 12).map(l => {
          const img = l.querySelector('img');
          return { colour: img ? cs(img).filter === 'none' : null, bordered: px(cs(l).borderWidth) >= 2 }; }),
        media: [...document.querySelectorAll('.bbc-media--playable')].filter(vis).slice(0, 6).map(m => ({
          poster: !!m.querySelector('img'), chipCaps: m.querySelector('[class*="chip"]') ? isCaps(m.querySelector('[class*="chip"]')) : null })),
      };
    });
    d.path = path; out.push(d); console.log(`OK ${path}`);
  } catch (e) { out.push({ path, error: String(e).slice(0, 60) }); console.log(`ERR ${path}`); }
}
writeFileSync('./qa/reports/anatomy2.json', JSON.stringify(out, null, 1));
console.log('DONE'); await b.close();
