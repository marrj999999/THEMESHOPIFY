# Per-page peer comparison — coverage, the number, and the first result
*2026-07-27*

## The honest answer to "have you compared each page against 10 other sites?"

**No.** Coverage is 2 of ~25 pages:

| Page | Comparison | When |
|---|---|---|
| Homepage | 20–21 peers (design, content), 10 (presentation) | this week |
| /pages/impact | 1 similar-pages study + 3 element studies | July |
| **~23 other pages** | **none** | — |

WORKFLOW 1.4 has required a similar-pages check per page since 12 July. In practice it has been
run once. That is the single largest gap in the quality system, and it is what B2 exists to close.

## How many comparisons — decided from evidence

Not a taste call; taken from what the runs actually produced:

- **20 peers** (`benchmark-cic`) → stable median, clear outliers, but several peers were not
  genuinely comparable page types.
- **10 peers** (`benchmark-presentation`) → still unambiguous. Our first-figure-at-y3897 stood out
  against nine others without any doubt.
- **Below ~8** → one odd site drags the median enough to mislead.

> **The number is 8–12 truly comparable pages per page type.**
> Comparability matters more than count — a PDP measured against homepages teaches nothing.
> Where fewer than 8 true comparables exist (there are not 10 "prison programme pages" in the UK),
> use what exists and **state the sample size** rather than padding with near-misses.

### Tiering, because not every page earns a study

| Tier | Pages | Peers |
|---|---|---|
| **A** | takes money or carries the mission: PDP, collection, homepage, impact, programmes, workshops, schools | **10–12** |
| **B** | supporting: our-story, contact, teambuilding, why-bamboo, which-kit, build-to-bond | **6–8** |
| **C** | long-tail utility: geometry tables, size guide, privacy, whats-in-the-box | **0** — structural checks only; a peer study costs more than it returns |

That is roughly 7 Tier-A studies, 6 Tier-B, and none for the ~12 Tier-C pages — a real programme,
not an infinite one.

## Coverage now — 6 page types compared

| Page type | Valid peers | Meets 8–12 bar? |
|---|---|---|
| Homepage | 20–21 | ✓ |
| Impact | 9 | ✓ |
| Programmes | 9 | ✓ |
| PDP | 7 | ✗ marginal |
| Collection | 7 | ✗ marginal |
| Schools | 7 | ✗ marginal, mixed quality |
| Workshops | 0 | Tier A, not started |
| Tier B (6 pages) | 0 | not started |

Six of seven Tier-A types done. Three clear the bar; three are usable as direction.

**Programmes and schools needed hand-picked comparators** — there is no cohort of "prison
bike-building programme pages" to discover. Programmes was matched against UK justice and
employability providers (Switchback, Bounce Back, The Clink, Onward Lives, Emmaus, Key4Life,
StandOut, Working Chance, Spark Inside, Groundwork). Schools was matched against hands-on STEM
providers, with **Greenpower** the closest analogue — school teams *build an electric car*, so
their page has to sell a hands-on build programme to teachers exactly as ours does. Both peer
lists are named openly so the sample can be argued with.

## THE FINDING — length, across every page type we sell on

| Page type | Peers | Our viewports | Median | Ratio | Our words | Median | **Ratio** |
|---|---|---|---|---|---|---|---|
| PDP | 7 | 15.8 | 4.9 | 3.2× | 2,354 | 741 | **3.2×** |
| Schools | 7 | 10.1 | 3.3 | 3.1× | 1,639 | 352 | **4.7×** |
| Programmes | 9 | 10.5 | 4.6 | 2.3× | 1,847 | 547 | **3.4×** |
| Impact | 9 | 12.8 | 7.8 | 1.6× | 2,333 | 729 | **3.2×** |
| Homepage | 20 | 13.1 | 8.2 | 1.6× | 1,962 | 669 | **2.9×** |
| **Collection** | 7 | **4.4** | 6.2 | **0.7×** | 1,201 | 861 | 1.4× |

**Five of six page types run 2.9–4.7× the field on word count.** This is no longer an impression
or a single page's problem: it is measured, consistent, and the clearest gap between us and every
comparable organisation. QA-LOG D12 raised it for the impact page in July; it is house-wide.

**Collection is the exception and the existence proof.** It is *shorter* than its field median and
reads well. The discipline that produced it is what the other five need.

