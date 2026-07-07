# Business-alignment audit — 2026 Shopify redesign vs the actual business

**Date:** 2026-06-11. Cross-checked the redesign build (sections + `bbc-redesign-2026.css` + copy/stats/pricing) against BBC's own source-of-truth in the Obsidian vault (`~/Documents/Bamboo bicycle club/`): **Brand Guidelines**, **Brand and Voice Guide**, **BBC Business Intelligence 2026**, **Pricing Strategy**, **BMP CIC 12-Month Strategy**. (Companies House MCP needs an API key and `search_brain` hit an OpenAI quota error, so this leans on the vault — which is itself compiled from web + Gmail + CH and is current to Apr 2026. CIC details independently corroborated there.)

## Verdict
**Strategically and narratively well-aligned; visually and editorially divergent in a few specific, fixable ways.** The build nails the hard part — the dual commercial/social model, the funding loop, the credibility stack, the no-named-prisons rule. The gaps are (a) brand visual spec (font + primary green + neutral), (b) one terminology rule, (c) a missing flagship stat, (d) a workshop price mismatch. Most are quick; a few are genuine brand-direction calls only you can make.

## Strongly aligned ✓
- **Dual model + funding loop.** "Every kit funds a place on our prison course" *is* the CIC model (commercial arm subsidises social arm; corporate £795/head ↔ prison £280/learner). The build's central narrative is exactly right.
- **Legal entity.** "Bamboo Mobility Project CIC · Reg 16257348" — matches (CIC since 2020, trading as BBC).
- **Programme structure.** Build to Bond = 6-week OCN core + 2-week balance-bike extension gifted to a child; OCN-accredited; generic prison references (no prison named). Matches the strategy doc and honours the hard rule.
- **Credibility stack.** FT (Sep 2025), Guardian, Discovery, Inside Time, Investec, Design Museum, Kevin McCloud Green Heroes, and the Prisons Minister endorsement (in the About timeline) — all real, all in the Proof Bank.
- **Headline stats.** 4,000+ since 2012 ✓, 90% prison completion ✓ (conservative — it's 100% at the lead site), £11.41 SROI (PACT) ✓, 36 countries ✓.
- **Kit pricing.** Kits from £375 ✓, balance bike £165 ✓, road-lugged £795 ✓.
- **Voice register.** Warm, direct, anti-corporate, contractions, no "Kind regards"/"please don't hesitate" — matches the Voice Guide's rules.
- **History & founders.** James Marr + Ian McMillan, Hackney 2012, CIC 2020, 2025 breakthrough year — accurate.

## Misaligned — brand-direction decisions (your call) ⚖️
These are deliberate evolutions in the 2026 design, but they diverge from the **documented** brand guide. Decide: update the guide to match the new design, or pull the build back to the guide.
1. **Typography.** Brand guide = **Plus Jakarta Sans** (Bold/ExtraBold headings, 18pt body). Build = **Atkinson Hyperlegible** — a deliberate accessibility choice (supports the AAA goal; the project rules even say "do NOT reintroduce Plus Jakarta"). *Recommendation: ratify Atkinson in the brand guide* — it's the better call for an accessibility-first brand, but the guide is now stale.
2. **Primary green.** Brand FOREST = **#073e27**; build = **#003C32** (a colder, darker green). Teal #3f8b66, gold #ffa900, lime #d4fd62 all match the brand exactly — only forest drifted. *Switching `--forest` to #073e27 is contrast-safe (both are very dark; AAA holds) and would match the wordmark.*
3. **Neutral background.** Brand has one neutral, CREAM **#f5f0e8**; the build invented **bone #E6DCC8 + paper #F1E9D8** (warmer, two-tone). Either ratify the new neutrals or align to #f5f0e8.
4. **"Highlight on dark only."** Brand says LIME is a highlight for **dark backgrounds only**; the build uses lime *button fills* on light sections. Arguably fine as an accent fill — flag for a ruling.

## Misaligned — fact/brand-rule fixes (should just fix) ❌
5. **"Makers."** Brand language rule: use **"Makers"**, never "prisoners"/"participants", for Build to Bond people. The build says "learners"/"a Build to Bond participant". (Counterpoint: "learners" may read clearer to a cold public audience — worth a quick decision, but the brand's stated preference is "Makers".)
6. **Missing flagship sustainability stat.** The build's "Why bamboo" uses soft claims (strong as steel, kinder ride). BBC's strongest, **independently-verified** proof is absent: **56.7% lower carbon than aluminium**, plus "**£50 of materials per frame vs £500 for metal**" and "absorbs 35% more CO₂ than trees, regrows in 3–5 years". Add the 56.7% figure — it's the single best sustainability line you own.
7. **Workshop price.** Business reality = **£795/person** (London; €895 EU; Cycle-to-Work 25–39% off). The build shows "from £595"/request-a-quote. Reconcile — either show £795 or keep request-a-quote but drop the £595. (Note your 2026-06-04 "no public workshop price" decision — if so, remove the £595 figure entirely rather than under-state it.)
8. **Cleared taglines unused.** You have cleared taglines — *"Build Bikes. Build Skills. Build Futures."* (CIC/prison/education), *"Ride what you believe."* (cycling), *"Build the change you want to see."* (impact). The build invented its own ("More than a bike. A second chance."). Consider using the cleared ones, at least the CIC line.
9. **Logo roundel.** Brand: the symbol must be **bright/luminous, never black, lighter than the wordmark**. The header roundel is forest (dark). Verify the logo treatment against this rule.
10. **Munich missing.** Build lists workshop locations as London/Amersfoort/Toulouse; **Munich** is an active hub too.

## Strategic alignment note
The redesign pours effort into the **commercial storefront**, while the business's growth engine is **prison contracts + grants** (£145k Year-1 target vs Shopify ~£12–18k/yr). That's still coherent **because** the storefront funds the mission — but make sure the site keeps routing high-value visitors to the **enquiry pathways** (prison/education/corporate), not just kit checkout. The "Partner / Work with us" door does this; keep it prominent.

## Suggested priority order
1. Add the **56.7% carbon** stat (pure win, additive).
2. Decide **font** (ratify Atkinson) + **forest #073e27** (quick, contrast-safe).
3. Fix **workshop price** (£795 or remove £595).
4. **"Makers"** ruling; **taglines**; neutral palette; logo roundel; Munich.

_Sources: vault `Business/Brand Guidelines.md`, `Marketing/Brand and Voice Guide.md`, `System/BBC Business Intelligence 2026.md`, `Business/Pricing Strategy.md`, `Business/BMP CIC 12-Month Strategy.md`._
