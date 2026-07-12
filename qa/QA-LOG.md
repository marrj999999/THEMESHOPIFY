# QA Log — CUSTOMTHEME20262 redesign
*Defects, fixes, verdicts. Newest first.*

## 2026-07-13 — JAMES G5 on impact: "content better BUT boring" — 3 directives
J1 ANIMATE ALL STATS — move-in + count animation (re-enable count-up: the freeze was a test-pane artifact he never saw; add entrance reveal to stat cards)
J2 WORLD MAP INFOGRAPHIC — where-we-operate: replace text-only with a world map plotting our locations + the 45 countries (was already a Phase-4 queued component; £0 = inline SVG, lime location dots, editable)
J3 PATHWAYS BAND RETHINK — mission/schools/prisons opener "not clear enough, visually not stimulating" — next design pass: consider per-pathway duotone imagery (his instinct overrides the type-only rule), stronger fork visual
JAMES RULED (2026-07-13): 3 equal CTAs in get-involved = fine (deliberate equal-doors grid, sanctioned like the homepage signpost); page length = accepted (he can cut later). Both closed.


## 2026-07-13 — DEFINE: Impact final pass (quality over speed — James green-lit)
Sources: qa/research/similar-charity-impact-funder-page.md (adopt/adapt) + qa/CRIT-impact-final-2026-07-12.md (defects 4-10) + James directives.
BUILD LIST (each closes with evidence):
A1 Benchmark-paired stats — national-baseline second line in stat cards ONLY where Proof Bank verifies the baseline (never invent)
A2 "what's next" forward band — 3 numbered lime-node ambitions (sites, school cohorts, hubs) before get-involved; no £ amounts
A3 Impact report → proper download-asset card inside recognised-by (was a text link)
A4 Steel money-model callout → 3 verifiable promises, each ending in an arrow proof-link (report / OCN / coverage)
A5 Where-we-operate: 7 rows → 4 + "the full picture →" link (progressive disclosure; fixes mixed chip semantics)
A6 Quote attribution style: outcome-carrying ("former Maker, now peer instructor"), anonymised per hard rule
G1 Page length: 15,179px @375 → target ≤11k (recognised-by band 2,419px is the main cut; fix its 4-line h2)
G2 Reveal-on-scroll blank-viewport fallback (observed scrollY 800-1500) — tone down or remove .rd-reveal on this page
G3 get-involved band: one-left-axis fix (h2 left, lede centred = violation)
C4-C10 remaining CRIT defects per report
HOLD: ops-band final wording pending James's 6 confirmations (ships conservative until then).


## 2026-07-12 — JAMES G5 VERDICT: still not at standard. Directives (verbatim intent):
1. UNIVERSAL STYLE: too many font styles + inconsistent symbols across bands — define ONE ruleset (type sizes, node/symbol style, chip style, button style) and apply it to EVERY band; no per-band variation. Hero still not large on his phone (screenshots IMG_3193–3198 in uploads/ — READ THEM at next pass start).
2. 'Accredited programmes' band makes no sense — rewrite/rethink (zero-knowledge rule).
3. 'Where we operate' band must show the FULLER picture: Project Zero Camden, LSBU, other partner orgs + overseas — Kenya, bamboo labs in Ethiopia, etc. Research vault/blog for the complete operations list before writing it.
4. Logos still inconsistent/missing (duplicates found by CRIT + gaps) — one consistent logo system.
5. THIS PAGE = THE FORMULA for all other pages. Get it right once, reuse everywhere.
PROCESS ANSWER OWED: why still missed → fixes shipped band-by-band without a whole-page style pass; next pass = whole-page universal-style sweep against a written checklist, screenshot EVERY band mobile-first, CRIT re-run, THEN James.

## 2026-07-12 — PATHWAYS BAND BUILT & DEPLOYED (fork & converge)
Per qa/PATHWAYS-SPEC.md: mission ✱ node forks into two distinct panels — make engineers (paper/lime track, schools·before) vs build to bond (forest/steel track, prisons·after) — converging on the lime strip 'both pathways end in the same place ✱ a way forward.' Per-pathway CTAs (school → /pages/schools; commission → /pages/contact-us). Numbered node steps reused; dark-surface overrides; mobile = one continuous left rail. All copy editable; inline .rd-arms patch deleted; claim-lint clean; browser asserts: fork ✓ paper/forest/lime surfaces ✓ names ✓ 5 dark steps ✓. G5: James phone-check pending.
Symbols system: ✱ = mission origin node (honesty motif), numbered lime/steel nodes = pathway steps, track chips carry words (colour never the only cue). Photos deliberately stay in adjacent bands (type-on-flat-colour rule).

## 2026-07-12 — James directive: TWO PATHWAYS rebrand (impact arms band)
The two arms must read as two DISTINCT named pathways (early prevention vs support-further-on), not twin cards: different visual identities, branded as pathways from one shared mission node, stranger-clear headers. Stakeholder review + UX/CSS research running → qa/PATHWAYS-SPEC.md; build next pass against that spec. Also standing: storytelling zero-knowledge rule (memory) applies to all remaining body copy on this page.

