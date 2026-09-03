# WHY IT CIRCLES — 22 sessions, 3 weeks, read back

*James, 2026-08-04: "get all the claude code session on building this theme, find every one over
the last 3 weeks and get all the context of changes. At the moment it's going around in circles."*

Read from `~/.claude/projects/-Users-jamesmarr-Projects-bbc-theme-new/` — 22 top-level sessions,
402 transcripts, ~410 MB, 11 Jul → 4 Aug. Correlated against 99 commits since 14 Jul.

**He is right.** This is not a feeling. The same four requests appear 6–8 times each.

---

## The four requests, and every time they were made

### 1 · "The CSS is poor / clashing / inconsistent" — 8 times

| | |
|---|---|
| 12 Jul 08:04 | "CSS is poor, visuals…" |
| 12 Jul 08:38 | "Very messy no hirechy of text or layout, css clashing not aaa" |
| 13 Jul 15:47 | "I can see a lot inconsistentancy why" |
| 22 Jul 09:30 | "can you open a browser session and fix any css issues" |
| 24 Jul 10:28 | "can you do a fully css and ux audit as it is a mess" |
| 29 Jul 13:43 | "some css is clashing… how can you not miss anything" |
| 31 Jul 09:40 | "our impact block on the home page CSS is clashing **why is it being missed**" |
| 03 Aug 11:53 | "let's look at consitancy and styling throughout the site" |

### 2 · "Build one unified/universal CSS" — 5 times

12 Jul 13:52 · 13 Jul 16:17 ("we need a unified css impact is best example") ·
13 Jul 21:13 ("**that why I wanted a unified css** what else was missed") ·
22 Jul 11:46 · 29 Jul 13:53 · 03 Aug 15:09 ("create a stadard look for the site")

### 3 · "Bring every page up to Impact" — 6 times

