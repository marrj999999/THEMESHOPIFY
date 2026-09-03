# Complete Content Audit — Press & Case Studies (2026-06-20)

Sources consolidated: blog corpus (`bbc-blog-corpus.jsonl`, 598 unique articles), Press & Media Log, Blog Quotes & Testimonials (151 quotes), press-research-200-articles, Instagram (Meta API, 20 recent), Facebook (15 recent), live Impact + About pages.

---

## 1. THE INVENTORY WE HAVE

### PRESS — 58 articles across ~42 outlets (user thought ~20; it's nearly 3×)
**Tier-1 national / global:** Financial Times (×2 — prison) · The Guardian (×4) · The Telegraph · CNN Money · Metro · Fast Company · The Independent · Evening Standard · BBC News · Hindustan Times · Wallpaper\* · Time Out London
**Design / sustainability:** Designboom (×4) · Inhabitat (×2) · Treehugger · Core77 · Country & Town House · Uncrate · Huck (×2)
**Cycling:** BikeRadar (×3) · road.cc (×3) · Bikerumor · Cycling Weekly · Cycling Electric · Gravel Cyclist · Singletrack · InsideEVs · Total Women's Cycling · Bike Noob · Protectmybike
**Prison-specific:** Inside Time (×3) · FT/Timpson
**International:** Francisco Torreblanca (ES) · The Monopolitan (ES) · Swoop Patagonia · Love Her Wild · Outdoor Philosophy · Climate Cycle
**Recognition:** IFB2016 (UK Govt GREAT Britain showcase) · University of Cumbria · BikeBiz · Wharf Life · Cornwall Live

### CASE STUDIES — ~120 polished + ~398 builder posts
- **Prison / Build to Bond (10):** Full Story, Fathers Building Balance Bikes, OCN Level 2 at Lowdham Grange, Prisons Minister Endorses, FT coverage…
- **Museums / Awards (13):** Design Museum (Cycle Revolution), Musée du Luxembourg/Grand Palais Paris, London Design Festival, Investec £24k, Green Heroes, CIC+Investec+Innovate UK, Engineering Club lecture, Coventry UK Bamboo Summit.
- **Epic journeys (33+):** Kate Rawles 8,288mi Patagonia · 2 by Bamboo 11,300km S.America · Tom & Nicky UK→Singapore 22,000km · Dr Tom & Dr Nick UK→Singapore MSF · Jock→Norway for PAPYRUS · Kate Strong 3,000mi Britain · 10,000km across Britain · Swiss Family Tandem · Cycling 1,000km Italy · Eden Project bike 8,000mi.
- **Corporate (6+):** The Macallan (10 bikes) · Four Seasons Hampshire · GM Motors Zurich · Hilton Bankside · UCL 100kg e-cargo · Upcycle Brixton donation.
- **International / social (5):** Kenya · Ghana Bamboo Bikes (Birmingham) · Rwanda · Bamboo Wheelchair · Article 25 humanitarian.
- **Education (41):** Coventry Univ · KCL · Southbank Univ · Swansea Univ (testing) · Reed's/Bradfield/Oratory/Stoke schools · The Hague school · Munich franchise · Amersfoort hub · Falun Sweden cooperative.
- **Standout builder stories (named, page-worthy):** Jon (one-handed build) · Claire (5yr London commuter) · Manish (negative-carbon AI professional) · Taro Tsuruta (10yr daily) · Gervase (cargo-trike livelihood) · Soraya · Mark (Surrey Hills 29er) · Justin (6yr bikepacking).
- **~398 raw Instagram/builder posts** (`@user finished build`) — community proof, best as a feed/gallery, not individual cards.

### QUOTES — 151 in the vault (Timpson, Ruth Leas, James Marr, plus dozens of builder/maker quotes)

---

## 2. WHAT THE LIVE PAGES ACTUALLY USE (very light — user is right)

| Page | Press shown | Case studies shown | Quotes |
|---|---|---|---|
| **Impact** | ~2 logos (FT, Guardian) | **1** card (Lowdham Grange) | 2 (Timpson, Ruth Leas) |
| **About** | 6 wordmarks (FT, Guardian, Telegraph, CNN, Metro, Fast Company) | **0** | 1 (founder) |

➡️ **Coverage: ~6 of 42 outlets, ~1 of 120 case studies.** Massive under-use.

---

## 3. THE GAP — what's missing

- **Press:** 36+ outlets never shown, incl. tier-1 (Independent, Evening Standard, BBC News, Hindustan Times, Wallpaper\*, Time Out) and the entire design/cycling press.
- **Case studies:** Impact shows ONLY the prison card — missing journeys, corporate, international, education, museums, and all named builder stories. About shows NO case studies at all.
- **Categories entirely absent from both pages:** epic journeys, international/social (Kenya/Ghana/Rwanda/wheelchair), corporate, education partners, the museum exhibitions.
- **Quotes:** 148 of 151 unused.

---

## 4. RECOMMENDED BUILD (make it comprehensive without burying the reader)

You can't put 178 items on two pages — the move is **curated depth + links to full archives**:

**IMPACT page** — add:
1. **Case-study grid** (reuse `.rd-cscard`) — one strong card per pillar: Prison (Lowdham) · Journey (Kate Rawles) · International (Kenya/Ghana) · Education (Coventry/KCL) · Corporate (Macallan) — each linking to its blog story, + "See all impact stories →" to `/blogs/impact`.
2. **Fuller press strip** — all real-logo outlets + "As featured in 40+ publications" with a link.
3. **More quotes** — add the anonymised Maker + a journey quote.

**ABOUT page** — add:
1. A **press wall** that's honest about scale: the real logos + "...and 40+ more" → press page.
2. A **"Stories" band** — 3–4 cards spanning a journey, a builder, a corporate, a community project.
3. Optionally an **Instagram/community feed** strip (the 398 builder posts) for living proof.

**Logos available as REAL assets now:** FT, Guardian, Telegraph, CNN, Metro, Fast Company, Design Museum. **Sourceable next:** Independent, Evening Standard, BBC News, Hindustan Times, Wallpaper\*, Time Out (national brands, likely on Wikimedia/Brandfetch). Cycling/design blogs mostly lack clean logos → text or omit.

**Consider a dedicated `/pages/press` (or `/blogs/news`) "As featured in" archive** so the home/About/Impact pages can link to the full 58-article list rather than cram it.
