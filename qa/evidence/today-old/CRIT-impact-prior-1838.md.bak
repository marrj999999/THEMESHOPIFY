# CRIT (final gate) — /pages/impact — draft 196820238710 — 2026-07-12 (fresh re-run after the final-pass FAIL)

*Fresh-eyes CRIT, sceptical (did not build the page). Driven in real headless Chrome via the repo's Playwright (in-app pane freezes on this page). `Shopify.theme.id` **196820238710** confirmed on-screen (the "CUSTOMTHEME20262 · Draft" preview bar is visible in every capture). Mobile 375×812 first, cookies declined (mobile run auto-declined; the desktop pass banner re-appeared low on one long capture — noted, no finding depends on it). Desktop 1280px second. Every number below is a measured `getComputedStyle`/`getBoundingClientRect` value or a WCAG ratio computed from sampled fg/bg — none estimated.*

**Evidence:** `qa/evidence/today/` — `m-band-00-hero…m-band-10-final-cta.png` + `d-band-00…d-band-10` (22 band shots, element-captured full-height), `metrics-m.json`, `metrics-d.json`. Scripts: `crit.mjs`, `shots.mjs`, `bands.mjs`.

**Page metrics:** mobile total **15,235px (~18.8 screens)** · desktop **10,468px** · horizontal overflow at 375px: **none** (0 overflowers, docW==winW==375) · AAA sweep: 25 lowest pairs sampled, **min 7.20:1** (Sally Allsopp cite 14px), all others ≥7.37 — **PASS**.

---

## Claimed fixes since the last CRIT — verified one by one

| Prior blocker | Verdict now | Evidence |
|---|---|---|
| Mobile hero h1 = 28px (James rejected twice) | ✅ **FIXED** — h1 renders **46.9px** mobile / 84.5px desktop, weight 800, lowercase, left. Largest display moment on mobile. | `metrics-m` h1; `m-band-00-hero.png` |
| Stats count-up animating (41→82→90) | ✅ **FIXED** — 4 timed DOM samples over 1.45s all identical ("90%+ / Level 2 / 4,000+ / 45 / ~£18bn / up to 9pts"). No animation. | `metrics-m.statSamples` |
| "both arms" stale vocab | ✅ **FIXED** — h2 now "both pathways sit on live national priorities." | band-03 text |
| "~40%" vs "39%" contradiction | ✅ **FIXED** — both band 3 and band 5 now cite **39%** (MoJ family-contact data). | band-03/05 text |
| NLCF + OCN backer logos 0×0 invisible | ✅ **FIXED** — render at 170×44 (desktop) / consistent 44px height. | `metrics` logos; `d-band-09` |
| FT logo duplicated (press + backers) | ✅ **FIXED** — FT now only in press wall; backers = NLCF/OCN/HMPPS/chips. backed-by vs featured-in now grouped. | band-09 shots |
| ops partnership card proper-noun crush | ⚠️ **HALF** — the in-card line "…with HM Prison & Probation Service" now keeps HM caps ✓, but a **second** partnership caption below the band still crushes to "**hm prison & probation service**" (see D3). | `m-band-06` |
| where-we-operate verb-honest 4-group + "full picture →" (A5) | ✅ **LANDED** — 4 count-badged groups, verb-honest ("we run / we deliver with / our partners run / kits built worldwide"), "the full picture →" link present, NZ correctly framed as a kit destination, no Camden/Project-Zero confusion, HMPPS caps in-card. | `m-band-06` |
| "what's next" forward band, no £ (A2) | ✅ **LANDED** — 3 numbered lime-node ambitions, no £ amounts. Clean band. | `m-band-07` |
| 3 verifiable promises → proof-links (A4) + report download card (A3) | ✅ **LANDED** — steel callout, 3 ✱ promises each "see for yourself →"; "The 2026 impact report" download-asset card with badge. | `m-band-09` |

