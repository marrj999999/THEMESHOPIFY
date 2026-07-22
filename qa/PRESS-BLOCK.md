# THE PRESS BLOCK — standard, research, canon & feedback loop (2026-07-22)

One snippet (`snippets/bbc-press.liquid`) renders every "as seen in / recognised by" moment on the theme.
Never hand-build a press row again — render the snippet. This doc is its contract.

## Why press proof works (research, 2026-07-22)
- **It answers exactly one question — "are you legit?"** (the Halo Effect). It's the *lasting* value of a
  press hit: referral traffic fades, the logo stays (Orbit Media). Expect a *modest* lift, not magic —
  reviews are the highest-ROI proof; press supports them (RevenueFlows/Baymard).
- **"When you say it it's marketing; when they say it it's social proof."** Use the publication's words.
- **Logos alone are going numb.** 1000-landing-page study (2026): repeated bare "featured-on" logos now
  *erode* trust; **pairing a real quote from the publication with the logos** is the upgrade that works
  (the Brightland "brag bar" + quote pattern).
- **4–7 recognisable logos beat 20.** "One FT beats ten unknown blogs; a long wall reads as padding."
  3–6 above the fold outperforms a scrolling marquee (Clique/RevenueFlows).
- **Placement**: homepage → near the fold for immediate credibility; PDP → mid-page proof zone beside
  reviews/guarantees, not competing with the product; put specific proof next to the claim it supports.
- **Quiet wins**: one clean row that supports the page. (Research says grayscale; James's locked brief
  says full-colour logos — we keep FULL COLOUR but stay quiet via small uniform height + spacing.)

## 10 layout patterns considered
1. **Quote-anchored logo bar** — one publication quote + 4–7 logo row. ← **CHOSEN default (`style: 'bar'`)**
2. Quiet logo row, no quote (Brightland brag bar) ← **`style: 'quiet'`** for secondary placements
3. Rotating quote spotlight (carousel) — motion cost, reduced-motion issues; rejected as default
4. Logo grid with hover-reveal quotes — hidden content on touch; rejected
5. Marquee/ticker — research: repetition erodes trust; footer already has a marquee; rejected here
6. Press card row (logo+quote+link cards) — heavy, §8 bordered-band budget; rejected
7. Big pull-quote with tiny logo strip beneath — folded INTO pattern 1 (quote uses `.rd-pull`)
8. Press + backers split rows — Impact keeps this via two snippet calls / backers block
9. Inline proof beside a claim — already used (GCN quote in the proven-ride band); keep for claims
10. Global footer strip (greyed) — already exists (`rd-foot-press`); untouched

## The canon (verified assets + canonical links — single source of truth, hardcoded in the snippet)
**national** (default): FT (`logo-ft.svg` → FT prison-cycle article) · Guardian · BBC News · Telegraph ·
CNN · Inside Time (→ Lowdham article). **cycling**: BikeRadar (→ first-ride) · road.cc (→ easy-build) ·
Grand Designs · Huck. Links from the Proof Bank canonical map; publications without a canonical article
link to `/blogs/news`. ⚠️ GCN logo asset MISSING (James: source an SVG; GCN has a canonical article ready).
⚠️ Use `logo-ft.svg` (wordmark 220×32) — NOT `logo-financial-times.svg` (stacked 318×402, clips in rows).
Light surfaces only (steel/paper); the footer's greyed strip covers dark.

## Rules (CRIT checks these)
Real logos only — NEVER styled-text fakes (James: "looks fake and unauthentic") · quote must be a real,
attributable publication quote (claim-lint applies) · 4–7 logos · uniform height (26px desktop / 22px
mobile, `!important`-armoured against the global `img{height:auto!important}`) · every logo links to its
canonical article with `?ref=press-block` · full colour, light surfaces.

