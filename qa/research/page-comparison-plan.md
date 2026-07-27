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

## Coverage now — 4 page types compared

| Page type | Valid peers | Meets 8–12 bar? |
|---|---|---|
| Homepage | 20–21 | ✓ |
| **Impact** | **9** | ✓ |
| PDP | 7 | ✗ marginal |
| Collection | 7 | ✗ marginal |
| Programmes / workshops / schools | 0 | not started |
| Tier B (6 pages) | 0 | not started |

Two discovery bugs were fixed along the way, both of which would have put fiction into a median:

- **Hardcoded URLs → 7 of 10 were 404s.** Replaced with discovery from a browse page.
- **Discovery wandered off-domain** — the Big Issue homepage yielded a **ted.com privacy policy**,
  which would have entered the table as "The Big Issue's impact page". Now same-host only, with
  PDF/asset paths and sub-120-word pages rejected so a failed load cannot drag a median.

## What the four page types say together

| Page type | Our length | Field median | Ratio |
|---|---|---|---|
| PDP | 15.8 vp · 2,354 w | 4.9 vp · 741 w | **3.2× on both** |
| Impact | 12.8 vp · 2,333 w | 7.8 vp · 729 w | 1.6× / **3.2×** |
| Homepage | 13.1 vp · 1,962 w | 8.2 vp · 669 w | 1.6× / **2.9×** |
| Collection | 4.4 vp · 1,201 w | 6.2 vp · 861 w | **0.7×** / 1.4× |

**Length is a house pattern, not a page problem.** Three of four page types run ~3× the field on
word count. This is the same finding QA-LOG D12 raised for the impact page in July — the
benchmark shows it is systemic, and it is the single most consistent gap between us and the field.

**Collection is the exception and the proof it is fixable.** It is *shorter* than the median
(0.7×) and reads well. Whatever discipline produced that page is the discipline the others need.

**Where we lead:** mission language on the impact page (42 mission-words against a next-best 27 —
the highest in the set), and price presentation on the PDP (32px vs peers' 14–20px).

**A shared weakness:** images above the fold. Collection shows 4 of 26 against a median of 8 —
on a page whose entire job is showing products. PDP shows 6 of 32, impact 2 of 26.

## Honest status against my own bar

I set 8–12 comparable peers per page type. **Only homepage and impact clear it.** PDP and
collection sit at 7 valid peers — usable as direction, not as verdict. Three Tier-A types
(programmes, workshops, schools) and all six Tier-B pages have not been started.

Peer discovery for mission-programme pages is the hard part: there is no "prison bike-building
programme page" cohort to compare against, so those will need hand-picked comparators
(training providers, employability charities) rather than automated discovery.

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
