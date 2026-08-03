// R2a — the anti-sameness metrics, validated against the peer field.
//
// WHY THIS EXISTS
// "Looks AI-generated" has been a judgement call. FORMULA §8 and the device library D1-D12 are
// written as rules but nothing measures conformance. This turns six of those rules into numbers.
//
// THE RULE THIS TOOL OBEYS (qa/ESCAPES.md, the measurement-quality batch)
// A proxy is a hypothesis, not a result. Two guards are built in:
//
//   1. SEGMENTATION CONFIDENCE. qa/research/block-library-spec.md records that DOM band-splitting
//      works on our pages and badly on arbitrary sites — Bounce Back and Key4Life each came back
//      as ONE band, which is obviously wrong. Deriving a reference number from that would have
//      been garbage. So every page reports coverage + band count, and anything that fails the
//      confidence test is EXCLUDED from aggregates and listed, never silently averaged in.
//
//   2. THE BOX DEFINITION IS THE CORRECTED ONE (ESCAPES #16). A "box" needs a border on 3+ sides.
//      One or two sides is a RULE, which is device D6 — the pattern the research prescribes. The
//      first version of that detector flagged the recommended pattern as the defect.
//
// Usage: node qa/sameness.mjs [--ours-only]
import { chromium } from 'playwright';
import { writeFileSync, mkdirSync } from 'fs';

const OURS = [
  ['BBC home', 'https://bamboobicycleclub.org/?preview_theme_id=196820238710'],
  ['BBC impact', 'https://bamboobicycleclub.org/pages/impact?preview_theme_id=196820238710'],
  ['BBC workshops', 'https://bamboobicycleclub.org/pages/workshops?preview_theme_id=196820238710'],
  ['BBC schools', 'https://bamboobicycleclub.org/pages/schools?preview_theme_id=196820238710'],
  ['BBC programmes', 'https://bamboobicycleclub.org/pages/programmes?preview_theme_id=196820238710'],
];

const PEERS = [
  ['Switchback', 'https://switchback.org.uk'],
  ['Bounce Back', 'https://bouncebackproject.com'],
  ['The Clink', 'https://theclinkcharity.org'],
  ['Recycling Lives', 'https://recyclinglives.org'],
  ['Redemption Roasters', 'https://redemptionroasters.com'],
  ['Fine Cell Work', 'https://finecellwork.co.uk'],
  ['Emmaus', 'https://emmaus.org.uk'],
  ['Big Issue', 'https://www.bigissue.com'],
  ['Belu', 'https://belu.org'],
  ['Change Please', 'https://changeplease.org'],
  ['Elvis & Kresse', 'https://www.elvisandkresse.com'],
  ['Hiut Denim', 'https://hiutdenim.co.uk'],
  ["Tony's Chocolonely", 'https://tonyschocolonely.com'],
  ['Who Gives A Crap', 'https://uk.whogivesacrap.org'],
  ['Divine Chocolate', 'https://www.divinechocolate.com'],
  ['Riverford', 'https://www.riverford.co.uk'],
  ['Toast Brewing', 'https://www.toastbrewing.com'],
  ['Cook', 'https://www.cookfood.net'],
  ['Patagonia', 'https://eu.patagonia.com'],
  ['Social Enterprise UK', 'https://www.socialenterprise.org.uk'],
];

