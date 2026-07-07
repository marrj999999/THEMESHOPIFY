# CSS / design-system pass — 2026 redesign

**Date:** 2026-06-11. A `frontend-design`-lens review of `assets/bbc-redesign-2026.css` as a design system: type scale, spacing rhythm, colour, radius, shadow, depth, motion, distinctiveness. Code-grounded (exact value inventory), since the sandbox can't be rendered here.

## Strengths — keep, don't touch
- **The stamp-card motif** (offset hard shadow + 2.5px ink border + tight 6px radius) is a genuine, ownable signature — not generic. The 4→6px button / 5→8px card hover-shadow progression is intentional, not inconsistency.
- **Cohesive, accessible system:** Atkinson Hyperlegible + forest/bone/lime/gold, all `--rd` tokens, `.bbc-rd`-scoped. AAA contrast, `:focus-visible` rings, reduced-motion gating, dark-section radial-glow depth, the lime "stamp-tick" before every eyebrow.

## Applied this pass (layout-safe)
- **Half-pixel scale cleanup:** collapsed 12.5/13.5/14.5/15.5px → 13/14/15/16px (13 instances). Removes four pointless near-duplicate steps from the type scale; imperceptible per element, cleaner system. theme-check clean.

## Recommended — visible, needs your sign-off on the preview
These improve perceived quality but change pixels, so I've held them for your eye rather than guessing blind. I can apply any/all and you review at `?preview_theme_id=195991470454`.

1. **Type scale (the #1 opportunity).** The 13–22px band still has too many near-duplicate steps (13/14/15/16/17/18/19/21/22). A clean modular scale (~1.2 ratio) sharpens hierarchy:
   `12 · 14 · 16 · 18 · 21 · 26 · 32 · 46 · 86`, with roles — micro/eyebrow 12–13, small 14, **body 16**, lead-in 18, sub-head 21, then the heading clamps. Map the migration `rd-fs-*` one-offs onto it. This is the change that would most "lift" the design.
2. **Spacing rhythm.** Adopt an 8px base scale (8/16/24/32/48/64/88). Current values (mt 20/32/48; pad 88/60; gaps 22/18) are close — nudging to the scale tightens vertical rhythm. Low risk, real polish.
3. **Light-section depth.** Dark sections have a radial glow; the bone/paper sections are flat. A *very* subtle warm gradient or fine grain on the large light sections adds atmosphere (the frontend-design principle: depth over flat fill). Background-only, layout-safe — but subjective, so worth your eye.
4. **Radius tidy (minor).** Search box & menu button 9px, search-result item 7px → fold to the 8px base. Keep the stamp's intentional 6px and the 12/14px container radii.
5. **Colour (your call, parked).** Brand alignment: forest `#073e27` (build uses #003C32) and cream `#f5f0e8` (build invented bone/paper). And `--steel #DEE6F0` is the one cold note in a warm palette — consider warming it (or keep, since the brand does have a steel-blue accent).

## Suggested next step
Say the word and I'll apply **#1 (type scale) + #2 (spacing)** — the two with the biggest visible payoff — then you review on the preview. #3 (depth) and #5 (colour) after, once you've seen the type/spacing land.
