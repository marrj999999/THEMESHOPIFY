# Can we use reactbits.dev? — assessment
*2026-07-28 · verified against the repo source (DavidHDev/react-bits) and measured against our own theme*

**Verdict: no as a dependency. Yes, narrowly, as a reference to hand-port two or three
dependency-free effects into the CSS we already have — and even then the candidate list is thin,
because we already own the vocabulary.**

---

## What it is (verified, not from memory)

- Maintained by David Haz, `github.com/DavidHDev/react-bits` — 44,320 stars, essentially daily
  commits, last commit the day of this assessment. Not the unrelated `vasanthk/react-bits`.
- **139 components** (measured from `src/content/`; the README's "140+" is marketing):
  Backgrounds 45 · Components 40 · Animations 31 · Text Animations 23.
- **Licence: MIT + Commons Clause v1.0.** Commercial use *"as part of an application, website, or
  product"* is expressly permitted — that is exactly our case. The restriction is on reselling or
  redistributing the components *as a library*. **The licence is not the blocker.**

## Why it cannot be adopted

### 1. There is no script-tag path — this is architectural, not preference
Every one of the 139 components requires React 19, and components ship as **raw uncompiled
`.jsx`/`.tsx` source**. React 19 **dropped UMD builds entirely** (verified: `unpkg.com/react@19/umd/…`
404s). So there is no CDN drop-in. Using even one component means introducing **React plus a
JSX-compiling bundler** into a theme that today has *zero* runtime dependencies — `package.json`
carries only Playwright, stylelint and html-validate as dev tooling.

### 2. The weight, against a page that is already failing
Measured on `/pages/impact`, mobile, 4× CPU throttle + slow-4G:

| | |
|---|---|
| **LCP** | **6.06 s — poor.** LCP element is the hero image, served 1600px into a 390px viewport |
| Fonts | 628 KB / 10 files, incl. a single **414 KB `.ttf`** (Material Symbols, unsubset) |
| JS total | 1,524 KB — **our theme is 42 KB (3%)**, and 29 KB of that is jQuery pulled in by an app |
| App JS | 1,176 KB on *every* page. Hurts TBT; **measured not to be the LCP cause** |
| CLS | 0 — good |

Cost of adding react-bits, gzip, on top of that:

| Use | Minimum cost |
|---|---|
| React tax alone (react + react-dom-client) | **~97 KB** — before any component runs |
| One simple text animation (`CountUp`, via `motion`) | **~141 KB** |
| One WebGL background (`Silk`, via `@react-three/fiber` + `three`) | **~224 KB** |

For scale: our entire custom JS on that page is **~1 KB**. The cheapest possible use of this
library would multiply our own JS footprint by roughly **100×**, on a page already at 6 s LCP.

*(Note: bundlephobia reports `react-dom` at 1.4 KB — that figure is wrong, it resolves to an empty
re-export shim. The 92.5 KB above is a manual gzip of the actual client renderer.)*

### 3. Reduced-motion is the exception there, and a hard rule here
Only **4 of 139 components (3%)** guard `prefers-reduced-motion` — `Plasma`, `LogoLoop`,
`PixelCard`, `Shuffle`. The other 135 have no guard in source, including most GSAP/OGL/Three
backgrounds, which are exactly the effects most likely to cause vestibular problems.

`qa/MOTION.md` HARD RULE 2 is *"Reduced-motion = fully inert. Every animation lives inside
`@media (prefers-reduced-motion: no-preference)`"* — we have **33 such guards** in CSS. We would be
importing components that fail our own accessibility contract 97% of the time.

### 4. We already own the vocabulary
`MOTION.md` documents scroll reveals (`.rd-reveal`), staggered cascades (`.rd-stagger`), chip
stagger, marquees with pause controls, count-up, duotone develop, route-draw and a hover grammar —
all tokenised, all reduced-motion guarded. That is the same ground react-bits' Text Animations and
Animations categories cover.

### 5. It works against the distinctiveness goal
The plan's Part 4 names the problem: *"AI-generic output is what you get when you converge on
both"* usability **and** aesthetic convention. A 44k-star component library is the aesthetic
convention — its backgrounds and shimmer effects are recognisable on sight precisely because they
are widely used. Adopting it is a direct route back to the "every band looks templated" verdict
this redesign exists to fix.

---

## The narrow exception

**36 of 139 components (26%) carry no third-party dependency** — 23 are pure CSS/DOM + React state,
13 are hand-rolled Canvas2D/WebGL. For these, the *idea* is portable without touching their code or
licence: `Magnet`, `GlareHover`, `StarBorder`, `SpotlightCard`, `GradualBlur`, `LogoLoop`,
`ClickSpark`, `TextPressure`.

Honest filter against real BBC needs, though, and almost nothing survives:

| Candidate | Verdict |
|---|---|
| `CountUp` | **Forbidden.** MOTION.md HARD RULE 1 — credibility numbers never move |
| `LogoLoop` | Already have it — `bbcpr-scroll` press marquee, with a pause control |
| `GlitchText`, `FuzzyText`, `StarBorder` | Off-brand for a social enterprise talking about prisons and schools |
| `SpotlightCard` / `GlareHover` | We have a hover grammar (−4px lift). Marginal gain, adds a second idiom |
| `GradualBlur` | The one plausible fit — softening marquee edges. Perhaps 15 lines of CSS, written from scratch |

So the realistic answer is **one small idea worth borrowing**, implementable in our own CSS in
under an hour, with our own reduced-motion guard added because theirs wouldn't have one.

## What to do with the effort instead

Both dwarf anything this library could contribute, and both came out of the same measurement pass:

1. **Hero image is ~2× oversized on mobile** (1600px into a 390px viewport) and *is* the LCP
   element. The most direct route to fixing a 6 s LCP.
2. **414 KB of icon font as raw `.ttf`.** Subsetting to the ~40 glyphs actually used, or inlining
   them as SVG, would recover several hundred KB on **every page**. Atkinson Hyperlegible Bold is
   also fetched twice.

## Not verified

- Live reactbits.dev UI tabs — the site is a client-rendered SPA that returns only a `<title>` to
  fetch. The repo source that builds it was used instead.
- Exact tree-shaken size of OGL-based components (the 33 KB figure is the whole package).
- Whether any shader effect is adapted from a third-party source with separate terms. Searched for
  attribution comments and found none — no evidence either way.
