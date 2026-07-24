// B5 — reconcile local files that differ from the DRAFT, by reading content rather than mtimes.
//
// Why mtimes are not enough (2026-07-24, learned the hard way): three files looked "local is
// newer" by git commit date and were in fact STALE — the draft held better wording that had never
// been pulled back. bbc-build-to-bond said "prisoners" where the draft said "Makers";
// bbc-impact-mission carried "Level 1 & 2" and "Guaranteed interview on release";
// bbc-social-impact had "prisoners" in alt text. Pushing any of them would have REGRESSED the
// draft. CLAUDE.md warns exactly this: "never `put` a theme asset that wasn't first pulled and
// diffed."
//
// So this classifies by what the difference CONTAINS, not when a file was touched:
//   BLOCKED   — local contains banned-claim wording the draft does not. Never push; pull instead.
//   DRAFT-NEW — draft is newer than the last local commit. Pushing would revert someone's work.
//   REVIEW    — a real content difference needing a human decision.
//   TRIVIAL   — whitespace/EOL only.
//
// It writes a report and CHANGES NOTHING. Reconciliation is a per-file decision.
//
// Usage: node qa/reconcile-drift.mjs
import { readFileSync, readdirSync, existsSync, writeFileSync, mkdirSync } from 'fs';
import { createHash } from 'crypto';
import { execFileSync } from 'child_process';
import { listAssets, getAsset, DRAFT, sleep } from './shopify-api.mjs';
import { BANNED } from './banned-claims.mjs';

const DATE = new Date().toISOString().slice(0, 10);
const OUT = `qa/evidence/${DATE}`;
mkdirSync(OUT, { recursive: true });

const md5 = b => createHash('md5').update(b).digest('hex');
const norm = s => s.replace(/\r\n/g, '\n').replace(/[ \t]+$/gm, '').trim();

const remote = new Map((await listAssets(DRAFT)).map(a => [a.key, a]));
const targets = [];
for (const dir of ['sections', 'snippets', 'assets', 'layout']) {
  if (!existsSync(dir)) continue;
  for (const fn of readdirSync(dir)) {
    if (/\.(bak|backup)/.test(fn) || fn.startsWith('.')) continue;
    if (/\.(png|jpe?g|gif|webp|svg|woff2?|ico|mp4)$/i.test(fn)) continue;
    const key = `${dir}/${fn}`;
    const rem = remote.get(key);
    if (!rem) continue;
    let buf; try { buf = readFileSync(key); } catch { continue; }
    if (md5(buf) !== rem.checksum) targets.push({ key, rem });
  }
}

const report = [];
for (const { key, rem } of targets) {
  const local = readFileSync(key, 'utf8');
  const draft = await getAsset(DRAFT, key);
  await sleep(150);
  if (draft === null) continue;

  let localCommit = '';
  try { localCommit = execFileSync('git', ['log', '-1', '--format=%cI', '--', key]).toString().trim(); } catch {}
  const draftNewer = localCommit && new Date(rem.updated_at) > new Date(localCommit);

  // The decisive test: does LOCAL reintroduce wording the draft has already removed?
  const localBad = BANNED.filter(re => re.test(local) && !re.test(draft)).map(re => re.source);
  // …and the reverse, which means the draft is the stale side for that string.
  const draftBad = BANNED.filter(re => re.test(draft) && !re.test(local)).map(re => re.source);

  const trivial = norm(local) === norm(draft);
  const verdict = localBad.length ? 'BLOCKED'
    : trivial ? 'TRIVIAL'
      : draftNewer ? 'DRAFT-NEW'
        : 'REVIEW';

  report.push({ key, verdict, localBad, draftBad, draftUpdated: rem.updated_at.slice(0, 16), localCommit: localCommit.slice(0, 16) });
}

const order = { BLOCKED: 0, 'DRAFT-NEW': 1, REVIEW: 2, TRIVIAL: 3 };
report.sort((a, b) => order[a.verdict] - order[b.verdict] || a.key.localeCompare(b.key));

const counts = report.reduce((m, r) => (m[r.verdict] = (m[r.verdict] || 0) + 1, m), {});
let out = `DRIFT RECONCILIATION — ${DATE}\n${report.length} files differ from draft ${DRAFT}\n` +
  Object.entries(counts).map(([k, v]) => `  ${k}: ${v}`).join('\n') +
  `\n\nBLOCKED = local reintroduces banned wording the draft already removed. PULL, never push.\n` +
  `DRAFT-NEW = draft newer than last local commit; pushing would revert work.\n` +
  `REVIEW = real content difference, human decision. TRIVIAL = whitespace only.\n\n`;
for (const r of report) {
  out += `${r.verdict.padEnd(10)} ${r.key}\n`;
  if (r.localBad.length) out += `           ↳ local reintroduces: ${r.localBad.join(', ')}\n`;
  if (r.draftBad.length) out += `           ↳ draft still carries: ${r.draftBad.join(', ')}\n`;
  out += `           draft ${r.draftUpdated} · local commit ${r.localCommit || '(untracked)'}\n`;
}
writeFileSync(`${OUT}/drift-reconciliation.txt`, out);
console.log(out);
console.log(`→ ${OUT}/drift-reconciliation.txt (nothing was changed)`);
