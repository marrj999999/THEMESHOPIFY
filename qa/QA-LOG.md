# QA Log — CUSTOMTHEME20262 redesign
*Defects, fixes, verdicts. Newest first.*

## 2026-08-03/04 — estate contrast to zero, the standard written down, and 22 sessions read back

**Root cause of the two days, one sentence:** the estate was measurably fine on type and
measurably undefined on everything else, so every session re-invented "consistent" — the fix was
to write the standard down and make it checkable, not to restyle anything.

**Defects fixed on DRAFT 196820238710 (live untouched):**
- **`/pages/impact` rendered 32 nodes at 1.00:1** — foreground and background the *same* colour.
  The featured Build-to-Bond card was a blank column beside its photo. `bbc-statement.css` strips
  the card fill for the borderless grid while `[data-family="programme"]` keeps the bone text that
  fill was for. A background and a text colour set in different files are one unit (ESCAPES #41).
- **A bare `p{color:var(--bbc-text)}`** in bbc-foundation beat inheritance, so any `<p>` nested in
  a light-on-dark container reset to ink. Hero lede on why-bamboo measured 1.34:1.
- **Pillar photos were 1137px and 1329px inside a 780px column** — `aspect-ratio` on a stretched
  grid item resolves *width from height*. The photo painted under the copy, which is why the
  cascade and the pixel sampler disagreed: the defect was geometry, not colour. Also removed
  387px of horizontal overflow.
- `.rd-body` 14px on /pages/gallery vs 18px in 171 other instances (a figcaption wearing the body
  class); `.rd-cta-row` declared `display:flex` only inside `.rd-hero`, so its 12+ other uses were
  plain block divs — `bbc-teambuilding-2026:130` had been asking for `rd-jc-center` on a block
  element, where justify-content is inert, so that centring had never once worked.
- Homepage `.acc` band painted with `--bbc-cream` (#faf7f0), a fifth light surface used nowhere
  else, and declared twice with different values so it depended on which sheet won.
- `/account/login` and `/account/register` shipped **no meta description at all**.

**Estate contrast: 77 sub-AA nodes → 1**, and that one is an instrument artefact (a fixed sticky
bar sampled over a button; rgba(255,255,255,.96) over forest is *exactly* the rgb(245,247,247)
reported). 15,428 nodes measured across 69 pages × 2 viewports.

**Motion:** `--mo-base` moved .22s → .2s to match what the theme already did (.2s appeared 218
times, .22s eight), then 68 durations migrated to tokens across the six worst files. Adherence
2.7% → 21.5%. **Proven equivalent: 395,955 property values compared, 0 moved** — after first
fixing `css-fingerprint.mjs`, which captured layout, colour and type but *not* timing and was
therefore structurally blind to the change it was being asked to certify.

**Blocks:** all 32 recovered into git (the repo tracked **one**); 8 of the 9 live blocks gained
`.rd-reveal` — blocks previously did not animate at all, so a block snapped in while its band
revealed. `bbc-case-study` left alone: it already reveals via `bbc-cscard`.

**Gates corrected:** four audits (contrast-check, block-audit, layout-audit, sameness) hardcoded
their evidence date and had been overwriting a fixed folder — each day's run destroying the
previous day's. contrast-check now also skips text inside closed `<details>` and under fixed
overlays (7 of 17 findings were unseeable text). Two motion assertions had been red for three days
because they encoded the pre-2026-08-01 single-column flagship; corrected, and **proven still able
to fail** (a planted 80px narrow strip and a planted 60px off-axis card are both caught).

**Instruments that lied, and were caught before acting (seven):** block-audit's modifier trap;
formula-conformance reporting 0/65 pages matching Impact (three separate faults); my own contrast
probe's alpha-compositing bug; a blank fullPage screenshot; 31 "broken" images that were all HTTP
200; two stale motion assertions; and a stuck-invisible reveal check that measured elements
outside their `entry` range and reported 18 broken pages that were fine.

**One regression I caused and fixed the same session:** a `.bbc-rd p{color:inherit}` rule at the
same specificity as an existing correct rule replaced a good light colour with `inherit`, which
resolved to legacy forest on current forest — 1.01:1 across **16 product pages**. Narrowed to
`.rd-lede p`.

**Written down for the first time:** `qa/PAGE-STANDARD.md` (six rules derived by measuring
Impact), `qa/BLOCK-STANDARD.md` (blocks + motion), `qa/THEME-WORKFLOW.md` (the session loop),
`qa/WHY-IT-CIRCLES.md` (22 sessions read back — the same four requests recur 6–8 times each, and
13 regressions of which **nine are one pattern: a fix whose blast radius exceeded its intent**).

**Awaiting James:** support-mission needs eyebrow copy on 8 bands; why-bamboo needs a light
breather band before its stat band (structural + content). Both are content decisions, not effort.


## 2026-07-24 (evening) — CLAIMS ACCURACY + nine gates that were reporting success while doing nothing

**Root cause of the day, one sentence:** a gate that cannot fail still shows a green tick, and
nine separate checks were in that state. Full register with root causes and the checks added:
`qa/ESCAPES.md`.

**Content defects fixed on DRAFT 196820238710 (live untouched):**
- **Wrong OCN course title in 14 places, correct title in 0.** Vault `System/Claims Register.md`
  (canonical) gives "Workshop Skills and Sustainable Manufacturing", course ID 1130735, not
  Ofqual-regulated. The theme published "Sustainable Design & Manufacturing". `CLAUDE.md`
  carried the same error — the propagation source, now corrected. Fixed across 6 sections +
  5 templates; renders correctly in 9 places.
- **"nationally recognised" was rendering on two draft pages** (`/pages/build-to-bond`,
  `/pages/theory-of-change`) — the `06b9ada` fix was committed locally in the morning and never
  deployed anywhere. Now 0 across 8 pages checked.
- **Three stale local files would have REGRESSED the draft if pushed**: `bbc-build-to-bond`
  ("prisoners"), `bbc-impact-mission` ("Level 1 & 2" + "Guaranteed interview on release"),
  `bbc-social-impact` (alt text "prisoners"). The draft already held the better wording; git
  mtimes said "local is newer" and misled. Reconciled from the draft, not pushed.

**Method notes worth keeping:**
- The 6-file audit was too narrow. A full 608-file checksum audit (the Admin API exposes MD5s,
  so it costs one request) found 34 differing, 4 of them draft-newer — pushing those would have
  reverted draft work. 28 remain quarantined pending a per-file content diff.
- Every lint hit was **fixed, not waived**. The ALLOW list covers only rule-statements, the
  MoJ/Farmer Review framing the Claims Register approves verbatim, and third-party press quotes.
- `/pages/impact`'s "prisoners" occurrences are a verbatim *Inside Time* quote, that paper's own
  self-description, and an attributed ministerial quote — deliberately untouched. The voice rule
  governs how we describe our Makers, not how cited sources describe theirs.

**Gate work:** purchase path (add-to-cart + checkout) genuinely tested for the first time —
8/8, after fixing three test-side defects. Visual net moved off `maxDiffPixelRatio` (height was
buying a 225,734-pixel free pass) and gained a text-fingerprint partner for copy changes, which
pixel diffing cannot see. Screenshots left git history (~120MB/run of near-duplicates).

**First free finding from fingerprints:** `/pages/impact` renders EIGHT body-text sizes
(14/16/17/18/22/30/35.2/42px) and three h2 sizes against FORMULA §1's "ONE size per role" — the
B1 consistency inventory, on day one.

**Still open for James:** live `/pages/impact` renders "nationally recognised" (stored in live's
`page.impact.json`; MAIN writes permission-blocked, so admin Code editor); schools Level 1 OCN
evidence pointer; `assets/bbc-tokens.css` is cited as the type contract by TYPE-SCALE.md and the
tracker but exists nowhere (404 local/draft/live).

## 2026-07-13 — FRAME INFOGRAPHIC: DROPPED (tested fully, evidence-based)
Three attempts, all failed the quality bar BEFORE reaching the page: (1) hand-coded SVG shipped blind — James rejected; (2) Recraft round 1: beautiful bike illustration, zero infographic elements; (3) Recraft round 2 (schematic prompt): hex codes as literal text + AI-soup. Decision: the pathway story is carried by the journey cards + duotone imagery; the frame-metaphor idea is parked (revisit only with a human designer or if James supplies a sketch). Map callouts also dropped — clean choropleth + cards stands. ~4 Recraft credits spent.

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

## 2026-09-02 — Site-vs-Vault review → compliance sweep, kit rollout, live gate
- **Review** (vault `Reports/Website Review vs Vault 2026-09-02` + artifact): 11 Claims Register breaches live under green gates; Impact Report / Theory of Change / Support the Mission untouched since 6 Jul; no live CSS/UX measurement.
- **Gates hardened**: 11 new patterns in `qa/banned-claims.mjs` + `scripts/claim-lint.sh` (Feltham, 4/four sites, Level 1, independently tested, last for years, rideable, Enhanced-DBS, six Makers, 10% of profits, Education CIC); canary B-list extended (14/14 caught); estate-check FAQ waiver REMOVED; `qa/README.md` stale canon replaced with a pointer to the Register; Register rows mis-filed under "Prohibited" moved to the approved table (register-sync green again).
- **NEW `qa/live-check.mjs`** (`npm run check:live` / `check:live:quick`): rendered-text claims + cross-page contradictions + CSS budgets (button styles, display h2, kicker case, fonts, tiny text) + UX (h1/CTA above phone fold, cookie cover, overflow, alt, page weight, largest media). Report → `qa/reports/live-check-<date>.md`. Workflow: `qa/WEBSITE-QA-WORKFLOW.md`.
- **Pushed to LIVE 196820238710** (gate → snapshot → push → md5 read-back, all identical): 9 sections (impact, build-to-bond, commissioners, programmes, impact-report, toc, support-mission, teambuilding, education — schema defaults + hardcoded fallbacks) and 3 templates (page.impact-report, page.theory-of-change, page.support-mission — James: "work on the impact and theory of change"). Timpson paraphrase on impact-report replaced with the Register verbatim + dated attribution.
- **Kit rollout** (James: "run the kit pages update"): 10 `product.kit-*.json` rebuilt on the gravel pattern — main (perks, sticky buy) → kitspec (road 8 · city 8 · road-lugged 7 · custom 7 · gravel-lugged 5 · fatbike 5; none for MTB/balance — under 5 sourced rows) → kitship (DDP; rate table on adult kits only) → lower (steps/reviews/stats/FAQ/related). Geometry tables, "what you'll need" and teaser spec cells dropped (contradicted variants / duplicated). Sizing rewritten from Shopify variant titles; "University tested" stat → BS ISO 22157 tubing figure; gated FAQ answers → approved wording; "36 countries" → 45; balance kits: sizing off, age/toddler wording out. Live-check on all 10: 0 banned claims. Evidence: `qa/evidence/2026-09-02/`.
- **Repo re-baselined** from live for 12 sections + 21 templates (5 templates had never existed locally).
- **Not done / for James**: FAQ, Schools, Prisons, Team-building TEMPLATE values still carry Level 1 / six Makers / Enhanced-DBS / 36 countries (section defaults fixed; template values need his word). Shipping rate table (£12/£25/£45/£75) is unverified — Shopify's General delivery profile returned no zones via API. "What's in the box" boilerplate says carbon tow on flax/lugged kits (section default, per-kit copy needed). Cookie card covers 54% of the phone viewport on every page.

## 2026-09-02 (later) — Kit page v2 built on PREVIEW theme 199089193334
- **How live gets changed now that the redesign theme IS live:** `themeDuplicate` the MAIN theme → build + test on the copy behind `?preview_theme_id=<id>` → James reviews → copy the same files to live with the normal gate → snapshot → push → read-back. Duplicate note: Shopify copies files asynchronously (~25 files/30 s; 757 files ≈ 15 min) — do not push to the copy until `listAssets` matches the live count, or the copy can overwrite what you pushed (checked: our 4 files survived, but verify every time).
- `qa/push-theme.mjs` now takes `--theme=<id>` (default stays live). Verify script: `BBC_THEME=<id>`.
- Built from the Claude Design canvas "BBC Kit Page" (design/kit-page/): NEW `sections/bbc-kit-drawing-2026.liquid` (parts drawing + numbered callouts + titleblock + sticker; product image N or picked image); `bbc-kit-spec.liquid` gains per-row pictogram select (14 stroke icons), `effort` blocks (4-card strip) and `doc` blocks; `bbc-product-2026.liquid` gains `pay_line`, `stories_label/url`, `help_lead/label/url`, `sheet_bg` (drawing-sheet ground + culm); CSS appended to bbc-redesign-2026.css, tokens only (ratchet 0). Preset FAQ answer with the gated "independently tested … last for years" wording replaced with the Register sentence (it was still in the section's schema on live).
- Gravel template on the preview: order main > kitdraw > kitspec > kitship > lower; icons on all 8 rows; 4 effort cards; 2 docs; 5 callouts. Persistence verified after the schema-cache wait.
- Estate fight: the universal `.bbc-rd h2:not([class*="rd-fs-"])` !important rule sized the drawing heading at 102px and broke "everything" mid-word → fixed the repo way: `rd-fs-kdraw` class on the h2 + a scoped rule.
- Verified on preview: live-check → 0 banned claims; screenshots 1440 + 390 in qa/evidence/2026-09-02 (preview_*). Remaining WARNs are estate-wide (10 button styles, 10 display h2s, 15 sub-12px texts, cookie card).
- NOT touched: live theme. Live rollout = same 4 files + 10 templates after James's go.
