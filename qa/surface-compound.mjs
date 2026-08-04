// SURFACE COMPOUND — make every dark-band rule also match a single-element band.
//
// ESCAPES #41: `bbc-section` emits `<div class="bbc-rd rd-dark">` — both classes on ONE element.
// Every rule written `.bbc-rd .rd-dark X` (descendant) therefore cannot match, and the whole
// surface system fell through to `.bbc-rd{background:var(--bone)}`. Fixing the four background
// rules made bands genuinely dark for the first time — which in turn exposed ~40 text rules that
// exist precisely to make text readable on dark, and were equally inert.
//
// Leaving them inert now means invisible text: measured on /pages/why-bamboo the moment the
// backgrounds started resolving, a "Shop frame kits" link landed at 1.05:1 (charcoal on forest).
//
// For each rule whose selector list contains `.bbc-rd .rd-dark` (or `.rd-forest`), this appends
// the same selector in compound form. Specificity is identical either way — (0,2,n) both — and
// the copy sits in the SAME rule, so source order is untouched. Nothing that already matched can
// change; only the single-element case gains the declarations it was always meant to have.
//
// Usage: node qa/surface-compound.mjs [--write]   (default is a dry run)
import { readFileSync, writeFileSync } from 'fs';

const FILES = ['assets/bbc-redesign-2026.css', 'assets/bbc-statement.css', 'assets/bbc-universal.css'];
const WRITE = process.argv.includes('--write');
const SURFACES = ['rd-dark', 'rd-forest'];

let total = 0;
for (const file of FILES) {
  const src = readFileSync(file, 'utf8');
  let changed = 0;

  // Walk rule heads only — the text between a `}` (or start, or `{` of an at-rule) and the next
  // `{`. Operating on the whole file would rewrite selectors quoted inside comments and content.
  const out = src.replace(/([};]|^|\*\/)([^{}/]*?)\{/g, (whole, lead, head) => {
    if (!SURFACES.some(s => head.includes(`.bbc-rd .${s}`))) return whole;

    const parts = head.split(',').map(p => p.trim()).filter(Boolean);
    const extra = [];
    for (const p of parts) {
      for (const s of SURFACES) {
        if (!p.includes(`.bbc-rd .${s}`)) continue;
        const compound = p.split(`.bbc-rd .${s}`).join(`.bbc-rd.${s}`);
        // Skip if the file already carries this exact compound selector anywhere — the four
        // background rules were added by hand before this script existed.
        if (compound !== p && !parts.includes(compound) && !src.includes(compound + '{') &&
            !src.includes(compound + ' {') && !src.includes(compound + ',')) extra.push(compound);
      }
    }
    if (!extra.length) return whole;
    changed += extra.length;
    // Indent = the whitespace on the LAST line of the head, not its leading whitespace — the head
    // begins with the newline that followed the previous rule, so `^\s*` would capture that
    // newline and emit a blank line before every generated selector.
    const indent = (head.match(/\n([ \t]*)[^\n]*$/) || [, ''])[1];
    return `${lead}${head.trimEnd()},\n${indent}${extra.join(',\n' + indent)}{`;
  });

  console.log(`${file.padEnd(34)} +${changed} compound selector${changed === 1 ? '' : 's'}`);
  total += changed;
  if (WRITE && changed) writeFileSync(file, out);
}
console.log(`\n${total} total. ${WRITE ? 'WRITTEN' : 'dry run — pass --write to apply'}`);
