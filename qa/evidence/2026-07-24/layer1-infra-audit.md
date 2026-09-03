# Layer-1 QA infra — first actual execution (2026-07-24, evening)

Round-1 (517f3f1) wrote the Layer-1 infra and marked it wired. On first real
execution today, NONE of it had ever run. Both gates reported success while
doing nothing.

## 1. stylelint token-ratchet — never executed
gate-check.sh line 8 opened a quote that was not closed on its own line, so
`bash qa/stylelint-ratchet.sh || exit 1` became part of an echo string. The
gate PRINTED the command and continued to "✓ gate-check PASSED".
Fixed b6235a8 → now live: 163 literals, baseline 163.

## 2. visual regression — never executed, three separate bugs
  a. `playwright.config.ts` (legacy theme-smoke suite) out-ranks our `.mjs`
     in Playwright's config resolution → `--config` is mandatory.
  b. positional filter `qa/visual.spec.mjs` resolves against testDir:'qa'
     → `qa/qa/…` → "No tests found" (exit 1).
  c. `toHaveScreenshot('home-1280')` — Playwright requires the `.png`
     extension; all 48 errored before taking a shot.
Fixed b6235a8 + f79874f.

## 3. consent banner would have poisoned every baseline
Caught by eyeballing the first captured PNG, not by any green tick:
`#shopify-pc__banner` (239px fixed overlay) sat across the hero. Its
visibility depends on cookie state, so it would have produced a false diff
on every later run. Masked display:none (fixed-position → no layout shift;
no consent granted).

## Result
48/48 baselines captured vs draft 196820238710, then 48/48 PASS on a second
independent verify run → net is stable, no lazy-load/animation settle flake.
Baselines: qa/visual-baselines/, 77MB.

## Open for James
Storage: 77MB per baseline set; .git already 476MB (qa/evidence 169MB).
Git history is append-only, so each re-baseline adds ~77MB permanently.
Left UNTRACKED pending his call — gitignore (recommended; net works
identically on a single machine) vs commit as WORKFLOW 4.6 originally
specified vs shrink the matrix (fewer widths / viewport-only).

## Note on the legacy smoke suite
tests/theme-smoke.spec.ts fails 8/8 — missing bundled Playwright browsers
(`npx playwright install`), NOT a live-site defect. Our config uses system
Chrome, which is why the visual net runs.
