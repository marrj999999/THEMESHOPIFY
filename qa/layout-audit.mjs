// LAYOUT + CSS AUDIT — the things a regression net structurally cannot see.
//
// WHY THIS EXISTS (James, 2026-07-29: "some css is clashing and layouts are not centred or
// even, with the wrong justification — how can you not miss anything")
//
// The visual net compares today against yesterday, so it only ever catches CHANGE. Anything
// that was already wrong is inside the baseline and reads as "48/48 passed" forever. Every
// audit before this one was also hypothesis-driven — I measured what I suspected (boxes,
// contrast, tap targets) and confirmed those, which cannot find what I did not suspect.
//
// So this measures ABSOLUTE properties against a stated contract, not against yesterday:
//
//   A · AXIS      every band's content should start on the same left edge (the 1200 axis).
//                 Bands that sit a few px off are the "not even" complaint.
//   B · JUSTIFY   text-align actually used. `justify` is a defect on the web (rivers, bad
//                 rag, no hyphenation); centred body copy over ~60ch is a readability defect;
//                 and centre/left mixed INSIDE one band is the "wrong justification" look.
//   C · CENTRING  things that claim to be centred but are not — a wrapper with margin:auto
//                 whose left and right gutters differ, which reads as subtly off.
//   D · RHYTHM    band padding + gaps should come from a small set. A long tail of one-off
//                 values is what makes spacing look uneven.
//   E · CLASH     the same declaration arriving from several sheets, and !important density.
//                 17 stylesheets compete here; this finds where they actually collide.
//
// Usage: node qa/layout-audit.mjs [url-path ...]
import { chromium } from 'playwright';
import { writeFileSync, mkdirSync } from 'fs';

// Flags must not be mistaken for page paths. They were: `--assert` became a URL, every page
// errored, and the assertion — which skips errored pages — reported "contract holds" on ZERO
// measurements. A gate that passes when it measured nothing is ESCAPES #1 all over again.
const ARGS = process.argv.slice(2).filter(a => !a.startsWith('--'));
const PAGES = ARGS.length ? ARGS : [
  '/', '/pages/impact', '/pages/workshops', '/pages/schools', '/pages/programmes',
  '/pages/why-bamboo', '/pages/build-to-bond', '/pages/our-story-2', '/collections/all',
  '/products/gravel-frame-build-kit',
];
const BASE = 'https://bamboobicycleclub.org';
const PREVIEW = 'preview_theme_id=196820238710';

