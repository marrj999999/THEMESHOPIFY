# BBC Theme — Consolidated Redesign Plan (2026-06-19)

**Author:** Claude Code · **Branch:** `redesign-2026-homepage-slice` · **Store:** bamboo-bicycle-club-london-uk
**Inputs reconciled:**
- Vault audit `Reports/Website Audit 2026-06/` — **164 findings** on preview theme `#196243292534`
- `NEW-DESIGN-RECONCILIATION-AND-PLAN-2026.md` (2026-06-10) — the designated **live master plan** (6 phases)
- `FULL-SITE-AUDIT.md`, `HOMEPAGE-REBUILD-PLAN.md`, `HOMEPAGE-AUDIT.md` (2026-04-11)
- `VISUAL-REVIEW.md` (2026-06-17) — freshest live ground-truth
- Brand/content source-of-truth from the Obsidian vault (Proof Bank, Press Log, Brand & Voice Guide)

> This document does **not** fork a new plan. It uses **NEW-DESIGN** as the spine and overlays the vault audit's findings, the two fresh VISUAL-REVIEW bugs, and the verified content facts. Where they conflict, conflicts are surfaced in §1.

---

## 0. The one constraint that shapes everything

**Most page copy lives in `templates/*.json`, which `.shopifyignore` blocks from being pushed** (confirmed: `hello@`, `2020`, `4,000`/`1,533`, `Wageningen`, `most sustainable`, `13 years` all sit in `templates/page.*.json`). Plus the "block caching" gotcha: editing a section's Liquid default does **not** change a page whose content is frozen in template JSON blocks.

So every work item below is tagged:
- **[CODE]** — lives in `sections/*.liquid`, `snippets/*.liquid`, `assets/*.css`, `layout/*.liquid`. I can edit and (on your approval) push.
- **[EDITOR]** — lives in `templates/*.json` / theme-editor blocks / `config/settings_data.json`. **I must not push these.** Either you change them in the Customizer, or we use the documented `shopify theme pull --only … → edit → push --only …` flow with your explicit go-ahead.
- **[DECISION]** — blocked on a fact only you can confirm (see §2). Do not ship until resolved.

**Hard rules (non-negotiable):** never `shopify theme push` bare; never push `templates/*.json` or `config/settings_data.json`; no publish to live without your say-so. Target theme is `191768756598` per all repo docs — **confirm whether that is the live or the preview/dev theme before any push** (the docs describe it both ways).

---

## 1. Conflicts to resolve before shipping numbers

| # | Conflict | Detail | Resolution needed |
|---|---|---|---|
| C1 | **"4,000+" vs "1,533" people trained** | Every theme doc + Proof Bank = **4,000+ trained / 3,500+ built**. The impact page (`page.impact.json`) + the vault audit = **1,533**. `bbc-hero-unified.liquid` still carries `1,533`. | **You decide the canonical figure.** Nothing else stat-related ships until then. |
| C2 | **Date: "2020 Build to Bond" / "CIC 2024"** | Live timeline says 2020; About says CIC 2024. Truth (Companies House): **CIC incorporated 17 Feb 2025**; Build to Bond piloted **~2024**. | Homepage timeline → 2024; About CIC → 2025. *(content is in `templates`, so [EDITOR])* |
| C3 | **Workshop price** | Homepage "from £500/£795"; orphan `/pages/workshops` "£595–£695"; NEW-DESIGN says live floor is **£595** (£595/£695/£795 tiers); vault canonical = **£795** for the 2-day London. | Confirm the canonical price line + the "from £___" homepage anchor. |
| C4 | **Cohort size / course length** | Vault: 6 per cohort, 6 weeks. NEW-DESIGN Phase 0 flags 6-vs-12 and six-week-vs-two-week ambiguity. | Confirm both. |
| C5 | **Press logos** | Source-of-Truth marks BikeRadar/road.cc/Huck "unverified"; Press Log marks BikeRadar/Huck ✅ with URLs. | Press Log looks current — confirm before any logo strip. |
| C6 | **"Sally Allsopp" testimonial** | Referenced in the audit summary; **does not exist** in `Blog Quotes & Testimonials`. | Locate the real quote or drop it. |

---

## 2. Phase 0 — Decisions that gate the build (need you)

