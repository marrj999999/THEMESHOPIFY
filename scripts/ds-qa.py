#!/usr/bin/env python3
"""
BBC Design-System QA loop — static theme-asset gates.

Runs read-only against a Shopify theme via the Admin API and reports
PASS/FAIL on the design-system quality gates. Non-zero exit on any hard
fail so it can gate a push.

Usage:
    source ~/.claude/session-env/bbc.env      # sets SHOPIFY_ADMIN_TOKEN
    python3 scripts/ds-qa.py [THEME_ID]        # default = unpublished 196820238710

Gates:
  1. LEGACY GREEN   no #073e27 / rgba(7,62,39) in any loaded CSS      [hard]
  2. SCHEME GREEN   no #073e27 in config/settings_data.json           [hard]
  3. FONT           bbc-design-system.css present + Atkinson Next      [hard]
  4. BANNED CLAIMS  none in checked CSS defaults                       [hard]
  5. !IMPORTANT     per-file tally (tracked; warns, does not fail)     [warn]
"""
import os, sys, re, json, urllib.request, urllib.parse

STORE = "bamboo-bicycle-club-london-uk.myshopify.com"
API = "2024-10"
THEME = sys.argv[1] if len(sys.argv) > 1 else "196820238710"
TOKEN = os.environ.get("SHOPIFY_ADMIN_TOKEN")
if not TOKEN:
    sys.exit("ERROR: source ~/.claude/session-env/bbc.env first (SHOPIFY_ADMIN_TOKEN unset)")

# CSS files that actually load site-wide / on key templates
CSS = [
    "bbc-foundation.css", "bbc-accessibility.css", "bbc-aaa-2026.css", "bbc-why-bamboo.css",
    "bbc-kit-product.css", "bbc-statement.css", "bbc-redesign-2026.css", "bbc-buttons.css",
    "bbc-unified-styles.css", "bbc-mobile-fixes.css", "bbc-mobile-menu.css", "bbc-design-system.css",
]
# Banned claims are COPY, not CSS — scanned against rendered page text, not
# stylesheets (a CSS "56.7%" width or "11.41" number is not a claim). Kept here
# for the content module / browser DOM pass.
BANNED = [r"stronger than steel", r"28,?000\s*psi", r"£\s*11\.41",
          r"most sustainable .{0,20}world", r"100%\s*completion", r"56\.7\s*%\s*lower"]

def fetch(key):
    url = f"https://{STORE}/admin/api/{API}/themes/{THEME}/assets.json?asset%5Bkey%5D=" + urllib.parse.quote(key, safe="")
    req = urllib.request.Request(url, headers={"X-Shopify-Access-Token": TOKEN})
    try:
        a = json.load(urllib.request.urlopen(req)).get("asset")
        return a.get("value", "") if a else None
    except urllib.error.HTTPError as e:
        return None if e.code == 404 else f"__ERR__{e.code}"

fails, warns = [], []
print(f"\n=== BBC design-system QA · theme {THEME} ===\n")

# 1 & 4 & 5 — CSS gates
green_hits, imp_total = {}, 0
for name in CSS:
    v = fetch("assets/" + name)
    if v is None:
        warns.append(f"{name}: not on theme (skipped)"); continue
    if isinstance(v, str) and v.startswith("__ERR__"):
        fails.append(f"{name}: fetch error {v}"); continue
    g = len(re.findall(r"#073[eE]27", v)) + len(re.findall(r"rgba\(\s*7\s*,\s*62\s*,\s*39", v))
    if g: green_hits[name] = g
    imp = v.count("!important"); imp_total += imp
    b = [p for p in BANNED if re.search(p, v, re.I)]
    if b: fails.append(f"{name}: banned claim pattern(s) {b}")
    print(f"  {name:28} green:{g:<3} !important:{imp}")

print()
# GATE 1
if green_hits:
    fails.append(f"LEGACY GREEN in CSS: {green_hits}")
    print(f"  [FAIL] legacy green still in: {green_hits}")
else:
    print("  [PASS] no legacy #073e27 in loaded CSS")

# 2 — settings_data schemes
sd = fetch("config/settings_data.json")
if isinstance(sd, str) and not sd.startswith("__ERR__"):
    n = len(re.findall(r"#073[eE]27", sd))
    if n:
        fails.append(f"settings_data.json: {n} legacy green in colour schemes")
        print(f"  [FAIL] settings_data.json has {n} legacy #073e27 (Dawn schemes)")
    else:
        print("  [PASS] settings_data.json schemes clean")
else:
    warns.append("settings_data.json not readable")

# 3 — font/system present
ds = fetch("assets/bbc-design-system.css")
tl = fetch("layout/theme.liquid") or ""
if ds and "Atkinson Hyperlegible Next" in ds and "Atkinson+Hyperlegible+Next" in tl:
    print("  [PASS] design-system.css present + Atkinson Next loaded")
else:
    fails.append("design-system.css or Atkinson Next not wired in theme.liquid")
    print("  [FAIL] design-system / Atkinson Next not fully wired")

print(f"\n  !important total across checked CSS: {imp_total}")
if imp_total > 700:
    warns.append(f"!important total high ({imp_total}) — Stage 3 target: reduce")

print("\n--- WARNINGS ---" if warns else "")
for w in warns: print("  ! " + w)
print("\n=== RESULT:", "FAIL ===" if fails else "PASS ===")
for f in fails: print("  ✗ " + f)
print()
sys.exit(1 if fails else 0)