function audit() {
  const out = { axis: [], justify: [], centring: [], rhythm: {}, clash: {} };
  const vw = window.innerWidth;
  const R = e => e.getBoundingClientRect();
  const seen = new WeakSet();

  // ── A · AXIS ────────────────────────────────────────────────────────────────────────────
  // The content wrapper inside each band should share one left edge.
  // Only FULL-WIDTH wraps share the axis. A narrow measure (.rd-mw-*) is a centred column on
  // the same centre line, so its left edge is legitimately different — flagging it as "off-axis"
  // reported the contract WORKING as a breach.
  const wraps = [...document.querySelectorAll('.rd-wrap, .bl__wrap, .rd-foot-wrap, main > * > .page-width')]
    .filter(e => {
      const r = R(e);
      if (r.width < 200 || r.height < 40) return false;
      if (/rd-mw-/.test((e.className || '').toString())) return false;
      return true;
    });
  for (const w of wraps) {
    const r = R(w);
    out.axis.push({
      cls: (w.className || '').toString().slice(0, 40),
      left: Math.round(r.left), right: Math.round(vw - r.right), width: Math.round(r.width),
      y: Math.round(r.top + scrollY),
    });
  }

  // ── B · JUSTIFY ─────────────────────────────────────────────────────────────────────────
  const textish = [...document.querySelectorAll('p, h1, h2, h3, h4, li, blockquote, figcaption')]
    .filter(e => {
      if (seen.has(e)) return false;
      const r = R(e);
      if (r.width < 80 || r.height < 10) return false;
      if (e.closest('footer, nav, [class*=drawer], [class*=banner], [class*=cookie], [class*=mega]')) return false;
      return (e.textContent || '').trim().length > 12;
    });
  const bandOf = e => e.closest('section, .rd-band, [class*=rd-pad]') || e.parentElement;
  const byBand = new Map();
  for (const e of textish) {
    const cs = getComputedStyle(e);
    const band = bandOf(e);
    if (!byBand.has(band)) byBand.set(band, { aligns: new Set(), items: [], justify: 0, wideCentre: 0 });
    const rec = byBand.get(band);
    const a = cs.textAlign;
    rec.aligns.add(a);
    if (a === 'justify') { rec.justify++; }
    // centred body copy wider than ~60ch is hard to read
    const ch = parseFloat(cs.fontSize) * 0.5;
    if ((a === 'center') && /^(P|LI)$/.test(e.tagName) && R(e).width / ch > 60) rec.wideCentre++;
    rec.items.push({ tag: e.tagName, align: a, txt: (e.textContent || '').trim().slice(0, 30) });
  }
  for (const [band, rec] of byBand) {
    const aligns = [...rec.aligns];
    const mixed = aligns.filter(a => a !== 'start' && a !== 'left').length > 0 && aligns.length > 1;
    if (rec.justify || rec.wideCentre || mixed) {
      out.justify.push({
        band: (band?.className || '').toString().slice(0, 44) || band?.tagName,
        y: Math.round(R(band).top + scrollY),
        aligns, justifyCount: rec.justify, wideCentredParas: rec.wideCentre,
        mixedInsideOneBand: mixed,
        sample: rec.items.filter(i => i.align !== 'start' && i.align !== 'left').slice(0, 3),
      });
    }
  }

  // ── C · CENTRING ────────────────────────────────────────────────────────────────────────
  // Only elements that are ACTUALLY inset on both sides can be "trying to centre".
  // v1 tested marginLeft === marginRight, which is true for every `margin:0` element — so it
  // flagged flush-left buttons (L=0 R=396) as off-centre. An element flush to one edge is
  // left-aligned, not badly centred. Both gutters must be non-trivial before this means anything.
  for (const e of document.querySelectorAll('*')) {
    const r = R(e), p = e.parentElement && R(e.parentElement);
    if (!p || r.width < 200 || r.height < 40) continue;
    const pcs = getComputedStyle(e.parentElement);
    // A grid/flex child is positioned by its track, not by its margins — two columns sitting
    // side by side are each "off-centre" relative to the parent by design. Only children of a
    // normal block container can meaningfully be margin-centred.
    if (/grid|flex/.test(pcs.display)) continue;
    // Table cells are placed by the table algorithm, not by margins — same false positive.
    if (/^(TABLE|THEAD|TBODY|TFOOT|TR|TH|TD|CAPTION|COLGROUP|COL)$/.test(e.tagName)) continue;
    if (/table/.test(getComputedStyle(e).display)) continue;
    const padL = parseFloat(pcs.paddingLeft) || 0;
    const padR = parseFloat(pcs.paddingRight) || 0;
    const gapL = (r.left - p.left) - padL;
    const gapR = (p.right - r.right) - padR;
    if (gapL < 4 || gapR < 4) continue;              // flush to an edge = not centred, by intent
    if (Math.abs(gapL - gapR) > 2 && Math.abs(gapL - gapR) < 400) {
      out.centring.push({
        cls: (e.className || '').toString().slice(0, 40) || e.tagName,
        y: Math.round(r.top + scrollY), leftGap: Math.round(gapL), rightGap: Math.round(gapR),
        off: Math.round(gapL - gapR),
      });
    }
  }

  // ── D · RHYTHM ──────────────────────────────────────────────────────────────────────────
  const bump = (k, v) => { (out.rhythm[k] ??= {}); out.rhythm[k][v] = (out.rhythm[k][v] || 0) + 1; };
  for (const e of document.querySelectorAll('section, [class*=rd-pad]')) {
    const cs = getComputedStyle(e); const r = R(e);
    if (r.height < 80) continue;
    bump('bandPaddingTop', cs.paddingTop);
    bump('bandPaddingBottom', cs.paddingBottom);
  }
  for (const e of document.querySelectorAll('*')) {
    const cs = getComputedStyle(e);
    if (!/grid|flex/.test(cs.display)) continue;
    if (R(e).width < 200) continue;
    if (cs.gap && cs.gap !== 'normal') bump('gap', cs.gap);
  }
  return out;
}

