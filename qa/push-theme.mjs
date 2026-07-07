// Push listed files from local dir to the Shopify theme via themeFilesUpsert
import { readFileSync } from 'fs';
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
const THEME = 'gid://shopify/OnlineStoreTheme/196820238710';
const DIR = process.argv[2];
const FILES = process.argv.slice(3);
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
