(() => {
  const vw = document.documentElement.clientWidth;
  const out = { url: location.pathname, vw, issues: [] };
  const de = document.documentElement;
  if (de.scrollWidth > vw + 4) out.issues.push({ t: 'H-OVERFLOW', by: de.scrollWidth - vw });
  const skip = el => el.closest('[class*="marquee"], [class*="slider"], [class*="carousel"], .rd-loop, [aria-hidden="true"]');
  const seen = new Set();
  for (const el of document.querySelectorAll('body *')) {
    if (!(el.offsetWidth || el.offsetHeight)) continue;
    const r = el.getBoundingClientRect();
    if (r.width < 24 || r.height < 8) continue;
    if ((r.right > vw + 8 || r.left < -8) && !skip(el)) {
      let p = el.parentElement, dup = false;
      while (p) { if (seen.has(p)) { dup = true; break; } p = p.parentElement; }
      if (!dup) {
        seen.add(el);
        const cls = typeof el.className === 'string' && el.className ? '.' + el.className.trim().split(/\s+/).slice(0, 2).join('.') : '';
        out.issues.push({ t: 'OFFSCREEN', sel: el.tagName.toLowerCase() + cls, l: Math.round(r.left), rgt: Math.round(r.right), vw });
      }
    }
  }
  for (const im of document.images) {
    if (im.complete && im.naturalWidth === 0 && im.offsetWidth > 0) out.issues.push({ t: 'BROKEN-IMG', src: im.src.split('/').pop().split('?')[0] });
    else if (im.naturalWidth > 0 && im.offsetWidth > 40 && im.offsetHeight > 40) {
      const nr = im.naturalWidth / im.naturalHeight, rr = im.offsetWidth / im.offsetHeight;
      if (getComputedStyle(im).objectFit === 'fill' && Math.abs(nr - rr) / nr > 0.25)
        out.issues.push({ t: 'SQUASHED-IMG', src: im.src.split('/').pop().split('?')[0], natural: nr.toFixed(2), rendered: rr.toFixed(2) });
    }
  }
  document.querySelectorAll('main section, main .shopify-section').forEach(s => {
    const r = s.getBoundingClientRect();
    if (r.height > 0 && r.height < 8 && s.textContent.trim().length > 20) out.issues.push({ t: 'COLLAPSED', cls: (s.className || '').slice(0, 50) });
  });
  out.n = out.issues.length;
  out.issues = out.issues.slice(0, 10);
  return JSON.stringify(out);
})()
