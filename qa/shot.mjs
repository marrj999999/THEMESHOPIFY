// SCREENSHOT HELPER — viewport captures, never element captures, for tall regions.
//
// 2026-08-01: a working mosaic layout was reverted because element screenshots of a tall grid
// showed its first-row images as blank forest. The images were fine — loaded, complete, opacity
// 1, correctly positioned. Playwright's locator.screenshot() on an element taller than the
// viewport does not reliably paint lazy-loaded images outside the captured strip, and awaiting
// img.decode() does not fix it because decode does not force paint for off-screen content.
//
// The instrument was wrong and the page was right. This wraps the pattern that does work:
// scroll the region to the top of a tall viewport, let lazy images settle, capture the VIEWPORT.
//
// Usage: node qa/shot.mjs <path> <selector> <out.png> [width] [height]
import { chromium } from 'playwright';
import { previewUrl } from './estate-pages.mjs';

const [path, sel, out, w = 1280, h = 1400] = process.argv.slice(2);
if (!path || !sel || !out) { console.log('usage: node qa/shot.mjs <path> <selector> <out.png> [w] [h]'); process.exit(1); }

const b = await chromium.launch({ channel: 'chrome' });
const p = await (await b.newContext({ viewport: { width: +w, height: +h }, reducedMotion: 'reduce' })).newPage();
await p.goto(previewUrl(path), { waitUntil: 'load', timeout: 60000 });
await p.waitForTimeout(2500);
await p.evaluate(async () => {
  document.querySelector('#shopify-pc__banner')?.remove();
  document.querySelectorAll('.rd-reveal').forEach(e => { e.style.opacity = 1; e.style.transform = 'none'; });
  for (let y = 0; y < document.documentElement.scrollHeight; y += 400) {
    window.scrollTo({ top: y, behavior: 'instant' }); await new Promise(r => setTimeout(r, 130));
  }
});
const found = await p.evaluate(s => { const el = document.querySelector(s); if (!el) return null;
  el.scrollIntoView({ block: 'start', behavior: 'instant' }); return true; }, sel);
if (!found) { console.log('✗ selector not found:', sel); await b.close(); process.exit(1); }
await p.waitForTimeout(2500);
const stat = await p.evaluate(s => { const imgs = [...document.querySelectorAll(s + ' img')];
  return `${imgs.length} imgs · ${imgs.filter(i => !i.complete || i.naturalWidth === 0).length} broken`; }, sel);
await p.screenshot({ path: out });
console.log(`${out} · ${stat}`);
await b.close();
