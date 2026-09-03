# Content benchmark — storytelling, case studies, quotes, facts
*2026-07-27 · `node qa/benchmark-content.mjs` · raw `content-benchmark.json` · 21 homepages, all measured*

## Read this first: three of the automated findings were wrong

The raw run scored BBC **zero-knowledge 0/2** and **2 of 18 quotes attributed**. Both are false.
I verified each by hand before reporting, and neither survived:

| Automated finding | What verification showed |
|---|---|
| **zero-knowledge 0/2** — homepage doesn't say who/what | **FALSE.** The proxy read the first 700 characters of `body.innerText`, which is the consent banner, cart drawer and nav — not the hero. The real hero reads: *"more than a bike. a way forward."* → **"Every bike built here funds accredited skills programmes — in schools and inside prisons."** That is who, what and for-whom. |
| **2 of 18 quotes attributed** | **FALSE.** The regex looked for "— Firstname Lastname". BBC attributes with publication names — "FINANCIAL TIMES", "STUART HERITAGE, THE GUARDIAN", "Kate Rawles · BikeRadar", "CNN MONEY, QUOTING CO-FOUNDER JAMES MARR", "Maker, Build to Bond". **8 of 8 homepage quotes carry a source.** |
| **stats 4** | Understated for the same reason — the design benchmark's simpler number-count put us at 16 vs a median of 20.5, which is the figure to trust. |

**This is the third time today a crude proxy produced a false finding** (after the consent-banner
h2 inflating type-role counts, and the hidden cart-drawer element defeating the visual canary).
The peer columns for zero-knowledge and attribution are equally unreliable and should not be
quoted. The lesson is now permanent in `qa/ESCAPES.md`: **verify a finding before acting on it,
especially a flattering-to-fix one.**

## What actually holds up

### Quotes and attribution — a genuine strength

| | BBC | Field |
|---|---|---|
| Quotes on homepage | **18** | 0 in 15 of 21 sites; next highest Toast 19, Emmaus 13 |
| Carrying a source | **8/8 verified** | rarely attributed where present |

Fifteen of the twenty peers show **no quotes at all** on their homepage. We show the most, and
they are sourced to named publications and named people. On `/pages/impact` the Maker quote
— *"The bike was the first thing I ever made with my own hands. When my daughter rode it on family
visit day, I felt like a dad again."* — is attributed to "Maker, Build to Bond", which is both
properly sourced and correctly anonymised under the safeguarding rule.

**Do not change this.** It is the clearest area where we lead the field.

### People-led storytelling — also a strength

54 distinct named people on the homepage, second only to Elvis & Kresse (76) and well above the
field. The stories are about people, not about the organisation — which is what the mission peers
(Switchback 32, Fine Cell 35, Change Please 32) also do, and what the commerce peers mostly do not.

### `rd-q` renders at three sizes — the one real quote defect

The type audit found quotes at **22px / 28px / 42px** depending on page (PDP / most pages /
impact). Everything else in the estate is now one-size-per-role. This is the last outstanding
drift and it sits on the component we lead the field with. It is a design decision — pull-quote
vs inline quote may be intentional — so it needs your call rather than a silent flattening.

## Where we genuinely trail

**1 · Evidence density on the homepage.** 16 numbers against a field median of 20.5; one
percentage against Divine's 15 and Who Gives A Crap's 19. We hold a 168-note verified Proof Bank
and a Claims Register, and put less of it on the page than a chocolate company. This is the
clearest gap between what we can prove and what a visitor sees.

**2 · Case-study surfacing.** One case-study link on the homepage, against SEUK 5, Fine Cell 4,
Recycling Lives 4. The archive exists — 30+ blog case studies, the impact evidence wall — but the
homepage barely points at it. This is a routing problem, not a content problem.

**3 · Source signalling.** One source-signal phrase on the homepage against Switchback's 5. Where
we do cite (impact page, evidence wall) it is done well; the homepage carries the claims without
the citations.

## Recommendations

| # | Action | Effort | Owner |
|---|---|---|---|
| 1 | Decide `rd-q`: one quote size, or a documented pull-quote/inline pair | small | **James** |
| 2 | Raise homepage evidence density toward ≥25 numbers — the Proof Bank content already exists and is verified | medium | build |
| 3 | Surface 3–4 case studies on the homepage (routing, not new writing) | medium | build |
| 4 | Add source lines to homepage claims, matching the impact page's discipline | small | build |

## What NOT to change

- The quote system and its attribution — we lead the field.
- People-led storytelling — 54 named people, second in field.
- The poetic H1 supported by an explanatory sub-line. It satisfies the zero-knowledge rule
  through the subheader, which is exactly the pattern James's own rule permits
  ("poetic lines only as support").

## Method limitations

Proxies, measured identically across 21 sites, on homepages only. The counts (quotes, named
people, percentages, case-study links) are reliable enough for relative position. **The
zero-knowledge and attribution columns are not — they are documented above as false and should be
rebuilt before reuse.** Re-run per milestone alongside `benchmark-cic.mjs`.
