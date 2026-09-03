# BBC Block System — audit & site rollout plan
*2026-07-07 · draft theme CUSTOMTHEME20262 (196820238710) · source of truth for the big-text standard*

## 1. The standard (what we have, deployed)

All in `assets/bbc-statement.css` (one sheet, loaded by any section that uses it):

| Primitive | Class | Use for |
|---|---|---|
| **Statement** | `.bbcst-*` (section `bbc-statement`) | Page openers/closers, mission beats. Eyebrow → giant headline (+ `*` footnote marker) → optional image (below / full-bleed bg) → body → footnote → primary/secondary buttons → next-level links. |
| **Pillar** | `.bbcpl-*` (section `bbc-pillar`) | 50/50 image+text editorial beat: numbered kicker, big headline, 1–2-line body, one quote (rider or peer-reviewed), one CTA. Reversible. |
| **Homepage overrides** | `.bbc-rd-home` scope | Retrofits the `bbc-home-2026` monolith to the standard without touching its code. |

**Type & layout rules (the maths):**
- **Headline carries the message.** Lowercase, left, tight leading (.96–.98). Scales: statement `clamp(3rem,10.5vw,10.5rem)`, pillar `clamp(3rem,7.2vw,7rem)`, section-level `clamp(2.6rem,5.8vw,5.6rem)`. Mobile: each has a `!important` clamp — required, see gotcha below.
- **Body is a caption, not an essay.** 18px, max-width ~52ch, budget ≤ 2 lines (~20 words). Anything longer: demote to footnote (14px, after the `*` marker) or a next-level link (stories / case studies / research).
- **Images, three placements only:** below the headline (statement), 50/50 split (pillar), full-bleed background + scrim (statement `has-bg`). Never wrap text around images.
- **Button hierarchy:** primary = filled pill (forest on light / lime on dark) → secondary = outline pill → tertiary = underlined link with `→`. Max one primary per beat.
- **Eyebrows/kickers:** lowercase, 13–14px, letter-spaced, with rule/number (pillar).
- **Backgrounds (all AAA):** paper `#E6DCC8` · forest `#003C32` · lime `#D4FD62` · steel `#DEE6F0`. Accent = forest-on-light, lime-on-dark. No gold on lime.

**⚠ Gotchas (hard-won):**
- `bbc-mobile-fixes.css` caps ALL h1/h2 with `!important` under 750px. Any display heading needs its own `!important` mobile clamp (higher specificity wins between two `!important`s).
- Generated `rd-cmp-*` wrappers centre with `margin:0 auto !important` — pin left with `!important`.
- `.bbc-rd h2` (0,1,1) beats single-class heads — always write `.bbc-rd .your-head`.
- Lowercase via `text-transform` is only safe when headings contain **no proper nouns** — audit first.
- Large theme files (>10KB): push via `stagedUploadsCreate` + curl + URL-body upsert, verify `checksumMd5`. Never inline big bodies.

## 2. What's actually in use (template → section audit)

Only ~30 of the ~160 `bbc-*` sections are referenced by active templates. **Everything else is dead weight — do not restyle, candidates to archive.**

### Tier 1 — already on the standard (done)
| Where | Sections | Status |
|---|---|---|
| /pages/why-bamboo | `bbc-hero-band`, `bbc-stat-band`, 3× `bbc-pillar`, `bbc-statement`, `bbc-section` (+theme blocks), `bbc-logo-wall`, `bbc-comparison`, `bbc-faq-section` | ✅ native standard |
| Homepage | `bbc-home-2026` + `bbc-statement` | ✅ video hero first, CSS-rollout overrides, body copy trimmed |

### Tier 2 — 2026 monoliths: retrofit with the homepage pattern (next)
One scoped override block each in `bbc-statement.css` (`.bbc-rd-<page>` or section wrapper class). **Audit headings for proper nouns before lowercasing.** Load the sheet by adding one `stylesheet_tag` line, or drop a `bbc-statement` beat into the template (auto-loads it).

