// CANARY — proof-of-life for every quality gate. Quality Layer 1.
//
// On 2026-07-24 nine gate defects surfaced in one day, all the same shape: a gate reporting
// success while executing nothing. The token ratchet printed its own command as a string. The
// visual suite matched zero tests three different ways. estate-check's BANNED list lacked a
// pattern claim-lint had. Every one of them showed a green tick.
//
// The lesson: a passing gate is not evidence. A gate must first be proven capable of FAILING.
// Each check below feeds a gate a known-bad fixture it MUST reject.
//
//   A canary that PASSES means the gate is DEAD → block the pass.
//
// Usage: node qa/canary.mjs [--skip-visual]
import { execFileSync } from 'child_process';
import { readFileSync, writeFileSync, unlinkSync, mkdtempSync, rmSync } from 'fs';
import { tmpdir } from 'os';
import { join } from 'path';
import { BANNED, CORPUS } from './banned-claims.mjs';

const results = [];
const record = (name, alive, detail = '') => {
  results.push({ name, alive, detail });
  console.log(`${alive ? '✓ ALIVE  ' : '✗ DEAD   '} ${name}${detail ? ' — ' + detail : ''}`);
};

// execFileSync with an argv array — no shell, so a fixture path can never be interpreted as code.
const runs = (bin, args) => {
  try { execFileSync(bin, args, { stdio: 'pipe' }); return { code: 0, out: '' }; }
  catch (e) { return { code: e.status ?? 1, out: (e.stdout?.toString() || '') + (e.stderr?.toString() || '') }; }
};
const claimLint = dir => runs('bash', ['scripts/claim-lint.sh', dir]);

// ── A · claim-lint must reject banned claims ────────────────────────────────────────────────
{
  const dir = mkdtempSync(join(tmpdir(), 'canary-'));
  try {
    writeFileSync(join(dir, 'bad.liquid'), 'Bamboo is 28,000 PSI and a nationally recognised qualification.');
    const r = claimLint(dir);
    record('claim-lint rejects banned claims', r.code !== 0,
      r.code === 0 ? 'accepted "28,000 PSI" + "nationally recognised"' : 'exit 1 as required');
  } finally { rmSync(dir, { recursive: true, force: true }); }
}

// ── B · claim-lint must reject the patterns added today ─────────────────────────────────────
{
  const dir = mkdtempSync(join(tmpdir(), 'canary-'));
  try {
    const missed = [];
    for (const [label, text] of [
      ['Level 1 & 2', 'OCN training (Level 1 & 2) in manufacturing.'],
      ['guaranteed interview', 'Guaranteed interview on release.'],
      ['wrong OCN title', 'OCN Level 2 — Sustainable Design & Manufacturing'],
      ['prisoners', 'Build to Bond helps prisoners build bikes.'],
    ]) {
      writeFileSync(join(dir, 'bad.liquid'), text);
      if (claimLint(dir).code === 0) missed.push(label);
    }
    record('claim-lint rejects the 2026-07-24 additions', missed.length === 0,
      missed.length ? 'MISSED: ' + missed.join(', ') : '4/4 caught');
  } finally { rmSync(dir, { recursive: true, force: true }); }
}

// ── C · claim-lint must NOT reject the documented legitimate uses ───────────────────────────
// A gate that fires on everything is as useless as one that never fires — it gets bypassed.
{
  const dir = mkdtempSync(join(tmpdir(), 'canary-'));
  try {
    writeFileSync(join(dir, 'ok.liquid'),
      'MoJ research: prisoners who receive family visits are 39% less likely to reoffend (Farmer Review).\n' +
      'Voice rule: "Makers", never "prisoners"/"offenders".');
    const r = claimLint(dir);
    record('claim-lint allows documented legitimate uses', r.code === 0,
      r.code === 0 ? 'no false positive' : 'FALSE POSITIVE on approved MoJ framing / rule text');
  } finally { rmSync(dir, { recursive: true, force: true }); }
}

// ── D · estate-check's BANNED must cover the known-bad corpus ───────────────────────────────
// Imported, not text-parsed. The first version of this check scraped regex literals out of the
// source and mis-read the `//` in trailing comments as regex delimiters — reporting two healthy
// gates as dead. A false FAIL is a defect in the canary (escape #10), so the fix was structural:
// one shared module both the gate and this check import.
{
  const missed = CORPUS.filter(s => !BANNED.some(re => re.test(s)));
  record('estate-check BANNED covers known-bad corpus', missed.length === 0,
    missed.length ? 'NOT COVERED: ' + missed.join(', ') : `${BANNED.length} patterns cover ${CORPUS.length}/${CORPUS.length}`);
}

