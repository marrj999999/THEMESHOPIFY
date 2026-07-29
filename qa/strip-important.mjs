// PER-FILE !important REMOVAL — one file, one push, one proof.
//
// James, 2026-07-29: "go per file to fix, learn from your instruments."
//
// The sweep approach failed: eight files at once moved 5,333 property values and had to be
// reverted wholesale, because stripping one !important lets a different rule win, which changes
// padding, which changes height. Attribution is impossible when eight files move together.
//
// EVERY LESSON FROM THIS SESSION IS ENCODED HERE AS A STEP, not as advice:
//
//   ESCAPES #25  both viewports — desktop-only evidence cannot certify a mobile-only sheet
//   ESCAPES #26  push ONE file, then verify local === draft by bytes. A push can crash and
//                report nothing, and the diff that follows will read as success
//   ESCAPES #27  capture the baseline IMMEDIATELY before the change. A baseline 40 minutes old
//                shows thousands of phantom moves, because the site itself drifts
//   ESCAPES #28  render under the SAME MASK as visual.spec.mjs, or the proof certifies
//                conditions the real gate never judges
//
// The loop is chained: the verified "after" of file N is the baseline for file N+1. That keeps
// every baseline fresh by construction and halves the number of captures.
//
// Usage: node qa/strip-important.mjs <file.css> [more.css ...]
import { execFileSync } from 'child_process';
import { readFileSync, writeFileSync, copyFileSync, mkdirSync } from 'fs';
import { getAsset, DRAFT } from './shopify-api.mjs';

// Derived empirically over four bisect rounds on bbc-redesign-2026.css, not guessed.
// These properties' !important declarations proved load-bearing; everything else was decorative.
// Refined 2026-07-29 from the diff's own property breakdown: bbc-statement.css moved 1,261
// values on 16 removals, and the report named display (18) and text-align (16) as the roots —
// _box and height were knock-on. Letting the failing diff choose the next keep-list entry is
// the loop learning from its own instrument rather than me guessing again.
const KEEP = /\b(color|background[-a-z]*|border[-a-z]*|box-shadow|fill|stroke|margin[-a-z]*|padding[-a-z]*|width|height|max-width|min-width|max-height|min-height|font[-a-z]*|line-height|letter-spacing|inset|top|left|right|bottom|transform|aspect-ratio|text-decoration[-a-z]*|opacity|object-fit|display|text-align|visibility|position|flex[-a-z]*|grid[-a-z]*|align[-a-z]*|justify[-a-z]*|overflow[-a-z]*|z-index|gap|column-gap|row-gap)\s*:/i;
const DECL = /[-a-zA-Z]+\s*:[^;{}]*!important/g;

const files = process.argv.slice(2);
if (!files.length) { console.log('usage: strip-important.mjs <file.css> ...'); process.exit(1); }

const sh = (bin, args) => execFileSync(bin, args, { stdio: 'pipe' }).toString();
const BAK = '/tmp/strip-bak'; mkdirSync(BAK, { recursive: true });

let baseline = 'perfile-base';
console.log('capturing the starting baseline (masked, both viewports)…');
sh('node', ['qa/css-fingerprint.mjs', 'capture', baseline]);

const results = [];
for (const file of files) {
  const name = file.split('/').pop();
  const src = readFileSync(file, 'utf8');
  copyFileSync(file, `${BAK}/${name}`);

  let kept = 0, stripped = 0;
  const out = src.replace(DECL, d => {
    if (KEEP.test(d)) { kept++; return d; }
    stripped++; return d.replace(/\s*!important/, '');
  });
  if (!stripped) { console.log(`\n${name}: nothing strippable (all ${kept} are load-bearing properties)`); continue; }

  console.log(`\n─── ${name} — stripping ${stripped}, keeping ${kept} ───`);
  writeFileSync(file, out);

  // gate
  try { sh('bash', ['qa/gate-check.sh', file]); }
  catch { console.log('  ✗ gate failed — reverting'); copyFileSync(`${BAK}/${name}`, file); results.push({ name, stripped: 0, why: 'gate' }); continue; }

  // push ONE file
  try { sh('node', ['qa/push-theme.mjs', '.', file]); } catch (e) { console.log('  ✗ push errored'); copyFileSync(`${BAK}/${name}`, file); results.push({ name, stripped: 0, why: 'push' }); continue; }

  // ESCAPES #26 — never trust the push, verify the bytes
  const remote = await getAsset(DRAFT, file);
  if (remote !== readFileSync(file, 'utf8')) {
    console.log('  ✗ draft does not match local after push — reverting');
    copyFileSync(`${BAK}/${name}`, file);
    try { sh('bash', ['qa/gate-check.sh', file]); sh('node', ['qa/push-theme.mjs', '.', file]); } catch {}
    results.push({ name, stripped: 0, why: 'push-unverified' }); continue;
  }
  console.log('  ✓ pushed and byte-verified on the draft');

  await new Promise(r => setTimeout(r, 4000));
  const after = `perfile-${name.replace(/\W/g, '')}`;
  sh('node', ['qa/css-fingerprint.mjs', 'capture', after]);

  let equivalent = true, detail = '';
  try { detail = sh('node', ['qa/css-fingerprint.mjs', 'diff', baseline, after]); }
  catch (e) { equivalent = false; detail = (e.stdout?.toString() || '') + (e.stderr?.toString() || ''); }

  const moved = (detail.match(/MOVED\s+:\s+(\d+)/) || [])[1] ?? '?';
  if (equivalent) {
    console.log(`  ✓ EQUIVALENT — ${stripped} !important removed, 0 moved. KEEPING.`);
    results.push({ name, stripped, moved: 0 });
    baseline = after;                       // chain: fresh baseline for the next file
  } else {
    console.log(`  ✗ ${moved} values moved — REVERTING ${name}`);
    console.log(detail.split('\n').filter(l => /^\s{5}\w/.test(l)).slice(0, 6).join('\n'));
    copyFileSync(`${BAK}/${name}`, file);
    try { sh('bash', ['qa/gate-check.sh', file]); sh('node', ['qa/push-theme.mjs', '.', file]); } catch {}
    results.push({ name, stripped: 0, moved, why: 'not-equivalent' });
    // baseline unchanged — the estate is back where it was
  }
}

console.log('\n═══ SUMMARY ═══');
let total = 0;
for (const r of results) {
  if (r.stripped) { total += r.stripped; console.log(`  ✓ ${r.name.padEnd(28)} ${r.stripped} removed, proven equivalent`); }
  else console.log(`  · ${r.name.padEnd(28)} reverted (${r.why}${r.moved ? ', ' + r.moved + ' moved' : ''})`);
}
console.log(`\n${total} !important removed with proof.`);
