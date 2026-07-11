# BBC Design Brief — LOCKED 2026-07-11
*James's decisions from the 38-question design brainstorm (dictated + pop-up rounds), 2026-07-11.
Companion to DESIGN-SYSTEM.md (tokens/type) and BLOCK-SYSTEM.md (primitives/rollout).
Where this conflicts with older docs, THIS WINS. Full execution plan: `~/.claude/plans/dial-it-up-yes-golden-aurora.md`.*

## Personality & type
- **Dial UP** the brutalist-editorial signature — oversized lowercase type, asterisk-footnote honesty, hard-cropped images. People don't read; be bold.
- **Atkinson Hyperlegible everywhere.** Fraunces/Hanken retired. Plus Jakarta Sans killed on Dawn chrome via CSS override (checkout stays Jakarta — Shopify-controlled).
- Lowercase headlines sitewide (James: more legible). Proper-noun audit always (OCN, HMP, product names stay proper case).
- Mission pages (impact, prisons, build-to-bond beats): same system, more sober — forest/paper-led, less lime, shared recognisable signature.

## Colour & surfaces
- **More lime** `#D4FD62` — the 1-per-4-blocks ration is relaxed. Keep: never two limes adjacent, AAA text pairs, no gold near lime.
- **Steel** `#DEE6F0` promoted — stand-out boxes / callouts.
- Commerce pages: test whiter/cleaner default vs paper in preview (undecided — decide by looking).
- Product photography: clean/white.
- Four surfaces stand: paper `#E6DCC8` · forest `#003C32` · lime · steel. Text pairs per BLOCK-SYSTEM §3c.

## Imagery & video
- 1000s of consented images (Shopify media library, ~/Desktop/BBC-Website-Image-Bank/). Adults free use; minors need release; **prison imagery = hands/detail only, never identifiable participants**.
- **Duotone experiments** on mission imagery: B&W + FOREST block on EXCLUSION + 80% black gradient on MULTIPLY (Brand Guidelines recipe). Debut on Impact; James judges.
- **Video-heavy**: `bbc-rd-home-teaser.mp4` / `bbc-rd-build-teaser.mp4`, GoPro build B-roll, snipped YouTube back-catalogue (top: carbon-wrapped joints, frame jig, sanding-the-grain — see vault Recyclable Video Inventory). James eyeballs every clip pre-ship (consent/face check).
- Motion: **more life** — scroll reveals, hover-play. `prefers-reduced-motion` respect stays mandatory.
- Fix the wince list: images, poor layouts, repeating content.

## Page decisions
- **NO new pages** (supersedes Jul-8 content plan): funders / prison-commissioner / Build-to-Bond content folds INTO the Impact page. CTAs repoint to Impact anchors. Small company — keep it simple.
- **Impact** = priority page. Must show the mission + the longevity (since 2012, 14 years). Free report download. Backed-by = names/logos only, NO £ amounts.
- **Homepage**: signpost = all 6 doors equal (Build · Workshop · Team day · School · Prison · Fund). Built-by-anyone band per vault Homepage Layout Research spec (4-column photo cards + stats strip + one-left-edge).
- Kit PDPs attack **"I can't build it"** first.
- Workshop £795 shown **after the sell** (and kill any "From £500").

## Components (build all)
Download-asset card · email-capture band · timeline band · comparison table · world map (45 countries) · quote walls (homepage + product pages; source: vault Story Bank, real named builders) · one-strong-quote elsewhere.
- Footer #1 job = **email capture** (Shopify native newsletter form), trust/CIC line below.
- Stats vary by audience: commerce → 4,000+ builders · 45 countries · since 2012 | mission → 90%+ · 4 sites · OCN.

## Logos
- Every project/page shows its relevant logos, **full colour** (not mono): funders (Investec, NLCF, LSBU), press (FT, Guardian, Inside Time, GCN, BikeRadar, road.cc, Designboom, Design Museum, Grand Designs, Huck), institutions ("as taught at"), corporate clients (Investec, Four Seasons, GM, Google, McLaren — James vouches, 2026-07-11).
- Every SVG needs a viewBox (else 300px floating box); `.rd-logocell` sizing rules.
- Press logos link to canonical blog articles where possible (Proof Bank canonical map).

## Hard requirements (checked at Gate 1, every page)
1. **All blocks editable** — text/images/URLs/colours as schema settings/blocks with presets. Zero hardcoded content.
2. **Unified CSS** — no new inline section CSS, no new hex; styles land in the consolidated sheet only.
3. Claims discipline — banned: 56.7% carbon · 28,000 PSI/stronger-than-steel · £11.41 · £280 · 100% completion · "36 countries" (→ 45). `scripts/claim-lint.sh` before every push.
4. OCN placeholder wording: "OCN Level 1 accredited" / "OCN Level 2 accredited" — exact titles swap later; never "Level 1 & 2" mushed.
5. Known fact fixes ride along: Build-to-Bond **2024** (not 2020) · "4,000+ **people trained**" (not bikes built) · **14 years** (not 13) · **£795** (not £500) · quotes attributed (Sally Allsopp, Industries Manager) · "Makers" language · info@ everywhere.

## Process
- Deploys to draft theme **196820238710** are unrestricted (James 2026-07-11 — it's not live). James reviews on the preview URL; **approval gates completion, not deployment**. MAIN `196739727734` untouchable. Never bulk `theme push`; templates via pull-edit-put-readback only.
- £0 budget. ASAP (weeks). Gate sequence + critique loop + ROLLOUT-TRACKER.md per the plan.
