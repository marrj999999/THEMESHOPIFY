# THE STANDARD LOOK — measured from /pages/impact, 2026-08-03

*FORMULA.md fixes the type roles and band anatomy. It does not say what a page should look like
as a **sequence** — which surface follows which, how often a dark band appears, how a band opens.
That is what makes one page feel like the site and another feel borrowed. This file measures it.*

**Everything here was measured at 1280 on draft `196820238710`, not designed in the abstract.**
Impact is the reference because FORMULA.md says so ("every other page inherits this verbatim")
and because James built it. `/pages/our-story-2` scores as well or better on every rule and is
treated as the second exemplar.

---

## The standard, in six rules

| # | Rule | Impact | our-story-2 |
|---|---|---|---|
| S1 | **Every non-hero band opens with an eyebrow** | 100% | 100% |
| S2 | **No two adjacent bands share a surface** | 2 repeats (the paper tail) | **0** |
| S3 | **No two adjacent dark bands** — a light band always separates them | 0 | 0 |
| S4 | **One LOOSE CTA per band**, hero excluded — a CTA inside its own card does not count | **1** | 2 |
| S5 | **Surfaces come from four** — forest, paper, bone, steel — plus at most one lime moment | 4 | 4 |
| S6 | **Band padding is 64px, 88px for the opening band** | 64 / 88 | 64 / 88 |

S4 is the rule Impact holds most strictly: **every non-hero band on it carries exactly one loose
CTA or none.**

**The equal-doors carve-out (added 2026-08-04).** The first cut of S4 counted every `.rd-btn` in a
band, which flagged `/pages/support-mission` at 4 — its funding ladder, where each rung is a
funding tier with its own CTA. FORMULA §1 already carries exactly this exception: *"max one
primary per band — EXCEPT deliberate equal-doors card grids (James 2026-07-13: get-involved
3-CTA, homepage signpost)"*. A CTA inside its own card is part of that card, not a competing ask.
S4 now counts only **loose** CTAs — those not inside a card, article or rung. The defect was in
the rule, not the page.

### The dark-band rhythm

Impact alternates dark and light for its whole first half, then settles:

```
forest(hero) → steel → forest★ → paper → forest → bone → forest → paper → paper → paper
```

Two things to copy:

1. **A light breather sits between the dark hero and the next dark band.** On Impact that is the
   steel band. It is why the stat band can be dark at all without breaking S3 — and it is the
   single mechanism the other pages are missing.
2. **The stat band is dark**, which is what turns the figures lime. The figures themselves are
   identical sitewide (52px/800, Atkinson, ls −1.04px); only the surface under them differs, and
   the colour follows the surface automatically.

### The stat band recipe

Impact's stat band is not just "dark". It carries, in order:
eyebrow → ghost numeral (`.rd-ghostnum`, e.g. "2012") → the four figures → one CTA.
A stat band with none of that reads as a plain row of numbers, which is the difference you see
between Impact and Why Bamboo.

---

## Where the estate stands against it

Measured across the nine 2026 pages, same run:

| page | bands | S1 eyebrow | S2 repeats | S3 adj-dark | S4 max CTA | stat band |
|---|---|---|---|---|---|---|
| **/pages/impact** | 10 | **100%** | 2 | **0** | **1** | dark + ghost |
| **/pages/our-story-2** | 8 | **100%** | **0** | **0** | 2 | light |
| /pages/schools | 11 | 90% | 1 | 1 | 2 | dark |
| /pages/bicycleteambuilding | 10 | 89% | 1 | **0** | 2 | — |
| / (home) | 11 | 90% | 2 | 1 | **3** | — |
| /pages/workshops | 12 | 82% | 1 | **0** | **3** | **light** |
| /pages/programmes | 11 | 80% | 1 | 1 | 2 | — |
| **/pages/why-bamboo** | 13 | **50%** | 2 | **0** | **1** | **light** |
| **/pages/support-mission** | 10 | **100%** | **0** | **0** | **1** | — |

No off-palette surfaces remain anywhere (S5 clean) — the homepage cream band was the last one.

**Re-measured 2026-08-04, after the surface fix.** The two rows above changed materially and the
reason matters more than the numbers.

**`/pages/support-mission` was 11% / 4 repeats / 4 CTAs.** Eight eyebrows and three paper bands
took it to 100% / 0 / 1. Two of those "4 CTAs" were the rule's fault, not the page's — see the
equal-doors carve-out above.

**`/pages/why-bamboo` was 7 repeats, including five consecutive bone bands.** It is now 2 and 0.
The five-bone run was **never in the template** — the template alternated correctly all along.
`.rd-paper`, `.rd-steel` and `.rd-dark` were written as descendant selectors (`.bbc-rd .rd-paper`)
while `bbc-section` emits both classes on one element (`<div class="bbc-rd rd-paper">`), so every
band on the site fell through to `.bbc-rd{background:var(--bone)}` and painted bone. The surface
system had never rendered. Full post-mortem: `ESCAPES.md` #41.

Its sequence now:

```
forest(hero) → paper → steel → bone → bone → paper → steel → paper → forest → bone → bone → paper → forest
```

**What is still genuinely wrong with why-bamboo** is S1 — eyebrows on half its bands — and the
light stat band. Those are content decisions, not cascade bugs.

---

## Why the obvious fix is wrong

Making the Why Bamboo and Workshops stat bands dark, on their own, **breaks S3**. Both pages put
the stat band immediately after the dark hero, where Impact inserts the steel breather:

```
Impact        forest(hero) → steel → forest★     ✓
why-bamboo    forest(hero) → paper★              → make it dark and you get forest → forest ✗
workshops     forest(hero) → paper★ → forest     → make it dark and you get three darks in a row ✗
```

So the change is **insert a light breather, then make the stat band dark** — a band-structure
change, not a colour swap.

*(Updated 2026-08-04: why-bamboo's second band reads `paper` rather than `bone` now that the
surface selectors resolve — but it is still the band directly after the dark hero, so the
conclusion is unchanged. The five-bone run this paragraph also used to cite was a cascade bug,
now fixed; the breather argument stands on its own.)*

---

## Architecture note found while measuring

`sections/bbc-why-bamboo-2026.liquid` contains `.rd-wb-statsband{ background:var(--forest) }` —
a forest stat band that would already match this standard. **It never renders.** Neither that
class nor its `.bbc-rd-whybamboo` wrapper exists on the live page: `/pages/why-bamboo` is
assembled from 13 generic band sections (`bbc-hero-band`, `bbc-stat-band`, `bbc-pillar` ×3,
`bbc-section` ×4, …). The bespoke section is orphaned, which is why editing it fixes nothing.

`bbc-stat-band.liquid` already offers a **"Dark (lime numbers)"** background option. The Why
Bamboo instance is set to `"paper"`. That is a one-value change in `templates/page.why-bamboo.json`
— protected content under CLAUDE.md rule #4, so it needs James, and it should land together with
the breather rather than alone.

---

## Order of work

1. **`/pages/support-mission`** — add eyebrows (S1), split the 4-CTA band (S4). Biggest visible
   gain, no structural change.
2. **`/pages/why-bamboo`** — insert a light breather after the hero, set the stat band dark,
   break the five-bone run. Fixes S1, S2, S3 and the stat-colour complaint together.
3. **`/pages/workshops`, `/pages/programmes`, `/` (home)** — single adjacency or CTA-count fixes.
4. Leave `/pages/our-story-2` alone. It is already the standard.

Checked by `node qa/page-standard.mjs [--all]`.
