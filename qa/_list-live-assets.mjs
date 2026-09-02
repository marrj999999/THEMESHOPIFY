import { readFileSync } from 'fs';
const cfg=JSON.parse(readFileSync(process.env.HOME+'/.claude.json','utf8'));
function ft(o){if(o&&typeof o==='object'){if(o.SHOPIFY_ACCESS_TOKEN)return o.SHOPIFY_ACCESS_TOKEN;for(const k of Object.keys(o)){const r=ft(o[k]);if(r)return r;}}return null;}
const T=ft(cfg), S='bamboo-bicycle-club-london-uk.myshopify.com';
const Q=`query($id:ID!,$c:String){theme(id:$id){files(first:250,after:$c){nodes{filename}pageInfo{hasNextPage endCursor}}}}`;
let after=null, all=[];
do{
  const r=await fetch(`https://${S}/admin/api/2024-10/graphql.json`,{method:'POST',
    headers:{'Content-Type':'application/json','X-Shopify-Access-Token':T},
    body:JSON.stringify({query:Q,variables:{id:'gid://shopify/OnlineStoreTheme/196820238710',c:after}})});
  const j=await r.json();
  if(j.errors){console.error(JSON.stringify(j.errors));process.exit(1);}
  const f=j.data.theme.files; all.push(...f.nodes.map(n=>n.filename));
  after=f.pageInfo.hasNextPage?f.pageInfo.endCursor:null;
}while(after);
console.log(all.filter(f=>/logo/i.test(f)).join('\n'));
