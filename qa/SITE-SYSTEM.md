# THE SITE SYSTEM — one standard, measured 2026-08-04

*James: "can we build a standard system throughout the complete site."*

**The headline: the system already exists and ~20 pages already follow it.** Two pages do not, and
one of those two is why Impact and Why Bamboo look different. This file states the system, shows
the evidence, and lists the three pages that sit outside it.

---

## The system, in one line

> **One bespoke `bbc-<page>-2026` section per page, composed from a shared vocabulary, governed by
> the six sequence rules in `PAGE-STANDARD.md`.**

### The evidence — every page template, audited

| architecture | pages |
|---|---|
| **1 bespoke section** | 10 kit PDPs (`bbc-product-2026`), impact, workshops, programmes, our-story-2, support-mission, build-to-bond, theory-of-change, impact-report, commissioners, which-kit, press-archive, amersfoort, collection |
| **bespoke + a video band** | home, schools, teambuilding, landing, education, product, parts |
| **assembled from generic bands** | **`page.why-bamboo` (13 sections)** · **`page.about` (11 legacy sections)** |

`bbc-product-2026` alone serves **10 templates**. That is the system working: one section, one
standard, ten pages.

**Why Bamboo is the outlier**, and it is the one page James compares unfavourably to Impact. It is
not a styling gap — the two pages are built by different methods:

```
Impact       1 section   bbc-impact-2026
Why Bamboo  13 sections  bbc-hero-band, bbc-stat-band, bbc-pillar ×3, bbc-section ×4,
                         bbc-comparison, bbc-logo-wall, bbc-statement, bbc-faq-section
```

A bespoke section is *composed* — one author controls where the dark bands fall, what opens each
band, what the stat band carries. Assembled generic bands are *stacked* — each carries its own
defaults and nobody owns the sequence. That is why Why Bamboo opens only half its bands with an
eyebrow, while Impact opens all of them.