13 Jul 18:43 · 13 Jul 20:51 ("Our story doesn't follow the same css as impact… **why was it
missed**") · 31 Jul 21:11 · 01 Aug 03:43 ("are all pages at the same level as the impact page") ·
01 Aug 06:04 ("Work through each page using impact as a baseline") · 03 Aug 13:29

### 4 · "A standard block, and animations" — 6 times

12 Jul 18:17 ("all stats need to be animated") · 13 Jul 21:01 ·
**24 Jul 08:44 — "we've lost animatiions"** · 24 Jul 08:59 ("create a standised setup across the
site") · 31 Jul 10:48 ("a standard block across all parts of the website… so the same look") ·
01 Aug 09:57 · 03 Aug 15:14

Note the recurring phrase: **"why is it being missed"**, "what else was missed", "why was it
missed". Asked four separate times. That is the sound of a loop.

---

## Six structural causes, each evidenced

### C1 · The standard was never written down until 3 Aug

`FORMULA.md` (12 Jul) fixed **type roles** and band anatomy. Nothing defined the thing James kept
asking for: which surface follows which, how a band opens, what a standard block is, what a
duration should be. So "make it consistent" had **no definition to converge on**, and every
session re-invented what consistent meant — then the next session re-derived it differently.

`qa/PAGE-STANDARD.md` and `qa/BLOCK-STANDARD.md` (3 Aug) are the first written answers. That is
21 days of asking before the question had a written answer.

### C2 · The repo was not the artefact that renders

Until 3 Aug the repo held **1 of the theme's 32 blocks** and was missing **128 files** that exist
on the deployed theme. Sessions were editing a partial mirror.

The clearest proof: `sections/bbc-why-bamboo-2026.liquid` contains a forest stat band that would
already satisfy the standard — and **has never rendered**, because `/pages/why-bamboo` is
assembled from 13 generic band sections. Any session that "fixed Why Bamboo" by editing that file
changed nothing, and the next session found the same defect.

### C3 · Work was deployed but not committed, for days

The 1 Aug case-study standardisation ran on the draft theme for **3 days uncommitted**. The branch
was **157 commits ahead of GitHub since 7 July** until yesterday. "we've lost animatiions"
(24 Jul) is what that looks like from the outside.

### C4 · The instruments lie, and each lie costs a cycle

`ESCAPES.md` is now **46 numbered escapes**, 12 commits, and the dominant shape is *a gate
reported success while doing nothing* or *a finding was an artefact*. In this session alone:

- `block-audit` reported 14 drifting classes — most were **modifiers doing their job**
- `formula-conformance` reported **0 of 65** pages matching Impact — three instrument faults
- my own contrast probe reported a 1.00:1 defect — **alpha compositing bug**
- the estate screenshot came back **blank** — the documented `fullPage` lazy-paint trap
- 31 of 34 images reported broken — **all HTTP 200**
- two motion assertions had been red for 3 days — **stale, not defects**

Six false leads in one session. Each one is a cycle James pays for.

### C5 · Session churn destroys context

22 sessions in 24 days, with at least **6 explicit context-compaction events** ("This session is
being continued from a previous conversation that ran out of context"). Every restart re-reads
CLAUDE.md, re-derives the theme ID, re-discovers the same defects.

### C6 · The theme competes with four other workstreams

On 3–4 Aug alone, **five sessions ran concurrently** — and only one was the theme:

| session | subject |
|---|---|
| `b229d71a` | jig setup guide / Fusion 360 |
| `0cba8ae0` | blueprint poster artwork |
| `a2693c12` | Build-to-Bond workbook PDF |
| `340cc325` | balance-bike build images |
| `3613ee0c` | **the theme** |

The 92 MB `1516fcdd` session (11–24 Jul) and 27 MB `92a5baef` (Drive reorganisation) overlap the
same period. Theme work is one of several claims on the same attention and the same budget.

---

## The steps BACKWARDS — audited separately, 2026-08-04

*James: "have you audited all the sessions for the relevance of what steps backwards we have
taken." No — the section above audits repetition. Regression is a different question. This is it.*

### Rework, measured

Commits per file since 7 Jul, excluding baselines and evidence:

| file | commits |
|---|---|
| `sections/bbc-impact-2026.liquid` | **50** |
| `assets/bbc-statement.css` | **47** |
| `templates/page.impact.json` | **29** |
| `assets/bbc-redesign-2026.css` | 15 |
| `assets/bbc-universal.css` | 12 |

**The Impact page alone accounts for ~126 commits.** One page, rebuilt fifty times. That is the
circling, quantified.

### Thirteen confirmed steps backwards

| # | What went backwards | When found | Cause |
|---|---|---|---|
| 1 | **Every animation on the site died silently.** `overflow-x:hidden` on html/body/.shopify-section turned them into scroll containers, so every `view()`/`scroll()` timeline went inactive and the whole `.rd-reveal` system rendered its **end state**. The site had no motion. | 24 Jul, by **James** ("we've lost animatiions") — not by any gate | a mobile fix with sitewide blast radius |
| 2 | **The visual-regression harness had never run.** "Make the visual-regression harness actually run (it never had)". Every visual verification before this date was worthless. | 24 Jul | gate broken since creation |
| 3 | Both infographic attempts shipped unverified, page **restored to last-good state** | 12 Jul | "process breach logged" |
| 4 | **Alignment rule 7 made the estate worse.** "One alignment per band" enforced uniformity; corrected to "hierarchy, not uniformity" | 29 Jul | a rule written without measuring its effect |
| 5 | **De-boxing `.rd-card.rd-stamp` broke the shop grid** — "too wide a blast radius"; the grid had to be restored | 29 Jul | fix scoped globally, applied locally |
| 6 | 2 files **reverted** during the `!important` removal | 29 Jul | equivalence test failed, correctly |
| 7 | `.rd-in` regression caught mid-pass | 22 Jul | — |
| 8 | **The Sally Allsopp quote was misattributed to the Financial Times on the LIVE template** | 22 Jul | claims defect that reached production |
| 9 | The world map was trapped in the 820px text measure — **"never a CSS issue"**; sessions had been fixing CSS | 13 Jul | wrong diagnosis, repeatedly |
| 10 | **A working mosaic layout was reverted** because element screenshots showed blank images that were fine | 1 Aug | the instrument lied |
| 11 | Stale local files would have **regressed the draft** with banned wording; `bbc-impact-funder-cta` held a self-referential `var()` that had already been fixed on the theme | 24 Jul / 3 Aug | repo ≠ rendered artefact |
| 12 | Four audits **overwrote their own evidence** — hardcoded dates destroyed prior runs | 3 Aug | — |
| 13 | **My own `.bbc-rd p` rule caused 16 new defects** on the PDPs, replacing a correct light colour with `inherit` | 3 Aug, this session | same specificity as an existing rule; too broad |

### The pattern — and it is one pattern, not thirteen

**Nine of the thirteen are a fix whose blast radius exceeded its intent.** `overflow-x:hidden` for
mobile killed motion everywhere. De-boxing one card broke the shop grid. Alignment rule 7 enforced
uniformity across an estate that needed hierarchy. My paragraph rule seized every `<p>` in the
theme. Each was a *correct local fix* applied at the wrong scope.

**Four ran silently because the gate that should have caught them was itself broken.** The visual
harness had never executed. The contrast gate went quiet the moment `.rd-dark` gained a gradient.
The alignment audit owned a private 10-page list while printing "all pages". The motion assertions
sat red for three days and were stale, not real.

**The most expensive one was found by James, not by any gate.** The site had no motion at all,
and the way that surfaced was him typing "we've lost animatiions".

### Verified today: the big ones have NOT come back

| regression | status |
|---|---|
| animations killed by `overflow-x:hidden` | **holding.** The only `overflow-x:hidden` on a layout ancestor is `bbc-mobile-menu.css:24`, which applies to the mobile **drawer panel** (`translateX(-100%)`, `z-index:1002`) — not html/body/.shopify-section. `motion-check` 41/41 today, reveals transitioning 0→1. |
| visual harness not running | **holding.** 48 tests execute; 32 currently fail against pre-change baselines, which is the correct signal. |
| stamp de-box blast radius | **holding.** Scoped to editorial cards; shop grid intact. |
| the `.bbc-rd p` regression I caused | **fixed same session**, narrowed to `.rd-lede p`, PDPs verified clean. |

### What this changes about the plan

The break-out list in the next section is right, but it needs one addition ahead of everything
else:

> **B0 · No fix ships at a wider scope than the defect it fixes.** Before writing a rule, grep for
> the selector you are about to write. If a rule with the same specificity already exists, you are
> not adding a safety net — you are silently replacing someone's decision. Nine of the thirteen
> steps backwards would not have happened under that one rule.

---

## What actually shipped — it is not nothing

99 commits since 14 Jul; 27 of them touch CSS, alignment, consistency, standards or motion. Real,
verified wins in that window:

- estate contrast **77 sub-AA nodes → 0 real** (1 remaining is an instrument artefact)
- **173 `!important` removed** with per-file equivalence proof, 2 files reverted when it failed
- icon font killed — **414 KB** estate-wide; hero video **8,857 KB → 1,841 KB** on mobile
- the alignment contract written and enforced; rule 7 corrected after it made things worse
- footer, PDP size table, case-study card standardised across 4 of 7 pages
- 4 audits fixed that were **overwriting their own evidence** with a hardcoded date

The work is real. **The problem is that it never accumulated into a definition**, so each pass
started from "it still looks inconsistent" instead of from a standard.

---

## How to break it — four changes, in order

**B1 · One theme session. Never concurrent.**
Theme work in one session, alone. The 3–4 Aug five-way split is the single most expensive pattern
here. Other workstreams wait or run on other days.

**B2 · The standard is now written — treat it as the contract.**
`PAGE-STANDARD.md` (six rules) and `BLOCK-STANDARD.md` (blocks + motion). Every future request
becomes "close gap S2 on why-bamboo", not "make it consistent". `page-standard.mjs` and
`block-standard.mjs` report the gap in seconds.

**B3 · Verify the instrument before believing the finding.**
Six false leads in one session. The rule already exists in ESCAPES ("a proxy is a hypothesis") and
is still the most-violated. Before acting on any measurement: print one instance and look at it.

**B4 · Commit and push at the end of every session, without exception.**
Deployed-but-uncommitted is how animations get lost and how three days of work sits on one Mac.

### The concrete backlog, already measured — no re-derivation needed

1. `/pages/support-mission` — 1 eyebrow in 9 bands, one band with 4 CTAs *(S1, S4)*
2. `/pages/why-bamboo` — insert a light breather, set the stat band dark, break the 5-bone run
   *(S1, S2, S3 + the stat-colour complaint, all in one edit)*
3. Redefine `--mo-base` to `.2s`, migrate the six worst files — **2.7% → ~43%** motion adherence
4. Add `.rd-reveal` to the 9 live blocks — the reason blocks snap in while bands reveal
5. Retire the 23 unwired blocks and ~94 orphan sections, or accept them as backlog

Items 1–2 need James (template edits, rule #4). Items 3–4 are theme code and provable with
`css-fingerprint.mjs`.
