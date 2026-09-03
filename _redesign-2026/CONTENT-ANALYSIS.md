# Content analysis — 2026 redesign (findings + fixes)

**Date:** 2026-06-11. Analysed the copy/messaging across all 14 redesign sections + the PDP specs, cross-checked against the proof bank. **No prison is named anywhere** (clean). Below: what was **fixed now** (copy-only, applied + pushed to sandbox) and what **needs James** (data/decisions).

## Fixed now ✅
1. **Unverified rating removed from the PDP.** The buy-box ★4.8 / "214 builder reviews" (and the reviews-band stars + per-review 5-stars) were still live despite the "blank ratings" decision — a trust/legal risk on a CIC. Now **gated on a real rating value** (blank by default → shows a plain "Builder reviews →" link instead). Fill `rating_value`/`review_count` only with verified data to re-enable.
2. **Wrong cross-sell price fixed.** PDP related-kit cards showed "Road Lugged Kit — From £385" (it's the **£795** flagship). Related-card prices are now cleared site-wide (title + image only) so no stale/wrong price can leak; set per-kit if wanted.
3. **Bundle frame price is now the real product price** (`{{ product.price }}`), not a hardcoded "From £385" — so the "complete your build" bundle is correct on every kit (e.g. £795 on road-lugged), not just Gravel.
4. **"4,000+" stat unified.** It read three ways — "people have built a bike" (home/about), "bikes built worldwide" (impact), "builders trained worldwide" (education). Now **"4,000+ people have built a bike" everywhere** (the honest superset; "trained" implied a course most kit-buyers didn't take). Also normalised "social return per £1" (was "…per £1 invested" on impact).
5. **Two factual headline mismatches fixed.** Workshops hero "Two days" → **"Two to three days"** (its own tags say MTB = 3 days). Education hero "Two programmes" → **"Three programmes"** (the body shows three: justice, schools, corporate).
6. **Brand-warmth win kept:** the funding loop ("You build → Profits fund → A life changes") and "we're not a bike shop with a charity attached" are the strongest content and are consistent across pages.

## Needs James (data / decision) — not applied
- **"HMPPS partner" badge** on the Education page — the one named association with the prison service on a public page. Confirm it may be stated publicly and that "partner" is the accurate word, or soften/remove.
- **Balance bike: weight in kg** (stated nowhere — the "is it light enough?" question can't be answered until measured), the age lower bound (2 yrs vs ~18 mo), and the **funding wording** ("10% of profits" on the balance template vs "every kit funds a place" elsewhere — pick one canonical phrasing).
- **Unsourced precise claims** to verify: "1,544 young people" (schools), "2,000 sq ft workshop / six learners / six-week, four-hours-a-day" course detail (the reconciliation lists cohort size and course length as unconfirmed), "bamboo frames over 120 years old".
- **Real testimonials.** The community/PDP quotes are persona-attributed placeholders (e.g. "London · weekend workshop", "Proud Parent") — per the standing "no testimonial yet" decision these shouldn't read as real people. (The Kate Rawles / Gravel Cyclist quotes ARE sourced — keep those.) Supply real named quotes, or we remove the invented attributions.
- **Figures to reconcile:** Cycle-to-Work % (39 vs the live section's 42), the per-discipline build-time figures the specs flag, the canonical bundle component-pack pairing per kit, and the canonical workshop "from" price vs the home loop's "from £375" (kit) — recommend labelling kit-vs-workshop "from" anchors distinctly.
- **Video URLs** (the Workshops "Watch the series" + play button default to `#`) — likely the known YouTube IDs.
- **Fatbike max tyre clearance** — the one decisive spec, still a placeholder.
- **SEO — page `<title>` + meta descriptions** must be written in Shopify (Online Store → Pages/Products → SEO) for home, impact, education, workshops, about, each kit, the kit collection(s), and the blog — these are NOT in the theme sections. Hero H1s are emotive (great for brand, weak for search); put keywords in the meta title or a near-top H2.

## Smaller recommendations (optional, copy-only)
- Tighten the hero ledes — they repeat "skills, confidence and family ties" verbatim across home/impact/footer and lean institutional; borrow the funding-loop's plainer voice up top.
- Unify the loop's middle-step wording (currently "our prison course" / "a prison course" / "a place inside prisons").
- Add the CIC + enhanced-DBS + insured credibility line to the **Workshops** page (it's on Education but missing where a first-time consumer books an in-person day).
- Consolidate partner-funnel CTA verbs (Work with us / Run the programme / Enquire / Explore partnerships all point to the same place).
