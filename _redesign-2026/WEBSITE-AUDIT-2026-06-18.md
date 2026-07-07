# BBC Website Audit — Imagery, CSS/UX, Mobile-First
**Date:** 2026-06-18 · **Theme:** 196243292534 (BBC Redesign 2026, unpublished preview) · **Scope:** 41 templates, 8 collections, 98 products
**Method:** live templates + section liquids pulled via Admin API; every theme image viewed at full resolution; CSS read for responsive behaviour; cross-template image-usage map built.

---

## 0. CRITICAL — do these first

| # | Issue | Where | Action |
|---|---|---|---|
| **C1** | 🚨 **Facially-identifiable minor published** — `bbc-rd-family.jpg`: adult + ~3–4yr child, face fully visible | **Impact page** (`bbc-impact-2026`, used 2×) | Confirm signed parental release on file, or **replace now**. Highest priority — a minor's image was already removed once. |
| **C2** | 🚨 **Third-party YouTube reappeared** — `ckCwJXJGKD0` = "Julian Goulding" (not BBC) | **Homepage** `bbc-rd-video-embed` (in `index.json` AND the section schema default) | Replace with a BBC-owned video or delete the band (the in-section MP4 already shows a build). Fix the schema default too or it resurrects. |
| **C3** | ⚠️ **Product pages break on mobile** — image/buy-box, spec strip & carbon-comparison grids never collapse <900px | `bbc-product-2026` + `bbc-product-simple-2026` | Add the 4 mobile breakpoints (see §4). Single worst layout issue in the theme. |
| **C4** | ⚠️ **Minors, faces hidden but unconfirmed** — `bbc-rd-prod-balance.jpg` (child, from behind) on homepage kit card + balance kits; `bbc-rd-cs-bradfield.jpg` (school pupils, cropped) on Schools | homepage, kit-balance(-flax), schools | Replace child photo with a product-only balance shot (`bike-draisine.jpg`); confirm school consent for Bradfield. |

---

## 1. Image repetition ("repeating usage") — the core finding
Only **43 distinct images** cover the whole site; **13 are reused across pages.** Worst offenders:

| Image | Pages | Note |
|---|---|---|
| `bbc-rd-road-charlie.jpg` | **11** (home story, gallery, why-bamboo, 8 product pages) | most-repeated image on the site |
| `bbc-rd-prod-build.jpg` | **11** (home + all 10 kit pages) | *overridden* on homepage, so renders on the 10 kit pages |
| `bbc-rd-prod-gravel.jpg` | 6 · `bbc-rd-prod-balance.jpg` 5 · `bbc-rd-bike-field.jpg` 5 | also the global card fallbacks |
| `bbc-rd-workshop.jpg` | 3 (Impact, About, Contact) · `bbc-rd-frame-build.jpg` 3 | |

**Where it hurts most — product kit pages.** The product *gallery* correctly uses each product's real photos (all 10 kits have good studio shots). But the **"Why bamboo" editorial band and the related-product cards** reuse generic images, so:
- **MTB kit** "Why" image = a parts flat-lay (no MTB shown)
- **Fatbike kit** = parts flat-lay (no fatbike)
- **City kit** = bamboo tubes (no city bike)
- kit-gravel related "Custom Frame" card shows a *road* bike

**Fix (cheap — `image_fallback` text settings, no product-media changes):** give each kit a distinct, type-correct image from the studio library `~/Documents/bbc-instructor/slides/img/photos`:
road→`bike-type-road`/`bike-gold`, gravel→`bike-gravel`, mtb→`bike-type-mountain`, city→`bike-type-hybrid`/`bike-street`, custom→`bike-gold`/`bike-red`, balance→`bike-draisine` (also fixes the minor photo), touring→`bike-type-touring`, cargo→`bike-type-cargo`.

---

