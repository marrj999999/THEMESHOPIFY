// MOTION TOKEN MIGRATION — replace hardcoded durations with the MOTION.md tokens.
//
// Only touches durations INSIDE a transition: or animation: declaration, and only when the
// number is a complete token. A naive replace of ".2s" corrupts "0.25s" and "1.2s" — both
// contain it — so the boundary check is the whole job. Dry-run by default.
//
// Safe by construction only for durations that map EXACTLY to a token's value, so the computed
// style cannot change:  .2s -> --mo-base (after that token was moved to .2s on 2026-08-04),
// .15s -> --mo-fast, .45s -> --mo-entrance, .6s -> --mo-reveal.
// Everything else (.1 .12 .18 .25 .3 .4) is a JUDGEMENT call about which role it belongs to and
// is deliberately NOT automated — it would change timings, which is a design decision.
//
// Usage: node qa/motion-migrate.mjs [--apply] [file ...]
import { readFileSync, writeFileSync } from 'fs';

const APPLY = process.argv.includes('--apply');
const ARGS = process.argv.slice(2).filter(a => !a.startsWith('--'));
const DEFAULT = [
  'assets/bbc-redesign-2026.css', 'sections/bbc-home-2026.liquid',
  'assets/bbc-why-bamboo.css', 'assets/bbc-statement.css',
  'sections/bbc-footer.liquid', 'sections/bbc-header.liquid',
];
const FILES = ARGS.length ? ARGS : DEFAULT;

// exact-value maps only — anything not listed here is left alone on purpose
const MAP = [
  [/(^|[\s(,:])(0?\.2)s(?=[\s,);]|$)/g, '--mo-base'],
  [/(^|[\s(,:])(0?\.15)s(?=[\s,);]|$)/g, '--mo-fast'],
  [/(^|[\s(,:])(0?\.45)s(?=[\s,);]|$)/g, '--mo-entrance'],
  [/(^|[\s(,:])(0?\.6)s(?=[\s,);]|$)/g, '--mo-reveal'],
];

let grand = 0;
for (const f of FILES) {
  let s;
  try { s = readFileSync(f, 'utf8'); } catch { console.log(`  skip (missing) ${f}`); continue; }
  let n = 0;
  // Rewrite only within transition:/animation: declarations, never anywhere else.
  const out = s.replace(/(transition|animation)(-duration)?\s*:[^;{}]*/g, decl => {
    if (/var\(--mo-/.test(decl)) return decl;          // already migrated
    let d = decl;
    for (const [re, token] of MAP) {
      d = d.replace(re, (m, pre) => { n++; return `${pre}var(${token})`; });
    }
    return d;
  });
  grand += n;
  console.log(`  ${String(n).padStart(4)}  ${f}`);
  if (APPLY && n) writeFileSync(f, out);
}
console.log(`\n  ${grand} duration(s) ${APPLY ? 'MIGRATED' : 'would migrate (dry run — pass --apply)'}`);
