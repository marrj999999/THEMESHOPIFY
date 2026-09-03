// BAND-LEVEL extractor: the colour-grammar + rhythm audit the section census couldn't do.
// Walks each page's full-width coloured bands (inside monolith sections too), recording
// surface, padding, heading scale, eyebrow + reveal presence — for grammar checks.
import { chromium } from 'playwright';
import { writeFileSync } from 'fs';
import { previewUrl } from '/Users/jamesmarr/Projects/bbc-theme-new/qa/estate-pages.mjs';

const PAGES = ['/', '/pages/impact', '/pages/programmes', '/pages/workshops', '/pages/schools',
  '/pages/why-bamboo', '/pages/bicycleteambuilding', '/pages/contact-us', '/pages/support-mission',
  '/pages/which-kit', '/pages/gallery', '/pages/our-story-2', '/pages/build-to-bond', '/pages/prisons',
  '/pages/theory-of-change', '/pages/impact-report', '/pages/media-page', '/pages/team-building',
  '/pages/frequently-asked-questions', '/pages/toulouse-workshop', '/pages/bicycle-frame-building-workshop',
  '/collections/home-build-kits', '/collections/road', '/products/gravel-frame-build-kit',
  '/products/balance-bike-flax-kit-with-resins', '/products/bottom-bracket-68mm', '/blogs/news', '/cart'];

const OUT = './qa/reports/bands.json';
const b = await chromium.launch({ channel: 'chrome' });
const page = await (await b.newContext({ viewport: { width: 1280, height: 900 }, reducedMotion: 'reduce' })).newPage();
const results = [];

for (const path of PAGES) {
  try {
    await page.goto(previewUrl(path), { waitUntil: 'load', timeout: 45000 });
    await page.waitForTimeout(1000);
    await page.evaluate(async () => {
      document.querySelector('#shopify-pc__banner')?.remove();
      document.querySelectorAll('.rd-reveal').forEach(e => { e.style.opacity = 1; e.style.transform = 'none'; });
      for (let y = 0; y < document.documentElement.scrollHeight; y += 700) {
        window.scrollTo({ top: y, behavior: 'instant' }); await new Promise(r => setTimeout(r, 60));
      }
      window.scrollTo({ top: 0, behavior: 'instant' });
    });
    const bands = await page.evaluate(() => {
      const cs = el => getComputedStyle(el);
      const hex = c => { const m = c.match(/[\d.]+/g); if (!m || (m[3] !== undefined && parseFloat(m[3]) === 0)) return null;
        return '#' + m.slice(0, 3).map(n => Math.round(+n).toString(16).padStart(2, '0')).join('').toUpperCase(); };
      const out = []; const taken = [];
      const main = document.querySelector('main') || document.body;
      const walk = el => {
        for (const ch of el.children) {
          if (['SCRIPT','STYLE','TEMPLATE','NOSCRIPT'].includes(ch.tagName)) continue;
          const r = ch.getBoundingClientRect();
          const absTop = r.top + scrollY;
          if (r.height < 160 || r.width < innerWidth * 0.86) { walk(ch); continue; }
          const bg = hex(cs(ch).backgroundColor);
          if (!bg) { walk(ch); continue; }
          if (r.height > 2600) { walk(ch); continue; } /* page-wrapper, not a band */
          if (taken.some(t => absTop >= t[0] - 4 && absTop + r.height <= t[1] + 4)) continue;
          taken.push([absTop, absTop + r.height]);
          const h = ch.querySelector('h1,h2,h3');
          const eyebrow = ch.querySelector('.rd-eyebrow, [class*="eyebrow"], [class*="kicker"]');
          out.push({
            top: Math.round(absTop), h: Math.round(r.height), bg,
            pt: Math.round(parseFloat(cs(ch).paddingTop)), pb: Math.round(parseFloat(cs(ch).paddingBottom)),
            head: h ? (h.textContent || '').replace(/\s+/g, ' ').trim().slice(0, 40) : '',
            hsize: h ? Math.round(parseFloat(cs(h).fontSize)) : 0,
            eyebrow: !!eyebrow, reveal: !!ch.querySelector('.rd-reveal'),
            cls: (ch.className || '').toString().split(/\s+/).slice(0, 2).join(' ').slice(0, 40),
          });
        }
      };
      walk(main);
      out.sort((a, b) => a.top - b.top);
      return out;
    });
    results.push({ path, bands });
    console.log(`OK ${path}: ${bands.length} bands`);
  } catch (e) { results.push({ path, error: String(e).slice(0, 100) }); console.log(`ERR ${path}`); }
}
writeFileSync(OUT, JSON.stringify(results, null, 1));
console.log(`DONE -> ${OUT}`);
await b.close();