// ── E · CLASH — done from the CSSOM, not the DOM ──────────────────────────────────────────
function clashAudit() {
  const res = { sheets: [], importantTotal: 0, duplicateSelectors: [], topConflicts: [] };
  const bySel = new Map();
  for (const sheet of document.styleSheets) {
    const name = (sheet.href || 'inline').split('/').pop().split('?')[0];
    let rules;
    try { rules = sheet.cssRules; } catch { res.sheets.push({ sheet: name, rules: 0, important: 0, blocked: true }); continue; }
    let count = 0, imp = 0;
    const stack = [...rules];
    while (stack.length) {
      const rule = stack.pop();
      if (rule.cssRules && rule.cssRules.length) stack.push(...rule.cssRules);   // @media / @supports
      const sel = rule.selectorText;
      if (!sel) continue;
      count++;
      const txt = (rule.style && rule.style.cssText) || '';
      const n = (txt.match(/!important/g) || []).length;
      imp += n; res.importantTotal += n;
      for (const s of sel.split(',')) {
        const k = s.trim();
        if (!bySel.has(k)) bySel.set(k, []);
        bySel.get(k).push(name);
      }
    }
    res.sheets.push({ sheet: name, rules: count, important: imp });
  }
  // the same selector defined in 3+ places, or across 2+ different sheets
  for (const [sel, defs] of bySel) {
    const sheets = new Set(defs);
    if (defs.length >= 3 || sheets.size >= 2) {
      res.duplicateSelectors.push({ sel: sel.slice(0, 70), times: defs.length, sheets: [...sheets] });
    }
  }
  res.duplicateSelectors.sort((a, b) => b.times - a.times);
  res.duplicateSelectors = res.duplicateSelectors.slice(0, 25);
  return res;
}

const browser = await chromium.launch({ channel: 'chrome' });
const report = {};
for (const path of PAGES) {
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 }, reducedMotion: 'reduce' });
  const page = await ctx.newPage();
  try {
    await page.goto(`${BASE}${path}?${PREVIEW}`, { waitUntil: 'load', timeout: 45000 });
    await page.waitForTimeout(1800);
    await page.evaluate(async () => {
      document.querySelectorAll('.rd-reveal').forEach(e => { e.style.opacity = 1; e.style.transform = 'none'; });
      document.querySelector('#shopify-pc__banner')?.remove();
      for (let y = 0; y < document.documentElement.scrollHeight; y += 800) {
        window.scrollTo({ top: y, behavior: 'instant' }); await new Promise(r => setTimeout(r, 60));
      }
      window.scrollTo({ top: 0, behavior: 'instant' }); await new Promise(r => setTimeout(r, 400));
    });
    report[path] = await page.evaluate(audit);
    if (!report.__clash) report.__clash = await page.evaluate(clashAudit);
  } catch (e) { report[path] = { error: String(e).slice(0, 80) }; }
  await ctx.close();
}
await browser.close();

mkdirSync('qa/evidence/2026-07-29', { recursive: true });
writeFileSync('qa/evidence/2026-07-29/layout-audit.json', JSON.stringify(report, null, 2));

// ── report ────────────────────────────────────────────────────────────────────────────────
const pad = (s, n) => String(s ?? '').padEnd(n);
console.log('\n═══ A · AXIS — do all bands start on the same left edge? ═══');
for (const [path, r] of Object.entries(report)) {
  if (path.startsWith('__') || r.error) continue;
  const lefts = {}; r.axis.forEach(a => lefts[a.left] = (lefts[a.left] || 0) + 1);
  const entries = Object.entries(lefts).sort((a, b) => b[1] - a[1]);
  const dominant = entries[0];
  const outliers = r.axis.filter(a => String(a.left) !== dominant?.[0]);
  console.log(`${pad(path, 34)} axis=${dominant?.[0]}px (${dominant?.[1]} bands) · off-axis: ${outliers.length}`);
  outliers.slice(0, 4).forEach(o => console.log(`     y${String(o.y).padStart(5)} left=${o.left} (${o.left - +dominant[0] > 0 ? '+' : ''}${o.left - +dominant[0]}) ${o.cls}`));
}

console.log('\n═══ B · JUSTIFICATION — justify / wide-centred / mixed inside one band ═══');
let jTotal = 0;
for (const [path, r] of Object.entries(report)) {
  if (path.startsWith('__') || r.error) continue;
  if (!r.justify.length) continue;
  jTotal += r.justify.length;
  console.log(`\n${path}`);
  r.justify.slice(0, 6).forEach(j => console.log(
    `   y${String(j.y).padStart(5)} ${pad(j.band, 40)} aligns=[${j.aligns}]` +
    `${j.justifyCount ? ' JUSTIFY×' + j.justifyCount : ''}${j.wideCentredParas ? ' wide-centred×' + j.wideCentredParas : ''}${j.mixedInsideOneBand ? ' MIXED' : ''}`));
}
if (!jTotal) console.log('  none');

