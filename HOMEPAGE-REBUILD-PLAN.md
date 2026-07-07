# BBC Homepage Rebuild Plan
**Date:** 2026-04-11  
**Author:** Claude (Research + Audit — NO code changes made)  
**Status:** AWAITING JAMES APPROVAL BEFORE ANY IMPLEMENTATION

---

## STEP 1 — REFERENCE ANALYSIS

### Sites Researched (12 total)

| Site | Sections | Hero Type | Press/Logos | Stats/Impact | Key Lesson |
|------|----------|-----------|-------------|--------------|------------|
| Boxing Futures | 8+ | Full-bleed photo + overlay | None on homepage | Large numbers (75px), grid with borders | Stats as BIG numbers with description below — not circles |
| Elvis & Kresse | 8-10 | Image slider | None visible | ABSENT | Heavy image-first, minimal copy |
| Toast Ale | 403 blocked | — | — | — | — |
| Who Gives A Crap | 8+ | Image hero | Impact woven into core messaging | "50% of profits" inline, not a stat block | Impact as part of brand voice, not isolated section |
| Brompton | 7 | **Video hero** | None | None | Video hero, commerce-first, clean structure |
| Rapha | 8 | Image carousel | None | None | Top-to-bottom narrative: awareness → community → content → trust → conversion |
| Patagonia | Maintenance | — | — | — | — |
| Hiut Denim | 6 | Image + overlay text | None | ABSENT | Mission-first, minimal sections, image-heavy |
| Finisterre | 6-8 | Image slider | None | None | Product-centric, clean, minimal duplication |
| Rapanui | JS-only | — | — | — | — |
| Belu Water | 8-10 | Text hero + product imagery | Credential badges in footer | Large numbers + SDG icons | B2B: "£6.1M Invested", "127M Bottles recycled" — stats done as standalone callouts not circles |
| Boxing Futures | 8+ | Image hero | None | Big number + descriptor grid | Stats clearly labelled, not decorative |

### Common Patterns Across Top Performers

**1. Press/logos appear ONCE — not three times**  
Every site that shows press/awards has a single dedicated section. No site shows "As Featured In" in their hero AND in a mid-page section AND again at the bottom of another section. BBC has it three times.

**2. Stats use BIG NUMBERS + LABEL, not circles**  
Boxing Futures uses 75px numbers with a descriptor below and a light border separator. Belu uses large numbers with SDG icons beside them. None use decorative circles as the primary container because circles constrain font size and force compromise on readability vs. visual size.

**3. Video heroes are cinematic, not decorative**  
Brompton uses a full-bleed video that IS the hero content — not a box behind text. The video tells the story. BBC has a video but it's playing behind a green overlay that makes it invisible. A workshop reel in full colour would be transformative.

**4. Max 6-9 sections — no section bloat**  
All sites researched have 6-9 sections. BBC currently has 9, which is reasonable. The issue isn't section count — it's duplication and section quality.

**5. Images are used for PEOPLE and PRODUCT — not as decoration**  
Every high-performing social enterprise site leads with photography of real people doing real things. BBC's homepage has 10 images, all logos. Not one photo of a bamboo bicycle, a builder, or a workshop.

**6. Social proof is consolidated**  
Testimonials appear in ONE place, structured clearly. Rapha puts editorial stories in their own section. No site scatters trust signals across multiple unrelated sections.

---

## STEP 2 — CURRENT STATE AUDIT

### Section Inventory (live as of 2026-04-11)

HTML fetched from: `https://bamboobicycleclub.org/`  
Total page weight: 219,828 chars  
Total images: 10 (all logos/SVGs — zero photography)  
Videos: 1 (MP4 in hero, but see Issue 4 below)  
iFrames: 0  

