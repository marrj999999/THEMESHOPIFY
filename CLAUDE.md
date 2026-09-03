# BBC Shopify Theme — Claude Code Context

## Dispatch Task Routing — MANDATORY

**ALWAYS use `start_code_task` (Claude Code) for ALL tasks. NEVER use `start_task` (Cowork).**

This applies to everything — research, writing, vault maintenance, email drafting, file operations, design work, installations. No exceptions. Claude Code has full access to all MCPs and is more reliable than Cowork tasks.

---

## Quick Start

```bash
cd ~/Projects/bbc-theme-new
shopify theme dev --store=bamboo-bicycle-club-london-uk
```

Preview: https://bamboobicycleclub.org/?preview_theme_id=195991470454 (sandbox — STALE, re-baseline before use)

---

## Project Overview

**What:** Dawn 15.4.1 rebuild of Bamboo Bicycle Club's Shopify theme
**⚠️ PUBLISHED THEME: `196739727734` "Copy of CUSTOM THEME 2026"** (verified via Admin API role:main, 7 Jul 2026). Every push to it is customer-facing. ⚠️ Theme IDs have silently changed twice — ALWAYS verify with `shopify theme list` (role:main) before any push; never trust a hardcoded ID, including this one.
**Dead theme IDs (no longer exist on the store, 7 Jul 2026):** `196398383478` (previous live) · `191768756598` (pre-redesign). If any doc mentions them, it is stale.
**Correction 2026-07-24:** `195991470454` was listed here as dead but is still on the store, unpublished, named "BBC Redesign 2026 (WIP - do not publish)" — verified against `themes.json`. Do not push to it; the working draft is `196820238710` "CUSTOMTHEME20262".
**Store:** bamboo-bicycle-club-london-uk.myshopify.com
**Live site:** bamboobicycleclub.org

**Status:** The 2026 redesign IS live/production. The repo (branch `redesign-2026-homepage-slice`) has drifted from the published theme — re-baseline (`shopify theme pull --theme=196739727734`) before editing any file, and never `put` a theme asset that wasn't first pulled and diffed.

---

## Shopify Admin API

```bash
# Get theme info
curl -H "X-Shopify-Access-Token: SHOPIFY_ACCESS_TOKEN_FROM_ENV_ME_USE_THEME_ACCESS_TOKEN_OR_ENV" \
  "https://bamboo-bicycle-club-london-uk.myshopify.com/admin/api/2024-10/themes.json"

# Get theme assets
curl -H "X-Shopify-Access-Token: SHOPIFY_ACCESS_TOKEN_FROM_ENV_ME_USE_THEME_ACCESS_TOKEN_OR_ENV" \
  "https://bamboo-bicycle-club-london-uk.myshopify.com/admin/api/2024-10/themes/196739727734/assets.json"

# Get specific asset
curl -H "X-Shopify-Access-Token: SHOPIFY_ACCESS_TOKEN_FROM_ENV_ME_USE_THEME_ACCESS_TOKEN_OR_ENV" \
  "https://bamboo-bicycle-club-london-uk.myshopify.com/admin/api/2024-10/themes/196739727734/assets.json?asset[key]=sections/header.liquid"
```

**Token:** `SHOPIFY_ACCESS_TOKEN_FROM_ENV_ME_USE_THEME_ACCESS_TOKEN_OR_ENV`

---

## Brand Guidelines

### Colors
| Name | Hex | Usage |
|------|-----|-------|
| FOREST | `#003C32` | **CANON (decided 2 Jul 2026)** — primary dark green; the 2026 design system token `--forest`. Legacy `#073e27` is retired; `--bbc-forest` tokens repointed. |
| TEAL | `#3f8b66` | Secondary green, accents |
| GOLD | `#ffa900` | Highlights, CTAs, emphasis |
| STEEL | `#8da4c1` | Secondary, softer accent |

### Typography
- **Font:** Plus Jakarta Sans (all weights)
- Headlines: Bold/Extra Bold
- Body: Regular (18pt)

### Logo Rules
- Symbol (roundel) should NEVER be black
- Symbol = bright/luminous color, lighter than wordmark on light BGs
- Wordmark = FOREST or black on light BGs, white on dark BGs

---

## Folder Structure

