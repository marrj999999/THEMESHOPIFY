# Shopify theme best-practices review — BBC 2026 redesign

**Date:** 2026-06-11. Reviewed all 15 redesign sections (`sections/bbc-*-2026.liquid`) + `assets/bbc-redesign-2026.css` + the wiring/setup, against current Shopify theme best practices (`shopify.dev` performance docs, `performance.shopify.com`, Core Web Vitals 2026).

## Verdict
**Well-suited, and it follows most Shopify best practices.** The architecture is modern (Online Store 2.0, section-and-block, schema-driven/editable), it's **lint-clean (`shopify theme check`: 0 errors**, 4 low-severity warnings), commerce is correct (native product/cart/search forms + `routes.*`), and accessibility is above average (focus states, ARIA, the Atkinson Hyperlegible font, reduced-motion). The real improvement area is **front-end performance polish** (fonts, responsive images, CSS loading); plus **setup hygiene** (templates not yet committed) and **one pre-existing security issue** that must be actioned. None are blockers. **Overall: A− with a clear path to A.**

## Grades by category
| Category | Grade | Note |
|---|---|---|
| Architecture (OS 2.0) | **A** | sections + blocks + presets + section groups, all editable |
| Liquid & schema | **A−** | 0 lint errors; 4 `HardcodedRoutes` warnings (intentional fallbacks) |
| Performance / CWV | **B−** | functional + CLS-safe, but TTF fonts, single-width images, duplicate CSS loads |
| Accessibility | **A−** | strong; one borderline contrast token |
| Maintainability | **B** | clean scoping, one CSS file; heavy inline `style=""` |
| i18n / locales | **C** | hardcoded English (acceptable for a custom theme) |
| Commerce correctness | **A** | product/cart/search forms + routes all correct |
| Setup / version control | **B−** | templates not committed; ⚠ committed Admin token (below) |

## What's done well
- **True OS 2.0**: every page is sections + blocks with presets; merchant-editable copy/images/links; section groups for chrome. No hardcoded page templates.
- **Lint-clean**: 0 errors across 15 sections + CSS. Schema rules respected (no `url` defaults, label ≤70, name ≤25, no empty-string text defaults — all learned/fixed during the build).
- **Commerce-correct**: `{% form 'product' %}` with variant radios (JS-free add-to-cart), native cart (`routes.cart_change_url` + checkout), native + predictive search (`routes.search_url` + `/suggest.json`), search results built with `textContent` (no XSS).
- **CLS-safe**: every `<img>` carries `width`/`height`; hero is `loading="eager"`, below-fold `lazy`.
- **Collision-proof scoping**: all CSS under `.bbc-rd` / `rd-*`; cannot affect the existing 230-asset theme.
- **Accessibility-forward**: `:focus-visible` rings, `aria-expanded`/`aria-label`/`role` on nav/drawer/search, `prefers-reduced-motion` gating, 44–56px tap targets, and Atkinson Hyperlegible (an accessibility typeface).

## Findings & recommendations

### ⚠️ Security (action first — pre-existing, not from this work)
- **A live Admin API token (`shpat_…`) is committed in `THEME_RULES.md`, `CLAUDE.md`, and `AGENTS.md`.** Anyone with repo access has full store admin. **HIGH.** **Rotate it now** (Shopify admin → the custom app → regenerate/revoke), remove it from the repo + git history, and use a **Theme Access password** or an env var (`SHOPIFY_CLI_THEME_TOKEN`) instead. (I used it from the repo to drive the sandbox; that's exactly why it shouldn't live there.)

