# THEME WORKFLOW — the loop that stops it circling

*Created 2026-08-04 after reading back 22 sessions (`qa/WHY-IT-CIRCLES.md`). `WORKFLOW.md` covers
how to build a page pass. This covers the thing that was actually missing: how a session starts,
what it is allowed to change, and how it ends so the next session does not re-derive everything.*

---

## The five rules

**W1 · One theme session. Never concurrent.**
On 3–4 Aug five sessions ran at once and only one was the theme. Theme work runs alone.

**W2 · No fix ships at a wider scope than the defect it fixes.**
Nine of the thirteen recorded regressions were a correct *local* fix applied at the wrong *scope*
— `overflow-x:hidden` for mobile killed motion everywhere; de-boxing one card broke the shop grid;
alignment rule 7 imposed uniformity estate-wide; a `.bbc-rd p` rule seized every paragraph.
**Before writing a rule, grep for the selector.** If one with the same specificity exists you are
not adding a safety net, you are replacing someone's decision.

**W3 · Verify the instrument before believing the finding.**
Six false leads in a single session. Print one instance and look at it before acting.

**W4 · The repo is the artefact. Pull before you edit.**
`bbc-why-bamboo-2026.liquid` was edited for weeks and never rendered. If a fix appears to do
nothing, check the page is actually built from the file you changed.

**W5 · Commit and push at the end of every session.**
Deployed-but-uncommitted is how animations get lost and how 157 commits sit on one Mac.

---

## Session start (5 minutes, always)

```bash
shopify theme list                      # NEVER trust a hardcoded id — they have changed twice
git pull && git status                  # clean tree before anything
node qa/reconcile-drift.mjs             # is the repo behind the theme? it usually is
node qa/page-standard.mjs               # where does the estate stand vs Impact
node qa/block-standard.mjs              # blocks used/orphaned, motion adherence
```

Those four numbers ARE the state of the project. If they have not moved since last session,
nothing shipped.

## Making a change

1. **Name the gap.** Not "make it consistent" — "close S2 on why-bamboo". The standards are in
   `PAGE-STANDARD.md` (six rules) and `BLOCK-STANDARD.md` (blocks + motion).
2. **Grep the selector you are about to write** (W2).
3. **Capture an equivalence baseline** if touching shared CSS:
   `node qa/css-fingerprint.mjs capture <label>-before`
4. Change it.
5. `bash qa/gate-check.sh <files>` → `node qa/pre-push-snapshot.mjs <files>` → `node qa/push-theme.mjs . <files>`
6. **Read back.** `push-theme.mjs` does not verify; compare md5 against the theme yourself.
   Allow ~5s — the API can serve a stale copy immediately after a write.
7. **Prove it.** `node qa/css-fingerprint.mjs diff <label>-before <label>-after` — 0 moved.

## Testing — what each tool can and cannot see

| tool | answers | blind to |
|---|---|---|
| `css-fingerprint` | did any computed style move? | *(motion added 2026-08-04 — it was blind to timing before that)* |
| `contrast-check` | is text legible on what is actually painted? | text inside closed `<details>`, text under fixed overlays *(both guarded 2026-08-03)* |
| `layout-audit` | axis, justification, centring, rhythm | anything inside a band — it measures band edges only |
| `motion-check` | do timelines drive, is reduced-motion inert | only 4 pages; cannot see whether *blocks* animate |
| `page-standard` | does the page look like the site as a sequence | type (that is `formula-conformance`) |
| `block-standard` | blocks used/orphaned, motion token adherence | whether a block *looks* right |
| `visual.spec` | did any pixel change vs baseline | whether the change was an improvement |
| **your eyes** | whether it is any good | — |

**No single tool certifies a change.** The pairing that matters: `css-fingerprint` proves nothing
moved, `contrast-check` proves it is legible, the browser proves it looks right.

## Session end (never skip)

```bash
node qa/contrast-check.mjs --all        # or the pages you touched
node qa/motion-check.mjs
git add -A && git commit && git push
```

Then write one line into `QA-LOG.md`: what changed, what it measured before and after. That log
went 10 days stale in July and the next session had to re-derive everything.

---

## The standing backlog

Measured, not re-derivable. Update it, do not rebuild it.

| # | item | status |
|---|---|---|
| 1 | `--mo-base` → `.2s`, migrate six worst files | **done 2026-08-04** — 68 durations, adherence 2.7% → 21.5%, fingerprint 0 moved of 395,955 |
| 2 | `.rd-reveal` on the live blocks | **done 2026-08-04** — 8 blocks (case-study already revealed via `bbc-cscard`) |
| 3 | `/pages/support-mission` — eyebrows on 8 bands, split the 4-CTA band | **needs James** — eyebrow text is copy |
| 4 | `/pages/why-bamboo` — light breather + dark stat band, break the 5-bone run | **needs James** — inserting a band is structural + content |
| 5 | Migrate the remaining ~254 hardcoded durations | judgement — `.1 .12 .18 .25 .3 .4` need a role decision, not automation |
| 6 | Retire 23 unwired blocks and ~94 orphan sections | after publish |

Items 3 and 4 are blocked on content, not effort. Everything mechanical is done.