```
~/Projects/bbc-theme-new/
├── assets/
│   └── bbc-custom.css          # Main custom styles
├── config/
│   ├── settings_schema.json    # Theme settings
│   └── settings_data.json      # ⚠️ DO NOT OVERWRITE (contains James's customizations)
├── layout/
│   └── theme.liquid            # Main layout
├── sections/
│   ├── bbc-*.liquid            # 38 custom sections
│   └── header.liquid, footer.liquid
├── snippets/
│   ├── bbc-icons.liquid        # Icon system (Material Symbols + brand logos)
│   ├── bbc-trust-bar.liquid    # Stats bar
│   └── bbc-*.liquid            # Other snippets
├── templates/
│   ├── index.json              # Homepage
│   ├── product.kit-*.json      # 16 kit product templates
│   └── page.*.json             # Page templates
└── locales/
```

---

## Custom Sections (38 total)

### Product Sections
- `bbc-product-build-time` — Build time estimate
- `bbc-product-durability` — Durability info
- `bbc-product-geometry` — Geometry specs
- `bbc-product-reviews` — Customer reviews
- `bbc-product-shipping` — Shipping info
- `bbc-product-support` — Support details
- `bbc-product-tabs` — Tabbed content
- `bbc-product-upsell` — Upsell section
- `bbc-product-whats-included` — Kit contents
- `bbc-kit-complete` — All-in-one kit page (~28KB)

### Homepage Sections
- `bbc-hero` — Hero banner
- `bbc-why-bamboo` — Benefits
- `bbc-testimonials` — Customer quotes
- `bbc-gallery` — Image gallery
- `bbc-faq` — FAQ accordion
- `bbc-before-after` — Before/after slider
- `bbc-video-text` — Video + text
- `bbc-instagram-feed` — Instagram grid
- `bbc-recently-viewed` — Recently viewed products

### Complete Page Sections (hardcoded, bypass block caching)
- `bbc-workshop-complete` — Full workshop page (42KB)
- `bbc-contact-complete` — Full contact page (34KB)
- `bbc-homepage-testimonials` — Hardcoded testimonials
- `bbc-press-wall` — Press logos
- `bbc-awards` — Awards display
- `bbc-timeline` — Company history
- `bbc-epic-journeys` — Customer adventures

---

## Icon System

Uses Google Material Symbols font (loaded in theme.liquid).

```liquid
{% render 'bbc-icons', icon: 'timer', size: 24 %}
{% render 'bbc-icons', icon: 'check_circle', size: 20 %}
```

**Available icons:** timer, check_circle, build, straighten, local_shipping, support_agent, eco, recycle, handshake, verified, workspace_premium, and 30+ more.

**Brand logos:** bbc-roundel, instagram, facebook, youtube, tiktok, strava, komoot

---

## Key Patterns & Gotchas

### ⚠️ NEVER Upload template/*.json files
These contain James's content, images, block settings. Uploading overwrites his customizations.

