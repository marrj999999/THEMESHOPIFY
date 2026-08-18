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
  '(^|[^0-9.])56\.7([^0-9]|$)'
  '(^|[^0-9.])11\.41([^0-9.]|$)'
  '£280[^0-9]'
  '100% completion'
  'lifecycle analysis \(2024\)'
  '14765'
  '[Nn]ationally recognised'
  # Added 2026-07-24 — each of these was found live in the theme while every gate reported
  # green, because the pattern existed in neither list. Authority: vault System/Claims Register.md.
  # Keep in sync with the BANNED array in qa/estate-check.mjs (source vs rendered).
  '[Ll]evel 1 ?& ?2'                             # per-arm naming only, never the mushed form
  '[Gg]uaranteed interview'                      # unverifiable promise
  'Sustainable Design (&(amp;)?|and) Manufacturing'  # wrong OCN title; canonical = "Workshop Skills and Sustainable Manufacturing"
  '\b[Pp]risoners\b'                             # voice rule: "Makers"; "people in prison" stays legal
  '\b36\+? countries'                            # superseded by 45 (James 2026-07-07). Found by
                                                 # qa/canary.mjs: estate-check rejected this and
                                                 # claim-lint did not — the escape #6 shape again.
  "don'?t hesitate"
  '[Kk]ind regards'
  'hope this (email )?finds you well'
  'leverage|synergy|empower(ing)? '
  'passionate about'
  "we'?re excited to announce"
)

# NAMED ALLOWANCES (2026-07-24) — legitimate uses that must not be reported as violations.
# Each is justified, not a convenience: narrowing a pattern to go green is how banned claims
# survive. Anything not listed here is a real defect and must be fixed, never appended below.
#   1. The house rule itself — lines that STATE the ban (' never "prisoners" ') are the guard.
#   2. External research framing approved verbatim in vault System/Claims Register.md:
#      "prisoners who receive family visits are 39% less likely to reoffend" (MoJ/Farmer Review).
#      The register approves this wording with mandatory context; the voice rule governs how we
#      describe OUR Makers, not how cited research describes its own population.
#   3. Verbatim third-party press quotes — altering a quotation would misrepresent the source.
#   4. Verbatim quotes from named public officials, same reason as 3 (added 2026-08-18):
#      "…help prisoners turn their lives around" — Lord Timpson, Prisons Minister, carried on
#      /pages/impact with attribution (cred_quote1 / cred_attr1). It is his sentence, not ours.
#      Note the boundary this pair illustrates: the same page described Inside Time in BBC's OWN
#      words as "prisoners' national newspaper" — that IS ours, so it was rewritten to "the
#      national newspaper for people in prison" rather than allowed. Quote it, don't adopt it.
ALLOW='never "prisoners"|"prisoners"/"offenders"|No "guaranteed interview"|Farmer Review|39% less likely|of prisoners lose family contact|many prisoners lose contact|Inside Time|prisoners at Lowdham Grange|help prisoners turn their lives around'

FAIL=0
for pat in "${PATTERNS[@]}"; do
  hits=$(grep -rn -E "$pat" --exclude='*.svg' "${TARGETS[@]}" 2>/dev/null | grep -v -E '\.bak|node_modules|scripts/claim-lint' | grep -v -E "$ALLOW")
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