## 2. Image-to-text relevance mismatches
- Homepage **"Mountain" kit** card → shows a **flax** flat-lay.
- Homepage **"Work with us"** door (programmes/prisons/schools message) → a generic **retail bike-shop** photo.
- Product **MTB/Fatbike/City** "Why" bands → wrong/no bike of that type (above).
- Team-building **Macallan & Upcycle** case-study cards → both show the **same generic cohort photo** (byte-identical to `cohort.jpg`), not those named clients' events. Misrepresents real corporate clients — replace or drop those 2 cards.
- Schools **`cs-oratory`** → an empty bench (weakest case-study image).

---

## 3. Image quality & product photos
- **Theme assets:** mostly 1300–1600px, good. Low-res outliers: `cs-bradfield` (900×488), some product accessory shots.
- **Kit products:** all 10 have real photos. Thin sets: **kit-gravel** (2 images), **kit-balance-flax** (1 image, needs more angles); **kit-gravel-lugged** lowest res (900×900).
- **Catalogue (98 products):** **3 products with ZERO images** — *Balance Bike Taster Kit Schools 5-Pack*, *Shipping Bicycle UK* (utility, ok), and **`Untitled Feb15_10:04`** (orphaned test/draft → delete/hide). **32 products with a single image**, several very low-res (Seatstay Splitter 314×237, Permabond 396×529). **33/98 have no `product_type`** → blank tag badge on collection cards.
- **Authenticity:** `bbc-rd-team.jpg` is **generic stock** (laughing models, not real BBC people) — used on homepage + 2 kit pages. Swap for a real workshop/build shot.

---

## 4. CSS / UX / Responsiveness / Mobile-first
**Verdict: the 2026 system is mobile-safe by design — except the product pages.** Homepage, all content pages, collections, blog and article collapse correctly (shared `.rd-g2/3/4`, `.rd-split`, `.rd-stats` grids all have breakpoints; alt text, focus states, reduced-motion all good).

**P1 — definite mobile bugs (product pages only):**
```css
/* append to assets/bbc-redesign-2026.css */
@media(max-width:820px){            /* P1-1 image | buy-box never stacks (worst issue) */
  .bbc-rd .rd-cmp-45496{ grid-template-columns:1fr !important; gap:32px !important; }
  .bbc-rd .rd-cmp-02745{ position:static !important; top:auto !important; }
}
@media(max-width:680px){            /* P1-2 spec strip N-columns never collapse */
  .bbc-rd .rd-spectable{ grid-template-columns:1fr !important; }
  .bbc-rd .rd-spectable > .rd-spec-cell:not(:last-child){ border-right:none; border-bottom:2px solid var(--ink); }
}
@media(max-width:620px){            /* P1-3 carbon-comparison 5-col never collapses */
  .bbc-rd .rd-cmp-00502{ grid-template-columns:1fr !important; gap:14px !important; }
  .bbc-rd .rd-cmp-76373{ transform:rotate(90deg); }
}
```
**P2 — responsive polish:**
```css
@media(max-width:620px){ .bbc-rd .rd-pad{ padding:52px 0; } .bbc-rd .rd-pad-sm{ padding:40px 0; } }  /* 88px never reduced on mobile */
@media(max-width:520px){ .bbc-rd .rd-wrap{ padding:0 18px; } }  /* 32px gutters eat 18% of a 360px screen */
@media(max-width:480px){ .bbc-rd .rd-cmp-31841{ gap:8px !important; } } /* product thumb row */
```
**P3:** product page heading order (`h1`→`h3`); the stylesheet is desktop-first-with-patches (every new `.rd-cmp-*` must remember a breakpoint — that's how the product bugs slipped in); sticky mobile buy-bar is JS-only (verify it doesn't stack with the `.rd-botbar`).

**Section → mobile-first scorecard:** product / product-simple = **NO** (P1); home, collection, collections-list, education, about, impact, teambuilding, workshops, contact, page, blog, article = **YES**; shared CSS = **partial** (P2).

---

## 5. Housekeeping
- **Branch divergence:** local `templates/blog.json` & `article.json` still reference Dawn `main-blog`/`main-article`; the live theme correctly uses `bbc-blog-2026`/`bbc-article-2026`. **Don't let a deploy regress these.**
- Blog image-less fallback reuses the ×5 `bike-field` for every post — vary or use a neutral placeholder.
- Smart collections (road/gravel/mtb/balance) have no collection `image` set in admin (harmless now).

