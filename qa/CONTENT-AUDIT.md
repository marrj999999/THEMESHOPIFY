# Impact Page — Editorial Content Audit
*Content/copy audit (NOT design/CSS). Compiled 2026-07-13 from the live draft-theme render (`/pages/impact?preview_theme_id=196820238710`), `sections/bbc-impact-2026.liquid`, `templates/page.impact.json`, and ground truth: `qa/DESIGN-BRIEF.md`, `qa/OPERATIONS-MAP.md`, `qa/research/similar-charity-impact-funder-page.md`, the LOCKED mission.*

> **What actually renders:** 13 bands (below). Three schema features are dormant and do NOT appear on the live page — the **case-study card** (`cs_quote` blank), the **3-card "pathway" band** (`path_title` blank, no `pathway` blocks in `block_order`), and the **`cred_quote1/2` text** (the "recognised by" band gates on `cred_quote1` being non-blank but the template never prints the quote — it is a dead setting that silently keeps band 8 alive). Treat these as latent scaffolding to strip later.

---

## 1. Band-by-band table

| # | Band (live) | Its job | Verdict | One-line reason |
|---|---|---|---|---|
| 0 | **Hero** — "building bikes. rebuilding lives." + locked mission lede + Partner/Back CTAs | State the mission + primary ask in one screen | **KEEP** | Correct single display moment; 0 scrolls to CTA (best in comparison set). |
| 1 | **Stats (dark)** — "the record since 2012": 90%+ · Level 2 OCN · 4,000+ · 45 countries + report link | Four verified proof numbers | **KEEP + REWRITE** | Strong, but 90%+ has an empty comparator field — add a national baseline (Switchback pattern, highest-leverage funder fix). |
| 2 | **Two arms (paper)** — "we set up bike-building workshops that deliver STEM education around the world" + make-engineers / build-to-bond flows + converge strip | Theory of change: prevention + rehabilitation | **REWRITE** | The heading is off the locked mission and collides with band 7's "around the world"; the two flows are the strongest thing here. |
| 3 | **Inside the workshop (paper)** — "we build real workshops inside prisons" — HMP Lowdham Grange, 2,000 sq ft, six-week OCN course | Show the delivery is real, not a gesture | **KEEP + REWRITE** | Essential "how", but OCN is stated 3× inside two adjacent bands (2→3). |
| 4 | **Build to Bond (dark split)** — "the follow-on / the bikes Makers build go home to their kids" + 39% family stat + Sally Allsopp quote + Run CTA | Emotional core + family-ties mechanism | **KEEP + REWRITE** | The heart of the page; but the in-prose "39%" duplicates band 9's display stat (research: outcome numbers belong in display type, never mid-paragraph). Eyebrow "the follow-on" fails the zero-knowledge test. |
| 5 | **Impact stories grid** — "the evidence — real projects, linked": UCL · Community · Kenya | Prove breadth beyond prison | **MERGE** | Overlaps band 7's overseas/education rows and band 6's voices; fold with band 6 into one "real projects, in their words" proof band. |
| 6 | **Voices (dark reel)** — "what the impact sounds like": 6 scrolling quotes | Human proof in first-person | **MERGE + CUT** | 6 quotes is heavy; Timpson quote ≈ band 9 policy framing, Investec citation ≈ band 8 recognised-by — trim to 3 strongest, merge with band 5. |
| 7 | **Where we operate (paper)** — "from four UK prisons to 45 countries" + 4/10/3/45 map stats + 7 op-group rows | Prove scale/reach | **REWRITE (compress)** | Heaviest, weakest band: 7 count-rows where each number means something different; "45 countries" said 5× inside this one band. Cut to 4 groups. |
| 8 | **Recognised by (paper)** — "who backs this work" + 14yr/4,000+/3,500+ subline + 3 promises + report card + press logos + backers | Trust architecture | **KEEP + CUT** | Good bones (promises + report + logos), but ~3 screens tall and the stats subline is a verbatim restatement of band 1. |
| 9 | **Why now (dark)** — "both pathways sit on live national priorities": £18bn · 9pts · 39% · 1m+ | Funder context — why this matters now | **KEEP + MOVE** | Right content, wrong place: stranded at band 9, disconnected from the family-ties story (band 4) it explains. Move up to pair with band 4. |
| 10 | **What's next** — "what new funding builds next": 3 costed ambitions | Answer "what does new money do?" | **KEEP** | Exactly the funder-facing forward offer the research said was missing; keep. |
| 11 | **Get involved (steel)** — "pick your way in": buy / partner / support cards | The ask, three doors | **KEEP + MERGE** | Solid, but mixes audiences (shopper + commissioner + funder); absorb band 12 into it. |
| 12 | **Final CTA (dark)** — "help us build…" + Run-it-in-your-prison / Back-the-mission | Closing ask | **CUT/MERGE** | Adds nothing band 11 didn't — re-lists two buttons already on the page 3× each. |

