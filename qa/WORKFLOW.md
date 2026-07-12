# THE LOOP — build → prove → James (v1, 2026-07-12)
*Every change to any page runs this circuit. No step optional. James's role is step 6 only.*

1 **DEFINE** — open the pass by listing the FORMULA.md rows + QA-LOG defects it will close (definition of done, written first).
2 **BUILD** — copy + style together, per band; every replacement removes what it replaces; assert every edit.
3 **GATE** — `qa/gate-check.sh <files>` (claim-lint, JSON/schema validation, evidence folder). push-theme.mjs refuses without a fresh token. Push order: section → wait → template.
4 **LOOK** — eyeball the changed bands at 375px in the browser; write the verdict into `qa/evidence/<date>/`. Numbers checked AFTER settle.
5 **CRIT** — fresh-eyes agent scores EVERY band against FORMULA.md (measured px, AAA ratios, symbol/logo consistency, zero-knowledge headers), saves band-by-band screenshots to evidence. Verdict is binary. FAIL → back to step 2. (Run via the saved `page-pass` workflow.)
6 **JAMES (G5)** — handoff = evidence screenshots (SendUserFile) + preview link + what changed + what's still open. His verdict in QA-LOG verbatim; any feedback becomes named defects → step 1.
7 **CLOSE** — git commit per pass; ROLLOUT-TRACKER row updated; page closes only on all-green + James same-version.

Cadence: fix passes are whole-page, never band-scoped. One page in flight at a time. Deviations logged in the tracker BEFORE acting.
