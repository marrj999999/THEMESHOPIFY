// BLOCK CONFORMANCE AUDIT — does the same block render the same everywhere?
//
// James, 2026-07-29: "focus on perfect css and block alignment, do block by block and then per page."
//
// Every audit so far worked at BAND level (a whole section) or PAGE level. Neither can see the
// defect that actually produces "uneven": one component class rendering with different padding,
// alignment or measure depending on which page it landed on. `qa/type-drift-audit.mjs` already
// proves the shape of this test for FONT SIZE — same class, different size = real drift. This
// generalises it to the properties that govern layout.
//
// THE CONTRACT BEING TESTED
//   A block class is a promise. `.rd-card` must mean the same padding, the same alignment and the
//   same measure on schools as it does on impact. Where it does not, that is drift, and drift is
//   what the eye reads as sloppy — long before anyone can name which property moved.
//
// Deliberately EXCLUDED from "drift" (learned the hard way — see ESCAPES #12):
//   · modifier classes that exist precisely to vary (rd-lime, rd-dark, rd-on-dark, rd-reveal)
//   · properties that legitimately respond to container width (a grid child's own width)
//   · single-instance classes — one occurrence cannot drift from itself
//
// Usage:  node qa/block-audit.mjs [--assert] [path ...]
import { chromium } from 'playwright';
import { writeFileSync, mkdirSync } from 'fs';

const ARGS = process.argv.slice(2).filter(a => !a.startsWith('--'));
const PAGES = ARGS.length ? ARGS : [
  '/', '/pages/impact', '/pages/workshops', '/pages/schools', '/pages/programmes',
  '/pages/why-bamboo', '/pages/build-to-bond', '/pages/our-story-2', '/pages/teambuilding',
  '/collections/all', '/products/gravel-frame-build-kit',
];
const BASE = 'https://bamboobicycleclub.org';
const PREVIEW = 'preview_theme_id=196820238710';

// Classes that exist to VARY. Comparing them is comparing a variable to itself.
const MODIFIERS = /^(rd-reveal|rd-lime|rd-dark|rd-on-dark|rd-paper|rd-steel|rd-center|rd-mx-auto|rd-stamp|bbc-counted|rd-mt\d|rd-mb\d|rd-pad|rd-pad-sm|is-\w+|active|selected)$/;

function collect() {
  // Declared INSIDE the browser function on purpose: page.evaluate serialises the function body
  // and does not carry Node-scope closures, so a module-level MODIFIERS is undefined in here.
  const MODIFIERS = /^(rd-reveal|rd-lime|rd-dark|rd-on-dark|rd-paper|rd-steel|rd-center|rd-mx-auto|rd-stamp|bbc-counted|rd-mt\d|rd-mb\d|rd-pad|rd-pad-sm|is-\w+|active|selected)$/;
  const out = {};
  const R = e => e.getBoundingClientRect();
  for (const el of document.querySelectorAll('[class]')) {
    const r = R(el);
    if (r.width < 40 || r.height < 12) continue;
    if (el.closest('[class*=drawer],[class*=banner],[class*=cookie],[class*=mega],[hidden]')) continue;
    if (el.checkVisibility && !el.checkVisibility({ checkVisibilityCSS: true })) continue;

    // UTILITIES legitimately vary by context — a .rd-flex gap or a .rd-wrap measure is SUPPOSED
    // to differ per band. Only COMPONENT classes carry a promise of sameness. Without this split
    // the audit's top hits were all utilities and the real drifts were buried under them.
    const UTILITY = /^(rd-wrap|rd-flex|rd-grid|rd-inner|rd-txt|rd-body|rd-section|rd-maxw|bbc-rd|rd-mw-|rd-cmp-|rd-g\d|rd-gap|rd-jc-|rd-ai-|rd-col|rd-row|rd-split|rd-stack|bbc-section)/;
    const classes = (el.className || '').toString().trim().split(/\s+/)
      .filter(c => /^(rd-|bl-|bbc-)/.test(c) && !MODIFIERS.test(c) && !UTILITY.test(c));
    if (!classes.length) continue;

    const cs = getComputedStyle(el);
    // OUTCOME properties only — ones where a difference is visible on screen.
    //
    // v1 also compared display, marginInline, maxWidth, alignItems and justifyContent. Those are
    // CONTEXTUAL: .rd-btn measured 35 instances at display:flex and 11 at inline-flex, which looks
    // like drift and is not — the flex ones are all inside flex parents, so every button hugs its
    // content either way. Verified by measuring rendered vs natural width on three pages: zero
    // stretched. Comparing declarations that resolve to the same rendering just manufactures noise,
    // and a checker that cries wolf gets ignored (ESCAPES #10).
    const shape = {
      padding: cs.padding,
      // `start` and `left` are the same rendering in LTR; comparing them as different values
      // made .rd-tag look like it drifted across 11 pages when nothing moved at all.
      textAlign: (cs.textAlign === 'start' ? 'left' : cs.textAlign === 'end' ? 'right' : cs.textAlign),
      radius: cs.borderTopLeftRadius,
      border: `${cs.borderTopWidth} ${cs.borderTopStyle}`,
      gap: cs.gap === 'normal' ? '-' : cs.gap,
    };
    // Key on the FULL component signature, not each class separately. Keying per-class meant a
    // variant's values were attributed to its base: `.rd-btn.rd-btn-sm` (gap 7px, a deliberate
    // size variant) showed up as `.rd-btn` drifting from gap 9px, and the impact page's
    // deliberately de-boxed `.rd-cscard` showed up as the base card drifting. Both were intentional.
    // A signature compares like with like.
    const sig = classes.slice().sort().join('.');
    (out[sig] ??= []).push(shape);
  }
  return out;
}

