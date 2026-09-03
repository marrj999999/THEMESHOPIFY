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

## 2026-09-02 (evening) — Kit page v2 LIVE on all ten kits (James: "push to live and review kit by kit")
- Sections + CSS to live (4 files, read-back identical); then all ten `product.kit-*.json` rebuilt per kit and pushed (10/10 identical), then MTB + both balance kits given a kit-spec section (MTB 4 sourced rows; balance = effort cards only under "the build, honestly."). `bbc-kit-drawing-2026` fixed to accept single-image products (balance flax).
- Per-kit customisation: titleblock № 01 balance flax · 02 balance lugged · 03 city · 04 road · 05 gravel · 06 MTB · 07 fatbike · 08 gravel lugged · 09 road lugged · 10 custom. Drawing image = product image 2 (exploded/flatlay) except fatbike (image 1 frame render, pins off — its image 2 is the 29er flatlay), balance lugged (image 5 flatlay, pins on tubes + lugs only, lede names the components pack), balance flax (its only image). Callouts: wrapped kits 5 (tubes · CNC metalwork · flax + epoxy · jig + plan · manual + video); lugged 5 (tubes · aluminium lugs · adhesive · jig + plan · manual); custom (tubes for your geometry · metalwork chosen at checkout …); balance per description. Pins placed by eye from each image (coords in the templates). Stories link → club-news tag per kit (gravel/road/mtb/city/fatbike/custom; lugged → gravel/road; balance → all club-news). Pay line omits Cycle to Work on balance kits. Effort hours per kit from the vault notes.
- Verified on live (Playwright, 1440): every kit renders sheet + culm, pay + help lines, drawing band with image, correct № , pins where set, spec pictograms, 4 effort cards; 0 banned strings; 0 overflow. Band screenshots reviewed by eye for all ten.
- Preview theme 199089193334 left in place (safe to delete once James is happy).

