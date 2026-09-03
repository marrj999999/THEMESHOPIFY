// COPY LINT — measurable markers of AI-flattened and weak prose.
//
// James, 2026-07-31: "audit the website for AI slop, poor language and general poor copywriting."
//
// WHAT THE RESEARCH ACTUALLY SUPPORTS, and what it does not:
//
// · GOV.UK's words-to-avoid list already IS an AI-slop vocabulary list, and it is a MANDATORY
//   published standard rather than taste. Zero tolerance is defensible here in a way it is not
//   for any other rule in this file.
//   https://guidance.publishing.service.gov.uk/writing-to-gov-uk-standards/style-guides/a-to-z-style-guide/
//
// · EM-DASH DENSITY is the strongest aggregate signal. Human essayists average 3.23 per 1,000
//   words; unconstrained LLM output runs 7–11 (Freeburg, arXiv:2603.27006, ~240k generated words
//   vs 57k words of published human essays). ABSENCE PROVES NOTHING — some models score 0.00 —
//   so this may never be used to accuse a single sentence, only to describe a body of text.
//
// · EXCESS VOCABULARY (delves, underscores, pivotal, tapestry, testament…) is evidenced at CORPUS
//   level by Kobak et al., Science Advances 11(27):eadt3813 (2025), across 15M PubMed abstracts.
//   The authors are explicit that it "cannot identify individual abstracts". Same discipline here.
//
// · CONCRETENESS (Brysbaert, Warriner & Kuperman 2014 norms) ranked slop vs good copy perfectly in
//   testing — but it MISFIRES ON TESTIMONY. It scored a Maker's own words at 29% abstract, which
//   is excellent human writing. Quotes are therefore exempt, not merely tolerated.
//
// DELIBERATELY NOT IMPLEMENTED:
// · Passive-voice detection. write-good, run on a controlled sample, flagged ONLY the best
//   sentence — twice — and missed all three slop lines. The signal is inverted for this purpose.
// · Nominalisation by suffix. On this corpus its top "hits" were university, balance, experience.
// · Burstiness / perplexity. GPTZero's sense of the word is marketing vocabulary, not the NLP
//   construct. The site's sentence-length CV is 0.76 — healthy — so it would say nothing anyway.
// · AI detectors. Seven of them misclassified NON-NATIVE English at a 61.3% false-positive rate
//   (Liang et al.) vs 5.1% for US students. BBC's contributors include prison leavers and people
//   with interrupted education. Running a tool with a documented bias against non-standard English
//   over their words would be an unforced ethical error, whatever it scored.
//
// Usage: node qa/copy-lint.mjs <copy.json>   (from qa/.copy extraction, or any {page,h[],p[]} JSON)
import { readFileSync } from 'fs';

const src = process.argv[2];
if (!src) { console.log('usage: node qa/copy-lint.mjs <copy.json>'); process.exit(1); }
const pages = JSON.parse(readFileSync(src, 'utf8'));

// GOV.UK words to avoid — a mandatory standard, not a preference.
const GOVUK = /\b(empower(s|ed|ing)?|robust|leverag(e|ed|ing)|foster(s|ed|ing)?|overarching|streamlin(e|ed|ing)|transform(s|ed|ing|ative)?|facilitat(e|ed|ing)|utilis(e|ed|ing)|incentivis(e|ed)|disincentivis(e|ed)|liais(e|ed|ing)|deploy(s|ed|ing)?|going forward|moving forward|in order to|one-stop shop|ring.?fenc(e|ed|ing)|slim down|key priority|comprehensive|bespoke)\b/gi;
// Kobak et al. excess vocabulary.
const EXCESS = /\b(delve[sd]?|delving|underscor(e|es|ing)|showcas(e|es|ing)|intricate|pivotal|crucial|notable|indispensable|realm|tapestry|testament|multifaceted|meticulous(ly)?|noteworthy|profound(ly)?)\b/gi;
// Negative parallelism — a legitimate device, so this is a density rule, not a ban.
const NOTJUST = /\b(not just|not only|more than just|isn't just|it's not about)\b/gi;
// Language about people with criminal records. All three UK sources agree "ex-offender" is out and
// person-first construction is preferred — Unlock ("people with criminal records"), Clean Break
// (bans "offender/offending/re-offending" outright), and even HMPPS dropped "convict".
// BUT: the term legitimately appears inside OFFICIAL SOURCE TITLES. The one hit on this estate was
// "MoJ offender employment outcomes, 2024-25" — the real name of a government statistical release.
// Renaming a citation would misquote the source, so cited titles are exempt. A linter that forces
// you to falsify a reference is worse than no linter.
const STIGMA = /\b(ex-?offender|offenders?|inmates?|convicts?|criminals)\b/gi;
const CITATION = /\((?:MoJ|Ministry of Justice|ONS|HMPPS|DfE)[^)]*\)|MoJ [a-z ]*outcomes/i;