---

## 6. Prioritised action list
1. **C1** Impact `bbc-rd-family.jpg` minor — release or replace.
2. **C2** Remove Julian Goulding YouTube (template + schema default).
3. **C3** Product-page mobile breakpoints (4 CSS blocks, §4).
4. **C4** Replace balance-bike child photo; confirm Bradfield + `team.jpg` provenance.
5. Per-kit distinct imagery (MTB/Fatbike/City/etc.) — §1 fix.
6. Fix relevance mismatches (Mountain=flax, "Work with us"=shop, Macallan/Upcycle stock).
7. Delete the `Untitled Feb15` test product; add images to the 3 image-less products; set `product_type` on the 33 missing.
8. P2 spacing/gutter tightening on mobile.

---

## 7. RE-AUDIT & FIXES APPLIED — 2026-06-18 (verified live on theme #196243292534)

**Policy change applied first:** third-party community build videos are now *approved* (BBC has full rights; authenticity + open-source ethos). So the homepage build film is **kept and credited**, not removed.

| Audit item | Action taken | Verified |
|---|---|---|
| **C1 + C4 — identifiable minors** (`bbc-rd-family.jpg`, `bbc-rd-prod-balance.jpg`) | Both asset files **overwritten with the product-only `bike-draisine` shot** (museum balance bike, no person). | ✅ Both now byte-identical (313,558 B) = the draisine. No minor anywhere on Impact / homepage kit card / balance kits. |
| **C2 — "third-party YouTube reappeared"** (Julian Goulding) | **Re-classified as fine — kept.** Added visible credit caption *"Build film by Julian Goulding · a Bamboo Bicycle Club community build."* Schema default + index both retain the embed. | ✅ Caption live in `bbc-rd-video-embed`; embed id `ckCwJXJGKD0` present. |
| **C3 — product pages don't collapse on mobile** | Appended the 4 mobile breakpoints (820/680/620/520/480) to `bbc-redesign-2026.css`. | ✅ Live (CSS pushed); image\|buy-box, spec strip, carbon-compare now stack. |
| **§1 — kit "Why" images all generic** | Uploaded 5 type-correct images and set per-kit `why_fallback`: road→`kit-road`, gravel→`kit-gravel`, mtb/fatbike→`kit-mtb`, city→`kit-city`, custom→`kit-custom`, balance(-flax)→`prod-balance` (draisine). | ✅ Live (pulled templates: kit-mtb→kit-mtb.jpg, kit-city→kit-city.jpg, etc.). |
| **§2 — Homepage "Mountain" card = flax** | `bbc-rd-prod-flax` → `bbc-rd-kit-mtb.jpg`. | ✅ Live in index.json. |
| **§2 — Homepage "Work with us" door = retail shop** | Swapped to `bbc-rd-cohort.jpg` (real workshop cohort) + updated alt. | ✅ Live in index.json. |
| **§2 — Team-building Macallan/Upcycle = same cohort photo** | Now uses **4 distinct case-study images** (`tb-fourseasons/gm/macallan/upcycle`). | ✅ Live; all four distinct assets exist (not the 379 KB cohort.jpg). |
| **§3 — Impact alt text** | Updated to *"A finished bamboo balance bike — the kind built for a child through Build to Bond."* | ✅ Live default. |

**Still open (Shopify admin / James-dependent — NOT theme code, not done blind):**
1. **Delete `Untitled Feb15_10:04`** test product — destructive, needs James's go.
2. **3 image-less products** + **33 with no `product_type`** — bulk catalogue metadata; confirm mapping before applying.
3. **`bbc-rd-cs-bradfield.jpg`** (school pupils, 82 KB low-res) — kept pending consent confirmation.
4. `prod-build` ×11 / `road-charlie` ×9 are **related-product card *fallbacks*** — they only render if a related product lacks its own media, and all 10 kits have studio photos, so largely inert. Low priority.
5. Minor: `tb-macallan` (119,200 B) and `tb-upcycle` (119,180 B) are suspiciously close in size — worth a glance that they're genuinely the two different events.

