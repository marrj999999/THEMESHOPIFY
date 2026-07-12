# CRIT (fresh-eyes gate) — /pages/impact — draft `196820238710` — 2026-07-12, 21:00 pass

*I did not build this page. I am superseding the CRIT written earlier today at ~20:20 (`qa/evidence/today/CRIT-impact-prior-2100.md.bak`) — that report's own evidence screenshots were captured 20:04–20:05, and commit `25262f3` ("James round: LSBU shield logo wired, 3 evidence case-study cards restored, get-involved retitled") landed at 20:56:31, **after** that evidence was gathered. Its defect list (cookie banner won't dismiss, proper-noun crush, one-left-axis broken on 5 bands both viewports) is stale. I re-ran the gate from scratch against the live draft at 21:00–21:13, re-verified every carried-over claim myself rather than trusting either report, and root-caused every real finding in the actual CSS/Liquid source — nothing below is an estimate.*

**Method:** Playwright + headless Chrome (`qa/evidence/today/crit-gate.mjs`, re-run fresh), mobile 375×812 first, cookie banner declined, full slow-scroll (300–400px steps, 150–220ms waits + a final 1.5–2s settle) to defeat `loading="lazy"` before any screenshot or measurement — the previous two CRITs on this page both had to explain away 0×0-image false positives from under-waited scroll sims; I used a slower pass throughout and additionally wrote three standalone verification scripts (image-load check, cookie-banner click check, case-study-card decode check) to confirm or kill every carried-over claim before reporting it. Then 1280×900 desktop.

