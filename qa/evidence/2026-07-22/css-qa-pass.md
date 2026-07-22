# CSS QA pass — browser session over the Chris-feedback bands (2026-07-22)

## Issue 1 — CTA hierarchy broken in the discovery-call band (FOUND via desktop screenshot)
The three secondary route cards ("Shop & book", "see the programmes", "Back the mission") rendered as
filled forest pills with the SAME visual weight as the primary "book a discovery call" button —
defeating the one-dominant-CTA rule the band was built on. Cause: `rd-path__cta` is deliberately a
filled pill (bbc-statement.css:557 — underlined links there once broke on global link rules).

**Fix:** new scoped `.rd-textlink` class in `bbc-tokens.css` (loads last, overrides the global link
rules cleanly — underlined arrow text link, forest on light / bone on dark). The discovery-band help
cards + the customer-segment cards now use it instead of `rd-path__cta`. One pill per band; secondaries
are text links.

## Issue 2 — segments-band heading mismatched its new content
Band still read "recognised by / who backs this work." while now LEADING with customer segments.
**Fix (template):** eyebrow → "who we work with", heading → "who this is for — and who backs it."

## Issue 3 — text-link tap targets below WCAG minimum
`.rd-textlink` measured **19px** tall (< 24px WCAG 2.5.8 minimum). **Fix:** `padding-block:12px`
(+ margin rebalance) → **43px** tap target, same visual line.

## Verification — all green (2026-07-22)
- Desktop 1280: discovery band = ONE filled pill + 3 underlined text links (bg transparent, underline confirmed via computed style) ✓; segments band 2×2, question-led, new heading ✓.
- Mobile 390: overflow 0 ✓; both bands stack single-column ✓; tap targets 43px ✓; no Liquid errors ✓.
- Screenshots: qa-discovery-band-fixed (desktop), qa-segments-band2 (desktop), qa-segments-mobile.

---

# "From bare bamboo to the open road" — video band rebuild (2026-07-22)

## Video sourced from YouTube (James's ask: a complete build)
Compared 9 candidates across the BBC channel + community via YouTube API:
- **CHOSEN: `UhuzVI2yVNU` — "Building a Bamboo Bike Frame from a Home Kit (Full Build)"** — BBC's own channel, genuine start-to-finish ("box of raw bamboo through…"), **16,427 views** (the channel's best-performing full build — this is the "16.4k build film" from DESIGN-RESEARCH R2b), 9m25s.
- Rejected: 3D-lug Live Build (27.8k views but a Design-Museum special, not the kit build) · Julian Goulding's build (third-party + already the PDP embed) · by-hand/gravel clips (55s–3m44s snips, not complete).
- yt-manage OAuth expired again (weekly known issue) — used public YouTube API.

## Layout tidy-up
- Band rebuilt: eyebrow → h2 → NEW lede → **inline-play YouTube via bbc-media** (poster + play, no iframe until click, youtube-nocookie) → NEW credit line. New schema: `video_url`, `video_lede`, `video_credit`; legacy `video_mp4` path kept as fallback.
- Layout iterations (measured, not guessed): centred 980px wrap failed — first the missing `.rd-mw-980px` utility (added), then home's one-left-axis rule (`bbc-statement.css:172` forces margin-left:0 in rd-center). **Followed the axis instead of fighting it**: left-aligned head/lede + full wrap-width cinematic video. Verified head + video on the same 72px axis; lede rd-mx-auto removed.

## Verified
Desktop 1280: axis-aligned, video 1136px, poster + play → iframe `UhuzVI2yVNU` autoplays ✓. Mobile 390: overflow 0, video fits (354px), inline play + correct video ✓. Screenshot: video-band-final.

---

# THE STANDARD PLAYER — bbc-media v2 rollout (2026-07-22)

## Root cause of "the video isn't full screen" — FOUND & FIXED SITEWIDE
`bbc-mobile-fixes.css:305` — global `img,video,iframe{height:auto !important}` collapsed EVERY embedded
iframe to the 150px browser default (my earlier "fills" check only compared widths — the bug was live
everywhere). Fix: scoped counter-!importants on `.bbc-media__frame iframe` (the sanctioned last-resort
per the best-practice research). Verified: iframe 1136×639 in a 1136×639 box (desktop), fills on mobile.

