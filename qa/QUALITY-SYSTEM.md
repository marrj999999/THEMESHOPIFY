# THE QUALITY SYSTEM — how work gets proven, and how the bar keeps rising
*Created 2026-07-27. `qa/WORKFLOW.md` is the INNER loop: what one change goes through.
This is the OUTER loop: how the gates themselves are kept honest, and how we know whether the
site is actually good rather than merely passing its own tests.*

---

## Why this exists

On 24 July, nine quality gates were found reporting success while executing nothing. The token
ratchet printed its own command as a string. The visual suite matched zero tests, three different
ways. `estate-check` lacked a banned pattern that `claim-lint` had, so a prohibited claim rendered
on two pages beneath two green ticks. Every one of them showed green.

Two lessons drive everything below:

1. **A passing gate is not evidence.** A gate must first be proven capable of failing.
2. **A gate that cries wolf is as harmful as one that stays silent** — false FAILs train you to
   skim past FAIL lines, which is exactly how the nine real ones survived.

And one more, learned from the benchmark: **passing our own tests only proves internal
consistency. It says nothing about whether the site is good.** That needs an outside ruler.

---

## The four loops

```
INNER   change ──► gates ──► James (G5) ──► close          per change      qa/WORKFLOW.md
CANARY  gates ──► known-bad fixtures ──► gates proven      per gate edit   qa/canary.mjs
ESCAPE  defect ──► which gate missed it ──► new assertion  per escape      qa/ESCAPES.md
OUTSIDE our metrics ──► peer field ──► targets             per milestone   qa/benchmark-cic.mjs
```

Each loop catches what the one above it cannot. The inner loop catches defects. The canary loop
catches dead gates. The escape loop turns every miss into permanent coverage. The outside loop
catches the failure none of the others can see — *being consistently mediocre and passing.*

---

## Loop 1 · INNER — one change

Runs `qa/WORKFLOW.md` (DEFINE → RESEARCH → BUILD → **CANARY** → GATE → LOOK → ESTATE → MOTION →
CRIT → JAMES → CLOSE). A red gate blocks the next stage. Non-negotiables learned the hard way:

| Rule | Why it exists |
|---|---|
| Snapshot before any write (`qa/pre-push-snapshot.mjs`) | `push-theme.mjs` overwrites with no undo |
| Read back byte-identical after every push | "pushed:" is the API's word, not proof |
| Never push a file you have not diffed against the draft | Four files in one day were stale locally while looking newer by mtime |
| Never re-baseline a visual failure to make it green | Understand the diff first; re-baseline last |
| Fix every lint hit, never widen a waiver to pass | Waivers ratchet DOWN or "0 FAIL" means nothing |

## Loop 2 · CANARY — is the gate alive?

`node qa/canary.mjs` — feeds each gate a known-bad fixture it MUST reject. **A canary that passes
means the gate is dead → block the pass.** Run it after touching any gate, and whenever a result
looks suspiciously clean. Currently 9 gates covered.

It has already earned itself twice: it found `claim-lint` accepting "36+ countries" while
`estate-check` rejected it, and it proved the visual gate blind to a one-label change (the cause
was `threshold`, the per-pixel colour tolerance — not `maxDiffPixels`, the obvious knob).

**It also produced two false alarms of its own**, both from bad test design rather than bad gates:
parsing `//` in comments as regex delimiters, and mutating a `visibility:hidden` element in the
closed cart drawer. Both were caught by *measuring* before "fixing" — the probe that settled it
compared two screenshot buffers and found them byte-identical. When the canary says a gate is
dead, verify the canary first.

## Loop 3 · ESCAPE — what got past, and what now catches it

`qa/ESCAPES.md`. Every defect found by James, by CRIT, or on live gets a row: what it was, who
found it, **which gate should have caught it**, and the assertion added.

**Rule: an escape is not closed until a check exists that would have caught it.** A fix closes one
instance; an assertion closes the class. The repo already writes rules this way — WORKFLOW 4.5
carries *"(Added 2026-07-24 after the overflow-x:hidden timeline-kill went unnoticed for weeks)"* —
so this formalises house style rather than importing a process.

## Loop 4 · OUTSIDE — the benchmark

`node qa/benchmark-cic.mjs` measures 20 UK social enterprises and CICs on **exactly the metrics we
measure ourselves**: type-role spread, page length, LCP/CLS, axe serious violations, CTA density,
evidence density. Peers are split between mission comparators (Switchback, Fine Cell Work,
Redemption Roasters, The Clink, Bounce Back…) and commerce comparators (Elvis & Kresse, Who Gives
A Crap, Tony's, Hiut, Riverford…), because BBC is both.

Findings and targets: `qa/research/cic-benchmark.md`.

Run **per milestone, not per change** — it is slow, it hits third-party sites, and its job is
calibration, not gatekeeping. Re-run when: a page is redesigned, before a publish milestone, or
when James asks "how do we compare".

---

## Metrics that ratchet

`qa/.quality-baseline.json`, enforced down-only in `gate-check` — the model is
`qa/stylelint-ratchet.sh`, which has worked well precisely because it can only improve.

| Metric | Direction | Now |
|---|---|---|
| Token literals | ↓ only | 163 |
| Estate FAIL count | ↓ only | 0 real |
| **Waiver count** | **↓ only** | 14 |
| axe serious violations | ↓ only | measured estate-wide since 2026-07-24 |
| FORMULA §1 role drift | ↓ only | 4 → 0 on 16/17 deep pages |
| Escapes per pass | ↓ only | 10 logged 24 Jul |

**Waivers matter most.** A waiver is a deferred defect with an owner, not a pass. If waivers can
grow freely you can waive your way to green, and the headline number becomes theatre.

---

## Cadence

**Per change** — inner loop; canary if a gate was touched.
**Per pass** — retro: what escaped, what was slow, which assertion to add. Update `ESCAPES.md`.
**Per milestone** — benchmark; review the ratchet table; any metric flat or worsening gets
investigated, not explained away.
**Per James verdict (G5)** — his words verbatim into `QA-LOG.md`; every piece of feedback becomes
a named defect and re-enters the inner loop. CRIT re-runs after every feedback batch — token
pressure never suspends the gate (rule added 2026-07-13 after quality drift recurred without it).

## Roles

- **The builder never scores their own work.** CRIT is a fresh-eyes agent (WORKFLOW step 5). Today
  is the argument: the day's defects were found by running the tools, not by reading commit
  messages that confidently claimed the infrastructure was wired.
- **Automated diff decides where to look; a human then looks there.** Numbers alone missed a band
  that had never rendered (commit `bb2e691`). Eyeballing the first captured baseline is what caught
  the consent banner no assertion would have flagged.
- **James owns claims and brand.** Anything asserting a fact about BBC, a partner, or a
  qualification resolves to the vault `System/Claims Register.md` — or it stops and asks.

## The question that governs all of it

> *"If James were watching, would he tell me to check something I should have already checked?"*
