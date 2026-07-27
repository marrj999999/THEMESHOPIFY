# Sibling panels — how peers treat two-of-a-kind cards
*2026-07-27 · triggered by James: "the blocks are different" on the impact pathway band*

## The defect, measured

`/pages/impact` shows two pathway panels — **schools** and **prisons** — side by side. They are
the two halves of one mission and carry identical markup (media, chip, name, who, numbered flow,
CTA). They did **not** render alike:

| | schools | prisons |
|---|---|---|
| Background | transparent | forest `rgb(0,60,50)` |
| Padding | `38px 0` | `38px` |
| Radius | `0` | `4px` |
| Number rail | lime | steel |
| CTA | forest fill | lime fill |
| Media | flush | bled out by a negative margin |

## Root cause — a half-finished de-box, not a styling accident

Three layers were fighting, and the *declared* design was not the one rendering:

1. **Lines 518–525** declared both panels as matching bordered cards (2.5px ink border, 6px
   radius, offset shadow) differing only in fill. Symmetric by design.
2. **Line 780**, commented *"B1 · D6 borderless pathways: hairline fork instead of twin boxes"*,
   de-boxed `.rd-path` with `!important` — superseding layer 1 entirely.
3. **Line 781** then re-filled **prisons only**, keeping its forest surface.

Step 3 is where the asymmetry came from. It also stranded ten interior rules
(`--prisons` name/who colour, flow-step colour, node halo, rail colour, CTA) that existed
*solely* to be legible on a dark surface.

Worth recording how this was found: the CSS on disk said "identical bordered cards" while the
browser showed neither. Grepping for `.rd-path` found only the layer-1 rules, because the
override sat 260 lines away under an unrelated heading. **`CSS.getMatchedStylesForNode` via CDP
settled it in one call** — it returns the rules the engine actually matched, in cascade order.
Reach for that before theorising about specificity.

## Peer evidence

8 peers, 17 sibling card groups:

- **16 of 17 give siblings identical treatment.** Only Key4Life differentiates.
- **13 of 17 are unfilled** — transparent, radius 0, no border (device D6).
- Filled examples: Onward Lives (radius 12), Key4Life (radius 4).

The distinction between siblings is carried by **the label and the words**, not the chrome.

## ⚠ Conflict with PATHWAYS-SPEC.md — James must settle this

Found *after* the fix was built, and it cuts the other way. `qa/PATHWAYS-SPEC.md` (2026-07-12),
failure #1, records **James's opposite complaint**:

> "Twin cards read as one thing said twice… the *only* differentiator is the copy. James's point
> exactly: prevention (early) and rehabilitation (further on) are different moments in one life —
> the layout says 'two equal brochure panels'."

The spec's answer was deliberate, meaningful differentiation (§4): schools/prevention = **light**
panel (paper, lime — *before, early, daylight*); prisons/rehabilitation = **dark** panel (forest,
steel — *after, inside, sober*).

So there are three states, not two:

| | Treatment | Meaning | Verdict |
|---|---|---|---|
| **Spec** (2026-07-12) | both are panels, *equal treatment* | light vs dark = daylight vs inside | never fully built |
| **As rendered** (before today) | schools has **no panel**, prisons has one | incoherent | the actual defect |
| **A — shipped today** | both borderless, identical | carried by chip colour only | flattens the spec's meaning |

The state James saw and objected to was the middle one — where one arm is a card and the other is
nothing. That is a genuine defect either way. But **option A resolves it by deleting a
differentiation James himself asked for**, which is a bigger call than "tidy up" authorises.

**Option B** (rendered for comparison, not shipped: `qa/evidence/2026-07-27/paths-optionB-spec.png`)
restores the spec — both arms identical in border, radius, padding and shadow, differing only in
fill. It satisfies both complaints at once: the *treatment* is equal (today's objection), the
*meaning* survives (the 2026-07-12 objection).

My recommendation is **B**, and the **mobile view is the strongest argument for it**. At 390px the
two arms stack and the hairline fork is suppressed (it is `min-width:760px`), so under option A the
*only* thing separating "make engineers" from "build to bond" is a chip colour — two long
borderless columns of paper running into each other. Under B the dark panel is unmistakable at any
width. Compare `paths-mobile.png` against `paths-optionB-spec.png`.

A is live on the draft now because it was built before this document surfaced; switching to B is a
small, contained change (restore the four rules I collapsed, plus the dark-surface interior set).

## Decision (option A — shipped, pending James's call above)

Both arms are **identical and borderless (D6)**, separated by the existing hairline fork with
the ✱ seal. The single distinguishing accent is the **chip colour** — lime for schools, steel for
prisons — a small label, not a panel shape.

Note the spec's own §5 supports carrying track identity on the chip rather than the rail: it
states lime/steel lines *"fail contrast on paper"*, so tracks are "identified at the terminals +
chips". With both arms on paper, a steel rail is not available — which is why both rails are lime
here.

This deletes the contradiction rather than layering a fourth override on it:

- base `.rd-path` is borderless outright, so the `!important` de-box pass is gone
- both fills removed; ten dark-surface `--prisons` rules removed
- negative media bleed removed (with no card edge, it pushed images out of their column)
- token literals **163 → 161** (the ratchet only moves down)

`.rd-converge` below remains the band's one filled surface, so FORMULA §8's
*one accent box per page* still holds.

## Verification

- **8/8 computed properties identical** across the two panels (bg, border, radius, padding,
  name/who/step colour, CTA fill, media margin, width)
- **axe WCAG 2.1 AA: 0 violations** in the band — the real risk was moving text off a dark
  surface, so this was checked rather than assumed
- **visual net: 4 failures, all `/pages/impact`, all four viewports** — nothing collateral.
  Everything below the band is byte-identical, shifted exactly **+38px** (40/40 sample rows match
  at y5000/7000/9000/11000), which is the band growing when the negative media margin went.
  Baselines re-taken only after that offset was proven.
- **canary 11/11** after reseeding — see ESCAPES #18 for the stale-baseline false FAIL this threw.

## Still open

The schools body copy renders *"pushed out of the classroom often their first positive
encounter"* — the em-dash from the section default is missing in the stored setting. That lives
in `templates/*.json`, which is James's content and is never pushed from here. Flagged, not
touched.
