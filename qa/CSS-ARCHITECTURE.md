# CSS architecture — why sheets compete, and the way out

Written 2026-08-28 from measurements taken on the live theme (`CUSTOMTHEME20262`,
196820238710) and the preview (`198837993846`). Every number below was measured, not
estimated. If you change something here, re-measure with `qa/_bench.mjs`.

---

## 1. The problem, stated precisely

`layout/theme.liquid` loads the BBC sheets in this order:

```
base.css                    (Dawn)
bbc-foundation.css
bbc-buttons / bbc-layout / bbc-practical-spacing / bbc-accessibility
bbc-unified-styles.css
bbc-mobile-fixes / bbc-mobile-menu
component-*.css             (Dawn cart etc.)
bbc-video-responsive.css
bbc-aaa-2026.css
bbc-statement.css
bbc-universal.css           <- "single source of truth, MUST load last so its :root wins"
bbc-tokens.css              <- "THE type contract. Loads last so its :root wins"
bbc-align.css               <- "must load LAST of all stylesheets. Do not add stylesheets below this line."
bbc-consistency-2026.css    <- added below that line anyway
</head>
```

**Four files each claim to be the last word. Three of those claims say so in their own
header comments.** The cascade has exactly one "last", so at any moment at least three
are false.

And none of them actually wins. `bbc-redesign-2026.css` (148 KB, the real `rd-*`
component system) is emitted by `sections/bbc-header-2026.liquid` — from the **`<body>`**.
It therefore lands after everything in `<head>`. The one file that makes no authority
claim beats all three that do, purely because of where it is rendered.

That file's own comment already documents the consequence:

> "bbc-redesign-2026.css is re-emitted by ~10 later sections on a typical page (each
> renders its own stylesheet_tag), so the base file re-asserts its rules AFTER this
> inline block; class-level overrides here silently lose. ID specificity wins regardless
> of load order."

## 2. What that forces

When nobody can predict who wins, the only reliable tool is `!important`. It is now
load-bearing on structural selectors:

| file | selector | declaration |
|---|---|---|
| `bbc-universal.css` | `.bbc-rd h2/h3:not([class*="rd-fs-"]):not([class*="fs-"])` | `font-size … !important` |
| `bbc-align.css` | `.bbc-rd .rd-pad` | `padding-block … !important` (logical property) |

Both were hit head-on this session:

- **Nine** font-size rules matched one `.rd-cscard__heading`. The card's own 19px rule
  (specificity 0,3,0) lost to `bbc-universal.css` (0,3,1 **plus** `!important`). Result:
  29px headings, four lines, 130px of a 784px card.
- An override written as `padding-top` was a **silent no-op** because `bbc-align.css`
  sets `padding-block-start`. Same property, different syntax, no warning.

Once `!important` is structural, the only way to change anything is more `!important`.
Four were added on 2026-08-28 (`bbc-responsive-cards.css` §7, `bbc-responsive-layout.css`
§13). They work. Every one is a symptom, and each is commented with its clean alternative.

Downstream symptoms, all measured:

- **16 breakpoints** across the estate: 479, 480, 520, 600, 620, 640, 720, 749, 760, 820,
  821, 840, 860, 899, 900, 940, 980, 981, 1024, 1080, 1100, 1199, 1200
- `.rd-cscard__media` defined **3 times** in one file
- `.edt-*` / `.cml-*` (52 rules) inlined in `sections/bbc-programmes-2026.liquid`, because
  reaching the shared system was harder than not

## 3. Which sheet is canonical

Two different answers, and the gap between them *is* the problem:

- **Intended canon — `bbc-tokens.css`.** Newest (24 Jul), most principled. Defines
  `--type-*` as a real modular scale. Verified good: the 11 raw literals the ratchet
  caught on 2026-08-28 all mapped cleanly onto `var(--type-eyebrow|caption|button|body)`.
- **De-facto canon — `bbc-redesign-2026.css`.** 148 KB, holds the actual component
  system, and wins the cascade by load position.

The tokens are right. The system that overrides them is bigger.

## 4. The fix: cascade layers

