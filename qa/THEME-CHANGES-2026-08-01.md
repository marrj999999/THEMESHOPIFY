# Theme changes pushed to CUSTOMTHEME20262 — 2026-08-01 (evening)

Draft theme `196820238710`, role UNPUBLISHED. Live/MAIN `196739727734` untouched.
Pushed via Admin GraphQL `themeFilesUpsert`; every write returned zero userErrors and
was verified by re-reading `size` + `updatedAt`.

> **Repo status:** only `templates/page.schools.json` is checked in below. The other
> three templates were edited theme-side and are **not yet in git** — pull them before
> editing those pages again.

## templates/page.schools.json — in git (see the commit before this one)

Finished the page: added the 11 missing `partner` blocks (the "As taught at" band was
not rendering at all, and its absence put the dark stats band against the dark hero),
replaced a prison photo on a schools card, de-duplicated two placeholder images, and
corrected three invalid `status` values.

## templates/page.theory-of-change.json — theme only

- `story_2` "a cargo bike designed for african farmers" (UCL students) was using
  `lowdham-workshop-empty_dd8b4829-*.jpg` — an HMP Lowdham Grange workshop photo on an
  education story. Now `CARGO-DELIVERY-BIKE.jpg` from the media library.
  **Stand-in, not the actual UCL project bike — worth replacing with the real photo.**

## templates/page.support-mission.json — theme only

- `pillar-education` said *"OCN-accredited courses at Level 1 and Level 2"*. That is the
  banned conflation in longhand: the content gate greps for the literal `Level 1 & 2`, so
  the spelled-out form passes the check while the claim is still wrong. Now reads
  "a Level 1 Award in schools, Level 2 in prisons".
- Added `stories_mosaic: true` for consistency with prisons and theory-of-change.

## templates/page.prisons.json — theme only

- `story_1` and `story_2` were both using `lowdham-workshop-empty.jpg` — the same photo
  twice in one grid. `story_3` and `story_4` were borrowing `bbc-rd-toc-kit.jpg` /
  `bbc-rd-toc-jig.jpg`, which were made for theory-of-change. All four now use distinct
  Lowdham photographs that already existed in the media library:

  | Block | Image |
  |---|---|
  | `story_1` transforming lives | `lowdham-workshop-wide.jpg` |
  | `story_2` build to bond | `lowdham-frame-in-jig.jpg` |
  | `story_3` inside time | `lowdham-bamboo-selection.jpg` |
  | `story_4` prisons minister | `lowdham-image-enhanced.jpg` |

- `plogo_2/3/4` were briefly wired to `logo-hmpps.png`, `logo-moj.png` and
  `logo-hmp-lowdham-grange.png`, then **reverted to empty**. See below.

## ⚠ Open: three partner logos are the same file

`logo-hmpps.png`, `logo-moj.png` and `logo-hmp-lowdham-grange.png` are byte-identical —
all 15980 bytes, all MD5 `31dc0f5bdbff56734c381ecc91925c2a`, all uploaded within one
second on 2026-07-06. One image saved under three names. Wiring them up renders the same
logo three times in a row, so `plogo_2/3/4` are correctly left with `asset: ""` and their
alt text until three real logos are uploaded.

This also means the empty slots on the prisons page were **not** an oversight to fix.

## ⚠ Open: the OCN Level 2 course title contradicts itself

| Source | Title |
|---|---|
| `CLAUDE.md`, `qa/README.md` (governance) | OCN Level 2 — **Sustainable Design & Manufacturing** |
| `page.prisons.json` `fact_2` (live) | **Workshop Skills and Sustainable Manufacturing** |
| `page.toc-2026` `arm_2` + `step_3` (live) | **Workshop Skills and Sustainable Manufacturing** |

Left untouched deliberately — an accredited qualification title should not be changed on
one agent's reading of a doc. Decide which is correct, then align all three live blocks
and both governance docs in one pass.

## Not yet re-checked

`page.impact.json`, `page.our-story-2.json`, `page.programmes.json`, `page.workshop.json`,
`page.bicycleteambuilding.json`, `product.kit-mtb.json`, `index.json` — all touched
31 Jul–1 Aug, none audited for the four defect classes found above (borrowed placeholder
images, duplicate images within a grid, prison imagery on non-prison pages, invalid
select values).
