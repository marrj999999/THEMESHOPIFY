// Shared Shopify Admin API helpers for the QA tooling.
// Token is read from ~/.claude.json the same way qa/push-theme.mjs does it.
import { readFileSync } from 'fs';

const cfg = JSON.parse(readFileSync(process.env.HOME + '/.claude.json', 'utf8'));
function findToken(o) {
  if (o && typeof o === 'object') {
    if (o.SHOPIFY_ACCESS_TOKEN) return o.SHOPIFY_ACCESS_TOKEN;
    for (const k of Object.keys(o)) { const r = findToken(o[k]); if (r) return r; }
  }
  return null;
}

export const TOKEN = findToken(cfg);
export const STORE = 'bamboo-bicycle-club-london-uk.myshopify.com';
export const DRAFT = '196820238710';   // CUSTOMTHEME20262 — the only theme this tooling writes to
export const LIVE = '196739727734';    // role:main — READ ONLY here

const H = { 'X-Shopify-Access-Token': TOKEN };

export async function getAsset(themeId, key) {
  const url = `https://${STORE}/admin/api/2024-10/themes/${themeId}/assets.json?asset[key]=${encodeURIComponent(key)}`;
  const r = await fetch(url, { headers: H });
  if (!r.ok) return null;
  const j = await r.json();
  return j.asset?.value ?? null;
}

export async function listAssets(themeId) {
  const r = await fetch(`https://${STORE}/admin/api/2024-10/themes/${themeId}/assets.json`, { headers: H });
  if (!r.ok) throw new Error(`listAssets ${themeId}: HTTP ${r.status}`);
  return (await r.json()).assets;
}

// Writes are DRAFT-only by construction — passing any other theme id throws.
export async function putAsset(themeId, key, value) {
  if (String(themeId) !== DRAFT) throw new Error(`refusing to write to theme ${themeId}; this tooling writes to DRAFT ${DRAFT} only`);
  const url = `https://${STORE}/admin/api/2024-10/themes/${themeId}/assets.json`;
  const r = await fetch(url, {
    method: 'PUT', headers: { ...H, 'Content-Type': 'application/json' },
    body: JSON.stringify({ asset: { key, value } }),
  });
  const body = await r.text();
  if (!r.ok) throw new Error(`putAsset ${key}: HTTP ${r.status} ${body.slice(0, 300)}`);
  return JSON.parse(body).asset;
}

export const sleep = ms => new Promise(r => setTimeout(r, ms));
