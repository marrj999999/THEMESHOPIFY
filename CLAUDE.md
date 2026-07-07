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
**Dead theme IDs (no longer exist on the store, 7 Jul 2026):** `196398383478` (previous live) · `191768756598` (pre-redesign) · `195991470454` (old sandbox). If any doc mentions them, it is stale.
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
- 4 active prison sites (2026-07): HMP Lowdham Grange · HMP Foston Hall · HMP Lindholme · HMYOI Feltham (never "three prisons"/"rolling out")
- Mission (LOCKED 2026-07-06, verbatim): "We use bamboo bike-building to give practical skills and a way forward to people locked out of education — in schools before exclusion, and in prisons after." Tagline: "Build bikes. Build skills. Build futures."
- 36+ countries
- Since 2012
- 90%+ prison-course completion · OCN-accredited (prisons: "OCN Level 2 — Sustainable Design & Manufacturing"; schools: "OCN Level 1 Award — Practical Manufacturing Skills"; NEVER "Level 1 & 2" mushed)

**⛔ BANNED — never use in any copy or defaults:** "28,000 PSI" / "stronger than steel" (false — tested tensile ≈ 84 MPa; say "comparable to mild steel, tested to BS ISO 22157 at Swansea University") · "56.7% lower carbon than aluminium" (no named LCA — greenwashing risk; use qualitative "grown not mined, regrows in 3–5 years") · "£11.41 SROI" (no traceable study) · "£280 per learner" (confidential contract pricing) · "100% completion" (use 90%+). Run `scripts/claim-lint.sh` before every push.

---

## Current Issues / TODO

1. Parts template missing: `product.parts.json` doesn't exist, falls back to Dawn default
2. Parts pages have emoji issues: "🔧 Compatibility" needs Material Symbols
3. Some hardcoded grays (#333, #999) in header dropdowns need CSS variables

---

## Related Files

- Brand guidelines: `bamboo-bicycle-brand` skill (~/.claude/skills/bamboo-bicycle-brand/) — the old ~/Desktop/BBC_Master_Guidelines.pdf no longer exists
- Workspace docs: `~/.openclaw/workspace/bbc/`
  - `SHOPIFY_THEME_AUDIT.md`
  - `KIT_PRODUCT_STRATEGY.md`
  - `WEBSITE_CONTENT_IMPROVEMENTS.md`
