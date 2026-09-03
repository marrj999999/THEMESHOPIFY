# Workshops page — benchmark vs 9 paid-course peers
*2026-07-27 · `node qa/benchmark-page.mjs --set=workshops` · the #1 page in the revenue-driven order*

## Peer set — the true analogue, found not guessed

The strongest comparators are **framebuilding course pages**: multi-day, build-your-own-frame,
£600–1,650 — the same proposition as ours.

| Peer | What it sells |
|---|---|
| Ellis Briggs Cycles | 5–6 day steel framebuilding, Yorkshire |
| Stayer Cycles | Framebuilding 101, 5 days, East London, £1,650 |
| Scottish Framebuilders (Rothair) | 5-day framebuilders workshop, Glasgow |
| West Dean College · Obby · London Sculpture Workshop · Turning Earth · Makerversity · Bristol Bike Project | paid craft/experience courses |

**A methods note.** My first attempt at this set *guessed domains* — `thebicycleacademy.cc` does
not resolve, and `goodlifecentre.com` turned out to be an unrelated US legal-complaint site about
medical peer review. Guessing a domain is the same error as guessing a path; it just fails less
visibly. These were found by search and status-checked (HTTP 200) before use.

## Result

| | BBC | Peer median |
|---|---|---|
| **Main content words** | **609** | **611** |
| Viewports | 8.5 | 5.5 |
| Chrome words | **946** | 108 |
| Images above fold | 2 / 17 | 3 |
| **Price display** | **none detected** | 16–26px |

### The good news: length is exactly right
**609 words against a median of 611 — bang on.** The workshops page needs no cutting. Whatever was
done here is the discipline the impact page (2.5× median) needs.

### The defect: the price is buried
For a £595–£695 considered purchase, the price appears:

- **only at y4834** — roughly 5.4 screens down
- at **14px** — the smallest text on the page
- **inside a prose line**: "Road · 2 days · £595", "MTB · 3 days · £695"
- three occurrences, nowhere else

Peers put it at **16–26px**, and Turning Earth shows it at **y337** — near the top. Ellis Briggs
sets it at 26px.

**This is the same pattern as the proof numbers.** We write figures *into sentences*; the field
*isolates* them so the eye catches the number before the prose. It cost us the evidence comparison
on the homepage, and here it is costing the price on the page that sells our most valuable
bookable product.

### Chrome again
946 words against a peer median of 108 — the mega-menu, on every page, unchanged.

## Recommended changes, in order

1. **Surface the price.** An isolated figure per workshop, at card level, high on the page — not a
   14px fragment five screens down. This is the highest-value single change on the site's most
   valuable page, and it is a presentation fix, not new copy.
2. **Raise images above the fold** — 2 of 17 against a peer median of 3, on a page selling a
   hands-on experience where the photography *is* the argument.
3. **Leave the copy alone.** 609 vs 611 is the one page that does not need cutting.

## Caveat
Nine valid peers, one run each, desktop 1280. Turning Earth's 4,830 main words is an outlier
(a class-bundle listing page) and drags the mean, which is why the median is used throughout.
