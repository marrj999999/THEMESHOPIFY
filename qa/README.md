# BBC Theme QA Kit — visual/CSS/content feedback loop

> Created 2026-07-06 during the CUSTOMTHEME20262 rebuild. Run this loop **before every
> theme publish** and after any batch of section/template edits.

## Verification levels (upgraded 2026-07-06 — how layouts are ACTUALLY verified)

The original lint only caught structural breakage. Layout quality needs three layers:

| Level | Tool | Catches | Cost |
|---|---|---|---|
| **L1 Structural lint** | `layout-lint.js` (real viewport) | overflow, broken/squashed imgs, collapsed sections | seconds/page |
| **L2 Layout metrics** | `layout-metrics.js` (real viewport) | whitespace holes, grid imbalance, >95ch lines, centered walls, <13px text, upscaled imgs | seconds/page |
| **L3 Vision review** | full-page screenshots → vision agents with the art-director rubric (crop suspicious regions at full res before reporting) | everything humans see: misalignment, rhythm, crops, awkward wraps, tone | ~25k tokens/page |

**CAPTURE METHOD — CRITICAL LESSON:** never capture "full page" via a giant
`--window-size` (e.g. 1440×12000): `vh`-based heroes explode to thousands of px and
the review reports phantom "empty heroes" and fake mobile overflow. Two artefact
classes confirmed 2026-07-06: (1) vh-explosion holes, (2) count-up stats frozen
mid-animation (three captures = three different numbers — screenshots must wait
~3s or snap counters). Capture instead at REAL viewports (1440×900 / 390×844) with
scroll-stepped shots, or verify any giant-window finding against a real viewport
before believing it. **Vision findings are hypotheses; the real-viewport check is
the judge.**

## The loop

```
┌─> 1. LINT      — run layout-lint.js on every page in pages.txt, desktop + mobile
│   2. SCREENSHOT — capture only the pages/sections the lint flags (+ 1 spot-check per page)
│   3. FIX       — edit sections/CSS locally, push with push-theme.mjs
│   4. VERIFY    — verify-files.mjs (byte-identical) + re-run the lint on fixed pages
└── 5. REPEAT until lint is clean and screenshots look right, THEN publish
```

Content gate (run alongside): grep the pulled theme for banned/stale claims —
`Level 1 & 2` · `guaranteed interview` · `1,544` · `£11.41|SROI` · `15,000` ·
`28,000 PSI` · `56.7%` · `waiting list`. Zero hits required.

## Tools in this folder

| File | What it does |
|---|---|
| `layout-lint.js` | Paste/eval in any page's console (or via Puppeteer/Chrome MCP). Returns JSON: `H-OVERFLOW` (horizontal scroll), `OFFSCREEN` (elements past the viewport, with selector + px), `BROKEN-IMG`, `SQUASHED-IMG` (aspect distortion), `COLLAPSED` (zero-height sections with content). Skips marquees/sliders/cart-drawer/skip-links by design. |
| `pages.txt` | The canonical page list to sweep. Add new pages here when they're created. |
| `pull-theme.mjs` | `node pull-theme.mjs ./out-dir` — downloads all text files of the working theme via Admin GraphQL (token read from ~/.claude.json at runtime, never stored). |
| `push-theme.mjs` | `node push-theme.mjs ./dir file1 file2…` — upserts text files to the working theme. |
| `push-binary.mjs` | Same, but handles images/fonts (base64). |
| `verify-files.mjs` | Re-fetches pushed files and diffs against local — run after EVERY push. |

**Theme ID lives inside the .mjs scripts** — update `THEME` when the working duplicate
changes. Never point them at the live (MAIN) theme.

## How to run a sweep

Desktop: any browser at ≥1280px, eval layout-lint.js per page (Chrome MCP `javascript_tool`
or DevTools). Mobile: Puppeteer with a 390×844 viewport (the Chrome window won't resize
when maximised) — `puppeteer_navigate` → `puppeteer_evaluate(lint)` → screenshot flagged spots.
Preview any unpublished theme with `?preview_theme_id=<ID>` — confirm the black preview
bar names the right theme before trusting what you see.

## Known gotchas (learned the hard way)

- `rd-num` stats **animate** (count-up) — a mid-animation screenshot shows wrong figures.
  Wait ~3s after load before judging numbers.
- A theme-wide `!important` img rule inflates inline-styled logos — size logos with
  `height:Xpx !important; width:auto !important; object-fit:contain`.
- Lazy images report `naturalWidth 0` before scroll — verify with `fetch(src, HEAD)`,
  not `img.complete`.
- Shopify normalises template JSON on write (adds banner, reformats) — verify templates
  semantically (parse + compare), not byte-identical.
- Schema limits: header `content` ≤ 50 chars, setting `label` ≤ 70, no `default: ""`.
- Section headers' comments can contain literal `{% schema %}` — always parse the LAST
  schema block in a file.

## Content policy quick-reference (for any copy fix)

- Prison names OK; **never a named/identifiable participant + a named prison**.
- "Makers", never prisoners/offenders/beneficiaries.
- **The vault's `System/Claims Register.md` is the ONLY canon.** This block was found stale on
  2026-09-02 (it still said 36 countries and named a Level 1 award) and had been quoted as
  guidance — fix the register, then this file, never the reverse.
- Stats canon: **90%+** completion (BBC programme records) · 4,000+ builders · 3,500+ frames ·
  1,500+ young people (builds, tasters, talks) · **45 countries**. No SROI. 39% = MoJ research
  framing only, with its mandatory context.
- OCN titles (both bespoke Level 2, neither Ofqual-regulated): "Workshop Skills and Sustainable
  Manufacturing" (1130735) · "Introduction to Product Design & Manufacture (Bamboo Balance Bike)"
  (1131207). **No Level 1 claim of any kind** until its OCN evidence is filed. Never "Level 1 & 2".
- Prison sites: the count formula only — "Build to Bond is established across five UK prison
  sites, at different delivery stages." Never a named list; never Feltham.
- Product safety (PS-001 open): never "rideable", "independently tested", "last for years", or any
  toddler/age/safety wording. Material claim = Swansea BS ISO 22157 tubing figure, cited at point
  of claim.
- Pricing: agreed per site and cohort. No £280/learner, no sector comparison. Cohort size is an
  open decision (D2) — publish no number.
