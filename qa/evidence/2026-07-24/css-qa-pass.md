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
