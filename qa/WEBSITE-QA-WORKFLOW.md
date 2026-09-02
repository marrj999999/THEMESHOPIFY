# WEBSITE QA WORKFLOW — content · CSS · UX, on the LIVE site

*Created 2026-09-02. James: "create a workflow and quality check for CSS and UX and content."
`WORKFLOW.md` is the per-change build loop and `QUALITY-SYSTEM.md` keeps the gates honest. This
is the missing layer: what checks run against the PUBLIC site, on what cadence, and what happens
to a finding. It exists because the 2 Sep Site-vs-Vault review (vault:
`Reports/Website Review vs Vault 2026-09-02`) found eleven Claims Register breaches live under
green gates, three pages that had not been touched since 6 July, and no measurement of CSS or UX
drift on the live theme at all.*

---

## Why the old gates missed it (read this before trusting any green tick)

| Miss | Cause | Closed by |
|---|---|---|
| "36 countries", "independently tested", "six Makers", Feltham, Level 1 all live | Patterns were not in `banned-claims.mjs` / `claim-lint.sh`; the FAQ had a **waiver** | Patterns added 2026-09-02; `live-check` has no waivers |
| Impact Report / Theory of Change / Support the Mission stale since 6 Jul | No page had a review date; orphans are invisible to a page-by-page loop | Review dates in `ROLLOUT-TRACKER.md`; live-check runs the whole estate |
| "five sites" vs "4 sites running" on two pages | Every check was per page; nothing compared pages | `live-check` contradiction lane |
| 102px headings ×11, 5–11 button styles, cookie card over the fold | Consistency audit measured the draft once (7 Aug); nothing re-measured | `live-check` CSS + UX lanes with budgets |
| `qa/README.md` itself said "36 countries" and "Level 1 Award" | A doc copied the canon instead of pointing at it | README now points at the Register only |

---

## The three lanes

**CONTENT** — is every sentence one the vault allows?
- Source gate (before push): `bash scripts/claim-lint.sh <files>` inside `qa/gate-check.sh`.
- Live gate (after push, and on cadence): `node qa/live-check.mjs` reads rendered text, `<title>`,
  meta description and OpenGraph against the same `BANNED` list, plus the contradiction detectors
  (prison-site count, countries, workshop price, cohort size, Timpson attribution, Design Museum
  year, Cycle-to-Work saving).
- Register drift: `node qa/claims-register-sync.mjs` asserts every "Do not publish" row in the
  vault's `System/Claims Register.md` has a pattern. `node qa/canary.mjs` proves both gates still
  reject the corpus. A dead canary blocks everything.
- Surfaces claim-lint cannot see and live-check must: theme-editor template values, admin page
  bodies, product descriptions, blog bodies (sweep with the Admin API — see Website Quality Loop
  26 Aug), SEO metafields, image alt text, logo walls (an image can assert a relationship —
  ESCAPES "LSBU").

**CSS** — does the page still speak one system?
- `node qa/css-fingerprint.mjs capture/diff` before and after any shared-CSS edit (0 moved).
- `node qa/contrast-check.mjs --all` at session end.
- `node qa/consistency-check.mjs` against `CONSISTENCY-SPEC.md` (the ten laws: kicker case, button
  label case, chip case, quote anatomy…).
- `live-check` CSS lane budgets: ≤4 distinct button styles per page, ≤2 display (≥80px) h2 per
  page, kickers lowercase, no font leaks, ≤4 elements under 12px.

**UX** — can a first-time visitor do the thing?
- `live-check` UX lane at 390×844: h1 inside the first viewport, a primary CTA above the fold,
  cookie card covering under 15% of the viewport, zero horizontal overflow, alt text, page weight
  ≤4 MB on phones, largest media ≤1.5 MB on phones.
- `node qa/layout-audit.mjs --all` for axis/rhythm; Lighthouse mobile on `/` and one deep page per
  milestone (perf ≥80 target; the review measured 56 on home, 83 on prisons).
- A real five-second test with 3–5 people who do not know BBC, once per hero change. Not a script.

---

## Cadence

| When | Run | Owner | Output |
|---|---|---|---|
| Before every push | `qa/gate-check.sh <files>` (canary → liquid → ratchet → claim-lint → schema) | Claude | blocks the push |
| After every push | `node qa/live-check.mjs <the pages touched>` + screenshots 1440/390 | Claude | `qa/reports/live-check-<date>.md`; screenshots to James |
| Every Monday | `npm run check:live:quick` (20 pages) + `npm run check:claims` | Claude (session or scheduled) | report + one line in `QA-LOG.md`; FAILs become rows in `ESCAPES.md` |
| Monthly, and before any milestone | `npm run check:live` (full estate) + `node qa/contrast-check.mjs --all` + `node qa/estate-check.mjs` + Lighthouse | Claude | report + vault `Reports/` note |
| When the Register changes | `node qa/claims-register-sync.mjs` then add the pattern the same day | Claude | canary green |
| Per page, at least every 60 days | Page review: claims vs Register, stats vs Proof Bank, links, images | Claude, James signs | `ROLLOUT-TRACKER.md` review-date column |

Scheduling note: the Monday and monthly runs can be a Claude scheduled task once James says so.
Until then they are run by whichever session does website work first that week — and a session
that skips it writes "live-check not run" in `QA-LOG.md` rather than nothing.

---

## What happens to a finding

1. **FAIL in CONTENT** = a live breach. Fix the same day if it is a template value or section
   default. If it is admin content (page body, product description, article), fix via the Admin
   API with a read-modify-write and a backup, or hand James the exact field. Never waive.
2. **Contradiction** = a decision, not a typo. Check the vault for the approved value; if the vault
   has no decision, it goes to James as one line ("five or four?") and the page keeps the Register
   formula until he answers.
3. **WARN in CSS/UX** = a budget breach. Fix if CSS-only; otherwise log in `ROLLOUT-TRACKER.md`
   with the number, so the next pass can see whether it moved.
4. Every FAIL that reached live gets an `ESCAPES.md` row: what, who found it, which gate should
   have caught it, the assertion added. An escape is not closed until a check would catch it again.
5. Screenshots decide. A number from the pane is a hypothesis until a 1440 and a 390 screenshot
   agree with it (README capture rules; Quality Loop rule 4).

---

## Hard rules carried from the estate

- The vault's `System/Claims Register.md` is the only canon. No QA doc copies a stat; it links.
- Theme 196820238710 is LIVE (MAIN). Every push is customer-facing. Sync check (md5) before and
  after; never push a file not pulled and diffed first; `templates/*.json` only on James's word.
- Safeguarding: no participant faces, no participant + named prison, frame-by-frame on prison
  media, tattoo/badge zoom on stills.
- Push order: section → wait for the schema cache → template → re-read the template.
- One theme session at a time. Commit and push at the end of every session.
