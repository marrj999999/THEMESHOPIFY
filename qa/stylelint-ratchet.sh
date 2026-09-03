#!/bin/bash
# Token-lint ratchet: literal color/font-size count in BBC sheets may never INCREASE.
# (Legacy sheets predate the token contract — we ratchet down, not big-bang.)
BASE_FILE="qa/.stylelint-baseline"
COUNT=$(npx stylelint "assets/bbc-*.css" --formatter json 2>&1 >/dev/null | python3 -c "import json,sys; d=json.load(sys.stdin); print(sum(len(f['warnings']) for f in d))" 2>/dev/null || echo ERR)
if [ "$COUNT" = "ERR" ]; then echo "stylelint ERR (non-blocking)"; exit 0; fi
if [ ! -f "$BASE_FILE" ]; then echo "$COUNT" > "$BASE_FILE"; echo "stylelint baseline set: $COUNT literals"; exit 0; fi
BASE=$(cat "$BASE_FILE")
if [ "$COUNT" -gt "$BASE" ]; then echo "✗ token-lint RATCHET: $COUNT literals > baseline $BASE — new raw color/font-size added outside the token system"; exit 1; fi
if [ "$COUNT" -lt "$BASE" ]; then echo "$COUNT" > "$BASE_FILE"; fi
echo "✓ token-lint: $COUNT literals (baseline $BASE, ratcheting down)"
