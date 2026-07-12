# CRIT — /pages/impact (fresh-eyes gate, 2026-07-12)

**Gate:** step 5 of qa/WORKFLOW.md. Reviewer did not build the page. Binary verdict.
**Target:** https://bamboobicycleclub.org/pages/impact?preview_theme_id=196820238710
**Theme confirmed:** `196820238710` (CUSTOMTHEME20262, **Draft**) — asserted via `window.Shopify.theme.id` on both passes, and the "CUSTOMTHEME20262 · Draft" bar is visible in captures. ✓
**Method:** repo Playwright (chromium-1223, headless) → mobile 375×812 (deviceScaleFactor 2, isMobile) FIRST, cookies declined (`cookieClicked=true`), then desktop 1280. Every band scrolled to trigger lazy-load, screenshotted to `qa/evidence/today/band-NN-name(.-d).png`. Computed px + WCAG contrast ratios measured in-page (never estimated). Raw: `gate-metrics-m.json`, `gate-metrics-d.json`.

---

## Global checks (measured)

| Check | Mobile 375 | Desktop 1280 | Verdict |
|---|---|---|---|
| Theme = draft 196820238710 | ✓ | ✓ | PASS |
| Horizontal overflow | docW 375 = winW, overflowers **0** | docW 1280 = winW, 0 | PASS |
| Banned claims (28k PSI / stronger-than-steel / 56.7 / 11.41 / £280 / 100% / 36+) | **none** | none | PASS |
| Voice: "learners" / "prisoners" in body | both **false** | false | PASS |
| "45 countries" (updated Proof Bank) | present | present | PASS |
| Count-up settles to final values | stable across 5 samples | — | PASS |
| Page length @375 (QA-LOG G1 target ≤11,000px) | **14,843px** | 10,284px | **FAIL (mobile 35% over target)** |
| Lowest contrast on page | **1.24:1** | 1.24:1 | **FAIL (see D1)** |

Everything below the 1.24 outlier passes AAA: next-lowest is the ✱ glyph at 6.96 (17px/800 = large text, AAA-large 4.5 ✓), cite 7.20, and all body/heads ≥7.37. Contrast is excellent **except the one eyebrow**.

---

## Per-band scorecard

Rows scored against FORMULA.md §1–5. A band passes only if every applicable row passes.

| # | Band | Type roles | One-left-axis | Chip/symbol system | Contrast | Zero-knowledge header | Verdict |
|---|---|---|---|---|---|---|---|
| 00 | hero | h1 48/96px, lowercase ✓ | ✓ all left | tagline eyebrow ✓ | 9.12 ✓ | ✓ mission lede verbatim | **PASS** |
| 01 | stats | nums lime ✓, 21px labels | ✓ | — | **eyebrow 1.24 ✗** | ✓ | **FAIL** (D1) |
| 02 | what-we-do (pathways) | display h3 33.6px ✓, nodes ✓ | **eyebrow centered ✗** | pathway chips lc/800 ✓ (internally exemplary) | ✓ | ✓ | **FAIL** (D3 axis only) |
| 03 | why-now | ✓ | **eyebrow centered ✗** | baseline stat pairs ✓ | ✓ | ✓ | **FAIL** (D3) |
| 04 | inside-workshop | ✓ | ✓ | — | ✓ | ✓ Cat-B prison named | **PASS** |
| 05 | follow-on | ✓ | ✓ (left x32) | — | ✓ | ✓ | **PASS** |
| 06 | where-we-operate | card-titles lc ✓, 21px | **eyebrow centered ✗** | count badges 4/10/3/45 ✓ | ✓ | ✓ franchise framing correct | **FAIL** (D3) |
| 07 | what's-next | ✓ nodes 1-3, no £ ✓ | ✓ | ✓ | ✓ | ✓ | **PASS** |
| 08 | get-involved | **card-titles Title-case ✗** | **eyebrow centered ✗** | **UPPERCASE lime chips ✗**; shadow colour inconsistent | ✓ | ✓ | **FAIL** (D2,D3,D4) |
| 09 | recognised-by | ✓ | ✓ | **funder chips = 3rd style; Investec named 2× ✗** | press logos 44px consistent ✓ | ✓ | **FAIL** (D2,D5) |
| 10 | final-cta (join in) | ✓ | **eyebrow centered ✗** | — | ✓ | ✓ | **FAIL** (D3) |

