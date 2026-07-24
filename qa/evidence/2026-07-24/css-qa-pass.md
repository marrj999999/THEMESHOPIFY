# 2026-07-24 — animations restored + Impact content review

## LOST ANIMATIONS — root cause + fix
Symptom (James): "we've lost animations." Diagnosis (empirical, headless Chrome):
- Reveals attached (rd-rise-safe, timeline view()) but below-fold elements sat at opacity 1 — timelines INACTIVE.
- Synthetic probe (clean element, view() timeline, 300vh down) also rendered end-state → page-wide timeline failure, not a selector bug.
- Root cause: bbc-mobile-fixes.css "global overflow prevention" — `overflow-x:hidden !important` on html/body AND every .shopify-section. hidden creates a scroll container; every view()/scroll() timeline inside resolves to a non-scrolling ancestor → inactive → the entire .rd-reveal system silently rendered end-state (likely since the sheet shipped — masked because content stayed visible).
- Fix: `overflow-x: clip` (clips identically, creates NO scroll container). Verification below.

## Animations verified restored (empirical, post-clip)
- Below-fold reveals: pre-entry opacity 0.3 (rd-rise-safe floor) → 1 on entry ✓ (was: stuck at 1, timeline inactive).
- Flagship chips: pre-entry 0 → staggered to 1 ✓ (second scroll-container found: a.rd-cscard{overflow:hidden} → clip).
- Synthetic view() probe drives ✓. Horizontal overflow after hidden→clip: 0px @1280 AND @390 (home+impact) ✓.
- Two-file fix: bbc-mobile-fixes.css (html/body/.shopify-section) + bbc-redesign-2026.css (a.rd-cscard).

