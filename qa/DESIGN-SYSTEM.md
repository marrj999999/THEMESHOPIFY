# BBC Design System — Typography & Token Reference
*Audited 2026-07-06 against CUSTOMTHEME20262. Companion to README.md (QA loop).*

## ⚡ 2026-07-06 — FIXES APPLIED (this audit)

**Discovered ruling:** `bbc-layout.css` "AUDIT FIXES v2 2026-06-15 — single-font (Atkinson)"
forces Atkinson on ALL headings incl. the homepage hero with `!important`. Fraunces and
Hanken Grotesque never rendered ("Hanken Grotesque" isn't even a valid Google Fonts
family name — the request silently failed since day one). **Atkinson-only is the system.**

Fixes shipped to CUSTOMTHEME20262:
- Removed ALL Google Fonts loads for Fraunces/Hanken (8 lines across home sections)
- Removed the duplicate Google load of Plus Jakarta Sans in theme.liquid (Dawn already
  serves it from Shopify's CDN) → **Google font requests: 6 → 1** (Material Symbols only)
- Consolidated Material Symbols to Outlined (3 rounded uses converted; Rounded load dropped)
- Added type-scale tokens `--rd-fs-1…6` and `--rd-display`/`--rd-ui` aliases (both resolve
  to Atkinson per the single-font decision)
- Promoted `.bbc-geo-table` styles from inline section CSS into the stylesheet
- Brand skill + vault Brand & Voice Guide synced (web = Atkinson; documents/decks = Jakarta)

Remaining (deliberate): Material Symbols Outlined via Google (migrate to `bbc-icons`
inline SVG when convenient); Jakarta on Dawn chrome (staged alignment, test in preview).

## Typography — current state

Four font systems coexist on the site today:

| Family | How it loads | Where it's used |
|---|---|---|
| **Atkinson Hyperlegible** (400/700 + italics) | **Self-hosted** woff2+ttf, `@font-face` in bbc-redesign-2026.css, `font-display:swap` | `--rd-sans` → the body font of every `.bbc-rd` page (all 2026 sections) |
| **Fraunces** (display serif) + **Hanken Grotesque** (UI) | Google Fonts, loaded inside bbc-home-2026 AND bbc-home-hero | Homepage hero display type only |
| **Plus Jakarta Sans** | Shopify font CDN (Dawn `type_header_font`/`type_body_font` settings) + a Google Fonts load in theme.liquid | Dawn-native chrome: cart, account, older sections |
| **Material Symbols** (Outlined AND Rounded) | Google Fonts ×2 in theme.liquid | icon glyphs |

Plus one-off fallbacks: Georgia serif (pull-quotes), 'Arial Black' (a single stamp element).

### The Atkinson story — use it, don't just set it
Atkinson Hyperlegible was designed by the **Braille Institute** specifically for
low-vision legibility (exaggerated letterform distinctions, unambiguous characters), and
it's free under the SIL Open Font License. For an organisation teaching in prisons —
where reading difficulties are far more common than in the general population — the body
typeface is not a styling choice, it's **mission-aligned accessibility infrastructure**.
This belongs:
- in the accessibility statement ("even our typeface is chosen for legibility")
- in funder materials (small, concrete proof of inclusive design thinking)
- in the brand guidelines as a *principle*, not just a font name

### Problems found
1. **Fragmentation / performance:** a homepage visit can pull Atkinson (self-hosted),
   Fraunces + Hanken (Google), Plus Jakarta Sans (Shopify CDN + Google), and two
   Material Symbols variants — up to 6 families from 3 origins. Each Google request is
   render-chain weight and an EU-privacy consideration.
2. **Duplicate icon fonts:** theme.liquid loads BOTH Material Symbols Outlined and
   Rounded. One should go (the theme also has a full inline-SVG icon set in
   `snippets/bbc-icons.liquid` — long-term, that's the answer).
3. **Split brand voice:** Fraunces/Hanken display type exists only on the homepage;
   every other 2026 page sets headings in Atkinson bold. Either promote the display
   pair into tokens sitewide, or retire it — currently it's an undocumented exception.
4. **Dawn chrome still Jakarta:** cart/account/checkout typography doesn't match the
   rd pages. (Note: Atkinson is NOT in Shopify's font library, so Dawn settings can't
   select it — only a CSS override can align this.)
5. **Ad-hoc type scale:** `rd-fs-18px`, `rd-fs-21px`, three clamp one-offs — sizes are
   utilities, not a documented scale.

### Recommendations (in order)
1. **Self-host Fraunces + Hanken subsets** (woff2, latin subset) alongside Atkinson and
   define tokens: `--rd-display` (Fraunces), `--rd-ui` (Hanken), `--rd-sans` (Atkinson).
   Kills 4 Google Fonts requests; makes the homepage's display voice an official token.
2. **Drop one Material Symbols variant** (audit which glyph style sections actually use),
   then migrate to `bbc-icons` inline SVG over time.
3. **Type scale tokens:** formalise `--rd-fs-1…6` (e.g. 14/16/18/21/clamp-28/clamp-40)
   and alias the existing utilities to them. No visual change, future consistency.
4. **Dawn alignment (staged):** a scoped override for footer/cart drawer body text to
   `var(--rd-sans)` — test in preview; checkout is Shopify-controlled and stays Jakarta.
5. **Tell the Atkinson story** on the accessibility page + impact report.

## What's already strong (verified in this audit)
- `:focus`/`focus-visible` — 17 rules in the redesign CSS ✓
- `prefers-reduced-motion` — 12 CSS rules + the count-up JS and hero video respect it ✓
- Colour tokens: forest `#003C32` (**canon 2026-07-02** — live `--forest`; legacy `#073e27` lingers only in retired pre-2026 CSS files) · teal `#3f8b66` · gold `#ffa900` · cream/bone `#f8f7f4` · lime `#d4fd62` · steel `#8da4c1` ✓
- Component vocabulary (the de-facto library): `rd-hero`, `rd-stats/rd-stat` (**rule: no stat without a `source` field**), `rd-card`+`rd-stamp`, `rd-steps`, `rd-facts`, `rd-faq`, `rd-csgrid/rd-cscard`, `rd-split`, `rd-pull`, `rd-logogrid/rd-logocell/rd-logoimg/rd-logotext`, `rd-sitenames`, `rd-btn` (lime/ghost/on-dark), `rd-pad/rd-pad-sm` + band backgrounds (`rd-dark/rd-paper/rd-steel`) ✓

## Unified centered-header rule (added 2026-07-06, James-flagged)
Every centered band (`.rd-center`, 21 sections) now shares ONE text axis:
- `.rd-center .rd-eyebrow` → `display:block`; its lime dash becomes a centered
  node-mark ABOVE the label (`::before { display:block; width:26px; margin:0 auto 10px }`)
- `.rd-center h1/h2/h3` and `.rd-center .rd-lede` → `margin-inline:auto`
  (global heading `max-width` used to leave the box left-anchored — the real
  cause of the "header zigzag": eyebrow truly centered at 881px, heading at 772px)
Verified: teambuilding "Build it, then give it away" + all impact/prisons centered
bands now measure 0-1px eyebrow↔heading offset.

## Component gaps worth adding next
| Component | Why |
|---|---|
| **Sourced-comparator stat** variant | "20% nationally (MoJ)" pattern now used on 4 pages — deserves a named class with muted styling for the national figure |
| **Geo/spec table** as CSS class | `.bbc-geo-table` styles live inline in bbc-product-2026 — promote to the stylesheet |
| **Download-asset card** | teacher pack / impact report PDF pattern (icon + title + size + button) |
| **Email-capture band** variant for gated downloads | teacher pack currently ungated; a capture-then-link band enables lead capture |
| **Timeline band** (2026-styled) | old theme had 4 timeline sections; the 2026 system has none |
| **Comparison table** (kit vs kit) | which-kit page uses cards; a true table variant would serve spec-heavy comparisons |