const browser = await chromium.launch({ channel: 'chrome' });
const perClass = {};      // class -> prop -> value -> [pages]
const loaded = [];

for (const path of PAGES) {
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 }, reducedMotion: 'reduce' });
  const page = await ctx.newPage();
  try {
    await page.goto(`${BASE}${path}?${PREVIEW}`, { waitUntil: 'load', timeout: 45000 });
    await page.waitForTimeout(1600);
    await page.evaluate(async () => {
      document.querySelectorAll('.rd-reveal').forEach(e => { e.style.opacity = 1; e.style.transform = 'none'; });
      document.querySelector('#shopify-pc__banner')?.remove();
      for (let y = 0; y < document.documentElement.scrollHeight; y += 800) {
        window.scrollTo({ top: y, behavior: 'instant' }); await new Promise(r => setTimeout(r, 55));
      }
      window.scrollTo({ top: 0, behavior: 'instant' }); await new Promise(r => setTimeout(r, 350));
    });
    const data = await page.evaluate(collect);
    loaded.push(path);
    for (const [cls, instances] of Object.entries(data)) {
      const rec = (perClass[cls] ??= {});
      for (const inst of instances) {
        for (const [prop, val] of Object.entries(inst)) {
          const p = (rec[prop] ??= {});
          (p[val] ??= new Set()).add(path);
        }
      }
    }
  } catch (e) { console.log(`  ! ${path}: ${String(e).slice(0, 60)}`); }
  await ctx.close();
}
await browser.close();

if (loaded.length < PAGES.length) {
  console.log(`\n✗ only ${loaded.length}/${PAGES.length} pages loaded — cannot certify block conformance`);
  process.exit(1);
}

// ── find drift ─────────────────────────────────────────────────────────────────────────────
// A class drifts on a property when that property takes more than one value ACROSS PAGES.
// Variation inside a single page is usually a legitimate variant (a card in a 2-col vs 3-col
// grid); variation across pages is the same promise being kept differently.
const drifts = [];
for (const [cls, props] of Object.entries(perClass)) {
  for (const [prop, values] of Object.entries(props)) {
    const entries = Object.entries(values);
    if (entries.length < 2) continue;
    const pagesFor = entries.map(([v, set]) => ({ v, pages: [...set] }));
    const crossPage = pagesFor.filter(x => x.pages.length).length >= 2;
    const totalPages = new Set(pagesFor.flatMap(x => x.pages)).size;
    if (!crossPage || totalPages < 2) continue;
    drifts.push({ cls, prop, variants: pagesFor.sort((a, b) => b.pages.length - a.pages.length) });
  }
}
// rank by blast radius: how many pages the class touches
drifts.sort((a, b) => {
  const pa = new Set(a.variants.flatMap(v => v.pages)).size;
  const pb = new Set(b.variants.flatMap(v => v.pages)).size;
  return pb - pa || b.variants.length - a.variants.length;
});

mkdirSync('qa/evidence/2026-07-29', { recursive: true });
writeFileSync('qa/evidence/2026-07-29/block-audit.json', JSON.stringify({ loaded, drifts }, null, 2));

const byClass = {};
drifts.forEach(d => (byClass[d.cls] ??= []).push(d));
const ranked = Object.entries(byClass)
  .sort((a, b) => b[1].length - a[1].length);

console.log(`\n═══ BLOCK CONFORMANCE — ${Object.keys(perClass).length} classes measured across ${loaded.length} pages ═══`);
console.log(`${ranked.length} classes drift on at least one layout property.\n`);
for (const [cls, ds] of ranked.slice(0, 18)) {
  const pages = new Set(ds.flatMap(d => d.variants.flatMap(v => v.pages))).size;
  console.log(`${cls}  —  ${ds.length} propert${ds.length > 1 ? 'ies' : 'y'} drifting, on ${pages} pages`);
  for (const d of ds.slice(0, 4)) {
    const vs = d.variants.slice(0, 3)
      .map(v => `${v.v} [${v.pages.length}p]`).join('   vs   ');
    console.log(`     ${d.prop.padEnd(14)} ${vs}`);
  }
  console.log('');
}

if (process.argv.includes('--assert')) {
  if (drifts.length) {
    console.log(`✗ ${drifts.length} block-conformance drifts across ${ranked.length} classes`);
    process.exit(1);
  }
  console.log('✓ every block class renders identically on every page');
}
console.log('→ qa/evidence/2026-07-29/block-audit.json');
