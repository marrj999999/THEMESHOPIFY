# THE ALIGNMENT CONTRACT — one rule the whole estate follows
*2026-07-29 · James: "create a standard alignment that all the site is forced to follow for every block"*

Enforced by `assets/bbc-align.css` (loaded last) and asserted by `qa/layout-audit.mjs`.

---

## The one rule

> **A block's BOX alignment and its TEXT alignment must agree.**
> A centred box may hold centred text. An axis-aligned box holds left text.
> **Centred text inside an off-centre box is always a defect.**

That single sentence is the whole standard. Everything below is how it is applied.

## Why this was needed

The audit found narrow measure blocks **left-aligned to the 1200 axis while their text was
centre-aligned** — a centred-looking column sitting 420px off-centre on the page. On impact ×2,
workshops, schools, programmes ×2, why-bamboo, build-to-bond ×2 and our-story.

The cause was an earlier axis pass forcing, on the impact scope:

```css
.rd-mx-auto        { margin-inline:0 !important; }   /* a class that MEANS auto margins */
[class*="rd-cmp-"] { margin-inline:0 !important; }
.rd-mw-820px       { margin-inline:0 !important; }
```

The boxes moved to the axis. The `text-align` inside them never followed. Neither state was
wrong on its own; the mismatch is what reads as broken.

`.rd-center` had also drifted into meaning two opposite things — redefined to `text-align:left`
on the home, about, sharebuild and kitpicker scopes, still centre everywhere else.

## The standard

| Level | Rule |
|---|---|
| **1 · Axis** | Every band's content sits in a `.rd-wrap`, max-width 1200, `margin-inline:auto`. Measured clean already: all 10 pages, every band at 40px, zero off-axis. **Do not change this.** |
| **2 · Measure boxes** | Narrow wraps (`.rd-mw-*`) are **centred boxes** — `margin-inline:auto`. They are a narrower column on the same centre line, not a left-hugging one. |
| **3 · Text default** | **Left.** Body copy, lists, captions, evidence, tables. |
| **4 · Centring is opt-in and short** | `.rd-center` centres box *and* text. Permitted only for **display copy ≤ 40ch** — an eyebrow, a band heading, a short lede, a CTA row. |
| **5 · Never centre** | Body paragraphs over ~60ch, lists, citations, tables, form labels, anything an assessor reads for detail. Centred long copy has a ragged left edge and no anchor for the eye. |
| **6 · Never `justify`** | No hyphenation engine on the web, so justified text opens rivers. |
| **7 · Hierarchy, not uniformity** | Inside a centred band, DISPLAY copy (heading, eyebrow, lede) stays centred and BODY copy goes left with a 60ch measure, centred as a block. That is a hierarchy and it is the convention. **Corrected 2026-07-29** — this rule originally said "one alignment per band", which is wrong: enforcing it forced short ledes left alongside their headings and made the estate look worse, not better. Measured: `.rd-center` blocks hold paragraphs from 66ch to 486ch; the 66ch lede should centre, the 486ch citation list must not. |

## What this deliberately does NOT change

- The 1200 axis (already clean).
- The centred **footer wordmark** and masthead — a display signature, covered by rule 4.
- Genuinely centred short hero copy.

## Enforcement

`qa/layout-audit.mjs` asserts:

- **C · centring** — no block with both gutters > 4px may have them differ by > 2px
- **B · justification** — zero `text-align:justify`; zero centred paragraphs wider than 60ch; zero bands mixing alignments

Run as a POST-push check (see "How it is enforced in practice" below) — it measures the rendered
draft, so it cannot run before the change is on the theme.

## The standing lesson

The visual net compares today with yesterday, so it can only catch *change* — every one of these
defects was inside the baselines and read as "48/48 passed" for weeks. **Absolute contract checks
are the only thing that finds what was always wrong.** That is why this document states a rule in
one sentence: a check can only enforce a contract that exists.

---

## How it is enforced in practice

```bash
node qa/layout-audit.mjs --assert
```

**Run it AFTER a push, not before.** The audit measures the rendered draft, so it can only see a
change once that change is on the theme — the same reason `estate-check` is a post-push gate.
Exit 1 on any of:

- a band off the shared axis
- any `text-align:justify`
- a block inset on both sides whose gutters differ by more than 2px

It also **refuses to pass on nothing**: if any page fails to load or yields no bands, it exits 1
rather than reporting a clean estate. The first version did not, and `--assert` was being read as a
page path — so it audited one nonexistent URL, measured zero pages, skipped them all as errored and
printed "contract holds". A gate that passes when it measured nothing is ESCAPES #1 again.

## What it deliberately does NOT fail on

`wide-centred` — a centred band containing a paragraph over 60ch. That is a **content** decision
(the band should not be centred), and CSS must not silently half-fix it by flipping one paragraph
to left, because that is exactly how a band ends up mixed. It is reported for a human to settle.

Currently outstanding, for James: workshops ×2, programmes ×2, why-bamboo ×5, our-story, PDP.

## Three false positives fixed before any number here was trusted

The checker was wrong three times, and each would have produced confident nonsense:

1. **centring v1** tested `marginLeft === marginRight` — true for every `margin:0` element — so it
   called flush-left buttons (L=0, R=396) "off-centre".
2. **axis** treated narrow measures as needing the 1200 wrap's left edge, so it reported the
   contract *working* (a centred 820px column at L=230) as a breach.
3. **grid, flex and table children** were flagged as badly centred when their position comes from
   the track or the table algorithm, not from margins.

The rule this keeps proving: **list what a metric is actually counting before quoting what it
reports.**
