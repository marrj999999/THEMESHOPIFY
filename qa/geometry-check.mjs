// GEOMETRY CHECK — images + text alignment, estate-wide, both widths.
// Born 2026-08-10 from James: "what about non-stat css issues — images, text
// alignment". Same doctrine as LAW 6b: geometry defects must be MACHINE-caught,
// not eyeball-dependent. Detects:
//   IMG-DISTORT   rendered aspect vs intrinsic aspect off >3% (fill-stretched)
//   IMG-BROKEN    complete but naturalWidth 0 (404/bad src)
//   IMG-COLLAPSED visible <img> rendering under 8px tall/wide (lazy/layout fail)
//   IMG-OVERFLOW  image box exceeding its parent box by >2px (spill)
//   TEXT-CLIP     scrollWidth > clientWidth+2 on a leaf text block (cut text)
//   AXIS-RAG      left edges of text blocks in one section spread 2..10px
//                 (same intended axis, drifted) — >24px = deliberate indent, ok
//   ROW-RAG       same-row children of a grid/cards row with tops off by >5px
// Run: npm run check:geometry   → qa/reports/geometry.json + console summary
import { chromium } from 'playwright';
import { writeFileSync, mkdirSync } from 'fs';
import { previewUrl, ALL_PAGES } from './estate-pages.mjs';

const WIDTHS = [390, 768, 1280]; // 768 added 2026-08-10 — the 10-PDP pill clip lived ONLY at tablet width
const browser = await chromium.launch();
const report = [];