console.log('\n═══ C · CENTRING — claims centred, gutters differ ═══');
for (const [path, r] of Object.entries(report)) {
  if (path.startsWith('__') || r.error) continue;
  const bad = r.centring.filter(c => Math.abs(c.off) > 2);
  if (!bad.length) continue;
  console.log(`${pad(path, 34)} ${bad.length} off-centre`);
  bad.slice(0, 4).forEach(c => console.log(`     y${String(c.y).padStart(5)} L=${c.leftGap} R=${c.rightGap} off=${c.off}px  ${c.cls}`));
}

console.log('\n═══ D · RHYTHM — how many distinct spacing values? ═══');
for (const [path, r] of Object.entries(report)) {
  if (path.startsWith('__') || r.error) continue;
  const g = Object.keys(r.rhythm.gap || {}).length;
  const pt = Object.keys(r.rhythm.bandPaddingTop || {}).length;
  console.log(`${pad(path, 34)} distinct gaps=${g}  distinct band padding-top=${pt}`);
}

const c = report.__clash;
if (c) {
  console.log('\n═══ E · CSS CLASH ═══');
  console.log(`  !important declarations across all sheets: ${c.importantTotal}`);
  console.log('  sheets by rule count:');
  c.sheets.sort((a, b) => b.rules - a.rules).slice(0, 8)
    .forEach(s => console.log(`     ${pad(s.sheet, 34)} ${String(s.rules).padStart(5)} rules · ${s.important} !important`));
  console.log('  selectors defined in multiple places (top 12):');
  c.duplicateSelectors.slice(0, 12)
    .forEach(d => console.log(`     ×${String(d.times).padStart(2)} ${pad(d.sel, 52)} ${d.sheets.join(', ')}`));
}
console.log('\n→ qa/evidence/2026-07-29/layout-audit.json');

// ── --assert · the gate mode ──────────────────────────────────────────────────────────────
// Only HARD contract breaches fail a push. `wide-centred` is reported but never fails: it is a
// content decision (that band should not be centred), and qa/ALIGNMENT.md is explicit that CSS
// must not silently half-fix it by flipping one paragraph — that is how a band ends up mixed.
if (process.argv.includes('--assert')) {
  const breaches = [];
  // Proof-of-life: refuse to pass on nothing. If pages failed to load or produced no bands,
  // that is a broken run, not a clean estate.
  const measured = Object.entries(report).filter(([k, v]) => !k.startsWith('__') && !v.error && v.axis?.length);
  if (measured.length < PAGES.length) {
    const bad = Object.entries(report).filter(([k, v]) => !k.startsWith('__') && (v.error || !v.axis?.length));
    console.log(`\n✗ AUDIT DID NOT MEASURE ${bad.length}/${PAGES.length} PAGES — cannot certify anything:`);
    bad.forEach(([k, v]) => console.log(`   ${k}: ${v.error || 'no bands found'}`));
    process.exit(1);
  }
  for (const [path, r] of Object.entries(report)) {
    if (path.startsWith('__') || r.error) continue;
    // axis: every band on one left edge
    const lefts = {}; r.axis.forEach(a => lefts[a.left] = (lefts[a.left] || 0) + 1);
    const dom = Object.entries(lefts).sort((a, b) => b[1] - a[1])[0];
    const offAxis = r.axis.filter(a => String(a.left) !== dom?.[0]);
    if (offAxis.length) breaches.push(`${path}: ${offAxis.length} band(s) off the ${dom[0]}px axis`);
    // justify is never allowed
    const j = r.justify.reduce((a, x) => a + (x.justifyCount || 0), 0);
    if (j) breaches.push(`${path}: ${j} element(s) using text-align:justify`);
    // a box inset on both sides must be inset EQUALLY
    const off = r.centring.filter(c => Math.abs(c.off) > 2);
    if (off.length) breaches.push(`${path}: ${off.length} block(s) inset on both sides but not centred`);
  }
  if (breaches.length) {
    console.log('\n✗ ALIGNMENT CONTRACT BREACHED (qa/ALIGNMENT.md):');
    breaches.forEach(b => console.log('   ' + b));
    process.exit(1);
  }
  console.log('\n✓ alignment contract holds across all pages');
}
