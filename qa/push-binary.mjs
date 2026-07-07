import { readFileSync } from 'fs';
import { join } from 'path';
const cfg = JSON.parse(readFileSync(process.env.HOME + '/.claude.json', 'utf8'));
function ft(o){if(o&&typeof o==='object'){if(o.SHOPIFY_ACCESS_TOKEN)return o.SHOPIFY_ACCESS_TOKEN;for(const k of Object.keys(o)){const r=ft(o[k]);if(r)return r;}}return null;}
const TOKEN=ft(cfg);
const THEME='gid://shopify/OnlineStoreTheme/196820238710';
const DIR=process.argv[2]; const FILES=process.argv.slice(3);
const M=`mutation($themeId: ID!, $files: [OnlineStoreThemeFilesUpsertFileInput!]!) {
  themeFilesUpsert(themeId: $themeId, files: $files) { upsertedThemeFiles { filename } userErrors { field message } } }`;
for (const f of FILES) {
  const isText = /\.(liquid|json|css|js|svg)$/.test(f);
  const body = isText
    ? { type: 'TEXT', value: readFileSync(join(DIR,f),'utf8') }
    : { type: 'BASE64', value: readFileSync(join(DIR,f)).toString('base64') };
  const res = await fetch('https://bamboo-bicycle-club-london-uk.myshopify.com/admin/api/2024-10/graphql.json',{method:'POST',headers:{'Content-Type':'application/json','X-Shopify-Access-Token':TOKEN},body:JSON.stringify({query:M,variables:{themeId:THEME,files:[{filename:f,body}]}})});
  const j = await res.json();
  const r = j.data?.themeFilesUpsert;
  if (!r || r.userErrors.length) { console.error(f,'ERR',JSON.stringify(j.errors||r?.userErrors)); process.exit(1); }
  console.log('pushed:', f);
}
