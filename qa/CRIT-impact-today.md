# CRIT (fresh-eyes gate) — /pages/impact — draft `196820238710` — 2026-07-12, post J1/J2/J3

*I did not build this page. This supersedes the CRIT written earlier today (18:xx) — J1 (stat animation), J2 (world-map infographic) and J3 (per-pathway duotone imagery) all landed since that report, plus several "one-axis" fix commits (CRIT r3/r4). I re-ran the gate from scratch against the current draft rather than trust the prior verdict. Driven via the repo's headless-Chrome Playwright script (`qa/evidence/today/crit-gate.mjs`), mobile 375×812 first, cookie banner interaction tested explicitly (see defect 2), then 1280px desktop. Every number below is a measured computed value, a timed/scrolled DOM sample, or a WCAG-formula contrast ratio from live evaluate() calls — nothing estimated. Root causes were traced into the actual CSS source, not guessed.*

**Evidence:** `qa/evidence/today/` — `band-00-hero` … `band-10-final-cta` (mobile) + `-d` desktop pairs, `gate-metrics-m.json` / `gate-metrics-d.json` (full type/contrast/image/overflow dumps). Supplementary scripts (count-up scroll test, cookie-banner click test, image-load verification) run ad hoc for this pass — findings below, scripts not archived (throwaway, in `/private/tmp/.../scratchpad/`).

**Page metrics (fresh, 2026-07-12):**
- `Shopify.theme.id` **196820238710** confirmed on every run (mobile + desktop).
- Mobile total **15,392px** (~19 screens) · desktop **11,083px**. Mobile is **~560px taller than the last measurement** (14,831px) — the new world-map figure added length. No blocking rule on length: **James already ruled page length "accepted, he can cut later" (QA-LOG 2026-07-13) — not re-reported as a defect here**, flagged only as context since it drifted further from the closed G1 note.
- Horizontal overflow at 375px: **none** (`overflowers: []`, `docW==winW==375`). Desktop: none.
- Banned-claim scan: **clean** (`28,000 / stronger than steel / 56.7 / 11.41 / 280 per / 100% completion / 36+` all absent, both viewports). `learners` 0, `prisoners` 0, `45 countries` present.
- AAA sweep (30 lowest pairs, both viewports): lowest is now **7.20:1** (Sally Allsopp citation) — everything on the page clears the 7:1 AAA floor. The ✱ mission glyph, previously the one marginal fail at 6.96:1, now measures **8.67:1**.

---

## Claimed fixes since the last CRIT — verified one by one

| Item | Verdict | How verified |
|---|---|---|
| **J1** — stats re-animate on scroll into view | ✅ **CONFIRMED WORKING** | The gate script's own before-scroll samples looked static (a methodology artifact — it grabs values pre-scroll, before the `.rd-num` elements are 25% in view). Re-tested with an actual scroll-into-view: `4,000+` genuinely counts up (`228+ → 1,243+ → 2,038+ → … → 3,978+ → 4,000+` across ~1s) and `45` counts `3 → 14 → 23 → … → 45`. `bbc-counted` class applied only after the animation completes, exactly per `assets/bbc-stat-countup.js`. James's ask is met. |
| **J2** — world map infographic replaces text-only ops band | ✅ **CONFIRMED, clean** | `band-06-where-we-operate(.png/-d.png)`: real-geography choropleth renders, all 4 verified operations groups (prisons/schools/hubs/45-countries) sit below it unchanged, caption reads "the 45 countries our kits have shipped to since 2012 — straight from our customer records. home in dark green," `figure` has no horizontal overflow, `<img>` loads (200, `complete:true`, real `naturalWidth/Height`) at both viewports. The gate script's own metrics dump flagged `bbc-world-map.svg` and the 4 press logos as `natW:0` (looked broken) — **re-verified directly and this is a false positive** in the script's element-selection timing during its scroll-simulation loop, not a real defect: dedicated check shows all 5 assets `complete:true` with correct non-zero natural dimensions and `200` responses. |
| **J3** — per-pathway duotone imagery on "what we do" | ✅ **CONFIRMED, safeguarding-safe** | `band-02-what-we-do(.png/-d.png)`: schools track shows a (evidently stock/model) group-with-a-bike photo, prisons track shows an empty-workshop bamboo-poles photo with no people — matches the DEFINE's stated "safeguarding-safe defaults" intent, no identifiable participant photographed in a prison context. |
| Prior CRIT's "one-left-axis FIXED" claims (CRIT r3 "D3: eyebrows share the left axis," CRIT r4 "one-axis, rd-mx-auto killed") | ❌ **NOT FIXED — still measurably broken, and now root-caused** | See defect 1 below. This is the same defect reported at the last two CRITs, still present after two more rounds of commits claiming to close it. |

---

## Per-band FORMULA scorecard