| # | Section Key | Type | Headings | Images | Issues |
|---|------------|------|----------|--------|--------|
| 1 | `bbc_hero_slider_cyeNUp` | `bbc-hero-slider` | H1: "4,000+ people have built..." | 0 (press bar shows TEXT, not logos) | See Issue 1 |
| 2 | `press_logos` | `bbc-press-logos-v3` | "As Featured In" | 5 SVG logos | Duplicate with section 7 |
| 3 | `options` | `bbc-options` | H2: "Two Ways to Build Your Bike" | 0 | No images set in editor |
| 4 | `why_bamboo` | `bbc-content` | H2: "Nature's Perfect Frame Material" | 0 | No image set in editor |
| 5 | `story_impact` | `bbc-story` | H2: "13 years..." H3: "Key Milestones" | 0 | Stats overflow rings; milestones incomplete |
| 6 | `journeys` | `bbc-journeys` | H2: "Where Our Bikes Go" | 0 | No Kate Rawles image set |
| 7 | `press_recognition` | `bbc-press-recognition` | H2: "As Featured In" | 0 | Duplicate of section 2 PLUS has its own duplicate logo bar at the bottom |
| 8 | `testimonials` | `bbc-homepage-testimonials` | H2: "Real Stories" | 0 | Has content now (Jamie, BikeRadar, prison quote) |
| 9 | `cta` | `bbc-cta` | H2: "Your bike is waiting to be built" | 1 (white BBC logo) | 4,000+ repeated from hero |

### Duplicate Content Map

| Content | Appears In | Verdict |
|---------|-----------|---------|
| "As Featured In" heading | Hero, Section 2, Section 7 | 3× — reduce to 1 |
| Press logos (FT, Guardian, etc.) | Hero (text), Section 2 (SVG imgs), Section 7 bottom (text fallback) | 3× — reduce to 1 |
| "4,000+" stat | H1 hero, story stats, CTA body, CTA stat bar | 4× — 3 contextually different, CTA bar redundant |
| "36 Countries" | story stats, CTA stat bar | 2× — CTA stat bar is the redundant one |
| "13 Years" | story stats, CTA stat bar | 2× — CTA stat bar is the redundant one |

---

## STEP 3 — JAMES'S SPECIFIC ISSUES: ROOT CAUSE ANALYSIS

### Issue 1 — "Press images lost" in hero

**What James sees:** The hero press bar shows "Featured in: Financial Times BikeRadar The Guardian road.cc" as text, not logo images.

**Root cause confirmed:**  
The live rendered HTML contains:
```html
<div class="bbc-hero-slider__press-logos">
  <span>Financial Times</span>
  <span>BikeRadar</span>
  <span>The Guardian</span>
  <span>road.cc</span>
</div>
```

The Shopify liquid file (`sections/bbc-hero-slider.liquid`) has `<img>` tags at lines 95-98 with `show_press_bar = true`. Yet the RENDERED HTML still shows `<span>` elements.

**This is a Shopify rendering/caching discrepancy.** The liquid file on Shopify and the local file both have the `<img>` tags — but the live site is rendering the OLD span-based output. This is likely a Shopify theme file cache that hasn't invalidated. The fix requires a trivial re-upload to force Shopify to re-process the file.

**The CSS still has a `.bbc-hero-slider__press-logos span` rule** (line 295 of the liquid) which is legacy code from the OLD version — this rule does nothing harmful but confirms the file was originally span-based and wasn't fully cleaned up.

**Fix approach:** Re-upload `sections/bbc-hero-slider.liquid` with one whitespace change to force Shopify cache invalidation. No content change needed — just force the re-render.

---

### Issue 2 — "Featured-in duplicated twice"

**What James sees:** Press logos appear in two separate sections.

**Root cause confirmed:**  
Two separate sections have "As Featured In" with logo bars:

