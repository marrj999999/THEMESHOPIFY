# Site-wide update — session summary (2026-07-13, draft 196820238710)

## Defects fixed + verified (deployed to draft)
| # | Page/file | Fix | Verified |
|---|---|---|---|
| 1 | Impact `page.impact.json` | 4 typos: impactt/voational/carrers, STEAM Learning→learning, "Real project real imapact"→"real projects, real impact" | read-back 0 typos |
| 2 | Impact `page.impact.json` | house-style + grammar: "prisoners…there children"→"makers…their children" | read-back clean |
| 3 | Impact `bbc-impact-2026.liquid` | stat count-up flash → `bbc-counted` instant render | live: stats paint final on first frame |
| 4 | 10 redesign sections | same count-up `bbc-counted` fix | deployed |
| 5 | `blocks/bbc-stat.liquid` | shared stat block → `bbc-counted` (fixes count-up flash on EVERY page using bbc-stat-band) | why-bamboo: 4 counted / 0 bare |
| 6 | Homepage `index.json` | grammar: "not just a bike a engine"→"not just a bike — an engine for change." | live read-back confirmed |
| 7 | `qa/gate-check.sh` | schema validator false-positive (prose "{% schema %}" + whitespace tags) → use last block | re-ran, passes |

## Site-wide audit results — CLEAN
- Banned claims: clean (all 47 templates + 163 sections)
- House-style (prisoners/inmates/learners): clean — only the verbatim Inside Time press quote (allowed)
- Grammar (a/an, doubled words, double-spaces): clean site-wide (2 flags were false positives: "a university", "a one-time")
- Fonts: no Jakarta/Fraunces on any LIVE section (48 remnants all in dead/unused sections)
- Logos: every logo SVG has a viewBox (no float-box bug)
- Render sweep, all 16 live pages: 200 OK, real H1, no unrendered Liquid, no empty headings, no missing-src images, no animating proof-stats

## Visually confirmed high-quality (band review)
Impact (post-fix), Homepage (full walk), Team-building, Prisons, why-bamboo. All strong: zero-knowledge headers, real logos/quotes/video, on-brand.

## Structural question resolved
Prisons is a STANDALONE page, breadcrumb nested under Impact (Home / Impact / For prisons) — i.e. linked-from-Impact, not folded-in.

## Repo hygiene
Synced 14 sections + 1 block back to working tree (restored 4 sections that were missing locally). Memory `why-bamboo-page-architecture` corrected (draft page is modular blocks, not the monolith).

## REMAINING — needs James (not defects)
- Held figures to source/verify: ~£18bn, 9pts, 39%, 1m+, "40+ publications" (blocks PUBLISHING, not draft)
- Impact report is a web page, not a dated PDF (funder credibility)
- Workshop price conflict (£795 vs £595/£695) — confirm
- Exact OCN titles (L1 schools / L2 prisons)
- Optional design polish (carries shared-CSS regression risk, needs greenlight): Impact funder-logo sizing (Investec clipped) + de-border press cards (§8 ≤1 bordered band)
- Signpost = keep 3 doors (DECIDED by James 2026-07-13)
