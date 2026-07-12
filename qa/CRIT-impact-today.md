# CRIT (final gate) — /pages/impact — draft 196820238710 — 2026-07-12, fresh CRIT run

*Fresh-eyes CRIT before James. I did not build this page. Reviewed in real headless Chrome via the repo's Playwright (`qa/evidence/today/crit-gate.mjs`) — the in-app pane freezes on this long page. Mobile 375×812 FIRST, cookie banner declined, then a 1280px desktop pass. `Shopify.theme.id` **196820238710** confirmed on every run (mobile + desktop). Every number below is a measured computed value, a timed DOM sample, or a WCAG-formula contrast ratio — none estimated.*

**Evidence:** `qa/evidence/today/` — `band-00-hero`…`band-10-final-cta` (mobile) + matching `-d` desktop shots, plus `gate-metrics-m.json` / `gate-metrics-d.json` (type sizes, axes, contrast sweep, stat samples, banned-claim scan).

**Page metrics (fresh):**
- Mobile total **14,831px (~18 screens)** · desktop **10,284px**.
- Horizontal overflow at 375px: **none** (`docW==winW==375`, `overflowers: []`). Desktop: none.
- Banned-claim scan: **clean** (`28,000 / stronger than steel / 56.7 / 11.41 / 280 per / 100% completion / 36+` all absent). `learners` 0, `prisoners` 0, `45 countries` used.
- Count-up: **stable** — `.rd-num` samples identical at 0/300/700/1100/1600 ms (`90%+ · Level 2 · 4,000+ · 45 · ~£18bn · up to 9pts · 39% · 1m+`). The animation is gone.
- AAA sweep (30 lowest pairs): lowest is the **✱ glyph at 6.96:1**, then Sally cite 7.20, then everything ≥7.37. All body/heading text passes AAA; only the ✱ is marginally under 7.0.

---

## Claimed fixes since the last CRIT — verified one by one (being fair before being sceptical)

| Prior blocker | Verdict now | Evidence |
|---|---|---|
| Mobile hero h1 = 28px (smaller than every h2) | ✅ **FIXED** — h1 **48px** mobile / **96px** desktop, weight 800, clearly dominant over the 43.2/86.4px h2s | band-00, `gate-metrics-m.h1` |
| Stats count-up animates on a funder page | ✅ **FIXED** — 5 timed samples identical; no re-animation | statSamples |
| "both arms" stale vocab | ✅ **FIXED** — h2 reads "both pathways sit on live national priorities." | band-03, h2[1] |
| ~40% vs 39% self-contradiction | ✅ **FIXED** — both the policy band and Build-to-Bond now say **39% (MoJ family-contact data)** | band-03 / band-05 |
| Proper-noun crush "hm prison & probation" | ✅ **FIXED** — renders "In partnership with **HM Prison & Probation Service**" (caps preserved) | band-06, contrast row |
| Backers band: NLCF/OCN 0×0 invisible, chip overlap/clip, FT ×2 | ✅ **FIXED** — funders now lime **text chips**; press logos (FT/Guardian/Telegraph/CNN) render at a **consistent 44px height**; no FT duplicate as a backer | band-09, imgs[] |
| Steel chips UPPERCASE (BUY/PARTNER/SUPPORT) | ✅ **FIXED** — render lowercase `buy / partner / support` | band-08, chips[] |
| Stats band had no header (zero-knowledge fail) | ✅ **IMPROVED** — now carries an eyebrow "the record since 2012" + sourced sublabels | band-01 |
| A2 forward "what's next" band / A5 4-group ops band | ✅ **LANDED** — 3 numbered lime-node ambitions (no £); ops band = 4 count-badged groups + "the full picture →", verb-honest, matches OPERATIONS-MAP | band-06/07 |

The genuinely hard content is right: the fork-and-converge pathways band, the verb-honest operations groups, all four policy stats sourced (MoJ / MoJ / MoJ / ONS), the funder-mechanism steel promises, and the impact-report download card are all in place and safe (no participant↔prison linkage; empty-workshop photo).

---

