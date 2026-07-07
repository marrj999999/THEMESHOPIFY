# 2026 Redesign — Build-Completion Audit & Finish Plan (2026-06-12)

Consolidated from a 6-agent per-page completeness audit + infrastructure check. Supersedes nothing; this is the **"what's actually left to finish"** map. Read-only audit — build actions tracked in §5.

---

## 0. Reality check (correcting the docs)

- **Sandbox / WIP theme = `195991470454`** ("BBC Redesign 2026 (WIP - do not publish)", unpublished, updated today). Its `templates/index.json` uses `bbc-home-2026` — this is where the redesign renders and is browser-verified.
- ⚠️ **`191768756598` ("BBC Dawn (New Build)") is the `main` / LIVE theme** serving `bamboobicycleclub.org` — and it still runs the **OLD** design (`bbc-hero-slider`, `bbc-options`…). `AGENTS.md` / `THEME_RULES.md` told deploys to target `191768756598` — that is now the LIVE site. **Deploy redesign work to `195991470454` only.** (Docs corrected this pass.)
- **Shopify CLI is NOT authenticated** here (no `~/.config/shopify`, no token env). So `shopify theme push/dev` can't run headlessly. Deploys this session go via the **Admin Asset API** (`PUT …/themes/195991470454/assets.json`, same token as the blog audit) for `sections/*` and `assets/*` only.
- **Local working tree has 111 uncommitted files** (a prior session was mid-refactor, esp. `templates/page.impact.json` −1085 / `page.our-story-2.json` +602). **Local templates/section-groups are out of sync with the sandbox** — the sandbox is wired (renders the redesign); local `templates/*` and `sections/header-group.json`/`footer-group.json` are NOT. Treat the **sandbox as source-of-truth for what's deployed**; do not bulk-push local templates over it.

---

## 1. The single biggest issue is WIRING, not missing sections

Section coverage is **complete** — there is a well-built `bbc-*-2026` section for every page type. But in the **local repo**, almost none are wired to live templates; the wiring exists only on the sandbox. Per the audit:

| Surface | Section exists? | Wired in LOCAL templates? | Notes |
|---|---|---|---|
| Home | ✅ `bbc-home-2026` | ✅ (`_redesign-2026/templates/index.json`) | rendered + verified on sandbox |
| About / Our Story | ✅ `bbc-about-2026` | ✅ staged | strong, schema-driven |
| Impact | ✅ `bbc-impact-2026` | ✅ staged | clean; old live template still names prison |
| Education | ✅ `bbc-education-2026` | ⚠️ two divergent templates | sparse staged vs full `page.schools.json` |
| Workshops | ✅ `bbc-workshops-2026` | ✅ staged | good; needs real hero photo + alt |
| Product (kit PDP) | ✅ `bbc-product-2026` | ✅ 10 kit templates | **content bugs — see §2** |
| Collection / list / generic page | ✅ 3 sections | ❌ local templates still Dawn | sandbox may differ |
| Blog / article / search / cart / 404 | ✅ 5 sections | ❌ local templates still Dawn `main-*` | sandbox may differ |
| Account (×7 customer templates) | ✅ `bbc-account-2026` | ❌ still Dawn `main-*` | |
| Header / Footer chrome | ✅ `bbc-header-2026` / `-footer-2026` | ❌ `header-group`/`footer-group` still OLD locally | **`bbc-redesign-2026.css` loads only via `bbc-header-2026`** — so on the local config the redesign stylesheet wouldn't load at all. On sandbox it does. |

**Implication:** "finishing the build" is mostly **(a) reconciling local ↔ sandbox and (b) the per-page content/editability fixes below** — not authoring new sections. Full template wiring needs James's CLI auth (or careful per-file Admin-API read-modify-write to the sandbox).

---

## 2. Content BLOCKERS (must fix before any launch)

1. **Gravel build-steps cloned onto every kit PDP.** All 10 `product.kit-*.json` carry identical steps — *"Lock gravel geometry on the jig…"* and *"…Adventure awaits."* So the **road, balance (toddler), MTB, city, fatbike, custom** PDPs all tell buyers to "lock gravel geometry." Per-kit steps needed.
2. **Fabricated "why" pull-quotes on 9 of 10 kits** (`why_quote` / `why_quote_cite`) — invented personas: *"Proud Parent, Balance bike builder, London"*, *"Jamie, Road kit builder, Romania — Verified Builder"* (a **"Verified Builder" trust badge with no verification** = legal/trust risk), *"Urban Cyclist"*, *"SingleTrack World Member"*, etc. This is the **exact fake-persona pattern the project already removed elsewhere**. The separate `review` blocks (Kate Rawles, Taro, Paul, Daan) ARE genuinely sourced — only `why_quote` is fabricated. **Fix: blank `why_quote_cite` (safest) or swap for a real mined quote.**
3. **Hardcoded "Watch the build" video on every PDP** (`bbc-product-2026.liquid` ~:383) — heading, body and YouTube id `ckCwJXJGKD0` are literals. The **toddler balance-bike PDP shows the adult frame-build film**, and it can't be changed per kit in the editor. Make schema-driven.

## 2b. Stat reconciliation (one source of truth)

