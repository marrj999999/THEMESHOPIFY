# Homepage Audit — 2026-04-11

Audited: `https://bamboobicycleclub.org/`  
Theme: BBC Dawn (191768756598)  
HTML size: 219,828 chars

---

## Section Inventory (in order)

| # | Section key | Type | Background | Has images? |
|---|-------------|------|------------|-------------|
| 1 | bbc_hero_slider_cyeNUp | bbc-hero-slider | Forest green | Yes — video |
| 2 | press_logos | bbc-press-logos-v3 | White | Yes — SVG logos |
| 3 | options | bbc-options | White | No — icons only |
| 4 | why_bamboo | bbc-content | Cream | No — image_picker not set |
| 5 | story_impact | bbc-story | Cream | No — image_picker not set |
| 6 | journeys | bbc-journeys | Forest green | No — no images set in editor |
| 7 | press_recognition | bbc-press-recognition | White/cream | Yes — SVG logos |
| 8 | testimonials | bbc-homepage-testimonials | Cream | No — section is EMPTY (no blocks) |
| 9 | cta | bbc-cta | Forest green | No — text only |

---

## Critical Issues Found

### 1. Zero lifestyle/product photography
**Severity: HIGH**

The entire homepage has 10 images — all logos. Not a single photo of:
- A bamboo bicycle
- A workshop in action
- A finished build
- A builder's face
- Bamboo poles/material

Sections 3–8 are pure text. The bbc-story, bbc-journeys, and bbc-content sections all have `image_picker` schema fields — they just haven't been populated in the Shopify editor.

**Action required (editor, not code):**
- Story section: Add a workshop/founder photo via Shopify Customizer
- Journeys section: Add Kate Rawles expedition photo as featured image
- Why Bamboo section: Add material/bamboo close-up photo
- Options cards: Now have image_picker (added this audit) — add workshop + kit photos

### 2. Press section appears three times
**Severity: MEDIUM**

- **Section 1** (hero slider): Hardcoded text spans at bottom — was `<span>Financial Times</span>` etc.
- **Section 2** (press_logos): Full "As Featured In" with SVG logos
- **Section 7** (press_recognition): "Recognition / As Featured In" with quotes and award logos

Sections 2 and 7 are distinct (logos-only vs full context), but the hero press bar was purely redundant text.

### 3. Testimonials section is empty
**Severity: HIGH**

Section 8 (`bbc-homepage-testimonials`) is in the template order but renders nothing — no blocks have been added in the Shopify editor. The section heading "Real Stories" appears but has no testimonial cards below it.

**Action required (editor):** Add testimonial blocks in Shopify Customizer → Homepage → Real Stories section.

### 4. "4,000+" stat — 3 contextual instances
**Severity: LOW**

Appears 5 times total:
- Hero h1: "4,000+ people have built their own bamboo bicycle" ← intentional headline
- Story stats: "4,000+ Bikes Built" stat badge ← intentional stat
- CTA body: "Join 4,000+ people who've discovered..." ← intentional social proof
- Press recognition: "£24,000 for prison education work" ← unrelated (different number)
- CTA footer stat bar: "4,000+ Builders Worldwide" ← borderline redundant with CTA body

Not a major issue — the first three are contextually distinct. Worth simplifying the CTA to not repeat it twice in the same section.

### 5. Hero press bar was text-only
**Severity: MEDIUM** — Fixed in this audit

The hero slider's press bar used hardcoded `<span>` text instead of the actual SVG logo assets. The SVGs exist at `/assets/logo-ft.svg` etc. and are already used in sections 2 and 7.

---

## Duplicate Content

| Content | Occurrences | Assessment |
|---------|-------------|------------|
| "As Featured In" | 3 | Redundant — sections 2 and 7 both have it |
| "4,000+" | 5 | 3 distinct uses, 2 within same CTA section |
| Press logos (FT, Guardian etc.) | 3 | Hero bar + sections 2 + 7 |

---

## Hero Banner Assessment

**Score: 7/10 — Good structure, weak supporting content**

Strengths:
- Full-width video background (mp4 from Shopify CDN)
- Strong headline: "4,000+ people have built their own bamboo bicycle"
- Two clear CTAs: "Book a Workshop" (primary) + "Shop Kits" (secondary)
- Good overlay, decent viewport height (70vh mobile / 80vh desktop)
- Eyebrow "Since 2012" adds credibility

Weaknesses:
- Single slide only — the slider markup supports multiple but only one is configured
- Press bar had text instead of logo images (fixed)
- No visual stats/trust indicators beyond headline text
- No countdown or urgency element (workshops fill up — this could be used)

---

## Recommendations

### Immediate (editor changes, no code)
1. **Add photos** — Story section, Journeys section, Why Bamboo section all have image pickers. Populate them via Shopify Customizer.
2. **Add testimonial blocks** — The testimonials section is live but empty. Add 3 builder quotes with names/roles.
3. **Add option card images** — New `image_picker` field added to both option cards. Add workshop photo + kit photo.

### Consider (editor)
4. **Second hero slide** — Add a "social impact" slide showing Build to Bond prison programme. The slider markup supports it.
5. **Remove press_logos section** — It's redundant with press_recognition (section 7). Only keep one. Do this via Customizer (hide/remove section), not code.

### Code improvements (done this audit)
- [x] Hero press bar: replaced text spans with real SVG logo images (white, inverted)
- [x] Journeys section: placeholder now shows on live site (not just editor) — no broken empty layout when no image set
- [x] Options section: added `image_picker` to block schema — James can now upload card images

---

## Files Modified

| File | Change |
|------|--------|
| `sections/bbc-hero-slider.liquid` | Hero press bar: text → SVG images + CSS for `.bbc-hero-slider__press-logo` |
| `sections/bbc-journeys.liquid` | Removed `request.design_mode` guard on placeholder — shows on live too |
| `sections/bbc-options.liquid` | Added `image_picker` to block schema + CSS for `.bbc-options__image-wrap` |

All three uploaded to theme 191768756598 at time of audit. NO template JSON modified.