**Evidence:** `qa/evidence/today/` — `band-00-hero(.png/-d.png)` … `band-11-extra(.png/-d.png)` (mobile+desktop pairs, **note:** the script's `names[]` label array predates the new case-study band inserted at position 7, so filenames from `band-07` onward are shifted one off from their actual content — `band-07-whats-next.png` is actually "the evidence" band, `band-08-get-involved.png` is actually "what's next", `band-09-recognised-by.png` is actually "get involved", `band-10-final-cta.png` is actually "recognised by", `band-11-extra.png` is actually "final CTA" — cosmetic filename bug only, content and my analysis below use the *real* band identity, verified by reading each screenshot) · `gate-metrics-m.json` / `gate-metrics-d.json` (full computed-style/contrast/image dumps) · `verify-backers-desktop.png`, `verify-cscard-0/1/2.png` (dedicated slow-load re-shoots used to kill two false positives, see below).

**Page metrics (fresh, 21:00):**
- `Shopify.theme.id` **196820238710** confirmed both viewports.
- Mobile total **17,346px** (~21 screens) · desktop **12,066px**. Mobile is **+1,954px since the 20:04 measurement (15,392px)** — entirely the new "the evidence — real projects, linked" case-study band (3 stacked full-bleed-photo cards on mobile). James ruled page length "accepted, he can cut later" at a ~15,179px baseline (QA-LOG 2026-07-13) — not re-opened as a blocking defect here, but flagged because the trend is now growing again, not shrinking, off the back of new content, and this specific band is the obvious lever if a future pass wants to cut (defect 4 below).
- Horizontal overflow at 375px: **none** (`overflowers: []`). Desktop: **none**.
- Banned-claim scan: **clean** (`28,000 / stronger than steel / 56.7 / 11.41 / 280 per / 100% completion / 36+` all absent). `learners` 0, `prisoners` 0, `45 countries` present and consistent.
- AAA sweep (30 lowest pairs, both viewports): floor is **7.20:1** (Sally Allsopp citation, 14px) — everything on the page clears the 7:1 AAA floor.

---

## Carried-over claims from the 20:20 report — re-verified, not trusted

| Claim (from the superseded report) | My re-verification | Verdict |
|---|---|---|
| "Cookie consent banner does not dismiss — own Decline/Accept buttons produce no change" | Wrote a standalone script: fresh load → banner `display:block`, top=279px, h=533px → forced click on `button.shopify-pc__banner__btn-decline` → banner `display:none` immediately, **and stays dismissed after a full page reload** (checked explicitly). The only thing that failed in the prior report was a plain `page.click()`, which the Shopify draft-preview toolbar (`#PBarNextFrameWrapper`) intercepts — a preview-only overlay, not present for real customers, and not a fault in the banner's own handler. | ❌ **Does not reproduce — not a defect.** The banner works. |
| "Proper-noun crush: 'in partnership with hm prison & probation service' renders lowercase" | Queried the live paragraph directly: `getComputedStyle(el).textTransform` = **`"none"`** on both matching `<p>` elements ("HMP Lowdham Grange · … with HM Prison & Probation Service" and "In partnership with HM Prison & Probation Service"). Renders exactly as authored, caps intact. | ❌ **Does not reproduce — fixed since 20:04, or never true post-commit.** |
| "Case-study images 0×0 / natW:0 (world map, press logos, 3 new case-study photos)" | Same false-positive class as the last two CRITs' press-logo finding — this gate script's own rushed scroll-sim (70ms/step) under-waits `loading="lazy"` decode. Re-tested every one of these with generous waits + explicit `img.decode()`: all report `complete:true` with correct non-zero natural dimensions, 0 failed network responses (`page.on('response')` swept for non-2xx image/svg loads — none). Also re-screenshot the 2 case-study cards that looked blank in the rushed capture (`verify-cscard-1.png`, `verify-cscard-2.png`) — both render their real photos cleanly (group photo w/ blueprints for "COMMUNITY", Kirui riding, NTV Kenya-credited, for "GLOBAL"). | ❌ **Does not reproduce — render-timing artifact, not a defect.** |
| "One-left-axis broken on 5 bands (2/3/6/8/10), both viewports" | **Partially true, materially improved, and now precisely root-caused (two separate causes, not one).** See below — mobile is now clean except one deliberately-split band; desktop still fails on 2 bands (not 5). | ⚠️ **Real but smaller — see defect 1.** |
| "'Both arms'/'~40%' vs '39%' stale copy conflict, 'up to 9pp' jargon" | Body-text sweep: only one reoffending-rate figure exists now (**39%, MoJ family-contact data**), "both arms" is gone (now "the same hands-on engineering course in both settings"). The "up to 9pts" stat (a *different*, correctly MoJ-Education-Evidence-sourced figure) still uses the unexplained abbreviation "9pts". | ✅ **Copy conflict fixed.** "9pts" abbreviation is a minor separate nit (defect 5). |
| Backers grid: NLCF/OCN 0×0, Investec/LSBU overlap or clip, FT/HMPPS duplicated | Re-checked with slow-load: 5 backer logos (Investec/NLCF/LSBU/OCN/HMPPS) each render at a correct aspect-preserved width, uniform 44px height, no overlap, no clipping at 375px, no duplication against the 4 press logos (FT/Guardian/Telegraph/CNN — disjoint set). | ❌ **Does not reproduce — clean.** |

---

## Per-band FORMULA scorecard

| # | Band | Type roles | Symbols | Axis (measured) | Zero-knowledge | Colour/AAA | Verdict |
|---|---|---|---|---|---|---|---|
| 0 | Hero | h1 **48px** mobile (clamp target ≈46.4–86.4px — in range), 800 weight, lowercase, left ✓ | ✓ | ✓ x=18(m)/72(d) | ✓ | ✓ 9.12 | **PASS** |
| 1 | The record (stats, dark) | ✓ eyebrow present | ✓ | ✓ x=18/72 | ✓ eyebrow header | ✓ 8.3+ | **PASS** |
| 2 | What we do — pathways fork (paper) | ✓ h2 43.2/86.4, h3 33.6 | ✓ ✱ fork node, numbered steps, duotone photos | ✓ x=18(m)/72(d) | ✓ | ✓ 8.3+ | **PASS** |
| 3 | Why now — policy (dark) | ✓ | ✓ 3 sourced stats (MoJ/MoJ-Education/MoJ-family) | ✓ x=18/72 | ⚠️ "up to 9pts" — sourced but abbreviation unexplained to a stranger | ✓ 8.5+ | **CONDITIONAL** (defect 5) |
| 4 | Inside the workshop (story, paper) | ✓ body 17px+ | ✓ | ❌ **x=18(m) / x=262(d)** — off the x=72 page axis on desktop only | ✓ | ✓ 8.4+ | **FAIL (axis, desktop)** |
| 5 | Build to Bond / the follow-on (split, dark) | ✓ | ✓ 39% MoJ-cited, Sally Allsopp attributed (staff, safe) | ⚠️ x=32(m)/712(d) — deliberate 2-column `.rd-split` media+text layout, not a `.rd-wrap` container bug; same pattern as the pathways-fork band | ✓ | ✓ 7.2+ | **PASS** (design pattern, not a defect) |
| 6 | Where we operate — map + 4 groups (paper) | ✓ h3 21px group titles | ✓ world map, count-badge nodes, verified list | ✓ x=18(m)/72(d) — **eyebrow now on-axis too (was the one lingering fail at the last CRIT)** | ✓ verb-honest, matches OPERATIONS-MAP, "the full picture →" progressive-disclosure link present | ✓ 8.3+ | **PASS** |
| 7 | The evidence — real projects, linked (case studies, paper) | ✓ h2 43.2/86.4 | ✓ tag chips (EDUCATION/COMMUNITY/GLOBAL), safeguarding-safe imagery (adults w/ full consent per Proof Bank; Kirui/NTV Kenya correctly attributed, not BBC-owned) | ✓ x=18(m)/72(d) | ✓ | ✓ (part of main sweep) | **PASS** |
| 8 | What's next (paper) | ✓ | ✓ 3 lime numbered nodes, **no £ amounts** (A2 spec met) | ✓ x=18(m)/72(d) | ✓ | ✓ 8.5+ | **PASS** |
| 9 | Get involved — three ways (steel) | ✓ chips lowercase | ✓ | ❌ **x=18(m) / x=313(d)** — whole header block (`.rd-center.rd-cmp-84401`) shifted right on desktop | ✓ | ✓ 8.0+ | **FAIL (axis, desktop)** |
| 10 | Recognised by (paper) | ✓ | ✓ "backed by & accredited by" label, press+backers logos, no duplication | ✓ x=18(m)/72(d) | ✓ | ✓ 7.25–10.8 | **CONDITIONAL** (defect 2 — logo height split, mobile only) |
| 11 | Final CTA — join in (dark, centred) | ✓ | ✓ | ⚠️ x=18(m, on-axis) / x=332(d, centred) — section is *authored* `rd-center` in the Liquid source itself (`sections/bbc-impact-2026.liquid:428`), i.e. deliberately a closing centred band, not an accidental cascade bug like #4/#9 | ✓ | ✓ 8.5+ | **JUDGEMENT CALL** (defect 3 — flagged, not scored as a hard fail) |

**Cross-cutting PASS:** one h2 size everywhere (43.2/86.4px) ✓ · button system one 15px pill (lime-fill / forest-fill / 2px-outline, radius 999px — 10 sampled buttons all match) ✓ · zero banned claims, zero overflow, both viewports ✓ · "learners"/"prisoners" 0, "45 countries" consistent ✓ · AAA floor 7.20:1 everywhere ✓ · both-arms/40-vs-39% copy conflict resolved ✓ · **mobile one-left-axis is now clean on 10 of 11 bands** (only the deliberately-split follow-on band drifts, by design) — a real, measured improvement since the last CRIT, where 5 bands failed on mobile too.

**Cross-cutting FAIL:** desktop one-left-axis still fails on **2 bands** (4, 9) — smaller than the 5-band failure reported at the last CRIT, and now precisely root-caused to two distinct CSS causes rather than one guessed-at specificity tie (see defect 1). Logo-row height still splits into two sizes on mobile only (defect 2).

---

## Ranked defects (selector + fix)

### 1. Desktop one-left-axis still broken on 2 bands — two distinct, precisely root-caused causes (FORMULA §4)

**Band 4 "Inside the workshop" (story band) — x=262 instead of x=72 on desktop.**
`sections/bbc-impact-2026.liquid:164`: `<section class="rd-pad"><div class="rd-wrap rd-mw-820px">` — this section does **not** even carry the `.rd-center` class, so none of the previous `.rd-center`/`.rd-eyebrow` text-align fixes could ever have touched it. The actual cause is the base rule `.bbc-rd .rd-wrap{ max-width:var(--rd-container); margin:0 auto; padding:0 32px; }` (`assets/bbc-redesign-2026.css:30`) combined with `.bbc-rd .rd-mw-820px{ max-width:820px !important; }` (`assets/bbc-redesign-2026.css:563`): shrinking the wrap's max-width to 820px while keeping `margin:0 auto` re-centres the whole container on a 1280px viewport — `(1280-820)/2 + 32 = 262`, exactly the measured value. **This exact pattern already has a fix precedent for other pages** — `assets/bbc-statement.css:314` (`.bbc-rd.bbc-rd-page .rd-hero .rd-wrap.rd-mw-820px{ margin-left:max(24px, calc(50% - 568px)); margin-right:auto; }`) and lines 317/328 for `.bbc-rd-about`/`.bbc-rd-sharebuild` — **but no equivalent `.bbc-rd-impact` rule exists.** Fix: add `.bbc-rd-impact .rd-wrap.rd-mw-820px{ margin-left:max(32px, calc(50% - 568px)); margin-right:auto; }` to `assets/bbc-statement.css` (32px to match this page's own `.rd-wrap` padding, not the 24px used elsewhere).

