# CRIT (step-5 gate) — /pages/impact — draft 196820238710 — 2026-07-12 (fresh independent re-run)

*Sceptical fresh-eyes CRIT (did not build this page). Driven in real headless Chrome via the repo's Playwright (`chromium-1223`), not the in-app pane. `window.Shopify.theme.id` = **196820238710** confirmed programmatically AND the "CUSTOMTHEME20262 · Draft" preview bar is visible in every capture. Cookies auto-declined (`cookieClicked=true`) on both viewports. Mobile **375×812** first, then desktop **1280×800**. Every px is a measured `getComputedStyle`/`getBoundingClientRect`; every ratio a WCAG contrast computed from sampled fg/effective-bg. Nothing estimated.*

**Evidence:** `qa/evidence/today/` — mobile `band-00-hero.png … band-10-final-cta.png`, desktop `band-00-hero-d.png … band-10-final-cta-d.png`, `gate-metrics-m.json`, `gate-metrics-d.json`. Script: `crit-gate.mjs` (independent of the prior run's `crit.mjs`). Prior CRIT preserved at `qa/evidence/today/CRIT-impact-prior-1838.md.bak`.

**Page-level measured facts**
| Metric | Mobile 375 | Desktop 1280 |
|---|---|---|
| Total height | **14,962px (~18.4 screens)** | 10,245px |
| Horizontal overflow | **none** (docW 375 = winW, 0 overflowers) | none (docW 1280, 0) |
| Count-up animation | **none** — 5 timed samples over 1.9s byte-identical | n/a |
| Banned claims (28k PSI / stronger-than-steel / 56.7 / 11.41 / £280 / 100% / "36+") | **0** | 0 |
| "learners" / "prisoners" in body | **0 / 0** (Makers voice holds) | 0 / 0 |
| "45 countries" (not 36+) | ✓ | ✓ |
| Lowest AAA pairs | ✱ 6.96 (17px/800), Sally cite 7.20 (14px), then ≥7.37 | same |

---

## Verified since the prior CRIT (genuine closes)
| Prior blocker | Now | Evidence |
|---|---|---|
| HMPPS crown logo duplicated (60px float in ops band + 170×44 in backers) | ✅ **RESOLVED** — no backer logo images render at all; HMPPS is now a single text chip. `imgs` = workshop, b2b, + 4 press SVGs only. | `gate-metrics-m` imgs; `band-06`, `band-09` |
| Backers row mixed real logos + text chips | ✅ **RESOLVED** — backers now a uniform text-chip set (NLCF · Investec · LSBU · OCN London · HMPPS · Inside Time); press wall (FT/Guardian/Telegraph/CNN) is the only logo group, all 44px tall. Consistent *within* each group. | `band-09`, imgs 44px |
| Band-6 footer caption crushed to "hm prison & probation service" | ✅ **FIXED** — renders proper-cased "In partnership with HM Prison & Probation Service" (measured P/800/tt:none). | `band-06`; contrast row |
| Count-up animating; "~40%"/39%; "both arms" vocab | ✅ all hold — static stats, 39% consistent, "both pathways". | statSamples; band-03/05 |

---

## Per-band FORMULA scorecard
Rows: **T**ype-roles · **S**ymbols · **L**ogo · **A**natomy/one-axis · **Z**ero-knowledge header · **C**olour-grammar · **AAA**(measured).

| # | Band (surface) | T | S | L | A | Z | C | AAA | Verdict |
|---|---|---|---|---|---|---|---|---|---|
| 0 | Hero (dark) | ⚠️ mob h1 46.9 ✓ largest; **desktop h1 84.5 < h2 86.4 → hero beaten** | ✅ | n/a | ❌ **2 CTAs, 2nd is ghost/outline** | ✅ | ✅ lime-on-dark | 9.12 | **FAIL** (D5 ghost btn; D7 desktop h1<h2) |
| 1 | Stats (dark) | ✅ nums big | ✅ | n/a | ❌ **no eyebrow, no h2, no lede** — 4 bare numbers hit a stranger cold | ❌ | ✅ | 8.5+ | **FAIL** (D2) |
| 2 | What we do / fork (paper) | ✅ h3 33.6/46.1 on-scale | ✅ ✱ + numbered nodes + lowercase word-chips | n/a | ⚠️ eyebrow centred vs h2 left | ✅ | ✅ paper/forest/lime | 8.5+ | **PASS** (best band; axis nit) |
| 3 | Why now (dark) | ✅ | ✅ | n/a | ⚠️ eyebrow centred vs h2 left | ✅ | ✅ | 8.5+ | **PASS** — 4 stats sourced, 39% consistent |
| 4 | Inside the workshop (paper) | ✅ | ✅ | n/a | ✅ eyebrow left | ✅ | ✅ | 8.5+ | **PASS** |
| 5 | Follow-on / Build to Bond (dark) | ✅ Makers casing | ✅ | n/a | ✅ image + split | ✅ 39% cited | ✅ | 8.5+ | **PASS** |
| 6 | Where we operate (paper) | ⚠️ **group h3 = 21px (off the 33.6/46.1 h3 scale)** | ✅ count-badge lime nodes | ✅ no stray logo now | ⚠️ eyebrow + footer caption centred; cards left; footer caption **duplicates** in-card "with HM Prison & Probation Service" | ✅ verb-honest, safe, NZ framed as kit destination | ✅ | 8.3+ | **CONDITIONAL** (D1 h3 size; D6 dup caption) |
| 7 | What's next (paper) | ⚠️ node-title h3 21px (off-scale) | ✅ numbered lime nodes | n/a | ✅ | ✅ | ✅ | 8.3+ | **PASS** (no £; but adds page height) |
| 8 | Get involved / 3 ways (steel) | ⚠️ card h3 21px (off-scale) | ❌ **tags BUY/PARTNER/SUPPORT render UPPERCASE/700 — 2nd chip style** | n/a | ⚠️ eyebrow centred vs h2 left; SUPPORT card carries a lone lime edge-shadow | ✅ | ✅ forest-on-light fill | 8.0+ | **FAIL** (D3 chip system) |
| 9 | Recognised by (paper) | ⚠️ mixed (report-card h3 21px) | ✅ ✱ promises | ⚠️ press logos 44px ✓ but **FT optically 35px vs Telegraph 180px**; backers text-only | ❌ **2,271px — biggest band on page (the G1 driver a funder scrolls before the ask); "AS FEATURED IN" caps line; 6 stacked backer chips** | ✅ | ✅ | 7.20+ | **FAIL** (D4 length) |
| 10 | Final CTA / Join in (dark) | ✅ | ✅ | n/a | ⚠️ eyebrow centred; 2 CTAs incl. ghost "Back the mission"; primary "Run it in your prison →" addresses 1 of 3 audiences | ⚠️ adjective headline | ✅ | 8.5+ | **PASS** (nits, James's call) |

**Cross-cutting (measured):**
one h1 mobile ✓ · **one h2 size ✓ (43.2 mob / 86.4 desk)** · **TWO h3 sizes ❌ (33.6/46.1 pathways vs 21 for ops-groups + get-involved cards + report card)** · eyebrows uniform 14px but **weight 700 not the §1-spec 800 ❌**, and **alignment splits centre (5 bands) vs left (4) ❌** · buttons: fill colour correct per surface (forest-on-light rgb(0,60,50) / lime-on-dark rgb(212,253,98)) ✓ **but a ghost/outline style (transparent bg + bone border) is a 2nd button style on hero + report link + final CTA ❌** · **chips: lowercase/800 word-chips (pathways) vs UPPERCASE/700 tags (get-involved) ❌** · press logos uniform 44px height ✓ · banned 0 ✓ · Makers voice ✓ · 45 countries ✓ · no h-overflow ✓ · count-up off ✓ · safeguarding: no participant↔prison linkage ✓.

---

## Ranked defects (selector + fix)

**D1 — Two h3 sizes: type-role "ONE size per role" broken (James directive #1).** Pathway names render **33.6px mob / 46.1px desk** (`.bbc-impact-2026-wrap h3` on the fork cards — on FORMULA §1 scale clamp(2.1rem,3.6vw,2.9rem)), but every other h3 renders **21px**: ops group headers ("schools & universities — we deliver with"), get-involved card titles ("Build or own a bike"), and the report-card title. Two sizes for one role. **Fix:** give the 21px h3s a distinct semantic (they are card/sub-labels, not pathway names) — either demote them to a defined sub-head token OR bring them onto the single h3 scale. Do not leave two live h3 sizes.

**D2 — Stats band (band 1) has no header: zero-knowledge + band-anatomy FAIL.** Four bare numbers ("90%+ / Level 2 / 4,000+ / 45") are the *first* content after the hero, with no eyebrow/h2/lede (confirmed: first eyebrow in the DOM is "what we do", band 2). FORMULA §4 mandates eyebrow → h2 → lede → content on *every* band. **Fix:** add an eyebrow + explaining h2 to `.bbc-impact-2026-wrap` band-1 (e.g. eyebrow "the numbers" / h2 "what fourteen years adds up to."). Also drop the "Data updated July 2026" line stranded at the band foot, or fold it into the source line.

**D3 — Second chip system: get-involved tags render UPPERCASE/700.** Selector: the `buy`/`partner`/`support` pills in band 8 compute `text-transform:uppercase; font-weight:700`, while the pathway chips ("in schools · before exclusion") compute lowercase/800 (FORMULA §1 chip = 13–15px, weight 800, lowercase). Two chip styles on one page (James directive #1: one ruleset for chips). **Fix:** author the get-involved tags to the pathway-chip class — lowercase, weight 800 — so all chips read as one system.

**D4 — G1 page-length still FAILS: mobile 14,962px (~18.4 screens) vs ≤11k target.** The stated definition-of-done. It fell only ~273px from the prior CRIT's 15,235 and remains ~4,000px over target. Main driver unchanged: **band 9 `recognised-by` = 2,271px** (3-promise steel callout + report card + long Investec pull-quote + 4 press logos + "40+ publications" link + "AS FEATURED IN" caps line + **6 vertically-stacked backer chips**), plus the new "what's next" band (615px) was added without compensating cuts. **Fix:** thin band 9 — set the 6 backer chips into a 2–3-per-row wrap grid (not 1/row), collapse the Investec quote to ≤3 lines, drop the redundant caps "AS FEATURED IN" divider, and pair the promises/press/backers tighter. New beats must fold in without growing the total (the plan's rule).

**D5 — Ghost/outline button is a 2nd button style (James directive #1).** Measured: "Back the mission" (hero, dark) and "Read the 2026 impact report →" and "Back the mission" (final CTA) compute `background:rgba(0,0,0,0); border:2px solid rgb(230,220,200)` — an outline style alongside the solid forest/lime fills. FORMULA §1: "ONE style." **Fix:** make secondary actions the same pill fill (lime-on-dark / forest-on-light) with a weight/opacity difference if hierarchy is needed, or demote them to plain inline links — not a third button skin.

**D6 — Eyebrow spec + one-axis both off.** Eyebrows compute **weight 700** (FORMULA §1 chip/eyebrow = weight 800) and their alignment **splits centre (what-we-do, why-now, where-we-operate, get-involved, join-in) vs left (inside-workshop, follow-on, what's-next, recognised-by)** — FORMULA §4 "one left axis." **Fix:** set every eyebrow to weight 800 and one alignment (left, to match the h2/lede left axis). Also delete the band-6 footer caption "In partnership with HM Prison & Probation Service" — it is a centred duplicate of the line already inside the prisons card.

**D7 — Desktop hero is not the largest type.** At 1280 the hero h1 = **84.5px** but band h2 = **86.4px** — a band head (§1) exceeds the hero display moment ("nothing rivals it"). Marginal (1.9px) but mechanically the hero loses. **Fix:** nudge the hero h1 clamp up (or the h2 clamp down) so h1 > h2 at every breakpoint.

**Nits (non-blocking):** ✱ glyph contrast 6.96:1 at 17px/800 is a hair under AAA 7:1 (decorative; all real copy ≥7.20) · FT press logo optically tiny (35px wide monogram) beside Telegraph 180px though row height is uniform 44px · "see for yourself →" proof links are underlined (acceptable as inline links, not primary CTAs).

---

## VERDICT: **FAIL**

The FORMULA is a binary contract — a band ships only if every row passes. Four bands FAIL (hero, stats, get-involved, recognised-by) and one is CONDITIONAL (where-we-operate). Real progress is banked — the HMPPS logo duplicate, the logo/text mixing, the proper-noun crush, count-up, banned claims, Makers voice, safeguarding and AAA (bar one decorative glyph) are all clean — but the whole-page universal-style pass James demanded is not done: **two h3 sizes, two chip styles, a ghost button style, weight-700 mixed-axis eyebrows, a header-less stats band, and a ~15k-px page length that missed the ≤11k target.** Back to WORKFLOW step 2. Do not hand to James (step 6).