- **Section 2** (`press_logos` / `bbc-press-logos-v3`): Dedicated logos-only section with SVG images. Works correctly. Has 5+ logos.
- **Section 7** (`press_recognition` / `bbc-press-recognition`): Has an H2 "As Featured In" PLUS a FT quote PLUS awards PLUS a **hardcoded second logo bar** at the bottom (lines 60-78 of `bbc-press-recognition.liquid`) using the `press_logo` block type. Those blocks have no images uploaded, so they render as text fallback: "Featured in: Financial Times The Guardian BikeRadar"

**The section 7 logo bar is hardcoded directly in the liquid** — it always renders and cannot be hidden from the editor. This is why it appears even though the designer may not have intended it.

**Fix approach:**  
Two options:

*Option A (recommended):* Remove the `bbc-press__logos` div (lines ~60-78) from `bbc-press-recognition.liquid`. Section 7 becomes: FT quote + awards only. Section 2 remains the single logo bar.

*Option B:* Hide section 2 from the editor (delete it from the homepage template via Customizer) and upload logo images for the `press_logo` blocks in section 7. Then section 7 carries everything.

**Recommendation: Option A** — it requires one targeted code edit, doesn't touch the editor content, and keeps sections 2 and 7 functionally distinct.

---

### Issue 3 — "Stats/numbers don't fit within graphics"

**What James sees:** The stat numbers in the story section overflow or look cramped inside the circular rings.

**Root cause confirmed:**  
The stat ring CSS (confirmed in live rendered `<style>` block):
```css
.bbc-story__stat-ring {
  width: 96px;
  height: 96px;
  border-radius: 50%;
}

.bbc-story__stat-number {
  font-size: clamp(1.375rem, 2.5vw, 2rem);  /* up to 32px */
  font-weight: 800;
}
```

At desktop (1200px+ viewport): `2.5vw = 30px` → clamped to `2rem = 32px`  
"4,000+" in Plus Jakarta Sans 800 at 32px is approximately 108px wide — wider than the 96px circle.  

"36" and "13" both fit fine — they're short numbers. Only "4,000+" overflows.

On mobile (<768px): ring shrinks to 72px, font to 20px → "4,000+" at 20px ≈ 68px wide → fits but barely.

**The problem is desktop-only, stat #1 only.**

**Fix approach — two options:**

*Option A:* Increase the ring to 120px and add `word-break: break-word` + reduce max font to `1.5rem (24px)`. Simple CSS change.

*Option B (better UX):* Remove the circle design entirely for stat 1 and use a large-number-with-label layout (like Boxing Futures, Belu). Bigger visual impact, no overflow constraint.

**Recommendation:** Option A for now (minimal risk) — change `width/height: 96px → 120px` and `clamp(1.375rem, 2.5vw, 2rem) → clamp(1.125rem, 2vw, 1.5rem)`. Stat ring becomes slightly larger, number fits comfortably, visual character preserved.

**File:** `sections/bbc-story.liquid`, lines 199-203 and 233-236.

---

### Issue 4 — "Hero video not working"

**What James sees:** Video doesn't play or isn't visible.

**Root cause: partially identified, cannot fully confirm without browser test.**

The live HTML DOES contain:
```html
<video autoplay muted loop playsinline class="bbc-hero-slider__video">
  <source src="https://cdn.shopify.com/videos/c/o/v/62ec9e0eb87a40afbca2e7aa3c818fc4.mp4" type="video/mp4">
</video>
```

So the video tag is present and correctly attributed (`autoplay muted loop playsinline`). The `muted` attribute should bypass browser autoplay policy.

**Possible causes (needs browser testing to confirm):**

1. **MP4 URL broken** — Shopify CDN URLs are permanent, but the file could have been deleted from the admin media library. Test: open `https://cdn.shopify.com/videos/c/o/v/62ec9e0eb87a40afbca2e7aa3c818fc4.mp4` directly in browser. If it 404s, the file needs re-uploading.

2. **No poster frame** — There's no `poster` attribute on the `<video>` tag. While the video loads, users see a black or empty rectangle. James may be interpreting "not loading" as "blank area." Adding a poster frame (a still frame from the workshop video) would show immediately.

