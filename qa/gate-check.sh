#!/bin/bash
# Gate-check — must pass before ANY push (push-theme.mjs enforces via token).
# Usage: qa/gate-check.sh <changed file ...>
set -e
cd "$(dirname "$0")/.."
FILES=("$@")
FAIL=0
echo "— token-lint ratchet"
bash qa/stylelint-ratchet.sh || exit 1
echo "— claim-lint"
bash scripts/claim-lint.sh "${FILES[@]:-}" || FAIL=1
echo "— JSON validation"
for f in "${FILES[@]}"; do
  case "$f" in *.json) python3 -c "import json;json.load(open('$f'))" || { echo "✗ invalid JSON: $f"; FAIL=1; };; esac
  case "$f" in *.liquid)
    python3 - "$f" <<'PY' || FAIL=1
import json,sys,re
s=open(sys.argv[1]).read()
# Use the LAST schema..endschema pair (files may mention "{% schema %}" in prose/comments),
# and tolerate whitespace-control tags ({%- schema -%}).
me=None
for m in re.finditer(r'\{%-?\s*endschema\s*-?%\}', s): me=m
if me:
    body=s[:me.start()]
    ms=None
    for m in re.finditer(r'\{%-?\s*schema\s*-?%\}', body): ms=m
    if ms:
        try: json.loads(body[ms.end():])
        except Exception as e: print('✗ schema JSON invalid:',sys.argv[1],e); sys.exit(1)
PY
  ;; esac
done
echo "— evidence check (mobile screenshots for today)"
EV="qa/evidence/$(date +%F)"
if [ ! -d "$EV" ] || [ -z "$(ls "$EV" 2>/dev/null)" ]; then
  echo "✗ no evidence in $EV — screenshot the changed bands (mobile) BEFORE pushing"; FAIL=1
fi
if [ $FAIL -eq 0 ]; then
  date +%s > qa/.gate-pass
  echo "✓ gate-check PASSED (token written)"
else
  rm -f qa/.gate-pass; echo "✗ gate-check FAILED — no push possible"; exit 1
fi