// ── the in-page analyser ────────────────────────────────────────────────────────────────────
function analyse() {
  const vw = window.innerWidth;
  const docH = document.documentElement.scrollHeight;

  const lum = c => { const m = (c || '').match(/[\d.]+/g); if (!m) return null;
    if (m[3] !== undefined && +m[3] < 0.5) return null;
    return 0.299 * +m[0] + 0.587 * +m[1] + 0.114 * +m[2]; };

  // A box is a FULL ENCLOSURE — 3+ bordered sides (ESCAPES #16). 1-2 sides is device D6.
  // A side only counts if it is VISIBLE. `.rd-card` ships `border:1.5px solid transparent`
  // (a layout spacer, not an enclosure) and the first version counted all four sides of it —
  // inflating our box ratio with borders nobody can see.
  const boxSides = e => { const c = getComputedStyle(e); let n = 0;
    for (const s of ['Top', 'Right', 'Bottom', 'Left']) {
      if (parseFloat(c[`border${s}Width`]) <= 0.5) continue;
      if (c[`border${s}Style`] === 'none') continue;
      const col = c[`border${s}Color`] || '';
      const a = col.match(/rgba?\([^)]*?,\s*([\d.]+)\s*\)/);
      if (col === 'transparent' || (a && +a[1] < 0.15)) continue;   // invisible = not a box side
      n++;
    }
    return n; };

  // SEGMENTATION — find the BAND PARENT, then take its direct children.
  //
  // The first version walked every element and kept the "deepest" at each vertical position.
  // It reported 3-4 bands on pages known to have 10, with coverage 1.9 (i.e. it was counting
  // overlapping wrappers twice). Rewritten to generalise what demonstrably works on our own
  // markup: one container holds the bands as DIRECT children. So find the container with the
  // most band-shaped children and use those. Validated against /pages/impact, whose true band
  // count (10) was established independently by an earlier audit.
  const isBandish = e => {
    const r = e.getBoundingClientRect();
    if (r.width < vw * 0.7 || r.height < 130) return false;
    const cs = getComputedStyle(e);
    return cs.display !== 'none' && cs.visibility !== 'hidden' && cs.position !== 'fixed';
  };

  let parent = null, best = 0;
  const candidates = [document.body, ...document.querySelectorAll('body main, body > div, body div, body main > div, main section')];
  for (const c of new Set(candidates)) {
    if (!c) continue;
    const n = [...c.children].filter(isBandish).length;
    // prefer more bands; on a tie prefer the deeper container
    const depth = (() => { let d = 0, x = c; while (x && x !== document.body) { d++; x = x.parentElement; } return d; })();
    if (n > best || (n === best && n > 0 && parent && depth > parent.depth)) { best = n; parent = { el: c, depth }; }
  }
  const bands = (parent ? [...parent.el.children] : []).filter(isBandish).map(e => ({
    e, top: Math.round(e.getBoundingClientRect().top + scrollY),
    h: Math.round(e.getBoundingClientRect().height),
  })).sort((a, b) => a.top - b.top);

  const sig = [];
  for (const b of bands) {
    const el = b.e, r = el.getBoundingClientRect();
    const cs = getComputedStyle(el);
    const L = lum(cs.backgroundColor);
    const surface = L === null ? 'inherit' : L < 90 ? 'dark' : L > 200 ? 'light' : 'mid';

    // split ratio from the widest row of direct children
    const kids = [...el.children].map(k => k.getBoundingClientRect()).filter(k => k.height > 40 && k.width > 60);
    const row = kids.filter(k => Math.abs(k.top - (kids[0]?.top ?? 0)) < 40);
    let cols = row.length || 1, symmetric = false;
    if (row.length === 2) {
      const tot = row[0].width + row[1].width;
      const share = row[0].width / tot;
      symmetric = share > 0.45 && share < 0.55;
    }

    // A "box" means a bordered CARD — a content container. The first pass counted
    // cookie-banner buttons, a hidden cart drawer, a hidden nav mega-panel and every CTA pill,
    // giving BBC 70% vs a field median of 14% — a headline that was pure artefact (ESCAPES #16
    // all over again; Switchback's "5 boxes" were all <input>s). Interactive controls, hidden
    // chrome and anything pill-sized are therefore excluded, and a card must be card-sized.
    const boxes = [...el.querySelectorAll('*')].filter(x => {
      if (/^(A|BUTTON|INPUT|SELECT|TEXTAREA|LABEL|SUMMARY)$/.test(x.tagName)) return false;
      if (x.getAttribute('role') === 'button') return false;
      if (x.closest('[class*=drawer],[class*=banner],[class*=mega],[class*=modal],[class*=popup],[class*=cookie],[aria-hidden=true],[hidden]')) return false;
      if (x.checkVisibility && !x.checkVisibility({ checkVisibilityCSS: true, checkOpacity: true })) return false;
      const xr = x.getBoundingClientRect();
      return xr.height >= 100 && xr.width >= 150 && boxSides(x) >= 3;
    }).length;

    const media = [...el.querySelectorAll('img,video,picture,svg')].filter(m => {
      const mr = m.getBoundingClientRect(); return mr.width > r.width * 0.5 && mr.height > 100;
    }).length > 0;

    const words = (el.innerText || '').trim().split(/\s+/).filter(Boolean).length;
    const density = words / Math.max(1, b.h / 1000);           // words per 1000px
    const dBucket = density < 60 ? 'sparse' : density < 160 ? 'medium' : 'dense';

    // shape signature — the thing repetition is measured on
    const shape = [surface, cols > 3 ? 'grid' : `c${cols}`, media ? 'media' : 'nomedia',
                   boxes > 0 ? 'boxed' : 'open'].join('|');

    sig.push({ top: b.top, h: b.h, surface, cols, symmetric, boxes, media, words, dBucket, shape });
  }

  const covered = sig.reduce((a, s) => a + s.h, 0);
  return { docH, vw, bands: sig, coverage: +(covered / docH).toFixed(2) };
}

// ── metric maths ────────────────────────────────────────────────────────────────────────────
function metrics(page) {
  const b = page.bands;
  if (!b.length) return null;
  const counts = {};
  b.forEach(x => counts[x.shape] = (counts[x.shape] || 0) + 1);
  const top = Math.max(...Object.values(counts));
  const splits = b.filter(x => x.cols === 2);
  let run = 1, maxRun = 1;
  for (let i = 1; i < b.length; i++) { run = b[i].dBucket === b[i - 1].dBucket ? run + 1 : 1; maxRun = Math.max(maxRun, run); }
  let adj = 0;
  for (let i = 1; i < b.length; i++) if (b[i].shape === b[i - 1].shape) adj++;
  return {
    bands: b.length,
    repetition: +(100 * top / b.length).toFixed(0),          // % in the single most common shape
    diversity: +(Object.keys(counts).length / b.length).toFixed(2),
    adjacency: adj,
    boxRatio: +(100 * b.filter(x => x.boxes > 0).length / b.length).toFixed(0),
    symmetry: splits.length ? +(100 * splits.filter(x => x.symmetric).length / splits.length).toFixed(0) : null,
    densityRun: maxRun,
  };
}

