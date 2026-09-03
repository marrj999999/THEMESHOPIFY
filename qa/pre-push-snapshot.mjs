// A6a — snapshot current DRAFT bytes for every file a pass is about to touch.
// push-theme.mjs overwrites with no undo; this is the rollback artefact.
// Usage: node qa/pre-push-snapshot.mjs <key ...>
import { mkdirSync, writeFileSync } from 'fs';
import { getAsset, DRAFT, sleep } from './shopify-api.mjs';

const DATE = new Date().toISOString().slice(0, 10);
const OUT = `qa/evidence/${DATE}/pre-push`;
const keys = process.argv.slice(2);
if (!keys.length) { console.error('usage: pre-push-snapshot.mjs <key ...>'); process.exit(1); }

mkdirSync(OUT, { recursive: true });
let ok = 0, missing = 0;
for (const k of keys) {
  const v = await getAsset(DRAFT, k);
  if (v === null) { console.log(`  – ${k} — not on draft (new file, nothing to roll back to)`); missing++; continue; }
  writeFileSync(`${OUT}/${k.replace(/\//g, '_')}`, v);
  console.log(`  ✓ ${k} → ${v.length}b`);
  ok++;
  await sleep(150);
}
console.log(`\nsnapshot: ${ok} saved, ${missing} absent → ${OUT}`);