---

## 2. Repetition map

Each fact, where it recurs, and which instance to keep.

| Repeated element | Where it appears | Keep |
|---|---|---|
| **"45 countries"** | Band 1 stat · Band 7 heading · Band 7 body · Band 7 map-stat · Band 7 map-caption · Band 7 op_kits row · Band 8 subline — **~7×, five of them inside band 7** | Band 1 stat (display) + **one** mention in band 7's compressed group. Kill the other 5. |
| **"4,000+ people trained/built a bike"** | Band 1 stat · Band 8 subline | Band 1 stat. Cut the band 8 subline entirely. |
| **"since 2012 / 14 years"** | Band 1 label + ghost "2012" · Band 7 map-caption · Band 8 seal + subline | Band 1 (label + ghost) and Band 8 seal. Drop from subline + map-caption. |
| **OCN Level 1 / Level 2** | Band 1 stat · Band 2 both flows · Band 3 (×2) · Band 8 promise 2 · Band 8 seal · Band 11 partner card — **6 bands** | Band 2 (flows, where the L1-schools / L2-prisons split earns its keep) + Band 8 promise. Reduce band 3 to one mention; drop from band 11 card. |
| **"39% less likely to reoffend" (family contact)** | Band 4 (in prose) · Band 9 (display stat) | Band 9 display stat. Remove the number from band 4 prose; keep the mechanism sentence. |
| **"the bike goes home / father stays inside"** | Band 2 flow step · Band 4 body | Band 4 (full narrative). Band 2 flow step can stay as a 3-word node — different register. |
| **Sally Allsopp** | Band 4 pull-quote · Band 6 reel quote | Two different quotes, same source. Keep Band 4 (in-context); drop the Sally quote from the band-6 reel to vary voices. |
| **Lord Timpson** | Band 6 reel · (latent: `cred_quote1` + `path_quote`, neither renders) | Band 6 only. Note the near-identical Timpson quote sitting dormant in `cred_quote1`/`path_quote`. |
| **Mission phrasing "a way forward" / "before exclusion… after"** | Band 0 hero lede · Band 2 tagline · Band 2 chips (×2) · Band 2 converge strip | Band 0 (the locked mission, verbatim). Band 2 chips can keep the short "before exclusion / after"; cut the tagline + converge restatement. |
| **Prison-site names (Lowdham Grange etc.)** | Band 3 · Band 4 (implied) · Band 6 (×2 in quote attributions) · Band 7 op_prisons · Band 8 | Band 7 op_prisons (the roll-call) + Band 3 (the one deep site). Elsewhere reference generically. |
| **Self-delivery "we train your staff, you run it"** | Band 7 (schema default) · Band 11 partner card | Band 11 partner card (where the commissioner ask lives). |
| **CTA: prison partnership** → `/pages/prisons` | Hero "Partner with us" · Band 4 "Run the programme" · Band 11 "For prisons" · Band 12 "Run it in your prison" — **4×** | Hero + Band 11. Cut band 12; band 4's is optional. |
| **CTA: "Back the mission"** → `/pages/support-mission` | Hero · Band 11 support card · Band 12 — **3× identical label** | Hero + Band 11. Cut band 12. |
| **CTA: impact report** | Band 1 "Read the 2026 impact report" · Band 8 report card "read it →" · Band 8 promises "see for yourself →" | Band 8 report card (make it the download-asset card). Drop the band 1 text link (research rec #4). |
| **Stats restated wholesale** | Band 1 strip ≈ Band 8 subline ≈ Band 7 kicker (4 sites/45 countries) | Band 1 only. Bands 7 + 8 should reference, not re-list. |

---

## 3. Gaps (what a funder/commissioner needs and isn't getting)

1. **Benchmarked outcomes (highest-leverage, per research).** Every outcome number on the page floats without a national baseline. "90%+ prison course completion" has an *empty comparator field* in the schema. Switchback's device — "91% don't reoffend… nationally 45% do" — is what turns a number into evidence. Add the national prison-education completion baseline beside 90%+ **only if Proof Bank carries a verifiable MoJ figure; never invent it.** If none exists, pull one "why now" stat into the same viewport as the outcome stat.
2. **The causal chain is split, not joined.** The theory of change is: making → skills + family ties → reduced reoffending → £18bn national saving. Band 4 tells the family-ties story; band 9 holds the reoffending/£18bn numbers — five bands apart. A funder never sees mechanism and evidence in one breath. Moving "why now" directly under Build to Bond joins them.
3. **The dual-entity / CIC self-funding model is buried.** BBC's strongest trust signal — the commercial kit/workshop arm covers running costs so 100% of funder money hits delivery (BBC's answer to charity:water's "100% model") — appears as a single promise line in band 8. It deserves prominence: it directly answers "where does my money go?" (DESIGN-BRIEF: backed-by = names/logos, no £ — this is compatible, it's a model statement not an amount.)
4. **No single, primary funder ask.** The page offers ~11 CTAs across 6 verbs (partner, back, run, fund, buy, shop). Band 11 gives three equal doors, band 12 repeats two. There is no "if you do one thing" ask for a commissioner. The three-doors model is fine for a mixed audience, but the funder path should be visually primary.
5. **Cost context is gestured at, not shown.** Band 10 says ambitions are "each one costed and ready to talk through" — good — and band 9 gives the £18bn macro cost. But there's no unit-economics artifact a commissioner can lift into a business case (Key4Life's £4,750-vs-£54,000). This is *constrained* by the DESIGN-BRIEF no-£ rule and banned £280/learner, so the right move is a downloadable business-case/report, not on-page numbers. The report download partly covers this — make it unmistakable.

