# THE MOTION SYSTEM — contract (2026-07-24)

One tokenised motion vocabulary for the whole theme. Source of truth: `assets/bbc-universal.css` §11.
Verification tool: `qa/motion-check.mjs` (the feedback loop — run after ANY motion-affecting change).

## Research the values trace to
| Source | What it settled |
|---|---|
| caniuse (2026-06) | `animation-timeline: view()`: Chrome/Edge 115+ · Safari/iOS 26 · Firefox 155+ · ~84% global → scroll-driven is the engine; the other ~16% get the complete static page |
| Kowalski, *Great Animations* | UI motion < 300ms · ease-out entrances · never animate keyboard-repeat actions · transform/opacity only · interruptible |
| MDN scroll-driven animations | `animation-range: entry …` recipes · nth-child range offsets for stagger · compositor-safe: transform/opacity/filter |
| WCAG 2.2 §2.3.3 + prefers-reduced-motion | interaction-triggered motion must be disableable → ALL BBC motion is inert under reduced-motion |
| This theme's own history (2026-07-24) | `overflow-x:hidden` on html/body/sections/cards made EVERY timeline inactive for weeks — crop-wrappers now use `clip` |

## Tokens (never write raw durations/easings again)
| Token | Value | Use |
|---|---|---|
| `--mo-fast` | .15s | hover feedback, micro-interactions |
| `--mo-base` | .22s | menus, filter rises, small entrances |
| `--mo-entrance` | .45s | card/chip content entrances |
| `--mo-reveal` | .6s | band-level reveals (statement's values = equivalents) |
| `--mo-ease` | cubic-bezier(.2,.7,.2,1) | entrances + hovers (out) |
| `--mo-ease-io` | cubic-bezier(.45,0,.25,1) | positional moves |
| `--mo-rise` / `--mo-rise-sm` | 14px / 8px | entrance travel distances |

## The vocabulary (what exists, where defined, where used)
| Name | Kind | Defined | Use |
|---|---|---|---|
| `.rd-reveal` (rd-rise / rd-rise-safe) | scroll-driven band reveal | bbc-statement.css | any band/card; impact uses the .3-opacity-floor safe variant |
| `rd-chip-in` + `.rd-cscard__outs li` | scroll-driven chip stagger | universal §11 | flagship outcome chips; any small stat row |
| `.rd-stagger` | scroll-driven children cascade | universal §11 | card grids (evidence wall live; doors/pillars candidates) |
| `rd-wordmark-rise` | scroll-driven signature | universal §11 | footer giant wordmark |
| `rd-duotone-develop` | scroll-driven brightness develop INTO the duotone treatment | universal §11 | `.rd-duotone > img` (mission imagery) |
| `.rd-evin` (rd-evin) | time-based filter rise | universal §11 | evidence-wall filter changes (JS adds class) |
| hover grammar | transition | universal §11 (+ legacy equivalents in redesign/statement) | cards lift −4px, buttons −2px, always `--mo-fast` |
| `rd-roll` / `bbcpr-scroll` | marquees | statement / bbc-press | quote reel + press reel ONLY — one marquee per page, always with a pause control |
| `rd-ride` | route draw | statement | impact map |
| `rdItemIn`, `rd-macc-in` | nav/accordion micro | redesign / header section | tokenised `--mo-base` |
| `bbcm-breathe/spin` | player affordance | bbc-media snippet | signature player (grandfathered snippet-local) |
| count-up | JS | bbc-stat-countup.js | stats — **credibility/funder numbers render instant** (Impact lesson); reduced-motion aware |
| Dawn `scroll-trigger` | IO-based | animations.js (Dawn stock) | Dawn commerce sections — leave alone |
| `rd-tick-draw` | scroll-driven tick draw | universal §11b | `.rd-dim` stat-band dimension ticks — engineering-drawing draw, nth-child stagger |
| `rd-bar-grow` | scroll-driven bar growth | universal §11b | why-bamboo comparison bars grow to value, origin left |
| `rd-path-draw` | scroll-driven SVG route draw | universal §11b | impact frame diagram — the two pathway routes draw themselves (dasharray inside @supports so no-support = full stroke) |
| hover imagery zoom | transition | universal §11b | door/card/cscard/path images scale 1.035 on hover, `--mo-base` |
| count-up (rows) | JS | bbc-stat-countup.js | EXTENDED 2026-08-09 to `.ew-proof b`, `.rd-heroproof b`, `.acc-stats li > b` per owner instruction |
| `.rd-stagger` rollout | (existing) | markup | now on: home doors grid · acc-cards · kit grid · impact rd-paths · PDP rd-g4 ×2 (design-dimmed children — loop arrows, logo strips — excluded: motion-check reduce-context rule) |
| acc-stats tick draw · kicker dash draw · culm-node draw | scroll-driven | universal §11b | rd-tick-draw reused on `.acc-stats li::before`, `.rd-eyebrow::before`, `.rd-timeline.rd-culm .rd-tl::before` |
| footer counting ribbon | JS count-up | bbc-footer-2026 `count_ribbon` setting | Register-approved figure, blank = off |
| **motion-smoke** | test suite | qa/motion-smoke.spec.mjs (`npm run test:motion`) | live-behaviour assertions both contexts; caught the dead-bar timeline (rule-4 violation) on first run |

## HARD RULES
1. **Evidence, credibility numbers and prices NEVER move** — AMENDED 2026-08-09 by owner instruction (James: motion on stats): stat ROWS may count-up (settling on the exact figure, reduced-motion inert); **pre-marked `.bbc-counted` record bands, MOJ-sourced figures and all prices stay instant**. No marquee or parallax on anything an assessor reads.
2. **Reduced-motion = fully inert.** Every animation lives inside `@media (prefers-reduced-motion: no-preference)`.
3. **No support = complete page.** No `opacity:0`/hidden initial state outside `@supports (animation-timeline: view())` — the class of bug that blanked Firefox. motion-check enforces mechanically.
4. **Crop-wrappers hosting animated children use `overflow: clip`, never `hidden`** — hidden creates a scroll container and silently kills every timeline inside.
5. **Compositor-only:** animate transform / opacity / filter. Nothing that triggers layout.
6. **One marquee per page maximum**, always pausable.
7. **New keyframes live in universal §11 only** (snippet-local micro-motions are grandfathered and listed above). motion-check flags violations.
8. **Heroes render instantly** — no load-gated entrance on above-the-fold content; scroll-triggered only.

## Adding a new animation — the checklist
1. Does it serve comprehension (reading order, affordance, place) — or is it decoration? Decoration needs a signature-moment argument (max ~1 new per page).
2. Tokens only; compositor properties only; both guards (`prefers-reduced-motion` + `@supports` if scroll-driven).
3. Define in universal §11 with a one-line comment; add a row to the vocabulary table above.
4. Run `node qa/motion-check.mjs` → all green (both contexts).
5. Screenshot triple (pre-entry / mid / settled) both widths → evidence folder → James feels it on the phone.