---

## 8. SCREENSHOT-VERIFIED PRODUCT PASS — 2026-06-18 (true mobile viewport)

**Method (new — actually sees mobile):** built a faithful static harness of the product page's three responsive grids using the *real* section class names + the *live* `bbc-redesign-2026.css`, served locally, and rendered it through the Claude Preview MCP at a **true 390px viewport** (not the browser tools' locked 1371px). Measured grid columns with `getComputedStyle` and screenshotted at 390 and 1280.

**Product-page mobile fix — PROVEN (not just reasoned):**

| Grid | 390px | 1280px |
|---|---|---|
| Image \| buy-box (`rd-cmp-45496`) | 1 col (stacked) ✅ | 2 col, buy-box sticky ✅ |
| Spec strip (`rd-spectable`) | 1 col ✅ | 4 col ✅ |
| Carbon compare (`rd-cmp-00502`) | 1 col, +/= rotated ✅ | 5 col ✅ |
| Thumb row (`rd-cmp-31841`) | 4-up ✅ | 4-up ✅ |
| Horizontal page overflow | none ✅ | — |

**Two NEW issues found in the harness (the static audit missed them), fixed + re-verified:**
- **Sticky buy-bar broke on phones** — a long product title (e.g. *Gravel Aluminium Lugged Build Kit*) wrapped to **4 lines** and squeezed *Add to cart* into a **3-line** stack (bar ballooned). Added a ≤600px rule: title truncates to one line with ellipsis, price + CTA stay on one line, padding tightened → bar is now a clean 68px single row; desktop unchanged (full title, spacer intact). *(assets/bbc-redesign-2026.css)*
- **Heading hierarchy** — the funding-loop section (first section after `<h1>`) used `<h3>`, skipping `<h2>`. Changed to `<h2>` (same `rd-cmp-97576` class → identical look, correct a11y order). *(sections/bbc-product-2026.liquid)*

Both pushed live to #196243292534 and confirmed via API pull.

**Reusable infra:** `.claude/launch.json` ("bbc-harness") + `/tmp/bbc-harness/` now give a repeatable true-mobile screenshot rig for any 2026 section — the long-standing "can't see mobile" gap is closed via the Claude Preview MCP's real viewport.

---

## 9. IMAGE-SWAP VISUAL TEST — 2026-06-18 (rendered the REAL files at 390px; caught 2 issues)

Rendered every swapped image file in card frames at phone width (no browser needed — James is remote). **Confirmed good:** Mountain card = real MTB; "Work with us" door = real BBC cohort; kit Why-images = correct bike per type (road/gravel/mtb/city/custom); `team.jpg` now the real workshop shot (pushed live, 396,067 B). **The test caught two real problems:**

- 🚨 **LOCAL-vs-LIVE safeguarding landmine (FIXED).** The minor-photo overwrite was done via API to the LIVE theme only; the **local repo `assets/bbc-rd-family.jpg` (1,017,559 B) and `assets/bbc-rd-prod-balance.jpg` (158,953 B) were still the original child photos.** A `theme push` of assets would have re-published the minors. Pulled the live draisine and copied it over both local files → local now == live (313,558 B). Live was already correct (verified by viewing the pulled file = the wooden draisine, no child).
- ❌ **CORRECTION to §7's "team-building now distinct".** Of the 4 case-study images, **Four Seasons and GM are genuinely distinct, real events** (purple-apron ballroom build; conference-room saw + camera). But **Macallan and Upcycle are the same generic "group holding blueprints" photo** — which is *also* the homepage "Work with us" door image (`cohort.jpg` is a higher-res crop of it). So two named corporate clients share one stock-feeling group shot. Needs distinct real photos from James, or drop/merge one card. Not fixable in theme code alone (protected `page.bicycleteambuilding.json` + no source photos).
