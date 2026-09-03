# New Design → Shopify Theme — Reconciliation & Implementation Plan

**Date:** 2026-06-10
**New design source:** Claude Design handoff (`api.anthropic.com/v1/design/h/Xs6WFDusgpSCNjNZB2HOsA`), reference build at `/Users/jamesmarr/Documents/bbc-instructor/website/` (6 pages: home, about, impact, workshops, education, product/Gravel kit + shared `nav.js` / `site.css`).
**Target:** this repo — `bbc-theme-new` (Shopify theme `191768756598`, store `bamboo-bicycle-club-london-uk`, live `bamboobicycleclub.org`, Basic plan, GBP).
**Supersedes/extends:** `HOMEPAGE-REBUILD-PLAN.md` (Apr 2026, awaiting approval) — that was "patterns + fixes"; this gives it a concrete design spec to build to, and folds in the `FULL-SITE-AUDIT.md` P0/P1 cleanup as cross-cutting work.

---

## 0. Executive summary

The new design is **an evolution of the current theme, not a rebrand**. It keeps the forest/gold/teal base and the existing IA, and the theme **already contains a section for almost every block in the new design** (118 custom `bbc-*` sections). So this is overwhelmingly a **re-skin + re-copy + re-image + consolidate** job, with exactly **one genuinely new module** (the funding-loop strip) and **one structural change** (audience routing: 2 "ways to build" → 3 "doors" incl. a funder/partner door).

The new design also **delivers the audit's headline fixes by construction**: the funding loop becomes explicit, the impact story is woven throughout instead of quarantined, stats become a single source of truth, the PDP gets ecommerce best-practice, and the nav gets search/breadcrumbs/mobile bottom-bar.

**Recommended path:** do it as a **vertical slice** — re-skin the design foundation (tokens + Atkinson font + stamp-card utilities) and rebuild the **homepage** first, behind the dev/preview theme, to validate the new look on real content before rolling the skin across the other pages.

**Two things need your decision before any building (see §4):**
1. ⚠️ **Naming the prison.** The new design names **"HMP Lowdham Grange" throughout** (headlines, body, image alt text), on public commerce pages. Your standing rule is *never name a specific prison in external comms*. Press (FT, Inside Time) has named it, so this may now be intentional — but it's your call, and it touches every impact/education/about page.
2. **Source-of-truth facts.** The audit flagged conflicting prices/cohort/course-length. I've reconciled prices against the live store below (§3.6) — but the canonical figures are yours to confirm.

---

## 1. The three layers of change

| Layer | What changes | Risk / blast radius |
|---|---|---|
| **A. Visual system** | Warmer neutrals (bone/paper replace cool Tailwind greys), a new **lime "spark" accent**, **Atkinson Hyperlegible** font (replaces Plus Jakarta/Assistant), the **stamp-card motif** (offset hard shadow + 2.5px ink border). Forest/gold/teal essentially unchanged. | **Global** — touches every section via `bbc-foundation.css` tokens + font. High visual payoff, but must verify across the 118 sections (75% currently hardcode hex — see §6). |
| **B. Content & messaging** | Funding loop made explicit; impact woven across home/about/education/product; single source-of-truth stats; reassurance-first workshops; cause-line on commerce; PDP best-practice. | **Per-page copy**, schema-driven. Medium. Needs your confirmed facts + the prison-naming decision. |
| **C. IA / navigation** | Shared nav with **visible search**, Frame-Kits **dropdown**, **sticky auto-hide** header, **breadcrumbs** on deep pages, **mobile bottom tab bar**; structured footer (adds a Customer-service column). | `bbc-header.liquid` / `bbc-footer.liquid` + a small JS. Medium; well-scoped. |

---

## 2. Brand tokens — current vs new design

| Token | Current theme (`bbc-foundation.css`) | New design (`site.css`) | Action |
|---|---|---|---|
| Forest (primary) | `#073e27` | `#003C32` (+ `forest-700 #002A23`, `forest-300 #1F6655`) | Deepen slightly; add the two shades |
| Teal | `#3f8b66` | `#3F8B66` | **No change** |
| Gold | `#ffa900` | `#FFA900` | **No change** |
| **Lime "spark"** | — (none) | `#D4FD62` (+ `lime-700 #9BC02E`) | **NEW** — the signature accent (CTAs, loop end-state, tags) |
| Warm neutrals | cool `cream #f8fafc`, Tailwind greys | `bone #E6DCC8`, `paper #F1E9D8` | **Swap** page backgrounds cool→warm |
| Ink / charcoal | `gray-900 #0f172a` (cool) | `ink #0E1A17`, `charcoal #2A332F` (warm) | Swap text near-blacks cool→warm |
| Steel | `gray-300 #94a3b8` | `steel #8DA4C1` | Reconcile (cooler blue-grey) |
| **Font** | `Plus Jakarta Sans` (body) / `Assistant` (settings) | **`Atkinson Hyperlegible`** (400/700 TTF supplied) | **Swap** — also the accessibility win the audit says to protect |

