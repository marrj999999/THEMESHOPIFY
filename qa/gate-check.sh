#!/bin/bash
# Gate-check — must pass before ANY push (push-theme.mjs enforces via token).
# Usage: qa/gate-check.sh <changed file ...>
set -e
cd "$(dirname "$0")/.."
FILES=("$@")
FAIL=0

# Invalidate the token FIRST, before any check runs (added 2026-07-29 after a real bypass).
# The token was only removed at the bottom of the script, on the normal failure path — but
# `bash qa/stylelint-ratchet.sh || exit 1` on the next line exits immediately, so a ratchet
# failure never reached that cleanup and left the PREVIOUS run's token in place. Since
# push-theme.mjs only checks the token is under 10 minutes old, a failing gate could still
# be followed by a successful push. Clearing it up-front closes every early-exit path at once.
rm -f qa/.gate-pass

# Liquid syntax. Added 2026-07-31: an unbalanced {%- endif -%} passed this gate and was caught
# only by the Shopify API on push — which partially succeeded, landing two files and rejecting a
# third. A syntax error must never get as far as a half-applied deploy.
echo "— liquid syntax"
if ! node qa/liquid-check.mjs >/tmp/liquid-check.out 2>&1; then
  tail -6 /tmp/liquid-check.out
  echo "✗ gate-check FAILED (liquid syntax)"
  rm -f qa/.gate-pass
  exit 1
fi
echo "✓ liquid syntax balanced"

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
        try: sc=json.loads(body[ms.end():])
        except Exception as e: print('✗ schema JSON invalid:',sys.argv[1],e); sys.exit(1)
        # SEMANTIC schema rules, added 2026-07-27. Syntactic JSON validity is not enough:
        # a malformed insert produced {"type":"text","id":"x","type":"checkbox"} which parses
        # fine (JSON keeps the last duplicate key) and was accepted here, then REJECTED by
        # Shopify on push with "type is required". The gate should catch what the platform
        # catches, before the push, not after.
        errs=[]
        for grp in ('settings','blocks'):
            for item in (sc.get(grp) or []):
                if not isinstance(item,dict): continue
                if grp=='settings':
                    if 'type' not in item: errs.append(f"setting id={item.get('id','?')} has no 'type'")
                    if item.get('type') not in ('header','paragraph') and 'id' not in item:
                        errs.append(f"setting type={item.get('type')} has no 'id'")
                for sub in (item.get('settings') or []):
                    if isinstance(sub,dict) and 'type' not in sub:
                        errs.append(f"block setting id={sub.get('id','?')} has no 'type'")
        ids=[x.get('id') for x in (sc.get('settings') or []) if isinstance(x,dict) and x.get('id')]
        for d in {i for i in ids if ids.count(i)>1}: errs.append(f"duplicate setting id: {d}")
        if errs:
            print('✗ schema invalid:',sys.argv[1]); [print('   ',e) for e in errs]; sys.exit(1)
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
