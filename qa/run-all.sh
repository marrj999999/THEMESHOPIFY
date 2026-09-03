#!/usr/bin/env bash
# THE COMPLETE GATE RUN — every check, in the order that makes them trustworthy.
#
# James, 2026-07-31: "create a complete workflow and push through."
#
# Running the gates in the wrong order, or in parallel, produced several false results today.
# This encodes what was learned the hard way:
#
#   · CANARY FIRST. A passing gate is not evidence until it has been shown capable of failing.
#     Nine gates were once green while executing nothing. If the canary is dead, nothing below
#     it means anything, so we stop.
#
#   · NEVER RUN TWO BROWSER SUITES AT ONCE. Concurrent Playwright runs caused a transient
#     "no bands found" on a one-band page, which the proof-of-life guard correctly refused to
#     certify — a 12-minute run thrown away for nothing.
#
#   · ESTATE-CHECK LAST, AFTER A PAUSE. It crawls every internal link. Run straight after other
#     suites and the store rate-limits it: 17 links reported "dead" that all return 200 on a
#     quiet connection. The sleep is not padding, it is the difference between a real result
#     and a fabricated one.
#
#   · SCHEMA BEFORE TEMPLATE, ALWAYS. Shopify silently strips block settings that are not in the
#     section schema at save time. Push sections first, then templates — never the reverse.
#     (Not enforced here; it is a push-order rule, stated so it is not forgotten.)
#
# Usage:
#   bash qa/run-all.sh            # full estate
#   bash qa/run-all.sh --quick    # representative subset, no estate-check
set -uo pipefail
cd "$(dirname "$0")/.."

QUICK=0; [[ "${1:-}" == "--quick" ]] && QUICK=1
FAILED=(); PASSED=()

step () {                      # step <name> <command...>
  local name="$1"; shift
  printf '\n\033[1m── %s\033[0m\n' "$name"
  if "$@"; then PASSED+=("$name"); printf '   \033[32m✓ %s\033[0m\n' "$name"
  else FAILED+=("$name");  printf '   \033[31m✗ %s\033[0m\n' "$name"; fi
}

printf '\033[1m═══ BBC THEME — COMPLETE GATE RUN ═══\033[0m\n'
date '+%Y-%m-%d %H:%M'

# 1 ── PROOF OF LIFE. Everything below is meaningless if these cannot fail.
printf '\n\033[1m── canary (are the gates alive?)\033[0m\n'
if node qa/canary.mjs --skip-visual; then
  printf '   \033[32m✓ canary\033[0m\n'; PASSED+=("canary")
else
  printf '   \033[31m✗ CANARY DEAD — stopping. A dead gate manufactures false confidence.\033[0m\n'
  exit 1
fi

# 2 ── STATIC. Cheap, no browser, so they run before anything slow.
step "claim-lint + schema + token ratchet" bash qa/gate-check.sh
step "liquid syntax (all sections + snippets)" node qa/liquid-check.mjs

# 3 ── RENDERED. One at a time — see the note on concurrency above.
if [[ $QUICK -eq 1 ]]; then
  step "alignment contract"        node qa/layout-audit.mjs --assert
  step "case-study conformance"    node qa/casestudy-conformance.mjs
  step "pixel contrast (WCAG AA)"  node qa/contrast-check.mjs
  step "video sources (YouTube only)" node qa/video-source-check.mjs
else
  step "alignment contract (69 pages × 2 viewports)" node qa/layout-audit.mjs --all --assert
  step "case-study conformance"    node qa/casestudy-conformance.mjs --all
  step "pixel contrast (WCAG AA)"  node qa/contrast-check.mjs --all
  step "video sources (YouTube only)" node qa/video-source-check.mjs --all
fi
step "motion + reduced-motion" node qa/motion-check.mjs

# 4 ── VISUAL REGRESSION. Never re-baseline to green without decomposing the diff first.
step "visual regression" npx playwright test --config=playwright.config.mjs

# 5 ── ESTATE. Last, and only after the store has been left alone for a moment.
if [[ $QUICK -eq 0 ]]; then
  printf '\n   (pausing 45s so the link crawler is not rate-limited)\n'; sleep 45
  step "estate-check (semantics, a11y, links)" node qa/estate-check.mjs
fi

# ── verdict ────────────────────────────────────────────────────────────────────────────────
printf '\n\033[1m═══ RESULT ═══\033[0m\n'
printf '  passed: %d\n' "${#PASSED[@]}"
if [[ ${#FAILED[@]} -gt 0 ]]; then
  printf '  \033[31mfailed: %d\033[0m\n' "${#FAILED[@]}"
  for f in "${FAILED[@]}"; do printf '    \033[31m✗ %s\033[0m\n' "$f"; done
  printf '\nRead the failure before changing anything. Today, three "failures" were the\n'
  printf 'instrument and one was a gate testing a design that no longer existed.\n'
  exit 1
fi
printf '  \033[32mall gates green\033[0m\n'
