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
