// Push listed files from local dir to the Shopify theme via themeFilesUpsert
import { readFileSync } from 'fs';
// GATE GUARD (2026-07-12): refuse to push unless qa/gate-check.sh passed <10 min ago
import { statSync, existsSync } from 'fs';
const tok = new URL('./.gate-pass', import.meta.url).pathname;
if (!existsSync(tok) || (Date.now() - statSync(tok).mtimeMs) > 600000) {
  console.error('✗ BLOCKED: run qa/gate-check.sh <changed files> first (token missing/stale).');
  process.exit(1);
}

import { join } from 'path';

const cfg = JSON.parse(readFileSync(process.env.HOME + '/.claude.json', 'utf8'));
function findToken(o) {
  if (o && typeof o === 'object') {
    if (o.SHOPIFY_ACCESS_TOKEN) return o.SHOPIFY_ACCESS_TOKEN;
    for (const k of Object.keys(o)) { const r = findToken(o[k]); if (r) return r; }
  }
  return null;
}
const TOKEN = findToken(cfg);
const STORE = 'bamboo-bicycle-club-london-uk.myshopify.com';
// 2026-09-02: optional --theme=<numeric id> targets a PREVIEW duplicate instead of live.
// The default stays the live theme so existing call sites behave as before.
const themeArg = process.argv.find(a => a.startsWith('--theme='));
const THEME = 'gid://shopify/OnlineStoreTheme/' + (themeArg ? themeArg.split('=')[1] : '196820238710');
const argv = process.argv.filter(a => !a.startsWith('--theme='));
const DIR = argv[2];
const FILES = argv.slice(3);
console.log('target theme:', THEME.split('/').pop(), themeArg ? '(preview override)' : '(LIVE)');
if (!DIR || !FILES.length) { console.error('usage: push-theme.mjs <dir> <file...>'); process.exit(1); }

async function gql(query, variables) {
  const res = await fetch(`https://${STORE}/admin/api/2024-10/graphql.json`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-Shopify-Access-Token': TOKEN },
    body: JSON.stringify({ query, variables }),
  });
  const j = await res.json();
  if (j.errors) throw new Error(JSON.stringify(j.errors));
  return j.data;
}

const M = `mutation($themeId: ID!, $files: [OnlineStoreThemeFilesUpsertFileInput!]!) {
  themeFilesUpsert(themeId: $themeId, files: $files) {
    upsertedThemeFiles { filename }
    userErrors { field message }
  }
}`;

for (const f of FILES) {
  const content = readFileSync(join(DIR, f), 'utf8');
  const d = await gql(M, { themeId: THEME, files: [{ filename: f, body: { type: 'TEXT', value: content } }] });
  const r = d.themeFilesUpsert;
  if (r.userErrors.length) { console.error(f, 'ERRORS:', JSON.stringify(r.userErrors)); process.exit(1); }
  console.log('pushed:', r.upsertedThemeFiles.map(x => x.filename).join(', '));
}