### Why this matters more than it looks

Every peer in the programmes set — organisations doing work as complex as ours, explaining prison
and employability programmes to commissioners — does it in a median of **547 words**. We use
1,847. Greenpower sells a full school build-programme in 290. The argument that "our work needs
more explaining" does not survive contact with the people who have the same explaining to do.

## Where we lead

- **Mission language**: impact page carries 42 mission-words, highest in its set (next 27).
- **Price presentation**: PDP price at 32px against peers' 14–20px.
- **Speed**: 512ms LCP against a 596ms field median.
- **Quotes**: 18 on the homepage, all sourced; 15 of 20 peers show none.

## Shared weakness: images above the fold

Collection shows 4 of 26 above the fold against a peer median of 8 — on a page whose entire job
is showing products. PDP 6 of 32, impact 2 of 26, schools 2 of 12.

## Method caveats

- Schools peer quality is the weakest: discovery returned a masters-course page for the Design
  Museum and a single event page for STEM Learning. Two sites reported 1.0 viewport, which is a
  measurement artefact on their scroll containers, not a real page height — it drags that median
  down, so treat the schools ratio as indicative.
- Two schools peers failed entirely (Young Enterprise cert error, Nuffield/RSA discovery).
- Every number is one run, desktop 1280, consent dismissed where a standard control existed.

## First result: PDP vs 7 social-enterprise product pages

`node qa/benchmark-page.mjs --set=pdp`

### A methods failure worth recording first

The first run hardcoded plausible-looking product URLs. **Seven of ten returned 404**, producing a
"finding" that peers average 1.4 viewports and 150 words against our 15.8 and 2,354. It looked
dramatic and was entirely artefact — a screenshot showed a literal "Oops / 404" page. URLs are now
**discovered** by following each site's first real product link from a browse page.

Even so, this sample is imperfect and should be read as directional:
- 3 peers failed discovery (Toast, Tony's, Belu — JS-rendered or non-standard URL shapes)
- "first product link" is not always representative: Hiut returned a gift voucher, Fine Cell a
  donation, Elvis & Kresse a workshop booking
- **Genuinely comparable product pages in this run: about 4** (Who Gives A Crap, Divine,
  Patagonia, Riverford). Below the 8 I just argued for — so treat as a first read, not a verdict.

### What it shows

| Site | Viewports | Words | Add-to-cart | Price |
|---|---|---|---|---|
| **BBC gravel kit** | **15.8** | **2,354** | **y1242 — below fold** | 32px @ y658 |
| Who Gives A Crap | 8.5 | 1,423 | y978 | 14px |
| Fine Cell Work | 6.6 | 977 | y557 ✓ fold | 18px |
| Elvis & Kresse | 5.2 | 1,325 | y749 ✓ fold | — |
| Patagonia | 4.9 | 557 | y652 ✓ fold | 16px |
| Divine | 4.0 | 502 | y453 ✓ fold | 20px |
| Riverford | 2.9 | 741 | — | 18px |
| Hiut Denim | 2.8 | 224 | y430 ✓ fold | 20px |

**1 · Our PDP is nearly twice the longest peer and ~4× the median.** 15.8 viewports against a
range of 2.8–8.5. A build-kit needs more explanation than a chocolate bar — but not 15 screens of it.

**2 · Add-to-cart sits below the fold.** Five of seven peers put it above. On a considered
purchase this is defensible *if* the page earns the scroll — but combined with 15.8 viewports it
means a ready-to-buy visitor has to hunt.

**3 · Price treatment is our strongest element.** 32px against peers' 14–20px, at y658. Clear and
confident.

**4 · Only 6 of 32 images are above the fold** — the gallery loads far down the page.

## Next

1. Widen the PDP set to 8+ genuine product pages (fix discovery for Toast/Tony's/Belu, and skip
   voucher/donation results) before treating the above as a verdict.
2. Build peer sets for the remaining Tier-A page types: collection, impact, programmes, workshops,
   schools.
3. Feed the length findings into B2 as explicit constraints, so pages are cut while being rebuilt.

## Standing rule added

**Never hardcode a peer URL.** Discover it, check the status code, and look at a screenshot before
quoting any number from it. This is the sixth crude-measurement false finding this week, and the
first where I caught it before writing it up as a result.