## New film (James's pick): DAMHyvr698k
"I built my own Bamboo Gravel Bike! (FULL BUILD)" — Julian Goulding, 29m, 8.7k views, 2.9% like ratio.
Third-party community build = allowed WITH CREDIT (house rule) → credit line names Julian.

## bbc-media v2 — the signature treatment (one snippet = every page)
duotone forest poster that RESOLVES TO COLOUR on hover/focus · rotated lime TICKET chip (label param)
· breathing lime play (reduced-motion guarded) · click → loading state (poster dims, spinner) → fades
into inline youtube-nocookie/vimeo/file playback · box locks to 16:9 while playing (no letterbox) ·
fullscreen (allow+allowfullscreen+fs=1) · facade (nothing loads until click) + preconnect on hover ·
ZERO-CONFIG POSTERS: YouTube maxres thumbnail auto-used when none supplied (hq fallback).

## Rollout
Automatic via the snippet: Impact stories · gallery · about · schools cards · team-building · support-
mission · amersfoort · why-bamboo pillars · homepage why-cards. NEWLY MIGRATED off raw iframes/mp4:
product build film (bbc-product-2026) · education Speaker film · workshops watch-a-build (YouTube-first,
teaser mp4 fallback) · homepage band.

## Verified
Home desktop: auto-thumb of DAMHyvr698k, chip "watch the full build · 29 min" rotated, duotone active,
loading→playing lifecycle, iframe FILLS, fs=1 ✓. Product page: standard player, auto-thumb, chip,
duotone, no overflow ✓. Mobile 390: fills, correct film, overflow 0 ✓. Screenshot: signature-player-poster.

---

# THE PRESS BLOCK — standardised press system (2026-07-22)

Research (banked in qa/PRESS-BLOCK.md): press logos answer "are you legit?" (Halo Effect, the lasting
value of coverage); bare logos are going numb — QUOTE + LOGO pairing is the 2026 upgrade; 4–7
recognisable logos beat 20; quiet uniform row; place near the fold on home, mid-page proof zone on PDPs.
10 layout patterns evaluated → quote-anchored logo bar chosen ('bar'), quiet row secondary ('quiet').

Built `snippets/bbc-press.liquid` (THE standard): canon hardcoded (single source of truth) — national:
FT (wordmark asset, fixes the stacked-logo clip) · Guardian · BBC News · Telegraph · CNN · Inside Time;
cycling preset: BikeRadar · road.cc · Grand Designs · Huck. FT/Inside Time/GCN/BikeRadar/road.cc link to
their Proof-Bank canonical articles; all links carry ?ref=press-block (feedback-loop hook). Styled-text
FAKE logos on the homepage KILLED (real logos only). Impact featured-in strip migrated ('quiet').

FEEDBACK LOOP: ?ref=press-block → GA4/Shopify reports · quarterly swap-weakest review · page-pass CRIT
rules in PRESS-BLOCK.md · James phone gate. ⚠️ GCN logo asset missing (canonical article ready).

