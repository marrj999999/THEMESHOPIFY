# PDP per-discipline customisation — research & what changes

**Date:** 2026-06-10 · **Section:** `bbc-product-2026` (one schema-driven PDP; each kit is customised via its **template config**, not a separate section). Gravel = baseline. Wired on sandbox theme `195991470454`. Raw specs: `_redesign-2026/rd-spec-*.json`.

## Why customise, not clone
Each kit serves a **different rider with different priorities and anxieties**, so the positioning, spec strip, FAQ, reviews, cross-sell, imagery and the funding tie must align with that customer. A road buyer wants compliance; an MTB buyer wants impact-survival; a commuter wants practicality + eco + Cycle-to-Work; a **balance buyer is a parent buying a gift** — not a cyclist at all.

## Cross-cutting (applied to every kit)
- **Unverified ★4.8 / 214 rating BLANKED** on all kits → subline "Rated by the builders who made one". Re-enable when real review data exists.
- **Funding tie-in stays generic** (never names a prison). Prices pulled from real store data; bundles use real component-pack prices (confirm exact pairings).
- **Common blocks shared** across kits: perks, "what you'll need at home", the 4-stage build, trust stats, the funding loop, why-bamboo. Only the discipline-specific blocks change.

---

## Road — `kit-road` · £375 · /products/bamboo-bike-road-kit
- **Customer:** distance/endurance drop-bar riders (sportive, club runs) + the maker who wants a one-off frame.
- **Values:** ride-feel/compliance, endurance (not race) geometry, ~32mm tyre clearance, drivetrain choice, all-day comfort over outright weight.
- **Bamboo anxieties → answered:** stiffness/efficiency (tuned for endurance comfort), weight (honest framing + spec advice), longevity over big miles (<1% failure, Swansea-tested, 8–12 yr, 2012 builds still ridden).
- **Customised:** positioning "stays smooth when the miles stack up"; specs = ride-feel/endurance-geo/~32mm/PSI; FAQ = stiffness · weight · longevity · drivetrain (105/single-speed/GRX) · tyre width; cross-sell Gravel / single-speed pack / Custom; bundle = single-speed £425.
- **Confirm:** build-time (25–35 vs the road template's 20–40 hrs), tyre-clearance number, a finished-weight figure, real ratings.

## Mountain — `kit-mtb` · £385 · /products/29er-frame-build-kit
- **Customer:** hardtail trail / XC riders who want a frame that lasts and like the build.
- **Values:** impact resistance, strength under load, 29er frame / 650B option, big tyre clearance, durability on rough terrain.
- **Bamboo anxieties → answered:** "will it survive impacts?" — bonded joints are **stronger than the tubes**; unlike carbon, bamboo **dents and is epoxy-repairable, it doesn't shatter**; bigger tubes + tighter tolerances (hence the longer **30–45 hr** build).
- **Customised:** positioning "a hardtail that soaks up the trail"; specs = wheel size / hardtail-geo+disc / 30–45 hr / PSI; FAQ = trail-worthiness · climbing stiffness · impact survival · wheel/brake spec · build time; **real MTB reviews** (verbatim from `bbc-kit-reviews`); cross-sell Gravel / 650B pack (£962) / Custom.
- **Confirm:** real ratings, an MTB geometry table (template ships none), off-road tyre-clearance, how the 8 variants map to sizes.

## City — `kit-city` · £375 · /products/city-bike-frame-kit
- **Customer:** ethically-minded urban commuter — **the most mission-aligned buyer**.
- **Values:** practicality (rack/mudguard/light mounts), low maintenance (single-speed/hub), comfort (upright), all-weather reliability, **sustainability + Cycle-to-Work**, and distinctiveness (a one-off bamboo frame is informal anti-theft).
- **Bamboo anxieties → answered:** daily rain (weatherproof lacquer, 8–12 yr), maintenance (single-speed = almost none), hills (spec gearing to route), security (distinctiveness), Cycle-to-Work (eligible from £375, 25–39%).
- **Customised:** positioning = eco + daily-commute + stand-out; specs = upright-geo+mounts / gearing; FAQ = rain · maintenance · hills · security · **Cycle to Work** (promoted to its own answer); **sustainability promoted to the lede**; real city reviews; cross-sell single-speed pack (£425) / Road / Custom.
- **Confirm:** Cycle-to-Work % (25–39 vs the `bbc-cycle-to-work` section's 25–42), build time (20–35 vs 25–35), a named testimonial, whether hub-gear options are offered.

## Balance — `kit-balance` · £165 · /products/balance-bike-lugged-kit-1 — **DIFFERENT CUSTOMER**
- **Customer:** a **parent or grandparent** buying a small child's first bike or a gift — often not a cyclist. The whole page reframes from "the ride I'll have" to "my child's first bike".
- **Values:** age/size fit (~2–5 yrs), light enough for little legs, safety, an easy joyful build (ideally *with* the child), keepsake/sustainability, a gift that means something.
- **Anxieties:** is my child the right age/size · is it light enough · how hard is the build · is it safe · why no pedals (balance-first is a *feature*).
- **The Build-to-Bond mirror (unique to this kit):** the programme's defining act is a parent inside building a balance bike for their own child — so here the funding loop is **literal**: *one first bike funding another*. Strongest emotional tie of any kit, kept generic.
- **Customised:** positioning "the keepsake first bike you build together"; specs = age range / weight / **8–12 hr (weekend) build** / hand-sealed finish (NOT the 25–35 hr adult figure); FAQ = age-size · weight · no-pedals · build difficulty · child safety; **parent + grandparent reviews**; stronger funding emphasis (the mirror); cross-sell finishing pack / grown-up kits ("when they outgrow it") / the Build-to-Bond story; bundle numberless.
- **Confirm (important):** **weight in kg is stated nowhere — must be measured**; age lower bound (18 mo vs the template's 2 yrs); whether 8–12 hr is the public figure; child-safety wording; "10% of profits" (balance template) vs "every kit funds a place" (base PDP).

---

## Customisation matrix
| | Road | Mountain | City | Balance |
|---|---|---|---|---|
| Customer | endurance rider | trail/XC rider | eco commuter | **parent (gift)** |
| Lead anxiety | stiff/fast enough? | survives trails? | rain/maintenance? | right age/weight? |
| Positioning lead | compliance/endurance | impact-survival | eco + practical + stand-out | keepsake first bike |
| Spec emphasis | ride-feel, ~32mm | wheel/geo, impact | mounts, gearing | age/weight/safety |
| Funding angle | generic loop | generic loop | eco + C2W | **the mirror** |
| Price | £375 | £385 | £375 | £165 |

## Premium tiers, distinct disciplines & variants (all wired)
The remaining 5 kits are done by the same method (research → spec → assemble → wire). **Touring** was dropped — no product exists for the `kit-touring` template.

### Gravel-lugged — `kit-gravel-lugged` · £595 · /products/gravel-lugged-build-kit
Premium tier of Gravel. "Lugged" = bamboo bonds into **pre-formed aluminium lugs** → cleaner/more repeatable joints, refined finish, **easier repair** (swap a tube at the lug), and a **faster 15–25 hr build**. Buyer = precision-minded / time-pressed / long-haul. One spec + two FAQ dedicated to the lugged construction; cross-sell down to standard Gravel.

### Road-lugged (carbon) — `kit-road-lugged` · £795 · /products/road-carbon-frame-build-kit
Flagship. **Carbon lugs** are the direct answer to the road buyer's weight + stiffness anxiety: lighter and stiffer than a wrapped joint, while keeping bamboo's damping; "looks like a custom frame-shop build." Faster 15–25 hr build. Cross-sell **leads with the cheaper standard Road kit** (downsell) for sticker-shock.

### Fatbike — `kit-fatbike` · £385 · /products/fatbike-home-build-kit  *(distinct discipline)*
Customer = adventure/expedition + beach/snow riders. Values **float** (wide ~4" tyres, low pressure), clearance, expedition durability. Positioning "float over anything"; specs swap to **tyre clearance (26×4"/27.5×4") + terrain (sand·snow·mud·beach)**, 30–45 hr build; FAQ on clearance, terrain, loaded strength, cold/wet/salt survival, fat-specific components. **Confirm: exact max tyre clearance (the decisive spec).**

### Custom — `kit-custom` · £495 · /products/custom-frame  *(sells the consultation, not a spec sheet)*
Customer = riders the stock sizes fail / who want an exact ride / one-off makers. The page **sells the service**: specs describe the *offer* ("Geometry: made to your measurements · Discipline: road/gravel/MTB/city · Design support: 1:1 guided · By hand"), not numbers. FAQ teaches the **process** (you do NOT need to know geometry — BBC guides you; send height + inside-leg; lead time; cost-vs-stock). Quote-led. **Confirm: lead time + intake process.**

### Balance-flax — `kit-balance-flax` · £66 · /products/balance-bike-flax-kit-with-resins  *(eco variant of Balance)*
Same parent/gift customer + the Build-to-Bond mirror, but **eco-first**: 100% natural materials (bamboo + flax, **no carbon, no lugs**), cheapest, **10–15 hr** simplest build, with a **schools/partnership** angle (the "Partnership" tag). One spec + FAQ on flax-vs-lugged (greener + cheaper). Real flax testimonial exists. **Confirm: weight/age (as the lugged balance), 10–15 hr build, partnership pricing.**

## Status
**10 kit product pages** are now in the redesign on the sandbox (Gravel baseline + 9 customised). All use the one `bbc-product-2026` section + a per-kit template config; all editable; unverified ratings blanked; funding generic. Bundle component-pack prices across all kits are best-estimate from real packs — **confirm exact pairings before launch**.
