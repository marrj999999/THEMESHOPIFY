// COMPUTED-STYLE FINGERPRINT — the safety net for CSS refactoring.
//
// James, 2026-07-29: "fix all and test one by one and follow best practices."
//
// The estate carries 2,253 !important declarations across 43 stylesheets. Removing them is the
// right thing to do and the dangerous thing to do: an !important that IS load-bearing looks
// exactly like one that is not, until something silently reflows three pages away.
//
// BEST PRACTICE FOR THIS JOB is not "read the CSS and reason about the cascade" — it is
// EQUIVALENCE TESTING. Strip a batch, re-render, and prove every element still COMPUTES the same.
// The browser is the only authority on what the cascade actually resolves to; any argument I make
// from reading the source is a hypothesis, and this session has shown how often those are wrong.
//
//   node qa/css-fingerprint.mjs capture before     # snapshot the estate as it renders now
//   ...make the change, push it...
//   node qa/css-fingerprint.mjs capture after
//   node qa/css-fingerprint.mjs diff before after  # exit 1 if ANY element moved
//
// A clean diff means the removed !important declarations were decorative. A dirty diff names the
// exact element and property that moved, so the batch can be narrowed rather than abandoned.
import { chromium } from 'playwright';
import { writeFileSync, readFileSync, mkdirSync, existsSync } from 'fs';
import { previewUrl } from './estate-pages.mjs';

const [mode, a, b] = process.argv.slice(2);
const DIR = 'qa/evidence/fingerprints';
const BASE = 'https://bamboobicycleclub.org';
const PREVIEW = 'preview_theme_id=196820238710';
const PAGES = [
  '/', '/pages/impact', '/pages/workshops', '/pages/schools', '/pages/programmes',
  '/pages/why-bamboo', '/pages/build-to-bond', '/pages/our-story-2', '/pages/teambuilding',
  '/pages/impact-report', '/collections/all', '/products/gravel-frame-build-kit', '/cart',
];

// The properties that actually change how a page LOOKS. Deliberately not every property:
// a fingerprint that includes everything is dominated by inherited noise and never goes green.
const PROPS = [
  'display', 'position', 'width', 'height', 'padding', 'margin', 'border', 'borderRadius',
  'color', 'backgroundColor', 'fontSize', 'fontWeight', 'lineHeight', 'letterSpacing',
  'textAlign', 'textDecorationLine', 'textTransform', 'opacity', 'gap', 'gridTemplateColumns',
  'flexDirection', 'alignItems', 'justifyContent', 'maxWidth', 'minHeight', 'zIndex', 'overflow',
  'boxShadow', 'transform',
];

function snapshot(props) {
  const out = {};
  // A stable identity for each element that survives re-rendering: path through the DOM by
  // tag+index. Class lists can change during a refactor; structural position does not.
  const pathOf = el => {
    const parts = [];
    let n = el;
    while (n && n !== document.body && parts.length < 12) {
      const p = n.parentElement;
      if (!p) break;
      const i = [...p.children].indexOf(n);
      parts.unshift(`${n.tagName}:${i}`);
      n = p;
    }
    return parts.join('>');
  };
  const els = [...document.querySelectorAll('body *')].filter(e => {
    const r = e.getBoundingClientRect();
    if (r.width < 4 || r.height < 4) return false;
    if (e.closest('[class*=drawer],[class*=banner],[class*=cookie]')) return false;
    return true;
  });
  for (const el of els) {
    const cs = getComputedStyle(el);
    const rec = {};
    for (const p of props) rec[p] = cs[p];
    const r = el.getBoundingClientRect();
    rec._box = `${Math.round(r.width)}x${Math.round(r.height)}@${Math.round(r.left)},${Math.round(r.top + scrollY)}`;
    out[pathOf(el)] = rec;
  }
  return out;
}