Four different "people" totals are live simultaneously: **4,000+** (home/impact redesign), **1,533** ("People Empowered", old live impact), **1,544** ("young people reached", education), plus **90%** (home stat) vs **100%** (home impact body) course completion, and **£11.41 / "PACT research"** with no report/year. Pick canonical figures + cite source/year, use everywhere. → NEEDS JAMES (§4).

---

## 3. Editability / missing-element gaps (safe to fix in `sections/*.liquid`)

- **Contact page has NO hero / no image slot** — the only page without one; also dropped the real phone `+44 7446 930945` + workshop address the old contact page had. → **building this pass (§5).**
- **Home "Watch a build" video** — eyebrow/h2/poster/mp4 all hardcoded (`bbc-home-2026.liquid:163-173`). → schema-drive.
- **Home door/kit/story blocks ship `alt=""`** — block image-alt schemas have no `default`; editor-added blocks are inaccessible. → add defaults.
- **PDP video** (see §2.3) → schema-drive.
- **Footer has no payment icons** — only a "Secure checkout" text badge; add Shopify `payment_type_svg_tag`. → building.
- **Mobile bottom-bar destinations hardcoded** (`bbc-header-2026.liquid:93-96`: `home-build-kits`, `/pages/...`) — not editable. → schema-drive.
- **Search page** has an empty schema (eyebrow, placeholder, empty-state copy all hardcoded). → add settings.
- **Dropdown caret** has no `aria-expanded`; bottom-bar active has no `aria-current`. → a11y polish.
- Workshops credibility strip + breadcrumb labels hardcoded (acceptable; note).

---

## 4. NEEDS JAMES (cannot finish without you)

- **Shopify CLI auth** (`shopify login`/theme token) so the full template + section-group wiring can be pushed to the sandbox, and so I can `theme dev` to browser-verify. Without it I can only push individual `sections/*`+`assets/*` via the Admin API.
- **Source-of-truth facts:** the people total (4,000+/1,533/1,544), completion % (90 vs 100), £11.41 source+year, cohort size, course dosage, balance-bike weight(kg)+age, fatbike clearance, custom lead-time. (Same open list as `CONTENT-FILL-2026-06-12.md §2`.)
- **PDP per-kit build steps** — confirm the real geometry/step copy for road, balance, MTB, city, fatbike, custom, lugged variants (or approve me drafting them from the kit specs).
- **Real `why_quote` per kit** or approval to blank them.
- **Live-template compliance swap:** the OLD live `templates/page.impact.json` (×3) and `page.education.json` still name **HMP Lowdham Grange**. The live site runs the old design, so these are public until the redesign is promoted OR these templates are cleaned. (Same family as the blog-image audit.) Needs the safe pull→edit→push or promotion of the redesign.
- **Education page** draft + URL redirect (store-level) — publish + repoint.

---

## 5. What I'm building this pass (safe `sections/*` only, deployed to sandbox `195991470454`)

Tracked here; each validated (theme-check / liquid parse), pushed via Admin Asset API, byte-verified, committed.

1. **Contact hero** — add editable `image_picker` hero (image + alt + eyebrow + heading + lede) + editable phone/address, matching the other 2026 heroes. *(flagship "missing hero banner + image + editable")*
2. **Home video → schema-driven** — eyebrow/h2/poster picker/mp4 + alt.
3. **Home block alt defaults** — door/kit/story image-alt schema defaults.
4. **PDP video → schema-driven** — id/heading/body/alt (so the toddler PDP isn't stuck on the adult film).
5. **Footer payment icons** — `payment_type_svg_tag` trust row.
6. **Mobile bottom-bar → schema-driven** destinations + `aria-current`.

**Not touched this pass (needs James/sync):** template wiring, section-groups, the OLD-live-template compliance swap, the fabricated `why_quote` / gravel-step content (template-level — flagged for the safe push).

---

## 6. CSS / UX audit (code-level, complements the browser audit done today)

- **Redesign CSS loads last and wins** (`bbc-redesign-2026.css` via `bbc-header-2026.liquid:14`, after all 14 head stylesheets) — but only if the 2026 header is wired (it is on sandbox).
- **Fragile insulation:** 5 legacy globals (`bbc-foundation/accessibility/unified-styles/mobile-menu/mobile-fixes`) still load on every page and leak link/CTA colours (`bbc-foundation.css:1651-1660`). The redesign counters with **125 `!important`** across 2 documented insulation layers — works, but any stylesheet appended after the header re-breaks it. **Recommend gating the legacy globals off redesign templates** (the real fix vs `!important`).
- **Browser-verified today** (`VISUAL-CSS-UX-AUDIT.md`): Home/About/Impact/Workshops/Gravel-PDP/Collection/Contact/404/Blog/Search = 0 contrast offenders; mobile drawer + bottom tab bar ARIA-correct; reduced-motion handled.
- **Heading order clean** across all sections (single h1, no skips). **Account** section is the a11y standout (labels/roles/table semantics). 
- **Open a11y items:** dropdown `aria-expanded`, bottom-bar `aria-current`, contact form `aria-live`/per-field `aria-describedby`, name field not required.