// ── E · claim-lint and estate-check must reject the SAME corpus ─────────────────────────────
// Escape #6 in behavioural form. Comparing the two lists textually is fragile (one is JS regex,
// the other bash ERE); comparing what they DO is not. estate-check now imports the shared list,
// so this asserts claim-lint independently rejects every string too.
{
  const dir = mkdtempSync(join(tmpdir(), 'canary-'));
  try {
    const missed = [];
    for (const s of CORPUS) {
      writeFileSync(join(dir, 'bad.liquid'), `Claim under test: ${s}.`);
      if (claimLint(dir).code === 0) missed.push(s);
    }
    record('claim-lint rejects the same corpus as estate-check', missed.length === 0,
      missed.length ? 'DIVERGED (escape #6 shape) — claim-lint accepts: ' + missed.join(', ')
        : `both gates reject all ${CORPUS.length}`);
  } finally { rmSync(dir, { recursive: true, force: true }); }
}

// ── E2 · the vault Claims Register must be fully covered ────────────────────────────────────
// Escape #8: the register named a course title no gate encoded, so 14 wrong titles shipped.
// This asserts every "Do not publish" term in James's register maps to a BANNED pattern.
{
  const r = runs('node', ['qa/claims-register-sync.mjs', '--quiet']);
  record('vault Claims Register fully covered by gate patterns', r.code === 0,
    r.code === 2 ? 'register not found — vault unavailable' :
      r.code === 0 ? 'every prohibited term has a pattern' : 'UNCOVERED terms — see claims-register-sync output');
}

// ── F · gate-check must reject malformed section schema JSON ────────────────────────────────
{
  const f = 'sections/__canary-bad-schema.liquid';
  try {
    writeFileSync(f, '<div>x</div>\n{% schema %}\n{ "name": "canary", }\n{% endschema %}\n');
    const r = runs('bash', ['qa/gate-check.sh', f]);
    record('gate-check rejects malformed schema JSON', r.code !== 0,
      r.code === 0 ? 'accepted invalid JSON' : 'blocked as required');
  } finally { try { unlinkSync(f); } catch {} }
}

// ── G · token ratchet must reject a new raw literal ─────────────────────────────────────────
{
  const f = 'assets/bbc-__canary.css';
  try {
    writeFileSync(f, '.canary-a{color:#ab12cd}.canary-b{color:#123456}.canary-c{font-size:13.7px}\n');
    const r = runs('bash', ['qa/stylelint-ratchet.sh']);
    record('token ratchet rejects new raw literals', r.code !== 0,
      r.code === 0 ? 'accepted 3 new literals above baseline' : 'blocked as required');
  } finally { try { unlinkSync(f); } catch {} }
}
// The ratchet lowers its baseline on improvement; removing the canary file restores the real
// count. Confirm the canary did not corrupt the baseline on its way through.
{
  const baseline = Number(readFileSync('qa/.stylelint-baseline', 'utf8').trim());
  const r = runs('bash', ['qa/stylelint-ratchet.sh']);
  record('token ratchet baseline intact after canary', r.code === 0 && Number.isFinite(baseline), `baseline ${baseline}`);
}

// ── H · visual net threshold sensitivity (browser; escape #9) ───────────────────────────────
if (!process.argv.includes('--skip-visual')) {
  const r = runs('npx', ['playwright', 'test', '--config=playwright.config.canary.mjs', '--reporter=line']);
  const firstRun = /canary-impact\.png.*(writing actual|is re-generated)/i.test(r.out || '');
  record('visual gate detects a small text change', r.code === 0,
    r.code === 0 ? 'injected label change tripped the comparison'
      : firstRun ? 'baseline just written — re-run to assert detection'
        : 'THRESHOLD TOO LOOSE — raise sensitivity in playwright.config.mjs (maxDiffPixels)');
} else {
  console.log('· skipped visual canary (--skip-visual)');
}

// ── verdict ─────────────────────────────────────────────────────────────────────────────────
const dead = results.filter(r => !r.alive);
console.log(`\n${results.length - dead.length}/${results.length} gates proven capable of failing`);
if (dead.length) {
  console.log('\n✗ DEAD GATES — these report success without checking anything:');
  dead.forEach(d => console.log(`    ${d.name}: ${d.detail}`));
  console.log('\nA dead gate is worse than no gate: it manufactures false confidence. Fix before pushing.');
  process.exit(1);
}
console.log('✓ every gate rejected its known-bad input');
