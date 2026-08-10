// EDITABILITY CHECK — every aspect of every page must be editable in the
// theme editor. Born 2026-08-10 from James: "make sure all aspects are
// editable". Static analysis of section liquid:
//   RAW-TEXT       visible text hardcoded in markup with no {{ settings }} behind it
//   GHOST-SETTING  section/block.settings.X referenced but not declared in schema
//   RAW-IMG        hardcoded asset/CDN image with no image_picker fallback path
//   RAW-LINK       hardcoded internal href with no url setting
// Heuristic, judgment applies: liquid `default:` values ARE editable (the
// setting exists) and are not flagged. Run: npm run check:editability
import { readFileSync, readdirSync, writeFileSync, mkdirSync } from 'fs';

const SECTIONS_DIR = 'sections';
// the estate's rendering sections (2026 system + live legacy renderers)
const ESTATE = readdirSync(SECTIONS_DIR).filter((f) =>
  /^bbc-(home|impact|product|about|article|blog|collection|footer|header|comparison|parts|statement|workshops?|prisons?|schools?|programmes?|build-to-bond|commissioners|education|support-mission|why-bamboo|media|testimonials|kit-reviews|product-reviews|team|contact|story)[-.]?.*2026.*\.liquid$|^bbc-(comparison|parts|statement)\.liquid$/.test(f));

const report = [];
for (const file of ESTATE) {
  const src = readFileSync(`${SECTIONS_DIR}/${file}`, 'utf8');
  const issues = [];

  // schema ids
  // the REAL schema starts at the LAST '{% schema %}' opener — header comments
  // mention the literal tag without an end tag (the documented anchor trap)
  const opens = [...src.matchAll(/\{%\s*schema\s*%\}/g)];
  let schemaMatch = null;
  if (opens.length) {
    const start = opens[opens.length - 1];
    const rest = src.slice(start.index + start[0].length);
    const end = rest.search(/\{%\s*endschema\s*%\}/);
    if (end > -1) schemaMatch = { 1: rest.slice(0, end), index: start.index };
  }
  let ids = new Set();
  if (schemaMatch) {
    for (const m of schemaMatch[1].matchAll(/"id"\s*:\s*"([^"]+)"/g)) ids.add(m[1]);
  }
  const body = schemaMatch ? src.slice(0, schemaMatch.index) : src;

  // DUP-ID: ids must be unique WITHIN a scope (section settings; each block
  // type's settings) — across scopes reuse is legal. Shopify 422s real dups.
  if (schemaMatch) {
    try {
      const schema = JSON.parse(schemaMatch[1]);
      const scopes = [['section', schema.settings || []]];
      for (const b of schema.blocks || []) scopes.push([`block:${b.type}`, b.settings || []]);
      for (const [scope, arr] of scopes) {
        const ids = arr.map((s) => s.id).filter(Boolean);
        for (const id of new Set(ids)) if (ids.filter((x) => x === id).length > 1) issues.push({ k: 'DUP-ID', scope, id });
      }
    } catch (e) { issues.push({ k: 'SCHEMA-PARSE', err: String(e).slice(0, 60) }); }
  }

  // GHOST-SETTING: referenced but not declared
  const refs = new Set();
  for (const m of body.matchAll(/(?:section|block)\.settings\.([a-zA-Z0-9_]+)/g)) refs.add(m[1]);
  for (const r of refs) if (!ids.has(r)) issues.push({ k: 'GHOST-SETTING', id: r });

  // strip liquid + styles/scripts/comments, then find raw text in visible tags
  const stripped = body
    .replace(/\{%-?\s*comment\s*-?%\}[\s\S]*?\{%-?\s*endcomment\s*-?%\}/g, '')
    .replace(/<style[\s\S]*?<\/style>/g, '')
    .replace(/<script[\s\S]*?<\/script>/g, '');
  // visible text containers with raw words (no liquid output inside)
  const isFallback = (idx) => {
    const before = stripped.slice(Math.max(0, idx - 600), idx);
    // designed fallback: inside the else of a settings-driven branch, or right
    // after a settings-blank check / case on a setting — already editable
    return /settings\.[a-zA-Z0-9_]+\s*(!=\s*blank|==\s*blank)|\{%-?\s*else\s*-?%\}|\{%-?\s*when\s/.test(before);
  };
  for (const m of stripped.matchAll(/<(h1|h2|h3|h4|p|figcaption|cite|span|b|li|dt|dd|button|a)\b[^>]*>([^<{]{8,}?)<\/\1>/g)) {
    const text = m[2].trim();
    if (!text || /^[\s·—\-&;#\d%£+×→\.]*$/.test(text)) continue;
    if (/&(nbsp|rarr|mdash|middot|amp);?/.test(text) && text.replace(/&[a-z]+;/g, '').trim().length < 8) continue;
    if (isFallback(m.index)) continue;
    issues.push({ k: 'RAW-TEXT', tag: m[1], text: text.slice(0, 60) });
  }
  // RAW-IMG: asset_url'd images not inside a settings-driven branch (heuristic:
  // hardcoded filename with no `settings.` within 200 chars before)
  for (const m of stripped.matchAll(/['"]([\w\-]+\.(?:jpg|jpeg|png|webp|svg))['"]\s*\|\s*asset(?:_img)?_url/g)) {
    if (/^bbc-logo-/.test(m[1])) continue; // logo walls: asset-key convention (swap by uploading same-named file)
    const before = stripped.slice(Math.max(0, m.index - 400), m.index);
    if (/settings\.[a-zA-Z0-9_]+\s*(!=\s*blank|\|\s*default)|default:|\.(image|featured_image)\b|\{%-?\s*(else|when)\b/.test(before)) continue;
    issues.push({ k: 'RAW-IMG', src: m[1] });
  }
  // RAW-LINK: hardcoded internal hrefs with no settings involvement
  for (const m of stripped.matchAll(/href="(\/(?:pages|products|collections|blogs)\/[a-z0-9\-\/]+)"/g)) {
    if (isFallback(m.index)) continue;
    issues.push({ k: 'RAW-LINK', href: m[1] });
  }

  if (issues.length) report.push({ file, issues });
}

mkdirSync('qa/reports', { recursive: true });
writeFileSync('qa/reports/editability.json', JSON.stringify(report, null, 1));
const tally = {};
report.forEach((s) => s.issues.forEach((i) => (tally[i.k] = (tally[i.k] || 0) + 1)));
console.log('=== EDITABILITY SUMMARY ===');
console.log(JSON.stringify(tally));
console.log(`sections with findings: ${report.length}/${ESTATE.length} → qa/reports/editability.json`);