One line in `theme.liquid`, before any stylesheet:

```css
@layer settings, base, components, utilities, overrides;
```

Then each file opens with `@layer components {` (or its tier). A rule in a later layer
beats an earlier one **regardless of specificity or source order**.

This removes the whole class of problem:

- It stops mattering that the header emits a stylesheet from the `<body>`
- The three "must load last" comments become true by construction
- Nearly every `!important` can be deleted, including the four added on 2026-08-28
- `--measure-lede`, `--type-*` and the breakpoints get exactly one home each

Support is universal (Chrome/Safari/Firefox since 2022). It is incremental — wrap one
file at a time; unwrapped files simply sit in the implicit outermost layer and keep
working.

### Layer assignment

| layer | files |
|---|---|
| `settings` | `bbc-tokens.css`, the `:root` half of `bbc-universal.css` |
| `base` | `base.css`, `bbc-foundation.css` |
| `components` | `bbc-redesign-2026.css`, `bbc-statement.css`, `component-*.css` |
| `utilities` | `bbc-align.css`, `bbc-practical-spacing.css`, `bbc-consistency-2026.css` |
| `overrides` | `bbc-responsive-cards.css`, `bbc-responsive-layout.css` (temporary — these should empty out) |

## 5. Order of work

1. **Declare the layer order** in `theme.liquid`; wrap `bbc-tokens.css` in
   `@layer settings`. Zero visual change. Establishes the contract.
2. **Wrap `bbc-redesign-2026.css` in `@layer components`.** The big one — it stops
   beating the token files and makes the intended canon actually canonical.
3. **Delete the `!important`s that only fought load order.** Start with the four from
   2026-08-28, then the `h2`/`h3` rules in `bbc-universal.css`, replaced by the
   `rd-fs-*` class its own `:not()` already anticipates.
4. **Collapse breakpoints to 640 / 1024** as each file is touched.
5. **Move `.edt-*` / `.cml-*`** out of `bbc-programmes-2026.liquid` into a component
   file. The page stops being special.

Steps 1–2 are roughly an hour and remove most of the pain. Steps 3–5 are opportunistic.

**Prerequisite:** authenticate the Shopify CLI. Every workaround on 2026-08-28 — the
stylesheet shim in `bbc-back-to-top.liquid`, the four `!important`s, being unable to add
an `rd-fs-` class — existed only because whole-file API writes made a 34 KB layout edit
unsafe.

## 6. Benchmark, 2026-08-28 (live -> preview)

`node qa/_bench.mjs "<pages>" <outdir>` — measured, three viewports, both themes.

| page | viewport | docH | tallest card | card h3 |
|---|---|---|---|---|
| programmes | laptop | 16668 -> 15183 | 810 -> 682 | 29px -> 20px |
| programmes | tablet | 18261 -> 17429 | 764 -> 686 | 21px -> 20px |
| programmes | mobile | 24408 -> 22132 | 764 -> 494 | 21px -> 17px |
| impact | laptop | 8728 -> 8296 | 763 -> 572 | 29px -> 27px |
| impact | mobile | 14984 -> 13630 | 689 -> 408 | 21px -> 17px |
| our-story-2 | laptop | 12941 -> 12275 | 548 -> 421 | 29px -> 20px |
| our-story-2 | mobile | 19329 -> 18122 | 499 -> 398 | 21px -> 17px |
| teambuilding | laptop | 10744 -> 10438 | 619 -> 458 | 29px -> 20px |
| teambuilding | mobile | 13059 -> 12576 | 540 -> 435 | 21px -> 17px |

Hero depth on `/pages/programmes` at laptop: **1055 -> 678px**. The other three heroes
were already 640px at laptop and are unchanged. No horizontal overflow on any page at
any viewport, before or after.

**One regression to watch:** `/pages/impact` at tablet, featured-card headings went
**21px -> 22px**. Cause is `clamp(22px, 2vw, 27px)` in `bbc-responsive-layout.css` §13 —
at 768px, `2vw` = 15.4px so it pins to the 22px floor. Lower the floor to 20px if the
1px matters.