## 2026-09-02 (night) — Impact page v2 on the PREVIEW theme 199089193334 (James: "work on the impact page")
- Built from the Claude Design canvas "BBC Impact Page" (design/impact-page/, Main + Phone). Same family as the kit page, not a rebuild: the live page stays the spine.
- `sections/bbc-impact-2026.liquid`: NEW stations band (`.rd-stations`, blocks of type `station`, 4 pictograms, the culm timeline horizontal on desktop / vertical on mobile) inserted between the record and the strands; `arm1..3_icon` selects render a stamp pictogram on each strand photo; `count_eyebrow/title/body` settings render the "how we count" honesty note (steel stamp card) above the report card. All hidden when blank — the LIVE template renders unchanged.
- CSS appended (tokens only, 0 literals). Estate fights found on the preview and fixed the repo way: a display:none rule swallowed the track/culm divs (explicit display:block); the report band's centred block eyebrow leaked into the note; the strand chip wrapped when it shared its row with the icon (icon moved onto the photo as a stamp); the universal 102px h2 rule → `rd-fs-stn` at the kit-drawing size (display h2 budget stays 4 of 9).
- Preview template (design/impact-page/page.impact.preview.json, NOT in templates/): stat_institutions 24 → 22 (education page's verified wall); "impact case studies." lowercase; 4 station blocks; icons; count note; and a claim fix — the Project Zero story blurb and the councils flow said "rated the day 9–10/10", which banned-claims.mjs has prohibited since 31 Jul ("regularly reached"). That string is LIVE today on /pages/impact (logged in ESCAPES).
- Verified: gate PASS; read-back identical (section, CSS, template); live-check on the preview → 0 banned claims, 0 contradictions; screenshots 1440 + 390 in qa/evidence/2026-09-02. Remaining: cookie-card FAIL (estate-wide, every mobile page) + 4 estate WARNs unchanged.
- NOT touched: live theme. Live rollout = section + CSS + `templates/page.impact.json` after James's go (template needs his authorisation).

## 2026-09-02 (late) — Impact page benchmark: six approved facts added to the PREVIEW build
- Ten peer impact pages rendered live (qa/research/impact-page-benchmark.html + .md). Preview page now lists 17 of the 20 content elements seen across the set (live page: 11).
- Section: stations band gains a link (`stations_link_label/url` → /pages/theory-of-change); new `recog_label/recog_a..d` recognition chips and `ident_line` identity paragraph under the count note. CSS tokens only.
- Preview template: record stat `stat_ocn` → "3,500+ bikes built" (courses stay in the prisons strand); station 1 note "108 contact hours per Maker, per course"; `arm3_who` gains "13 trained as instructors in 2026, across three sites"; four recognition lines (Investec BB 2025 · Green Heroes 2018 · Musée du Luxembourg 2024 · National Justice Museum 2026); identity line (CIC not a charity · UKPRN 10098630 · two OCN Level 2 courses · since 2012 / CIC 2025 · four workshop cities). Every string is a Register/Proof Bank approved wording.
- Verified: gate PASS; read-back identical (section, CSS, template); live-check 0 banned / 0 contradictions; screenshots refreshed. Live theme untouched.

## 2026-09-02 (late) — Impact page stakeholder audit (James: "view as a stakeholder… what information they need")
- Eight stakeholder journeys × evidenced asks from two vault sweeps → qa/research/impact-page-stakeholder-audit.html (+ .md). Impact routes all eight correctly; gaps sit on prisons/programmes/support-mission and behind them (documents that do not exist yet).
- Preview: `press_line` setting + `.rd-ident--press` (press and researchers: interviews, images, workshop visit on request). Read-back identical; live-check 0 banned / 0 contradictions.
- PREPARED, NOT PUSHED (templates need James): impact-report stat_2 "4 active prison sites with HMPPS" → five-sites formula; prisons check_1 "Enhanced-DBS facilitators" → "Facilitators vetted for prison delivery"; theory-of-change story_4 "testing of the frames" → tubing wording; programmes + schools "rideable bamboo gravel frame" → "bamboo gravel frame"; schools "proposed Level 1 curriculum…" → "accreditation route in development", "BBC Education CIC" → "Bamboo Mobility Project CIC", DBS line → "Public-liability insured · safeguarding-first delivery"; index hero_cred same; home section default same; impact section defaults "active prison sites" → "UK prison sites" / five-sites formula. All gate-checked.
- Flag: "featured in 40+ publications" (impact press_more, about + press-archive defaults) is an unsupported cumulative claim per the Press and Media Log — verify or soften.

## 2026-09-02 (night) — Impact v3 on the PREVIEW: James's new counts (14 staff · 10+ peer mentors) + stakeholder-audit changes
- James: "we have trained 14 staff and 10+ prisoners have become peer mentors" → Claims Register + Proof Bank + Decisions/2026-09-02 Staff and Peer Mentor Counts (supersedes 13-in-2026 and 3 peer instructors; "Makers", "peer mentors").
- Preview template: record re-composed — headline four (4,000+ · 90%+ · 26% · 10+ peer mentors), supporting four (1,500+ · 22 · 3,500+ bikes · 14 staff); 45 countries and 5 sites leave the record (sites stay in the prisons strand lede). Prisons strand: lede carries the OCN courses, flow = 90%+ · 14 · 10+. Station 4 body, flagship card outcomes, cs_outcomes updated. How-we-count gains three honest lines (no post-release tracking yet · no carbon figure until an LCA · CIC accounts due Nov 2026). Hero gains the kit-page titleblock (`hero_tb_*` settings, `.rd-tblock--hero`). data_as_of → September 2026.
- Canvas "BBC Impact Page" republished as v3 (Main + Phone mirror the build; design/impact-page/ updated).
- Verified: gate PASS; read-back identical (section, CSS, template); live-check 0 banned / 0 contradictions; screenshots refreshed.
- PREPARED, NOT PUSHED (live templates, need James): build-to-bond stat_staff/stat_peers → 14 / 10+; prisons step_3 body; live page.impact.json flagship outcomes; FAQ "schools Level 1 … approval process" + "cohorts of six Makers" rewritten. All gate-checked. Live rollout list now: impact section + CSS + page.impact.json (v3) + impact-report, theory-of-change, prisons, programmes, schools, index, build-to-bond, FAQ templates.

## 2026-09-02 (night) — LIVE: impact v3 + claim fixes + pack pages + responsive pass (James: "push live, every block responsive, every kit page")
- Kit coverage check (live matrix): all ten kit product pages carry the v2 blocks (sheet, pay/help lines, drawing, spec/effort, docs, shipping, titleblock); fatbike has no pins (no flatlay), balance kits are effort-only by design. What James saw missing were the **component packs and tool products** (template `product.component-pack` / `product.parts`, section bbc-parts) — they now get the "what's in the box" drawing band (product image 1, no pins) + the shipping band. 7 packs + 4 tool products.
- Responsive pass (measured at 1440 / 1024 / 768 / 390, Playwright): no horizontal overflow on impact, gravel, balance, pack, tool pages. Fixes shipped in CSS: third strand card spans the row at tablet (was orphaned in a 2-col grid); strand chips wrap inside one pill ≤1100px; record 2 columns ≤900px; kit effort strip 2 columns ≤900px; kit culm bars stay in the gutter ≤1100px (overlapped the drawing heading at 1024); titleblocks 11.5px ≤480px.
- Pushed to LIVE (196820238710) after snapshot (qa/evidence/2026-09-02/pre-push): sections/bbc-impact-2026.liquid, assets/bbc-redesign-2026.css, templates: page.impact (v3), page.impact-report, page.theory-of-change, page.prisons, page.programmes, page.schools, page.build-to-bond, page.frequently-asked-questions, product.component-pack, product.parts. Page templates were pulled from live and patched (index.json excluded — live differs from repo and had no DBS string). Read-back ✓ all 12.
- Blog article news/project-zero-impact-case-study summary carried "rated the day 9–10/10" (rendered on /pages/programmes via article excerpt) → summary updated via articleUpdate to "with ratings that regularly reached 9–10/10".
- Live-check after: impact 0 banned / 0 contradictions; remaining FAILs are estate-wide (cookie card on mobile; page weight on programmes 11 MB and build-to-bond 5.3 MB — pre-existing; FAQ has no h1 — pre-existing). Canary baseline for impact reseeded.

## 2026-09-02 (late night) — Impact page optimisation pass (James: "is it live and have you optimised the design")
- Live confirmed by cache-busted fetch: stations, hero titleblock, strand pictograms, count note, recognition/identity/press ledger, 10+ peer mentors, 14 staff, September 2026 data note; no "3 Makers" left (the flagship card outcomes were the last copy — fixed in the live template).
- Lighthouse BEFORE (evidence/…/lighthouse/*-before.json): mobile perf 60 · LCP 25.3 s · SI 7.1 s · 4.6 MB · a11y 91; desktop perf 96 · a11y 91. Causes: the hero film (3.3 MB mp4) preloaded with a poster on every device and its first visible frame counted as LCP; scroll-reveal keyframes (rd-rise-safe .3, rd-chip-in .25, rd-wordmark-rise .35) put text below contrast while off-screen; backers ledger pairing wrapped <li> in a <div>; carousel dots 11 px; strand images 900 px with no srcset.
- Fixes (all live, read-back ✓): bbc-impact-hero.js — preload none, no poster, fetchpriority low, starts after window load on desktop and on first scroll/touch on phones (LCP stops at first input; James's "films play on mobile" rule kept); ledger wrapper is now the <li>. bbc-rd-nav.js re-stamped twice (the hero script is fetched under nav's ?v=, per the URL DERIVATION note). bbc-statement.css / bbc-universal.css — reveal floors raised to .85 (rise kept, contrast never below AA). Impact section — strand images get 450/700/900 srcset, sizes, lazy, decoding async, width/height; carousel dots 24 px hit area with ::after visual. Reveal-floor change is estate-wide (every page's .rd-reveal / .rd-stagger / chips / wordmark).
- Lighthouse AFTER: mobile a11y 100, perf 62–82 across runs (LCP 4.5–8.7 s, SI 2.1–6.0 s, 1.1 MB); desktop perf 98 · a11y 100 · LCP 1.1 s. Best practices stays 77 on both: third-party cookies (Bold Upsells, Shopify analytics) + inspector issues — app-level, not theme.
- Remaining, not theme work: Bold Upsells JS (254 KB unused on every page — app embed; recommend disabling); page weight on /pages/programmes (11 MB) and /pages/build-to-bond (5.3 MB) — films and images, next pass.
- Kit coverage regression at 390 px: 21/21 kit, pack and tool pages carry their blocks, no overflow.

## 2026-09-02 (late) — Four-site count LIVE; Build to Bond v2 on the PREVIEW with the Lowdham film
- **Count fix, live everywhere.** Register (updated by James in the film session, 2 Sep): "Build to Bond is established across **four** UK prison sites, at different delivery stages." Five → four on impact, build-to-bond, impact-report, support-mission, prisons (via the commissioners section default) and the programmes/impact-report section defaults; stat blocks 5 → 4 on build-to-bond, impact-report and support-mission. Gate patterns updated in qa/banned-claims.mjs AND scripts/claim-lint.sh (both now ban 5/five/3/three; four is the approved wording). Read-back ✓, cache-busted page checks: five 0 / four 1 on every page.
- **Build to Bond v2 (preview 199089193334, canvas https://claude.ai/code/artifact/d63330de-c6d6-4b29-9cb7-41a735fb2662):** the why-it-works image is now THE FILM — `Lowdham Promo — FINAL v15 SUBTITLED` encoded to 720p (34 MB, H.264 2.4 Mbps) and uploaded to Shopify Files as `bbc-lowdham-film-v15-subtitled-720p.mp4` (gid://shopify/Video/71181804831094; Shopify made 480p/720p/HLS renditions); preview image set to the face-free wall-sign poster via fileUpdate; rendered through snippets/bbc-media (facade, plays inline with sound) via a new `film` video setting, with `film_url` as a plain-player fallback. Hero titleblock (`hero_tb_*`); six weeks as the culm timeline (step blocks gain `icon` + `note`); the three course cards, EMPTY on the live page since 27 Aug, filled with exact OCN titles/IDs, cleared stills (assets bbc-rd-prison-plans/-bike/-frame-jig.jpg) and pictogram stamps; recognition chips in the credibility band; breadcrumb Home / Build to Bond; cta2 default → /pages/support-mission; why_body_2 → Register wording ("prisoners who receive family visits", "assessed" not "recognised", MoJ 2024–25). Hero reel on phones now starts on first input (preload none), same reasoning as the impact film.
- Measured at 1440/1024/768/390: no overflow; film column 390 px at phone (was 544 — fixed); cards 3/3/2/1 columns; stations 4/4/1/1. Live-check: 0 banned, 0 contradictions; remaining FAILs estate-wide (cookie card) + page weight 5.8 MB mobile (3.8 MB jig reel loads on interaction).
- **NOT LIVE — gate:** the vault records no written press-office clearance for the film (Wayne Peters, via Sally Allsopp; "still open before external release", v12 review). Goes live on James's word.
- **Tooling escape fixed:** qa/push-theme.mjs pushed binaries as TEXT (themeFilesUpsert) — four JPEGs on the preview theme were corrupted (size doubled, not JPEG on read-back). Now BASE64 for image/font/video extensions; the four were re-uploaded via the REST Asset API. No binary had been pushed to LIVE this way.

## 2026-09-02 (late) — LIVE: Build to Bond v2 with the Lowdham film (James: "go live, I've checked the video many times and no prisoner's face is showing")
- Decision recorded: [[Decisions/2026-09-02 Lowdham Film Published on Build to Bond]] (vault). Press-office clearance remains an action for James (send the page + v15 link to Sally Allsopp for Wayne Peters).
- Pushed to LIVE after snapshot: assets bbc-rd-lowdham-poster.jpg, bbc-rd-prison-plans.jpg, bbc-rd-prison-bike.jpg, bbc-rd-prison-frame-jig.jpg (BASE64 — read back as real JPEGs), assets/bbc-redesign-2026.css, sections/bbc-build-to-bond-2026.liquid, templates/page.build-to-bond.json. Read-back ✓.
- Live DOM verified at 1440 and 390: film player (HD-720p source, wall-sign poster), 4 timeline stations, hero titleblock, 3 course-card stamps with images loaded, 4 recognition chips, breadcrumb "Home / Build to Bond", "Fund a cohort" → /pages/support-mission, "four UK prison sites" and no "five". Responsive at 1440/1024/768/390: no overflow; media 720/512/768/390; cards 3/3/2/1; stations 4/4/1/1; reel preload none on phone.
- live-check: 0 banned, 0 contradictions; FAILs are estate-wide (cookie card) + mobile page weight 5.3 MB (jig reel on interaction).
- Gates: the four-site change left the canary corpus line "4 prison sites running" uncovered → added the "every site running/operating" shape to qa/banned-claims.mjs and scripts/claim-lint.sh; impact visual baseline reseeded after the count change.

## 2026-09-02 (late) — Build to Bond: James "does not look correct, content poor, video not showing" → second pass, LIVE
- **Root causes, found in a real browser (not the Playwright harness, which had been injecting opacity:1 and animation:none):** (1) the film was the bbc-media click-to-load facade — after the click the poster hides and the cloned <video> waits for playback permission, so on phones it read as a black box; (2) every `.rd-reveal` block on the page starts at opacity 0 (`rd-rise` keyframe) until a scroll-driven animation reveals it — two `@keyframes rd-rise` exist (bbc-statement.css AND bbc-redesign-2026.css; the redesign one loads last and won), so the .85 floor I set earlier only reached the impact page.
- **Fixes, live:** native `<video controls playsinline preload="metadata">` with the wall-sign poster and both Shopify renditions (mp4 + HLS), lime ticket label, no JS dependency; `rd-rise` from-opacity .85 in BOTH stylesheets (site-wide — nothing starts invisible; the rise still animates); the film column exempt from reveal entirely.
- **Copy rewritten** from Context/Programme Library + the film's own narrative: story band (two paragraphs, James's voice), why band (Register wording), steps retitled "six weeks to a frame. then the bike that goes home." with the true arc (week 1 craft · week 2 bicycle theory + pitch · weeks 3–6 frame, assessed · then the balance-bike course and family visit day), course cards in plain English with exact course IDs, film caption.
- Verified after a real scroll on desktop and emulated iPhone: video element present with poster, 2 sources, controls, readyState 4; stations/cards/h2 at 0.85 at load; read-back ✓ on section, both stylesheets, template.
- Lesson for the harness: never inject `.rd-reveal{opacity:1}` in verification runs; measure at load and after a real scroll.

## 2026-09-02 (late) — Prison case studies with featured images, LIVE (James: "get all prison case studies and make sure you are using featured images")
- Blog audit: 490 articles; 8 are prison-programme stories (impact ×2, news ×4, schools-and-education ×2), all with a featured image. Face-safety review of all 8 featured images (contact sheet in scratchpad): 7 clean (empty workshop ×3, aerial, gloved hand, FT page, balance-bike bench). **Inside Time's image (IMG_7424) showed three people at the "HM Prison Lowdham Grange" wall, one facing camera** — the vault had flagged it; replaced via articleUpdate with the cleared `bbc-prison-sign.jpg` still (old image URL kept here: articles/IMG_7424-scaled_3088bf28-48dd-4268-b69c-da3397da8e47.jpg).
- /pages/build-to-bond: the single hardcoded card is replaced by a band that renders every listed article through snippets/bbc-cscard with `image_pic: article.image` (the article's own featured image). List = `cs_handles` setting (one blog/handle per line, editorial order; first card featured). Live: 8 cards, all images loading, desktop 3-col / phone 1-col, no overflow.
- /pages/impact: the three prison cards that used stock stills now use the articles' featured images (flagship full story, transforming lives, Inside Time → wall-sign still).
- Read-back ✓ (section, CSS, both templates).

## 2026-09-02 — Education page (/pages/programmes) aligned to Chris's "Intro to Services" deck — PREVIEW ONLY
- Source: Chris Barrett's "Intro to Service BBC CIC.pdf" (13 slides, emailed 2 Sep). Built on preview theme 199089193334, not live. Review: https://bamboobicycleclub.org/pages/programmes?preview_theme_id=199089193334 · mapping in design/education-page/deck-alignment.md.
- New bands: material (deck 3–4), five ways in — culm timeline + pathway sheets (deck 5–10, block `pathway`), school timetable (deck 11, `ttrow`), outcomes (deck 12, `outcome`), recognition chips on the credibility band (quote block now guarded when blank); hero titleblock + deck lede; schools arm rewritten; the free-speaker schools arm copy and the five-tier pathway band retired (blocks dropped, types kept). New snippet `bbc-edu-pic` (shared pictograms).
- Claim gates: iMechE 2018, T Level hours and bike-share kept OFF (no vault evidence); Green Heroes in CS-29 wording; OCN 1131207 exact title; Project Zero line in Register wording. OPEN for James: Register "Free entry point" row (27 Aug) vs deck pricing of pathway 01 — the preview follows the deck.
- Gate: liquid ✓ token-lint 0 ✓ claim-lint ✓ (two section comments tripped the lint on the first run — reworded). Verified in Playwright at 1440 and 390 after a real scroll: no horizontal overflow; exclusive accordion (`details name`) OK. Read-back ✓ (section, css, snippet, template on 199089193334).

## 2026-09-02 (late) — Education page v3 — PREVIEW ONLY (James: "repeating content, poor design and images, lacks video content and case studies")
- Inventory first: 616 blog articles via Admin GraphQL (78 education-relevant, featured images), 26 films and 2,047 image files in Shopify Files, plus the vault (Education MOC, Programme Library §4, Claims Register, Proof Bank). Design canvas: https://claude.ai/code/artifact/d5c8a238-6b07-475c-8a60-a90be628d446
- Repetition removed: the fork cards, the stations index, the schools arm and the community ladder each re-listed the same five pathways. v3 keeps ONE device — the pathway ledger (culm rail, one sheet open at a time). Page height 19.0k → 15.4k px, no duplicated list.
- Video (page had none): speaker-build film in pathway 01 (bbc-media facade), why-bamboo film as its own dark band (Shopify Files, native player), Kirui film as a case-study card, tutorial band kept at the foot.
- Case studies: new band rendering 8 real articles with their own featured images. `cs_handles` = `blog/handle | kind | youtubeId | outcome | attribution`; outcome and attribution are editorial because blog excerpts open with pipe-delimited metadata and the publish date is not the delivery date.
- Pathway sheet balance: media column carries the film/photo, the "seen in" link and the themes so a 16:9 film no longer leaves a hole. Schools band: quote moved under the table so both columns land together.
- Gate: liquid ✓ token-lint 0 ✓ claim-lint ✓. Playwright at 1440 / 768 / 390 after a real scroll: no horizontal overflow, exclusive accordion works, films present. Read-back ✓ on 199089193334.

## 2026-09-03 — Education page v3 LIVE + full test (James: "Ok make live and test full")
- Pushed live 196820238710: snippets/bbc-edu-pic.liquid + assets/bbc-redesign-2026.css → sections/bbc-programmes-2026.liquid → (50 s) → templates/page.programmes.json. Read-back ✓ on all four. Rollback kit at qa/evidence/2026-09-03/pre-push.
- WEIGHT: first live measure 26.4 MB. The hero loop was downloaded twice (preload=metadata + an explicit load() restarts the fetch) and the band film pulled its full 7.7 MB. Now: hero preload=none with the source attached after window load (first input on phones), band film preload=none behind its poster, and a page-scoped 640-wide re-encode (assets/bbc-rd-edu-hero-loop.mp4, 2.3 MB vs 8.5 MB). **26.4 → 4.98 MB.** evh_film_url now accepts a bare asset filename.
- live-check: weight passes both widths; remaining FAIL is the cookie card at 54% of the mobile viewport — reproduces on /pages/impact, so app-level and estate-wide.
- canary 14/14 alive (visual baseline reseeded, run twice). Links: 16/16 resolve 200. Films all play (speaker facade → iframe, Kirui card → iframe, why-bamboo native 42 s, hero loop running).
- Lighthouse desktop 99 perf / 100 a11y / 100 SEO, LCP 0.9 s, CLS 0, TBT 0. Mobile 100 a11y, 66 perf, LCP 8.5 s — /pages/impact scores 63 / 8.5 s on the same run (estate CSS baseline, not a regression).
- Fixed while testing: .edt-instk contrast 3.64:1 → charcoal at full opacity; a11y 97 → 100 desktop and mobile.
