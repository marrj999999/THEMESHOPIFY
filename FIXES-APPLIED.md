# BBC Theme Fixes — Applied 2026-04-11

## P0-1: Blog Dates Fixed

**Problem:** 29 articles in the NEWS blog had `published_at: 2026-03-06` (the bulk-import date), making all posts appear to share the same date.

**Fix:** Updated `published_at` via Admin API for all 29 articles. Used year from each article's tags (e.g. `tags: 2012, guardian`) to set `July 1 of that year` as the corrected date.

**Examples:**
- The Guardian (2012) → 2012-07-01
- Cycling Electric (2023) → 2023-07-01
- Financial Times (2025) → 2025-07-01

**Result:** All 29 articles updated via API — 29/29 OK.

---

## P0-2: Collections Page Title

**Finding:** No code bug found. The `templates/list-collections.json` has `"title": "Collections"` which renders correctly via `section.settings.title` in `main-list-collections.liquid`. The locale schema correctly defines the default as "Collections". The page title in browser tab comes from Shopify's `page_title` variable (auto-set to "All collections").

**Recommendation:** If you want to change the heading to something more BBC-branded (e.g. "Shop BBC Kits"), update it via the Shopify editor at `/collections`.

---

## P0-3: /products/road-bike-kit — 404 Fixed

**Problem:** URL `/products/road-bike-kit` returned 404. No product with that handle exists.

**Fix:** Created Shopify URL redirect:
- `/products/road-bike-kit` → `/products/bamboo-bike-road-kit` (Road Frame Build Kit, active)

**Redirect ID:** 1698561884534

---

## P1-1: Stat Inconsistency — 4,000+ → 1,533

**Problem:** Homepage showed "4,000+" in 5 places; impact page shows "1,533".

**Pre-fix blocker:** `templates/index.json` had 3 blocks with type "pill" (`pill1`, `pill2`, `pill3`) that weren't defined in the `bbc-hero-unified.liquid` schema — causing API validation to reject pushes. Also the section name "Hero Section — BBC Rebuild" exceeded Shopify's 25-char name limit.

**Fixes applied:**
1. Added `pill` block type to `bbc-hero-unified.liquid` schema
2. Shortened section name to "BBC Hero Rebuilt" (18 chars)
3. Updated stat block default from `4,000+` to `1,533+`
4. Pushed updated `bbc-hero-unified.liquid`
5. Replaced all 5 homepage stat occurrences in `templates/index.json`:
   - `"number": "4,000+"` → `"1,533+"` (×2 — hero section + story_impact section)
   - `"trust_2_text": "4,000+ People Trained"` → `"1,533+ People Trained"`
   - `"heading": "4,000 people have built..."` → `"1,533 people have built..."`
   - `"text": "Join 4,000+ people..."` → `"Join 1,533+ people..."`
   - `£24,000` (monetary value) — left unchanged

---

## P1-2: Off-Brand Fonts Fixed

**Problem:** 6 sections used `Georgia, serif` or `Georgia, 'Times New Roman', serif`.

**Fix:** Replaced with `var(--font-body-family)` in:
- `bbc-awards.liquid` — line 208
- `bbc-endorsements.liquid` — line 114
- `bbc-participant-story.liquid` — line 133
- `bbc-press-wall.liquid` — line 147
- `bbc-testimonial-quote.liquid` — line 64
- `bbc-testimonials.liquid` — line 210

**All 6 files pushed to Shopify — 6/6 OK.**

---

## P1-3: CSS Variable Second Pass

**New variables added to `bbc-foundation.css`:**

| Variable | Value | Note |
|----------|-------|------|
| `--bbc-forest-light` | `#e8f0eb` | New |
| `--bbc-teal-light` | `#d0e4d8` | New |
| `--bbc-gold-light` | `#fff4d6` | Updated (was `#ffbd3d`) |
| `--bbc-forest-dark` | `#052e1d` | Updated (was `#052a1a`) |

**Second replacement pass:**
- Matched hex values: `#e8f0eb`, `#d0e4d8`, `#fff4d6`, `#052e1d`, `#052a1a`, `#073e27`, `#3f8b66`, `#ffa900`, `#f8f7f4`, `#f8fafc`
- **187 replacements across 48 files**
- Top files: `bbc-distinctive.css` (32), `bbc-unified-styles.css` (24), `bbc-mobile-menu.css` (16), `bbc-buttons.css` (15)
- Schema color `default` values reverted to hex (Shopify requires hex, not CSS vars, for schema defaults)
- **All 128 CSS/section files pushed — 128/128 OK**

---

## Summary

| # | Issue | Status |
|---|-------|--------|
| P0-1 | Blog dates showing March 6 2026 | Fixed — 29 articles updated |
| P0-2 | Collections page title | No bug found — title renders correctly |
| P0-3 | 404 on /products/road-bike-kit | Fixed — redirect created |
| P1-1 | Stat inconsistency (4,000+ vs 1,533) | Fixed — 5 homepage occurrences updated |
| P1-2 | Off-brand fonts (Georgia/Times New Roman) | Fixed — 6 sections corrected |
| P1-3 | CSS variable second pass | Fixed — 187 replacements, 4 new vars added |

---

## Homepage Rebuild Fixes — 2026-04-11

### FIX 1 — Duplicate press logo bar removed (`bbc-press-recognition.liquid`)
**Status: PASS**

Removed the hardcoded `bbc-press__logos` div that was always rendering "Featured in: Financial Times The Guardian BikeRadar" regardless of editor settings — this was duplicating Section 2 (`press_logos`).

Removed:
- The `<div class="bbc-press__logos">` block and all contents (was lines 60-79)
- Associated CSS: `.bbc-press__logos*` rule set
- `press_logo` block type from schema + presets

Section 7 now shows: FT quote + awards grid only. Section 2 remains the sole "As Featured In" bar.

### FIX 2 — Stat ring overflow fixed (`bbc-story.liquid`)
**Status: PASS**

| Property | Before | After |
|----------|--------|-------|
| Ring width/height | 96px | 120px |
| Font size | `clamp(1.375rem, 2.5vw, 2rem)` | `clamp(1.125rem, 1.8vw, 1.5rem)` |
| Mobile ring | 72px | 88px |

"4,000+" at max 24px font in a 120px ring now fits comfortably.

### FIX 3 — Hero press logos cache invalidated (`bbc-hero-slider.liquid`)
**Status: PASS**

Re-uploaded with legacy `.bbc-hero-slider__press-logos span` CSS rule removed (dead code from old span-based version). The `<img>` tags for press logos were already correct in the liquid source — re-upload forces Shopify to re-render with the correct markup.

### FIX 4 — Hero overlay opacity defaults reduced (`bbc-hero-slider.liquid`)
**Status: PARTIAL**

Changed code defaults from 40 to 20:
- Liquid fallback: `| default: 40` → `| default: 20`
- Schema `"default": 40` → `"default": 20`

**Action still needed by James:** Open Shopify Customizer → Homepage → Hero → each slide → set Overlay Opacity slider to 20. (Existing saved values of 40 in the editor won't be overridden by code defaults.)