const collect = re => {
  const out = {};
  for (const pg of pages) {
    for (const s of [...(pg.h || []), ...(pg.p || [])]) {
      if (re === STIGMA && CITATION.test(s)) continue;   // official source titles are not our words
      for (const m of s.match(re) || []) {
        const k = m.toLowerCase();
        (out[k] ??= { n: 0, pages: new Set() });
        out[k].n++; out[k].pages.add(pg.page);
      }
    }
  }
  return out;
};

const report = (title, hits, note) => {
  const rows = Object.entries(hits).sort((a, b) => b[1].n - a[1].n);
  const total = rows.reduce((s, [, v]) => s + v.n, 0);
  console.log(`\n── ${title}: ${total} hits`);
  if (note && total) console.log(`   ${note}`);
  rows.slice(0, 10).forEach(([k, v]) => console.log(`   ×${String(v.n).padStart(3)}  ${k.padEnd(18)} on ${v.pages.size} page(s)`));
  return total;
};

// ── em-dash density ─────────────────────────────────────────────────────────────────────────
const allStrings = pages.flatMap(p => [...(p.h || []), ...(p.p || [])]);
const words = allStrings.join(' ').split(/\s+/).filter(Boolean).length;
const emDashes = (allStrings.join(' ').match(/—/g) || []).length;
const per1k = words ? (emDashes / words) * 1000 : 0;
const withDash = allStrings.filter(s => s.includes('—')).length;

console.log('═══ COPY LINT ═══');
console.log(`${pages.length} pages · ${words} words · ${allStrings.length} strings`);
console.log(`\n── em-dash density: ${per1k.toFixed(1)} per 1,000 words  (${withDash}/${allStrings.length} strings = ${(withDash / allStrings.length * 100).toFixed(0)}%)`);
console.log(`   human essayist mean 3.23 · unconstrained LLM 7–11 · flag >8 · hard-fail >15`);
console.log(`   ${per1k > 15 ? '✗ HARD FAIL' : per1k > 8 ? '⚠ above threshold' : '✓ within range'}`);

const g = report('GOV.UK words to avoid (mandatory standard)', collect(GOVUK), 'zero tolerance — published, enforced');
const e = report('excess vocabulary (Kobak et al.)', collect(EXCESS), 'corpus-level signal only; never accuses a single sentence');
const n = report('negative parallelism "not just X, it\'s Y"', collect(NOTJUST), 'a real device — this is a density rule, flag >1 per 1,000 words');
const st = report('stigmatising language (Unlock guidance)', collect(STIGMA), 'use "people with criminal records"');

// ── sentence rhythm — reported, never failed on ─────────────────────────────────────────────
const sents = allStrings.join(' ').split(/(?<=[.!?])\s+/).filter(s => s.split(/\s+/).length > 2);
const lens = sents.map(s => s.split(/\s+/).length);
const mean = lens.reduce((a, b) => a + b, 0) / (lens.length || 1);
const cv = Math.sqrt(lens.reduce((a, b) => a + (b - mean) ** 2, 0) / (lens.length || 1)) / (mean || 1);
console.log(`\n── sentence rhythm: ${sents.length} sentences · mean ${mean.toFixed(1)} words · CV ${cv.toFixed(2)}`);
console.log(`   CV below ~0.5 suggests flattened, uniform prose. Reported only — never a gate.`);

// ── verbatim duplication — the defect no vocabulary list finds ───────────────────────────────
const seen = {};
for (const pg of pages) for (const s of [...(pg.h || []), ...(pg.p || [])]) {
  if (s.split(/\s+/).length > 7) { (seen[s] ??= new Set()).add(pg.page); }
}
const dups = Object.entries(seen).filter(([, v]) => v.size > 1).sort((a, b) => b[1].size - a[1].size);
console.log(`\n── sentences repeated across MULTIPLE pages: ${dups.length}`);
dups.slice(0, 8).forEach(([k, v]) => console.log(`   ${v.size} pages  ${k.slice(0, 82)}`));

const fails = (per1k > 15 ? 1 : 0) + (g > 0 ? 1 : 0) + (st > 0 ? 1 : 0);
console.log(`\n═══ ${fails ? '✗ ' + fails + ' hard rule(s) breached' : '✓ no hard rule breached'} ═══`);
process.exit(process.argv.includes('--assert') && fails ? 1 : 0);
