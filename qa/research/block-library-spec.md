# Block library — spec, grounded in what we measured
*2026-07-27 · `qa/benchmark-sequence.mjs` · builds on BLOCK-SYSTEM.md, FORMULA §8, anti-blocky D1–D12*

## What this is built from, and what it is not

**Reliable:** our own band inventory. We control the markup, the sections are well-structured, and
the analyser segments them accurately.

**Not reliable:** peer band sequences. DOM-heuristic segmentation works on our pages and poorly on
arbitrary sites — Bounce Back and Key4Life each came back as a *single* band, which is obviously
under-segmented, and Switchback returned six "quote" bands that may or may not be real. **I am not
deriving a reference sequence from that data.** The peer-structure question needs the screenshots
read visually, which is the next step and is deliberately not pretended-at here.

What *is* solid is the measured evidence from the other benchmarks, and our own structure.

## Our actual band inventory

**Workshops** (609 words — bang on peer median, needs no cutting):
```
spacer → hero → spacer → quote → cta-band → editorial → editorial → faq → cta-band
```

**Programmes**:
```
proof-strip → editorial → editorial → steps → editorial → editorial → editorial → spacer → cta-band
```

### Two structural gaps, visible in our own data

1. **Workshops has no proof band and no steps band.** It sells a 2–3 day course to a beginner —
   the two things a nervous first-timer needs are *what happens each day* and *people like me have
   done this*. Programmes has both. Workshops has neither.
2. **Editorial bands dominate.** Programmes runs four editorial bands out of nine; workshops two of
   nine plus two spacers. Editorial is the default when no device has been chosen — it is exactly
   the "eyebrow → heading → prose" pattern James called AI slop.

## The blocks

Built on `bbc-statement` and `bbc-pillar`, which exist and work. Word budgets enforce
`BLOCK-SYSTEM.md`'s rule — *"body is a caption, not an essay"*, 18px, ≤52ch, ≤2 lines.

| Block | Job | Budget | Default device | Evidence it is needed |
|---|---|---|---|---|
| `hero` | claim + explanatory sub-line + ≤2 CTAs | ≤45 | D1 full-bleed | zero-knowledge rule; homepage sub-line does the work |
| `proof-strip` | 3–4 **isolated** figures | ≤20 | D2 ghost numeral | our figures sit in prose; peers isolate them. Built for homepage (y3897 → y867); workshops has none |
| `steps` | numbered what-happens | ≤15/step | D3 marginalia rail | workshops sells a multi-day course with no day-by-day band |
| `evidence-card` | outcome + **named source** | ≤35 | D6 borderless | evidence density 16 vs median 20.5; case-study links 1 vs peers' 4–5 |
| `quote` | attributed testimony | ≤40 | D10 statement pull-quote | we lead the field here (18 sourced vs 15 of 20 peers showing none) — **and it fixes the rd-q 22/28/42px drift** |
| `logo-wall` | backed-by / featured-in | 0 | one height per row | FORMULA §3; viewBox defect already asserted |
| `faq` | accordion | ≤30/answer | D8 index list | workshops already has one; keep |
| `cta-band` | one primary action | ≤25 | D5 boundary-cross (finale only) | one primary per band, FORMULA §1 |

**No `editorial` block.** That omission is deliberate and is the core design decision: editorial is
what a page defaults to when nobody chose a device, and it is the shape of the sameness problem.
Prose belongs *inside* a block with a budget, not as a band type of its own.

## Rules the blocks enforce structurally

From FORMULA §8 and the device library, made mandatory rather than advisory:

- **No bordered-card grid by default** — D6 borderless/ruled is default; boxed is opt-in, max once per page
- **Splits asymmetric by default** (7/3, 8/4); 50/50 needs justification
- **≥4 distinct devices per page**, no two adjacent bands sharing a shape
- **One containment break, exactly one seam-cross**, saved for the finale
- **Density alternation** — never three dense bands in a row
- **Tokens only** (`--type-*`) so the ratchet keeps falling from 163

## Storytelling order — the honest position

The peer-sequence data is too noisy to name a reference order, and I would rather say so than
invent one. What the *measured* findings support:

1. **Claim, then evidence, then ask.** Applied on the homepage already — the proof strip was moved
   above the CTAs precisely so the page evidences before it asks.
2. **Proof early.** Our first figure was at y3897, ~4 screens down and 5× later than any peer.
3. **Specificity over generality.** 54 named people and a 168-note verified vault, against peers who
   mostly show none — this is both the accuracy fix and the anti-AI fix.

That is enough to build the blocks. It is not enough to prescribe a band order per page type, and
that gap is named in the next step below.

## Next

1. **Read the peer screenshots visually** for the three Tier-A page types — the reliable path to a
   reference sequence, now that the automated one has shown its limits.
2. Build `hero`, `proof-strip`, `steps`, `quote` first — they cover the two gaps found above and
   the `rd-q` drift.
3. Migrate workshops first (it needs proof + steps, and its copy is already right).
