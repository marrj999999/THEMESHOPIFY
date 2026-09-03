# CRIT (fresh-eyes gate) — /pages/impact — draft `196820238710` — 2026-07-13 pass

*Superseding all prior CRIT-impact-today.md content (last written 2026-07-12 21:13, against commit `25262f3`). Six commits have landed since then, most recently `9387a47` "The James pass: band reorder... CSS consolidated" (2026-07-13 08:28) and the QA-LOG shows a completed James G5 ("content better BUT boring" — J1/J2/J3 directives) and a dropped frame-infographic experiment. The page structure, band order and CSS have all changed materially since the last CRIT — I re-ran the gate from scratch, did not trust any carried-over finding, and re-verified everything myself against the live draft.*

**Method:** repo Playwright (headless Chromium via `node_modules/playwright`), mobile 375×812 first, cookie banner declined, then 1280×900 desktop. Computed-style/contrast dump via `qa/evidence/today/crit-gate.mjs` (band names updated to match the new order). **Screenshot methodology note (read before trusting any "blank image" finding on this page):** this page is now ~17,200px tall on mobile. Two fast capture methods produced **false-positive flat-colour renders**: (1) Playwright `elementHandle.screenshot()` on any band taller than ~1500px, and (2) `page.screenshot({fullPage:true})` on the whole page — both intermittently render `.rd-duotone` (mix-blend-mode) photography as a solid flat gradient with zero photo content. I proved this is a capture artifact, not a live bug, by re-shooting the exact same DOM region with a plain in-viewport `page.screenshot()` at the real scroll position — the photo (the "make engineers" schools-group image) rendered correctly, cleanly, every time. **All screenshots in this report were produced with the safe method**: real 812×375 (or 900×1280) viewport captures at every scroll increment, stitched into one composite in Pillow, then cropped at heading boundaries — never an oversized `elementHandle.screenshot()` or `fullPage:true` call. Evidence: `qa/evidence/today/band-00-hero{-m,-d}.png` … `band-10-final-cta{-m,-d}.png` (22 files, mobile+desktop pairs) plus `gate-metrics-m.json` / `gate-metrics-d.json` (full computed-style/contrast/overflow dumps). Stale screenshots from earlier failed capture attempts this pass were deleted, not left in the folder to confuse the next reader.

**Live band order (top to bottom, confirmed against `templates/page.impact.json` settings, not schema defaults):** hero → stats (dark) → one craft, two arms (fork/duotone paths) → inside the workshop (statement) → Build to Bond feature (split, dark) → the evidence — real projects, linked (3-card grid) → where we operate (index-list + choropleth map) → recognised by (quotes + logo walls) → why now (policy stat-row, dark) → what's next (rail) → get involved (3-card grid) → final CTA (dark, centred). The case-study-card band and the 3-card "pathway" band are both content-gated off (`cs_quote` / `path_title` blank in the live template) — correctly absent, not missing.

**Page metrics (fresh):** `Shopify.theme.id` **196820238710** confirmed both viewports · mobile docH **17,226–17,378px** (~21+ screens, varies slightly run-to-run with lazy-load settle) · desktop docH **12,711–12,776px** · banned-claim scan clean (`28,000 / stronger than steel / 56.7 / 11.41 / 280 per / 100% completion / 36+` all absent, both viewports) · `learners` 0, `prisoners` 0, `45 countries` present and consistent · AAA sweep (30 lowest-contrast pairs, mobile) floor is **7.20:1** (Sally Allsopp citation, 14px) — clears the WCAG AAA 7:1 floor everywhere sampled.

---

## James's last three directives (QA-LOG 2026-07-13, "content better BUT boring") — re-verified live, not read off the commit message

| # | Directive | Verified state |
|---|---|---|
| J1 | Animate all stats (move-in + count-up) | **CONFIRMED WORKING.** My first test sampled *after* full page settle and wrongly looked static — the count-up (`assets/bbc-stat-countup.js`) fires on `IntersectionObserver` and completes in ~1.1–1.3s, so a post-settle sample only ever sees the final value. Re-tested by sampling every 150ms from page load: "90%+" ramped 0→31→57→73→82→87→89→90 over 8 frames; re-tested "4,000+"/"45" by scrolling to row 2: 0→1,519→2,680→3,313→3,706→3,883→3,971→4,000 and 0→17→30→37→42→44→45 respectively. Real, working, per-element on scroll-into-view. |
| J2 | World map infographic, 45 countries | **CONFIRMED.** Real choropleth (`bbc-world-map.svg`), UK + 44 shipped-to countries shaded dark green on mist, caption reads "the 45 countries our kits have shipped to since 2012 — straight from our customer records." See `band-05-where-we-work-{m,d}.png`. |
| J3 | Pathways band rethink (more visually stimulating) | **CONFIRMED.** Per-pathway duotone photography (schools group photo / bamboo-cane close-up) + numbered station-timeline steps in distinct lime/steel rails, converging on a lime "both pathways end in the same place ✱ a way forward" strip. Materially different from the flat twin-card layout James rejected. See `band-01-one-craft-two-arms-{m,d}.png`. |

