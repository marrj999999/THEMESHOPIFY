# Using effects for originality — what actually works
*2026-07-28 · after reviewing all 139 reactbits components and measuring our own estate*

## The uncomfortable finding first

**Picking rarer effects from the same library does not buy originality.** Every designer browsing
reactbits picks from the same 139 components, and the popular ones are popular precisely because
they demo well. A site assembled from them is recognisable *as* a site assembled from them — which
is the "AI slop" verdict James gave in the first place.

Originality comes from binding a **technique** to **content only BBC has**. The technique is
commodity; the meaning is not.

And there is a bigger point the benchmark already made. `qa/CONTENT-AUDIT.md` and the 20-site peer
work found BBC's distinctiveness problem was **band grammar** — "every band is eyebrow → big
lowercase heading → grid of bordered cards" — not a shortage of effects. Effects are garnish on
that. The substance is `qa/research/anti-blocky-layouts.md`'s **12-device library (D1–D12), written
in July and still never applied beyond one page.** Applying it would move originality further than
any component here.

## Techniques worth taking, bound to things we own

Ranked by *how impossible they are for a competitor to copy*, not by how good the demo looks.

| # | Idea | Technique borrowed from | Why it is ours specifically | Cost |
|---|---|---|---|---|
| 1 | **Frame-draw on scroll** — a bamboo frame's geometry drawn as an SVG stroke that completes as you scroll | `ribbons` / our own `rd-ride` route-draw, already shipped on the impact map | A competitor cannot use a bamboo bicycle frame as their signature. It is literally the product, and the draw *is* the brand story — a frame being built. Uses a technique already proven in our codebase | SVG path + `stroke-dasharray`, scroll-driven. No library |
| 2 | **Spoke field** — a grid of short lines that orient toward the pointer | `magnet-lines` (verified: 9×9 grid of `<span>`s, a CSS transform and a mousemove handler — no library) | Lines that pivot around a point are **spokes**. For a bicycle club that is a native metaphor; for anyone else it is a generic cursor toy | ~20 lines vanilla JS + CSS transforms |
| 3 | **Roundel ring** — text on a circular path around the existing roundel | `circular-text` | We already own a roundel, and a text ring reads as a **wheel**. Doubly ours | Pure SVG `textPath`, zero JS |
| 4 | **Halftone/print texture on photography** | `dither` (the *idea* — its implementation needs three.js + postprocessing + fiber, so not portable) | Halftone is a print/craft cue that suits handmade bamboo. Pairs with the duotone treatment we already run | CSS blend-mode over the dot pattern already added to `.rd-dark`. No JS |
| 5 | **Gradual blur** on marquee edges | `gradual-blur` | Not original, but it fixes a real defect — the quote reel and press wall currently clip rather than fade | ~15 lines CSS mask |

## Explicitly rejected

| | Why |
|---|---|
| `count-up` | **Forbidden.** MOTION.md hard rule 1 — credibility numbers never move. Assessors read those |
| `magic-bento`, `chroma-grid` | Bento grids are now the single most recognisable AI-template shape |
| `glitch-text`, `star-border`, `electric-border`, `laser-flow`, `faulty-terminal` | Wrong register entirely for an organisation talking about prisons and schools |
| `image-trail`, `splash-cursor`, `blob-cursor`, `ghost-cursor` | Cursor toys. They photograph well and annoy real users; nothing to do with our story |
| `lanyard`, `ballpit`, `hyperspeed` | Heavy physics/3D for decoration. LCP is already 4.5 s on mobile |
| Anything WebGL | ~224 KB gzip minimum on a page that is still failing Core Web Vitals |

## What would actually move the needle, in order

1. **Apply the D1–D12 device library** beyond the impact page. Researched, written, unused. This is
   the band-grammar fix and therefore the real originality fix.
2. **R2a — validate the anti-sameness metrics against the 20 peers** (still pending in the plan).
   Template-repetition rate, device diversity, adjacency violations, box ratio, symmetry ratio,
   density runs. That converts "does it look generic?" from taste into a number we can hold
   ourselves to — and it tests the metric before anything is built on it.
3. Then, and only then, the effects above — as accents on a page whose structure already works.

**The ordering matters.** Effects on top of repetitive band grammar produce a decorated template.
Fixing the grammar first means the effects land on something already distinctive.

---

# R2a RESULT (2026-07-28) — the premise was wrong

`qa/sameness.mjs`, run over BBC's 5 Tier-A pages and 20 peers. 24 of 25 segmented; Patagonia
excluded (1 band — not trustworthy, so not averaged in).

| Metric | BBC median | Peer median | Who leads |
|---|---|---|---|
| Template repetition (% of bands in the single commonest shape) | **30** | **63** | **BBC by 2×** |
| Device diversity (distinct shapes ÷ bands) | **0.70** | **0.40** | **BBC** |
| Adjacency violations (neighbouring bands sharing a shape) | **0** | **3** | **BBC** |
| Max density run | **2** | **4** | **BBC** |
| Bordered-box bands (%) | **25** | **0** | **peers — 16 of 20 have ZERO** |
| Symmetric (50/50) splits (%) | **100** | **83.5** | peers |

**"Every band is eyebrow → big heading → grid of bordered cards" is not supported by the data.**
BBC leads on four of six metrics and is *half* as repetitive as the field. The redesign already
fixed the thing it was built to fix; the remaining gap is narrower and more specific than the
original verdict implied.

## The two real gaps

1. **Boxes — D6.** The peer field essentially does not box: median 0%, and **16 of 20 peers have no
   boxed band at all**. We sit at 25%, concentrated in **workshops (50%) and programmes (40%)**.
   Impact is already fine at 10%. So D6 should be applied *there*, not estate-wide.
2. **Symmetry — D4.** 100% of our two-column splits are 50/50 against a peer median of 83.5%.
   Asymmetric 7/3 and 8/4 splits are the fix, and they are cheap.

## Two measurement corrections this run (both caught before reporting)

- **Segmentation v1 was broken.** It walked every element keeping the "deepest" per position and
  returned 3–4 bands on pages known to have 10, with coverage 1.9 (double-counting wrappers).
  Rewritten to find the *band parent* and take its direct children — validated against
  `/pages/impact`, whose true count of 10 was established by an independent earlier audit.
- **The box detector was counting buttons.** First pass gave BBC **70%** vs a field median of
  **14%** — a five-fold gap that was pure artefact. The "boxes" were cookie-banner buttons, a
  hidden cart drawer, a hidden nav mega-panel and every CTA pill; Switchback's "5 boxes" were all
  `<input>`s. Excluding interactive controls, hidden chrome and pill-sized elements gives the real
  figures above. **This is ESCAPES #16 recurring in a new tool** — the same trap, caught the same
  way, by listing what was actually counted.

## Revised priority

Not "apply D1–D12". The measurement says apply **two** devices where the gaps are:
**D6 to workshops and programmes**, and **D4 wherever a 50/50 split exists**. The other ten devices
have no measured deficit behind them, and applying them for completeness would be change without
evidence.