**Band 9 "Get involved" (help band) — x=313 instead of x=72 on desktop, whole header block including h2.**
`sections/bbc-impact-2026.liquid:327`: `<div class="rd-center rd-cmp-84401">`. `.bbc-rd-impact .rd-center{ text-align:left !important; }` (`assets/bbc-statement.css:431`) correctly fixes text-align, but `.bbc-rd .rd-cmp-84401{ max-width:56ch !important; margin:0 auto 44px !important; }` (`assets/bbc-redesign-2026.css:566`) independently re-centres the *container itself* via `margin:0 auto`, which text-align cannot override — this is why the h2 (not just the eyebrow) is off-axis on this band specifically, and why three earlier "fixed the axis" commits never touched it: they targeted text-align, not this container's own margin. Fix: add `.bbc-rd-impact .rd-cmp-84401{ margin-left:0 !important; margin-right:auto !important; }` to `assets/bbc-statement.css` (mirrors the existing `.bbc-rd.bbc-rd-home .rd-center[class*="rd-cmp-"]{ margin-left:0 !important; margin-right:auto !important; }` pattern already used for the home page at line 174 — the impact page never got the equivalent rule).

Re-screenshot bands 4 and 9 at 1280px after. Mobile needs no change — both bands already measure x=18 there.

### 2. Logo row height splits into two sizes on mobile only (FORMULA §3: "ONE height per row — 44px desktop/34px mobile")