**6 of 10 bands fail at least one row.**

---

## Ranked defects (selector + fix)

### D1 — CRITICAL · Stats eyebrow is invisible (1.24:1)
"the record since 2012" renders **dark forest text on the forest stats surface** — measured 1.24:1, below even the 3:1 non-text floor. Its lime leader-dash renders; the words do not (verified in `band-01-stats.png`). The eyebrow colour token is not surface-aware — it uses the light-surface dark-green everywhere.
**Selector:** `.bbc-impact-2026-wrap` stats band `[class*="eyebrow"]` (span, 14px/700).
**Fix:** on forest/dark surfaces set eyebrow colour to `--bbc-lime` (#D4FD62) or bone (#E6DCC8) — mirror the surface-inversion the stat sublabels already use. Blocking: an unreadable labelled element ships nothing.

### D2 — HIGH · Chip system still not unified (James G5 #1, open since 2026-07-12)
Four distinct chip treatments live on one page:
1. pathway chips — 13px/800, **lowercase**, lime fill (`in schools · before exclusion`)
2. get-involved chips — 14px/700, **UPPERCASE**, lime fill (`BUY` / `PARTNER` / `SUPPORT`)
3. funder chips — 14px/700, **Title/sentence case**, lime **outline** (`Investec Beyond Business`, `LSBU Innovation Hub`…)
4. download tag — forest fill (`report`)
FORMULA §1/§2 mandates ONE chip style; colour differentiates surface, never style. This is the exact headline James rejected the last three passes on.
**Selector:** get-involved `.rd-card [class*="chip"]`, recognised-by `[class*="chip"]`/funder pills, pathways chips.
**Fix:** pick one spec — 13–15px, weight **800**, lowercase, one shape (fill on light, outline reserved only if a second semantic is truly needed) — and apply page-wide. Kill the `text-transform:uppercase` on get-involved chips and the title-case on funder chips.

### D3 — HIGH · One-left-axis broken on 5 of 10 bands
Eyebrows are centered while their h2 + lede are left-aligned on **what-we-do, why-now, where-we-operate, get-involved, join-in** (measured `text-align:center`, x 101–150, vs h2 x 18). FORMULA §4 "One left axis." This is the recurring G3 defect (QA-LOG line 16) never fully closed — it was fixed on get-involved's h2/lede but the eyebrow above them was left centered.
**Selector:** the section/eyebrow modifier applying `text-align:center` on those five bands (likely a `.rd-center` / band-level alignment class).
**Fix:** force eyebrow (and any centered sub-head) to `text-align:left` on these bands so the whole band shares one left axis. Do it once as a wrap-level rule, not band-by-band.

### D4 — MEDIUM · Card-title h3 casing contradicts itself across bands
FORMULA row 10: card-title h3 = 21px **lowercase**. where-we-operate + follow-on obey it (`prison programmes — we run`); **get-involved uses Title case** (`Build or own a bike`, `Run it in your prison`, `Fund or champion`). Same role, two cases, on one page.
**Selector:** get-involved `.rd-card h3` (21px/800, tt:none).
**Fix:** lowercase the three card titles at source (copy+style together per FORMULA §7 lesson), or set the h3 rule `text-transform:lowercase` for this role globally.

### D5 — MEDIUM · Duplicate name breaks the once-per-page logo/name rule
"Investec Beyond Business" is printed **twice** in recognised-by — once as the quote-card attribution ("Investec Beyond Business — backing BBC since 2025") and again as a funder chip below. FORMULA §3 "each logo … ONCE per page."
**Selector:** recognised-by quote `cite` + funder chip list.
**Fix:** drop one instance — keep the quote attribution, remove the redundant Investec funder chip (or vice-versa). (OCN also recurs across stats / steel-callout / chip, but as accreditation prose not a logo — lower priority, tidy if trimming.)

### D6 — MEDIUM · Mobile page still 35% over the length target
14,843px @375 vs QA-LOG G1 target ≤11,000px (was 15,179 — only −2% this pass). The recognised-by band (~2,067px) and the pathways band (~1,918px) are the largest cuts available.
**Fix:** per QA-LOG A5/G1 plan — the length work is not done; recognised-by still stacks steel callout + report card + quote card + press grid + funder chips at full height.

### Minor (non-blocking, log for the fix pass)
- **M1** Eyebrow weight is 700 across the page; FORMULA §1 chip/eyebrow = weight **800**. Bump for consistency.
- **M2** Steel callout uses `see for yourself →` as an **underlined inline link ×3** acting as a CTA — FORMULA §1 "never underlined links as CTAs." Borderline (inline body links), but the repetition reads as three buttons.
- **M3** get-involved 3rd card ("SUPPORT") has a **lime** hard drop-shadow while cards 1–2 have dark shadows — inconsistent within one row.
- **M4** get-involved band carries **3 primary fill CTAs** (FORMULA §1 "max one primary per band"). Defensible 3-card pattern, but flags against the literal rule.
- **M5** `bbc-rd-b2b.jpg` computes 544px wide inside the 375 viewport (clipped, no overflow) — confirm the full-bleed crop is intentional.
- **Hierarchy note (not a defect):** hero h1 exceeds spec (48/96px vs the 5.4rem cap) which *helps* — but the FORMULA itself caps h1 and h2 both at 5.4rem, so band heads (86.4px desktop) sit only ~11% below the hero. The hero still reads as the display moment because it wraps to 3 full lines; flagging the formula's own weak h1/h2 separation for James, not dinging the build.

---

## What's genuinely good (be fair)
- Hero is now a real display moment — 3 big lowercase lines over a darkened workshop photo, lime tagline, mission lede **verbatim** to the locked wording, clean fill/outline button pair. James's "hero not large on my phone" complaint reads as largely addressed at 375.
- Voice + claims are clean: 0 banned claims, 0 "learners/prisoners", "45 countries", "90%+", OCN levels correctly split (L1 schools / L2 prisons), franchise hubs correctly "our partners run", NZ used as kit-reach not a hub — all consistent with OPERATIONS-MAP.
- The **pathways band is reference-quality** — fork node, differentiated lime/steel pathway identities carrying words not colour alone, numbered nodes, converge strip, STEM preserved uppercase. It is the proof the one-system look is achievable; the rest of the page just hasn't been leveled up to it.
- Buttons ARE consistent: 15px, 999px pill, 2px, forest-fill-on-light / lime-fill-on-dark / bone-outline — the most disciplined system on the page.
- Press logos share one height (44px desktop / 38px mobile), grouped "featured in" separate from "backed by" per §3.
- No horizontal overflow, no missing/broken images, count-ups settle.

---

## VERDICT: **FAIL**

Per FORMULA line 2 ("a band ships only if every row passes") and James's directive that this page IS the formula for every other page: **6 of 10 bands fail a row.** The two blockers are D1 (a labelled eyebrow at 1.24:1 is literally unreadable) and D2 (the chip system is still not unified — the specific thing rejected the last three passes). D3 (half the bands break the one-left-axis rule) compounds the "too many styles" verdict. The page is materially better than prior passes and close, but it is not at the standard. Return to WORKFLOW step 2 for a whole-page pass closing D1–D6 together (copy+style per band), then re-CRIT before James.

*Evidence: `qa/evidence/today/band-00…10-*.png` (mobile) + `-d.png` (desktop), `gate-metrics-m.json`, `gate-metrics-d.json`.*