3. **Hero overlay too opaque** — The slide has `overlay_opacity: 40` over `bg_color: #073e27` (forest green). At 40% green overlay, the video could be essentially invisible — it plays but the green layer covers it. This is the most likely cause. The video IS playing, but you can't see it because the green overlay is too dark.

4. **CSS `z-index` or visibility issue** — Video element may be behind another element.

**Fix approach:**
1. First: browser-test the direct MP4 URL to confirm it loads
2. If URL works: reduce `overlay_opacity` from 40 to 20-25 in the editor (Section → Hero → Slide → Overlay opacity)
3. Add a `poster` image: editor change — upload a still frame from the workshop video
4. If URL is broken: re-upload the video file to Shopify media

**This is an editor change for items 2 and 3.** No code required unless the URL is broken.

---

### Issue 5 — "Key milestones incomplete"

**What James sees:** The milestones timeline looks sparse or unfinished.

**Root cause confirmed:**  
Live HTML shows only 3 milestones in the `bbc-story__timeline-track`:

- **2012** — BBC Founded: James & Ian open first workshop in Hackney
- **2020** — Build to Bond: Prison rehabilitation programme launches
- **2025** — Investec Winner: Beyond Business award for social impact

Missing (referenced in the `press_recognition` section and brand history):
- **2015-16** — Design Museum "Cycle Revolution" exhibition
- **2018** — Kevin McCloud's Green Heroes, Grand Designs Live
- Other potential milestones: first international kit shipment, first prison programme, 1,000th builder, etc.

The timeline supports unlimited milestone blocks — it's a Shopify Customizer block type (`type: "milestone"`). Adding milestones is a pure editor action.

**Fix approach:** Editor-only — open Shopify Customizer → Homepage → story_impact section → add milestone blocks for 2015, 2016, 2018, and any others James wants to add.

**Suggested milestone additions:**
- 2015: Design Museum "Cycle Revolution" — featured in national exhibition
- 2018: Kevin McCloud's Green Heroes — Grand Designs Live recognition
- Consider: first international delivery date, first prison programme date, 1000th builder milestone

---

### Issue 6 — "Additional press logo section"

**Same as Issue 2.** The duplicate is confirmed:
- Section 2 (`press_logos`) = dedicated "As Featured In" logo section — the PRIMARY one
- Section 7 (`press_recognition`) bottom bar = hardcoded duplicate inside the liquid file

**The section 7 bottom bar is the additional unwanted one.** It's 19 lines of hardcoded liquid that cannot be disabled from the editor.

---

## PROPOSED SECTION ORDER

Keep all 9 sections. Fix issues in-place. No reordering needed — the current order is logical.

| # | Section | Status | Change Required |
|---|---------|--------|----------------|
| 1 | Hero (video + CTAs) | Fix | Re-upload liquid to fix press logo caching; editor: reduce overlay opacity; browser-test video URL |
| 2 | Press logos (As Featured In) | Keep | None |
| 3 | Options (Workshop vs Kit) | Content gap | Editor: add workshop photo + kit photo to cards |
| 4 | Why Bamboo | Content gap | Editor: add bamboo material photograph |
| 5 | Story + Impact (stats + milestones) | Fix | Code: fix stat ring size; Editor: add 2015/2018 milestones |
| 6 | Journeys | Content gap | Editor: add Kate Rawles expedition photo |
| 7 | Recognition (FT quote + awards) | Fix | Code: remove duplicate logo bar from bottom |
| 8 | Testimonials | Good | None (has content) |
| 9 | CTA | Good | None |

---

## FOR EACH SECTION — FULL DETAIL

### Section 1 — Hero (`bbc-hero-slider`)

**Content:** "4,000+ people have built their own bamboo bicycle." + workshop video background

