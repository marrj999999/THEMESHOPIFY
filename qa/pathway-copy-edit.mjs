// Pathway copy reframe — DRAFT-only surgical edit to templates/page.impact.json
//
// Authority: James, 2026-07-27 — "make it more general programme for schools, and make the
// prison programme flexible vocational skills in prison". This is the .shopifyignore carve-out
// ("unless explicitly instructed by James"); templates/*.json is otherwise never written.
//
// Safe by construction, same pattern as qa/surgical-template-edit.mjs:
//   (a) snapshots the verbatim pre-edit asset first,
//   (b) sets ONLY the keys listed in EDITS, matching the expected old value,
//   (c) aborts if any other key in the file changed,
//   (d) reads back and re-verifies semantically (Shopify normalises JSON, so byte
//       identity is the wrong test — escape recorded 2026-07-24).
//
// Copy sources — every factual element traced:
//   /pages/schools (live draft)      five strands, free Speaker build, ages 11-19, teacher-led
//   Programme Library §3/§4          six-week cohorts of six, 18 hrs/week, Cat B/C/D, hand tools
//   Proof Bank                       OCN L2 "Workshop Skills and Sustainable Manufacturing"
//   CLAUDE.md / vault                the four active sites; naming prisons allowed since 2026-06-17
//   Claims Register L59              schools Level 1 evidence PENDING -> softened, see the note
//
// Usage: node qa/pathway-copy-edit.mjs [--dry-run]
import { getAsset, putAsset, DRAFT } from './shopify-api.mjs';
import { writeFileSync, mkdirSync } from 'fs';

const DRY = process.argv.includes('--dry-run');
const KEY = 'templates/page.impact.json';
const DATE = new Date().toISOString().slice(0, 10);
const BK = `qa/evidence/${DATE}/pre-push`;

// [settingId, expectedOldValue, newValue]
const EDITS = [
  // ── schools: a general programme, matching what /pages/schools actually offers ──────────────
  ['arm1_chip', 'in schools · before exclusion', 'in schools · ages 11–19'],
  ['arm1_name', 'make engineers', 'real engineering'],
  ['arm1_who',
    'for SEND, PRU and at-risk young people being pushed out of the classroom often their first positive encounter with engineering.',
    'for secondary schools, sixth forms and colleges — five programmes, from a free classroom build to a rideable frame. curriculum-mapped, and built to be teacher-led.'],
  ['arm1_flow',
    'taster session :: one day, in school | short course, real build :: weeks, not years | OCN Level 1 accredited :: a first recognised qualification | warm hand-off :: to college or training',
    'start free :: the speaker build, 2–3 hours | choose a strand :: product, bicycle, additive or e-mobility | OCN accredited :: recognised skills, real qualifications | teachers run it :: film, session plan and curriculum map included'],

  // ── prisons: vocational skills lead, family bike becomes one strand, sites prove flexibility ──
  ['arm2_chip', 'in prisons · after', 'in prisons · accredited'],
  ['arm2_name', 'build to bond', 'vocational skills'],
  ['arm2_who',
    'for people inside prison rebuilding skills, family ties and a route to work on release.',
    'for people inside prison earning a hands-on manufacturing qualification — six-week Build to Bond cohorts at Lowdham Grange, Foston Hall, Lindholme and Feltham.'],
  ['arm2_flow',
    'join the workshop course :: six weeks inside | OCN Level 2 accredited :: a qualification that leaves with you | build a bike for your child :: the bike goes home | become a peer instructor :: teach the next cohort | link to work on release :: a route back in',
    'six-week cohort :: six Makers, 18 hours a week | OCN Level 2 accredited :: workshop skills and sustainable manufacturing | a bike for their child :: handed over on family visit day | train as a peer instructor :: teach the next cohort | a route to work on release :: employer partners'],
  ['arm2_cta_label', 'commission a programme →', 'bring it to your prison →'],
];

const raw = await getAsset(DRAFT, KEY);
if (!raw) { console.error(`✗ could not read ${KEY} from draft`); process.exit(1); }

mkdirSync(BK, { recursive: true });
writeFileSync(`${BK}/page.impact.json.pre-copy-reframe`, raw);
console.log(`snapshot → ${BK}/page.impact.json.pre-copy-reframe (${raw.length} bytes)`);

const doc = JSON.parse(raw);
const before = JSON.parse(raw);           // untouched reference for the diff guard
const s = doc.sections?.main?.settings;
if (!s) { console.error('✗ sections.main.settings not found'); process.exit(1); }

let applied = 0;
for (const [id, oldV, newV] of EDITS) {
  if (s[id] === newV) { console.log(`· ${id} already set`); continue; }
  if (s[id] !== oldV) {
    console.error(`✗ ABORT — ${id} does not hold the expected value.`);
    console.error(`   expected: ${JSON.stringify(oldV)}`);
    console.error(`   found:    ${JSON.stringify(s[id])}`);
    console.error('   Someone edited this in the theme editor. Re-read before re-running.');
    process.exit(1);
  }
  s[id] = newV;
  applied++;
  console.log(`✓ ${id}\n    - ${oldV}\n    + ${newV}`);
}

// Diff guard: nothing outside the EDITS list may have moved.
const touched = new Set(EDITS.map(e => e[0]));
const walk = (a, b, path = '') => {
  const keys = new Set([...Object.keys(a || {}), ...Object.keys(b || {})]);
  for (const k of keys) {
    const p = path ? `${path}.${k}` : k;
    const av = a?.[k], bv = b?.[k];
    if (av && bv && typeof av === 'object' && typeof bv === 'object') { walk(av, bv, p); continue; }
    if (JSON.stringify(av) !== JSON.stringify(bv) && !touched.has(k)) {
      console.error(`✗ ABORT — unexpected change at ${p}`);
      process.exit(1);
    }
  }
};
walk(before, doc);
console.log(`\ndiff guard: only the ${applied} intended settings changed`);

if (DRY) { console.log('\n--dry-run — nothing written'); process.exit(0); }

await putAsset(DRAFT, KEY, JSON.stringify(doc, null, 2));
console.log('pushed to DRAFT');

// Read back and verify semantically (Shopify reformats JSON — byte identity is the wrong test).
const back = JSON.parse(await getAsset(DRAFT, KEY));
const bs = back.sections?.main?.settings || {};
const bad = EDITS.filter(([id, , newV]) => bs[id] !== newV);
if (bad.length) {
  console.error('✗ READ-BACK MISMATCH:', bad.map(b => b[0]).join(', '));
  process.exit(1);
}
console.log(`✓ read-back verified — ${EDITS.length}/${EDITS.length} settings match`);
