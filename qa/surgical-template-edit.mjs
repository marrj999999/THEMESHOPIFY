// A3 — surgical single-string edits to DRAFT templates/*.json.
// templates/*.json is normally never written (hard rule #4: it destroys James's editor content).
// This is the .shopifyignore carve-out ("unless explicitly instructed by James") and is safe only
// because it (a) works from a verbatim backup, (b) applies ONLY the named replacements, and
// (c) aborts if the diff is wider than those lines. It never rewrites the file wholesale.
import { readFileSync, writeFileSync } from 'fs';
import { getAsset, putAsset, DRAFT, sleep } from './shopify-api.mjs';

const DATE = new Date().toISOString().slice(0, 10);
const BK = `qa/evidence/${DATE}/pre-push`;

// Authority: vault System/Claims Register.md (canonical, updated 2026-07-24).
//  · "nationally recognised" is banned — OCN bespoke courses are not Ofqual-regulated.
//  · exact Level 2 title is "Workshop Skills and Sustainable Manufacturing".
//  · the schools "Level 1 Award (Practical Manufacturing Skills)" wording stands on James's
//    authority (2026-07-24) and is deliberately left untouched.
const EDITS = [
  ['templates/page.build-to-bond.json', [
    ['an OCN Level 2 in Sustainable Design & Manufacturing — a nationally recognised qualification.',
     'an OCN Level 2 in Workshop Skills and Sustainable Manufacturing — a recognised qualification.'],
  ]],
  ['templates/page.theory-of-change.json', [
    ['a nationally recognised OCN qualification', 'a recognised OCN qualification'],
  ]],
];

const diffLines = (a, b) => {
  const A = a.split('\n'), B = b.split('\n');
  let n = 0;
  for (let i = 0; i < Math.max(A.length, B.length); i++) if (A[i] !== B[i]) n++;
  return n;
};

let failed = false;
for (const [key, subs] of EDITS) {
  const backupPath = `${BK}/${key.replace(/\//g, '_')}`;
  const before = readFileSync(backupPath, 'utf8');       // verbatim pre-edit bytes
  const live = await getAsset(DRAFT, key);
  if (live !== before) { console.error(`✗ ${key}: draft changed since snapshot — re-snapshot before editing`); failed = true; continue; }

  let after = before, applied = 0;
  for (const [from, to] of subs) {
    if (!after.includes(from)) { console.error(`✗ ${key}: source string not found — aborting\n    ${from.slice(0, 90)}`); failed = true; break; }
    after = after.split(from).join(to); applied++;
  }
  if (failed) continue;

  const changed = diffLines(before, after);
  if (changed !== subs.length) { console.error(`✗ ${key}: expected ${subs.length} changed line(s), got ${changed} — aborting`); failed = true; continue; }
  if (/[Nn]ationally recognised/.test(after)) { console.error(`✗ ${key}: banned phrase still present after edit`); failed = true; continue; }

  await putAsset(DRAFT, key, after);
  await sleep(400);
  const verify = await getAsset(DRAFT, key);
  const ok = verify === after;
  console.log(`${ok ? '✓' : '✗'} ${key}: ${applied} replacement(s), ${changed} line(s) changed, read-back ${ok ? 'identical' : 'MISMATCH'}`);
  if (!ok) failed = true;
  writeFileSync(`${BK}/${key.replace(/\//g, '_')}.after`, after);
}
process.exit(failed ? 1 : 0);