All three are done. Good news to lead with — this is not a page that regressed since the last James review.

---

## Per-band FORMULA scorecard

| # | Band | Type roles | Symbols | Axis (measured) | Zero-knowledge | Colour/AAA | Verdict |
|---|---|---|---|---|---|---|---|
| 0 | Hero | h1 lowercase, 800wt, left ✓; **48px mobile (in-range) / 96px desktop (see defect 1 — exceeds documented cap)** | ✓ | x=18(m)/72(d) | ✓ | ✓ | **CONDITIONAL** (defect 1) |
| 1 | The record (stats, dark) | ✓ eyebrow, h2 n/a (eyebrow-led band, by design) | ✓ count-up confirmed (J1) | x=18/72 | ✓ | ✓ | **PASS** |
| 2 | One craft, two arms | h2 43.2/86.4 ✓, h3 pathway-names 33.6px ✓ | ✓ duotone photos, numbered station rails, ✱ converge strip (J3) | x=18(m)/72(d) | ✓ | ✓ | **PASS** |
| 3 | Inside the workshop (statement) | ✓ h2 43.2/86.4, body 17px+ | ✓ | x=18(m) / **x=32(d) — off the x=72 axis** | ✓ | ✓ | **FAIL (axis, desktop)** — defect 2 |
| 4 | Build to Bond feature (split, dark) | ✓ h2 x=32(m)/712(d) | ✓ | deliberate 2-col split, not a `.rd-wrap` bug (same pattern as pathways band) | ✓ | ✓ | **PASS** (design pattern) |
| 5 | The evidence — real projects, linked (card grid) | ✓ h2 43.2/86.4 | ✓ tag chips (EDUCATION/COMMUNITY/GLOBAL), safeguarding-safe imagery | x=18(m)/72(d) | ✓ | ✓ | **PASS**, with a rendering-robustness note — defect 3 |
| 6 | Where we operate (index-list + map) | ✓ h2 43.2/86.4, ops h3 21px | ✓ choropleth (J2), count badges, "the full picture →" progressive disclosure | x=18(m) / **x=32(d)** | ✓ matches `qa/OPERATIONS-MAP.md` verified list | ✓ | **FAIL (axis, desktop)** — defect 2 |
| 7 | Recognised by (quotes + logos) | ✓ | ✓ press logos (4), backer logos/chips, seal badge | x=18(m)/72(d) | ✓ | ✓ | **CONDITIONAL** — defect 4 (seal overflow, mobile) |
| 8 | Why now (policy, dark) | ✓ h2 43.2/86.4 | ✓ 4 sourced stats incl. count-up | x=18(m)/72(d) | ✓ | ✓ | **PASS** |
| 9 | What's next (rail) | ✓ | ✓ 3-step flow, no £ amounts | x=18(m) / x=370(d, rail layout — not a bug, see below) | ✓ | ✓ | **PASS** |
| 10 | Get involved (3-card grid) | ✓ card-title h3 21px, all lowercase in source (compliant) | ✓ | x=18(m)/72(d) | ✓ | ✓ | **PASS** — 3 filled/primary buttons is the James-sanctioned equal-doors exception (QA-LOG 2026-07-13), not re-flagged |
| — | Final CTA (dark, centred) | ✓ | ✓ | x=18(m, on-axis) / x=332(d) — `rd-center` hand-authored in the Liquid source (`sections/bbc-impact-2026.liquid:496`), same accepted closing-statement pattern as the last CRIT | ✓ | ✓ | **PASS** (accepted exception) |

**Cross-cutting:** one h2 size everywhere (43.2px/86.4px) ✓ · one h1 role, correct hierarchy ✓ · button system one 15px pill, radius 999px, 2px border, no underlined-link CTAs — 10 sampled buttons all match ✓ · card-title h3s all render lowercase (authored lowercase at source; no CSS `text-transform` relied on) — I want to flag this as a **process fragility, not a defect**: FORMULA compliance here depends on every future content editor typing lowercase by hand rather than CSS enforcing it. Worth a follow-up: add `text-transform:lowercase` to the card-title h3 rule so a capitalised block title can't ship a violation later. Not scored as a defect since nothing is visually wrong today. · zero banned claims, zero "learners"/"prisoners", "45 countries" consistent, both viewports ✓ · AAA floor 7.20:1 ✓.