**Stamp-card motif (new):** cards get `border:2.5px solid ink; box-shadow:5px 5px 0 ink` (lime variant uses `lime-700` shadow); a `flat-cards` body class removes shadows. Add as a utility in foundation CSS.

> Implication: this is **~8 token edits + 1 font swap + ~3 utility classes** in `assets/bbc-foundation.css`, not a rewrite. Because 75% of sections hardcode hex (per `FULL-SITE-AUDIT.md`), the token swap alone won't reskin everything — the hardcoded-hex cleanup (already a P2 in the April audit) becomes part of this work.

---

## 3. Content reconciliation

### 3.1 Homepage — current 9 sections → new design → mapping

Current `templates/index.json` order vs the new design's homepage:

| New design block | Current homepage section | Existing `bbc-*` section to use | Action |
|---|---|---|---|
| Hero — *"More than a bike. A second chance."* (impact-led, full-bleed photo + scrim) | `bbc_hero_slider` — *"4,000+ people have built…"* (video, green overlay) | `bbc-hero-slider` (or consolidate the 6 hero variants → 1) | **Adapt:** new copy, real photo, scrim; keep video option |
| **Funding loop** — You build → Profits fund → A life changes | — *(none today)* | — | **BUILD NEW** `bbc-funding-loop.liquid` (small, schema-driven 3-step) |
| Stats — 4,000+ / 90% / £11.41 / 36 | `bbc-story` stats + `bbc-trust-bar` | `bbc-trust-bar` | **Reuse:** set the 4 source-of-truth stats |
| **Doors** — Make / Partner / Support (3) | `bbc-options` — "Two Ways to Build" (2) | `bbc-options` | **Adapt 2→3:** add the funder/partner "Support" door (closes the audit's audience-routing gap) |
| Impact feature — "Building bikes. Rebuilding lives." (split) | *(not on home today)* | `bbc-build-to-bond` / `bbc-impact` | **Reuse** as a homepage split |
| Why bamboo (4 points) | `why_bamboo` (`bbc-content`) | `bbc-content` / `bbc-why-bamboo` | **Reuse + reskin** |
| Shop / kits (4 cards) | *(home links out to collections)* | adapt `bbc-collection-*` or simple grid | **Add** kit teaser → `/collections/home-build-kits` |
| Press wall + FT quote | `press_logos` **and** `press_recognition` **and** hero bar (**3×**) | `bbc-press-recognition` | **Consolidate 3→1** (audit finding) + reskin to wordmark style |
| Community stories (3 stamp cards) | `bbc-homepage-testimonials` | `bbc-homepage-testimonials` | **Reuse + reskin** to stamp cards |
| Final CTA (3 buttons) | `bbc-cta` | `bbc-cta` | **Reuse** |

**Net new build for the homepage = 1 section** (`bbc-funding-loop`). Everything else is adapt/reuse/consolidate.

### 3.2 Other pages

| Page | New design | Existing target | Action |
|---|---|---|---|
| **Our Story / About** | timeline (impact as culmination), founder mission, "one engine" model, 3 values | `page.our-story-2.json`, `bbc-story`, `bbc-timeline*` (3 variants → 1) | Reskin + recopy; consolidate timelines |
| **Impact** | hero, stats, "workshop inside", Build to Bond, pathway, 3 ways to help | `page.impact.json`, `bbc-impact-*`, `bbc-build-to-bond` | Reskin + recopy; rich section set already exists |
| **Education** | 3 programmes (justice/schools/corporate) + accreditation | `page.schools.json`, `bbc-schools-*`, `page.bamboo-bicycle-club-education.json` | Reskin; map 3-programme structure |
| **Workshops** | reassurance-first, how-it-works, watch-a-build, give-back, locations, FAQ | `page.bicycle-frame-building-workshop.json`, `bbc-workshop-complete` (42KB) | Reskin + recopy; **add video** (also a P0 in April audit) |
| **Product (PDP)** | reviews above fold, total-cost bundle, fit guide, sticky buy-bar, trust row | 16 kit templates, `bbc-kit-complete` (28KB), `bbc-kit-reviews`/`-confidence`/`-comparison` | **Mostly built** — reconcile the ecommerce best-practice items the design adds |
| **Collections** | (not in new design) | `bbc-collection-enhanced-v4`, `COLLECTION_PAGE_REDESIGN_SUCCESS_2026.md` | Apply new skin only |

### 3.3 Imagery — the critical-path dependency

The audit's blunt finding: the **current site has zero real photography** (all 10 homepage images are logos/SVGs). The new design is built entirely on **real documentary photos** — the same archive the design assistant pulled from. **Implementation is blocked on you supplying the real shots** (web-optimised). Shot list the design needs:

| Design file | Shot needed | Used on |
|---|---|---|
| `hero-ride.jpg` | Rider on a bamboo bike at sunset, open road | Home hero |
| `prison-wide.jpg` / `prison-empty.jpg` | Wide of the prison workshop (no identifiable learners) | Impact/Education/About |
| `prison-jig.jpg` | Instructor + frame in a jig (faces away/obscured) | Impact/Education |
| `prison-bamboo.jpg` | Selecting bamboo culms | About hero |
| `team.jpg` / `team2.jpg` | Group / corporate build day | Education, community |
| `bike-field.jpg` / `road-charlie.jpg` | Finished bikes in context | Home doors, workshops, PDP |
| `detail.jpg` | Frame joint / lug close-up | Workshops hero, PDP |
| `prod-gravel/-flax/-build/-balance.jpg` | Kit flat-lays + mid-build | PDP + kit grid |

⚠️ **Prison photography rule:** keep with your no-identifiable-learners practice — the design's prison shots are wide/architectural/hands-only. Maintain that when supplying real images.

### 3.4 Proof bank & price reconciliation (live store vs design copy)

Real current prices pulled from the live store today, against what the design shows:

| Item | Live store (today) | Design copy | Verdict / decision |
|---|---|---|---|
| Gravel Frame Kit | **£385** | "from £385" | ✅ correct |
| Adult frame kits range | Road/City **£375**, Gravel/MTB/Fatbike **£385**, Custom **£495**, Gravel-lugged **£595**, Road-lugged **£795** | — | "Frame kits from **£375**" is the honest entry line |
| Balance bike kits | **£165** (lugged), £66–86 (flax) | "Balance bikes" | from £165 |
| Workshops | Workshop Gift **£595 / £795**, Voucher **£695** → tiers ≈ **£595 / £695 / £795** | "£795" (top tier) | Audit's "£495" is **stale**; live floor is £595. **Decide the canonical workshop price line.** |
| Homepage loop "a bamboo bike · **from £795**" | kits from £375; workshops from £595 | from £795 | ⚠️ **£795 is too high as a "from"** — it's the premium/top tier. Recommend "from £375" (kit) or "from £595" (workshop), per intent |
| PDP "complete your build" bundle | component packs **£425** (single-speed) → £532 (Microshift) → £725–£962 → £1,889 (Ekar) | "frame £385 + pack £640 = £1,025" | £640 is illustrative; **pick the canonical "ride-ready" pairing** to quote |
| Stats | 4,000+ builders · 90% completion · £11.41/£1 (PACT) · 36 countries | same | ✅ confirm these four as the **single source of truth** and use everywhere |
| Cohort size | — | "six learners at a time" | Audit saw "6" vs "12"; **confirm** prison cohort vs the separate "6-bike school pack" |
| Course length | — | "six weeks, four hours a day" | Audit saw "six-week" vs "two-week"; **confirm** |

---

## 4. Decisions needed from you (Phase 0 — blocks build)

1. ⚠️ **Prison naming on the public site** — name "HMP Lowdham Grange" (press already has) **or** use a generic descriptor ("a Category-B men's prison")? Applies to home/impact/education/about + image alt text.
2. **Source-of-truth facts** — confirm the 4 stats, the canonical **workshop price line**, the homepage "from £___" figure, the **cohort size** and **course length**, and the PDP **bundle pairing** (§3.4).
3. **Photography** — supply the real web-ready shots in §3.3 (the single biggest dependency).
4. **Font** — confirm moving the whole theme to **Atkinson Hyperlegible** (recommended; it's the accessibility edge the audit says to protect). Self-host the TTFs in `assets/`.
5. **Scope of first slice** — recommended: **foundation reskin + homepage** only, validated in preview, before rolling out.
6. **The lime accent** — confirm the bright lime `#D4FD62` as the new spark (it's a noticeable shift from the current gold-led CTAs; gold stays as secondary).

---

## 5. Phased implementation plan

**Phase 0 — Decisions & inputs** (you): §4 above. Nothing builds until prison-naming, facts, and photos are settled.

**Phase 1 — Foundation reskin** (`assets/bbc-foundation.css`, `layout/theme.liquid`): add new tokens (forest shades, lime, bone/paper, warm ink), self-host Atkinson + swap font stack, add stamp-card utilities. Also do the April-audit P0s here (remove the 5 duplicate CSS loads = −128KB; delete 9 orphaned CSS files). *Low risk, global payoff. Verify across sections in preview.*

**Phase 2 — Homepage** (vertical slice): build `bbc-funding-loop.liquid` (the one new module); adapt `bbc-options` 2→3 doors; reskin/recopy hero, trust-bar stats, why-bamboo, testimonials (stamp cards), CTA; consolidate press 3→1; add kit teaser. Update `templates/index.json` **via the safe pull→edit→push-only workflow** (§6).

**Phase 3 — PDP / commerce** (the conversion lever): reconcile `bbc-kit-complete` against the design's ecommerce additions — reviews above fold, total-cost bundle, fit guide, sticky buy-bar, trust row by the button, cause-line. Then clone to the other kit templates.

**Phase 4 — Impact / Education / About / Workshops**: reskin + recopy onto existing sections; consolidate the 3 timeline variants → 1; **add workshop video** (April-audit P0).

**Phase 5 — Nav / IA**: extend `bbc-header.liquid`/`bbc-footer.liquid` with the dropdown, visible search, sticky auto-hide, breadcrumbs on deep pages, mobile bottom tab bar, structured footer (port `nav.js` logic).

**Phase 6 — Blog/News** (separate workstream, from the Blog Audit): repair publish dates, merge the two parallel blogs (301 one), de-dupe press posts, add categories (Impact · Builds · How-to · Press · Events), rewrite blog meta around the mission.

**Cross-cutting cleanup** (fold into each phase): retire the **6 hero variants → 1** and **3 timeline variants → 1**; replace hardcoded hex (Tailwind/Material) with brand tokens (75% of sections); re-skin the workshop sections off the Material-Design palette.

---

## 6. Constraints & deploy workflow (the rules — from `THEME_RULES.md` / `AGENTS.md`)

- ⛔ **NEVER push `templates/*.json` or `config/settings_data.json`** with a bare push — it overwrites James's editor content (also a global hard rule). When a template change is required: `shopify theme pull --only templates/x.json` → edit structure only → `shopify theme push --only templates/x.json`.
- ✅ **Safe to edit:** `sections/*.liquid`, `snippets/*.liquid`, `assets/*`, and (carefully) `layout/*.liquid`.
- **Content must be schema-driven** (text/textarea/richtext/image_picker/url — no hardcoded copy, images, or URL defaults), so James can edit in the theme editor.
- **Block-caching gotcha:** saved template blocks "freeze"; the established workaround is monolithic sections (`bbc-kit-complete`, `bbc-workshop-complete`) — follow that pattern for new heavy sections.
- **Deploy:** `shopify theme dev --store=bamboo-bicycle-club-london-uk`; preview theme `191768756598`; push **per-file with `--only`**. Work on a branch; commit per phase.

---

## 7. Risks

- **Global reskin on 118 sections** where 75% hardcode hex — the token swap won't catch them all; budget the hardcoded-hex cleanup or some sections will look half-reskinned.
- **Font swap** changes metrics site-wide — check headings/buttons/tables don't reflow badly.
- **Warm-vs-cool palette flip** (bone/paper over Tailwind greys) will expose every off-brand grey; verify in preview before pushing.
- **Photography is the gating dependency** — without real shots the design can't land; don't push a reskin onto logo-only placeholders.
- **Reconcile with `HOMEPAGE-REBUILD-PLAN.md`** so the two plans don't fork — this doc is the live one.

---

## 8. Recommended next step

Settle **Phase 0 §4** (especially the prison-naming call and the photo set), then I build **Phase 1 (foundation reskin) + Phase 2 (homepage)** as a single preview-able slice so you can judge the new look on the real homepage before we commit to rolling it across the site.