**Real, material progress** — five items James personally rejected are genuinely closed, and claims/sourcing/AAA/safeguarding are clean. But the gate is mechanical and binary, and blocking rows still fail.

---

## Per-band FORMULA scorecard

Rows: **T**ype roles · **S**ymbols · **L**ogo system · **A**natomy/one-axis · **Z**ero-knowledge header · **C**olour grammar · **AAA** (measured).

| # | Band | T | S | L | A | Z | C | AAA | Verdict |
|---|---|---|---|---|---|---|---|---|---|
| 0 | Hero (dark) | ✅ h1 46.9/84.5 largest (desktop h2 86.4 marginally > h1 84.5 — nit) | ✅ | n/a | ⚠️ 2 CTAs; secondary is a **ghost/outline** button (2nd button style) | ✅ | ✅ lime-on-dark fill ✓ | 9.12 | **PASS** |
| 1 | Stats (dark) | ✅ nums big | ✅ | n/a | ❌ **no eyebrow, no h2, no lede** — 4 raw stats hit a stranger cold | ❌ | ✅ | 8.5+ | **FAIL** (band anatomy + zero-knowledge; source line "BBC programme records" also printed twice) |
| 2 | What we do / pathways fork (paper) | ✅ h3 33.6 per scale | ✅ ✱ + numbered nodes + **lowercase** word-chips | n/a | ✅ fork geometry excellent; eyebrow centered vs h2 left (nit) | ✅ | ✅ paper/forest/lime | 8.5+ | **PASS** (best band on the page) |
| 3 | Why now / policy (dark) | ✅ | ✅ | n/a | ⚠️ eyebrow centered vs h2 left | ✅ | ✅ | 8.5+ | **PASS** — all 4 stats sourced (MoJ ×3, ONS); 39% consistent; "up to 9pts" now reads with "reduction in reoffending" |
| 4 | Inside the workshop (paper) | ✅ | ✅ | n/a | ⚠️ no workshop image on an imagery-licensed band | ✅ | ✅ | 8.5+ | **PASS** (nit) |
| 5 | The follow-on / Build to Bond (dark split) | ✅ "Makers" casing | ✅ | n/a | ✅ image + split | ✅ 39% cited | ✅ | 8.5+ | **PASS** (father-only framing = James's call) |
| 6 | Where we operate (paper, centred) | ⚠️ group h3 **18px** (off-scale) | ✅ count-badge nodes | ❌ HMPPS crown **60px** floats atop band, ungrouped, **and duplicated** in band 9 | ⚠️ eyebrow/h2/lede/footer centred vs left group cards | ✅ verified, verb-honest, safe | ✅ | 8.3+ | **CONDITIONAL** — content is right & safe, but D3 crush + D2 logo dup + h3 off-scale |
| 7 | What's next (paper) | ✅ | ✅ numbered lime nodes | n/a | ✅ | ✅ | ✅ | 8.3+ | **PASS** (clean new band, no £) |
| 8 | Get involved / three ways (steel) | ⚠️ card h3 **21px** (`.rd-fs-21px`, off-scale) | ❌ tags **BUY/PARTNER/SUPPORT render UPPERCASE** | n/a | ⚠️ eyebrow centred vs h2 left; **SUPPORT card has the lone lime edge-shadow** (others dark) | ✅ | ✅ forest-on-light fill ✓ | 8.0+ | **CONDITIONAL** |
| 9 | Recognised by (paper) | ⚠️ mixed | ✅ ✱ promises | ❌ backers row **mixes real logos (Community Fund, OCN, HMPPS) with text chips (Investec, LSBU, Inside Time)**; HMPPS ×2; FT optically tiny (35px vs Telegraph 180px); **"AS FEATURED IN" + "INVESTEC…GREEN HEROES · OCN ACCREDITED" caps lines** | ❌ **2,485px — biggest band on page; the G1 cut target GREW** | ✅ | ✅ | 7.20+ | **FAIL** (worst band — the one a funder scrolls before the ask) |
| 10 | Final CTA / Join in (dark, centred) | ✅ | ✅ | n/a | ⚠️ eyebrow centred; 2 CTAs (ghost "Back the mission"); primary "Run it in your prison →" addresses 1 of 3 audiences | ⚠️ adjective headline vs big-type=claims | ✅ | 8.5+ | **PASS** (nits, James's call) |

**Cross-cutting:** one h1 ✓ · one h2 size ✓ (43.2/86.4) · **THREE h3 sizes ❌ (33.6 pathways / 18 ops / 21 steel-cards)** · eyebrows uniform 14px but **weight 700 not 800**, and alignment splits centre (5 bands) vs left (4 bands) · buttons: fill colour correct per surface (forest-on-light, lime-on-dark) ✓ **but ghost/outline is a 2nd style on hero + final CTA + report link ❌** · **chips inconsistent: lowercase word-chips (pathways) vs UPPERCASE tags (get-involved) ❌** · **logos: press row 44px ✓ / backers 44px ✓ but HMPPS crown 60px = 3rd height, HMPPS twice, backers row mixes logos+text-chips ❌** · banned claims 0 ✓ · "learners"/"prisoners" 0 ✓ · 45 countries (no "36+") ✓ · no horizontal overflow ✓ · count-up disabled ✓ · safeguarding: no participant↔prison linkage ✓.

---

## Ranked defects (selector + fix)

1. **G1 page-length REGRESSION — mobile 15,235px (~18.8 screens), +538px vs the last CRIT's 14,697; target ≤11k.** The stated definition-of-done for this pass. The single named cut target — **band 9 `section.rd-pad-sm.bbc-impact-cred` = 2,485px (was 2,419/2,237)** — *grew* instead. Band 9 is carrying: stat line + 3-promise steel callout + report card + Investec quote card + 4-logo press wall + "…40+ publications" link + awards caps line + supported-by sentence + 6-cell backers row. **Fix:** split or thin band 9 — drop the awards caps line (D5) and the redundant "Build to Bond is supported by…" sentence (the logos already say it), collapse the Investec pull-quote to 2–3 lines, and set the promises/press/backers into one tighter grid. Adding band 7 (what's next) without compensating cuts is what pushed the total up; the plan required folding new beats in *without* growth.

2. **Logo system still not unified (James directive #4).** (a) `logo-hmpps.png` renders **twice**: 60×60 floating at the top of band 6 (`.bbc-rd-impact .rd-ops` region) **and** 170×44 in the band-9 backers row — two heights, two locations, against FORMULA §3 "each logo ONCE per page, ONE height per row." (b) The band-9 backers row mixes **real logos** (Community Fund, OCN London, HMPPS crown) with **text chips** (Investec Beyond Business, LSBU Innovation Hub, Inside Time) — not one system. **Fix:** remove the 60px ops-band crown (the in-card text "with HM Prison & Probation Service" already carries it), keep HMPPS once in backers at 44px; and either source the Investec/LSBU/Inside-Time logo files or render ALL backers as uniform text chips — don't half-and-half. (Investec + LSBU logo files are the long-standing open ask.)

3. **Proper-noun crush, band 6 footer caption.** Selector: `.bbc-rd-impact .rd-frame-label` — `assets/bbc-statement.css:604` `text-transform:lowercase !important` crushes the properly-cased source ("In partnership with HM Prison & Probation Service", section line 778) to "**hm prison & probation service**". This is the exact STEM/Makers/HMPPS crush class James keeps hitting. It also **duplicates** the same phrase already inside the prison-programmes card above it. **Fix:** drop `.rd-frame-label` from the lowercase rule (author its casing at source — it already is), or delete the footer caption entirely as a redundant repeat of the in-card line.

4. **Stats band (band 1) has no header — zero-knowledge + band-anatomy FAIL.** Four raw numbers ("90%+ / Level 2 / 4,000+ / 45") are the *first* content a stranger meets, with no eyebrow/h2/lede. FORMULA §4 mandates eyebrow → h2 (explains) → lede → content on *every* band. **Fix:** add an eyebrow + explaining h2 (e.g. eyebrow "the numbers", h2 "what fourteen years adds up to.") and drop the duplicate "BBC programme records" (printed under 90%+ *and* in the footer line).

5. **Uppercase label/chip grammar (3 spots).** (a) `.bbc-rd .rd-partnerlabel` — `assets/bbc-redesign-2026.css:157` `text-transform:uppercase` renders "As featured in" → "AS FEATURED IN" and the awards line → "INVESTEC BEYOND BUSINESS WINNER · KEVIN MCCLOUD'S GREEN HEROES · OCN ACCREDITED" (12.5px, also below the 13px min). (b) get-involved `.rd-tag` chips render BUY/PARTNER/SUPPORT uppercase while the pathways `.rd-fork` word-chips are lowercase. **Fix:** set `.rd-partnerlabel` and `.rd-tag` to `text-transform:lowercase`, bump to 13–15px/800; the prior CRIT already asked the awards caps line be deleted or merged — do that.

6. **Three h3 sizes — Type-role violation (James directive #1: ONE ruleset, no per-band variation).** Pathways h3 `33.6px` (2.1rem, correct) vs ops-group `h3.rd-ops__title` **18px** (`bbc-statement.css:609 !important`) vs steel-card `h3.rd-fs-21px` **21px** (section line 325). **Fix:** if ops-group and card titles are a genuinely different role, demote them out of `<h3>` to a defined label token and document that token in FORMULA §1; otherwise unify to the card/pathway h3 size. One size per role is the whole point of the pass.

7. **Ghost/outline button = a second button style.** FORMULA §1: ONE style — forest fill on light / lime fill on dark. The transparent-bg "Back the mission" (hero + final CTA) and "Read the 2026 impact report →" (stats band) are outline buttons (bg `rgba(0,0,0,0)`, 999px, bone text). **Fix:** either make them the primary fill for their surface, or demote to a plain inline arrow-link — don't keep a 3rd pill variant.

8. **One-left-axis (desktop).** Band containers sit at x=40 (most), **x=230** (`.rd-mw-820px`: bands 6 & 7, centred) and **x=300** (`.rd-mw-680px`: band 10, centred) — three axes vs FORMULA §4 "one left axis." Plus eyebrow alignment splits centre/left across bands. **Fix:** commit centred bands to the same left grid, or accept centring as a documented exception and at least align the eyebrows consistently.

9. **Polish.** SUPPORT card (band 8) lone lime edge-shadow → match the other cards' dark stamp (`.rd-stamp.rd-lime` on the 3rd `help` block); FT optical size in press wall (35px wide vs 180px Telegraph) → allow the wide FT wordmark or a taller stacked mark; eyebrow weight 700 → 800 to hit the spec chip weight; band 4 could take the workshop image its licence allows.

---

## Verdict: **NOT READY FOR JAMES — one more fix pass.**

This is the strongest the page has been: the mobile hero (James's twice-rejected item) is fixed, the count-up is gone, the pathways fork and the new "what's next" band are genuinely good, the operations band is verified/verb-honest/safe, and claims, sourcing, AAA and safeguarding are all clean. Credit where due — five prior blockers are closed.

But the gate is binary and three FORMULA rows still fail hard, and every one is an item James has named before:
- **Length went the wrong way** — the pass whose stated goal was ≤11k shipped **15,235px**, and the exact band it was meant to trim (recognised-by, 2,485px) grew. That alone fails the pass's definition-of-done.
- **The logo system is still not one system** (HMPPS twice at two heights; backers row half real-logos / half text-chips) — directive #4, unmet.
- **"hm prison & probation service"** still crushes in the band-6 footer — the recurring proper-noun-crush class — and the stats band still greets a stranger with headerless numbers.

Fix defects 1–6 (all have concrete selectors above), re-screenshot bands 1, 6, 8 and 9 mobile-first, re-measure page height, then hand to James.