---

## Ranked defects (selector + fix)

### 1. Hero h1 desktop font-size doesn't match the FORMULA.md-documented clamp — ships 9.6px over the stated cap

FORMULA.md §1 states: `Hero h1 | clamp(2.9rem,12.5vw,5.4rem) mobile-first` — max 5.4rem = **86.4px**. Measured live: desktop h1 = **96px** (`gate-metrics-d.json` → `h1[0].px`). Root cause: three competing `h1` font-size rules exist for this page —
- `assets/bbc-redesign-2026.css:85` — base `.rd-hero h1{ font-size:clamp(42px,6.6vw,86px); }`
- `assets/bbc-statement.css:598` (mobile-scoped) — `.bbc-rd-impact h1{ font-size:clamp(2.9rem,12.5vw,4.4rem) !important; }` = clamp(46.4px, 12.5vw, 70.4px) — this one roughly matches the FORMULA's *shape* but not its *max* (4.4rem vs the documented 5.4rem)
- `assets/bbc-statement.css:661` (desktop) — `.bbc-rd-impact h1{ font-size:clamp(3rem,7.5vw,6rem) !important; }` = clamp(48px, 7.5vw, 96px), with the comment `/* hero must out-scale band h2 on desktop too */` — this is the rule that wins at 1280px (7.5vw = 96px = the cap, so it's pinned at 96px).

That comment reads like a deliberate, reasoned fix (hero needs to visibly out-rank the 86.4px band h2, and 86.4px hero vs 86.4px h2 would tie) rather than an accident — which means **FORMULA.md is the stale artifact here, not the CSS**. Recommend: update FORMULA.md's Hero h1 row to document the real two-breakpoint formula (mobile clamp(2.9rem,12.5vw,4.4rem), desktop clamp(3rem,7.5vw,6rem)) so the next CRIT scores against what's actually intended, rather than silently reverting a considered fix. Flagging as CONDITIONAL rather than a hard FAIL because the doc/code mismatch, not the on-screen result, is the actual problem.

### 2. Desktop one-left-axis still broken on 2 bands — same defect class flagged in the 2026-07-12 21:00 CRIT, differently broken after the CSS-consolidation commit

**Bands 3 ("inside the workshop") and 6 ("where we operate")** — both use `<div class="rd-wrap rd-mw-820px">`. Measured desktop x=32 vs the page's x=72 axis (used by every other band). Live-verified root cause (not inferred from static CSS reading — checked actual computed styles):
```
wrapMarginLeft: "0px", wrapMaxWidth: "820px", wrapPaddingLeft: "32px", wrapRect.x: 0 → h2 x = 32
```
vs a standard band's wrap:
```
wrapPaddingLeft: "32px", wrapMaxWidth: "1200px" (auto-centred in a 1280px viewport → 40px inset) → h2 x = 72
```
The 7-12 21:00 CRIT found this same `.rd-mw-820px` container **over-centred** (measured x=262, from a stray `margin:0 auto` re-centring an 820px box in the full 1280px viewport) and proposed a fix. The `9387a47` "CSS consolidated" commit clearly touched this — the over-centring is gone — but it was overcorrected to `margin-left:0` (flush against the section's left edge) instead of matching the *other* bands' own 40px auto-centred inset. No `.bbc-rd-impact .rd-wrap.rd-mw-820px` rule exists anywhere in `assets/bbc-statement.css` today (grepped directly) to give it that matching inset. **Fix:** add `.bbc-rd-impact .rd-wrap.rd-mw-820px{ margin-left:max(0px, calc(50% - 600px)); margin-right:auto; }` (600px = half of the standard wrap's 1200px max-width) so it re-aligns with the standard container's own left edge at any viewport width instead of pinning to 0. Note this bug is viewport-width-dependent — it only shows above ~1200px wide, where the standard wrap starts to gain a centring inset; on laptop screens ≤1200px both wrap types coincide at x=32/72≈same padding-only value, which is presumably why it read as fixed if only checked at a narrower width.

### 3. Intermittent blank/flat-colour rendering of lazy content during fast or discrete scrolling — two precisely-located CSS mechanisms, real but capture-method-sensitive

Reproduced independently via two different capture pipelines (Playwright `fullPage:true` stitch, and a from-scratch real-viewport chunk stitch) at the same content — the first "the evidence" card image (`IMAGE_2_LOAFLY_...png`, the LOAFLY cargo-bike photo) rendered as a flat forest-green box in both, even though a direct DOM check (`img.complete === true`, `naturalWidth: 1340`, network response `200`) proves the image itself loads and decodes fine. A similar flat band appeared crossing the "we build real workshops inside prisons." and "from four UK prisons to 45 countries." headings at a different capture pass. Two contributing mechanisms found in source, both real:
- `assets/bbc-mobile-fixes.css:464-467`: `img[loading="lazy"], iframe[loading="lazy"]{ content-visibility:auto !important; contain-intrinsic-size:300px !important; }` — this sits directly below (but **outside**) a `@media (prefers-reduced-data: reduce)` block in the same "10. PERFORMANCE — Slower connections" section (lines 452-460), and is **unscoped** — it applies to every lazy image on every connection, not just save-data users. That reads like a scoping mistake (the rule was very likely meant to live inside the media query above it). `content-visibility:auto` skips paint until an element nears the viewport, which is exactly the kind of thing that can leave a visible gap if a screenshot (or a fast real-scroll) catches it mid-transition.
- `assets/bbc-redesign-2026.css:237`: `.rd-reveal{ opacity:0; transform:translateY(14px); transition:opacity .6s ease, transform .6s ease; }` with a JS-driven `.rd-in` class added on `IntersectionObserver` — a 600ms fade window that, on a fast flick-scroll on a real phone (not just my discrete jump-scroll test), could plausibly show the same kind of momentary blank.

I can't independently confirm real-device flick-scroll severity from this tool, so I'm not scoring this a hard FAIL — but the root cause is concrete and cheap to fix (move the `content-visibility` rule back inside its intended media-query guard), so it's worth doing regardless of how often a real user would notice it. Evidence: `qa/evidence/today/band-04-the-evidence-stories-m.png` (flat box visible over the first card) and `band-02-inside-workshop-d.png` / `band-05-where-we-work-d.png` (dark bands crossing heading text).

### 4. `.rd-seal` rotated badge clips 4px past the mobile viewport edge (recognised-by band, mobile only)

`gate-metrics-m.json` → `overflowers: [{cls:'rd-seal', right:379, t:'OCN accredited · CIC · sin'}]` at a 375px viewport — the rotated "OCN accredited · CIC · since 2012" seal's bounding box extends 4px past the right edge. Low severity (a rotated-badge bounding-box overshoot, not text getting cut visually in the screenshots I reviewed), but real and measured — worth a `max-width`/`right` clamp on `.rd-seal` at narrow viewports. (Note: the desktop `overflowers` hit, `.rd-ghost` "2012" at right=1306 on a 1280px viewport, is a large decorative background numeral bleeding off-canvas by design — matches FORMULA §8's required "≥1 containment break per page" and is not flagged as a defect.)

### 5. Page length still growing past James's accepted baseline — not a blocker, flagging the trend only

Mobile docH is now **17,226–17,378px**, versus the ~15,179px baseline James explicitly "accepted, he can cut later" on 2026-07-13 (QA-LOG). Not re-opening this as a blocking defect — his ruling stands — but the direction of travel is still growth, not the trim that ruling anticipated, driven by the newer "the evidence" card band and the "who backs this work" promises/report-card content. Flagging only so a future length-trim pass has an accurate, current number to work from.

---

## Verdict: **NOT READY FOR JAMES — punch list is short, precise, and mostly desktop-only.**

The substance James actually asked for at the last G5 (animate the stats, add the map, make the pathways band visually stronger) is genuinely done and verified working, not just claimed — that's the headline. What's blocking a clean pass is narrower than the last CRIT: one documentation/implementation mismatch on the hero h1 size (fixable by updating FORMULA.md, not the code), one still-unresolved desktop axis bug on 2 of 11 bands (root-caused precisely, one CSS rule needed), one root-caused rendering-robustness issue worth hardening even though its real-device severity is unconfirmed, and two minor/cosmetic items (seal overflow, page-length trend note). No banned claims, no contrast failures, no "learners"/"prisoners" language, and the previously-flagged over-centring bug is provably improved (from 262px off-axis to 40px off-axis) even though not yet fully closed. Fix defect 2 (one CSS rule, two bands), get a call on defect 1 (doc vs code), and this page should clear CRIT.
