# CRIT (final gate) — /pages/impact — draft 196820238710 — 2026-07-12, evening pass

*Fresh-eyes CRIT before James. Reviewed in real headless Chrome via Playwright (the in-app pane freezes on this page; Playwright drives the same engine the Puppeteer MCP does and saves screenshots to disk). Shopify.theme.id **196820238710** confirmed on every run. Mobile 375×812 first, then desktop 1280px. Cookie banner declined. Every number below is a measured computed value or a timed DOM sample — not an estimate.*

**Evidence:** `qa/evidence/2026-07-12/` — `band-00-first-screen-viewport.png`, `band-01…band-10`, `band-09-backers-part1..3.png`, `mobile-presswall-viewportshot.png`, `desktop-pathways-fork.png`, `desktop-backers-grid.png`, `desktop-backers-press.png`, `desktop-hero-viewport.png`, plus `metrics-mobile.json`, `metrics-desktop.json`, `diag.json`.
⚠️ One capture caveat: `band-09-backers.png` (tall-element stitch) shows the press logos as empty white boxes — that is a **screenshot artifact**, pixel-probed and disproven (`diag.json` + `mobile-presswall-viewportshot.png` are authoritative: the logos paint). Do not fix "missing press logos"; the real band-9 defects are listed below. This artifact is the same failure class as the in-app pane freeze — likely scroll-driven reveal/paint load on this page.