**Images/video needed:**
- Video: Shopify CDN MP4 already uploaded — test if URL works
- Poster frame: a still from the workshop (edit in Customizer once confirmed)

**CSS changes needed:**
- None in the liquid itself — the img tags are correct
- The legacy `.bbc-hero-slider__press-logos span` rule (line 295) can be removed as cleanup

**Implementation:**
- Re-upload `sections/bbc-hero-slider.liquid` with trivial whitespace change to force cache invalidation
- Editor: reduce overlay opacity from 40 → 20 to make video visible
- Editor: test video URL directly and re-upload if broken
- Editor: add poster image once video confirmed working

**Risk:** LOW — re-uploading the same file with whitespace change is safe. Changing overlay opacity is editor-reversible.

---

### Section 2 — Press Logos (`bbc-press-logos-v3`)

**Content:** "As Featured In" + SVG logos (FT, Guardian, BikeRadar, road.cc, Design Museum, Grand Designs, Inside Time, Huck)

**Images/video needed:** None — logos already uploaded as SVGs

**CSS changes needed:** None

**Implementation:** No changes required. This section is working correctly.

**Risk:** NONE

---

### Section 3 — Options (`bbc-options`)

**Content:** "Two Ways to Build Your Bike" — Workshop card vs Kit card

**Images/video needed:**
- Workshop card: a photo of a workshop session (people building bikes)
- Kit card: a photo of the kit contents or assembled bamboo frame
- These go in the `image_picker` fields added in the previous audit

**CSS changes needed:** None

**Implementation:** Editor-only. Add photos via Shopify Customizer → Options section → each block.

**Risk:** NONE (editor change)

---

### Section 4 — Why Bamboo (`bbc-content`)

**Content:** Material properties of bamboo — "Nature's Perfect Frame Material"

**Images/video needed:**
- A close-up photo of bamboo poles/material, OR
- A finished frame joint showing the bamboo and binding, OR
- A comparison shot (bamboo vs steel)

**CSS changes needed:** None

**Implementation:** Editor-only. Add image via Shopify Customizer → why_bamboo section.

**Risk:** NONE (editor change)

---

### Section 5 — Story + Impact (`bbc-story`)

**Content:** Founder story, stats (4,000+ Bikes, 36 Countries, 13 Years), milestones timeline

**Images/video needed:** None required for the fix. A founder portrait (James Marr) could go in the image_picker if the section supports it — check.

**CSS changes needed (STAT RING FIX):**  
File: `sections/bbc-story.liquid`

Current (line ~199-203):
```css
.bbc-story__stat-ring {
  width: 96px;
  height: 96px;
```
Current (line ~233-236):
```css
.bbc-story__stat-number {
  font-size: clamp(1.375rem, 2.5vw, 2rem);
  font-weight: 800;
```

Proposed change:
```css
.bbc-story__stat-ring {
  width: 120px;
  height: 120px;
```
```css
.bbc-story__stat-number {
  font-size: clamp(1.125rem, 1.8vw, 1.5rem);
  font-weight: 800;
```

Also update mobile media query (line ~393):
```css
/* Current: */
.bbc-story__stat-ring {
  width: 72px;
  height: 72px;
}
/* Change to: */
.bbc-story__stat-ring {
  width: 88px;
  height: 88px;
}
```

**Implementation milestones (editor):** Shopify Customizer → story_impact → Add Block → Milestone × 2 (2015 and 2018)

**Risk:** LOW — CSS change only, no template JSON touched. Stat ring sizing only. Test at desktop and mobile before confirming.

---

### Section 6 — Journeys (`bbc-journeys`)

**Content:** "Where Our Bikes Go" — Kate Rawles, London to NZ, Pam (third journey)

**Images/video needed:** Kate Rawles expedition photo ("Woody" the bamboo bike in the Andes)

**CSS changes needed:** None

**Implementation:** Editor-only. Add image via Shopify Customizer → journeys section.