---

## 4. Cut list (ranked)

1. **Final CTA band (12)** — merge into Get Involved. Pure duplication: re-lists "Run it in your prison" + "Back the mission," each already on the page 3×.
2. **Band 8 stats subline** ("14 years. 4,000+ people trained. 3,500+ bikes across 45 countries") — verbatim restatement of band 1. Delete; keep the seal, promises, report card, logos.
3. **Band 7 op-group overload** — cut from 7 count-rows (4/10/1/3/5/6/45, each number meaning a different thing) to 4 groups: prisons (4) · schools & universities · public + hub workshops · 45 countries. Strip 5 of the 6 in-band "45 countries" mentions.
4. **Band 6 quote reel** — 6 → 3. Drop the Sally Allsopp quote (she's already in band 4), the Investec citation (≈ band 8), and the Timpson quote if "why now" moves up (≈ its framing). Keep the Maker quote, the Inside Time "pandas eat it" hook, and one authority voice.
5. **Band 2 heading** — "we set up bike-building workshops that deliver STEM education around the world" is off-mission and collides with band 7. Rewrite (see §5).
6. **In-prose "39%" in band 4** — move the number to display type (band 9); keep the sentence's mechanism.
7. **Dead scaffolding (file-level, not on-page):** `cred_quote1/2` (never printed), the `path`/pathway 3-card band (blank), the case-study card (blank). Remove or intentionally populate — right now `cred_quote1` silently controls whether band 8 renders, which is a footgun.

---

## 5. Storytelling arc

**Does it read mission → proof → trust → ask?** Mostly — the spine is right and the hero/stats/theory opening is genuinely strong. But three things break the flow:

- **The "why now" context arrives too late (band 9).** The funder's "why does this matter" belongs beside the mechanism it explains. Right now the emotional family-ties story (band 4) and its evidence (39% / £18bn, band 9) are five bands apart, so neither lands as proof of the other.
- **Two low-energy "scale/trust" paper bands sit back-to-back (7 then 8),** right after the quote reel — the page sags through its heaviest, most repetitive stretch exactly where a funder is deciding whether to keep scrolling.
- **Repetition makes late bands feel like re-reading.** By band 8 the reader has met "45 countries," "4,000+," "since 2012" and the OCN split three or four times each; the page stops advancing and starts echoing. The ending is soft (11 then 12 both say "here are the doors").

**Two proof mechanisms also compete:** band 5 (story grid) and band 7 (operate list) both prove global/education breadth — one through 3 story cards, one through an exhaustive roll-call. Pick the story cards (identifiable-instance effect) and demote the list to a compact reference.

### Proposed tightened sequence (13 → 10)

1. **Hero** — mission in one line + the primary ask.
2. **The record since 2012** — four verified numbers; **add a national comparator to 90%+** (Proof Bank permitting), and fold the "4 sites / 45 countries" scale kicker in here.
3. **One craft, two arms** — theory of change: skills before exclusion (schools, OCN L1) + skills after (prisons, OCN L2). *Rewritten heading, e.g.* **"one craft, two ends of the same problem."**
4. **Inside the workshop** — what a real six-week accredited course looks like inside HMP Lowdham Grange (one OCN mention).
5. **Build to Bond** — the balance-bike-goes-home mechanism; *rewrite eyebrow* "the follow-on" → **"the family bond"** (zero-knowledge); drop the in-prose 39%.
6. **Why now** *(moved up)* — the national-priority stats (£18bn · 9pts · 39% · 1m+) as the evidence directly under the story that earns them.
7. **Real projects, in their words** *(merge 5 + 6)* — the UCL/community/Kenya cards + 3 trimmed voices.
8. **Recognised & backed** — press logos, funders/accreditors, the three verifiable promises, the report as a download-asset card. *Cut the stats subline.*
9. **Where we work** *(compressed 7)* — 4 grouped chips (prisons · schools & universities · workshops & hubs · 45 countries), "we run" vs "we've taught in" wording per OPERATIONS-MAP.
10. **What's next → how to help** *(merge 10 + 11 + 12)* — the costed ambitions leading into the three doors, one funder path made primary; single close.

### Specific copy changes (claims-clean, zero-knowledge, Makers language)

- **Band 2 heading:** `we set up bike-building workshops that deliver STEM education around the world.` → `one craft, two ends of the same problem — skills before exclusion, and skills after.` (Re-anchors to the locked mission; removes the "around the world" collision with band 9/where-we-work.)
- **Band 4, para 2:** delete `…people who keep close family ties while in prison are 39% less likely to reoffend (MoJ family-contact data)`; replace with the mechanism only — `It's built on the strongest predictor of reduced reoffending there is: keeping family ties alive while inside.` — and let the moved-up Why-now card carry the 39% in display type.
- **Band 4 eyebrow:** `the follow-on` → `the family bond` (a stranger can't parse "follow-on").
- **Band 1 90%+ card:** populate the empty `comparator` — *only* with a Proof-Bank-verified MoJ national completion baseline; otherwise leave blank rather than invent.
- **Band 8:** delete subline `14 years. 4,000+ people trained. 3,500+ bikes across 45 countries.`; promote promise 1 (`kit revenue covers running costs — funder money goes to delivery`) to a headline callout — it's the CIC self-funding model and the answer to "where does my money go?".
- **Band 6 Inside Time quote** keeps the word "prisoners" — acceptable as a verbatim press quote, but it's the one place that word appears; leave it *only* as an attributed quotation, never in BBC's own copy (house style: Makers).

---

## 6. Tightened target — 13 bands → 10

One-sentence job of each survivor:

1. **Hero** — the mission and the one ask, in a single screen.
2. **The record since 2012** — four verified proof numbers, one benchmarked, plus the scale kicker.
3. **One craft, two arms** — the theory of change: prevention in schools, rehabilitation in prisons.
4. **Inside the workshop** — proof the delivery is a real accredited course, not a gesture.
5. **Build to Bond** — the emotional core: a bike a Maker builds goes home to their child.
6. **Why now** — the national-priority evidence that makes the mechanism matter, paired to the story above.
7. **Real projects, in their words** — breadth of impact through named projects + trimmed first-person voices.
8. **Recognised & backed** — press, funders, accreditors, three verifiable promises, the report download.
9. **Where we work** — compressed, honestly-worded reach (run vs taught-in), no number-chip soup.
10. **What's next → how to help** — the costed forward offer and a single, primary ask.

---

### Claims / safety check on current copy
All on-page numbers avoid the banned list (no 28,000 PSI, no 56.7% carbon, no £280/learner, no 100% completion, uses 45 not 36). "Makers" holds throughout BBC's own copy. No participant is linked to a named prison. **Verify before ship:** the "9pts", "~£18bn", "1m+ 16–24 out of work/education", and "40+ publications" figures are not in the docs reviewed here — confirm against Proof Bank. Also note the tension on **90%+ completion**: the code comment calls it "unconfirmed across sources" yet the card shows source "BBC programme records" — reconcile the provenance before adding any comparator beside it.