| # | Band | Type roles | Symbols | Axis (measured) | Zero-knowledge | Colour/AAA | Verdict |
|---|---|---|---|---|---|---|---|
| 0 | Hero | h1 48px mobile / clamp desktop, 800, lowercase ✓ | ✓ | ✓ left, x=18/72 | ✓ | ✓ 9.1+ | **PASS** |
| 1 | Record / stats (dark) | ✓ | ✓ count-up confirmed live | ✓ eyebrow+stats x=18/72 | ✓ eyebrow header | ✓ 8.3+ | **PASS** |
| 2 | What we do — pathways fork (paper) | ✓ h2 43.2/86.4, h3 33.6, chips 13px | ✓ ✱ fork node, numbered steps, duotone photos (J3) | ❌ eyebrow x=130(m)/582(d) vs h2 x=18/72 | ✓ | ✓ 8.3+ | **FAIL (axis)** |
| 3 | Why now — policy (dark) | ✓ | ✓ 4 sourced stats (MoJ/MoJ/MoJ/ONS) | ❌ eyebrow x=143(m)/595(d) vs h2 x=18/72 | ✓ | ✓ 8.5+ | **FAIL (axis)** |
| 4 | Inside the workshop (paper) | ✓ body 17px | ✓ | ✓ eyebrow+h2+lede all x=18/262 | ✓ | ✓ 8.4+ | **PASS** |
| 5 | The follow-on (split, dark) | ✓ | ✓ 39% MoJ-cited, Sally attributed (staff, safe) | ⚠️ eyebrow/lede x=32(m)/712(d), 14px off the x=18 axis used elsewhere on mobile — minor, same axis family as its own h2 | ✓ | ✓ 7.2+ | **PASS (minor drift)** |
| 6 | Where we operate — map + 4 groups (paper) | ✓ h3 21px group titles | ✓ world map (J2), count-badge nodes, verified list | ❌ eyebrow x=101(m)/554(d) vs h2 x=18/72; h2 itself stays on-axis | ✓ verb-honest, matches OPERATIONS-MAP | ✓ 8.3+ | **FAIL (axis, eyebrow only)** |
| 7 | What's next (paper) | ✓ | ✓ 3 lime nodes, no £ | ✓ eyebrow+h2+lede all x=18 | ✓ | ✓ 8.5+ | **PASS** |
| 8 | Get involved — three ways (steel) | ✓ chips lowercase | ✓ | ❌ **whole header block shifted**: eyebrow x=124(m)/576(d) AND h2 x=313(d, not 72) — the `.rd-cmp-84401` wrapper itself is centred (see defect 1) | ✓ | ✓ 8.0+ | **FAIL (axis, whole block)** |
| 9 | Recognised by (paper) | ✓ press logos one height | ✓ "backed by & accredited by" label now present, Inside Time regrouped out of the funder chips | ✓ eyebrow+h2 left, x=18/72 | ✓ | ✓ 7.25–10.8 | **PASS** |
| 10 | Final CTA — join in (dark) | ✓ | ✓ | ❌ eyebrow x=150(m)/603(d) vs h2 x=18/72 | ✓ | ✓ 8.5+ | **FAIL (axis)** |

**Cross-cutting PASS:** one h2 size everywhere (43.2/86.4px) ✓ · button system one 15px pill (lime-fill / forest-fill / 2px-outline, radius 999px, all 9 sampled buttons match) ✓ · zero banned claims, zero overflow, both viewports ✓ · "learners"/"prisoners" 0, "45 countries" consistent ✓ · AAA floor now 7.20 everywhere (up from 6.96 fail) ✓ · J1/J2/J3 all genuinely landed ✓.

**Cross-cutting FAIL, now root-caused:** the one-left-axis rule (FORMULA §4) still fails on **5 of 10 bands** (2/3/6/8/10) — the identical defect reported at the last CRIT, and the one James named explicitly at the last two G5s. Not a mystery this time — see defect 1.

---

## Ranked defects (selector + fix)

### 1. One-left-axis still broken on 5 bands — root cause is a CSS load-order bug, not a missing rule (FORMULA §4)

**What's measured:** on bands 2 ("what we do"), 3 ("why now"), 6 ("where we operate," eyebrow only), 8 ("get involved," whole header block), 10 ("join in"), the `.rd-eyebrow` sits centred (mobile x=101–150 vs the page's x=18 axis; desktop x=554–603 vs x=72). Band 8 is worse — its entire `.rd-center.rd-cmp-84401` header block (eyebrow **and** h2) is centred, landing the h2 at desktop x=313 instead of x=72.

