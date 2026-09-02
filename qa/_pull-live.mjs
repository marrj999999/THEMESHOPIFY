// Pull my changed files from the PREVIEW theme into a staging dir, byte-for-byte.
import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
const cfg = JSON.parse(readFileSync(process.env.HOME + '/.claude.json', 'utf8'));
function findToken(o){ if(o&&typeof o==='object'){ if(o.SHOPIFY_ACCESS_TOKEN) return o.SHOPIFY_ACCESS_TOKEN;
  for(const k of Object.keys(o)){ const r=findToken(o[k]); if(r) return r; } } return null; }
const TOKEN=findToken(cfg);
if(!TOKEN){ console.error('✗ no SHOPIFY_ACCESS_TOKEN found'); process.exit(1); }
const STORE='bamboo-bicycle-club-london-uk.myshopify.com';
const PREVIEW='gid://shopify/OnlineStoreTheme/196820238710';
const OUT=process.argv[2];
const FILES=process.argv.slice(3);
const Q=`query($id:ID!,$n:[String!]){theme(id:$id){files(filenames:$n,first:10){nodes{filename size body{... on OnlineStoreThemeFileBodyText{content}}}}}}`;
const res=await fetch(`https://${STORE}/admin/api/2024-10/graphql.json`,{method:'POST',
  headers:{'Content-Type':'application/json','X-Shopify-Access-Token':TOKEN},
  body:JSON.stringify({query:Q,variables:{id:PREVIEW,n:FILES}})});
const j=await res.json();
if(j.errors){ console.error('✗',JSON.stringify(j.errors)); process.exit(1); }
const nodes=j.data.theme.files.nodes;
for(const n of nodes){ const p=join(OUT,n.filename); mkdirSync(dirname(p),{recursive:true});
  writeFileSync(p,n.body.content,'utf8'); console.log('pulled:',n.filename,n.size+'b'); }
const got=nodes.map(n=>n.filename);
const missing=FILES.filter(f=>!got.includes(f));
if(missing.length){ console.error('✗ MISSING:',missing.join(', ')); process.exit(1); }
