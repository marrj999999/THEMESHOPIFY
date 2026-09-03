// BLOCK + MOTION STANDARD — is there one, and is it used?
//
// Two contracts already exist on paper: qa/BLOCK-SYSTEM.md (primitives, copy budgets, colour
// grammar) and qa/MOTION.md (four duration roles, two easings, a rise distance). Neither has
// ever been measured against the theme, and both turn out to be largely aspirational:
//
//   * 32 blocks exist; 9 are referenced by a deployed template. 23 were built and never wired in.
//   * The motion tokens are DEFINED in bbc-universal.css §11 and used SIX times, against 273
//     hardcoded transition durations and 35 hardcoded animation durations.
//   * Zero of the 32 blocks apply .rd-reveal, so blocks do not animate at all — only sections do.
//
// Static analysis on purpose: no browser, so it runs in a second and can sit in gate-check later.
// Block USAGE needs the deployed templates, so that part takes a token and is skipped with
// --no-remote.
//
// Usage: node qa/block-standard.mjs [--no-remote]
import { readFileSync, readdirSync, existsSync, writeFileSync, mkdirSync } from 'fs';

const REMOTE = !process.argv.includes('--no-remote');
const SRC = ['assets', 'sections', 'snippets', 'blocks'];

// ---------- motion ----------
// MOTION.md: four duration roles. Anything else is a fifth opinion about "fast".
const ROLES = { '.15s': 'fast', '.22s': 'base', '.45s': 'entrance', '.6s': 'reveal' };
const norm = d => d.replace(/^0/, '');                       // 0.15s -> .15s

let tokenUses = 0, hardTransition = 0, hardAnimation = 0;
const durations = {};
const worstFiles = {};

for (const dir of SRC) {
  if (!existsSync(dir)) continue;
  for (const f of readdirSync(dir)) {
    if (!/\.(css|liquid)$/.test(f)) continue;
    const p = `${dir}/${f}`;
    const s = readFileSync(p, 'utf8');
    tokenUses += (s.match(/var\(--mo-[a-z-]+/g) || []).length;
    for (const re of [/transition[^;{}]*/g, /animation:[^;{}]*/g]) {
      for (const m of s.match(re) || []) {
        if (/var\(--mo-/.test(m)) continue;
        const ds = m.match(/(?:^|[\s(,])(\d*\.?\d+)s/g) || [];
        if (!ds.length) continue;
        if (/^transition/.test(m)) hardTransition++; else hardAnimation++;
        for (const d of ds) {
          const k = norm(d.trim().replace(/^[(,\s]/, ''));
          durations[k] = (durations[k] || 0) + 1;
          worstFiles[p] = (worstFiles[p] || 0) + 1;
        }
      }
    }
  }
}

// ---------- blocks ----------
const blocks = existsSync('blocks') ? readdirSync('blocks').filter(f => f.endsWith('.liquid')).map(f => f.replace('.liquid', '')) : [];
const reveals = blocks.filter(b => /rd-reveal/.test(readFileSync(`blocks/${b}.liquid`, 'utf8')));

let used = null, dead = null;
if (REMOTE) {
  const cfg = JSON.parse(readFileSync(process.env.HOME + '/.claude.json', 'utf8'));
  const find = o => { if (o && typeof o === 'object') { if (o.SHOPIFY_ACCESS_TOKEN) return o.SHOPIFY_ACCESS_TOKEN;
    for (const k of Object.keys(o)) { const r = find(o[k]); if (r) return r; } } return null; };
  const TOKEN = find(cfg);
  const S = 'bamboo-bicycle-club-london-uk.myshopify.com', T = '196820238710';
  const H = { 'X-Shopify-Access-Token': TOKEN };
  const list = await (await fetch(`https://${S}/admin/api/2024-10/themes/${T}/assets.json`, { headers: H })).json();
  const tpl = list.assets.filter(a => /^templates\/.*\.json$/.test(a.key) || /^sections\/.*-group\.json$/.test(a.key)).map(a => a.key);
  let blob = '';
  for (const k of tpl) {
    const j = await (await fetch(`https://${S}/admin/api/2024-10/themes/${T}/assets.json?asset[key]=${encodeURIComponent(k)}`, { headers: H })).json();
    if (j.asset) blob += j.asset.value + '\n';
  }
  used = blocks.filter(b => new RegExp('"type"\\s*:\\s*"' + b + '"').test(blob));
  dead = blocks.filter(b => !used.includes(b));
}

// ---------- report ----------
console.log('\n═══ BLOCK + MOTION STANDARD ═══\n');
console.log('BLOCKS');
console.log(`  in repo                     ${blocks.length}`);
if (used) {
  console.log(`  referenced by a template    ${used.length}   ${used.join(', ')}`);
  console.log(`  built but never wired in    ${dead.length}   ${dead.join(', ')}`);
}
console.log(`  applying .rd-reveal         ${reveals.length} of ${blocks.length}${reveals.length === 0 ? '   ← blocks do not animate at all' : ''}`);

console.log('\nMOTION (contract: qa/MOTION.md — .15 fast · .22 base · .45 entrance · .6 reveal)');
console.log(`  using var(--mo-*)           ${tokenUses}`);
console.log(`  hardcoded transitions       ${hardTransition}`);
console.log(`  hardcoded animations        ${hardAnimation}`);
const adherence = tokenUses + hardTransition + hardAnimation;
console.log(`  token adherence             ${adherence ? (100 * tokenUses / adherence).toFixed(1) : 0}%`);

console.log('\n  distinct hardcoded durations (top 12):');
Object.entries(durations).sort((a, b) => b[1] - a[1]).slice(0, 12).forEach(([d, n]) => {
  const role = ROLES[d];
  console.log(`    ${d.padEnd(8)}${String(n).padStart(5)}   ${role ? 'matches --mo-' + role + ' — should use the token' : 'no role in MOTION.md'}`);
});

console.log('\n  files with the most hardcoded durations:');
Object.entries(worstFiles).sort((a, b) => b[1] - a[1]).slice(0, 6).forEach(([f, n]) => console.log(`    ${String(n).padStart(4)}  ${f}`));

const DAY = new Date().toISOString().slice(0, 10);
mkdirSync(`qa/evidence/${DAY}`, { recursive: true });
writeFileSync(`qa/evidence/${DAY}/block-standard.json`,
  JSON.stringify({ blocks: blocks.length, used, dead, revealBlocks: reveals, tokenUses, hardTransition, hardAnimation, durations }, null, 2));
console.log(`\n→ qa/evidence/${DAY}/block-standard.json`);
