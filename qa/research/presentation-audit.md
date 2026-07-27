# Presentation audit — what people actually SEE
*2026-07-27 · `node qa/benchmark-presentation.mjs` · raw `presentation-benchmark.json` · screenshots in `presentation-shots/`*

The content benchmark counted numbers in the DOM and put us at 16 against a field median of 20.5 —
modestly low, easy to shrug at. But a number buried mid-sentence and a number set at 48px in its
own card are not the same asset, and counting cannot tell them apart. This measures **size,
container and position**, and then — the part that matters — **looks at the screenshots.**

## The measurements

| Site | Figures | Hero-sized (≥2× body) | Biggest | Above fold | **First figure at** |
|---|---|---|---|---|---|
| **BBC** | 3 | **3** | 42px (2.3×) | **0** | **y3897** |
| Tony's Chocolonely | 28 | 0 | 16px (0.7×) | 1 | y22 |
| Toast | 9 | 0 | 22px (0.5×) | 1 | y45 |
| Who Gives A Crap | 11 | 0 | 18px (1.3×) | 2 | y704 |
| Recycling Lives | 3 | 3 | 48px (3×) | 1 | y767 |
| Fine Cell Work | 7 | 0 | 13px (0.8×) | 0 | y1376 |
| Switchback | 5 | 0 | 30px (1.6×) | 0 | y2492 |
| Belu | 4 | **4** | **96px (5×)** | 0 | y2850 |
| Divine | 2 | 0 | 12px (0.8×) | 0 | y2936 |

## What this says

**1 · Our proof arrives last in the field — by a wide margin.**
First number at **y3897**. That is roughly four screens of scrolling before a visitor sees a single
piece of evidence. Tony's shows one at y22, Toast at y45, Who Gives A Crap at y704, Recycling Lives
at y767. We are 5× further down than the next-latest meaningful comparator.

**2 · But when our numbers do appear, they are presented better than most.**
All three are hero-sized (2.3× body). Tony's has 28 figures and *not one* is hero-sized — they are
all 16px, buried in running text. Who Gives A Crap's 11 are 18px. Only Belu (96px, 5× body, in
dedicated stat blocks) and Recycling Lives (48px) treat figures with more weight than we do.

**So the defect is placement and quantity, not craft.** We know how to present a number. We just
do it three times, very late.

**3 · We write numbers into phrases; the field isolates them.**
"Shipped worldwide to 45 countries" is one string, so it reads as prose, not as proof. Belu and
Recycling Lives isolate the figure ("132" / "People into paid employment last year") so the eye
catches it before the sentence does. That is why Tony's scores 28 figures and looks evidence-rich
while its numbers are typographically invisible — and why we score 3 while having a 168-note
Proof Bank.

## What only looking at the screenshot revealed

**The consent banner covers our one explanatory line.**

`BBC-fold.png` shows the hero as a first-time visitor sees it: the masthead
*"more than a bike. a way forward."* fills the left column — and the sub-line that does the
zero-knowledge work, *"Every bike built here funds accredited skills programmes — in schools and
inside prisons"*, is **cut off behind Shopify's cookie dialog**. Only "Every bike buil…" and
"programmes –" are readable.

So on a first visit, before any interaction, the page shows a poetic headline, a photograph, and no
explanation of who we are or what we do. **No metric caught this.** The DOM contains the sentence,
so every text-based check passes. It took opening the image.

The banner is Shopify's, positioned centre-screen — its placement is a store setting (Customer
privacy → cookie banner position), not a theme change. **This is the single highest-impact,
lowest-effort fix on this page**, and it is James's to make in admin.

## Comparison worth studying: Recycling Lives / Onward Lives

Their fold does in one screen what ours defers:
- **Headline explains**: "We help people move onward, for good"
- **Sub-line explains again**: "helps people overcome barriers, rebuild confidence and create lasting change"
- **Two clear CTAs**
- **Immediately below the fold**: "**132** — People into paid employment last year" at 48px

Our headline is more distinctive than theirs and the 115px masthead is a real signature worth
keeping (see `cic-benchmark.md` — it is the largest in the field by 44%). The lesson is not
"write a duller headline". It is: **the proof should arrive on the first screen, not the fourth.**

## Recommendations

| # | Action | Effort | Owner |
|---|---|---|---|
| 1 | Move the cookie banner off centre-screen (Shopify admin → Customer privacy) so the hero sub-line is readable on first visit | minutes | **James** |
| 2 | Put 3–4 isolated hero figures above or just below the fold — 4,000+ builders · 45 countries · 90%+ completion · since 2012. All Proof-Bank verified, all already approved wording | medium | build |
| 3 | Isolate figures from their sentences so the number is the visual unit, following Belu and Recycling Lives | medium | build |
| 4 | Keep the current typographic treatment — 2.3× body is already better than 7 of 9 peers | — | — |

## Method note

Ten sites, homepages, 1280×900, consent dismissed where a standard control existed, full-page
settle before capture. Screenshots saved for every site so any number here can be checked against
what the page looks like — which is exactly how the banner finding surfaced, and how three false
findings were caught earlier this week. **Measure, then look.**
