# Impact page — verification log (2026-07-13)

## Change set
Deployed template `templates/page.impact.json` (draft 196820238710) + section `sections/bbc-impact-2026.liquid`.

**Content fixes (deployed template, James's editor edits had typos):**
1. `converge_title` — "working  to have a key **impactt** across key sectors to provide **voational** skills and pathways into **carrers**" → "working to have a key impact across key sectors to provide vocational skills and pathways into careers" (3 typos + double space).
2. `converge_note` — "STEAM **Learning**" → "STEAM learning" (case consistency).
3. `stories_title` — "Real project real **imapact**" → "real projects, real impact" (typo + plural + lowercase to match sibling heads).
4. `b2b_title` — "helping **prisoners** build bikes for **there** children" → "helping makers build bikes for their children" (house-style: Makers not prisoners; grammar: there→their).

**Behaviour fix (section):**
5. Stats `.rd-num` → `.rd-num bbc-counted` in BOTH stat loops (record band + policy band). The count-up script (`bbc-stat-countup.js`) skips any `.rd-num.bbc-counted` and renders the final value instantly. Root cause: the 2026-07-12 "render instant on credibility numbers" fix added the skip path to the JS but the class was never applied to this section's markup, so funder/credibility stats still animated — a fast scroll or an early screenshot showed wrong intermediate numbers (90%+ read as 17%+, 4,000+ as 750+, 45 as 8).

## Verification performed
- **Data check (pre-fix):** pulled the live deployed template via Admin API. Stat blocks already held the correct Proof Bank values (90%+, Level 2, 4,000+, 45). The rendered "17%+/750+/8" was the count-up mid-flight, NOT wrong data — confirmed by re-reading `.rd-num` textContent after a 3s settle: `["90%+","Level 2","4,000+","45","~£18bn","9pts"]`.
- **Visual review (pre-fix):** every band reviewed top-to-bottom in authenticated Chrome on `?preview_theme_id=196820238710` (desktop 1547px). Confirmed the 4 typo strings render live and located each in the template settings.
- **Mobile:** not capturable by the browser tooling (documented limitation — renders desktop-only). These are text-only edits + a render-timing class; neither changes mobile layout, so desktop verification is sufficient for this change set. Layout-affecting work still gets James's phone check.
- **Post-push:** re-fetch template (assert typos gone) + reload page and re-read stats on first paint (assert no animation flash). Recorded below after deploy.

## Post-deploy result — VERIFIED
- Section + template pushed to draft 196820238710 (section first, 3s gap, then template).
- Read-back of deployed template: **0 typos remain**; all 4 corrected strings present ("into careers", "real projects, real impact", "helping makers build bikes for their children", "STEAM learning"). Section shows `rd-num bbc-counted` ×2.
- Fresh page load, stats read on first paint (no settle wait): all 8 `.rd-num` show final values instantly with `bbc-counted:true` — `90%+, Level 2, 4,000+, 45, ~£18bn, 9pts, 39%, 1m+`. Count-up no longer flashes wrong intermediates.
- Visual (desktop): lime callout renders "working to have a key impact across key sectors to provide vocational skills and pathways into careers" + "hands-on engineering and STEAM learning"; b2b band renders "helping makers…". Clean.
- **Status: ship-blocker content errors CLOSED.** Remaining items are design-polish (funder-logo sizing, §8 bordered-band count, copy strength) + James-owed data — tracked separately, not blockers.