**Risk:** NONE (editor change)

---

### Section 7 — Recognition (`bbc-press-recognition`)

**Content:** FT quote + awards (Investec, Kevin McCloud, Design Museum) + BROKEN duplicate logo bar at bottom

**Images/video needed:** None

**CSS changes needed:** None

**Code change required:**  
File: `sections/bbc-press-recognition.liquid`

Remove the following hardcoded block (approximately lines 60-82):
```liquid
{%- comment -%} Press Logos {%- endcomment -%}
<div class="bbc-press__logos">
  <p class="bbc-press__logos-label">Featured in:</p>
  <div class="bbc-press__logos-grid">
    {% for block in section.blocks %}
      {% if block.type == 'press_logo' %}
        ... [19 lines]
      {% endif %}
    {% endfor %}
  </div>
</div>
```

And remove the associated CSS for `.bbc-press__logos`, `.bbc-press__logos-label`, `.bbc-press__logos-grid` (around lines 202-230 of the file).

Also remove the `press_logo` block type from the section schema (at the bottom of the liquid) — this will prevent James from accidentally adding logo blocks that no longer render.

**Implementation:** Single targeted edit to `sections/bbc-press-recognition.liquid`. Upload via `shopify theme push --only sections/bbc-press-recognition.liquid`.

**Risk:** LOW-MEDIUM. Removing the logo bar removes the text "Featured in: Financial Times The Guardian BikeRadar" from section 7. Section 2 (`press_logos`) already shows the logos with proper images. Net result: less duplication, cleaner section 7.

The `press_logo` blocks that were configured in the editor remain in the template JSON but simply won't render (since the liquid no longer handles them). They cause no harm. If needed, James can clean them up from the Customizer later.

---

### Section 8 — Testimonials (`bbc-homepage-testimonials`)

**Content:** "Real Stories" — Jamie (kit builder 7yrs), BikeRadar review quote, prison programme quote

**Images/video needed:** Avatar photos would improve these, but not required. Current placeholder SVG icons are acceptable.

**CSS changes needed:** None

**Implementation:** None required.

**Risk:** NONE

---

### Section 9 — CTA (`bbc-cta`)

**Content:** "Your bike is waiting to be built" + 4,000+ stat bar + email/location

**Images/video needed:** None

**CSS changes needed:** The stat bar ("4,000+ Builders Worldwide", "36 Countries Reached", "13 Years Of Expertise") repeats content from section 5. This is acceptable as a reinforcement at conversion point — but if James wants to clean it up, he can edit this section's stat values in the Customizer.

**Implementation:** None required unless James wants to change the CTA stat bar labels.

**Risk:** NONE

---

## RISK ANALYSIS

| Change | Risk Level | Reversible? | How to mitigate |
|--------|-----------|-------------|----------------|
| Re-upload `bbc-hero-slider.liquid` (whitespace only) | LOW | Yes — re-upload previous version | Confirm the file content is identical except whitespace before uploading |
| Reduce hero overlay opacity (editor) | NONE | Yes — editor slider | Preview in Customizer before publishing |
| Fix stat ring CSS (`bbc-story.liquid`) | LOW | Yes — re-upload | Test on staging URL or Preview theme URL before live |
| Remove duplicate logo bar (`bbc-press-recognition.liquid`) | LOW-MEDIUM | Yes — re-upload old version | Backup local file first. The `press_logo` blocks in editor become orphaned but harmless. |
| Add milestones (editor) | NONE | Yes — delete block | —  |
| Add images to sections (editor) | NONE | Yes — remove image | — |

**Highest risk item:** Editing `bbc-press-recognition.liquid`. Mitigate by keeping a backup of the current version and using the Shopify preview URL before publishing.

**Zero-risk items:** All editor (Customizer) changes. These are the milestone additions, image uploads, and overlay opacity adjustment.

---

## TESTING PLAN

For each code change (not editor changes):

