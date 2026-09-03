# THE MASTHEAD SCALE — universal type system (2026-07-22)

One scale, defined in `assets/bbc-tokens.css` (loads last, wins), used by every page. This doc is the
contract + the research that set it.

## Research — 11 reference points (measured 1280px unless noted)
| # | Source | Display/headline | Body | Note |
|---|---|---|---|---|
| 1 | The Guardian (home, measured) | 28px w500 | 24px | dense news grid — NOT our genre |
| 2 | NYT (home, measured) | 28px w300 | 22px | same — density-first |
| 3 | Pudding.cool (measured) | 32px | 14px | editorial viz |
| 4 | Stripe Press (measured) | 21px | — | book UI |
| 5 | Material Design 3 (doc) | Display L **57px** | 16 | app ceiling |
| 6 | IBM Carbon (doc) | scale tops **92px** | 16 | 4px-grid stepped scale |
| 7 | BBC GEL (doc) | limited scale + "larger contexts" | 16+ | ≤60ch lines · **-0.03em tracking on bold >18px** · AA contrast table |
| 8 | Serendie (doc) | 64px cap | 14–16 | harmonic scale |
| 9 | LearnUI 2024 guidance | 30–50px, "can probably go bigger" | 16–18 | conventional web |
| 10 | Editorial clamp() practice | `clamp(40px, 8vw+1rem, 100px)` | — | 100px = common editorial hero ceiling |
| 11 | Brutalist/oversized-type genre (Dribbble corpus + our brief) | 100–140px display | 16–18 | the genre we ARE |

**Conclusion — how big can we go:** the constraint isn't a standard (WCAG sets no max) — it's (a) headline
line-count at our wrap width, (b) hierarchy headroom (h1 > h2), (c) zoom behaviour. Mainstream news is
irrelevant to our genre; the oversized-editorial ceiling is ~100–140px. We take **~124px display** — a
step beyond every documented system ceiling, distinctly "masthead", while long heroes (Programmes) still
wrap ≤5 lines at desktop.

> **2026-07-24 correction.** This document has described `assets/bbc-tokens.css` as the contract
> ("loads last, wins") since 22 Jul, and the tracker recorded it deployed — **but the file did not
> exist** (404 on local, draft and live). Three scales were running at once: this doc, a set of
> stale orphan `--fs-*` tokens in `bbc-universal.css` that *nothing consumed* and that disagreed
> with the doc, and hardcoded `!important` rules that actually won.
> The good news from the audit: **the rules that win already match this doc** — h1 measures
> 115.2px (9vw @1280) and h2 94.72px (7.4vw) on home/impact/programmes/workshops. The canon was
> right; only its plumbing was fiction.
> The file now exists and loads last, defining a `--type-*` namespace that collides with nothing —
> verified a visual no-op (48/48). Sections repoint at it incrementally rather than in one blind
> pass. The legacy `--fs-hero/--fs-h1/--fs-h2/--fs-lede` tokens are dead (0 consumers) and should
> be deleted once nothing references them; `--fs-h3` still has 1 consumer.

## THE SCALE (canonical values — tokens in bbc-tokens.css, `--type-*` namespace)
| Role | Value | @1280 | Notes |
|---|---|---|---|
| Display (hero h1) | `clamp(3.4rem, 9vw, 7.75rem)` | **115px** (cap 124) | lh .95 · tracking -0.025em |
| Band h2 | `clamp(3rem, 7.4vw, 6.4rem)` | **95px** (cap 102) | lh .97 · always < h1 |
| Sub-head h3 | `clamp(21px, 2.3vw, 29px)` | 29px | lh 1.12 |
| Article headline | `clamp(2.2rem, 4.2vw, 3.5rem)` | **54px** (cap 56) | lh 1.05 · blog posts only (`.rd-art-hero h1`) — editorial titles run 8–12 words, display would wrap 6+ lines. Added 2026-07-22 audit. |
| Prose headings (page body RTE) | h3 role values | 29px | `.rd-prose h1/h2` — admin-typed content must read as a document, never masthead. Added 2026-07-22 audit. |
| Lede | 22px | 22 | lh 1.6 |
| Body | **18px** | 18 | lh 1.5 (brief-locked) |
| Buttons | 15px w700 | — | pill standard |
| Eyebrow/chips | 14px w700–800 | — | letterspaced |
| Captions/sources | 13–14px | — | never below 13 |

## AAA accessibility decisions (WCAG 2.2)
- **Contrast**: body text ≥7:1 (AAA); display/large text (≥24px or ≥18.66px bold — ALL our headings)
  ≥4.5:1 (AAA large). Verified programmatically on the live draft (see evidence log).
- **1.4.4 Resize/zoom**: `vw` mid-terms ignore browser zoom (research catch) — the REM floor/ceiling
  carry zoom: at 200% zoom clamp resolves to its rem cap → text doubles. Verified.
- **1.4.12 text spacing**: no fixed-height text containers in the rd- system; lh ≥1.5 body.
- **1.4.8 (AAA visual presentation)**: body measure ≤66ch (`--measure`), text-align left, no justify.
- Reduced-motion: all reveals/marquees guarded (already system-wide).

## The unique-UX signature (what makes it OURS, not a template)
Masthead-scale lowercase Atkinson (124px ceiling — beyond documented systems) · the ✱ footnote system ·
lime ticket chips · one-left-axis grammar · duotone-resolve media. The scale is the loudest part of the
brand voice; everything else stays quiet (GEL-style restraint below the display level).

## Rules
Never introduce a new font-size — use the roles above. Hero must render ≤5 lines at 1280 and ≤6 at 390
(re-copy if longer). h2 never ≥ h1 on the same page. All new text passes the AAA pairs already in tokens.