**Why it's still broken despite three "fixed" commits (`db1e694`, `5949333`, plus this pass's own claim):** traced into the actual cascade. `assets/bbc-statement.css` carries the real fixes:
```css
/* bbc-statement.css:431 */ .bbc-rd-impact .rd-center{ text-align:left; }
/* bbc-statement.css:665 */ .bbc-rd-impact .rd-eyebrow{ display:block; text-align:left !important; }
```
Both correct in isolation. But `assets/bbc-redesign-2026.css` still carries the original generic rules at **equal CSS specificity** (two classes each):
```css
/* bbc-redesign-2026.css:37 */ .bbc-rd .rd-eyebrow{ display:inline-block; ... }
/* bbc-redesign-2026.css:77 */ .bbc-rd .rd-center{ text-align:center; }
```
`layout/theme.liquid:451` loads `bbc-statement.css` inside `<head>`. `sections/bbc-header-2026.liquid:14` loads `bbc-redesign-2026.css` from *inside the header section*, which renders in `<body>` via `{% sections 'header-group' %}` at `theme.liquid:465` — **after** `</head>`. So `bbc-redesign-2026.css`'s `<link>` lands later in the DOM. With specificity tied, the *later* stylesheet wins the cascade: `display:inline-block` beats `display:block` (no `!important` on that declaration), and `.rd-center`'s `text-align` resolves to `center` (no `!important` on that declaration either — only the child eyebrow's own `text-align:left` is `!important`, and that only controls the *text inside* the now-inline-block span, not the span's *position* within its centre-aligned parent). Net effect: the eyebrow renders as a centred inline-block pill inside a text-align:center parent, exactly matching every screenshot. This is why repeated fix commits kept landing in `bbc-statement.css` without ever visibly working — they were never losing on specificity, they were losing on load order, which isn't visible from reading the CSS in isolation.

**Fix:** add `!important` to the two losing declarations (`display:block !important` at statement.css:665, `text-align:left !important` at statement.css:431 — or bump specificity, e.g. `.bbc-rd-impact.rd-center` / `body .bbc-rd-impact .rd-center`), so the page-specific override can't be beaten by load order regardless of which file loads last. For band 8 specifically, also override `.rd-cmp-84401`'s `margin:0 auto !important` under `.bbc-rd-impact` (or drop that class from the get-involved wrapper) so the whole header block — not just the eyebrow — sits on the shared axis. Re-screenshot bands 2/3/6/8/10 on both viewports after.

### 2. Cookie consent banner does not dismiss (needs live-URL confirmation)

On the preview draft, `#shopify-pc__banner`'s own **Decline** and **Accept** buttons produce no change: forced clicks directly on `button.shopify-pc__banner__btn-decline` / `-accept` leave the banner at `display:block`, and no consent value is ever written to `localStorage` or `document.cookie` (`{"ls":[],"cookies":"localization=GB; cart_currency=GBP"}` after clicking Accept). The banner sits fixed near the bottom of the viewport (desktop: top≈571px of an 812px viewport, height≈241px) at every scroll position on every band, for the whole session. Console shows unrelated CSP/403/404 noise but no error tied to the banner's own click handler.

This explains why the last two CRIT reports (this one included, initially) treated the reappearing banner as a "capture artifact" — a normal `page.click()` *does* fail here, but only because Shopify's own draft-preview toolbar (`#PBarNextFrameWrapper`, "CUSTOMTHEME20262 · Draft · Hide bar / Exit preview") intercepts the pointer event, which is a preview-only overlay that won't exist for real customers. But bypassing that with a **forced** click on the real button proves the banner's *own* logic doesn't respond either. **Caveat:** this needs a check on the published/live URL (not `?preview_theme_id=`) before treating it as a customer-facing defect, since Shopify's native customer-privacy API can initialise differently under preview auth — but if it reproduces live, every visitor who touches the cookie banner is left with roughly the bottom third of every page permanently obscured, which is a real accessibility/compliance/CTA-blocking issue, not specific to Impact.

**Fix:** verify on the published theme first. If it reproduces, check for a JS error or CSP block preventing `Shopify.customerPrivacy`'s banner-dismiss handler from firing (nothing in this page's own JS touches `#shopify-pc__banner`, so the fault is upstream of this theme's custom code — likely a script load order or CSP interaction, not a Liquid/CSS issue).

### 3. Minor axis drift on "the follow-on" (band 5)

Eyebrow/lede sit at x=32 (mobile) vs the x=18 axis used on 5 of the other bands — a small, secondary inconsistency (not James's blocking complaint, but worth folding into the same CSS sweep since FORMULA calls for **one** axis, not two).

---

## Verdict: **NOT READY FOR JAMES — one more fix pass.**

The content work is genuinely solid: J1/J2/J3 all landed and verified live (not just claimed), AAA is clean everywhere including the previously-marginal ✱ glyph, banned claims/overflow/button system are all clean on both viewports, and the recognised-by band's labelling fix (defect 5 from the last CRIT) is confirmed in place. But the **one-left-axis defect — the exact thing James named at his last two G5s — is still present on half the bands**, and this pass found the actual reason three separate "fix" commits failed to close it: a cross-stylesheet load-order tie, not a missing or wrong rule. Fix 1 (with `!important`/specificity, not another same-shaped rule in `bbc-statement.css` that will lose the same tie) should close all five band failures in one change. Fix 2 (cookie banner) needs a live-URL check before it's confirmed as customer-facing, but is high severity if real and should be checked before this goes to James, not after.