for (const width of WIDTHS) {
  const page = await browser.newPage({ viewport: { width, height: width < 500 ? 844 : 900 } });
  for (const path of ALL_PAGES) {
    try {
      await page.goto(previewUrl(path), { waitUntil: 'load', timeout: 45000 });
      await page.addStyleTag({ content: '#shopify-pc__banner,.shopify-pc__banner__dialog{display:none!important}' });
      await page.evaluate(async () => {
        for (let y = 0; y < document.body.scrollHeight; y += 800) { scrollTo(0, y); await new Promise(r => setTimeout(r, 55)); }
        scrollTo(0, 0); await new Promise(r => setTimeout(r, 350));
      });
      const found = await page.evaluate(() => {
        const out = [];
        const vis = (el) => { const r = el.getBoundingClientRect(); const s = getComputedStyle(el); return r.width > 0 && r.height > 0 && s.display !== 'none' && s.visibility !== 'hidden'; };
        const tag = (el) => (el.className || el.tagName).toString().split(' ').slice(0, 2).join('.').slice(0, 40);

        // ---- images ----
        for (const img of document.images) {
          if (!vis(img)) continue;
          const r = img.getBoundingClientRect();
          if (img.complete && img.naturalWidth === 0) { out.push({ k: 'IMG-BROKEN', el: tag(img), src: (img.currentSrc || img.src).split('/').pop().slice(0, 40) }); continue; }
          if (r.width < 8 || r.height < 8) { out.push({ k: 'IMG-COLLAPSED', el: tag(img), w: Math.round(r.width), h: Math.round(r.height) }); continue; }
          const s = getComputedStyle(img);
          if (img.naturalWidth > 0 && s.objectFit === 'fill' && !img.closest('svg')) {
            const ir = img.naturalWidth / img.naturalHeight, rr = r.width / r.height;
            const dev = Math.abs(ir - rr) / ir;
            if (dev > 0.03 && Math.abs(r.height - (r.width / ir)) > 3) out.push({ k: 'IMG-DISTORT', el: tag(img), dev: +(dev * 100).toFixed(1), src: (img.currentSrc || img.src).split('/').pop().split('?')[0].slice(0, 36) });
          }
          const p = img.parentElement; const pr = p.getBoundingClientRect();
          if (getComputedStyle(p).overflow === 'visible' && (r.right - pr.right > 2 || pr.left - r.left > 2)) {
            out.push({ k: 'IMG-OVERFLOW', el: tag(img), by: Math.round(Math.max(r.right - pr.right, pr.left - r.left)) });
          }
        }

        // ---- clipped text ----
        const textSel = 'h1,h2,h3,h4,p,li,span,a,figcaption,cite,dt,dd';
        const a11yHidden = (el) => !!el.closest('.skip-to-content-link,.visually-hidden,[class*="sr-only"],[class*="__sr"]');
        for (const el of document.querySelectorAll(textSel)) {
          if (!vis(el) || el.children.length > 0 || a11yHidden(el)) continue;
          if (!(el.textContent || '').trim()) continue;
          const s = getComputedStyle(el);
          if (s.overflowX === 'visible' || s.textOverflow === 'ellipsis') continue; // ellipsis = designed
          if (el.scrollWidth > el.clientWidth + 2 && el.clientWidth > 0 && (s.overflowX === 'hidden' || s.overflowX === 'clip')) {
            out.push({ k: 'TEXT-CLIP', el: tag(el), text: el.textContent.trim().slice(0, 34), by: el.scrollWidth - el.clientWidth });
          }
        }

        // ---- axis rag: per section, left edges of block texts ----
        for (const sec of document.querySelectorAll('section, .shopify-section > div')) {
          if (!vis(sec)) continue;
          const blocks = [...sec.querySelectorAll(':scope h1, :scope h2, :scope h3, :scope p, :scope .rd-lede, :scope [class*="eyebrow"]')]
            .filter(vis).filter((el) => getComputedStyle(el).textAlign !== 'center')
            .filter((el) => !el.closest('[class*="card"],[class*="door"],[class*="accordion"],details,li,figure,blockquote,table'));
          if (blocks.length < 2) continue;
          const lefts = blocks.map((el) => Math.round(el.getBoundingClientRect().left));
          const min = Math.min(...lefts), max = Math.max(...lefts);
          const spread = max - min;
          if (spread >= 2 && spread <= 10) {
            const off = blocks.filter((el) => Math.round(el.getBoundingClientRect().left) !== min).slice(0, 2).map(tag);
            out.push({ k: 'AXIS-RAG', el: tag(sec), spread, off });
          }
        }

        // ---- pills/CTAs exceeding their parent box ----
        for (const btn of document.querySelectorAll('[class*="btn"], .rd-cta')) {
          if (!vis(btn)) continue;
          const r = btn.getBoundingClientRect(); const p = btn.parentElement.getBoundingClientRect();
          if (p.width > 40 && r.right - p.right > 3) out.push({ k: 'PILL-CLIP', el: tag(btn), by: Math.round(r.right - p.right), text: (btn.textContent || '').trim().slice(0, 28) });
        }

        // ---- row rag in grids/card rows ----
        for (const grid of document.querySelectorAll('.rd-grid, .acc-cards, [class*="grid"]:not(table)')) {
          if (!vis(grid)) continue;
          const kids = [...grid.children].filter(vis);
          if (kids.length < 2) continue;
          const rows = {};
          kids.forEach((k) => { const t = k.getBoundingClientRect().top; const key = Math.round(t / 40); (rows[key] = rows[key] || []).push(t); });
          for (const tops of Object.values(rows)) {
            if (tops.length < 2) continue;
            const d = Math.max(...tops) - Math.min(...tops);
            if (d > 5 && d < 40) out.push({ k: 'ROW-RAG', el: tag(grid), by: Math.round(d) });
          }
        }
        return out;
      });
      if (found.length) report.push({ page: path, width, issues: found });
      process.stdout.write(found.length ? `✗ ${path} @${width} — ${found.length}\n` : '');
    } catch (e) {
      report.push({ page: path, width, error: String(e).slice(0, 120) });
    }
  }
  await page.close();
}
await browser.close();

mkdirSync('qa/reports', { recursive: true });
writeFileSync('qa/reports/geometry.json', JSON.stringify(report, null, 1));
const tally = {};
report.forEach((p) => (p.issues || []).forEach((i) => (tally[i.k] = (tally[i.k] || 0) + 1)));
console.log('\n=== GEOMETRY SUMMARY ===');
console.log(JSON.stringify(tally));
console.log(`pages with findings: ${report.filter((p) => p.issues?.length).length} → qa/reports/geometry.json`);
