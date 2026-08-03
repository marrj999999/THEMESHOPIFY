// FORMULA CONFORMANCE — how far is every page from /pages/impact?
//
// FORMULA.md: "Impact page is the proving ground; every other page inherits this verbatim."
// QA-LOG 2026-07-12, James: "THIS PAGE = THE FORMULA for all other pages."
//
// Nothing measured that against the estate. block-audit asks "does one class render the same
// everywhere" and type-drift asks "does one class render one size" — both are page-agnostic, so
// a page can pass both while looking nothing like Impact: different band rhythm, different
// gutter, a type role Impact never uses, a surface Impact never uses.
//
// This profiles Impact first, then every other page, and reports only the DIFFERENCES. It does
// not assert — a page may legitimately differ (a PDP is not an editorial page). It is a
// worksheet for deciding what to unify, not a gate.
//
// Usage: node qa/formula-conformance.mjs [--all] [path ...]
import { chromium } from 'playwright';
import { writeFileSync, mkdirSync } from 'fs';
import { ALL_PAGES, previewUrl } from './estate-pages.mjs';

const REF = '/pages/impact';
const ARGS = process.argv.slice(2).filter(a => !a.startsWith('--'));
const PAGES = ARGS.length ? ARGS
  : process.argv.includes('--all') ? ALL_PAGES.filter(p => !p.startsWith('/account') && p !== '/cart')
  : ['/', '/pages/programmes', '/pages/workshops', '/pages/schools', '/pages/why-bamboo',
     '/pages/our-story-2', '/pages/support-mission', '/pages/bicycleteambuilding',
     '/pages/prisons', '/pages/theory-of-change', '/pages/build-to-bond', '/pages/which-kit'];

// Everything below runs IN the page.
function profile() {
  const px = v => Math.round(parseFloat(v) || 0);
  const seen = new Map();
  const role = (sel, name) => {
    const els = [...document.querySelectorAll(sel)].filter(e => e.getBoundingClientRect().width > 0);
    if (!els.length) return;
    const sizes = {};
    for (const e of els) {
      const cs = getComputedStyle(e);
      const k = px(cs.fontSize) + '/' + (parseInt(cs.fontWeight) || 400);
      sizes[k] = (sizes[k] || 0) + 1;
    }
    // the dominant rendering of this role on this page
    const top = Object.entries(sizes).sort((a, b) => b[1] - a[1])[0];
    seen.set(name, { spec: top[0], n: els.length, variants: Object.keys(sizes).length });
  };

  role('.bbc-rd .rd-eyebrow', 'eyebrow');
  role('.bbc-rd section h2, .bbc-rd .rd-wrap > h2', 'band-h2');
  role('.bbc-rd .rd-lede', 'lede');
  role('.bbc-rd .rd-btn', 'button');
  role('.bbc-rd .rd-cscard__heading, .bbc-rd .rd-card h3', 'card-title');
  role('.bbc-rd .rd-stat .rd-num, .bbc-rd .rd-num', 'stat-number');

  // band rhythm + surfaces, in document order
  const bands = [...document.querySelectorAll('.bbc-rd section, .bbc-rd > .rd-pad, .bbc-rd > .rd-pad-sm')]
    .filter(b => b.getBoundingClientRect().height > 40);
  const padTop = {}, surfaces = [];
  for (const b of bands) {
    const cs = getComputedStyle(b);
    padTop[px(cs.paddingTop)] = (padTop[px(cs.paddingTop)] || 0) + 1;
    let n = b, bg = null;
    while (n && n !== document.documentElement) {
      const s = getComputedStyle(n);
      const m = String(s.backgroundColor).match(/rgba?\(([^)]+)\)/);
      const a = m && m[1].split(',').length > 3 ? parseFloat(m[1].split(',')[3]) : (m ? 1 : 0);
      if (m && a > 0) { bg = s.backgroundColor; break; }
      n = n.parentElement;
    }
    surfaces.push(bg);
  }

  const wrap = document.querySelector('.bbc-rd .rd-wrap');
  const wcs = wrap ? getComputedStyle(wrap) : null;

  // FORMULA §8: bordered boxes (3+ sides), page-wide cap 6
  const boxed = [...document.querySelectorAll('.bbc-rd *')].filter(e => {
    const cs = getComputedStyle(e);
    const sides = ['Top', 'Right', 'Bottom', 'Left'].filter(s => px(cs['border' + s + 'Width']) > 0
      && cs['border' + s + 'Style'] !== 'none').length;
    return sides >= 3 && e.getBoundingClientRect().width > 120;
  }).length;

  return {
    roles: Object.fromEntries(seen),
    bandCount: bands.length,
    distinctBandPadTop: Object.keys(padTop).map(Number).sort((a, b) => a - b),
    surfacePalette: [...new Set(surfaces.filter(Boolean))],
    wrap: wcs ? { maxWidth: wcs.maxWidth, padLeft: px(wcs.paddingLeft) } : null,
    borderedBoxes: boxed,
  };
}