| Page | Section | Solution |
|---|---|---|
| /pages/impact | `bbc-impact-2026` | Retrofit CSS; the `.rd-arms`/`.rd-policy` infographics keep their layout, headings go big/lowercase/left. Add a closing `bbc-statement` (forest) as funder CTA. |
| /pages/workshop | `bbc-workshops-2026` | Retrofit CSS; booking cards keep card type. Statement opener candidate. |
| /pages/schools + education | `bbc-education-2026` | Retrofit CSS. ⚠ headings contain "OCN Level 1" — exclude those nodes from lowercase. |
| /pages/prisons | `bbc-commissioners-2026` | Retrofit CSS. ⚠ HMP/HMPPS/MoJ names must NOT lowercase — target selectors per-beat, not blanket. |
| /pages/our-story-2 | `bbc-about-2026` | Retrofit CSS; timeline keeps its scale. |
| /pages/build-to-bond | `bbc-build-to-bond-2026` | Retrofit CSS. |
| /pages/bicycleteambuilding + landing | `bbc-teambuilding-2026` | Retrofit CSS. |
| /pages/support-mission | `bbc-support-mission-2026` | Retrofit CSS + statement closer. |
| /pages/impact-report | `bbc-impact-report-2026` | Retrofit CSS (report keeps denser type for data). |
| /pages/theory-of-change | `bbc-toc-2026` | Retrofit CSS. |
| /pages/amersfoort-workshop | `bbc-amersfoort-2026` | Retrofit CSS. |
| /pages/media-page | `bbc-press-archive-2026` | Retrofit CSS; press names stay proper-case. |
| /pages/gallery | `bbc-page-2026` + `bbc-share-build-2026` + `bbc-gallery-grid-2026` | Retrofit CSS (light). |
| /pages/which-kit | `bbc-kit-picker-2026` | Retrofit CSS; picker cards follow card rules. |

### Tier 3 — commerce & utility: type + buttons only, keep function
`bbc-product-2026` (10 kit templates), `bbc-product-simple-2026`, `bbc-parts`, `bbc-collection-2026`, `bbc-collections-list-2026`, `bbc-cart-2026`, `bbc-account-2026` (7 customer templates), `bbc-search-2026`, `bbc-404-2026`, `bbc-contact-2026`, `bbc-blog-2026`, `bbc-article-2026`, `related-products`.
**Solution:** adopt the button hierarchy + eyebrow style + 18px body; do NOT blow up headings (product names are proper nouns; conversion pages need density). One shared override block: buttons/links only.

