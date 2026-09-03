/* BBC layout-metrics engine v2 — structural layout verification (2026-07-06).
   Measures what the old lint missed: whitespace holes, grid imbalance, padding
   rhythm, line lengths, centered walls of text, tiny text, upscaled images.
   Run inside a page (or same-origin iframe). Returns ONLY violations. */
function bbcLayoutMetrics(doc, vw) {
  const out = [];
  const main = doc.querySelector('main') || doc.body;
  const vis = el => { const r = el.getBoundingClientRect(); return r.width > 30 && r.height > 10; };
  // 1. WHITESPACE HOLES: big vertical gaps between consecutive rendered blocks
  const blocks = [...main.querySelectorAll('section, .shopify-section > *')].filter(vis)
    .map(el => ({ el, r: el.getBoundingClientRect() })).sort((a, b) => a.r.top - b.r.top);
  for (let i = 1; i < blocks.length; i++) {
    const gap = blocks[i].r.top - blocks[i-1].r.bottom;
    if (gap > 260) out.push({ t: 'HOLE', px: Math.round(gap), after: (blocks[i-1].el.className || '').slice(0, 40) });
  }
  // 2. GRID IMBALANCE: sibling card heights wildly different
  for (const g of main.querySelectorAll('*')) {
    if (getComputedStyle(g).display !== 'grid') continue;
    const kids = [...g.children].filter(vis).map(k => k.getBoundingClientRect().height);
    if (kids.length >= 3) {
      const mx = Math.max(...kids), mn = Math.min(...kids);
      if (mn > 40 && mx / mn > 2.2) out.push({ t: 'GRID-IMBALANCE', ratio: +(mx/mn).toFixed(1), cls: (g.className || '').slice(0, 40) });
    }
  }
  // 3. LINE LENGTH: body text over ~90ch
  for (const p of main.querySelectorAll('p')) {
    if (!vis(p)) continue;
    const cs = getComputedStyle(p), fs = parseFloat(cs.fontSize);
    const ch = p.clientWidth / (fs * 0.5);
    if (ch > 95 && p.textContent.trim().length > 120) out.push({ t: 'LONG-LINES', ch: Math.round(ch), txt: p.textContent.trim().slice(0, 50) });
  }
  // 4. CENTERED WALL: centered text running 4+ lines
  for (const p of main.querySelectorAll('p, .rd-lede')) {
    if (!vis(p)) continue;
    const cs = getComputedStyle(p);
    if (cs.textAlign === 'center') {
      const lines = p.getBoundingClientRect().height / (parseFloat(cs.lineHeight) || parseFloat(cs.fontSize) * 1.4);
      if (lines > 3.6 && p.textContent.trim().length > 180) out.push({ t: 'CENTERED-WALL', lines: Math.round(lines), txt: p.textContent.trim().slice(0, 50) });
    }
  }
  // 5. TINY TEXT
  for (const el of main.querySelectorAll('p, span, li, cite, a')) {
    if (!vis(el) || el.children.length) continue;
    const fs = parseFloat(getComputedStyle(el).fontSize);
    if (fs < 13 && el.textContent.trim().length > 12) { out.push({ t: 'TINY-TEXT', px: fs, txt: el.textContent.trim().slice(0, 40) }); if (out.filter(o=>o.t==='TINY-TEXT').length > 3) break; }
  }
  // 6. UPSCALED IMAGES (blurry)
  for (const im of main.querySelectorAll('img')) {
    if (!vis(im) || !im.naturalWidth) continue;
    const scale = im.clientWidth * (doc.defaultView.devicePixelRatio || 1) / im.naturalWidth;
    if (scale > 1.7 && im.clientWidth > 200) out.push({ t: 'UPSCALED-IMG', x: +scale.toFixed(1), src: im.src.split('/').pop().split('?')[0].slice(0, 40) });
  }
  // 7. PADDING RHYTHM: section vertical paddings that are outliers
  const pads = blocks.map(b => Math.round(parseFloat(getComputedStyle(b.el).paddingTop))).filter(x => x > 0);
  const common = {}; pads.forEach(x => common[x] = (common[x] || 0) + 1);
  return { vw, h: Math.round(doc.documentElement.scrollHeight), n: out.length, issues: out.slice(0, 14), padProfile: common };
}
