# Visual Review — Live Site (preview)

**Date:** 2026-06-17
**Branch:** `redesign-2026-homepage-slice`
**Method:** Live browser walkthrough of the published preview at https://bamboobicycleclub.org/ (Chrome MCP — screenshots + DOM/link inspection).
**Pages checked:** Homepage · Contact · Workshops · Impact · Support Centre · a Frame Build Kit product.

---

## TL;DR

| Area | Status |
|------|--------|
| Contact page | ✅ Clean — image hero, `info@`, form/FAQ/address all good |
| Support routing | ✅ `/pages/support-centre` 200, old `/pages/support` correctly 404s |
| Product page | ✅ Renders fully (image, variants, price, What's Included, Geometry) |
| **Email `hello@` → `info@`** | ❌ **Only half-applied** — still `hello@` on Workshops, Impact, Support |
| **Toulouse link** | ❌ **Broken** — points to `/pages/toulouse` (404) |
| **Homepage media/blocks** | ⚠️ Several empty placeholders — looks like `index.json` wasn't pushed |
| Impact "Watch Our Video" | ⚠️ Links to a page, not a video |

---

## 🔴 Must fix

### 1. Email still `hello@bamboobicycleclub.org` on three pages
The `hello@` → `info@` change landed on the **global footer** and the **Contact page**, but the hardcoded "complete" sections on these pages still use `hello@`:

- **Workshops** (`/pages/workshops`) — `mailto:hello@...` (button + visible text)
- **Impact** (`/pages/impact`) — `mailto:hello@...` (button + visible text)
- **Support Centre** (`/pages/support-centre`) — `mailto:hello@...`

Per CLAUDE.md the correct external address is **`info@bamboobicycleclub.org`**. Search the `bbc-*complete` / workshop / impact / support section liquid for `hello@` and replace.

```
grep -rn "hello@" sections/
```

### 2. Toulouse link is a 404
On the Workshops page the "Book Toulouse →" link points to **`/pages/toulouse`**, which returns **404**. The live page that exists is **`/pages/toulouse-workshop`** (returns 200). Update the href.

- `/pages/toulouse` → **404** ❌
- `/pages/toulouse-workshop` → **200** ✅ (correct target)

---

## 🟠 Homepage — empty placeholders (likely `index.json` not pushed)

These all point to theme-editor/section content that hasn't been populated on the published theme. Because we **never push `templates/*.json`**, these need setting in the theme editor (or the section defaults need fixing in liquid):

1. **Hero** — headline/subcopy render, but the **right-hand image area is empty**. No hero image showing.
2. **Press / "AS FEATURED IN"** — the logo strip is **empty** (no press logos rendering).
3. **"Two Ways to Build Your Bike"** cards — icons render as **broken fallback glyphs** (exclamation-in-circle) instead of proper icons.
4. **"Where Our Bikes Go" (Journeys)** — the **left image panel is empty green**, and there is a **visible empty bordered placeholder box** below the journey cards.

> Everything else on the homepage renders well: Why Bamboo, "13 years" story + stat, Key Milestones timeline, Recognition (awards icons + FT quote), footer trust bar (4 stats with icons), footer nav columns, and the footer email is correctly **`info@`**.

---

## 🟡 Worth a look

- **Impact → "Watch Our Video"** links to **`/pages/bamboo-bicycle-club-education`** (a content page), not a video. If the intent is to play a video, point it at the video/YouTube; otherwise relabel the button.

---

## ✅ Confirmed good

- **Contact** (`/pages/contact-us`): image hero ("Get in touch"), contact form, FAQ, workshop address. **No `hello@` anywhere** — only `info@`.
- **Support routing**: `/pages/support-centre` loads (FAQ accordion + help icons render); the old `/pages/support` template is gone (404), as intended.
- **Product page** (`/products/balance-bike-flax-kit-with-resins`): hero image, variant selector (Include Resin), price + Shop Pay, description, "What's Included" list, "Geometry & Sizing" accordion — all render correctly.
- **Workshops** & **Impact** heros render with images and correct headings (the issues above are the email + Toulouse link, not layout).

---

## Suggested order of work

1. Replace `hello@` → `info@` in the workshop / impact / support section liquid (🔴 #1).
2. Fix the Toulouse href to `/pages/toulouse-workshop` (🔴 #2).
3. Populate homepage hero image, press logos, "Two Ways" icons, and Journeys image/placeholder via the theme editor (or fix section defaults) (🟠).
4. Decide on the Impact "Watch Our Video" destination (🟡).
