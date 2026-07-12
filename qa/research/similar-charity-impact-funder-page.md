# Similar-pages research — charity impact / funder page
*WORKFLOW step 1.4 · 2026-07-12 · browsed live at 375×812 (mobile-first) unless noted.
Our page: https://bamboobicycleclub.org/pages/impact?preview_theme_id=196820238710 (draft theme).
Recommendations are constrained to the FORMULA/DESIGN-BRIEF system (brutalist-editorial, Atkinson, lowercase, paper/forest/lime/steel) and the claims-discipline rules — nothing here introduces banned claims.*

## Sites reviewed

| # | Org | URL | Why chosen |
|---|-----|-----|------------|
| 1 | charity: water | charitywater.org/about | Design-led sector leader; the reference for donor trust architecture |
| 2 | Switchback | switchback.org.uk/what-we-do (impact section) | Prison-leaver charity; best-in-class impact stats for OUR exact sector |
| 3 | Tony's Chocolonely | uk.tonyschocolonely.com/pages/our-promise | Design-led commercial brand with a mission page; closest visual cousin to our brutalist-editorial system |
| 4 | The Bike Project | thebikeproject.co.uk/impact | Bikes + social mission; dated annual impact-page format |
| 5 | Key4Life | key4life.org.uk/our-mission | Youth prison rehab; strongest funder *content* (cost comparators), weakest design — useful negative control |

---

## 1 · charity: water — /about