const browser = await chromium.launch({ channel: 'chrome' });
const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 }, deviceScaleFactor: 1 });

async function grab(path) {
  const page = await ctx.newPage();
  try {
    await page.goto(previewUrl(path), { waitUntil: 'load', timeout: 60000 });
    await page.waitForTimeout(1100);
    await page.evaluate(() => { document.querySelector('#shopify-pc__banner')?.remove();
      document.querySelectorAll('.rd-reveal').forEach(e => { e.style.opacity = 1; e.style.transform = 'none'; }); });
    const p = await page.evaluate(profile);
    await page.close();
    return p;
  } catch (e) { await page.close(); return { error: e.message.slice(0, 60) }; }
}

const ref = await grab(REF);
if (ref.error) { console.error('reference page failed to load:', ref.error); process.exit(1); }

console.log(`\n═══ FORMULA CONFORMANCE — reference ${REF} ═══\n`);
console.log('REFERENCE PROFILE');
for (const [k, v] of Object.entries(ref.roles)) console.log(`  ${k.padEnd(13)} ${v.spec}  (${v.n} nodes, ${v.variants} variant${v.variants > 1 ? 's' : ''})`);
console.log(`  ${'bands'.padEnd(13)} ${ref.bandCount}`);
console.log(`  ${'band pad-top'.padEnd(13)} ${ref.distinctBandPadTop.join(', ')}`);
console.log(`  ${'wrap'.padEnd(13)} max-width ${ref.wrap?.maxWidth}, gutter ${ref.wrap?.padLeft}px`);
console.log(`  ${'surfaces'.padEnd(13)} ${ref.surfacePalette.length} — ${ref.surfacePalette.join('  ')}`);
console.log(`  ${'bordered'.padEnd(13)} ${ref.borderedBoxes} (FORMULA §8 cap 6)`);

const rows = [];
for (const path of PAGES) {
  if (path === REF) continue;
  const p = await grab(path);
  if (p.error) { console.log(`\n${path}\n  ✗ ${p.error}`); continue; }
  const diffs = [];
  for (const [role, rv] of Object.entries(ref.roles)) {
    const pv = p.roles[role];
    if (!pv) { diffs.push(`${role}: absent (Impact ${rv.spec})`); continue; }
    if (pv.spec !== rv.spec) diffs.push(`${role}: ${pv.spec} vs Impact ${rv.spec}`);
  }
  if (p.wrap && ref.wrap) {
    if (p.wrap.maxWidth !== ref.wrap.maxWidth) diffs.push(`wrap max-width ${p.wrap.maxWidth} vs ${ref.wrap.maxWidth}`);
    if (p.wrap.padLeft !== ref.wrap.padLeft) diffs.push(`gutter ${p.wrap.padLeft}px vs ${ref.wrap.padLeft}px`);
  }
  const extraSurfaces = p.surfacePalette.filter(s => !ref.surfacePalette.includes(s));
  if (extraSurfaces.length) diffs.push(`surfaces Impact never uses: ${extraSurfaces.join(' ')}`);
  if (p.borderedBoxes > 6) diffs.push(`${p.borderedBoxes} bordered boxes (§8 cap 6)`);
  rows.push({ path, diffs, profile: p });
  console.log(`\n${path}  —  ${diffs.length ? diffs.length + ' difference(s)' : '✓ matches Impact'}`);
  diffs.forEach(d => console.log(`   · ${d}`));
}

const DAY = new Date().toISOString().slice(0, 10);
mkdirSync(`qa/evidence/${DAY}`, { recursive: true });
writeFileSync(`qa/evidence/${DAY}/formula-conformance.json`, JSON.stringify({ reference: ref, pages: rows }, null, 2));
console.log(`\n→ qa/evidence/${DAY}/formula-conformance.json`);
await browser.close();
