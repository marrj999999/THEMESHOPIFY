# THE BLOCK + MOTION STANDARD — measured 2026-08-03

*`qa/BLOCK-SYSTEM.md` defines the block primitives and `qa/MOTION.md` defines four motion roles.
Both are good contracts. Neither had ever been measured against the theme. This file is what the
measurement found, and what the standard should actually be.*

Run `node qa/block-standard.mjs` to reproduce. Static analysis, about a second.

---

## Blocks — 32 exist, 9 are used, 0 animate

| | |
|---|---|
| blocks in the theme | **32** |
| referenced by a deployed template | **9** |
| built but never wired into anything | **23** |
| applying `.rd-reveal` | **0 of 32** |

**In use (9):** `bbc-accordion` · `bbc-case-study` · `bbc-comparison-row` · `bbc-group` ·
`bbc-heading` · `bbc-press-logo` · `bbc-stat` · `bbc-text` · `bbc-video`

**Never wired in (23):** badge, button, checklist-item, cta-card, endorsement, feature, founder,
funding-loop, geometry-row, image, journey, kit-card, location, milestone, need, partner-logo,
perk, press-item, programme, spacer, spec, step, testimonial

Two consequences:

1. **The 23 are not a library, they are a backlog.** They cost nothing to keep, but they should
   not be mistaken for the standard — the standard is the 9 that render. Anything new should
   either use one of the 9 or wire one of the 23 in deliberately.
2. **Blocks do not animate.** Every entrance animation on the site comes from a section applying
   `.rd-reveal` to its own markup. A block dropped into a band therefore appears instantly while
   the band around it reveals. That is the single biggest motion inconsistency on the site, and
   it is invisible to `motion-check.mjs`, which only tests four pages' band-level reveals.

> Until 2026-08-03 the repo tracked **1** of these 32 blocks. The other 31 existed only on the
> theme, so none of this was editable from git. All 32 are now committed and byte-identical to
> the deployed theme.

---

## Motion — the contract is real, the implementation is 2.7%

`MOTION.md` specifies four roles, defined in `bbc-universal.css` §11:

```
--mo-fast .15s   --mo-base .22s   --mo-entrance .45s   --mo-reveal .6s
--mo-ease cubic-bezier(.2,.7,.2,1)   --mo-ease-io cubic-bezier(.45,0,.25,1)
--mo-rise 14px / --mo-rise-sm 8px
```

Measured usage across `assets/`, `sections/`, `snippets/`, `blocks/`:

| | count |
|---|---|
| `var(--mo-*)` | **9** |
| hardcoded transition durations | **300** |
| hardcoded animation durations | **22** |
| **token adherence** | **2.7%** |

### The durations actually in the code

| duration | uses | role |
|---|---|---|
| **.2s** | **218** | **not a documented role** |
| .15s | 52 | `--mo-fast` |
| .3s | 47 | not a role |
| .18s | 28 | not a role |
| .25s | 17 | not a role |
| .1s | 12 | not a role |
| .4s | 11 | not a role |
| .12s | 8 | not a role |
| .22s | 8 | `--mo-base` |
| .6s | 5 | `--mo-reveal` |

**Eleven distinct durations where the contract defines four.** Six of them (.1, .12, .18, .2,
.25, .3) are all somebody's idea of "quick", within 200ms of each other, and no two agree.

### The important finding

**`.2s` is used 218 times and is not in the contract.** It is the de-facto base duration of this
theme — used more than every documented token combined, by a factor of twenty.

So the honest fix is not "migrate 218 call sites to .22s". It is:

> **Redefine `--mo-base` from `.22s` to `.2s`**, matching what the theme already does, then
> migrate mechanically. The 218 most common call sites then become token references with **zero
> visual change**, and the remaining outliers (.1/.12/.18/.25/.3/.4) collapse into `--mo-fast`,
> `--mo-base` or `--mo-entrance` by proximity.

Changing one token value is a far smaller risk than changing 218 timings, and it makes the
contract describe the theme instead of contradicting it.

### Where the work is

| file | hardcoded durations |
|---|---|
| `assets/bbc-redesign-2026.css` | 54 |
| `sections/bbc-home-2026.liquid` | 22 |
| `assets/bbc-why-bamboo.css` | 16 |
| `assets/bbc-statement.css` | 13 |
| `sections/bbc-footer.liquid` | 13 |
| `sections/bbc-header.liquid` | 13 |

Six files carry 131 of the 322. A migration that stopped there would take adherence from 2.7% to
roughly 43%.

---

## The standard, stated

**Blocks**
1. The standard block set is **the 9 in use**. Prefer them.
2. Wiring in one of the other 23 is a deliberate act — it needs a template change and a look.
3. **Every block that renders visible content applies `.rd-reveal`**, so a block entering a band
   moves with the band rather than snapping in. Currently 0 of 32 do.
4. A block never sets its own colours — surface and text colour come from the band
   (see the data-family lesson in ESCAPES #41: a background and a text colour set in different
   files are one unit).

**Motion**
5. No raw duration in `transition:` or `animation:`. Use `--mo-fast` / `--mo-base` /
   `--mo-entrance` / `--mo-reveal`.
6. Two easings only: `--mo-ease` for entrances and hovers, `--mo-ease-io` for positional moves.
7. Rise distance is `--mo-rise` (14px) or `--mo-rise-sm` (8px), never a new value.
8. The rules already in `MOTION.md` stand unchanged — reduced-motion fully inert, no `opacity:0`
   outside `@supports (animation-timeline: view())`, crop wrappers use `overflow: clip` never
   `hidden`, compositor-only properties, one marquee per page.

---

## Order of work

1. **Redefine `--mo-base` to `.2s`** — one line, no visual change, makes the contract true.
2. **Migrate the six worst files** (131 call sites) to tokens. Mechanical, verifiable with
   `css-fingerprint.mjs` for zero computed-style movement.
3. **Add `.rd-reveal` to the 9 blocks in use.** Visible change — needs James and a before/after.
4. Leave the 23 unwired blocks alone until one is actually needed.

Nothing here is a gate yet. `qa/block-standard.mjs` reports; it does not assert.