### Performance / Core Web Vitals (the main area)
1. **Fonts are TTF, not WOFF2.** `Med-High.` WOFF2 is 30–50% smaller than WOFF and far smaller than TTF (no compression). Convert the 4 Atkinson files to WOFF2, keep `font-display:swap`, and **preload** the primary weight with `crossorigin="anonymous"` (saves ~200–500 ms of swap delay). *(assets/AtkinsonHyperlegible-*.ttf, @font-face in bbc-redesign-2026.css)*
2. **Images use a single `image_url: width:` (no responsive `srcset`).** `Med-High.` The hero is the LCP element and is served at one large width to all devices. Use `image_tag` with a `widths:` list (Shopify builds the `srcset`), and set `preload: true` + `fetchpriority="high"` on the hero. *(every section's `<img>`; biggest win on bbc-home-2026 / page heroes / PDP gallery)*
3. **The shared stylesheet is emitted per-section.** `Med.` Each of the 15 sections runs `{{ 'bbc-redesign-2026.css' | asset_url | stylesheet_tag }}`, so a page (header + content + footer sections) prints the same `<link>` 3+ times, render-blocking. Load it **once** in `layout/theme.liquid` `<head>` (it's `.bbc-rd`-scoped, so global load is safe) and drop the per-section tags — ideally with the theme's existing `media="print" onload` async pattern.
4. **Header nav JS is an inline `<script>`.** `Low-Med.` Parser-blocking. Move it to a deferred external asset (`assets/bbc-rd-nav.js` + `<script src defer>`). INP is fine (the script is small), but external+defer is the standard.

### Accessibility
- Strong overall (see "done well"). **One issue:** `--subtle` (`#5A6863`) eyebrow text on `--bone` (`#E6DCC8`) is ≈ 4.0:1 — just under WCAG AA 4.5:1 for small text. `Low.` Darken `--subtle` (≈ `#4A5853`) to clear AA. (Lime is only used as a background with forest text or as an accent on dark — those combos pass.)

### Liquid & schema
- 0 errors. **4 `HardcodedRoutes` warnings** (`bbc-header/impact/education/workshops`) from the `/pages/…` `/collections/…` fallback links. `Low.` Use `routes.*` objects where they exist; pages/collections have none, so the fallbacks are reasonable — or make them `url` settings only (no Liquid fallback) so the merchant must pick.

### Maintainability
- **Heavy inline `style=""`** for one-off layout across the sections. `Low-Med.` Works + theme-check-clean, but migrate recurring patterns to utility classes, and extract the repeated funding-loop / cause-bar / stats markup into snippets (`snippets/bbc-rd-*`) to cut duplication across the 15 files.

### i18n / locales
- All copy is **hardcoded English** in schema labels + setting defaults. `info.` Fine for a single-store custom theme; but BBC ships to 36 countries and runs Amersfoort/Toulouse workshops — **if you ever localize**, move storefront strings to `locales/*.json` + `{{ '…' | t }}` and schema labels to `t:` keys.

### Setup / version control
- **The template JSONs are written to the sandbox theme via the Admin API — they are NOT committed to the repo.** `Med.` The sections + CSS are committed; the templates (index, page.*, product.kit-*, collection/cart/blog/article/search/404) live only on theme `195991470454`. Before production: **commit the template JSONs** to `templates/` (version control) and decide the go-live path — publish the sandbox theme, or port the `bbc-*-2026` sections + templates into the main theme via `shopify theme push --only` (never a bare push; never `templates/*.json`/`settings_data.json` over the live theme).

## Top-10 fix list (priority order)
1. **Rotate + remove the committed Admin token** (security).
2. Convert fonts to **WOFF2** + preload the primary weight.
3. **Responsive `srcset`** (image_tag widths) + `preload`/`fetchpriority` on the hero LCP.
4. **Load the shared CSS once** (theme.liquid, async) instead of per-section.
5. **Commit the template JSONs** to the repo.
6. Move the header nav **JS to a deferred external asset**.
7. Darken `--subtle` for **AA contrast** on eyebrows.
8. Resolve the **4 HardcodedRoutes** (routes/settings).
9. Migrate one-off **inline styles → utility classes**; extract shared snippets.
10. **Locales** — only if multi-language is on the roadmap.

## Sources
- [Shopify — Performance best practices for themes](https://shopify.dev/docs/storefronts/themes/best-practices/performance)
- [Performance @ Shopify — Responsive images with Liquid](https://performance.shopify.com/blogs/blog/responsive-images-on-shopify-with-liquid) · [Liquid image_tag](https://shopify.dev/docs/api/liquid/filters/image_tag)
- [Core Web Vitals for Shopify (2026)](https://www.corewebvitals.io/core-web-vitals/shopify-guide) · [Shopify font optimization (2026)](https://www.thunderpagespeed.com/blog/shopify-font-optimization/)