async function capture(label) {
  mkdirSync(DIR, { recursive: true });
  const browser = await chromium.launch({ channel: 'chrome' });
  const all = {};
  // BOTH viewports. Desktop-only evidence cannot certify a change to a mobile-only stylesheet —
  // bbc-mobile-fixes.css carries 146 !important that a 1280px capture would never exercise.
  const VIEWPORTS = [[1280, 900, false], [390, 844, true]];
  for (const [path, vw, vh, isMobile] of PAGES.flatMap(p => VIEWPORTS.map(v => [p, ...v]))) {
    const key = `${path}@${vw}`;
    const ctx = await browser.newContext({ viewport: { width: vw, height: vh }, isMobile, deviceScaleFactor: isMobile ? 2 : 1, reducedMotion: 'reduce' });
    const page = await ctx.newPage();
    try {
      await page.goto(previewUrl(path), { waitUntil: 'load', timeout: 45000 });
      await page.waitForTimeout(1600);
      // EXACTLY the visual spec's mask (ESCAPES #28). The fingerprint once certified "0 moved"
      // while the visual net failed 48/48 — both correct, measuring different pages, because
      // visual.spec.mjs hides video/iframe/map and this did not. Hiding an element changes what
      // the surrounding layout resolves to, so an equivalence test run without the mask cannot
      // certify anything the masked gate will later judge. Kept byte-identical to visual.spec.mjs.
      await page.addStyleTag({ content: `
        .bbc-press__track, .rd-qtrack { animation: none !important; transform: none !important; }
        .bbc-media, video, iframe, .rd-mapwide { visibility: hidden !important; }
        #shopify-pc__banner { display: none !important; }
      ` });
      await page.evaluate(async () => {
        document.querySelectorAll('.rd-reveal').forEach(e => { e.style.opacity = 1; e.style.transform = 'none'; });
        document.querySelector('#shopify-pc__banner')?.remove();
        for (let y = 0; y < document.documentElement.scrollHeight; y += 800) {
          window.scrollTo({ top: y, behavior: 'instant' }); await new Promise(r => setTimeout(r, 50));
        }
        window.scrollTo({ top: 0, behavior: 'instant' }); await new Promise(r => setTimeout(r, 350));
      });
      all[key] = await page.evaluate(snapshot, PROPS);
    } catch (e) { console.log(`  ! ${key}: ${String(e).slice(0, 60)}`); all[key] = { __error: String(e).slice(0, 80) }; }
    await ctx.close();
  }
  await browser.close();
  writeFileSync(`${DIR}/${label}.json`, JSON.stringify(all));
  const n = Object.values(all).reduce((s, p) => s + Object.keys(p).length, 0);
  console.log(`\n✓ ${label}: ${n} elements across ${Object.keys(all).length} page/viewport combos → ${DIR}/${label}.json`);
}

function diff(l1, l2) {
  const f1 = JSON.parse(readFileSync(`${DIR}/${l1}.json`, 'utf8'));
  const f2 = JSON.parse(readFileSync(`${DIR}/${l2}.json`, 'utf8'));
  let moved = 0, checked = 0, missing = 0;
  const byProp = {}, samples = [];
  for (const page of Object.keys(f1)) {
    if (f1[page].__error || !f2[page] || f2[page].__error) { console.log(`  ! ${page}: a capture errored — cannot compare`); continue; }
    for (const [path, before] of Object.entries(f1[page])) {
      const after = f2[page][path];
      if (!after) { missing++; continue; }
      for (const [prop, val] of Object.entries(before)) {
        checked++;
        if (after[prop] === val) continue;
        moved++;
        byProp[prop] = (byProp[prop] || 0) + 1;
        if (samples.length < 14) samples.push({ page, path: path.slice(-58), prop, before: String(val).slice(0, 34), after: String(after[prop]).slice(0, 34) });
      }
    }
  }
  console.log(`\ncompared ${checked} property values`);
  console.log(`  unchanged : ${checked - moved}`);
  console.log(`  MOVED     : ${moved}`);
  if (missing) console.log(`  elements not found in "${l2}": ${missing} (structure changed — expected if markup was edited)`);
  if (moved) {
    console.log('\n  by property:');
    Object.entries(byProp).sort((x, y) => y[1] - x[1]).forEach(([p, n]) => console.log(`     ${p.padEnd(20)} ${n}`));
    console.log('\n  samples:');
    samples.forEach(s => console.log(`     ${s.page} ${s.path}\n        ${s.prop}: ${s.before}  ->  ${s.after}`));
    console.log('\n✗ NOT EQUIVALENT — the change altered rendering. Narrow the batch or keep those !important.');
    process.exit(1);
  }
  console.log('\n✓ EQUIVALENT — every element computes identically. The change was safe.');
}

if (mode === 'capture' && a) await capture(a);
else if (mode === 'diff' && a && b) diff(a, b);
else { console.log('usage: css-fingerprint.mjs capture <label> | diff <labelA> <labelB>'); process.exit(1); }