## Per-band FORMULA scorecard

Rows: **T**ype roles · **S**ymbols · **L**ogo · **A**natomy/one-left-**axis** · **Z**ero-knowledge header · **C**olour grammar · **AAA** (measured) · verdict.

| # | Band | T | S | L | Axis | Z | C | AAA | Verdict |
|---|---|---|---|---|---|---|---|---|---|
| 0 | Hero | ✅ h1 48/96px dominant | ✅ | n/a | ✅ left, 2-CTA pair is system | ✅ | ✅ | 9.12 | **PASS** |
| 1 | Record / stats (dark) | ✅ | ✅ | n/a | ✅ eyebrow+stats left | ⚠️ eyebrow-only, no h2 | ✅ | 8.5+ | **PASS (nit)** |
| 2 | What we do — pathways fork (paper) | ✅ h2 43.2 / h3 33.6 / body 17 | ✅ ✱ + numbered nodes + word-chips | n/a | ❌ **eyebrow centered, h2 left** | ✅ | ✅ | 8.4–9.1 | **FAIL (axis)** |
| 3 | Why now — policy (dark) | ✅ | ✅ | n/a | ❌ **eyebrow centered (x595), h2+stats left (x72)** — see band-03-why-now-d | ✅ 4 stats sourced | ✅ | 8.5+ | **FAIL (axis)** |
| 4 | Inside the workshop (paper) | ⚠️ body 19px (17 elsewhere) | ✅ | n/a | ⚠️ desktop content x=262 off page grid | ✅ | ✅ | 8.37+ | **CONDITIONAL** |
| 5 | The follow-on (split, dark) | ⚠️ body 19px | ✅ | n/a | ✅ image-left split geometry OK | ✅ 39% cited, Sally attributed (staff, safe) | ✅ | 7.2–8.5 | **PASS (nit)** |
| 6 | Where we operate (paper) | ✅ h3 21px group titles | ✅ count-badge nodes | ✅ no stray logos | ❌ **eyebrow centered; partnership line centered vs left h2** | ✅ verb-honest, verified list | ✅ | 8.31+ | **FAIL (axis)** |
| 7 | What's next (paper) | ✅ | ✅ 3 lime nodes | n/a | ✅ eyebrow+h2 left, no £ | ✅ | ✅ | 8.5+ | **PASS** |
| 8 | Get involved — three ways (steel) | ✅ chips lowercase now | ⚠️ | n/a | ❌ **eyebrow centered; 3 forest-fill CTAs = 3 primaries** | ✅ | ✅ | 7.97+ | **FAIL (axis + one-primary-max)** |
| 9 | Recognised by (paper) | ✅ press logos ONE height (44px) | ✅ | ⚠️ funder chips unlabeled + mixed semantics (funder/accreditor/authority/press) | ✅ eyebrow+h2 left | ✅ steel promises + report card | ✅ | 10.8 | **CONDITIONAL** |
| 10 | Final CTA (dark) | ✅ | ✅ | n/a | ❌ **eyebrow centered, h2 left**; primary "Run it in your prison" = 1 of 3 audiences | ✅ | ✅ | 8.5+ | **FAIL (axis)** |

**Cross-cutting PASS:** one h2 size everywhere (43.2 / 86.4px) ✓ · button system one 15px pill (lime-fill / forest-fill / 2px-outline, radius 999px) ✓ · zero banned claims ✓ · "learners"/"prisoners" 0 ✓ · 45 countries consistent ✓ · symbols clean (✱ ×3, numbered nodes, word-chips) ✓ · press logos one height ✓ · safeguarding ✓.

**Cross-cutting FAIL:** **the one-left-axis rule (FORMULA §4) is violated on 5 of 10 bands.** Mobile eyebrow x-positions split cleanly in two: LEFT (x≈18) on record / inside-workshop / what's-next / recognised-by, but CENTERED (x=101–150) on what-we-do / why-now / where-we-operate / get-involved / join-in — and in every centered case the h2 below it is hard-left, so the eyebrow floats off its own heading's axis. Desktop compounds it: h2 left-edges land at **x=72, 262, 313, 332** (four axes) instead of one. This is exactly the "inconsistent, per-band variation" James rejected at the last G5.