**Hierarchy (eye path):** 1st the giant serif statement ("charity: water is a nonprofit…"), 2nd the three enormous impact numerals (209,241 / 29 / 21,641,908) one-per-viewport on mobile, 3rd the "100% model" promise. Type scale carries everything; almost no decoration.
**Scanning:** layer-cake — every band is a single idea, full-width, stacked. Mobile stats stack one stat per screen: number ≈ 90px, label in letterspaced caps beneath.
**Cognitive load:** ~8,240px total at 375px (~10 screens). One idea per band, ≤40 words per band until the team section.
**Trust architecture:** the page IS trust architecture — "How we work" = three promises (*we prove every project / we're an open book / we work with local partners*), each with its own verification CTA (SEE PROOF / VIEW ALL FINANCIALS / LEARN MORE). Claim + check-it-yourself affordance = Nielsen's "help users recognise" applied to credibility.
**Conversion path:** persistent GIVE button in header (0 scrolls, always); in-flow "GIVE TODAY" appears after the proof bands — trust before ask.
**Mobile notes:** stat labels use "?" tooltips for methodology — poor tap targets, provenance hidden behind a tap. Our inline small-caps source lines are *better* than this.
**Weakness:** cookie modal blocks half the first viewport; team bios double-rendered (duplicated content in DOM).

## 2 · Switchback — impact section

**Hierarchy:** 1st a full-bleed consented portrait (smiling trainee in Switchback tee), 2nd "Our Impact" over the photo, 3rd the highlighted-bar lede ("supported more than 2,000 young men…"). Human face = the impact claim.
**Scanning:** F-pattern within long text sections, layer-cake between them; 13,526px total (~16.7 screens) — long, like ours.
**The killer pattern — benchmark pairing.** Every outcome stat ships with its national comparator in the same breath: *"56% move into long-term work… **compared to only 12% of prison-leavers nationally**"*, *"91% do not reoffend within a year… nationally 45% reoffend"*. The comparator is what turns a number into evidence (anchoring/contrast effect). Our page quotes national stats ("why now") and our stats (hero strip) in **separate bands** — the pairing never happens.
**Trust architecture:** authority quote from a named prison governor (Emily Thomas, HMP & YOI Isis) near the top; beneficiary quotes attributed with **outcome-carrying roles** — "Michael, Chef and former Switchback Trainee", "Raihan, Hotel Receptionist" — the job title IS the proof. Award wins (Longford Prize, Robin Corbett Award) as a compact list.
**Conversion path:** weak — donate lives in nav; page is report-shaped, not funnel-shaped. We beat them here.
**Mobile:** text-over-photo with per-line highlight bars keeps AAA-ish contrast on a busy image — nice device, consistent with a brutalist system.

## 3 · Tony's Chocolonely — our promise

**Hierarchy:** 1st the manifesto headline at poster scale ("TOGETHER WE'LL END EXPLOITATION IN COCOA" — 3 lines filling the viewport), 2nd a single yellow CTA ("let's get into it"), 3rd chapter illustrations. Nothing competes with the h1 — textbook single display moment (our FORMULA rule 1).
**Scanning:** pure layer-cake. **5,444px total (~6.7 screens)** — the shortest page reviewed, for the biggest-mission brand.
**Cognitive load:** five chapters (the problem → forced labour → the route → 5 sourcing principles → all hands on deck), each ≈1 screen, ≤80 words, each ending in a lowercase "tell me more" link. Depth is deferred to sub-pages — progressive disclosure done as brand voice.
**Conversion path:** the mission page doesn't sell; it recruits ("Are you in?"). CTAs escalate from curiosity ("tell me more") to commitment ("all hands on deck").
**Trust architecture:** claims live in the chapters; the annual FAIR report carries the numbers elsewhere. (Weakness for a funder page — no stats on-page at all.)
**Mobile:** huge type survives 375px because every headline is ≤4 words/line; buttons full-width blocks.

## 4 · The Bike Project — /impact

**Hierarchy:** 1st "Our Impact 2024/25" (the **date in the title** — freshness as headline), 2nd a stat trio, 3rd a named beneficiary story (Marcia).
**Patterns worth stealing:** (a) dated impact page + an archive of seven past annual reports = longevity you can audit; (b) a **"What's Next?"** band — four named ambitions for 2025-26 ("give 1,500 refugees bikes…") — answers the funder's actual question, *what does new money do?*; (c) beneficiary story arc (fear → learning → "I now go to work for the NHS cycling") — concrete single instance beats aggregate stats (identifiable-victim effect).
**Failures to avoid:** the animated counters rendered **"1 TONNES / 1 REFUGEES"** — JS count-up never fired, so the hero stats printed as literal "1"s. A reliability lesson for any scroll-triggered number. And the mid-page impact list is 7 emoji-bulleted percentage stats in a row — overload, none of them land.
**Mobile:** full-screen cookie wall; content OK once past it.
**Conversion path:** "Open our Impact Report" is the primary CTA — the report download is treated as the conversion, which for funder audiences is right.

## 5 · Key4Life — /our-mission (negative control)

**Content is funder gold:** 8% reoffending vs 50%+ national; **£4,750 programme cost vs £54,000 average annual prison place** — unit-economics framing a commissioner can repeat in a business case; "four times more likely to be employed".
**Design buries all of it:** founder-letter text wall, no stat cards, no hierarchy — the £4,750-vs-£54,000 line is invisible unless you read every paragraph. F-pattern skimming fails; a funder skimming for 30 seconds leaves with nothing.
**Lesson:** comparator numbers must live in display type, never in body copy.

---

## Our page scored on the same criteria (375×812, draft theme)

**Hierarchy:** 1st "building bikes. rebuilding lives." (paper-on-photo, correct single display moment), 2nd the locked mission lede, 3rd the lime "Partner with us →" pill. Clean — matches Tony's discipline.
**Scanning:** layer-cake, one left axis mostly held. Exception: "get involved" band pairs a left-set h2 with a **centered** lede — mixed axis (FORMULA §4 violation).
**Cognitive load:** **15,179px (~18.7 screens) — the longest page in the comparison set** (cw 8.2k, Tony's 5.4k, Switchback 13.5k). 10 bands. Heaviest: "where we operate" = **7 enumerated count-rows** (4/10/1/3/5/6/45) where the number chip means a different thing per row (sites, partners, transfers…) — counting-for-counting's-sake; and "recognised by" = 2,419px tall (3 screens) mixing proof line + money model + 2 quotes + logos + awards + funder credit.
**Nielsen:** visibility of system status good ("Data updated July 2026"); consistency good post-FORMULA; **aesthetic-minimalist** is where we lose points (bands 7 & 9 overloaded). One first-pass screenshot caught a **full blank viewport** around scrollY ≈ 800–1500 before reveal animations fired — anchor jumps or slow JS could strand users on empty paper (same failure family as Bike Project's "1 TONNES").
**Conversion path:** 0 scrolls to "Partner with us" (hero) — best in set. CTA escalation is coherent: partner/back (hero) → report → pathway CTAs → three doors → final band repeats hero pair. ~11 CTAs total is acceptable because each band holds one.
**Trust architecture:** stat sources inline in small caps (better than cw's tooltips); named staff quote (Sally Allsopp); Investec/Inside Time quotes + logos. **Missing:** our own outcome stats are never benchmarked against national baselines (Switchback's device), and there is no forward-looking "what's next" for funders.
**Mobile:** stat strip 2-up works; pathway cards with numbered lime nodes are the strongest bands on the page; "who backs us — and who has covered the work." wraps to 4 lines — over FORMULA's ≤15-word lede spirit for band heads (comparators keep heads ≤2 lines at 375px).

---

## Adopt / Adapt / Avoid

| Call | Pattern | Site | Theory reason | How it lands in OUR system |
|------|---------|------|---------------|-----------------------------|
| **ADOPT** | Benchmark-paired outcome stats ("91% … nationally 45%") | Switchback | Anchoring/contrast — a number only persuades against a baseline; Key4Life proves the same content dies in prose | In the hero stat strip (`.rd-stat` cards, bbc-impact-2026): give our outcome stats a second source-caps line, e.g. under "90%+ prison course completion" add the national prison-education completion baseline — **only if Proof Bank has a verifiable MoJ figure**; never invent the comparator. Alternatively pull one "why now" MoJ stat into the same card row so ours-vs-context sits in one viewport |
| **ADOPT** | "What's next" forward band (named ambitions, no £) | The Bike Project | Funders fund futures, not archives (goal-gradient; TBP makes it the pre-CTA band) | One new short band before "get involved": 3 numbered-node ambitions (next prison sites, next school cohorts, hub growth) using the existing lime step-node primitive; facts from vault only, NO £ amounts (brief: backed-by = names/logos only) |
| **ADOPT** | Report-as-conversion: dated title + downloadable report + archive | The Bike Project | Freshness heuristic + auditability = longevity proof (since 2012 claim made checkable) | We already date-stamp data; make "Read the 2026 impact report →" a proper **download-asset card** (DESIGN-BRIEF component list) inside "recognised by", not a text link under the hero stats |
| **ADAPT** | Three verifiable promises, each with its own proof CTA (SEE PROOF / VIEW FINANCIALS) | charity: water | Trust = claim + a way to check it (credibility heuristics); a promise without an affordance is copy | Recast the steel money-model callout in `.bbc-impact-cred` as 3 one-line promises — *kit revenue covers running costs · funder money goes to delivery · funders get completions, OCN awards and session data each term* — each ending in an arrow link (report anchor · OCN page · coverage page). Steel surface, ✱ footnote style |
| **ADAPT** | Progressive disclosure — short chapters + "tell me more" | Tony's Chocolonely | Miller/chunking; Tony's covers a global mission in 5.4k px, we take 15.2k | Cut "where we operate" from 7 count-rows to 4 (prisons · schools & universities · international hubs · 45 countries) + one "the full picture →" link (anchor or accordion for transfers/partners). Kills the weakest number-chip semantics too |
| **ADAPT** | Outcome-carrying quote attribution ("Michael, Chef and former Trainee") | Switchback | Identifiable-victim effect; the role after the programme IS the stat | Where consented maker quotes exist (vault Story Bank), attribute as "former Maker, now peer instructor" / role-after — **anonymised for prison participants** (never name + prison, per hard rule). Sally Allsopp attribution already conforms |
| **ADAPT** | Highlighted-bar text over full-bleed portrait | Switchback | Keeps AAA contrast on busy photography without killing the image | Optional duotone-band experiment (brief already plans duotone on Impact): line-by-line paper or lime highlight bars behind lede text on photo bands. Fits brutalist grammar; James judges |
| **AVOID** | JS count-up / reveal-dependent content | The Bike Project ("1 TONNES") + our own blank first-paint band | Reliability > flourish; scroll-reveal that fails prints nonsense or blank paper | Keep numerals static in `.rd-stat`. Audit our reveal-on-scroll (bbc-impact-2026): content must be visible without JS/on anchor-jump (e.g. reveal class defaults visible, animation as enhancement only) — the blank viewport at ~scrollY 800–1500 on first pass is the symptom |
| **AVOID** | Tooltip-hidden stat sources ("?" icons) | charity: water | Recognition over recall; 24px tooltip targets fail on mobile; provenance shouldn't need a tap | Keep our inline small-caps source lines exactly as they are — this is a point where we already beat the sector leader |
| **AVOID** | Comparator stats buried in body copy | Key4Life | F-pattern skimming misses prose; their £4,750-vs-£54,000 gold is invisible | Rule for all future impact copy: any ours-vs-national number lives in a stat card/display type, never mid-paragraph |
| **AVOID** | 7+ stats in one undifferentiated list | The Bike Project (emoji list) | Overload — when everything is a percentage, nothing is | Cap any stat group at 4 (our hero strip and "why now" already comply; keep it that way when adding benchmarks) |

## Page-level fixes surfaced by the comparison (for the next DEFINE)

1. **Pair our outcomes with baselines** (Switchback) — the single highest-leverage change for the funder audience; Proof Bank verification required before any new comparator ships.
2. **Add a "what's next" band** (Bike Project) — currently no forward offer between proof and "get involved".
3. **Compress "where we operate" to 4 rows** and fix the mixed number-chip semantics (Tony's chunking).
4. **Split or tighten "recognised by"** (2,419px): promise-list rework + download-asset card; shorten the h2 to ≤2 lines at 375px ("who backs the work." style).
5. **Fix reveal-on-scroll fallback** so no band can paint blank (our own defect, same family as TBP's broken counters).
6. **Align the "get involved" lede left** — one left axis (FORMULA §4).
7. Keep as-is (verified better than comparators): inline stat sourcing, hero CTA at 0 scrolls, one-CTA-per-band escalation, numbered pathway nodes.