## FEEDBACK LOOP (the standard's improvement cycle)
1. **Measure**: every logo/quote link carries `?ref=press-block` → GA4 landing-page report filters on it
   (blocked until James grants GA4 access — first review runs on Shopify's own /blogs traffic report).
2. **Review quarterly** (or on new coverage): swap the weakest-clicked logo/quote for new coverage;
   quotes rotate from the Proof Bank press section. Log swaps in this file's changelog below.
3. **CRIT**: `page-pass` scores any band containing a press block against the Rules above.
4. **James's phone check** on every change (the human gate) + new-coverage trigger: press hit lands →
   add canonical article to Proof Bank → consider promoting into the canon here.

## Changelog
- 2026-07-22 · v1 — snippet built; homepage band rewired to `bar` (FT IKEA-effect quote); Impact
  featured-in strip migrated to `quiet`.

## THE QUOTE BANK (mined 2026-07-22 — vault Proof Bank/CS-05 + the canonical republished articles, which were source-verified in the June 2026 blog sweep)
| Quote | Attribution | Verified in | Wired to |
|---|---|---|---|
| "Taps into 'the IKEA effect' — that extra bit of affection people reserve for objects they put together themselves." | Financial Times, 2025 | FT canonical article | Homepage press bar |
| "The bamboo bike course offers more than just technical training — it provides an avenue for creativity, teamwork, and self-expression. Watching the pride on a father's face when he presents a bike to his child is something special." | Sally Allsopp, Industries Manager, HMP Lowdham Grange — in the FT | FT canonical article | Impact · Build-to-Bond band |
| "Pandas eat it. Schoolchildren used to be caned with it. But now prisoners at Lowdham Grange have found a surprising new use for bamboo — making bicycles out of it." | Inside Time (verbatim press; "prisoners" allowed in quotation) | Inside Time canonical | Impact · quote reel |
| "Finding employment after release reduces the chance of reoffending significantly…" | Lord Timpson, UK Prisons Minister — Inside Time | template (June sweep) | Impact · cred band (RESTORED — was gating without rendering) |
| "Innovative projects, such as Build to Bond, support rehabilitation and help cut reoffending." | Lord Timpson | section default | Programmes · cred band |
| "Si meets with Emily Chappell, the creator of this amazing bamboo bike, to hear why your next bike should be made from bamboo." | Global Cycling Network | GCN canonical article | Kit PDP · under the build film |
| "To get one of these bamboo beauties you go on a two-day course to make your own — although home-build kits are now available too." | Gregor MacGregor, BikeRadar | BikeRadar canonical article | Workshops · press band |
| "Bamboo naturally dampens vibration, allowing the smoothest ride." | The Guardian | home proven-ride band (June sweep) | Homepage proven-ride |
| "A really, really comfortable ride — smooth but not too flexy." | Kate Rawles · BikeRadar | home proven-ride band | Homepage proven-ride |
| road.cc: "…impressively improved the accessibility of building a bamboo bicycle." | road.cc | road.cc canonical | (spare — kits/which-kit candidate) |

Coverage map: Home=FT · Impact=Timpson+Sally+InsideTime · Programmes=Timpson · Workshops=BikeRadar · PDP=GCN · Team-building=client logos (deliberate, not press). Guardian/CNN/Telegraph/BBC News: logos verified, no canonical article yet → logos link to /blogs/news until articles exist.

- 2026-07-22 · v1.1 — quote bank mined & wired (7 placements verified); Timpson render restored; Sally Allsopp quote recovered from the FT canonical.
- 2026-07-22 · v1.2 — ALL REAL LOGOS decision (James): About band migrated to the standard; teambuilding
  client wall asset-only (GM/Google/McLaren held pending verification); `align: 'left'` param added —
  homepage band on the one-left-axis (72px, measured).
- 2026-07-22 · v2 — SCROLLING QUOTE REEL added (`reel: true`): 8 verbatim quotes, one per publication,
  each linking to its coverage; marquee w/ pause button, reduced-motion → static wrap. CANON LINKS
  completed: Guardian → theguardian.com (Stuart Heritage) · BBC News → Kate Strong blog · CNN Money →
  blog · Fast Company → blog. ⚠️ TELEGRAPH REMOVED from canon — vault Press Log marks the 2017 feature
  "unverified" (James: confirm publication evidence to reinstate). All 8 internal links verified 200.
- 2026-07-22 · v3 — GAP CLOSURE: sourced OFFICIAL logo files (no fabrication) — The Independent (SVG,
  Wikimedia official file), Cycling Weekly (SVG, official), Evening Standard (PNG 1024×133, official),
  BikeBiz (PNG 1000×204, publisher's own file). NATIONAL canon now the 6 UK-strong: FT · Guardian ·
  BBC News · Independent · Evening Standard · Inside Time (CNN + Fast Company remain in the QUOTE REEL
  with live links — coverage preserved, logo row stays 4–7 per research). CYCLING canon: BikeRadar ·
  road.cc · Cycling Weekly · Huck · Metro · BikeBiz(→ France-expansion article). Recognition strip
  DEPLOYED on About (Design Museum · National Justice Museum live exhibition · Musée du Luxembourg ·
  Investec). max-width now !important-armoured (the global img rule stretched the Independent to 368px).
  STILL OPEN (need James/external evidence): GCN, SUITCASE, D&TA logo files · Telegraph/FT-2013/FT-H&H
  publication evidence · GQ = never list until published.
