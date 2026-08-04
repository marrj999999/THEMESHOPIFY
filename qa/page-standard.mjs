// PAGE STANDARD — does a page look like the site, as a SEQUENCE?
//
// FORMULA.md fixes type roles and band anatomy; qa/formula-conformance.mjs checks a page's TYPE
// against Impact. Neither asks the question that actually makes a page feel borrowed: which
// surface follows which, how often a dark band appears, whether bands open the same way.
// /pages/why-bamboo passes type conformance and still looks least like the site, because it runs
// FIVE consecutive bone bands after its hero — invisible to every other check we have.
//
// The six rules and the measured baseline are in qa/PAGE-STANDARD.md. Derived from /pages/impact
// (FORMULA.md: "every other page inherits this verbatim") with /pages/our-story-2 as the second
// exemplar — it scores as well or better on every rule.
//
// Reports, does not assert. A PDP is not an editorial page and should not be forced to look like
// one. This is a worksheet for deciding what to unify; the numbers are the argument.
//
// Usage: node qa/page-standard.mjs [--all] [path ...]
import { chromium } from 'playwright';
import { writeFileSync, mkdirSync } from 'fs';
import { ALL_PAGES, previewUrl } from './estate-pages.mjs';

const ARGS = process.argv.slice(2).filter(a => !a.startsWith('--'));
const DEFAULT = ['/pages/impact', '/pages/schools', '/pages/workshops', '/pages/why-bamboo',
  '/pages/programmes', '/pages/our-story-2', '/pages/support-mission',
  '/pages/bicycleteambuilding', '/'];
const PAGES = ARGS.length ? ARGS
  : process.argv.includes('--all') ? ALL_PAGES.filter(p => !p.startsWith('/account') && p !== '/cart')
  : DEFAULT;

// The four canonical surfaces plus the permitted single lime moment. Anything else is off-palette
// — this is how the homepage's #faf7f0 cream band was found (fixed 2026-08-03).
const NAME = {
  'rgb(0, 60, 50)': 'forest', 'rgb(0, 42, 35)': 'forest-dk',
  'rgb(230, 220, 200)': 'bone', 'rgb(241, 233, 216)': 'paper',
  'rgb(222, 230, 240)': 'steel', 'rgb(212, 253, 98)': 'lime',
};
const DARK = ['rgb(0, 60, 50)', 'rgb(0, 42, 35)'];

function scan() {
  const px = v => Math.round(parseFloat(v) || 0);
  // Top-level bands only — skip anything nested inside a band already counted, or a page with
  // nested <section> elements counts its own content twice and every metric is wrong.
  const all = [...document.querySelectorAll('.bbc-rd header, .bbc-rd section, .bbc-rd > .rd-pad, .bbc-rd > .rd-pad-sm')]
    .filter(x => x.getBoundingClientRect().height > 60);
  const kept = [], out = [];
  for (const x of all) {
    if (kept.some(k => k.contains(x))) continue;
    kept.push(x);
    let n = x, bg = null;
    while (n && n !== document.documentElement) {
      const s = getComputedStyle(n);
      const m = String(s.backgroundColor).match(/rgba?\(([^)]+)\)/);
      const a = m && m[1].split(',').length > 3 ? parseFloat(m[1].split(',')[3]) : (m ? 1 : 0);
      if (m && a > 0) { bg = s.backgroundColor; break; }
      n = n.parentElement;
    }
    out.push({
      bg,
      padTop: px(getComputedStyle(x).paddingTop),
      // S1 asks "does this band OPEN with an eyebrow", which is a design question, not a
      // class-name question. Checking only `.rd-eyebrow` scored every bbc-pillar and
      // bbc-statement band as a failure — they render one, under their own component class
      // (`.bbcpl-idx` is the "— 01 the science" rule+number+kicker line; `.bbcst-eyebrow` is
      // the statement equivalent). That false negative put /pages/why-bamboo at 50% in
      // PAGE-STANDARD.md and SITE-SYSTEM.md when its true figure is 83%, and the two docs then
      // used the bogus gap as evidence for a content migration. Corrected 2026-08-04 after a
      // screenshot showed the eyebrow this check said was missing.
      // The FULL set, enumerated by sweeping every class the theme emits (not by inspecting the
      // two components that happened to fail): rd-eyebrow (154 uses, the norm), bbcpl-idx (the
      // "— 01 the science" rule+number+kicker on bbc-pillar), bbcst-eyebrow (bbc-statement),
      // bbc-section-eyebrow ("The Workshop Experience" on bbc-workshop-complete/-blocks) and
      // ew-eyebrow (the homepage .ew component). The first pass at this fix caught only three
      // and would have left /pages/workshops undercounted — which is exactly the mistake
      // ESCAPES #43 is about, repeated inside the fix for #43.
      eyebrow: !!x.querySelector(
        '.rd-eyebrow, .bbcpl-idx, .bbcst-eyebrow, .bbc-section-eyebrow, .ew-eyebrow'),
      // S4 counts LOOSE CTAs only. A CTA inside its own card is part of that card, not a
      // competing ask — FORMULA §1 already carves out "deliberate equal-doors card grids".
      // Counting every .rd-btn flagged support-mission's funding ladder at 4, where each rung is
      // a funding tier with its own button. The rule was wrong, not the page. (2026-08-04)
      ctas: [...x.querySelectorAll('.rd-btn')].filter(btn =>
        !btn.closest('.rd-card, .rd-cscard, article, .bbc-sup__rung, .rd-door, .rd-step')).length,
      ctasTotal: x.querySelectorAll('.rd-btn').length,
      stat: [...x.querySelectorAll('.rd-num')].some(e => px(getComputedStyle(e).fontSize) >= 24),
      ghost: !!x.querySelector('.rd-ghostnum'),
    });
  }
  return out;
}