Desktop is already correct: press row (FT/Guardian/Telegraph/CNN) and backers row (Investec/NLCF/LSBU/OCN/HMPPS) both render at a uniform **44px** height — one height, matches spec.

Mobile splits: press row renders **38px**, backers row renders **44px** (identical to desktop — no mobile reduction at all). Neither number is the FORMULA's specified **34px**. Root cause, two separate rules:
- `assets/bbc-layout.css:58-59`:
  ```css
  .rd-logo-img, .rd-logoimg{ height:44px !important; width:auto !important; max-width:180px !important; max-height:none !important; object-fit:contain !important; }
  @media (max-width:749px){ .rd-logo-img, .rd-logoimg{ height:38px !important; } }
  ```
  This is a site-wide (not impact-scoped) component rule — it overrides the page's own intended `.rd-logoimg{max-height:34px}` base (`assets/bbc-redesign-2026.css:168`) at every viewport, and its own mobile figure (38px) doesn't match the FORMULA either.
- `assets/bbc-statement.css:599`: `.bbc-rd-impact .rd-backers__logo{ height:44px !important; width:auto !important; ... }` has no `@media(max-width:749px)` reduction at all, so it stays 44px on mobile.

Fix: change `assets/bbc-layout.css:59` from `height:38px !important` to `height:34px !important`, and add `@media(max-width:749px){ .bbc-rd-impact .rd-backers__logo{ height:34px !important; } }` to `assets/bbc-statement.css` near line 599, so both rows land on the same 34px figure on mobile. (Confirm this site-wide `bbc-layout.css` change doesn't affect other pages' logo walls before shipping — it's not impact-scoped.)

### 3. Final CTA band is desktop-centred by deliberate authoring, not by accident — needs a design ruling, not a CSS fix

`sections/bbc-impact-2026.liquid:428`: `<section class="rd-pad rd-dark rd-center">` — `rd-center` is hand-authored on this section, unlike bands 4 and 9 where centring is an unintended side-effect. This reads as a deliberate "closing statement" pattern (common for a page's final CTA). It is a literal FORMULA §4 violation ("one left axis") if scored mechanically, but it's a different *kind* of finding than defects 1–2 — flagging for a decision rather than listing as a bug to silently fix. If James wants it on-axis, drop `rd-center` from that section and remove `rd-mx-auto` from its lede; if he's fine with a centred closer (matching precedent: "equal-CTA grids sanctioned" ruling, QA-LOG 2026-07-13), this can be marked an accepted exception in FORMULA.md rather than re-flagged every pass.

### 4. Page length: mobile is 17,346px (~21 screens), +1,954px since the last measurement, driven entirely by the new case-study band

Not re-opening James's "length accepted" ruling as a blocker, but noting the driver plainly: `.rd-cscard` (the 3 education/community/global cards) stack full-width, one per row, each with a ~209px-tall photo plus body copy, on mobile — roughly 1,100–1,300px of the 1,954px growth. If a future trim pass wants to claw this back without cutting content, a 2-up mobile grid (like `.rd-grid.rd-g3` used elsewhere on this same page for the "three ways" cards) would likely halve this band's mobile height.

### 5. "up to 9pts" — sourced but unexplained abbreviation (FORMULA §5 zero-knowledge rule)

Renders correctly, cited to "MOJ EDUCATION EVIDENCE" directly beneath it — not a claims-discipline issue. But "9pts" assumes the reader already knows "percentage points" and its abbreviation; a stranger reads it as "9 points" (of what?). Low severity, one-string fix: "up to 9pts" → "up to 9 percentage points" (or keep "pts" but spell "percentage points" once in the lede above it).

---

## Verdict: **NOT READY FOR JAMES — but the punch list is now short and precise.**

This pass is a genuine, measurable improvement over the 20:20 report, not just a re-description of it: three of that report's four claimed defects (cookie banner, proper-noun crush, backers-grid breakage) do not reproduce and I'm removing them from the list rather than carrying them forward unverified. The copy conflict (both arms / 40% vs 39%) is fixed. Mobile one-left-axis — the single defect James has personally named at his last two G5s — is now clean on 10 of 11 bands, with the sole exception being a deliberately-split media band that was never meant to share the axis.

What's left is small and exactly located: two desktop-only container-margin bugs (not text-align — different mechanism, which is why prior "axis fix" commits missed them), a mobile-only logo-height split against a spec that already states the target number, one design-intent question (final CTA centring) that needs a decision rather than code, and two low-severity nits (page-length trend, "9pts" jargon). None of the four items the last CRIT called blocking (invisible funder logos, clipped chips, stale stat conflict, unresponsive cookie banner) are present in this draft. Fix defects 1–2 (four CSS rules total, all with exact file:line and a drop-in fix), get a ruling on defect 3, and this page should clear CRIT clean.
