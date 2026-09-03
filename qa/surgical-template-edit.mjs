// A3 — surgical single-string edits to DRAFT templates/*.json.
//
// templates/*.json is normally NEVER written (hard rule #4: it destroys James's editor content).
// This runs only under the .shopifyignore carve-out ("unless explicitly instructed by James").
// It is safe because it (a) works from a verbatim pre-edit snapshot, (b) applies ONLY the exact
// replacements listed below, and (c) aborts if the resulting diff is wider than those lines.
// It never rewrites a file wholesale and never touches a string it was not told about.
//
// Authority for every replacement: vault System/Claims Register.md (canonical, updated 2026-07-24)
//   · "nationally recognised" is banned — OCN bespoke courses are not Ofqual-regulated.
//   · Exact Level 2 title: "Workshop Skills and Sustainable Manufacturing" (course ID 1130735).
//   · The schools "Level 1 Award (Practical Manufacturing Skills)" wording stands on James's
//     authority (2026-07-24) and is deliberately left untouched.
//
// DELIBERATELY NOT EDITED:
//   · templates/page.about.json — /pages/about 404s; tracker marks the template for retirement.
//   · "prisoners" in page.impact.json — a verbatim Inside Time press quote, that paper's own
//     description of itself, and an attributed ministerial quote. Altering quotations would
//     misrepresent the sources; the voice rule governs how we describe OUR Makers.
//
// Usage: node qa/surgical-template-edit.mjs [--dry-run]
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { getAsset, putAsset, DRAFT, sleep } from './shopify-api.mjs';

const DRY = process.argv.includes('--dry-run');
const DATE = new Date().toISOString().slice(0, 10);
const BK = `qa/evidence/${DATE}/pre-push`;

const TITLE_BAD = 'Sustainable Design & Manufacturing';
const TITLE_GOOD = 'Workshop Skills and Sustainable Manufacturing';

const EDITS = [
  ['templates/page.build-to-bond.json', [
    ['OCN — Sustainable Design & Manufacturing', 'OCN — Workshop Skills and Sustainable Manufacturing'],
    ['an OCN Level 2 in Sustainable Design & Manufacturing — a nationally recognised qualification.',
     'an OCN Level 2 in Workshop Skills and Sustainable Manufacturing — a recognised qualification.'],
  ]],
  ['templates/page.theory-of-change.json', [
    ['an OCN Level 2 in Sustainable Design & Manufacturing', 'an OCN Level 2 in Workshop Skills and Sustainable Manufacturing'],
    ['a nationally recognised OCN qualification', 'a recognised OCN qualification'],
    ['Level 2 (Sustainable Design & Manufacturing) in prisons', 'Level 2 (Workshop Skills and Sustainable Manufacturing) in prisons'],
  ]],
  ['templates/page.impact-report.json', [
    ['an OCN Level 2 in Sustainable Design & Manufacturing', 'an OCN Level 2 in Workshop Skills and Sustainable Manufacturing'],
    ['OCN Level 2 (Sustainable Design & Manufacturing) in prisons', 'OCN Level 2 (Workshop Skills and Sustainable Manufacturing) in prisons'],
  ]],
  ['templates/page.impact.json', [
    ['OCN — Sustainable Design & Manufacturing', 'OCN — Workshop Skills and Sustainable Manufacturing'],
  ]],
  ['templates/page.prisons.json', [
    ['"label": "Sustainable Design & Manufacturing"', '"label": "Workshop Skills and Sustainable Manufacturing"'],
  ]],
  // LSBU claims — added 2026-07-24 after qa/claims-register-sync.mjs found them prohibited in the
  // vault register with no gate covering them. The register records a 5 Aug 2025 agreement signed
  // by James but with BLANK LSBU signature/name/date fields, and no counter-signed agreement,
  // asset schedule, valuation, invoice or funding award found — so "£70,000 equipment partnership"
  // and "LSBU Innovation Hub" assert more than the evidence supports about a named third party.
  // "£70,000 equipment partnership" was RENDERING publicly on /pages/support-mission.
  // Replacement derives from the register's own approved framing ("access to a room with jigs in
  // LSBU's engineering labs in late 2025"). James may want to word this himself.
  ['templates/page.support-mission.json', [
    ['£70,000 equipment partnership', 'Engineering lab access, 2025'],
  ]],
  ['templates/page.impact.json', [
    ['"label": "LSBU Innovation Hub"', '"label": "London South Bank University"'],
  ]],
];

const changedLines = (a, b) => {
  const A = a.split('\n'), B = b.split('\n');
  let n = 0;
  for (let i = 0; i < Math.max(A.length, B.length); i++) if (A[i] !== B[i]) n++;
  return n;
};

let failed = false;
for (const [key, subs] of EDITS) {
  const backupPath = `${BK}/${key.replace(/\//g, '_')}`;
  const live = await getAsset(DRAFT, key);
  if (live === null) { console.error(`✗ ${key}: not found on draft`); failed = true; continue; }

  // The rollback artefact is the state immediately BEFORE this run's write. Keep the original
  // pre-pass snapshot if one exists (it is the older, more useful restore point) and additionally
  // stash the current bytes, so a re-run never edits something it has not captured first.
  if (!existsSync(backupPath)) writeFileSync(backupPath, live);
  writeFileSync(`${backupPath}.prerun`, live);
  const before = live;

  // Idempotent: a substitution whose `from` is gone and whose `to` is already present has been
  // applied by an earlier run. Skipping it (rather than aborting) lets this script be re-run
  // safely as new edits are appended — which is how it is actually used.
  let after = before, applied = 0, skipped = 0, abort = false;
  for (const [from, to] of subs) {
    const hits = after.split(from).length - 1;
    if (hits === 0) {
      if (after.includes(to)) { skipped++; continue; }
      console.error(`✗ ${key}: source string not found and replacement not present — aborting\n    "${from.slice(0, 100)}"`);
      abort = true; break;
    }
    after = after.split(from).join(to);
    applied += hits;
  }
  if (abort) { failed = true; continue; }
  if (applied === 0) { console.log(`· ${key}: already up to date (${skipped} edit(s) previously applied)`); continue; }

  const lines = changedLines(before, after);
  if (lines > subs.length) { console.error(`✗ ${key}: ${lines} lines changed, expected ≤${subs.length} — aborting`); failed = true; continue; }
  if (/[Nn]ationally recognised/.test(after)) { console.error(`✗ ${key}: banned phrase still present`); failed = true; continue; }
  if (after.includes(TITLE_BAD)) { console.error(`✗ ${key}: wrong course title still present`); failed = true; continue; }
  if (before.length - after.length > 200) { console.error(`✗ ${key}: suspicious size drop — aborting`); failed = true; continue; }

  if (DRY) { console.log(`· ${key}: WOULD apply ${applied} replacement(s) across ${lines} line(s)`); continue; }

  await putAsset(DRAFT, key, after);
  await sleep(400);
  const verify = await getAsset(DRAFT, key);
  const ok = verify === after;
  console.log(`${ok ? '✓' : '✗'} ${key}: ${applied} replacement(s), ${lines} line(s), read-back ${ok ? 'identical' : 'MISMATCH'}`);
  if (!ok) failed = true; else writeFileSync(`${backupPath}.after`, after);
}
console.log(failed ? '\nFAILED — draft left unchanged for the aborted files (backups in ' + BK + ')' : DRY ? '\ndry-run OK' : '\nall template edits verified');
process.exit(failed ? 1 : 0);
