// LIQUID SYNTAX GATE — the check gate-check.sh never had.
//
// James, 2026-07-31. Found the hard way: an unbalanced `{%- endif -%}` in bbc-impact-2026.liquid
// passed gate-check cleanly and was caught only by the Shopify API on push — which then PARTIALLY
// SUCCEEDED, landing the CSS and the snippet while rejecting the section, leaving the draft in a
// mismatched state until it was noticed.
//
// A naive tag counter is not good enough either: counting `{% if %}` against `{% endif %}` reports
// false positives, because the words `schema` and `comment` appear inside comment prose and get
// counted as opening tags. This walks a stack and SKIPS the body of comment/schema/javascript/
// stylesheet blocks, which is where that prose lives.
//
// Shopify's own parser remains the authority — this catches the common case before a push, so a
// broken file never reaches a half-applied deploy.
//
// Usage: node qa/liquid-check.mjs [file ...]
import { readFileSync, readdirSync } from 'fs';
import { join } from 'path';

const listLiquid = dir => {
  try { return readdirSync(dir).filter(f => f.endsWith('.liquid')).map(f => join(dir, f)); }
  catch { return []; }
};

const ARGS = process.argv.slice(2).filter(a => !a.startsWith('--'));
const targets = ARGS.length ? ARGS
  : [...listLiquid('sections'), ...listLiquid('snippets'), ...listLiquid('layout'), ...listLiquid('blocks')];

// Blocks whose CONTENTS are not Liquid and must not be parsed for tags.
const RAW = new Set(['comment', 'schema', 'javascript', 'stylesheet', 'raw']);
const PAIRED = new Set(['if', 'unless', 'for', 'case', 'capture', 'form', 'paginate', 'tablerow', ...RAW]);

let bad = 0, checked = 0;
for (const file of targets) {
  let src;
  try { src = readFileSync(file, 'utf8'); } catch { continue; }
  checked++;
  const stack = [];
  const errs = [];
  const re = /\{%-?\s*(end)?([a-z_]+)/gi;
  let m, skipUntil = null, rawDepth = 0;

  while ((m = re.exec(src))) {
    const isEnd = !!m[1], tag = m[2].toLowerCase();
    const line = src.slice(0, m.index).split('\n').length;

    // Inside a raw block, ignore everything except its own closing tag — but COUNT DEPTH.
    // Documentation comments routinely contain example `{% comment %}…{% endcomment %}` pairs as
    // prose (snippets/bbc-rd-video.liquid has two). Without depth tracking the first inner
    // endcomment closes the outer block and the file reads as unbalanced when the author's intent
    // is plain. Liquid itself does not nest comments, so this is deliberately more forgiving than
    // the engine: the job here is catching a genuine authoring mistake, not modelling the parser.
    if (skipUntil) {
      if (tag === skipUntil) {
        if (isEnd) { if (--rawDepth === 0) { skipUntil = null; stack.pop(); } }
        else rawDepth++;
      }
      continue;
    }
    if (!PAIRED.has(tag)) continue;

    if (isEnd) {
      const top = stack.pop();
      if (!top) errs.push(`line ${line}: end${tag} with nothing open`);
      else if (top.tag !== tag) errs.push(`line ${line}: end${tag} closes ${top.tag} opened at line ${top.line}`);
    } else {
      stack.push({ tag, line });
      if (RAW.has(tag)) { skipUntil = tag; rawDepth = 1; }
    }
  }
  for (const s of stack) errs.push(`line ${s.line}: ${s.tag} never closed`);

  if (errs.length) {
    bad++;
    console.log(`✗ ${file}`);
    errs.slice(0, 4).forEach(e => console.log(`    ${e}`));
  }
}

console.log(`\nliquid syntax: ${checked - bad}/${checked} files balanced`);
if (!checked) { console.log('✗ CHECKED NOTHING — cannot certify anything'); process.exit(1); }
if (bad) { console.log('✗ fix before pushing — a rejected section can leave a partially-applied deploy'); process.exit(1); }
console.log('✓ every liquid file parses with balanced block tags');
