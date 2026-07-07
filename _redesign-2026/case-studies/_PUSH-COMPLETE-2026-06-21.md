# Blog Sweep — Push to API Complete (2026-06-21)

Continuation of the 2026-06-20 full blog sweep. Everything pushed live via Shopify Admin API. All changes reversible (backups in `_backups/`).

## What was pushed

### 1. 301 redirects — 36 created + ACTIVATED (26 clusters)
- 36 redirect records created (store: 195 → 231 redirects).
- Duplicate articles **unpublished** (James approved) so each redirect fires. **All 36 verified 301'ing to canonical live.**
- Full map: [[Proof Bank]] → "Verified 2026 Blog Sweep" and `_redirects_final.json`.
- Logs: `_redirect_push_log.json`, `_unpublish_log.json`. Restore any: re-publish from `_backups/dup_<id>.json`.

### 2. Genuine case-study rewrites — 95 pushed
- All 95 non-duplicate local rewrites pushed to their live articles (author → "Bamboo Bicycle Club"). 0 miss, 0 fail.
- 36 duplicates deliberately excluded (already unpublished). Log: `_genuine_push.log`.

### 3. Banned-claim cleanup ("stronger than steel / 28,000 PSI" — hard rule)
- 3 reader-visible stragglers stripped (`bbcs-sustainability-story…`, `london-design-festival…`, `top-5-bamboo-bicycles`).
- 4 genuine-prose qualified claims rephrased to verified-safe wording (`adams-flax`, `working-with-flax`, `bamboo-testing-with-swansea-university`, `road-bike-carbon…`) — keeps the verified meaning ("excellent strength-to-weight ratio" / "comparable to mild steel"), drops the literal banned phrase.
- **Final scan: 0 reader-visible banned claims across all 476 published articles.**

### 4. Leaked internal-note cleanup (NEW issue found this session)
- The publish script's md2html had escaped the sweep's `<!-- audit -->` notes into **visible text** (`&lt;!--`), exposing internal QA notes — incl. "Editor's note (not for publication)", "Verified rewrite. Stripped: …" — to readers on ~40 live articles.
- All stripped via API (logs: `_comment_strip_log.json`, `_footer_strip_log.json`, `_banned_v2_log.json`).
- Root cause fixed: added `clean_md()` to `publish_casestudies.py` so future re-pushes can't re-leak.
- **Final scan: 0 leaked internal notes across all published articles.**

### 5. Byline fix
- `kings-college-london-bamboo-building-for-teaching-staff`: "Shopify API" → "Bamboo Bicycle Club". **0** "Shopify API" bylines remain.

### 6. Vault canonical record (168 verified notes rolled up)
- New: `Marketing/Verified 2026 — Blog & Press Audit (Canonical Record).md` (all 168, by category, with status/URL/canonical/quote).
- Appended canonical map + corrections to `Business/Proof Bank.md` and `Marketing/Press and Media Log.md` (incl. Huck = one feature, 15 Jul 2014).

## ❌ The 6 items only James can settle (logged, NOT actioned — per James 2026-06-21)
1. **GM Motors** — vault flags unverified (no email/invoice). Live article reframed to drop the GM claim. Real client or not?
2. **Duplicate consolidation / 301s** — DONE for the 26 unambiguous clusters (36 redirects active). Two pairs held for your call on direction:
   - London→Singapore vs `dr-tom-and-dr-nick-uk-to-singapore-for-msf` (canonical direction).
   - `corporate-team-build-upcycle-brixton-bamboo-balance-bikes` (confirm same event as Four Seasons before redirecting).
3. **Open dates/facts** — Tom & Nicky distance + MSF total + consent; 2-by-Bamboo 10k vs 11.3k km; Build-to-Bond cohort 6 vs 8 + National Justice Museum dates; Kenya 2017-18 vs 2019; Kate Rawles resin brand; any real "Adam flax" video.
4. **Press & Media Log fix** — Huck logged as two articles; it's one (15 Jul 2014). Correction note added to the log; consolidate the two original entries at your discretion.
5. **Stale café listicle** — Dec 2019 "alternative bike cafés" (some venues now closed) — date-stamp or refresh.
6. **Charterhouse** — verified new article (`charterhouse-school-bamboo-workshop.md`), no live home. Tell me which blog it should live in and I'll publish.

## Verification summary
- 605 live articles, 476 published / 129 unpublished (incl. the 36 redirected duplicates).
- 36/36 redirects firing · 0 banned claims · 0 leaked notes · 0 "Shopify API" bylines.