### Tier 4 — legacy page.about.json (superseded)
`bbc-page-hero`, `bbc-stats-section`, `bbc-founders`, `bbc-timeline`, `bbc-awards`, `bbc-press-wall`, `bbc-epic-journeys`, `bbc-impact`, `bbc-community`, `bbc-testimonials`, `bbc-impact-funder-cta` — all used only by `page.about.json`, which duplicates our-story-2. **Solution: retire the template** (point the about page at our-story-2's template in admin), then these 11 sections join the dead list. No restyle.

### Tier 5 — dead sections (~130 files)
Every `bbc-*` section not listed above (heroes v1–v3, old collection/enhanced variants, old header/footer, workshop-blocks 93KB, etc.). **Solution: ignore now; archive list for a cleanup pass after publish.** Do not spend styling effort.

### Shared theme blocks (33 in `blocks/`)
Used inside `bbc-section` on why-bamboo: `bbc-heading`, `bbc-text`, `bbc-video`, `bbc-case-study`, `bbc-group`, `bbc-stat`, `bbc-accordion`, `bbc-press-logo`, `bbc-comparison-row` are already standard-styled. The rest (badge, button, cta-card, checklist, endorsement, feature, founder, journey, kit-card, location, milestone, need, partner-logo, perk, press-item, programme, spacer, spec, step, testimonial, image, funding-loop, geometry-row) inherit the sheet automatically wherever a standard section is present — no per-block work needed beyond the Tier-2 page passes.

## 3. Copy budgets (the "reduce body" rule, applied site-wide)
- Statement: headline ≤ 8 words · body ≤ 15 words · footnote carries the caveat/evidence.
- Pillar: headline ≤ 5 words · body ≤ 20 words · quote does the persuading · one CTA.
- Card (door/kit/why): title ≤ 4 words · body ≤ 12 words · one link.
- Intro/lede under a section head: one sentence, ≤ 15 words. Everything longer → next-level page.
- Homepage already trimmed to these budgets (2026-07-07, via index.json settings overrides — editor-safe).

## 3b. Refinement pass (2026-07-07, deployed)
- **Optimum sizes locked:** display 10.5vw (cap 10.5rem) · pillar 7.2vw · section 5.8vw · body 18px desktop / 16px mobile · footnote 14px · buttons 15px/700. Mobile heads carry `!important` clamps (see gotcha).
- **Body measure capped:** statement ≤ 34em (~65ch), pillar ≤ 30em. Long copy demotes to footnote/links.
- **One button system:** legacy `.rd-btn` mapped to the standard pill (radius 999). On dark surfaces only a lime fill is primary; bone fills demoted to outline secondary (`.rd-on-dark`). Mobile ≤600px: buttons stack full-width.
- **Image alignment fixed:** `.bbcpl-media img` = absolute inset:0 + `height:100% !important` + object-fit:cover (the global `img{height:auto !important}` rule otherwise forces 4:3 and leaves a gap under the photo).
- **Design direction (researched):** 2026 trend alignment = "brutalist-editorial": oversized type as storytelling, deliberate/human/imperfect vs AI-smoothness (refs: Toggl, Balenciaga web). BBC signature moves: lowercase human voice, asterisk-footnote honesty motif, hard-cropped full-bleed images, one loud accent per surface, peer-reviewed quote tags. This is the differentiator — protect it in future work.

## 3c. Colour grammar — block sequencing (2026-07-07)
Four surfaces: **paper** `#E6DCC8` (default) · **forest** `#003C32` (emphasis) · **lime** `#D4FD62` (punctuation) · **steel** `#DEE6F0` (cool breather).

**Sequencing rules:**
1. Paper is the resting state — most blocks are paper.
2. Forest marks an emphasis beat (mission, evidence, CTA band). **Never two dark blocks adjacent** — always return to a light surface between darks.
3. Lime is punctuation: **max one lime block per ~4 blocks**, reserved for THE statement/CTA moment on a page. Never adjacent to another lime; avoid lime directly against forest hero imagery (fights for attention) — separate with paper.
4. Steel is the variety valve when a page needs a third light surface (comparison tables, calm data).
5. A page reads like a rhythm: `paper → forest → paper → paper → lime → forest(close)`. If two darks collide when sections are re-ordered in the editor, flip one to paper via its Background setting.

**Text pairs (locked, AAA):**
| Surface | Headline | Body | Accent/eyebrow | Buttons |
|---|---|---|---|---|
| paper | ink `#0E1A17` | `#2a3530` | forest `#17553a` | primary forest fill / secondary forest outline |
| forest | bone `#E6DCC8` | `#cfe0d7` | lime | primary lime fill (forest text) / secondary bone outline |
| lime | forest `#003C32` | forest | forest | primary forest fill (bone text) / secondary forest outline |
| steel | ink | `#2a3530` | forest | as paper |

Never: white-on-lime, gold anywhere near lime, bone body text on paper, two filled buttons on one surface.

## 4. Rollout order (proposed)
1. ✅ why-bamboo · homepage
2. impact → workshops → schools/education → prisons (highest-traffic mission pages; one scoped CSS block each, proper-noun audit first)
3. our-story-2, build-to-bond, teambuilding, support-mission, remaining Tier 2
4. Tier 3 buttons/type pass (one shared block)
5. Retire page.about.json; archive dead sections

## Named band variants (Rollout R2, 2026-08-08)
- **mission-loop** — the You build → Profits fund → A life changes band, forest/display form (95px heading). Point-of-sale contexts: kit PDPs.
- **mission-loop--compact** — steel/compact form (32px heading). Post-sell contexts: workshops. Both are official; anything else is drift.
- Stat bands on paper take the **.rd-dim** dimension-tick modifier (the signature); dark hero rows stay clean.