## BLOCK-BY-BLOCK content review vs 10 social enterprises
Benchmark set: Switchback · Fine Cell Work · Redemption Roasters · Big Issue · The Clink · Bounce Back ·
charity:water · Who Gives A Crap · Change Please · Elvis & Kresse (+ banked Tony's/Patagonia/Hiut).

| Band | Ours | SE benchmark | Verdict |
|---|---|---|---|
| Hero | locked mission verbatim, 2 CTAs | plain-language mission line (Change Please) | ✓ correct |
| Discovery call | one ask, routes all audiences | single dominant CTA (Unbounce/Mighty Ally) | ✓ correct |
| Stats "record since 2012" | 4 counts + "Data updated July 2026" | dated precise numbers (charity:water) | ✓ strong — the dateline is best-practice |
| "what we do" (schools arm) | head reads bid-speak: "using bicycles for engagement and pathways to vocational skills" | one-line plain mechanism ("We train people experiencing homelessness… through great coffee") | ⚠ RECOMMEND rewrite (James's copy): e.g. "we teach real skills through bike-building — in schools before exclusion" |
| Build to Bond band | family-tie narrative + strongest-predictor framing | named-programme deep story (Fine Cell/Redemption) | ✓ correct · FIXED dangling "Build to Bond -" eyebrow |
| Flagship case study | outcome chips + provenance links | Redemption live-data + charity:water proof | ✓ correct (built this week) |
| Policy band | 9pts/39% MoJ-labelled | baseline-anchored comparisons (Switchback) | ✓ correct — figures still on James's held list |
| Evidence wall | 6 verified cards, filters, proofline, 3 films | story grids + tabs (Redemption/WaterAid) | ✓ correct |
| Quote reel | verbatim voices only | participant voice foregrounded (Switchback Flip the Script) | ✓ correct |
| Map "where we work" | named standing programmes | reach sections (WGAC countries) | ✓ correct |
| Cred/segments | audience questions + backers + Timpson quote | Bounce Back segment pattern; E&K badge wall | ✓ correct + ADDED the missing block: mechanism sentence ("Kit and workshop revenue covers our costs — funder money goes straight to programme delivery", editable cred_mechanism) — every benchmarked SE states this in one line; we never did |
| (page-level) | footer newsletter = owned audience ✓ | Change Please/E&K close with capture | ✓ via footer |
| (gap) | no dated report artifact | Big Issue dated PDF | ✗ still blocker #7 (needs commissioning) |
| (lede claim) | cred lede "employment after release reduces reoffending significantly" unlabelled | caveat-on-page (NPC) | ⚠ recommend "(MoJ evidence)" tag — James's copy |

## THE MOTION SYSTEM — built, verified, looped (plan executed in full)
- Research: caniuse (view(): Chrome/Edge 115+, Safari/iOS 26, Firefox 155+, ~84%) · Kowalski (<300ms, ease-out, transform/opacity) · MDN recipes (ranges, stagger, compositor list incl. filter) · WCAG 2.2 §2.3.3. All in MOTION.md.
- Built: universal §11 (tokens --mo-*, promoted rd-chip-in/rd-evin, NEW .rd-stagger cascade + wordmark rise + duotone develop, unified hover grammar) · orphaned .rd-in reveal DELETED (was permanently hiding all .rd-reveal content on non-view() browsers) · nav micro-motions tokenised · SEVEN more hidden→clip scroll-container kills fixed (rd-hero, rd-card, rd-door, rd-video, rd-cscard__media, rd-path__media, .bbc-wordmark).
- Feedback loop: qa/motion-check.mjs (35 assertions × 2 contexts incl. reducedMotion:'reduce'; Firefox-blank static guard; jank longtask counter; writes evidence table) + WORKFLOW.md step 4.5. FINAL: 35/35 PASS.
- Loop caught during its own build: fake-failing synthetic probe (theme hides stray body-end divs — probe was display:none since inception), collection reveals dead inside .rd-card containers, duotone dead inside .rd-path__media, wordmark page-end range edge. All fixed, all now asserted.
- Numeric motion proof: chip stagger mid-flight [1,1,1,0] · wall cascade [0.89,0.28,0.49,0] · duotone brightness .73→1.0 · wordmark 1.0 at page end · reduce contexts fully inert+visible.

## IMPACT LAYOUT PASS (plan 2026-07-24b executed)
Measured audit (17.2/22.6 viewports, 2 anchors, h2 0.35-0.47/vp) → 8-site layout tour → STICKY RAIL
REFUTED by own quality gates (0/8) → built the genre-true set instead: on-this-page anchor list
(discovery band, GOV.UK pattern), #proof/#map/#backers ids + scroll-margins, segment "see the
evidence ↓" deep-links (schema+template, schema-propagation race hit + resolved with wait-loop,
4 anchors verified server-side), hashchange filter+scroll handler. Verified: chapter jump 24px exact,
prisons click-through → filtered wall in view, overflow 0 both widths, motion-check 35/35 (final),
shots lay-chapters-1280/390. Open for James: page-length outlier, dated-PDF artifact (blocker #7).

## GENRE ALIGNMENT CUTS (James: "choose what to cut, improve, align")
CUT (all reversible): ① empty 176px dark shell (workshop-story band rendered with cleared title —
gated on story_title now, 3rd gating-bug family member) ② Build to Bond split band (duplicated the
flagship #proof card directly below; hidden via new show_b2b checkbox — ALL its settings preserved;
its Allsopp pull-quote MOVED onto the flagship card, cs_quote/cs_attr) ③ the 3 route CARDS in the
discovery band → one row of secondary TEXT links (restores the original Chris/Unbounce "one main
course" spec; help blocks untouched).
IMPROVED/ALIGNED: report artifact link in the stats band ("Read the 2026 impact report" →
/pages/impact-report, reusing the existing report_label/report_url settings — the genre's #1 device,
web-page version until the PDF exists).
MEASURED: 17.2→15.2 viewports @1280 · 22.6→20.7 @390 · 11→9 bands · 0 empty h2 · chapters+anchors
intact · overflow 0 · motion-check 35/35. Schema clash caught (report_label already existed — reused
not duplicated); 70-char label limit hit + fixed.