// A page we cannot segment is EXCLUDED, never averaged in (block-library-spec.md's lesson).
const confident = (p, m) => m && m.bands >= 4 && p.coverage >= 0.5 && p.coverage <= 3.0;

// ── run ─────────────────────────────────────────────────────────────────────────────────────
const targets = process.argv.includes('--ours-only') ? OURS : [...OURS, ...PEERS];
const browser = await chromium.launch({ channel: 'chrome' });
const rows = [];

for (const [name, url] of targets) {
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 }, reducedMotion: 'reduce' });
  const page = await ctx.newPage();
  let res = null;
  try {
    await page.goto(url, { waitUntil: 'load', timeout: 45000 });
    await page.waitForTimeout(1800);
    await page.evaluate(async () => {
      document.querySelectorAll('.rd-reveal').forEach(e => { e.style.opacity = 1; e.style.transform = 'none'; });
      for (let y = 0; y < document.documentElement.scrollHeight; y += 800) {
        window.scrollTo({ top: y, behavior: 'instant' }); await new Promise(r => setTimeout(r, 60));
      }
      window.scrollTo({ top: 0, behavior: 'instant' }); await new Promise(r => setTimeout(r, 400));
    });
    res = await page.evaluate(analyse);
  } catch (e) { rows.push({ name, url, error: String(e).slice(0, 60) }); await ctx.close(); continue; }
  const m = metrics(res);
  rows.push({ name, url, ours: name.startsWith('BBC'), coverage: res.coverage, ...(m || {}),
              ok: confident(res, m) });
  await ctx.close();
}
await browser.close();

const ok = rows.filter(r => r.ok);
const excluded = rows.filter(r => !r.ok);
const ours = ok.filter(r => r.ours), peers = ok.filter(r => !r.ours);
const med = (a, k) => { const v = a.map(x => x[k]).filter(x => x != null).sort((x, y) => x - y);
  return v.length ? (v.length % 2 ? v[(v.length - 1) / 2] : +(((v[v.length / 2 - 1] + v[v.length / 2]) / 2).toFixed(2))) : null; };

const pad = (s, n) => String(s ?? '-').padEnd(n);
console.log('\n' + pad('page', 24) + pad('bands', 7) + pad('repeat%', 9) + pad('diversity', 11)
  + pad('adjacent', 10) + pad('boxed%', 8) + pad('sym%', 7) + pad('maxRun', 7) + 'coverage');
console.log('-'.repeat(96));
for (const r of ok) console.log(pad(r.name, 24) + pad(r.bands, 7) + pad(r.repetition, 9) + pad(r.diversity, 11)
  + pad(r.adjacency, 10) + pad(r.boxRatio, 8) + pad(r.symmetry, 7) + pad(r.densityRun, 7) + r.coverage);

console.log('\nMEDIANS');
for (const k of ['bands', 'repetition', 'diversity', 'adjacency', 'boxRatio', 'symmetry', 'densityRun'])
  console.log(`  ${pad(k, 12)} ours ${pad(med(ours, k), 8)} peers ${med(peers, k)}`);

if (excluded.length) {
  console.log(`\nEXCLUDED — segmentation not trustworthy (${excluded.length}). Not averaged in:`);
  excluded.forEach(r => console.log(`  ${pad(r.name, 24)} ${r.error ? 'LOAD: ' + r.error : `bands=${r.bands ?? 0} coverage=${r.coverage ?? '-'}`}`));
}

// Evidence day was a hardcoded literal, so every run after that date wrote back into that
// date's folder and destroyed the previous run's evidence — and the tool could never satisfy
// gate-check.sh step 5, which requires evidence under TODAY's date. Same bug found in
// contrast-check.mjs, block-audit.mjs, layout-audit.mjs and sameness.mjs on 2026-08-03.
const DAY = new Date().toISOString().slice(0, 10);
mkdirSync(`qa/evidence/${DAY}`, { recursive: true });
writeFileSync(`qa/evidence/${DAY}/sameness.json`, JSON.stringify({ rows, medians: {
  ours: Object.fromEntries(['bands','repetition','diversity','adjacency','boxRatio','symmetry','densityRun'].map(k => [k, med(ours, k)])),
  peers: Object.fromEntries(['bands','repetition','diversity','adjacency','boxRatio','symmetry','densityRun'].map(k => [k, med(peers, k)])),
} }, null, 2));
console.log(`\n→ qa/evidence/${DAY}/sameness.json`);