---

## Remaining defects, ranked (selector + fix)

1. **One-left-axis broken (FORMULA §4) — the dominant, page-wide defect.** Eyebrow centered above a left h2 on bands 2/3/6/8/10; desktop content columns indented to x=262/313/332 on bands 4/6/8/10 vs the page axis x=72. *Fix:* force every `.rd-eyebrow` (and its header wrapper) to `text-align:left`, and pin the band content wrappers (`.rd-wrap` / the get-involved, three-ways, ops and final-cta inner containers) to ONE shared `max-width` + left grid column — delete the per-band `text-align:center` / `margin:0 auto` on header blocks. Re-screenshot bands 2/3/6/8/10 mobile + desktop after. *(Verify in `band-03-why-now-d.png` — the split is unmistakable.)*
2. **✱ mission glyph fails AAA (6.96:1 on paper).** Measured below the 7:1 AAA floor (17px, not "large text"). *Fix:* repoint the ✱ colour on paper surfaces to `--forest` (#003C32, ratio >7:1) or the teal-ink token, or render it ≥18px/700 so it qualifies as large text. Every other text pair passes.
3. **Page length 14,831px mobile (~18 screens)** vs the pass's own **G1 target ≤11,000px**. Biggest single cuts: Recognised-by band (2,055px) and the stacked policy-stat band. *Fix:* tighten vertical `--rd-pad` on paper bands and 2-up the policy stats / backer chips on mobile. (Not a FORMULA row, but a named G1 gate item that is still 35% over.)
4. **Get-involved: three forest-fill CTAs in one band** (`Shop & book →` · `For prisons →` · `Back the mission →`) violate "max one primary per band." *Fix:* either accept as an equal-weight card-grid choice (James's call) or demote two cards' buttons to the 2px-outline secondary and keep one lime/forest primary.
5. **Recognised-by funder chips: unlabeled + mixed semantics (FORMULA §3 grouping).** The lime chip group `The National Lottery Community Fund · LSBU Innovation Hub · OCN London accredited · HMPPS · Inside Time` sits *below* the "featured in" press logos with no heading of its own and blends funder + accreditor + authority + a press title (Inside Time). *Fix:* add a "backed by / accredited by" label above the chip group, and move **Inside Time** up beside the press logos where it belongs.
6. **Off-scale body size + caps micro-labels.** Follow-on / inside-workshop body renders **19px** where the rest of the page body is 17px; stat-source sublabels render UPPERCASE (`BBC PROGRAMME RECORDS`, `MINISTRY OF JUSTICE`, `KITS SHIPPED WORLDWIDE`) against the lowercase system. The caps are consistent across all stat bands (one deliberate "source" convention), so low priority — but normalise body to 17px per the type table.
7. **Conversion nit (James's call).** Final-CTA primary "Run it in your prison" addresses only prison commissioners; the page also serves buyers and funders.

**Capture caveat:** the desktop `band-03-why-now-d` and `band-08-get-involved-d` shots caught the cookie banner **re-rendering** at the bottom (the harness declined it on load; it reappears in the desktop context). It does not obscure the axis findings and the **mobile screenshots are clean and authoritative**. Not a page defect.

---

## Verdict: **NOT READY FOR JAMES — one more fix pass.**

This is a large step forward: every blocker from the last CRIT (28px hero, live count-up, "both arms", 40/39 conflict, proper-noun crush, the broken backers grid) is genuinely fixed, claims and AAA are clean, and the new forward/operations/mechanism beats all landed. But the gate is mechanical and binary, and **FORMULA §4 (one left axis) fails on half the bands** — the exact per-band inconsistency James called out at G5 — plus the ✱ marginally misses AAA and the page is still 35% over the G1 length target. Fix defect **1** (axis — one systemic change closes five band failures), **2** (✱ contrast), and ideally **3** (length), re-screenshot bands 2/3/6/8/10 on both viewports, then hand to James.
