// Pull all text files from a Shopify theme to a local dir for auditing
import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import { dirname, join } from 'path';

const cfg = JSON.parse(readFileSync(process.env.HOME + '/.claude.json', 'utf8'));
function findToken(o) {
  if (o && typeof o === 'object') {
    if (o.SHOPIFY_ACCESS_TOKEN) return o.SHOPIFY_ACCESS_TOKEN;
    for (const k of Object.keys(o)) { const r = findToken(o[k]); if (r) return r; }
  }
  return null;
}
const TOKEN = findToken(cfg);
if (!TOKEN) { console.error('no token'); process.exit(1); }

const STORE = 'bamboo-bicycle-club-london-uk.myshopify.com';
const THEME = 'gid://shopify/OnlineStoreTheme/196820238710';
const OUT = process.argv[2] || './theme-196820238710';

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

const Q = `query($id: ID!, $after: String) {
  theme(id: $id) {
    files(first: 50, after: $after) {
      pageInfo { hasNextPage endCursor }
      nodes {
        filename
        body {
          __typename
          ... on OnlineStoreThemeFileBodyText { content }
        }
      }
    }
  }
}`;

let after = null, count = 0, skipped = 0;
for (;;) {
  const d = await gql(Q, { id: THEME, after });
  const f = d.theme.files;
  for (const n of f.nodes) {
    if (n.body.__typename === 'OnlineStoreThemeFileBodyText') {
      const p = join(OUT, n.filename);
      mkdirSync(dirname(p), { recursive: true });
      writeFileSync(p, n.body.content);
      count++;
    } else skipped++;
  }
  if (!f.pageInfo.hasNextPage) break;
  after = f.pageInfo.endCursor;
}
console.log(`saved ${count} text files, skipped ${skipped} binary, to ${OUT}`);
