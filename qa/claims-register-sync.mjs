// CLAIMS REGISTER SYNC — the vault is the source of truth; the gates must keep up with it.
//
// Escape #8 (2026-07-24): the vault's `System/Claims Register.md` gives the OCN course title as
// "Workshop Skills and Sustainable Manufacturing". The theme published "Sustainable Design &
// Manufacturing" in 14 places and the correct title in none — because no gate encoded the
// register. Hand-maintained lists drift from a document James edits.
//
// Design choice: this does NOT auto-generate regexes from prose — that is fragile and would
// silently produce patterns nobody reviewed. Instead it ASSERTS COVERAGE: every "Do not publish"
// term in the register must be matched by a pattern in qa/banned-claims.mjs. A human writes the
// regex precisely; the machine guarantees nothing in the register goes unguarded.
//
// Usage: node qa/claims-register-sync.mjs [--quiet]
import { readFileSync, existsSync } from 'fs';
import { homedir } from 'os';
import { join } from 'path';
import { BANNED } from './banned-claims.mjs';

const REGISTER = join(homedir(), 'Documents', 'Bamboo bicycle club', 'System', 'Claims Register.md');

if (!existsSync(REGISTER)) {
  console.error(`✗ Claims Register not found at ${REGISTER}`);
  console.error('  The vault is the canonical source (global rules). Without it this check cannot run.');
  process.exit(2);
}

const src = readFileSync(REGISTER, 'utf8');

// Parse the "Prohibited or superseded claims" table — first column is the banned wording.
const section = src.split(/^## Prohibited or superseded claims\s*$/m)[1] || '';
const rows = section.split('\n').filter(l => l.trim().startsWith('|') && !/^\|\s*-+/.test(l.trim()));

const terms = [];
for (const row of rows) {
  const first = row.split('|')[1]?.trim();
  if (!first || /^Do not publish$/i.test(first)) continue;
  // Each cell may list alternatives separated by "/" or "or"; keep the bolded/quoted fragments,
  // which are the actual publishable strings rather than the surrounding explanation.
  const bold = [...first.matchAll(/\*\*(.+?)\*\*/g)].map(m => m[1].trim());
  const quoted = [...first.matchAll(/[“"]([^”"]+)[”"]/g)].map(m => m[1].trim());
  const found = [...bold, ...quoted];
  if (found.length) terms.push(...found);
  else terms.push(first.replace(/\*\*/g, '').trim());
}

// Split "A / B" alternatives into separate terms, and drop anything too vague to pattern-match.
const expanded = terms
  .flatMap(t => t.split(/\s*\/\s*(?=[A-Z£0-9“"])/))
  .map(t => t.replace(/^[“"]|[”"]$/g, '').trim())
  .filter(t => t.length > 3 && t.length < 80);

const uncovered = expanded.filter(t => !BANNED.some(re => re.test(t)));

const quiet = process.argv.includes('--quiet');
if (!quiet) {
  console.log(`Claims Register: ${expanded.length} prohibited terms parsed`);
  expanded.forEach(t => console.log(`  ${BANNED.some(re => re.test(t)) ? '✓' : '✗'} ${t}`));
}

if (uncovered.length) {
  console.error(`\n✗ ${uncovered.length} register term(s) NOT covered by qa/banned-claims.mjs:`);
  uncovered.forEach(t => console.error(`    ${t}`));
  console.error('\nAdd a reviewed pattern to BANNED for each. The register is canonical — if James');
  console.error('prohibits a claim there, the gates must be able to catch it.');
  process.exit(1);
}
console.log(`\n✓ every prohibited term in the Claims Register is covered by a gate pattern`);
