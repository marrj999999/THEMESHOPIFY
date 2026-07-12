# THE LOOP — build → prove → James (v1, 2026-07-12)
*Every change to any page runs this circuit. No step optional. James's role is step 6 only.*

1 **DEFINE** — open the pass by listing the FORMULA.md rows + QA-LOG defects it will close (definition of done, written first).
1.5 **RESEARCH CHECK** — before building anything non-trivial, ask: do we have enough context and examples? Check in order: (a) existing research (qa/DESIGN-RESEARCH.md, PATHWAYS-SPEC.md, OPERATIONS-MAP.md — don't re-research what's banked), (b) the vault (facts, quotes, orgs, images — Proof Bank rules), (c) fresh outside examples — 2-3 best-in-class references for THIS specific element with a concrete "steal this" note each (run the saved `research-check` workflow). A build with no reference named in its DEFINE is a smell — thin research is how "accredited programmes" and the twin cards happened.
2 **BUILD** — copy + style together, per band; every replacement removes what it replaces; assert every edit.
3 **GATE** — `qa/gate-check.sh <files>` (claim-lint, JSON/schema validation, evidence folder). push-theme.mjs refuses without a fresh token. Push order: section → wait → template.
4 **LOOK** — eyeball the changed bands at 375px in the browser; write the verdict into `qa/evidence/<date>/`. Numbers checked AFTER settle.
5 **CRIT** — fresh-eyes agent scores EVERY band against FORMULA.md — including a research-fidelity check: does the band match the reference pattern its DEFINE named? (measured px, AAA ratios, symbol/logo consistency, zero-knowledge headers), saves band-by-band screenshots to evidence. Verdict is binary. FAIL → back to step 2. (Run via the saved `page-pass` workflow.)
6 **JAMES (G5)** — handoff = evidence screenshots (SendUserFile) + preview link + what changed + what's still open. His verdict in QA-LOG verbatim; any feedback becomes named defects → step 1.
7 **CLOSE** — git commit per pass; ROLLOUT-TRACKER row updated; page closes only on all-green + James same-version.

Cadence: fix passes are whole-page, never band-scoped. One page in flight at a time. Deviations logged in the tracker BEFORE acting.