**Safe to edit:** sections/*.liquid, snippets/*.liquid, assets/*.css, layout/*.liquid
**Ask first:** templates/*.json, config/settings_data.json

### ⚠️ Block Caching Issue
Section blocks "freeze" once a template is added. Updating JSON presets does NOT override existing block content.

**Solution:** Create hardcoded sections (like `bbc-workshop-complete`) that render content directly without relying on theme editor blocks.

### ⚠️ Preview URL Auth
`?preview_theme_id=X` requires authenticated browser session. curl/wget fetch the live theme, NOT the preview.

**Verification:** Use Admin API asset checks OR authenticated browser.

### Section vs Global Settings
- `section.settings.X` — Settings defined in that section's schema
- `settings.X` — Global theme settings (config/settings_schema.json)

---

## CLI Commands

```bash
# Start dev server
shopify theme dev --store=bamboo-bicycle-club-london-uk

# Push to theme
shopify theme push --theme=196739727734

# Pull latest
shopify theme pull --theme=196739727734

# Check theme info
shopify theme info
```

---

## Navigation

- Header menu handle: `main-menu`
- Footer columns: `footer`, `footer-company`, `footer-help`
- Structure: Shop ▾ | Workshops ▾ | About ▾ | Support ▾ | Team Building | News

---

## Smart Collections

- `/collections/road` (6 products)
- `/collections/gravel-adventure` (12 products)
- `/collections/mtb` (4 products)
- `/collections/balance-bikes` (4 products)

---

## Kit Product Templates

16 individual templates for per-product customization:
- `product.kit-road.json`, `product.kit-road-lugged.json`
- `product.kit-gravel.json`, `product.kit-gravel-lugged.json`
- `product.kit-mtb.json`, `product.kit-fatbike.json`, `product.kit-city.json`
- `product.kit-balance.json`, `product.kit-balance-flax.json`
- `product.kit-custom.json`, `product.kit-touring.json`
- `product.kit-spare-1.json` through `product.kit-spare-5.json` (for new products)

---

## Key Stats (for trust bars)

- 4,000+ builders trained
- 5 active prison sites (2026-08-19, James approved — Northumberland fully set up and paid): HMP Lowdham Grange · HMP Foston Hall · HMP Lindholme · HMYOI Feltham · HMP Northumberland (never "three prisons"/"rolling out")
- Mission (LOCKED 2026-07-06, verbatim): "We use bamboo bike-building to give practical skills and a way forward to people locked out of education — in schools before exclusion, and in prisons after." Tagline: "Build bikes. Build skills. Build futures."
- 45 countries (James-approved 2026-07-07 from customer records; supersedes the old "36+")
- Since 2012
- 90%+ prison-course completion · OCN-accredited. **Prisons — exact title: "OCN London bespoke Level 2, Workshop Skills and Sustainable Manufacturing" (centre course ID 1130735, 120 GLH / 192 TQT, NOT Ofqual-regulated).** Corrected 2026-07-24: this file previously said "Sustainable Design & Manufacturing", which is not the course's name — that error had propagated into 14 places across the theme. Canonical source is the vault `System/Claims Register.md`, which overrides this file if they ever disagree. Schools: "OCN Level 1 Award — Practical Manufacturing Skills" (approved by James 2026-07-24; OCN evidence pointer still to be attached). NEVER "Level 1 & 2" mushed, and never "nationally recognised".

**⛔ BANNED — never use in any copy or defaults:** "28,000 PSI" / "stronger than steel" (false — tested tensile ≈ 84 MPa; say "comparable to mild steel, tested to BS ISO 22157 at Swansea University") · "56.7% lower carbon than aluminium" (no named LCA — greenwashing risk; use qualitative "grown not mined, regrows in 3–5 years") · "£11.41 SROI" (no traceable study) · "£280 per learner" (confidential contract pricing) · "100% completion" (use 90%+). Run `scripts/claim-lint.sh` before every push.

---

## Current Issues / TODO

1. Parts template missing: `product.parts.json` doesn't exist, falls back to Dawn default
2. Parts pages have emoji issues: "🔧 Compatibility" needs Material Symbols
3. Some hardcoded grays (#333, #999) in header dropdowns need CSS variables
4. **CSS cascade trap (found 2026-08-21):** `bbc-redesign-2026.css` is loaded ~11× per page —
   every bbc-*-2026 section emits its own `stylesheet_tag`, so the base file re-asserts its
   rules AFTER the header's inline `<style>`. Any header override must use `#rd-header2026`
   ID specificity (see comment in `sections/bbc-header-2026.liquid`). Worth deduping the
   `stylesheet_tag` calls across sections one day.
5. **Legacy logo pins:** `bbc-statement.css:248` and `bbc-layout.css:58` pin `.rd-logo-img`
   small with `!important` (46px/44px). The 2026-08-21 header-impact update outranks them
   from the header section (ID + `.rd-brand` + `!important`); if the logo ever refuses to
   resize, look there first. Candidates for deletion in a cleanup pass.
6. **`sections/bbc-home-2026-staging.liquid` on draft 196820238710 is a leftover stub, safe
   to delete** (2026-08-21). It was a checksum-verified staging step for the hero-video fix
   (whole-file API pushes only; staged, render-verified, promoted via themeFilesCopy). The
   API user can't delete theme files, so it holds an inert no-preset stub. Note the deployed
   `bbc-home-2026.liquid` differs from the repo copy by a small amount of comment whitespace
   only — render-verified identical; the next `shopify theme pull` re-baseline makes them
   converge.
7. **Hero video, two bugs fixed 2026-08-21 (draft only — live runs older code):**
   (a) the schema's "film" style option was never implemented in Liquid, so it silently fell
   back to the teaser — now film → `bbc-hero-film.mp4` + `bbc-hero-poster.jpg`, matching live;
   (b) the opt-in script appended the `<source>` then called `play()` immediately, which
   RESOLVED but left the element paused at currentTime 0 while still buffering the whole
   6.6 MB film — full bandwidth spent for a static poster. Fixed with `v.load()` + play on
   `canplay`. Measured before/after at 1440px: currentTime stuck at 0.00 → advances normally.
   The wide-viewport / motion / connection gating is unchanged, so mobile still gets poster only.
8. **Hero responsive rebuild 2026-08-21 (draft only) lives in `assets/bbc-align.css`,**
   appended at the end under "HOME HERO - responsive rebuild", not in the section. That is
   deliberate and matches the precedent already set in that file: `bbc-home-2026.liquid` is
   ~94KB, past the single-emit round-trip limit, and bbc-align.css is the documented "ONE
   authority for layout alignment" that already owned `.ew` min-height and `.ew-copy` padding.
   Four changes, all CSS, no markup: (a) height ceiling 700px -> clamp(560px,82svh,940px) at
   >=1200px, which was the 215px of dead space under the hero at 1080p and grew the video
   ~25% in area with NO extra upscaling; (b) a hero-only h1 clamp at >=1200px (7.4vw instead
   of the global 9vw) because the headline is sized from the VIEWPORT but lives in a 45%
   column; (c) stack below 1200px - the 0.82fr/1fr split held down to 750px and at 768 gave a
   339px copy column (headline broke to one word per line) and a 414px video slice, stacking
   makes the video full-width (414 -> 753px) and the headline 2 clean lines; (d) on phones the
   CTAs are lifted above the stats with flex `order` (DOM order untouched) because both
   buttons previously rendered below the fold.
   **The 920x792 source is the ceiling on "bigger video"** - it is already upscaled 1.14x at
   1920 wide, so extra size is bought with HEIGHT and full-width stacking, never more width.
   A higher-res master would be needed to go further; the Shopify Files library does hold
   several 1920x1080 videos, but none is confirmed to be this footage.
   Verified 1920x1080 / 1440x900 / 1024x768 / 768x1024 / 390x844 / 375x667, no h-overflow.
9. **Hero captions rotate (2026-08-21, draft only).** The single `.ew-tag` sticker
   ("Hand-built bamboo - lugged by hand") is gone; `hero_captions` is a new textarea
   setting, one caption per line, rendered as stacked `<b class="ew-cap">` in a CSS grid
   cell and cross-faded by ONE keyframe animation with a per-item `animation-delay`. No
   JS. **10 captions x 7.5s = the film's exact 75s loop**, so the cycle re-syncs every
   loop instead of drifting; the slot percentage is computed in Liquid from `caps.size`,
   so changing the line count retimes it automatically. Group is `aria-hidden` (it
   auto-updates, and every claim also appears as static text elsewhere), pauses on hover,
   and `prefers-reduced-motion` pins it to caption 1.
   **Copy is Claims-Register-governed** — see the comment block in the section for why
   "tested around the world" and "easiest way to build a frame" were rejected. Anyone
   adding a caption must check `~/Documents/Bamboo bicycle club/System/Claims Register.md`
   first; `claim-lint` will NOT catch a true-components/wrong-subject claim (that is what
   the 19 Aug 2026 gravel-PDP incident proved).
   **Open:** WCAG 2.2.2 wants a pause control for auto-updating content. Hover-pause +
   reduced-motion is a mitigation, not a mechanism; this estate already stopped a marquee
   for that exact reason (see bbc-align.css). Flagged to James, not yet decided.
10. **Hero identity pass (2026-08-21, draft only).** Drawing titleblock REMOVED - markup and
   all nine `fab_titleblock`/`fab_tb_*` settings, because index.json still saves
   `fab_titleblock:true`, so gating or CSS-hiding would have left a dead editor control.
   Added: the **bamboo culm** (segmented lime rule, real node spacing, grows on load) which
   re-uses `.ew-rule`; a lime **seam** drawing down the film edge; a **sub-line** from a new
   `hero_sub` setting; brighter primary button + real pressed state on both.
   **`div:empty` TRAP - read this before adding any decorative empty element.** Dawn's
   `base.css:471` has `div:empty{display:none}`. `.ew-rule` is an empty div, so the hero
   accent rule had NEVER rendered since the 2026 build - the original 60px dash was
   invisible too, which is why nobody missed it. Fix is one `display:block` in
   bbc-align.css. **`.ew-grain` (film noise/texture) and `.rd-ov` (door-card scrim) are in
   the same state and still dead** - grain deliberately left off, the film is only 920px
   wide and an overlay risks muddying it. One line each if wanted.
   **Regression caught and fixed in-session:** the sub-line at `order:3` pushed both mobile
   CTAs back under the fold (ctaTop 715 -> 809), undoing item 8(d). Now `order:5` (buttons
   before sub-line on phones) - verified both buttons visible again at 390x844.
   **KNOWN UNTIDINESS:** the section sets `.ew-sub{order:3}` and bbc-align overrides it with
   an `[class]` specificity bump because the section's inline style is emitted in the body,
   i.e. after the stylesheet. Delete the section's declaration next time it is edited.
   **Latent, not fixed:** the `hero_title` setting is unused - the h1 is hardcoded spans, so
   editing the headline in the theme editor does nothing. Same family as the hero-video
   style bug. Wiring it up means splitting the bone/lime-italic lines from one string; left
   alone rather than risk the headline treatment.
11. **Hero spacing correction (2026-08-21) — and the process lesson.** James flagged "spacing
   looks off" and was right. Raising the hero ceiling for the video (item 8a) left the copy
   column still on `justify-content:flex-end`, so ALL the new height became a void ABOVE the
   copy: measured 172px over the eyebrow vs 49px under the buttons, and the culm then
   overhung the content by 136px, reading as a stray line. Fixed by centring the copy in
   two-column mode (void now 99/106) and switching the culm from a fixed clamp to symmetric
   `top/bottom:14%` insets, which bracket the content to within 4px at 1440x900. Rhythm also
   opened up: gaps were a flat 16/18/18/34, now 25px above the sub-line and 27px below it.
   The vertical culm is now two-column only; the whole stacked range gets the horizontal one
   (it was 749px, which left 750-1199px with a vertical rule against top-aligned copy).
   **PROCESS LESSON — this is why it shipped wrong:** the last two deploys before James
   looked were verified with DOM measurements only, no screenshots. Every number was correct
   and the composition was still wrong, because nothing measured the ratio of empty space to
   content. Take a screenshot at 1440 / 1024 / 390 after ANY hero change, and note that the
   headless pane freezes CSS transitions (visibilityState is always "hidden"), so the hero
   never reaches `.is-on` on its own - force the settled state before shooting or the
   screenshot shows a pre-animation frame and tells you nothing.

12. **The gutter, and the estate axis (2026-08-21).** James: "everything is justified left
   touching the edge, it's not clear and readable." Correct, and the numbers were stark - at
   1440 the first two screens had FOUR left edges: culm 32, hero copy 43, header 46, page
   content 113. The hero sat 70px left of everything under it and 43px off the browser edge.
   **There is no left spine to align to** - the bands below the hero are CENTRED (363px at
   1440), and aligning the hero to the 1200px container was tested and squeezed the headline
   to four lines. The fix is a generous CONSISTENT gutter: `--bbc-gutter` on `.bbc-rd` in
   bbc-align.css, used by both the hero copy and the header, so the logo and the headline
   share one axis by construction rather than by coincidence.
   **It must be STEPPED, not one clamp.** A flat `clamp(32px,6vw,120px)` gave 32px on a
   phone, but the estate axis at phone is **18px** - measured at 390: press content, door
   cards, why-bamboo head and stats ALL sit at 18. bbc-consistency-2026.css has pinned the
   hero to 18/32 since 2026-08-10 ("the estate axis runs 18/32/72") and loads AFTER
   bbc-align, so it wins on source order. The flat clamp therefore broke nothing in the hero
   but DID push the header logo to 32px, misaligning it against a hero that was already
   right. Now: 18 (<=520) / 32 (521-1023) / clamp(32,6vw,120) (>=1024).
   Verified: 390 and 375 -> logo, culm, eyebrow, headline, CTA all 18; 768 -> all 32;
   1440 -> all 86, headline 72px with "a way forward." intact, no overflow anywhere.
   **Headline sizing had to change with it.** A viewport-based size cannot track a column
   that is `45vw MINUS a growing gutter` - widening the gutter broke the headline to
   "a way / forward.". Now sized from the COLUMN via container queries:
   `container-type:inline-size` on `.ew-copy` + `clamp(2.6rem,min(14cqw,8.2vh),6.5rem)`.
   The accent phrase holds while font <= 0.1445 x column width; 14cqw sits just under it.
   **THREE files touch `.ew-copy` padding-left** (bbc-align, bbc-consistency-2026, and the
   section's own mobile block). That is the real untidiness. Consolidating onto the variable
   needs bbc-consistency's two rules deleted in the same pass - a deliberate follow-up, not
   a half-done change.
13. **The pane freezes reveal animations - twice this cost a false reading (2026-08-21).**
   Item 11 warned about this for screenshots; it bites measurements too, and it produced two
   wrong conclusions in one session before being caught:
   - The hero stat counters animate up from 0. A screenshot read "219+ people trained /
     2 countries", which contradicts the Claims Register and looks like a live claims
     breach. The DOM actually says "4,000+ / 45 / 2012" - correct. It was a frozen
     mid-count frame.
   - `.ew-rule` reveals via `transform:scaleX(0) -> scaleX(1)`. Frozen at scaleX(0), so
     `getBoundingClientRect().width` reports **0** while `getComputedStyle().width` reports
     the true 68px. A 0 here means "animation not settled", NOT "the rule did not apply".
   Force the settled state before believing either a screenshot or a rect:
   `*{animation-duration:.001s!important;transition-duration:.001s!important}` plus
   `transform:none!important` on the revealing element, then read `offsetHeight` to flush
   layout before measuring.
14. **Dash-period geometry (2026-08-21).** The stacked culm is a repeating gradient with a
   **24px period** (20px lime + 4px joint). The section set the horizontal variant to 74px =
   3.08 periods, so it painted three dashes plus a 2px orphan that read as a rendering
   artifact. Now pinned to 68px in bbc-align (exactly lime,joint,lime,joint,lime, flush on
   lime). If the gradient period changes, this width changes with it. Found by SCREENSHOT at
   1024 - no measurement would have flagged it, which is item 11's lesson landing again.

15. **Why-bamboo stat strip removed (2026-08-21).** James: "remove this from the home page
   block", quoting the lede, the three stats and the source line. Removed `.acc-lede`,
   `.acc-stats` and that band's `.rd-stat-src`; kept the eyebrow, the h2, the four cards and
   the CTA. Band 1116px -> 894px. **"45 countries" was on the page three times** (top bar,
   hero stats, this strip) and card 3 still says it in prose, so nothing factual was lost.
   **Done in CSS, and both reasons matter.** (a) bbc-home-2026.liquid is ~105KB, past the
   single-emit limit, so it cannot be rewritten through the MCP pipe. (b) **Clearing the
   settings in the theme editor would not have worked anyway** - they are all
   `{{ section.settings.x | default: '...' }}`, so blank falls through to the hardcoded
   default and renders regardless. That is the same gating bug already documented at
   bbc-home-2026.liquid:751 for `fab_why_spec`. To restore, delete the rule; there is no
   editor switch, precisely because of (b).
   **Scoping is load-bearing:** `.acc-stats` is also used by `sections/bbc-band-2026.liquid`
   and `.rd-stat-src` is a generic class, so the rule is `.bbc-rd-home section.acc` with
   direct-child selectors. The `.acc-stats{justify-content:center}` rule earlier in
   bbc-align now serves bbc-band-2026 only and was kept for it.
16. **FOR JAMES, editor-only: the why-bamboo heading has a typo.** `templates/index.json`
   holds `"why_title": "easiest way to build a bke"` - missing the `i` in "bike", rendering
   at ~90px on the homepage. It is a saved editor value, and `templates/*.json` must never
   be pushed from here, so **only James can fix it**: theme editor -> homepage -> the
   bbc-home-2026 section -> why-bamboo title field. Note the schema DEFAULT is different
   again ("no workshop. no welding. no experience needed."), so the typo is definitely a
   typed value, not a code string.

17. **Impact hero rebuilt to match home (2026-08-21).** James: "on impact get rid of stats on
   hero as they are below and match the design to the hero on the home page ... look on our
   youtube for a video to cut as looping background ... but make unique for impact".
   **Stats:** removed. They were near-duplicates of the 4-stat band directly beneath -
   "4,000+ people trained" and "90%+ prison-course completion" appeared twice on one screen.
   Note the section HAS a real `hero_proof_on` boolean with a proper `{%- if -%}` guard, so
   unticking "Show proof figures in hero" in the theme editor does the same thing more
   cleanly - but page.impact.json has it `true` and that file must never be pushed, so CSS
   does it. If James unticks it, the CSS rule becomes a no-op.
   **Layout:** the hero was a layered full-bleed photo (`.rd-bg` + `.rd-scrim` + `.rd-inner`,
   all absolutely stacked in a flex `.rd-hero`) with everything centred. It converts to the
   homepage's two-column grid with **CSS alone** - make `.rd-hero` a grid and place the three
   children explicitly. Same 0.82fr/1fr split, same `clamp(560px,82svh,940px)` height, same
   `--bbc-gutter`, so logo and headline share one axis exactly as on home (verified 86/32/18
   at 1440/768/390).
   **The trap:** `.rd-hero` was `display:flex; align-items:flex-end`. That `align-items`
   survives the switch to grid, so `.rd-inner` rendered 438px tall pinned to the bottom of a
   738px row - 300px void above the breadcrumb, CTA row pushed out of the hero. Needs an
   explicit `align-items:stretch`. Every alignment NUMBER looked correct while this was
   broken, because the fault was vertical; only the screenshot showed it.
   **Second trap:** the h1 carries `rd-mw-15ch`, and bbc-align's own narrow-measure rule
   matches `[class*=rd-mw-][class][class][class][class]` at (0,5,0) and force-centres it. At
   a plain (0,4,0) the headline centred itself while the eyebrow and lede stayed left -
   invisible at desktop, obvious the moment it stacked at 768. Needs `> *[class][class]`.
   **Also:** the hero copy carried up-to-30px text-shadows for legibility over the photo. On
   the solid forest panel they read as a smudge and are switched off; bone-on-forest and
   lime-on-forest are both already well past AA.
   **Unique-for-impact:** same culm motif and same 24px node period as home, but masked to
   fade toward the top - part-grown rather than finished, which is the page's argument. Drawn
   as a `::before` on `.rd-inner` because this hero has no spare empty div, which also dodges
   Dawn's `div:empty{display:none}` trap entirely.
   **Phones:** buttons lifted above the lede (same fix the home hero needed) - before it, both
   CTAs sat at y=895 on a 390x844 screen. `.rd-wrap` is `display:block`, so it has to become a
   flex column before `order` does anything. After: primary at y=686, secondary at y=748.
18. **The impact film, and why it did NOT come from YouTube (2026-08-21).** James asked for a
   YouTube cut. yt-dlp **listed** the channel fine but every download 403'd after the first -
   an IP-level rate limit, not a permissions problem; it clears with time. The one clip that
   did land ("Building a Bamboo Bike at Home From a Kit") was a blue-lit home-build timelapse,
   wrong palette and wrong story for impact anyway.
   **Sourced from Shopify Files instead**, which turned out better: `Bamboo-Gravel-Bike-Frame_
   1080p_ENHANCED.mp4` (1920x1080, 3m43s, 262MB) was uploaded 2026-08-21 13:25. Frames were
   sampled straight off the CDN with ffmpeg HTTP range requests - no need to pull 262MB. The
   **95s-140s** stretch is hands/jig/tooling; **140s+ is presenter-to-camera and is
   deliberately excluded** - talking heads read badly with no sound.
   Cut: 95s-133s, centre-cropped to **1161x1000** (the same ~1.16:1 the homepage film uses -
   `Sequence 02.mp4` at 1254x1080 in Files is almost certainly how that one was made),
   24fps, crf 31, **4.6MB**. That is higher resolution than the homepage film AND a smaller
   file. Uploaded via stagedUploadsCreate + fileCreate; note the staged target enforces an
   EXACT byte count, so `fileSize` must be the real `stat` size or the POST is rejected.
   No loop crossfade: the source is a montage with its own hard cuts every few seconds, so a
   cut at the loop point is indistinguishable from the rest.
19. **Where the impact loader lives, and why it is not where it should be.** The correct home
   is a page-gated `<script>` in `layout/theme.liquid`. **That edit is written and tested but
   deliberately not deployed.** theme.liquid is 613 lines of dense pre-existing Dawn Liquid
   (colour-scheme loop, JSON-LD, an inline prefetch blocker) and the only write path available
   through the MCP is a hand-typed whole-file replace - one mistyped character breaks every
   page on the site, which is a bad trade for a script tag. The loader sits instead as a
   separate, clearly-fenced IIFE at the end of `assets/bbc-rd-nav.js`: small, fully readable,
   already `defer`-loaded from the header on every template, worst-case failure is visible
   immediately and trivially reverted. It derives the sibling asset URL from its own `src`.
   **Cleanup, in preference order:** (1) next time `sections/bbc-impact-2026.liquid` is edited
   by hand, move the `<video>` in with a real `video` schema setting and delete both the
   loader block and `assets/bbc-impact-hero.js`; (2) failing that, move the loader to a
   page-gated tag in theme.liquid.
   Verified after deploy: loader fires on impact only, video injects and reaches readyState 4,
   and the homepage nav, search and menu button are all untouched.
20. **FOR JAMES: the YouTube MCP token has expired.** `yt_auth_status` returns
   `invalid_grant: Bad Request` - the stored refresh token is dead, so none of the
   `yt_*` tools work until it is re-authorised. Channel listing still works without it
   (public, via yt-dlp), but uploads, analytics and metadata edits do not.

21. **"Who backs it." ledger redesign (2026-08-24).** James: "research and improve this
   design element, look at comparative." Research (Tavily/Firecrawl; the agent-reach CLI
   is NOT installed on this Mac, so its routing falls back to the direct search MCPs):
   sector peers (Clink, Switchback, Key4Life) group supporters by relationship but never
   QUANTIFY it - BBC's "2025 winner / GBP 24,000" notes beat the sector norm, so the
   structure stayed. Social-proof literature is unanimous on one-ink press rows.
   **The design-law finding: funder logos must stay FULL COLOUR.** TNLCF grant conditions
   require the full-colour logo wherever possible - greyscaling a funder mark can breach
   acknowledgement terms. Press row = one ink; funded-by/accredited-by/delivered-with
   tiles = full colour on white. Do not "unify" them.
   What shipped (all `.bbc-rd-impact`-scoped in bbc-align.css; snippets/bbc-press.liquid
   is SHARED across six templates with a "full-colour" contract and must not change):
   one-ink press row with per-asset heights (the shared 26px+170px cap halved wide
   nameplates - FT rendered ~14px, Independent ~12px); hover restores colour as the link
   affordance; BBC News gets grayscale-only (brightness(0) turned its blocks into solid
   squares - white letters INSIDE the mark); Evening Standard PNG was canvas-sampled
   before inking (63% transparent, 0% white - safe); culm node-dashes on group labels;
   Investec scaled 1.75x inside its tile (2500x2500 canvas, tiny mark); note-to-tile
   pairing via a second IIFE in bbc-impact-hero.js (tiles and notes are emitted in the
   same block order, so zip is safe; JS-off leaves today's layout).
22. **CDN cache trap on the impact-hero loader - now fixed, remember the rule.** The
   bbc-rd-nav loader originally STRIPPED the ?v= query when deriving the sibling URL
   ("meaningless" - wrong). Shopify's CDN long-caches the bare URL, so after
   bbc-impact-hero.js was updated the page executed a STALE 1.5KB copy - the film IIFE
   ran (in both versions) while the new pairing IIFE silently didn't. The loader now
   carries the parent's ?v= through, so every bbc-rd-nav deploy re-busts the child.
   **If bbc-impact-hero.js is ever changed without touching bbc-rd-nav.js, redeploy
   bbc-rd-nav.js too** - any byte, the asset hash is what busts the cache.

23. **THE FEEDBACK LOOP — read before ANY website work.** The vault note
   `Workstreams/Website Redesign Feedback Loop.md` is the working state for the redesign:
   what is on the draft awaiting James's review, his Feedback Inbox (action it top-to-bottom
   FIRST), the backlog in priority order, and the editor-side items only James can do.
   Protocol: read the note -> action the Inbox -> log in [[Shopify and Website]] -> update
   the note -> re-verify at 1440/1024/390 with screenshots. Approved pages get copied to
   live only as a separate, explicit step James asks for.
24. **Why-bamboo hero v2 (2026-08-24) - the one hero done at SOURCE.** bbc-drawing-hero.liquid
   was only 6.7KB, so unlike home (105KB) and impact (112KB) it was rebuilt properly: video in
   markup, real settings (film URL + poster are editor-editable), styles inline in a fresh
   .dvh-* namespace that no other sheet mentions - the cascade war cannot reach names it does
   not use. THREE estate rules still reached in via shared element/class names (h1 colour,
   h1 em colour, .rd-btn.rd-lime repaint keyed to the page's OLD light surface) - all three
   caught by screenshot on the deployed page, all three re-asserted with scoped !important in
   the section stylesheet. The DRAFT template had tb_v1 cleared and one callout only - the
   local repo copy of page.why-bamboo.json was STALE; when a section renders unexpectedly,
   read the theme's template via GraphQL (theme.files) before debugging the Liquid.
   Film: 42s cut of video_frame_testing.mp4 (Files), fetched by HTTP-range straight off the
   CDN - never download a 262MB master to cut 42 seconds. YouTube remains download-blocked
   on this IP (~10MB DASH cap, android client caps at 360p progressive); survey YouTube for
   CONTENT, source pixels from Files.

---

## Related Files

- Brand guidelines: `bamboo-bicycle-brand` skill (~/.claude/skills/bamboo-bicycle-brand/) — the old ~/Desktop/BBC_Master_Guidelines.pdf no longer exists
- Workspace docs: `~/.openclaw/workspace/bbc/`
  - `SHOPIFY_THEME_AUDIT.md`
  - `KIT_PRODUCT_STRATEGY.md`
  - `WEBSITE_CONTENT_IMPROVEMENTS.md`
