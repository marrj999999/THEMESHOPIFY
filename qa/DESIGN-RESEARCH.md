# BBC Design Research — Phase R deliverable
*Compiled 2026-07-12. Feeds Phases 2–5. Companion to DESIGN-BRIEF.md.
Three parts: (1) reference board + steal/skip list, (2) BBC's own social data → on-site asset shortlist, (3) analytics baseline (blocked — see unblock note).*

## Executive summary — the 10 moves that matter
1. **Big type = falsifiable claims only** (numbers, names, "since 2012") — never adjectives. One display moment per viewport, left rag, tight leading, lowercase. (Toggl, Mammoth)
2. **Loud/quiet split:** editorial bands go brutal; buy-box/cart stay conventional Dawn. (Balenciaga's licence)
3. **Mid-scroll mission interrupt:** ONE forest video band BETWEEN two commercial bands on the homepage — never a mission zone at the bottom. (Tony's — whose mission-led identity converts 55% vs 17.8% category avg)
4. **The loop strip:** one audited sentence ("Every kit funds bike-building programmes in UK prisons and schools ✱") pre-product + repeated as a thin ticker; impact packaged as a product benefit beside the guarantee. (Who Gives A Crap)
5. **Funder-page mechanism sentence + proof promise** + precise-not-rounded numbers + third-party badge wall + dated downloadable report. (charity: water, Big Issue)
6. **"Since 2012" is a masthead credential** — header/footer signature, not buried in About. (Big Issue's "30 years")
7. **PDP de-risk stack:** "Build support for life" one-liner · £0 book-a-consultation product · named care pages · the 16.4k-view full-build video embedded. (Hiut, Standert + our own YouTube data)
8. **Story-adjacent-to-product:** one real builder/programme story card inside collection grids and PDPs. (Patagonia)
9. **Motion:** CSS scroll-driven reveals (already shipped in Phase 1 as .rd-reveal), line-mask entrances, video loops with poster + reduced-motion; skip per-glyph JS gymnastics. Atkinson has no variable axis — animate position, not weight.
10. **Our own audience votes for build-process content 8:2 over story content** (YouTube) and prison-programme posts are 2025's reach leaders (IG) — the homepage should lead with craft/process footage and carry ONE strong mission beat.

## Analytics baseline (R2a) — BLOCKED
GA4 + Search Console MCPs authenticate as a Google identity with no property access (GA4 account list empty; GSC 403). **Unblock: James adds the MCP identity as GA4 Viewer + GSC Restricted user, or re-auths via /mcp.** Full 2-minute re-run checklist in the R2a section below. Until then: mobile-first assumed; page priorities follow the strategy (Impact first), not measured traffic.

---

# PART 1 — Reference board (R1)

# R1 — Design Reference Research
## BBC 2026 redesign · brutalist-editorial · researched 2026-07-11

Context recap: BBC's locked direction = oversized lowercase Atkinson Hyperlegible display type, asterisk-footnote honesty motif, hard-crop full-bleed images, 4 surfaces (paper #E6DCC8 / forest #003C32 / lime #D4FD62 / steel #DEE6F0), one loud accent per surface, video-heavy, "more life" motion with `prefers-reduced-motion` respect. All notes below are written to be buildable in Dawn 15.4.1 sections at £0.

---

## Lane 1 — Brutalist-editorial commerce

### 1.1 Toggl — toggl.com
**Does brilliantly:** Personality-first SaaS commerce where oversized type carries *numbers*, not adjectives. Big display sizes are reserved for metrics ("80 hours saved monthly", "20% increase in profitability", "100% adoption") which become visual anchors you absorb without reading the section. Honest-copy devices: asterisks on promo claims ("No credit card required*"), conversational admissions ("Time tracking is a chore, which is why…"). Pastel color-blocked sections give each scroll-stop one accent.
**Steal this:**
- *Big type = big numbers rule.* In BBC's stats band and pillar sections, the oversized display size should be reserved for the verified stat (4,000+ · 36 countries · since 2012 · 90%+), with the label set small beneath. Never set a vague adjective at display size — that's what makes bold type feel empty.
- *Asterisk on claims, resolved in-viewport.* Toggl footnotes promo terms right where they appear. BBC's asterisk-honesty motif should behave the same: the `*` and its footnote live in the same section (small text, bottom-left of the band), never punted to the footer.
- *One accent per section.* Toggl's peach/lavender blocking = BBC's one-loud-accent-per-surface rule, validated on a commercial site.

### 1.2 Balenciaga — balenciaga.com (Bureau Borsche)
**Does brilliantly:** Radical typographic restraint that makes the *product photography* the loud element. Monospaced/system-flavoured type, spartan list-like navigation, hard grid, zero decorative UI. Because chrome is silent, the full-bleed campaign imagery and prices land with force. Econsultancy's review confirms the risk: pure brutalism strains ecommerce usability, so Balenciaga keeps the *transactional* surfaces (PDP, cart, size picker) conventional while the *editorial* surfaces go brutal.
**Steal this:**
- *Split the site into loud and quiet layers.* Editorial bands (statements, campaign imagery, mission) get the brutalist treatment; the buy-box, variant picker, and cart stay boringly usable Dawn defaults. This is the exact licence BBC needs: brutalist-editorial homepage + conventional PDP purchase column.
- *Hard-cropped full-bleed images with no overlay text* — let image bands breathe as pure image, put the display type on the flat-colour band before/after instead. Balenciaga never fights type against photography; BBC shouldn't either.

### 1.3 Daylight — godaylight.com (Siteinspire "Big Type")
**Does brilliantly:** Big-type editorial selling a physical product. Large bold sans headlines with generous whitespace; strict hero → 3-pillar benefits → 3-step process → risk-killers → closing CTA narrative arc. Mux-hosted video thumbnails are embedded *inside* content sections (hero, each process step, benefit demos) so video explains without click-through. De-risking is copy-level: "$0 upfront", "full-service maintenance", "See if your house qualifies".
**Steal this:**
- *Video as inline explainer, not hero decoration.* Short muted looping clips inside pillar/process sections ("here's the jig", "here's the wrap", "here's the ride"). Buildable in Dawn as `<video muted loop playsinline preload="metadata" poster>` per block — £0.
- *Three-step process band* ("1 kit arrives → 2 you build → 3 you ride") with a clip per step — directly answers BBC's biggest objection ("can I actually build this?").

### 1.4 Mammoth Brands — mammothbrands.com (Siteinspire "Big Type", 2026)
**Does brilliantly:** Corporate/house-of-brands site where enormous lowercase-leaning display type does ALL the visual work over near-flat surfaces; imagery appears only as hard-cropped windows inside the type-led flow. The type feels crafted because scale is *systematic*: one display size per viewport, tight leading (~0.9), consistent left-aligned rag, no centred display type.
**Steal this:**
- *Type-scale discipline:* one display size per section, tight leading, left-aligned, lowercase — never two competing display sizes in one viewport. This is the single biggest "crafted vs empty" differentiator (see synthesis below).

### 1.5 Matheson Food Company — mathesonfoodcompany.com (Siteinspire "Big Type")
**Does brilliantly:** Big-type editorial applied to a *food commerce* brand — proof the style converts outside fashion/agency contexts. Flat warm surfaces, oversized statements, product photography hard-cropped into the grid.
**Steal this:** the paper-toned flat surface + single accent + oversized statement combination is nearly BBC's exact palette logic applied to commerce; use as the visual sanity-check reference when tuning paper #E6DCC8 bands.

### Synthesis — what makes bold type feel crafted vs empty
1. **It says something falsifiable.** Crafted big type carries a number, a name, or a claim you could check ("50% of profits", "80 hours saved", "since 2012"). Empty big type carries adjectives ("beautifully crafted", "reimagined").
2. **One display moment per viewport.** Winners never stack two display sizes; hierarchy below display drops sharply (display → small label → body). BBC's `bbc-type-scale.css` should enforce a hard gap between display and the next size.
3. **Tight leading + left rag + lowercase** reads editorial; loose centred display reads template.
4. **Type sits on flat colour; photos stay clean.** Almost no winner sets display type over photography.
5. **Motion is per-glyph or per-line entrance (mask-reveal), once, on first scroll into view** — not looping. Respecting reduced-motion is table stakes on every 2025/26 Awwwards winner.
6. Recent Awwwards Typography Honors for further browsing: Seasoned (Feb 2025, SOTD), IRONHILL (Dec 2025, SOTD), sakazuki (May 2026, SOTD) — awwwards.com/websites/winner_category_typography/.

---

## Lane 2 — Mission-led commerce (shop funds mission — BBC's exact model)

### 2.1 Tony's Chocolonely — us.tonyschocolonely.com
**Does brilliantly:** Zero audience-splitting. The homepage is a shop, and the mission is *inside* the shop language, not beside it. Hero: "Chocolate that makes an impact" → product carousel → then a **mission video interrupts the shopping flow mid-page** ("We're Tony's Chocolonely. We exist to end exploitation in cocoa.") → back to commerce (gifting, testimonials). Purchases are framed as participation: newsletter signup calls subscribers "serious friends" (customers as activists). Notably: **no impact stats on the homepage** — narrative over numbers there; numbers live in the annual FAIR report. Conversion proof: their identity drives a 55%+ conversion rate on Amazon vs 17.8% category average — mission *is* the differentiator, commercially.
**Steal this:**
- *The mid-scroll mission interrupt.* One full-width forest-surface video band placed BETWEEN two commercial bands on the homepage — "we use bike-building to give practical skills…" — then straight back to kits. Never a separate "mission zone" at the bottom.
- *Impact-verb headline formula:* "[Product] that [impact verb]" → "Bikes that build futures" / "A bike that funds the next builder". Mission lives in the product's own headline.
- *Community naming device* — Tony's "serious friends" ≈ BBC's "builders". Use "builders" consistently as the customer identity across newsletter, reviews, gallery.

### 2.2 Who Gives A Crap — uk.whogivesacrap.org
**Does brilliantly:** The clearest purchase→impact loop on the web, stated as a single repeatable sentence: "50% of profits are donated to help everyone gain access to clean water and a toilet." It appears **before** products (hero area) and then **repeats as a rhythm** — a benefits ticker cycling "50% of profits donated / Helps reduce deforestation / 100% Money Back Guarantee" — so impact is packaged *as a product benefit*, in the same list as the guarantee. Tone stays daft ("fart jokes", "It's loofa at first sight") while the model is B-Corp-verified — humour + audited claim = trust.
**Steal this:**
- *The one-sentence loop, positioned pre-product.* BBC needs its own single audited sentence ("Every kit funds bike-building programmes in UK prisons and schools") placed above the first product row, then repeated as a thin ticker/marquee strip between sections. Maps directly onto BBC's existing stats band + could become a new thin "loop strip" snippet.
- *Impact as a bullet in the benefits list* on PDPs — sitting alongside "free shipping" and "guarantee", not in a separate solemn section: `✱ funds prison & schools programmes` with the asterisk resolving to the honest detail.
- *Money-back guarantee adjacency:* placing the impact claim next to the guarantee borrows the guarantee's credibility.

### 2.3 Patagonia — patagonia.com
**Does brilliantly:** Stories woven into the *shopping journey* rather than a blog silo — navigation and category pages inject relevant stories next to products (BASIC/DEPT case study: "focus, clarity, simplicity" as UX principles; storytelling gives products context). Worn Wear turns product longevity into an emotional program (repair stories, used gear) — the product's *lifespan* is the mission proof.
**Steal this:**
- *Story-adjacent-to-product pattern:* on kit PDPs and collection pages, one signpost card pulling a real builder/prison-programme story into the buying flow ("Read: how this kit is built in HMP Lowdham Grange workshops" — respecting the no-named-participant rule).
- *Longevity-as-mission:* BBC's equivalent of Worn Wear is "bikes still riding since 2012" — a gallery band of aged builds with build-year captions. Cheap, existing gallery section can carry it.

---

## Lane 3 — Impact / funder storytelling

### 3.1 charity: water — charitywater.org (gold standard)
**Does brilliantly:**
- **The 100% model as a one-line contract**, stated twice: "100% of your donation directly funds clean water projects" (ops covered by named separate philanthropists). It's a *mechanism*, not a mood — the reader can see how the loop physically works.
- **Proof device:** "Give water. Get proof. Every single time." — GPS coordinates + photos for every funded project. Proof is promised *at the moment of giving*.
- **Scale stats as the credibility spine:** 209,241 projects · 29 countries · 21,641,908 people served — huge odometer-style numbers, precise (not rounded), which reads as audited.
- **Trust wall in the footer:** Candid Platinum, Charity Navigator 4-star, CharityWatch, BBB — third-party badges, not self-authored claims.
- **Nine distinct giving pathways** — the "how to help" moment is a card grid, not a single button.
**Steal this:**
- *Mechanism sentence for funders:* BBC's version — "Kit and workshop revenue covers our costs. Funder money goes to programme delivery — and we show you where." One sentence, diagrammed as a 3-node flow (buy → fund → deliver) in flat brand-colour SVG.
- *Precise-not-rounded numbers.* "4,000+" is fine for the shop; the funder page should show the precise auditable figure where one exists (course completions, OCN accreditations awarded). Precision = the honesty motif in numeric form.
- *Proof promise:* "Funders get session data, completion rates and OCN certification counts each term" — BBC's GPS-coordinates equivalent, stated up front on the support-mission page.
- *Third-party badge wall:* OCN accreditation, CIC registration, named university testing (BS ISO 22157 at Swansea) as a logo/badge row — maps straight onto BBC's existing logo wall component.

### 3.2 Big Issue Group — bigissue.com/big-issue-group-impact/ + Impact Report 2024/25 PDF
**Does brilliantly:** The commercial→mission loop stated in earnings, not sentiment: "3,500 people supported to earn a legitimate income, collective income of £3.9m in 2024." The magazine (the *product*) is the mechanism. Downloadable impact report pattern: a dated, designed PDF (bigissue.com/wp-content/uploads/2025/10/BII-Impact-Report-2024-25_final.pdf) linked from a short web summary page with the 3–4 headline stats lifted out — web page for skimmers, PDF for grant officers. Longevity anchor: "30 years" used as a masthead-level credential (2021 Matt Willey redesign).
**Steal this:**
- *Web-summary + dated PDF pattern* for BBC's impact page: 4 lifted headline stats + a "Download the 2026 Impact Report (PDF)" button. Grant officers *need* the PDF artifact; the page exists to make them want it.
- *Earnings-shaped impact stat:* BBC equivalents are completion-rate and accreditation counts — state them the Big Issue way: "X learners completed, Y OCN awards, since 2012."
- *"Since 2012" as masthead credential* — put longevity in the header/footer signature area, not buried in About. 14 years is a survival record most social enterprises can't match; use it structurally.

### Theory-of-change made visual — pattern across both
Neither site draws an academic ToC diagram; both compress it to a **3-step flow with money/product as the connector** (donate → project → proof; buy magazine → vendor earns → life changes). BBC's visual should be: **buy a kit → skills programmes run → people locked out of education get a way forward** — three nodes, one connecting line, lime accent on the middle node, footnoted with the locked mission sentence.

---

## Lane 4 — Craft/maker & cycling (fresh, beyond Temple/Brompton/Finisterre)

### 4.1 Standert Bicycles — standert.de (Berlin, Shopify)
**Does brilliantly:** A Shopify site (same platform, so everything is provably buildable) that makes craft *experiential*, not nostalgic. Narrative arc: hero → products → categories → community → the physical HUB with opening hours. De-risking stack for buying a performance bike online: **book-a-consultation product** (an appointment sold as a £0 product — clever Shopify hack), demo bikes, dedicated Warranty + **Crash Replacement** pages, Steel Frame Care and manuals pages, frame-outlet for budget entry. Copy is culture-first ("Love never rusts", German model names KREISSÄGE/PFADFINDER) with zero spec-jargon in primary messaging. Community teams (Team Standert Women) signal belonging over transaction.
**Steal this:**
- *Consultation-as-product:* BBC should sell "Free 15-min build consultation" as a £0 Shopify product — one click from every kit PDP. It's the single strongest "anyone can do this" de-risker and costs nothing to implement.
- *Named care/repair pages as trust architecture:* BBC equivalents — "Build Support", "Lifetime build help", "Frame care" — as real linked pages in the PDP support block, not accordion filler.
- *Culture-first product naming/copy* validates BBC's lowercase editorial voice on a bike-commerce Shopify store.

### 4.2 Hiut Denim Co — hiutdenim.co.uk (craft, mission-in-commerce)
**Does brilliantly:** The town-revival mission ("our town is going to make jeans again") is *embedded in product cards and value props*, never a separate page you must find: "Handmade in Aberteifi", "The Makers", and the killer de-risker **"Free Repairs for Life"** sit inside the shopping flow. Newsletter is framed as craft insight ("Scrapbook Chronicles"), not discounts. Place-based trust ("Handmade in Aberteifi") does the work a certification would.
**Steal this:**
- *One-line forever-promise:* BBC's "Free Repairs for Life" equivalent is **"Build support for life"** — lifetime access to build help/videos/spares advice — stated as three words on every PDP. Massive de-risk, near-zero cost (BBC already does the support).
- *Place-based line on product cards:* "Designed and taught in London workshops" / "Kits packed in London" as a small persistent product-card line — provenance as trust.

### 4.3 Cowboy — cowboy.com (modern bike commerce baseline)
**Does brilliantly:** Personality-led model naming ("The easy-rider", "The explorer") instead of spec-led SKUs; press wall ("What the Press Says") as primary social proof; "Why Cowboy" section bundling origins + quality + servicing + protection into one reassurance band. (Note: their homepage keeps de-risking mostly on PDPs/test-ride pages, which weakens the homepage — BBC can beat this by surfacing it earlier.)
**Steal this:**
- *Personality naming layer over kit SKUs:* keep product titles, add a persona strapline per kit ("the commuter", "the weekend escape", "the first bike") in lowercase display — instantly more editorial than spec bullets.
- *Single consolidated "why us" reassurance band* (support + guarantee + since-2012 + mission loop in one 4-cell strip) rather than scattering trust widgets.

---

## 2026 modern-techniques audit (for Dawn 15.4.1, £0, progressive enhancement)

| Technique | Browser support (Jul 2026) | Fits BBC/Dawn at £0? |
|---|---|---|
| **CSS scroll-driven animations** (`animation-timeline: scroll()/view()`) | Chrome/Edge 115+, Safari 26+ (threaded in 26.4); Firefox still flagged in stable (Interop 2026 priority); ~83–85% global — NOT yet Baseline | **Yes — ideal.** Failure mode is "no animation", never broken layout. Use `@supports (animation-timeline: view())` for reveal/parallax/progress effects; wrap in `@media (prefers-reduced-motion: no-preference)`. Zero JS, zero cost. Firefox users simply see static sections. |
| **Video-first heroes** (`<video muted autoplay loop playsinline>`) | Universal (HTML5). Only constraints are UX/perf, not support | **Yes with discipline:** poster image always set (also serves reduced-motion users), `preload="metadata"`, ≤2–4MB H.264/AV1 loops hosted via Shopify CDN `video_tag`, pause on `prefers-reduced-motion` via one-line JS or `<source media>` swap. Dawn's video sections already lazy-load. |
| **Kinetic type** (per-line mask reveals, variable-font weight shifts, marquee tickers) | Variable fonts + CSS keyframes/`@property`: Baseline everywhere. Per-glyph splitting needs small JS (no library required) | **Yes, the cheap subset:** line-mask reveals (overflow:hidden + translateY on scroll/entrance) and CSS marquee tickers cost nothing and match the brutalist-editorial genre. Skip GSAP SplitText-style per-character scrambles — licence/weight not justified. Note: Atkinson Hyperlegible ships fixed weights (no variable axis), so animate position/opacity, not weight. |
| **Bento grids** | CSS Grid: Baseline everywhere, incl. `grid-template-areas`; `subgrid` also Baseline 2023+ | **Yes trivially** — pure layout, no dependency. Best fit: the "why us" reassurance band and stats band as a 4–6 cell bento with one lime-accent feature cell. Caution: bento is the most template-flavoured 2024–25 trend; keep cells flat-colour + hard edges (no rounded-corner glassy cards) to stay in brutalist-editorial territory. |
| (bonus) **`text-box-trim`** for optically tight display type | Chrome 133+, Safari 18.2+; not Firefox | Nice-to-have progressive enhancement for the display scale — trims leading whitespace above lowercase display lines. Harmless where unsupported. |

---

## Steal this / skip this — mapped to BBC's existing components

| BBC component | STEAL | From | SKIP |
|---|---|---|---|
| **statement** (oversized lowercase display band) | One display moment per viewport, left rag, tight leading; display size reserved for falsifiable claims/numbers; line-mask entrance once on scroll | Mammoth Brands, Toggl, synthesis §1 | Centred display type; two display sizes per viewport; type over photography (Balenciaga rule); looping type animation |
| **statement + asterisk motif** | Asterisk resolves in-section (small footnote bottom of same band), like promo-claim footnotes | Toggl | Footnotes deferred to page footer — kills the honesty payoff |
| **pillar** (3-up benefits) | Inline muted video loop per pillar (poster + metadata preload); 3-step "kit arrives → you build → you ride" process variant; persona straplines ("the commuter") | Daylight, Cowboy | Icon-only pillars with adjective headlines; stock-video loops |
| **logo wall** | Repoint as *trust wall*: OCN, CIC, Swansea Uni testing, press logos — third-party verifiers, not decorative partners | charity: water footer badges, Cowboy press wall | Mixing funder logos and press logos in one undifferentiated wall — separate "backed by" from "featured in" |
| **stats band** | Big type = the number, tiny label under; precise figures on funder/impact pages, rounded on shop pages; odometer count-up only via scroll-driven animation with reduced-motion guard | charity: water, Toggl, Big Issue | Unverifiable stats at display size (see banned-claims list); count-up JS libraries |
| **quote** | Builder quotes attributed with build-year + kit ("gravel kit, built 2019") = longevity proof; funder-page quotes from partner orgs, not participants | Hiut makers, Patagonia Worn Wear | Named participant + named prison in any quote (hard rule); fabricated-sounding unattributed quotes |
| **signpost cards** | Story-adjacent-to-product: one mission/story card injected into collection grids and PDP flow; card grid of "ways to support" (buy kit / book workshop / fund a programme / partner) — the charity:water nine-pathways pattern compressed to 4 | Patagonia, charity: water | A single "Donate" button as the only mission pathway; separate mission microsite feel |
| **NEW: loop strip** (thin repeating ticker) | One-sentence purchase→impact loop ("every kit funds prison & schools programmes ✱") repeated as a marquee between commercial sections; also carries guarantee + shipping so impact reads as a product benefit | Who Gives A Crap benefits ticker | Solemn full-height "our mission" interstitials at every scroll-stop — once mid-page (Tony's interrupt) + the thin strip is enough |
| **NEW: mission interrupt band** (forest surface, video) | One full-width mission video band placed BETWEEN two commercial bands on the homepage, locked mission verbatim, back to kits immediately after | Tony's Chocolonely | Putting it last-before-footer where it reads as an afterthought |
| **NEW: theory-of-change flow** (impact/funder pages) | 3-node flat SVG: buy → programmes run → futures built; mechanism sentence ("commercial revenue covers costs; funder money delivers programmes") + proof promise (termly data to funders); dated downloadable Impact Report PDF button above 4 lifted stats | charity: water, Big Issue | Academic ToC diagrams; impact claims without the audit trail (SROI figures are banned) |
| **PDP support block** | "Build support for life" one-liner; £0 "book a build consultation" Shopify product linked from every kit PDP; named care pages (Build Support / Frame Care) as real links | Hiut, Standert | Accordion-buried support copy; live-chat widgets (cost + off-brand) |

---

## Source index
Lane 1: toggl.com · balenciaga.com + econsultancy.com Balenciaga review · godaylight.com · mammothbrands.com, mathesonfoodcompany.com (siteinspire.com/websites/category/big-type) · awwwards.com/websites/winner_category_typography/ (Seasoned, IRONHILL, sakazuki)
Lane 2: us.tonyschocolonely.com (fetched) · similarweb.com Tony's conversion analysis · uk.whogivesacrap.org (fetched) · patagonia.com + basicagency.com/case-studies/patagonia-ecommerce-website
Lane 3: charitywater.org (fetched) · bigissue.com/big-issue-group-impact/ + BII-Impact-Report-2024-25_final.pdf
Lane 4: standert.de (fetched) · hiutdenim.co.uk (fetched) · cowboy.com (fetched)
Techniques: MDN scroll-driven animations · caniuse animation-timeline (~83% global, Firefox flagged, Interop 2026) · web-platform-dx web-features explorer

---

# PART 2 — BBC social data → placement shortlist (R2b)

# R2b — Top-Performing Social Content → Website Placement Candidates

Pulled 2026-07-11. Sources: Meta MCP (Instagram media + per-post insights) and public YouTube Data API.

## Data caveats (read first)

- **YouTube Analytics OAuth is broken** — all `yt_analytics_*` calls (top videos, overview) failed with `invalid_grant: Bad Request`. The youtube-manage token needs re-auth. So: **no watch-time, no per-period view data**. Fallback = public YouTube Data API (`getChannelTopVideos`, `getVideoDetails`) — all-time view counts only.
- **Instagram posting has been sparse in the strict last-12-months window** (Jul 2025 → Jul 2026): only 4 feed posts. To make a meaningful ranking I widened to the last ~20 months (50 most recent posts, back to Nov 2023) and pulled per-post insights on the top ~18 candidates.
- **IG reach numbers for older posts are unreliable** — the insights API appears to return a recent-window reach for old media (e.g. the 182-like balance-bike post reports reach 168; a 63-like reel reports reach 9). For posts older than ~12 months, rank by likes/comments; reach is trustworthy only for 2025–26 posts.
- **YouTube channel had zero uploads in the last 12 months** (most recent upload: Dec 2024). Channel totals: 2,420 subs, 285,096 lifetime views, 143 videos.
- No metrics below are estimated or inferred — every number came back from an API call.

---

## 1. Instagram — top posts by engagement (last ~20 months)

| # | Date | Type | Theme | Post | Likes | Cmts | Reach* | Saves | Shares |
|---|------|------|-------|------|-------|------|--------|-------|--------|
| 1 | 2024-02-20 | Carousel | Product tease — new balance bike kit | https://www.instagram.com/p/C3kL7StNNNm/ | **182** | 16 | (168*) | 6 | 0 |
| 2 | 2023-12-06 | Reel | Build process — James crafting lugged frame | https://www.instagram.com/reel/C0gqvLZIXIB/ | **102** | 7 | (83*) | 6 | 0 |
| 3 | 2024-04-02 | Reel | Workshop / team building (Finest Cut Whisky day) | https://www.instagram.com/reel/C5RQrELt_cH/ | 91 | 5 | (511*) | 1 | 0 |
| 4 | 2024-12-31 | Carousel | Year in review 2024 — people + bikes | https://www.instagram.com/p/DEQIANKNwO4/ | 85 | 0 | — | — | — |
| 5 | 2023-12-05 | Image | Finished bike — customer gravel bike, winter Denmark | https://www.instagram.com/p/C0eSCkhoFrC/ | 74 | 0 | (130*) | 2 | 0 |
| 6 | 2025-12-31 | Carousel | Year in review 2025 — CIC, Investec award, prisons | https://www.instagram.com/p/DS7sgu8DKfV/ | 71 | 7 | **1,048** | 3 | 5 |
| 7 | 2024-04-01 | Image | Customer build — Ian's 4-person family tandem | https://www.instagram.com/p/C5N20JctSia/ | 68 | 6 | (122*) | 0 | 5 |
| 8 | 2024-09-23 | Carousel | Workshop / event — London Design Festival open weekend | https://www.instagram.com/p/DAQl4GDtzDL/ | 67 | 2 | 1,071 | 1 | 2 |
| 9 | 2024-04-27 | Carousel | Customer build — Gervase's demo trike w/ pop-up workbench | https://www.instagram.com/p/C6QkDSXIJnk/ | 67 | 2 | — | — | — |
| 10 | 2024-09-08 | Reel | People + finished bike — Jon's aluminium-lug build story | https://www.instagram.com/reel/C_qxWpgN5na/ | 66 | 5 | 1,472 | 4 | 2 |
| 11 | 2024-09-18 | Reel | Education — World Bamboo Day, species explainer | https://www.instagram.com/reel/DAD-_TwtSES/ | 65 | 5 | 1,162 | 3 | 6 |
| 12 | 2025-08-19 | Image | Build process — new frame-building jig launch | https://www.instagram.com/p/DNi32lxzBDI/ | 59 | 5 | **1,652** | 8 | 0 |
| 13 | 2025-04-26 | Carousel | Prison programme — new Lowdham Grange workshop, OCN course | https://www.instagram.com/p/DI5pM85sMch/ | 60 | 4 | 1,216 | 4 | 3 |
| 14 | 2025-04-30 | Reel | Prison programme — project update | https://www.instagram.com/reel/DJEAV_wtqDf/ | 49 | 3 | 1,290 | 0 | 0 |
| 15 | 2025-03-27 | Reel | Prison programme — Q&A reel ("any questions?") | https://www.instagram.com/reel/DHsi0K-tm9e/ | 45 | **15** | 843 | 1 | 1 |

\* Reach in parentheses = older post where the API's reach figure is implausibly low vs likes (recent-window artefact) — do not use for ranking.

**Recent-12-months posts, all four, for completeness:** Kirui Nairobi reel (13 likes / 330 reach, 2026-06-29), Project Zero Waltham Forest carousel (38 likes / 920 reach / 3 shares, 2026-06-28), 2025 year-review (#6 above), jig launch (#12 above — best reach of anything measured: 1,652).

**Pattern:** (a) product teases and build-process content out-earn everything on likes; (b) prison-programme posts are the reach + conversation leaders of 2025 (1,216–1,290 reach, 15 comments on the Q&A reel — highest comment count after the balance-bike tease); (c) named-customer build stories (Jon, Ian, Gervase, Kevin, Karl) consistently land 50–70 likes with strong shares — natural testimonial fodder.

---

## 2. YouTube

### All-time top 10 (public view counts; watch time unavailable — OAuth broken)

| # | Video | Views | Likes | Type |
|---|-------|-------|-------|------|
| 1 | Bamboo Bike with 3D-Printed Carbon Lugs (Live Build) — `XCnFSZhhUgY` (2016) | 27,769 | 337 | Build process |
| 2 | Building a Bamboo Bike Frame from a Home Kit (Full Build) — `UhuzVI2yVNU` (2018) | 16,414 | 232 | **Build process — the PDP de-risking video** |
| 3 | How to Make the Lugs (Tutorial 7) — `HAYyQJEm3F0` (2017) | 11,784 | 77 | Build process (tutorial) |
| 4 | What's in a Build Kit (Unboxing) — `k79tmYj9Cxk` (2017) | 11,287 | 38 | **Product / unboxing** |
| 5 | Bamboo frame with carbon-wrapped joints — `gv3GX5ApVJ8` (2024 Short) | 9,893 | 120 | Build process (Short) |
| 6 | Bamboo cargo trike prototype — `iB2iHTzT2oQ` (2022 Short) | 6,372 | 153 | Product / innovation |
| 7 | Bio Composites Explained (27 min) — `HEipr6CMp-g` (2021) | 6,101 | 132 | Education / material story |
| 8 | Bamboo Biker Boys: How BBC Started — `007bA-V0Z8M` (2014) | 5,774 | 50 | **Story — origin** |
| 9 | road.cc Series Pt 5: Painting the Frame — `OfJFKAextg8` (2018) | 5,774 | 81 | Build process |
| 10 | How to sand bamboo to bring out the grain — `xkDFsXeKrvk` (2023 Short) | 5,211 | 44 | Build process (Short) |

Notable just outside top 10: Alessandro's build story (`tBvB_nk6vyo`, 4,178 views, 1.99% like ratio — best engagement rate of the old catalogue) and the Fat Bike kit build (`zR2WGhik3BI`, 4,219 views, 10 comments).

### Last 12 months
**No uploads Jul 2025–Jul 2026** (latest upload Dec 2024), and per-period view analytics is locked behind the failed OAuth. Best performers from the final 2024 batch (all-time views): e-cargo train bike Short `M91Gd4H0DoU` 3,322 · Camden e-bike ride Short `bPwj8jrm4U0` 3,138 · kids balance bike Short `V4s0uXqEUZk` 3,044 · £500 DIY jig `tUYYjq25P4k` 2,467 · workshop behind-the-scenes Short `6N9P6yYjVg4` 1,132. Also: "How to Seal and Protect a Bamboo Frame" `PyYAHBv4O8A` (700 views but **17 comments, 3.7% like ratio** — highest question-density content = FAQ/PDP material).

**Pattern:** build-process content dominates views ~8:2 over story content. Shorts about distinctive finished bikes (cargo/e-bike/balance) are the current-era winners.

---

## 3. Shortlist — 10 strongest assets/stories for on-site placement

| # | Asset | Placement | Why (metric) |
|---|-------|-----------|--------------|
| 1 | **Full Home-Kit Build video** (`UhuzVI2yVNU`, 16.4k views) — or a re-cut of it | **PDP de-risking** — embed/loop on every kit product page ("watch a kit become a bike") | #2 all-time, 1.4% like ratio; directly answers "can I actually build this?" — the core purchase objection |
| 2 | **Kit unboxing** (`k79tmYj9Cxk`, 11.3k views, 49s) | PDP "What's in the box" section — pairs with bbc-product-whats-included | 11k+ views for a 49-second unboxing proves demand for exactly this content at point of sale |
| 3 | **3D-printed carbon lug live build** (`XCnFSZhhUgY`, 27.8k views) | Homepage or Why-Bamboo tech-credibility slot | Single biggest audience magnet the club has ever produced; signals engineering seriousness |
| 4 | **Balance-bike kit imagery** (IG C3kL7StNNNm, 182 likes — top post of the period; + Short `V4s0uXqEUZk` 3k views) | Balance-bike PDP hero + homepage product tile | Highest-liked IG post in ~20 months AND a 3k-view Short — the strongest single product across both platforms |
| 5 | **Prison programme story** (Lowdham carousel 1,216 reach; update reel 1,290 reach; Q&A reel 15 comments) | Homepage impact band + /pages/impact hero | 2025's reach leaders; the Q&A reel's 15 comments = the most conversation any 2025 post generated. Use programme photos only — never link an identifiable participant to a named prison |
| 6 | **James hand-crafting lugs reel** (IG C0gqvLZIXIB, 102 likes) | Homepage hero candidate — founder + craft in one clip | 2nd-highest engagement of the period; authentic maker footage matches the "built by hand" brand promise |
| 7 | **Named-builder stories: Jon (1,472 reach reel), Ian's family tandem (68 likes), Gervase's trike, Kevin's gravel kit** | Quote-wall / testimonial strip + "Builder stories" blocks on PDPs | Jon's reel had the highest verified reach of any 2024 post; customer-name content consistently 50–70 likes with shares — social proof that people like them finish these builds |
| 8 | **E-cargo "fits on a train" bike** (Short `M91Gd4H0DoU` 3.3k views + IG reel 39 likes) | Custom-kit PDP + homepage "what people build" gallery | Best-performing upload of the final YouTube batch; proves the custom kit's range |
| 9 | **New frame-building jig** (IG DNi32lxzBDI — 1,652 reach, 8 saves, best measured reach of any post; + `tUYYjq25P4k` 2.5k views) | Workshop/about page + kit PDP trust content ("real tooling, real workshop") | Top verified IG reach + 8 saves signals utility; the £500 jig video shows the club's open-source ethos |
| 10 | **Kirui / Nairobi + Project Zero stories** (330 / 920 reach, 3 shares) | Impact page case-study cards; Kirui = "36+ countries" proof point | Modest reach (recent + small window) but the only two 2026 posts; Project Zero's 5 comments + 3 shares in 2 weeks is strong for current baseline — and both are exactly the mission stories the redesign needs |

**Honourable mention for FAQ/support content:** "How to Seal and Protect a Bamboo Frame" (`PyYAHBv4O8A`) — 17 comments of real user questions; mine those comments for the PDP FAQ accordion.

### Actions this implies
1. Re-auth the youtube-manage OAuth token (invalid_grant) to get real watch-time before finalising video picks.
2. IG has only 4 posts in 12 months — the redesign should not assume a live feed widget will look fresh; use curated embeds instead.
3. Video embeds already have a pattern on-site: `bbc-video-lightbox` snippet + per-card YouTube ID (used on Kenya/Kate/UCL/Coventry cards).

---

# PART 3 — Analytics baseline attempt + re-run checklist (R2a)

# R2a — Traffic Baseline for bamboobicycleclub.org

**Date pulled:** 2026-07-11 · **Requested window:** last 90 days (2026-04-12 → 2026-07-10)

## Status: NO DATA RETRIEVED — both MCPs are auth-blocked

No traffic numbers appear in this document because none could be obtained. Nothing below is estimated or inferred; fabricating a baseline would be worse than having none.

### What was attempted and what happened

| Source | Call | Result |
|---|---|---|
| GA4 (`analytics-mcp`) | `get_account_summaries` (×2) | Returns `[]` — the authenticated Google account can see **zero** GA accounts/properties. No property ID available, so `run_report` cannot be attempted without guessing. |
| GSC (`gsc`) | `list_sites` | Returns empty — the authenticated account has no Search Console sites. |
| GSC (`gsc`) | `search_analytics` for `https://bamboobicycleclub.org/` | **403**: "User does not have sufficient permission for site 'sc-domain:bamboobicycleclub.org'". (The property exists as a domain property; the MCP's account isn't a user on it.) |
| GSC (`gsc`) | `search_analytics` for `sc-domain:bamboobicycleclub.org` | 400 — the MCP server mangles the sc-domain form by prefixing `https://`; pass the plain URL instead (it normalizes to sc-domain itself). |
| Theme code check | grep for `G-`/`GTM-`/`UA-` IDs in layout/snippets/sections/config | No measurement IDs in theme files. Normal for Shopify — GA4 is typically injected via the **Google & YouTube channel app**, so this does not mean tracking is absent. Verify in Shopify admin. |

### Diagnosis

Both MCP servers are *connected and responding* — this is not a connection failure. They are authenticated as a Google identity that has **no access** to BBC's GA4 property or the `sc-domain:bamboobicycleclub.org` Search Console property. This matches a known outstanding item from earlier SEO work ("GSC access remains"). Likely cause: the MCPs are OAuth'd as an account (possibly `bamboobicycleclub@gmail.com` or another identity) that was never added as a user in GA4 Admin / Search Console settings, while the properties presumably live under `email@bamboobicycleclub.org` or a legacy account.

### How to unblock (5–10 min, James or whoever owns the Google properties)

1. Identify which Google account the `analytics-mcp` and `gsc` MCPs are OAuth'd as (re-run their auth flow in an interactive session via `/mcp` to see/replace the identity — auth cannot be fixed from this non-interactive session).
2. **GA4:** Admin → Property access management → add that account as *Viewer* (or re-auth the MCP as an account that already has access).
3. **GSC:** Settings → Users and permissions on `sc-domain:bamboobicycleclub.org` → add the account as *Restricted* user (read-only is enough).
4. Re-run this pull. Everything needed is scripted in the "Re-run checklist" below.

### Interim alternative (real numbers, no Google access needed)

Shopify Admin → **Analytics → Reports** has sessions by landing page, by device, and by referrer for the same 90-day window (Shopify's own tracking, independent of GA4). Not exposed through the current `shopify` MCP toolset (orders/products/themes only), but a 5-minute manual export from admin would give a usable baseline for the redesign while Google access is sorted.

---

## What can be said WITHOUT traffic data (qualitative only — no volumes)

These are structural facts about the site, useful for framing once numbers arrive. **No volume claims.**

**Funder/commissioner paths that need measuring** (from the theme's template inventory):
- `/pages/impact` (page.impact.json) — the core commissioning story
- `/pages/support-mission` (page.support-mission.json — new this redesign)
- Case-study blog articles (prison/education case studies migrated 2026-06)
- `/pages/about`, `/pages/our-story-2`, `/pages/why-bamboo`

**Commerce paths:** 16 kit product templates, `/pages/workshops`, collections (road, gravel-adventure, mtb, balance-bikes).

**Open questions the data must answer before design effort is allocated** (do not guess these):
1. Does the homepage or product/SEO landing pages carry most entrances?
2. What share of sessions is mobile? (Assume mobile-first until proven otherwise — Shopify stores typically skew mobile, but *measure it*; note the browser tooling here can't visually verify mobile layouts, so CSS review is the fallback either way.)
3. Do impact/funder pages get meaningful organic entrances at all, or do funders arrive via direct links from emails/proposals? (Design implication is very different: SEO-driven → optimize discoverability; link-driven → optimize the landing experience only.)
4. Which queries drive clicks — brand ("bamboo bicycle club") vs generic ("bamboo bike kit") — and which pages are the quick-win candidates (positions 4–10, low CTR)?

## What this means for design effort — provisional, pending data

- **Do not lock the redesign's page-priority order until this baseline exists.** The current homepage-first slice is a reasonable default, but if (for example) kit product pages dominate entrances via organic, they deserve the deeper investment.
- **Treat mobile as primary by default** for any work that ships before the device split is known; revisit once measured.
- **Re-run this task the moment access is granted** — it's fully specified below and takes ~2 minutes of tool calls.

## Re-run checklist (once access is granted)

- GA4: `get_account_summaries` → property ID → `run_report` with:
  - `landingPage` × `sessions, engagementRate, bounceRate` (top 20, order by sessions desc)
  - `deviceCategory` × `sessions` (overall), and `landingPage`+`deviceCategory` for the top pages
  - `sessionDefaultChannelGroup` (or `sessionSource/Medium`) × `sessions`
  - Date range `2026-04-12` → `2026-07-10` (or trailing 90d at run time)
- GSC (`siteUrl: https://bamboobicycleclub.org/` — plain URL, the server converts to sc-domain itself):
  - `search_analytics` dims `query` (top 20 by clicks), dims `page` (top 20 by clicks), dims `device`
  - `detect_quick_wins` same window
  - Filter `page contains /pages/impact|support-mission|about|why-bamboo` for the funder-path volumes vs `products/|collections/` for commerce.
