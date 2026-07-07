import { readFileSync } from 'fs';
const cfg = JSON.parse(readFileSync(process.env.HOME + '/.claude.json', 'utf8'));
function findToken(o){if(o&&typeof o==='object'){if(o.SHOPIFY_ACCESS_TOKEN)return o.SHOPIFY_ACCESS_TOKEN;for(const k of Object.keys(o)){const r=findToken(o[k]);if(r)return r;}}return null;}
const TOKEN=findToken(cfg);
const FILES=process.argv.slice(2);
const res=await fetch('https://bamboo-bicycle-club-london-uk.myshopify.com/admin/api/2024-10/graphql.json',{method:'POST',headers:{'Content-Type':'application/json','X-Shopify-Access-Token':TOKEN},body:JSON.stringify({query:`query($id:ID!,$f:[String!]){theme(id:$id){files(filenames:$f,first:20){nodes{filename body{... on OnlineStoreThemeFileBodyText{content}}}}}}`,variables:{id:'gid://shopify/OnlineStoreTheme/196820238710',f:FILES}})});
const j=await res.json();
let seen=new Set();
for(const n of j.data.theme.files.nodes){
  seen.add(n.filename);
  const local=readFileSync('./theme-196820238710/'+n.filename,'utf8');
  console.log(n.filename, local===n.body.content?'IDENTICAL':'*** MISMATCH ***');
}
for(const f of FILES) if(!seen.has(f)) console.log(f,'*** NOT FOUND ON THEME ***');
