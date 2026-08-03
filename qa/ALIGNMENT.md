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
| **1 · Axis** | Every band's content sits in a `.rd-wrap`, max-width 1200, `margin-inline:auto`. **Do not change this.** |
| **1a · The gutter belongs to `.rd-wrap` alone** | A band **must not** set its own horizontal padding. `.rd-wrap` owns the side gutter (32px, 18px under 520px); anything a band adds is applied *on top* and pushes that band's content off the shared axis. **Added 2026-07-31** after `.rd-trustband{padding:15px 24px}` put its content at 42px on mobile while every other band sat at 18px. Vertical padding on a band is fine — only the horizontal axis is shared. |
| **2 · Measure boxes** | Narrow wraps (`.rd-mw-*`) **sit on the axis** — `margin-left:max(0px, calc(50% - 600px))`, `margin-right:0`. They cap the *measure* (line length), not the position. `.rd-center` / `.rd-mx-auto` opt out and keep auto margins, because their text is centred too. **REVERSED 2026-07-31** — see below. |
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

## Rule 2 reversed — measure boxes sit on the axis (2026-07-31)

Rule 2 originally read *"narrow wraps are centred boxes … a narrower column on the same centre
line."* `bbc-align.css` enforced that with `margin-inline:auto !important`, which out-ranked the
axis rule already sitting in `bbc-universal.css`. **Two rules in this repo encoded opposite
contracts, and estate-check T2 (one text axis, ≤8px) failed 27 times across 7 pages** because a
measure column's heading sat 190px in from every other band heading at 1568.

This audit could not see it: `layout-audit.mjs` *excludes* `.rd-mw-*` from the axis check by
design (false positive #2), and runs at 1280/390 where the effect is smallest. T2 runs at
768/1024/1568/1920 and does not exclude them. Neither instrument was broken — they disagreed,
and the disagreement was the finding.

**Resolved in favour of the axis**, because the indent is `(container − measure) / 2` and
therefore *not constant*: 19px at 768, 102px at 1024, 190px at 1568+. A deliberate typographic
device is proportional and intentional; an indent that is merely the leftover space reads as
sloppiness at 768 and as misalignment at 1568. Nothing is lost — the readability benefit of a
measure box is its **line length** (WCAG 1.4.8), which is independent of horizontal position.

The `.rd-center` / `.rd-mx-auto` opt-outs are load-bearing: they keep auto margins because their
**text** is centred too. Moving a box to the axis while its text stays centred is the exact defect
this file was created to fix. Verified after the change: 8 pages × 4 viewports, spread 0px, measure
still 820px, `text-align:left`.

## Scope — what "all pages" means

`--all` runs the **whole estate at two viewports** (69 pages × 1280 and 390 = 138 measurements),
from the single shared list in `qa/estate-pages.mjs`.

**Added 2026-07-31, and this is the important part.** Until then the audit carried its own
hand-typed list of 10 pages and a hardcoded 1280 viewport, while printing *"contract holds across
all pages"* — a sentence true only of 10 of 69 pages at one width, and indistinguishable from an
estate-wide pass. Widening it immediately found a defect on 4 pages that desktop evidence was
**arithmetically incapable** of showing: at ≥1280 `.rd-wrap` hits its 1200px max-width and any
surplus band padding is absorbed by `margin:auto`, so content lands at 72px either way. Only a
fluid viewport lets that surplus through.

Two consequences, both now enforced:
- Never give an audit its own private page list. Import `ALL_PAGES`.
- A pass is only meaningful if the run measured everything — `--assert` exits 1 unless all 138
  page/viewports produced bands.

## Five false positives fixed before any number here was trusted

The checker was wrong five times, and each would have produced confident nonsense:

1. **centring v1** tested `marginLeft === marginRight` — true for every `margin:0` element — so it
   called flush-left buttons (L=0, R=396) "off-centre".
2. **axis** treated narrow measures as needing the 1200 wrap's left edge, so it reported the
   contract *working* (a centred 820px column at L=230) as a breach.
3. **grid, flex and table children** were flagged as badly centred when their position comes from
   the track or the table algorithm, not from margins.
4. **A parent's border was counted as the child's gap** (2026-07-31). `getBoundingClientRect().left`
   is the *border* edge, and the check subtracted only the parent's padding — so `SECTION.intro` on
   `/pages/size-guide`, which carries a 5px decorative left rule, made a correctly left-aligned H2
   report a 5px gap and register as "inset on both sides but not centred". Same class as #3: a
   position that does not come from margins.
5. **Inline-level boxes** (2026-07-31). The "Create an account" link on `/account/login` is an
   `inline-flex` button sitting after "Forgotten your password? · " in one paragraph. Its 278/102
   gaps are the text flow. An inline box is placed by the inline formatting context exactly as a
   grid child is placed by its track — #3 again, in a third costume.

Both 2026-07-31 fixes **widen an exemption**, which is the change most likely to silently disarm a
check — so `qa/canary-alignment.mjs` now holds a genuinely off-centre block alongside the three
legitimate patterns, and `qa/canary.mjs` fails the build if the check stops catching it. Proving a
check went quiet is not the same as proving it is right.

The rule this keeps proving: **list what a metric is actually counting before quoting what it
reports.**