## 2026-07-12 — Phase 2 rebuild pass 1 DEPLOYED (impact page)
Fixed & verified in-browser on the draft: D1 (90%+) · D2 (Makers, 0 "learners") · D3 (mobile pathway steps CSS) · D4 (lowercase hero "building bikes. rebuilding lives.") · D5 (Backed-by strip renders, 7 cells: NLCF/OCN/HMPPS/FT/Inside Time logos + Investec/LSBU text chips — logo files for those two still wanted) · D6 (longevity subline live) · D7 (story wall removed, -6 blocks; stashed at scratchpad/impact-story-blocks-stash.json for why-bamboo) · D8 (report_url explicit → /pages/impact-report) · D11 (cscard aspect-ratio placeholder) · June-audit #5 (39% now cited to MoJ family-contact data, both spots).
Open: D9 (funder mechanism beat — needs design, next pass) · D10 (quote attribution check) · D12 (length re-measure after settle) · Investec+LSBU logo files · a downloadable impact-report PDF (page exists, PDF doesn't).
Gates: G1 lint clean · G2 pushed+validated (one schema race: template must push AFTER section; and a silent failed replace caught by remote-schema verify — lesson: assert every replacement) · G3 in-browser asserts pass · G5 James pending.


## 2026-07-12 — Phase 2 diagnosis: /pages/impact (draft theme, desktop + 375px mobile emulation)

**The good news: no structural breakage found on the draft.**
- No horizontal overflow at 375px (only intentional off-canvas cart/skip-link).
- All story-card images load (200s incl. bbc-rd-cohort.jpg); the "empty dark cards" seen mid-scroll are **lazy-load lag**, not missing images.
- Bands stack correctly on mobile; stats band reflows 2×2; steel "Three ways" cards clean.
- The June-audit "rendering glitch" did not reproduce on the draft — it may have been fixed in the Jul 7–8 passes, or lives only on MAIN/live. **James to confirm on his phone against the draft preview**: https://bamboobicycleclub.org/pages/impact?preview_theme_id=196820238710

**Defects & gaps to fix in the Phase 2 rebuild (D# = defect):**
| # | Item | Type |
|---|---|---|
| D1 | Stats band says "90%" → canon is "90%+" | copy/claims |
| D2 | "learners" ×2 in workshop band → "Makers" (voice rule) | copy |
| D3 | Pathway flows render as run-on text with → arrows ("Taster→Short course…") — unreadable on mobile; convert to stacked step list (rd-steps) | design |
| D4 | Headline/eyebrows proper-case ("Building bikes. Rebuilding lives.", "BUILD BIKES · …") → brief says lowercase, dial-up | design |
| D5 | Missing: **Backed-by strip** (Investec · NLCF · LSBU · FT · Timpson — names/logos, NO £) | gap (plan) |
| D6 | Missing: **since-2012 / 14-years longevity anchor** as its own beat (only "since 2012" small print in stats) | gap (plan) |
| D7 | "From prisons to Patagonia" adventure wall still on page (~1,440px) → move to why-bamboo per plan | gap (plan) |
| D8 | "Read the 2026 impact report" button exists — needs the download-asset card treatment + verify target file exists | gap (plan) |
| D9 | Funder beat is thin: "Back the mission" CTA → needs how-the-money-works mechanism sentence + giving ladder + "talk to James" (charity:water pattern) | gap (plan) |
| D10 | Quote attribution per June audit (Sally Allsopp) — verify current quotes' state during rebuild | content |
| D11 | Lazy-load lag leaves flat forest blocks while scrolling — add width/height + poster/LQIP background to card media so the wait reads intentional | design |
| D12 | Page ~15,000px on mobile (~18 screens) — trim during restructure; folding in funder/commissioner/B2B beats must NOT grow it: cut D7 + de-dup to compensate | design |

**Gate status:** diagnosis only — no changes deployed this pass.

---

## 2026-07-12 — Phase 1 (foundation) — Gates 1–4 PASS
- G1: claim-lint clean after hardening (SVG false-positive fix) + 18 real stray banned claims fixed across stale local sections (commit fafceee). bbc-conformance.js found to be a browser-console script — runs at G3, not G1 (note for the loop).
- G2: 5 files deployed to 196820238710, read-back byte-identical.
- G3: draft theme confirmed (Shopify.theme.id), Atkinson rendering site-wide, --forest #003C32, --bbc-lime→#D4FD62, tokens sheet loaded, zero console errors. Homepage hero had been rendering **Georgia** (Fraunces declared but never loaded) — fixed to Atkinson 800.
- G4: JS font/regression sweep over home, impact, why-bamboo, gravel PDP, our-story-2, cart, collection — 0 Jakarta/Fraunces/Hanken/Georgia elements.
- G5 (James): ⏳ awaiting phone-check of the preview.