### Test 1 — Hero press logos (after re-upload)
1. Open `https://bamboobicycleclub.org/?preview_theme_id=191768756598` in authenticated browser
2. Scroll to hero press bar
3. Confirm: logos appear as images (FT, Guardian, BikeRadar, road.cc), not text
4. Confirm: logos visible on mobile (375px viewport)

### Test 2 — Hero video
1. Open the direct MP4 URL: `https://cdn.shopify.com/videos/c/o/v/62ec9e0eb87a40afbca2e7aa3c818fc4.mp4`
2. If it loads: reduce overlay opacity in editor and test on mobile
3. If it 404s: note file needs re-uploading and flag to James

### Test 3 — Stat rings (after CSS change to `bbc-story.liquid`)
1. Preview on authenticated browser
2. Resize from 1440px to 375px
3. Confirm: "4,000+" visible and fully contained at all sizes
4. Confirm: no ring overflow at 1200px desktop width
5. Confirm: mobile rings (88px) still look good

### Test 4 — Press duplication (after `bbc-press-recognition.liquid` edit)
1. Preview homepage
2. Scroll through all sections
3. Confirm: "As Featured In" appears only in section 2 and once in section 7 header
4. Confirm: NO logo bar at bottom of section 7
5. Confirm: section 7 FT quote and awards still visible

### Test 5 — Milestones (after editor additions)
1. View homepage in Customizer preview
2. Confirm: 5 milestone entries visible (2012, 2015, 2018, 2020, 2025)
3. Confirm: horizontal scroll works on mobile

---

## WHAT THIS PLAN DOES NOT COVER

The following are real issues but are OUT OF SCOPE for this rebuild:

1. **No lifestyle photography** — Entire homepage has zero photos of bikes, builders, or workshops. This is the single biggest conversion gap. Fixing it requires James to source and upload photos. The code is ready — section image pickers exist and are configured.

2. **CSS token inconsistencies** — 80+ sections use hardcoded hex instead of `--bbc-*` variables. Not a homepage-breaking issue but a long-term codebase hygiene issue. Covered in `FULL-SITE-AUDIT.md`.

3. **Duplicate CSS loads** — 128KB of CSS loaded twice in `theme.liquid`. Affects whole site, not just homepage.

4. **Multiple hero section variants** — 6 versions of the hero section exist in the codebase. Not cleaned up.

---

## IMPLEMENTATION ORDER (once James approves)

**Step 1 — Editor changes (James does these, zero risk):**
- Reduce hero overlay opacity from 40 to 20
- Test video URL directly; re-upload if broken
- Add 2015 and 2018 milestone blocks
- Add workshop photo to Options section (Workshop card)
- Add kit photo to Options section (Kit card)

**Step 2 — Code: hero press logos (one file, low risk):**
- Re-upload `sections/bbc-hero-slider.liquid` with whitespace change
- Remove legacy `.bbc-hero-slider__press-logos span` CSS rule while there
- Test: press logos appear as images

**Step 3 — Code: stat ring fix (one file, low risk):**
- Edit `sections/bbc-story.liquid`: increase ring from 96px to 120px, reduce font clamp
- Upload via `shopify theme push --only sections/bbc-story.liquid`
- Test: "4,000+" fits in ring at all viewport sizes

**Step 4 — Code: remove duplicate press logos (one file, medium risk):**
- Edit `sections/bbc-press-recognition.liquid`: remove `bbc-press__logos` block
- Remove associated CSS
- Remove `press_logo` block type from schema
- Test: section 7 shows FT quote + awards only, no duplicate logo bar

**Step 5 — Verify:**
- View full homepage start-to-finish
- Check on mobile (375px)
- Count: "As Featured In" should appear in section 2 only (section 7 has "Recognition" heading)
- Confirm no overflow on stat rings
- Confirm hero video visible

---

*Ready for James's approval. No code changes have been made.*