> **Correction, 2026-08-04.** This section originally also blamed the architecture for Why
> Bamboo's five consecutive bone bands. That was wrong, and the error mattered: it made a
> content migration look necessary when the defect was four lines of CSS.
>
> The template alternated correctly the whole time. `.rd-paper` / `.rd-steel` / `.rd-dark` were
> descendant selectors (`.bbc-rd .rd-paper`) against markup that puts both classes on one element,
> so **every band on the site painted bone** regardless of what any template said. Adding the
> compound selectors took why-bamboo from 7 surface repeats to 2 and adjacent-darks to 0, with no
> template or architecture change at all (`ESCAPES.md` #41).
>
> The eyebrow gap this file cited was also overstated. S1 tested only for `.rd-eyebrow`, and
> `bbc-pillar` / `bbc-statement` render theirs under `.bbcpl-idx` / `.bbcst-eyebrow` — visibly
> present, scored as missing. **Why Bamboo is S1 83%, not 50%.**
>
> What actually remains: two bands with no eyebrow (its stat band and its final CTA) and a light
> stat band. On repeats, adjacent darks and CTA count it now equals Impact exactly. **Weigh the
> migration in item 2 below against that — it is a much smaller case than this file first made.**

---

## The five layers

Everything on the site should resolve to one of these. If it does not, it is the exception that
needs justifying.

| layer | what it is | where it lives | rule |
|---|---|---|---|
| **1 · Tokens** | colour, type, space, motion | `bbc-universal.css` (`:root`), `bbc-tokens.css` | never a raw value in a component |
| **2 · Primitives** | `.rd-btn` `.rd-card` `.rd-eyebrow` `.rd-lede` `.rd-stat` `.rd-wrap` | `bbc-redesign-2026.css`, `bbc-statement.css` | one class, one appearance, everywhere |
| **3 · Blocks** | editor-editable units — 9 in use | `blocks/bbc-*.liquid` | every block reveals; a block never sets its own surface |
| **4 · Bands** | a full-width strip: eyebrow → h2 → lede → content → ≤1 CTA | inside the page section | one surface, one device |
| **5 · Page section** | `bbc-<page>-2026` — the whole page | `sections/` | owns the band sequence |

The sequence rules that make layer 5 coherent are the six in `PAGE-STANDARD.md`
(S1 eyebrow on every non-hero band · S2 no two adjacent bands share a surface · S3 no two adjacent
dark bands · S4 one CTA per band · S5 four surfaces + one lime moment · S6 64/88 padding).

### Shared vocabulary, already built and working

| component | used by | status |
|---|---|---|
| `bbc-cscard` | case-study cards estate-wide | standardised 1 Aug, contract-tested by `casestudy-conformance.mjs` |
| `bbc-stories-band` | 13 sections | one band, factored out of five copies |
| `bbc-media` | 12 sections | image/video/YouTube renderer, aspect-locked |
| `bbc-icons` | 47 files | inline SVG, 46 icons |
| `rd-*` primitives | everywhere | the layout and type vocabulary |

This is the part that is genuinely good. The vocabulary exists, is shared, and is tested.

---

## What sits outside the system — three items, and only three

**1 · `page.why-bamboo` — 13 generic sections.**
The bespoke replacement **already exists**: `sections/bbc-why-bamboo-2026.liquid`, 1,022 lines,
38 settings, 5 block types, 9 bands that already alternate surfaces and already carry a forest
stats band. It has **never rendered** — the template does not reference it. Every past session
that "fixed Why Bamboo" by editing that file changed nothing.

Switching is **not** a one-line template swap: the page's content currently lives in the settings
of 13 separate sections and would have to migrate into the 38 settings of the bespoke one. That is
real work and it is James's content. But the destination is built.

**2 · `page.about` — 11 legacy sections.**
`bbc-page-hero`, `bbc-stats-section`, `bbc-founders`, `bbc-timeline`, `bbc-awards`,
`bbc-press-wall`, `bbc-epic-journeys`, `bbc-impact`, `bbc-community`, `bbc-impact-funder-cta`,
`bbc-testimonials`. `ROLLOUT-TRACKER.md` already rules on this: **retire the template**, point the
about page at `/pages/our-story-2` (which is bespoke `bbc-about-2026` and scores 100% on S1 with
zero surface repeats — the joint-best page on the site).

**3 · ~94 orphan sections and 23 unwired blocks.**
Not wrong, just dead. They cost nothing to keep and nothing to delete. Archive after publish;
`BLOCK-STANDARD.md` has the list.

---

## Where the system is measurably healthy

| dimension | state |
|---|---|
| Type roles | **identical on every 2026 page** — eyebrow 14/700, band h2 102/800, lede 22/400, button 15/700, card title 29/800 |
| Container | **1200px wrap, 32px gutter, everywhere** |
| Contrast | **1 finding across 15,428 nodes**, and it is an instrument artefact |
| Alignment contract | **passing**, 69 pages × 2 viewports |
| Case-study card | one component, contract-tested |
| Surfaces | four canonical + one lime moment; **no off-palette surface remains** |
| Motion tokens | 21.5% adherence (was 2.7%) — migration proven equivalent at 395,955 values |
| Blocks animate | 8 of 9 live blocks (was 0) |

**The type system was never the problem.** Every session that attacked "the CSS" was attacking
the wrong layer. The problem was always layer 5 — nobody owned the band sequence, and it was not
written down until `PAGE-STANDARD.md` on 3 Aug.

---

## Order of work to reach one standard everywhere

1. **`/pages/support-mission`** — eyebrows on 8 bands, split the 4-CTA band. It is already a
   bespoke section, so this is settings only. *Needs the eyebrow copy.*
2. **`/pages/why-bamboo`** — either (a) migrate its content into the existing
   `bbc-why-bamboo-2026` section and switch the template to one section, or (b) leave it assembled
   and impose S1–S3 on the 13 bands. **(a) is the system; (b) is the patch.** *Needs James.*
3. **Retire `page.about`** — point it at `/pages/our-story-2`. Tracker already rules this.
4. **Finish the motion migration** — ~254 durations remain; `.1 .12 .18 .25 .3 .4` need a role
   decision, which is judgement not automation.
5. **Archive the 94 orphan sections and 23 unwired blocks** after publish.

Items 1–3 are the whole gap. Everything else on the site already follows the system.
