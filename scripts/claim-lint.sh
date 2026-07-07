#!/bin/bash
# BBC claim-lint — blocks deploys containing banned/unsourced claims or banned language.
# Usage: scripts/claim-lint.sh [path ...]   (defaults to sections/ snippets/ blocks/ assets/ layout/)
# Exit 1 on any hit. Run BEFORE every `shopify theme push`.
#
# Banned-claims canon (2026-07-02, see Theme-Redesign-2026-Strategy):
#   28,000 PSI (false; real tensile ~84 MPa) · "stronger than steel" absolute claims
#   56.7% carbon (no named LCA) · £11.41 SROI (no traceable study)
#   £280/learner (prison contract pricing — never publish) · 100% completion (use 90%+)
# Voice bans: corporate filler + emoji in liquid (use bbc-icons).

TARGETS=("$@")
[ ${#TARGETS[@]} -eq 0 ] && TARGETS=(sections snippets blocks assets layout)

PATTERNS=(
  '28,?000 ?PSI'
  '[Ss]tronger than steel'
  '[Ss]trong as steel'
  '56\.7'
  '11\.41'
  '£280[^0-9]'
  '100% completion'
  'lifecycle analysis \(2024\)'
  "don'?t hesitate"
  '[Kk]ind regards'
  'hope this (email )?finds you well'
  'leverage|synergy|empower(ing)? '
  'passionate about'
  "we'?re excited to announce"
)

FAIL=0
for pat in "${PATTERNS[@]}"; do
  hits=$(grep -rn -E "$pat" "${TARGETS[@]}" 2>/dev/null | grep -v -E '\.bak|node_modules|scripts/claim-lint')
  if [ -n "$hits" ]; then
    echo "✗ BANNED PATTERN: $pat"
    echo "$hits" | head -10
    FAIL=1
  fi
done

# Emoji in liquid files (use {% render 'bbc-icons' %} instead)
emoji_hits=$(grep -rn -P '[\x{1F300}-\x{1FAFF}\x{2600}-\x{27BF}]' --include='*.liquid' "${TARGETS[@]}" 2>/dev/null | grep -v '\.bak' | head -5)
if [ -n "$emoji_hits" ]; then
  echo "✗ EMOJI in liquid (use bbc-icons):"
  echo "$emoji_hits"
  FAIL=1
fi

if [ $FAIL -eq 0 ]; then
  echo "✓ claim-lint clean"
else
  echo ""
  echo "BLOCKED — fix the hits above before pushing. Safe framings:"
  echo "  strength → 'Tensile strength comparable to mild steel — BS ISO 22157, Swansea University' (84 MPa)"
  echo "  carbon   → 'Grown, not mined — regrows in 3–5 years' (qualitative until a real LCA exists)"
  echo "  impact   → 90%+ completion · 4,000+ builders · 3,500+ frames · OCN L1/L2"
fi
exit $FAIL
