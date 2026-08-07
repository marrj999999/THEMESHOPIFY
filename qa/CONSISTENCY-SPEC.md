# BBC Consistency Spec — the ten laws
*2026-08-07 · derived from the site-wide screen census (69 pages, draft theme 196820238710).
Full illustrated audit: https://claude.ai/code/artifact/71a542b7-e49f-4db4-8994-b718a9d36cbc
Companion to DESIGN-SYSTEM.md / BLOCK-SYSTEM.md — where those set the system, this sets the
component grammar every page is held to. Where this conflicts with observed pages, THIS WINS
until James amends it.*

| # | Component | The law |
|---|---|---|
| 1 | **Kickers** | dash + lowercase, 13–14px letter-spaced; lime on dark, soft-ink on light. No other eyebrow exists. *(Census: 267 CAPS vs 23 lowercase — flip the global transform.)* |
| 2 | **Buttons** | pill (999) only: primary filled · secondary outline · tertiary underlined link with →. Lowercase labels (proper nouns keep caps). No arrows or underlines on pills. Max one primary per band. Header "Make a bike." joins the pill system. |
| 3 | **Chips** | tags, never actions. CAPS 12px letter-spaced. Lime = category · ghost = on imagery · white = fact meta · `[ BRACKETS ]` = story-card tags. Gold is retired. "watch the film" becomes a tertiary link. |
| 4 | **Quotes** | two patterns only: **Pull** (no marks, caps micro-attribution) · **Quote card** (CSS curly marks + attribution). Grammar: **Name, Role · Source**. No leading dashes, no typed quote marks. Peer-reviewed chip pattern stays (fix its spacing). |
| 5 | **Case-study cards** | rd-cscard everywhere; lowercase titles; CTAs `read the story →` / `watch the film →` only; meta line = `year · source`; quotes never wear cards. |
| 6 | **Stat tiles** | value (surface-paired colour) + lowercase label + **required source micro-line** (the DESIGN-SYSTEM "no stat without a source" rule — currently only the impact page complies). |
| 7 | **Headings** | lowercase display sitewide; proper nouns + product/collection names keep caps; utility/legal pages don't get the 115px display scale. |
| 8 | **Surfaces** | paper · forest · lime · steel via tokens only. Two creams max (#E6DCC8, #EDE5D4 — #F1E9D8/#EFEAD8 retire). No citron #B9E84A. Never two darks adjacent; lime ≤1 per ~4 blocks; no gold near lime. |
| 9 | **Chrome** | breadcrumb on every non-home page including collections; one footer with newsletter; poster frame on every video embed. |
| 10 | **Enforcement** | flip `.stylelintrc.json` severity to error + wire an npm script; component checklist in the QA loop. A law without a gate is a suggestion. |

## Census facts worth keeping (2026-08-07)
- 50/69 pages speak rd-2026 fluently; Dawn-native: 11 collections + cart/search/blog/account/support-centre; legacy: gallery, FAQ, sustainability, size-guide, club-news, geometry pages.
- Wins to protect: exactly one H1 on all 69 pages · footer identical on 68/69 · botbar on 55 · Atkinson renders everywhere sampled (no Jakarta leak) · all 10 kit PDPs share one band sequence.
- Rogue page: `/pages/sustainability` (Calibri via pasted content, no newsletter, broken footer) — rebuild or fold into why-bamboo.
- Retired green `#073E27` still renders via Dawn button settings (2 buttons/page sitewide) + 5 schema defaults.
- Same quote, two anatomies: Timpson (impact vs impact-report) · Maker quote (impact vs support-mission) — consolidation targets.
- Census data + 69 full-page renders: session scratchpad `census/` (capture: Playwright, scroll-settled, preview URL).