const browser = await chromium.launch({ channel: 'chrome' });
const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 }, deviceScaleFactor: 1 });
const rows = [];

for (const path of PAGES) {
  const page = await ctx.newPage();
  try {
    await page.goto(previewUrl(path), { waitUntil: 'load', timeout: 60000 });
    await page.waitForTimeout(1100);
    await page.evaluate(() => { document.querySelector('#shopify-pc__banner')?.remove(); });
    const b = await page.evaluate(scan);
    const nonHero = b.slice(1);                       // the hero legitimately has no eyebrow
    let repeats = 0, adjDark = 0;
    for (let i = 1; i < b.length; i++) {
      if (b[i].bg === b[i - 1].bg) repeats++;
      if (DARK.includes(b[i].bg) && DARK.includes(b[i - 1].bg)) adjDark++;
    }
    const offPalette = [...new Set(b.map(x => x.bg))].filter(x => x && !NAME[x]);
    const statBand = b.find(x => x.stat);
    rows.push({
      path, bands: b.length,
      eyebrowPct: nonHero.length ? Math.round(100 * nonHero.filter(x => x.eyebrow).length / nonHero.length) : 100,
      repeats, adjDark,
      maxCTA: Math.max(0, ...nonHero.map(x => x.ctas)),   // S4 excludes the hero, which may carry 2
      offPalette,
      statDark: statBand ? DARK.includes(statBand.bg) : null,
      statGhost: statBand ? statBand.ghost : null,
      seq: b.map(x => NAME[x.bg] || x.bg).join(' → '),
    });
  } catch (e) { rows.push({ path, err: e.message.slice(0, 50) }); }
  await page.close();
}
await browser.close();

console.log('\n═══ PAGE STANDARD — measured against /pages/impact (qa/PAGE-STANDARD.md) ═══\n');
console.log('page                         bands  S1 eyebrow  S2 repeats  S3 adjDark  S4 maxCTA  stat band');
for (const r of rows) {
  if (r.err) { console.log(`${r.path.padEnd(29)}ERR ${r.err}`); continue; }
  const stat = r.statDark === null ? '—' : (r.statDark ? (r.statGhost ? 'dark+ghost' : 'dark') : 'LIGHT');
  console.log(
    r.path.padEnd(29) + String(r.bands).padStart(5) +
    String(r.eyebrowPct + '%').padStart(12) + String(r.repeats).padStart(12) +
    String(r.adjDark).padStart(12) + String(r.maxCTA).padStart(11) + '  ' + stat);
}
// A page that was never built as bands cannot "drift from the band standard". Legacy templates
// (size-guide, the geometry pages, privacy-policy, most collections) render their whole body
// inside a single .rd-pad wrapper, so they measure as 1 content band with no eyebrow and score
// 0%. Reporting those alongside genuine 2026 pages produced "53 of 66 outside the standard",
// which is true of the arithmetic and false of the site. Split them. (2026-08-04)
const inSystem = r => !r.err && (r.bands >= 4 || /rd-(dark|paper|steel|forest)/.test(r.seq || ''));
const sys = rows.filter(inSystem), legacy = rows.filter(r => !r.err && !inSystem(r));
const drift = sys.filter(r => r.eyebrowPct < 80 || r.repeats > 2 || r.adjDark > 0 || r.maxCTA > 2);
console.log(`\n── ${sys.length} pages in the 2026 band system · ${drift.length} outside the standard`);
console.log(`── ${legacy.length} legacy/simple templates — never built as bands, not scored`);
if (legacy.length) console.log('   ' + legacy.map(r => r.path).join(', '));

const off = rows.filter(r => r.offPalette && r.offPalette.length);
if (off.length) {
  console.log('\noff-palette surfaces (S5):');
  off.forEach(r => console.log(`  ${r.path}  ${r.offPalette.join(' ')}`));
}
console.log('\nsurface sequences:');
rows.filter(r => !r.err).forEach(r => console.log(`  ${r.path}\n     ${r.seq}`));

const DAY = new Date().toISOString().slice(0, 10);
mkdirSync(`qa/evidence/${DAY}`, { recursive: true });
writeFileSync(`qa/evidence/${DAY}/page-standard.json`, JSON.stringify(rows, null, 2));
console.log(`\n→ qa/evidence/${DAY}/page-standard.json`);