VERIFIED — home desktop: 6 real logos uniform 26px, FT→canonical+ref, IKEA-effect quote, 0 fake logos,
overflow 0 (screenshot press-block-standard). Impact: standard block live, 6 logos, 7 tracked links, old
grid gone (remaining FT stacked ref = footer's own greyed strip, deliberate). Mobile 390: 22px uniform,
all fit, overflow 0.

---
# Press-quote mining & sitewide wiring (2026-07-22)
Vault mined (Proof Bank, CS-05) + the 5 canonical republished articles fetched and quote-extracted
(FT, Inside Time, GCN, BikeRadar, road.cc — all source-verified in the June sweep). 10-quote bank built
into qa/PRESS-BLOCK.md with per-page mapping. NEW wiring: Sally Allsopp (FT) → Impact B2B band (recovers
the lost quote, now source-verified) · BikeRadar MacGregor → Workshops press band (new, editable) · GCN →
PDP under the build film (new, editable) · Timpson pull-quote RESTORED on Impact (was gating the band
without rendering — audit footgun closed). VERIFIED live: 7/7 placements render, no Liquid errors.

---
# Real-logos-everywhere + press layout optimisation (2026-07-22)
DECISION (James): all real logos. Audit found remaining styled-TEXT logo fallbacks: About press band
(migrated → standard bbc-press block), teambuilding client wall (dormant — no blocks render; fallback
made ASSET-ONLY so text can never masquerade; GM/Google/McLaren stay OUT pending the vault verification
hold; assets ready for investec/macallan/fourseasons/hilton). Impact backers keep real logos (chips are
visibly chips, not fake logos). VERIFIED: 0 rd-logotext renders across home/our-story/impact/teambuilding.
LAYOUT OPTIMISATION: audit caught a mixed axis on the home press band (quote left, logos centred). Added
`align` param to bbc-press; home band now FULL LEFT AXIS — measured eyebrow/quote/first-logo/more-link all
at exactly 72px (screenshot press-band-one-axis). Impact/About stay centred (their context). About mobile:
6 logos uniform 22px, overflow 0.

---
# Press v2 — scrolling quote reel + full link verification (2026-07-22)
Vault mining round 2: Press and Media Log (A-grade URLs) + Verified-2026 case notes gave Guardian
(Stuart Heritage "hands-down one of the best things I have ever done", theguardian.com), CNN Money
("The material provides natural suspension", + live blog), BBC News (Kate Strong, + live blog),
Fast Company (live blog). TELEGRAPH: vault says feature UNVERIFIED → logo REMOVED from canon,
Fast Company swapped in (flagged to James). Reel: 8 verbatim per-publication quotes, marquee, pause
button (aria-pressed), reduced-motion static, mobile clipped/overflow 0. VERIFIED: all 8 internal
article links return 200; Guardian external target=_blank rel=noopener; pause toggle works;
screenshot press-quote-reel. Single-source canon means About/Impact/workshops/PDP inherited the
link + Telegraph changes automatically.

---
# Press gap closure (2026-07-22)
Sourced 4 OFFICIAL logo files (Wikimedia official brand files + publisher's own PNG — zero fabrication,
house rule intact): Independent SVG · Cycling Weekly SVG · Evening Standard PNG · BikeBiz PNG. Uploaded
(push-theme/push-binary), canon updated: national = 6 UK-strong (Independent + ES in; CNN/FastCo stay in
the reel), cycling + Cycling Weekly + BikeBiz. All new logos link to their A-grade articles from the
vault Press Log (Independent/ES/BikeBiz external, target=_blank). Recognition strip live on About
(4 logos incl. the CURRENT National Justice Museum exhibition). VERIFIED: all 6 national logos load +
uniform 26px; widths clamped after armouring max-width (Independent was 368px via the global
img{max-width:100%!important}); About strip renders. Remaining (external input): GCN/SUITCASE/D&TA
logo files; Telegraph + early-FT publication evidence; GQ never until published.

---
# THE MASTHEAD SCALE — universal type system (2026-07-22)
Full contract + research table: qa/TYPE-SCALE.md.
AUDIT (home, 1280): 96/86/26/22/18/15/14, w800/700/400 — all token-driven.
RESEARCH (11 points): measured Guardian 28 · NYT 28 · Pudding 32 · Stripe Press 21 (dense-news ≠ our
genre) + documented ceilings: MD3 57 · Carbon 92 · GEL (60ch, -0.03em bold tracking, AA table) ·
Serendie 64 · LearnUI 30–50 · editorial clamp ~100 · oversized-editorial genre 100–140. Key a11y catch:
vw ignores browser zoom → rem floor/cap carry WCAG 1.4.4.
DECISION: display clamp(3.4rem,9vw,7.75rem) [115@1280, cap 124 — beyond every documented system ceiling,
the masthead signature] · h2 clamp(3rem,7.4vw,6.4rem) [95, cap 102] · h3 →29 · lede 22 · body 18/1.5 ·
display tracking -0.025em (GEL-informed).
TESTED: home 115/95, hierarchy ✓, hero 5 lines ✓, overflow 0 · programmes (longest hero) 115px 4 lines ✓ ·
mobile 390: 47/43/18, 5 lines, overflow 0 · **AAA CONTRAST AUDIT (live computed): hero 9.1:1 · h2 13.1:1 ·
body 15.5:1 · lede 9.6:1 · eyebrow 7.4:1 · reel 9.7:1 · button 10.7:1 — ALL PASS AAA** (body ≥7:1,
large ≥4.5:1). Screenshot: masthead-scale-hero.
UNIVERSAL: shipped in bbc-tokens.css canonical rules → every page inherits; no per-page type rules needed.

---
# Big-type USAGE research + technique implementation (2026-07-22)
Corrected research focus per James: not newspapers — the sites that USE big type. Measured live:
Pangram Pangram 136/113px (type IS the product; hard line-breaks; 96px glyph links; weight-mix) ·
Linear 64/48 (−.022em, lh 1.0, EVERY h2 display-size = page rhythm) · Pentagram 52 (big type as the
repeating CARD unit) · Toggl 61 (ACCENT SPANS in headlines) · Rudnick 38+ (type as interface — index
of display links) · Balenciaga/SSENSE/Klim JS-gated (genre: type replaces imagery; giant wordmarks).
ALREADY HAD: accent hero, tight tracking, display-h2 rhythm. IMPLEMENTED THE TWO MISSING GENRE MOVES:
1. GIANT FOOTER WORDMARK — "bamboo bicycle club" full-bleed 120px @1280 (clamp 2.6rem–9rem), every
   page via the footer, decorative link home, editor toggle (show_wordmark). Verified: fits viewport,
   overflow 0, underline armoured off. Screenshot: footer-wordmark.
2. ACCENT-WORD CONVENTION — <em> in any display h1/h2 renders as the brand accent (lime italic on
   dark/hero, teal on light) — the Toggl/home-hero pattern standardised sitewide in tokens.

---
# bbc-universal.css — the universal stylesheet (2026-07-22)
REVIEW: 15 sheets actually load (ending …aaa-2026 → statement → tokens). bbc-type-scale.css is DEAD
(never loaded — stale 84px caps, excluded). aaa-2026 must STAY pre-statement (it carries old small
heading sizes that statement deliberately overrides — merging it after would shrink the masthead).
BUILD: assets/bbc-universal.css = the canonical content reorganised under a §1–§9 contents map
(fonts → tokens → font enforcement → buttons → masthead scale → textlink → utilities → techniques)
+ NEW §9 global polish/a11y: brand ::selection (lime/forest) · global :focus-visible ring ·
text-wrap:balance on all rd headings · tabular-nums on stat numerals · strong/b normalisation.
theme.liquid now loads bbc-universal.css LAST (bbc-tokens.css retired from the chain — dead file).
Catch fixed during sweep: homepage why-card copy was 15px (outside the body-18 selectors) → added.
VERIFIED (home + programmes, desktop): universal loaded / tokens gone from the chain · scale 115/95/18
intact · AAA spot pairs hold (9.1:1 / 15.5:1) · buttons 999px · wordmark 120px · tabular-nums TRUE ·
overflow 0 · no missing assets (cache hits false-alarmed the heuristic). Mobile checked earlier today
(47/43/18, overflow 0) — universal is content-identical + additive, holds.
RULE: no new hex or font-size outside bbc-universal.css. Next consolidation phase (flagged, not done):
absorb aaa-2026 (needs tie-audit vs statement), retire the ~16 dead sheets, migrate section CSS to
{% stylesheet %} per the best-practice doc.

---
# FIX-ALL + FULL SWEEP with feedback loop (2026-07-22, final pass)
FIXES EXECUTED:
1. Dead-CSS cleanup w/ reference check first — the check SAVED the theme twice: bbc-redesign-2026.css
   has 28 SECTION-level loads (never dead; deleting = sitewide breakage), and bbc-type-scale.css loads
   via bbc-header-2026 on EVERY page (my earlier "dead" log entry was WRONG — record corrected).
2. type-scale's 3 live rules absorbed into universal §10 (hero stamp/ink hides + 92svh min-height);
   its load removed from the header; stale 84px caps NOT carried.
3. Deleted server+repo: bbc-clean, bbc-collection, bbc-distinctive, bbc-homepage-improvements,
   bbc-size-calculator, bbc-tokens (6 files, zero references, themeFilesDelete verified).
4. aaa-2026 intentionally KEPT in place (pre-statement position is load-order-critical) — documented.
SWEEP (screenshot per page, desktop 1280 + mobile 390):
home ✓115px hero, stamp hidden, min-height holds · impact ✓95px discovery band, pill+textlink hierarchy ·
programmes ✓115 masthead hero · workshops ✓press band (BikeRadar quote + new Cycling Weekly/Metro/BikeBiz
logos; Huck "clip" = the file's own tight spacing, verified aspect-true) · prisons ✓ · about → LOOP CAUGHT
2 BUGS → FIXED → RESHOT: (a) recognition preset broke on the comma in "Musée du Luxembourg, Paris"
(split-parser) → label parenthesised, 4/4 logos load, 0 broken; (b) About stats said 36 countries →
45 (canon) · PDP ✓ full signature stack in one frame (duotone + ticket + GCN pull-quote) · collection ✓
46px commerce-density title (deliberate non-hero context) · mobile ✓ 45px hero, 42px wordmark fits,
overflow 0 everywhere.
Screenshots: sweep-01-home … sweep-08-pdp-player-press (+ earlier footer-wordmark, masthead-scale-hero).

## Final full-screenshot verification (post-universal-CSS, this session's closing sweep)

### Desktop 1280 — pages verified
| Shot | Page | Verdict |
|---|---|---|
| fs-01-whybamboo | /pages/why-bamboo | ✓ masthead hero, technical framing |
| fs-02-teambuilding | /pages/bicycleteambuilding | ✓ masthead h2 "a real bike. not a flat-pack kit.", info cards, real corporate photo |
| fs-03-gallery | /pages/gallery | ✓ renders; ⚠️ "Builder Gallery" Title Case = store page title (live-shared) — waits for the go-live "build reviews & guides" reframe, NOT draft-safe to rename now |
| fs-04/04b-whichkit | /pages/which-kit | ✗→✓ **DEFECT FOUND+FIXED**: breadcrumbs invisible (see below) |
| fs-05-contact | /pages/contact | ✓ dark hero, paper+lime crumbs correct |
| fs-06b-schools | /pages/schools (NB /pages/education 404s — handle is `schools`) | ✓ masthead, lime CTA pair |
| fs-07-supportmission | /pages/support-mission | ✓ "a qualification earned at the bench.", Makers language |
| (incidental) 404 page | ✓ renders the designed 404 (ghost numeral, search, 3 pills) |

### Mobile 390 — pages verified
| Shot | Page | Verdict |
|---|---|---|
| fsm-01/02 | home hero + corporate fold | ✓ video hero, chip, lime em; corporate band + lime pill |
| fsm-04 | home signature player | ✓ maxres poster, breathing play, ticket chip, Julian credit |
| fsm-05 | home press band | ✗→✓ **DEFECT FOUND+FIXED**: reel pause button overlapped quote text → reserved 46px headroom ≤749px (bbc-press.liquid) |
| fsm-06 | impact | ✓ locked mission verbatim, discovery-call band next, pills full-width |
| fsm-07 | programmes | ✓ 5-line masthead (≤6 rule), one primary CTA |
| fsm-08/09 | PDP gravel kit | ✓ crumbs healed by universal fix; buy box: £385, canonical sizing, sanctioned Swansea claim |

### Defects caught & fixed this sweep (find→fix→reshoot loop)
1. **Invisible breadcrumbs on light heroes** (which-kit; PDP links too). Root cause: `bbc-redesign-2026.css:290-295` hardcodes the dark-hero recipe (paper `#e9efe7` links + lime current) on every `.rd-crumb`. Fix: universal §9 — crumbs `color:inherit` by default, `.rd-hero`/`.rd-dark` restore paper+lime. Needed `nav` type in selector: the redesign sheet loads per-section in the BODY (after universal in head) and wins bare ties. Verified both ways: which-kit ink ✓, impact paper+lime ✓, PDP ink ✓.
2. **Homepage typo (James editor edit)**: "who we surport" → "who we support" — fixed in deployed `templates/index.json` (pull→edit→push→verified absent).
3. **Press reel pause button over text on mobile** → headroom strip; verified btnBottom 194 < quoteTop 206.

### Notes / open
- `/pages/education` 404s; real handle `/pages/schools`. If any nav/link targets `education`, needs a repoint check at go-live.
- Home h2s "Learn to Build a bike." / "Unique team building day" carry Title Case in source (James edits) but render lowercase visually — no action.
- Gallery page title rename deferred to go-live IA reframe (live-shared content).

## FULL-ESTATE CONFORMANCE AUDIT (134 loads: 67 URLs × 1280+390, headless Chrome/Playwright)
Scope: home · 38 pages (2026 + legacy) · 10 collections + list · 14 products (one per live template suffix) · cart/search/blog/404.
Raw data: scratchpad audit-results.json (h1/h2/body px, fonts, Jakarta scan, overflow, JS errors, alt gaps, per-page CSS network weight).

### Result after fixes
- **100% of the estate renders on the 2026 system** (.bbc-rd) — including all legacy pages (via bbc-page-2026), merch + gift-card PDPs (default template → bbc-rd-product), parts/component-packs (bbc-parts).
- **Atkinson everywhere; 0 Jakarta leaks** on all 134 loads (theme.liquid loads no Jakarta; legacy Jakarta rules live only in unrendered sections).
- **0 horizontal overflow, 0 JS errors, 0 imgs without alt** at both widths, all URLs.
- Type roles measured: display 115 (heroes, cart, 404) · collection/blog/search title 46 · kit PDP title 42 · parts title 30 · body 18. Mobile: 47/28/30. Coherent hierarchy, no strays.

### Defects found → fixed this audit
1. **Light-paper heroes at 52px** (which-kit, theory-of-change, impact-report, media-page): outside .rd-hero so aaa-2026's stale --t-h1 won. Fix: universal §5 display role extended to `.rd-pad h1` (product + prose excluded). Verified 115/47.
2. **Prose headings ballooned/mis-scaled** (regression risk from fix 1 + pre-existing `.bbc-rd h2` at 95px in content): support-centre + size-guide 2×h1, privacy-policy 8×h1. Fix: `.rd-prose h1/h2` → h3 role (29px), `.rd-prose h3` → 21px. Verified: privacy = 1 masthead + 7×29px document headings.
3. **8 dead CSS assets deleted** (server + repo ~31KB): research-system, performance-optimizer, homepage-prefetch-fix, header-fix, type-scale, theme.css, component-collection-hero, component-progress-bar. Network data confirms zero pages requested them. Stale layout/theme.liquid.backup-2026-03-27 removed from repo (was never on server).

### CSS weight (compressed transfer, measured)
- Content pages ≈64.5KB CSS · collections ≈105KB · PDPs ≈113KB (delta = Dawn commerce + Shopify checkout/Shop Pay preloads — platform-controlled).
- BBC stack sitewide ≈52KB compressed across 15 sheets; biggest: redesign-2026 12.8 · base 10.5 · statement 7.8 · foundation 7.8. Universal 1.9KB.
- instafeed-7.1.0.css (app) loads 0KB everywhere; accelerated-checkout compat double-loads on ~7 pages (Shopify-injected).

### Non-defects (analyser expectation noise)
Commerce titles at 42/46/30px are deliberate roles, not masthead misses. /products/workshopvoucher 404s because the product isn't published to the Online Store channel (storefront voucher = bamboo-bicycle-club-gift-card, which renders fine; footer links it correctly).

### Parked for James (content-owned / store-level)
- Privacy-policy body uses 8 semantic h1s (visual fixed; the HTML lives in the admin page body — live-shared, needs an admin edit or go-live pass).
- Legacy page titles are Title Case (store page titles, live-shared): University papers, Geometry set, Whats in the box, etc.
- media-page h1 carries the HELD "40+ publications" figure.
- main-menu "Workshops"/"Programmes" point at /pages/bicycle-frame-building-workshop while the canonical workshops page is /pages/workshops (both live, same template — SEO/analytics split; IA-consolidation decision).
- Local .bak clutter (sections/bbc-timeline.liquid.bak-20260218, templates/page.impact.json.bak-20260224-111345) — rm blocked by session perms.

### CSS optimisation next steps (flagged, not executed — each needs its own tie-audit)
absorb bbc-aaa-2026 (3.6KB, live link/focus/btn systems + stale type vars) into universal · consolidate the 1–2KB micro-sheets (buttons/layout/spacing) · migrate section-level styles to {% stylesheet %} blocks (7/38 adopted).

## FUNCTIONAL + META CHECK-PASS (post-audit "what else" sweep)
- Footer email capture: EXISTS + correct (`form_type=customer` → Shopify subscriber, per brief). ✓
- Article pages (missed by URL-list crawl): were 52px stale h1, no schema → **fixed**: new ARTICLE HEADLINE role 54px (`.rd-art-hero h1`, documented in TYPE-SCALE.md) + Article JSON-LD in bbc-article-2026. ✓
- Favicon: none was set → roundel fallback added in theme.liquid (settings.favicon still wins if James sets one). ✓
- Structured data: PDPs already had Product ✓; added sitewide Organization (mission-locked description); articles now Article. All parse in-browser. ✓
- Web vitals (desktop, measured): LCP 604–708ms · CLS 0–0.002 · TTFB ~460ms · weights: home 1.5MB / PDP 2.0MB / collection 2.9MB (1.15MB grid imagery). All well inside Google "good".
