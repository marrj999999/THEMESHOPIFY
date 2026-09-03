// CONTENT INDEX — the verified vault archive, cross-referenced to live blog articles.
//
// Regenerate with: node qa/content-index.mjs
//
// WHY THE FILM COLUMN EXISTS
// 19 articles embed a YouTube film, and 13 of them sat unused for months. Not neglect —
// invisibility: the films live in article BODY HTML, and no field, tag or admin view surfaces
// them. bbc-cscard has supported a `video` field since it was built; the data was simply never
// connected because nothing said it was there. Same shape as the milestone blocks that could
// not hold an image and the five sections that could not hold a story card: capability present,
// connection missing, looks like a content problem from outside.
//
// So the index now reports the film ID. Anyone picking stories sees it without having to
// discover it by accident.
import { TOKEN, STORE } from './shopify-api.mjs';
import { readdirSync, writeFileSync, mkdirSync } from 'fs';

const VAULT = process.env.HOME + '/Documents/Bamboo bicycle club/Business/Case Studies/Verified 2026';
const notes = readdirSync(VAULT).filter(f => f.endsWith('.md')).map(f => f.replace(/\.md$/, ''));
const q = r => `{ articles(first:250, sortKey:PUBLISHED_AT, reverse:${r}){edges{node{title handle blog{handle} image{url width} body}}} }`;
let arts = [];
for (const rev of [true, false]) {
  const r = await fetch(`https://${STORE}/admin/api/2024-10/graphql.json`, { method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-Shopify-Access-Token': TOKEN }, body: JSON.stringify({ query: q(rev) }) });
  arts = arts.concat((await r.json()).data.articles.edges.map(e => e.node));
}
const seen = new Set(); arts = arts.filter(a => !seen.has(a.handle) && seen.add(a.handle));
const YT = /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([A-Za-z0-9_-]{11})/;
const norm = s => s.toLowerCase().replace(/[^a-z0-9]+/g, '');
const TOPIC = n => /prison|lowdham|bond|rehabilit/.test(n) ? 'prisons'
  : /school|universit|student|educat|lecture|summit|coventry|brookes|southbank/.test(n) ? 'schools/education'
  : /rwanda|kenya|ghana|tunisia|sweden|france|munich|amersfoort|global|world/.test(n) ? 'international'
  : /wheelchair|cargo|trike|livelihood|health|disabilit/.test(n) ? 'applied design'
  : /testing|swansea|composite|fibre|resin|circular|material/.test(n) ? 'material/evidence'
  : /corporate|macallan|four seasons|team|brixton|whisky/.test(n) ? 'corporate'
  : /gcn|bikeradar|cnn|core77|designboom|fast company|bikerumor|cycling|evening standard|financial times|guardian|press|news|bikebiz/.test(n) ? 'press'
  : 'builder stories';

let matched = 0, films = 0;
const byTopic = {};
for (const n of notes) {
  const nn = norm(n);
  const hit = arts.find(a => norm(a.handle) === nn)
    || arts.find(a => norm(a.handle).startsWith(nn.slice(0, 40)) && nn.length > 24)
    || arts.find(a => nn.startsWith(norm(a.handle).slice(0, 40)) && norm(a.handle).length > 24);
  const vid = hit ? (hit.body.match(YT) || [])[1] : null;
  if (hit) matched++; if (vid) films++;
  (byTopic[TOPIC(n)] ??= []).push({ n, hit, vid });
}
// films on articles with no matching vault note still matter — list them separately
const noteHandles = new Set(Object.values(byTopic).flat().map(r => r.hit?.handle).filter(Boolean));
const orphanFilms = arts.filter(a => YT.test(a.body) && !noteHandles.has(a.handle));

mkdirSync('qa/research', { recursive: true });
let md = `# Verified content index — vault ⇄ Shopify blog\n\n`;
md += `Regenerate: \`node qa/content-index.mjs\`\n\n`;
md += `${notes.length} audited notes from \`Business/Case Studies/Verified 2026\` matched against ${arts.length} live articles. `;
md += `**${matched} resolve to a live URL**, and **${films} of those carry a film**.\n\n`;
md += `Every row survived the 2026 audit against primary sources, so it is safe to cite without re-verification.\n\n`;
md += `**FILM column** — a YouTube id here means the article embeds a film. A story card with a film\n`;
md += `automatically takes the wide slot in the mosaic layout, so films reshape a band as well as fill it.\n`;
for (const [topic, rows] of Object.entries(byTopic).sort()) {
  md += `\n## ${topic} (${rows.filter(r => r.hit).length}/${rows.length} linked · ${rows.filter(r => r.vid).length} films)\n\n`;
  md += `| Verified note | URL | Img | Film |\n|---|---|---|---|\n`;
  for (const { n, hit, vid } of rows)
    md += `| ${n.replace(/-/g, ' ').slice(0, 62)} | ${hit ? `/blogs/${hit.blog.handle}/${hit.handle}` : '—'} | ${hit?.image ? (hit.image.width < 900 ? '⚠ ' + hit.image.width + 'px' : '✓') : '—'} | ${vid || '—'} |\n`;
}
if (orphanFilms.length) {
  md += `\n## films on articles with no vault note (${orphanFilms.length})\n\n`;
  md += `Not audited, so verify before citing — but the film itself is published.\n\n| Article | URL | Film |\n|---|---|---|\n`;
  for (const a of orphanFilms) md += `| ${a.title.slice(0, 56)} | /blogs/${a.blog.handle}/${a.handle} | ${(a.body.match(YT) || [])[1]} |\n`;
}
writeFileSync('qa/research/content-index.md', md);
console.log(`notes ${notes.length} · articles ${arts.length} · matched ${matched} · films on matched notes ${films} · orphan films ${orphanFilms.length}`);