**Page metrics:** mobile total **14,697px (~18 screens — GREW +1,172px since the morning CRIT's 13,525px; D12 regression)** · desktop 10,123px · horizontal overflow at 375px: none (but see chip clipping, D2) · AAA sweep: 20+ sampled pairs, **all ≥7.37:1 — PASS**.

---

## Tonight's claimed changes — verified one by one

| Claim | Verdict | Evidence |
|---|---|---|
| where-we-operate 6-group band, verb-honest | ✅ **LANDED** — 6 groups render: "prison programmes — we run" · "schools & universities — we deliver with" · "public workshops — we run" · "international hubs — our partners run" · "overseas skills transfers — we have taught in" · "countries — kits built worldwide". Ethiopia correctly framed "(wheelchair project with BBC Munich)"; no Camden/Project Zero confusion; Brighton correctly absent; matches OPERATIONS-MAP verification rules | band-07 png, metrics-mobile `opsBand` |
| funder mechanism steel callout | ✅ **LANDED** — steel box at top of backers band: "Kit and workshop revenue covers our running costs. Funder money goes directly to programme delivery — and funders get completions, OCN awards and session data each term." | band-09-part1 |
| backers single grid, real FT logo + 3 chips | ⚠️ **HALF-LANDED** — one `ul.rd-backers` with 7 cells and 3 consistent chips exists in the DOM, but the **layout is broken**: NLCF + OCN logos render **0×0 (invisible)**, Investec chip **overlaps** the LSBU chip on desktop (235+233=468 > 447) and is **clipped off the right edge of a 375px screen**, Inside Time orphans onto its own row, and FT now appears **twice** (press wall + backers row) | desktop-backers-grid.png, band-09-part3, diag.json |
| stats render instantly (no count animation) | ❌ **NOT LANDED** — timed DOM samples: **"41%+" @200ms → "82%+" @600ms → "90%+" @1200ms**. `bbc-stat-countup.js` still loads on the page and animates `.rd-num` (adds inline `font-variant-numeric` + `bbc-counted`). The builder note ("countup disabled 15:18") is contradicted by a 15:24+ measurement on the deployed draft | metrics-mobile `statSamples`, findjs probe |
| eyebrows lowercase everywhere | ✅ mostly — all 10 `.rd-eyebrow`-class elements render `text-transform:lowercase`. **Side effect:** the ops-band partnership line renders "**in partnership with hm prison & probation service**" — the transform crushes the proper noun HM/HMPPS (the exact STEM/Makers bug class, new location). And the steel-band card chips still render **UPPERCASE** (BUY / PARTNER / SUPPORT), as do "AS FEATURED IN" and the awards caps line — three label grammars on one page | band-07/08/09 pngs, metrics `allEyebrows` |
| converge strip scale | ✅ **LANDED** — title 24px vs note 18px on lime, AAA 10.65/8.67 — the payoff line now lands (was 18px) | band-03 png |
| "both arms" / 40%-vs-39% stale copy | ❌ **NOT FIXED** — band 4 h2 still reads "**both arms** sit on live national priorities." (the band directly above it just branded them *pathways*), still shows "**~40%** less likely to reoffend" while band 6 body says "**39%** … (MoJ family-contact data)" — same claim, two numbers, one page — and "**up to 9pp**" jargon is still there | band-04 png, metrics `copy`/`snips` |

James's reference screenshots IMG_3193–3198 could not be found on disk (searched `~` depth 4) — reviewed against the written FORMULA instead.

---

## Per-band FORMULA scorecard

Rows: **T**ype roles · **S**ymbols · **L**ogo system · **A**natomy/axis · **Z**ero-knowledge header · **C**olour grammar · **AAA** (measured) · verdict.

| # | Band | T | S | L | A | Z | C | AAA | Verdict |
|---|---|---|---|---|---|---|---|---|---|
| 1 | Hero | ❌ h1 **28px mobile** — smaller than every h2 (43.2px); spec ≈47px at 375w. Desktop 84.5px ✓. Eyebrow 12px/w800 vs the 14px/w700 used everywhere else | ✓ | n/a | ✓ (2 CTAs but hero pair is system) | ✓ | ✓ | 9.12–10.65 | **FAIL** (the one thing James flagged from his phone, twice) |
| 2 | Stats (dark) | ✓ | ✓ | n/a | ❌ no eyebrow, no h2 — numbers hit a stranger with no band header | — | ✓ | 8.51+ | **FAIL** — count-up animation (41→82→90 over 1.2s) on a funder page; "BBC programme records" still stated twice ~50px apart |
| 3 | Pathways fork | ✓ h2 43.2, h3 33.6 per spec, body 17px ✓ | ✓ ✱ + numbered nodes + word-chips | n/a | ✓ desktop fork geometry is excellent (node → connector → two panels → lime converge); eyebrow centered vs left h2 | ✓ STEM renders correctly now | ✓ (lime CTA inside prisons/steel track — known James-call nit) | 8.37–9.12 | **PASS** (nits) |
| 4 | "why now" policy (dark) | ✓ | ✓ | n/a | eyebrow centered | ❌ "both arms" = stale vocab; "~40%" contradicts band 6's 39%; "9pp" fails the stranger test | ✓ | 8.51+ | **FAIL** (copy only — 3 string edits) |
| 5 | Prison workshops (bone) | ⚠️ body 19px (band-2 bodies are 17px) | ✓ | n/a | ❌ desktop axis x=262 vs page x=72; no lede, no image on an imagery-licensed band | ✓ | ✓ | 7.37–9.57 | **CONDITIONAL** |
| 6 | Build to Bond (dark split) | ✓ "Makers" casing correct now | ✓ | n/a | ✓ image fills top on mobile | ✓ 39% correctly cited; Sally Allsopp attributed | ✓ | 8.51+ | **PASS** (father-only framing = James's call, noted previously) |
| 7 | Where we operate (paper) | ⚠️ group h3 18px — a size the scale doesn't have | ✓ count-badge nodes | ⚠️ HMPPS crown 60px at band top (3rd logo height on page; also duplicated in band 9) | ⚠️ eyebrow/lede/partnership centered, h2+groups left | ✓ verb-honest, verified list | ✓ | 8.31+ | **CONDITIONAL** — content is right; "in partnership with **hm** prison…" proper-noun crush; "1 public workshops" grammar |
| 8 | Three ways (steel) | ⚠️ card h3 21px (another off-scale size) | ❌ chips render UPPERCASE | n/a | ⚠️ subline centered; desktop axis x=313; SUPPORT card still has the lone lime shadow | ✓ | ✓ | 7.97–13.09 | **CONDITIONAL** |
| 9 | Backers (paper) | ✓ | ✓ | ❌❌ NLCF+OCN 0×0 invisible; chips overlap (desktop) / clip off-viewport (mobile); FT ×2 on page; HMPPS ×2 on page; press row 38px vs backers 44px vs crown 60px (spec: ONE height, 34px mobile); Telegraph & FastCompany overflow their cells 10px each side on mobile; FT optically tiny (30px w vs 116–180 neighbours) | ⚠️ "AS FEATURED IN" + awards caps line = extra label grammars; band 2,237px on mobile (biggest on page, grew again) | ✓ | ✓ steel callout ✓ | 10.78 | **FAIL** (worst band — and it's the one a funder scrolls before the ask) |
| 10 | Final CTA (dark) | ✓ | ✓ | n/a | ⚠️ eyebrow centered; 2 CTAs | ⚠️ adjective headline ("more inclusive, skilled future") vs big-type-=-claims rule; primary CTA addresses 1 of 3 audiences | ✓ | 8.51+ | **PASS** (nits, James's call) |

**Cross-cutting:** one h2 size everywhere ✓ (43.2/86.4px) · buttons one 15px pill system ✓ · zero banned claims ✓ (`copy` sweep: 28,000/steel/56.7/£11.41/£280/100% all 0) · "learners"/"prisoners" 0 ✓ · 45 countries used consistently (×5), no "36+" ✓ · 3,500+ bikes is Proof-Bank-verified ✓ · symbols clean (✱ ×3, nodes, chips; strays: none) ✓ · safeguarding: no participant↔prison linkage, empty-workshop photo ✓ · **desktop left axes: x=72 / 262 / 313 / 332 (+712 split) — still four+ axes, unchanged from morning CRIT** ❌.

---

## Remaining defects, ranked (selector + fix)

1. **Mobile hero h1 = 28px** — smaller than every section head; page's display moment inverted. Cause unchanged since morning CRIT: `bbc-mobile-fixes.css @media(max-width:749px){h1{font-size:clamp(1.75rem,6vw,2.5rem)!important}}` beats the hero rule. Fix in `assets/bbc-statement.css` (loads later): `@media (max-width:749px){ .bbc-rd .rd-hero h1{ font-size:clamp(40px,11vw,52px) !important; } }`. *(First thing James sees; he has flagged it twice.)*
2. **Backers grid layout broken** — `assets/bbc-statement.css` has TWO competing `.rd-backers` rulesets: flex (L397–402) and a later grid override (L603–606). The override's `.rd-backers__logo{max-height:44px!important;height:auto!important}` collapses `logo-nlcf.svg` + `logo-ocn-london.svg` (no root width/height attrs) to **0×0**; the grid's `minmax(150px,1fr)` columns can't hold the 233px `white-space:nowrap` chips → overlap/clipping. Fix: delete L603–606, keep the flex block, and restore `height:44px!important;width:auto!important` (or add width/height attrs to the two SVGs). Also remove the FT cell from `.rd-backers` (press logo, already in the press wall) — kills the FT dup and honours backed-by vs featured-in grouping.
3. **Band 4 copy (3 strings, template settings)** — "both arms" → "both pathways"; "~40%" → "39%" (matches band 6 + MoJ citation); "up to 9pp" → spelled out ("up to 9 percentage points lower reoffending"). Same funder/commissioner viewport as the stat conflict.
4. **Stats count-up still live** — remove/gate the `bbc-stat-countup.js` include on the deployed theme (asset exists remote-only; not in the local mirror — pull before editing, per safe-remote-edit workflow). The local section markup already pre-bakes `bbc-counted`, but the deployed script animates regardless — verify the deployed section + script pair after pulling.
5. **Proper-noun crush, new location** — ops-band partnership line renders "hm prison & probation service". Remove `text-transform:lowercase` from that element's class; author the casing at source ("In partnership with HM Prison & Probation Service" — keep HM caps).
6. **Logo system: one height, once per page** — HMPPS ×2 (60px ops + 44px backers): keep one (backers), or move the crown inline with the partnership line per James's earlier directive. Unify press row 38px → 44px desktop/34px mobile per FORMULA (the 34px mobile rule at L402 is currently dead — overridden by L605).
7. **Press cells** — `.rd-logocell img{max-width:calc(100% - 24px)}` (Telegraph + FastCompany overflow their cells 10px each side at 375px); FT optical size (30px wide vs 116–180 neighbours) — allow the stacked FT mark ~56px height or swap to the wide FT wordmark.
8. **Label grammar** — steel-band chips (BUY/PARTNER/SUPPORT), "AS FEATURED IN", and the awards caps line all render uppercase against the lowercase system; morning CRIT already asked for the caps line to be deleted/merged. One chip/crosshead style, lowercase.
9. **One left axis (desktop)** — bands 5/8/10 containers at x=262/313/332 vs page grid x=72; commit `.rd-wrap` max-widths to one grid. Eyebrow alignment still splits center (bands 3/4/7/8/10) vs left (5/6/9).
10. **Polish** — band 2 gets an eyebrow+h2 (band anatomy + zero-knowledge); dedupe its double source line; band 5 lede+workshop detail image; "1 public workshops" → "1 public workshop city — we run"; SUPPORT card lime shadow → ink; converge note 18px → 14–15px footnote size; page length regression (14.7k px, +1.2k tonight) — the backers fix (#2) should reclaim most of it.

---

## Verdict: **NOT READY FOR JAMES — one more fix pass.**

The genuinely new work is good: the fork-and-converge pathways band is the best thing on the page (desktop geometry reads instantly), the 6-group operations band is verified, verb-honest and safe, and the funder-mechanism callout is exactly the missing beat. Claims discipline and AAA are clean across the page.

But the gate is mechanical, and three of the four blockers are items James has personally rejected before: the mobile hero is still the smallest heading on the page (28px), the backers band — the last thing a funder sees before the ask — has invisible funder logos and chips that clip off a phone screen, and "both arms"/40%-vs-39% sit uncorrected on the commissioner band. The count-up that tonight's notes claim was disabled still animates on the deployed draft. Fix items 1–5, re-screenshot bands 1/2/4/9 mobile, then hand to James.