1. **The stat (C1):** 4,000+ or 1,533? (This is the #1 blocker.)
2. **Prison naming:** name "HMP Lowdham Grange" throughout (now permitted), or stay generic? Rule still holds: never tie a *named participant* to the prison.
3. **Prices (C3) + cohort/course (C4).**
4. **Photography:** real web-ready shots are the gating dependency for the visual redesign (NEW-DESIGN §3.3 shot list). Without them, the redesign stays placeholder.
5. **Font + accent:** confirm theme-wide move to Atkinson Hyperlegible and the lime `#D4FD62` "spark" accent (NEW-DESIGN Phase 1).
6. **Push approval + target theme:** confirm `191768756598` is the right target and that I may push `[CODE]` changes to it (preview first).

---

## 3. Already done this session — [CODE], local only, NOT pushed

Verified, decision-independent error corrections (legal/factual/bug — safe regardless of the Phase 0 outcomes). All in safe `sections/*.liquid` + `snippets/`:

| Fix | Files | Why |
|---|---|---|
| **Removed fabricated "Wageningen University study" + "~50%"; replaced with verified "56.7%, independent 2024 LCA"** | `bbc-why-bamboo-2026.liquid` (×3), `bbc-home-2026.liquid` (×2) | ASA risk — fabricated citation that also *undercut* the real number |
| **`hello@` → `info@` (canonical)** | `bbc-contact-complete`, `bbc-contact-options`, `bbc-contact-2026`, `bbc-footer`, `bbc-footer-2026`, `bbc-parts`, `bbc-workshop-complete`, `bbc-workshop-blocks` | Single canonical address; matches global rule + VISUAL-REVIEW 🔴 |
| **Toulouse link `/pages/toulouse` → `/pages/toulouse-workshop`** | `bbc-workshop-complete.liquid` | `/pages/toulouse` 404s; `-workshop` returns 200 (VISUAL-REVIEW 🔴) |
| **"13 years"/"Thirteen years" → "14"/"Fourteen"** | `bbc-stats-bar`, `bbc-story`, `bbc-about-2026`, `bbc-why-bamboo-2026` | 2012→2026 = 14; verified, uncontested |

> NOT touched (left for you): the contested `4,000`/`1,533` figure; phone `+44 7446 930945` (unverified); `hello@` inside `footer-group.json` and any `templates/*.json` ([EDITOR]/content); the live footer already shows `info@` per VISUAL-REVIEW.

---

## 4. The plan, by phase (NEW-DESIGN spine + vault overlay)

### Phase 1 — Foundation reskin [CODE] — *can start on your font/accent OK*
- Remove **5 duplicate CSS `{% stylesheet %}` loads** in `layout/theme.liquid` (≈128 KB saved): `bbc-foundation`, `bbc-unified-styles`, `bbc-mobile-fixes`, `bbc-accessibility`, `bbc-mobile-menu`.
- Delete **9 orphaned CSS files** after grep-confirming zero references.
- Brand tokens in `assets/bbc-foundation.css`: forest shades, **lime `#D4FD62`**, bone/paper warm neutrals, ink/charcoal; **Atkinson Hyperlegible** self-host; stamp-card utility (`border:2.5px solid ink; box-shadow:5px 5px 0 ink`).
- Global hardcoded-hex → token sweep across ~25 sections (greys→steel, `#1e293b`→forest, `#f8fafc`→cream, gold/teal variants).

### Phase 2 — Homepage [CODE] + [EDITOR] — *gated by C1 stat + photos*
- **[CODE]** Fix stat-ring overflow in `bbc-story.liquid` (ring 96→120px, font clamp down, mobile 72→88px).
- **[CODE]** Remove the duplicate hardcoded press bar in `bbc-press-recognition.liquid` (consolidate press 3→1).
- **[CODE]** Build the one new module: `bbc-funding-loop.liquid` (3-step "every build funds…").
- **[CODE]** Adapt `bbc-options` from 2 doors → 3 (add funder/partner "Support" door).
- **[CODE]** Fix "Two Ways to Build" broken fallback icons (VISUAL-REVIEW 🟠).
- **[EDITOR]** Hero image + reduce overlay opacity 40→20 + test video; populate press logo strip (confirmed outlets only, C5); add milestones 2015 (Design Museum) + 2018 (Green Heroes); Journeys/Kate Rawles image; Why-Bamboo bamboo photo; testimonials blocks; **the stat (C1)** wherever it renders from `index.json`.

### Phase 3 — Product / PDP [CODE] — *gated by price decisions*
- Reconcile `bbc-kit-complete.liquid` (28 KB): reviews above the fold, total-cost bundle, fit guide, sticky buy-bar, trust row, "every kit funds…" cause line. Clone pattern to the 16 `product.kit-*` templates ([EDITOR] for the per-product JSON).
- **[EDITOR]** Kit Comparison prices → **£375 / £385** (currently £445/£335; `page.kit-comparison.json`); fix "COMPARRISON" heading; add 56.7% footnote.
- **[EDITOR]** Collections: mark sold-out kits (Road/City/Custom/Gravel) or restore stock — selling a sold-out multi-week build is the worst first experience.

### Phase 4 — Impact / Education / About / Workshops [CODE] + [EDITOR]
- **[CODE]** Consolidate 3 timeline variants → 1 (`bbc-timeline-enhanced`); kill the Material-Design palette in `bbc-workshop-blocks`/`bbc-workshop-complete`; add workshop video block.
- **[EDITOR]** **Impact page** (the funder-facing page): add the funder strip (Investec / National Lottery / LSBU / OCN), the **£280-per-learner vs £2,200–4,500** cost case, attributed testimonials, Timpson + FT, CIC signal. Decide "Watch Our Video" destination (currently links to a content page).
- **[EDITOR]** **Founder page:** delete orphan "the" typo; add the social-mission paragraph (Build to Bond, CIC, OCN, FT, Timpson).
- **[EDITOR]** 301 **Education → Schools** (byte-identical duplicate); remove Schools "1,544" + UCI/university logo wall + "£800" bike; restore £595/£125 OCN/£2,500 tiers + "500+ students".
- **[EDITOR]** Re-credit commercial workshops to **BBC London Ltd**; Team Building reads as the CIC being *funded by* the spend, add 56.7% ESG hook + price anchor.

### Phase 5 — Nav / IA [CODE]
- `bbc-header`/`bbc-footer` + JS: Frame-Kits dropdown, visible search, sticky auto-hide header, breadcrumbs, mobile bottom tab bar, structured footer with full registered address; pick one canonical Team-Building URL and 301 the other.

### Phase 6 — Blog / News [CODE] + [EDITOR] + redirects
- Merge the two parallel blogs (301), de-dupe press posts, add categories, rewrite meta descriptions (the FAQ meta is literally "Template"; 3 missing; 3 oversized — all in `templates`, [EDITOR]).

### Cross-cutting [CODE]
- Retire 6 hero variants → 1 (`bbc-hero.liquid`); deploy the already-built `bbc-carbon-calculator.liquid` to Why Bamboo; wire `bbc-instagram-feed.liquid` (needs API token).

---

## 5. SEO / technical (mostly [EDITOR], high-confidence wins)
- Replace `hello@`/`support@` everywhere with `info@` — **[CODE] done in sections; [EDITOR] still needed in `footer-group.json` + any `templates`.**
- Fix Support Centre broken links: real YouTube `@BamboobicycleclubOrg`, `mailto:info@`, `wa.me/447446930945` (confirm number).
- Meta descriptions: replace "Template", add 3 missing, trim 3 oversized, fix bare-brand homepage `<title>`.
- Grant the connected Google account access in Search Console (GSC returned 403) before SEO quick-wins.

---

## 6. Execution & verification protocol
1. Resolve Phase 0 decisions (§2) — especially **C1 (the stat)**.
2. I execute `[CODE]` work per phase, locally; run `shopify theme check` and Prettier.
3. **Preview before push:** push `[CODE]` to a **preview/dev** theme (not live) and verify via authenticated `?preview_theme_id=…` + screenshots (live `curl` fetches the live theme, not the preview).
4. You (or pull→edit→push with your OK) handle `[EDITOR]` content in the Customizer.
5. Re-run the relevant page from the vault audit's per-page note to confirm each finding closed.
6. Nothing publishes to live without your explicit instruction.

---

## 7. Source-of-truth fixes (vault) — so errors don't regenerate
Flagged in the vault audit; fixing these stops the website errors recurring:
- `BBC Narrative` L24: "In 2020… formalised as CIC" → **17 Feb 2025**.
- `BBC Company Info` L62: "90%+ completion (to confirm)" → **100% at HMP Lowdham Grange**.
- Add **Ian McMillan** as 2012 co-founder.
- Adopt **Lord Farmer Review (2017)** as the public citation for the 39% reoffending stat.
- Reconcile workshop locations (London / Amersfoort / Toulouse / Brighton).

---

*Companion docs: `~/Downloads/BBC-Task-Outputs/shopify-theme-audit/VAULT-AUDIT-FINDINGS.md` (content assets + 164-finding detail) and `Reports/Website Audit 2026-06/_Summary.md` (per-page evidence + ready-to-paste copy).*
