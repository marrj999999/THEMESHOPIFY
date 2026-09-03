# Research check — Impact page, "where we operate" world map infographic

*qa/WORKFLOW.md step 1.5. Element resolved from context: the task title passed "the element being built" as a literal placeholder — the only open, novel, research-worthy build item for /pages/impact right now is **J2 from QA-LOG 2026-07-13 (James G5 directive): "WORLD MAP INFOGRAPHIC — where-we-operate: replace text-only with a world map plotting our locations + the 45 countries… £0 = inline SVG, lime location dots, editable."** This is also DESIGN-BRIEF's "world map (45 countries)" component and FORMULA.md §6 research item 1. If this is the wrong element, redirect and re-run — everything below is scoped to the map only.*

---

## 1. Banked first — what already answers the need (do not re-research)

| Doc | What it already gives us |
|---|---|
| **qa/OPERATIONS-MAP.md** (compiled 2026-07-12 from vault) | The complete evidence-backed location list for the band: 4 UK prison sites, UK schools/uni partners (LSBU, UCL, Camden, Waltham Forest, etc.), UK public workshops (London confirmed, Brighton unconfirmed), 3 international franchise hubs (Amersfoort, Toulouse, Munich), overseas one-offs (Kenya 2019, Rwanda 2024, Sweden, The Hague), plus the "45 countries" kit-shipping claim. Every row has a status flag (✅ Verified / ⚠️ needs confirmation). **This is the single most important banked doc for the build — do not re-derive the location list.** |
| OPERATIONS-MAP.md §"Suggested band layout" | Explicitly recommends **against** a literal world map for exactly this content ("a dot map at mobile width makes the 4 UK prisons + London cluster illegible"; several entries are one-off programmes, not permanent pins, and pinning them overstates permanence — the thing the Verified-2026 audit already corrected once ("training hubs")). It proposes a grouped/chip list instead, with a map as an optional **desktop-only enhancement** using region highlights, not pins. **This directly conflicts with James's J2 instruction to build a full pin-plotting map — flag to James, don't silently override either instruction (see §4).** |
| **DESIGN-BRIEF.md** | Locks "world map (45 countries)" as a component to build; imagery/motion rules (duotone experiments debut on Impact; `prefers-reduced-motion` respected); mission pages stay "forest/paper-led, less lime." |
| **FORMULA.md** §2 (symbol system) | ✱ = mission/honesty mark only; numbered circle nodes = journey steps; chips = context labels, colour never the only cue; **one lime surface moment per page section-group** — caps how much lime the map can use relative to the rest of the page. §4 band anatomy (eyebrow → h2 → lede → content → 1 CTA, one left axis) applies to this band like every other. |
| **qa/CRIT-impact-final-2026-07-12.md** / **CRIT-impact-2026-07-12.md** | Prior CRIT passes on this exact band (A5: "Where-we-operate: 7 rows → 4 + 'the full picture →' link — progressive disclosure; fixes mixed chip semantics") — the current grouped-list version was already critiqued and partially fixed; the map is additive to that, not a replacement build. |
| **Repo state (checked this pass)** | A scaffold for the map already exists and is *not* wired up: `sections/bbc-impact-2026.liquid` has `map_enable` (checkbox, default true), `map_image` (optional override), `map_alt`, `map_caption` settings, and renders `assets/bbc-world-map.svg` as a plain `<img>` (lines ~202–210) with **zero location-dot markup** — no per-site coordinates, no lime dots, nothing plotted. The asset itself (`assets/bbc-world-map.svg`, 1.1MB, viewBox `0 30 2754 1180`) is a generic detailed political world map with 2,213 `<path>` country shapes (amCharts/mapchart.net-style stock file) — heavy, decorative, not the "£0 inline SVG, lime location dots, editable" spec James asked for. There is no `opgroup`/block type for placing pins (grepped for lat/lng/coordinate/pin/dot fields — none exist). **This is the actual gap to close, not a from-scratch map.** |

**Conclusion: banked docs + repo state already answer "what goes on the map" (OPERATIONS-MAP.md) and "what's built vs missing" (the img/caption stub above). What's NOT banked: how to actually construct lightweight, editable, mobile-safe location dots — that's what the fresh-examples pass below is for.**

---

## 2. Vault — verified facts/quotes/orgs for the map

Pulled directly from `Business/Proof Bank.md` (Proof Bank rules: sourced stats only) to sit under the map as the kicker/caption, on top of the full OPERATIONS-MAP.md location table already banked:

- **Countries: 45** — "James-approved 2026-07-07; verified from customer records — distinct `country`, brain archive contacts.db; top: **UK 4,077 · France 367 · Canada 330 · USA 227 · Germany 202**. Supersedes the old '36+' — update site/decks when next touched." → gives the map a natural "top 5" weighting if dot size/emphasis varies by volume (heavier dot UK/France/Canada/USA/Germany, lighter elsewhere) instead of implying all 45 are equal-weight operations.
- **People trained:** 4,000+ (since 2012) · **Bikes built:** 3,500+ · **Years operating:** 14 — existing stats-band figures, don't duplicate on the map itself, but consistent if repeated in the caption.
- Standing operations vs one-offs — vault language distinction already flagged in OPERATIONS-MAP.md: **"we run…"** (London, prisons, LSBU, Amersfoort, Toulouse, Munich) vs **"we've taught in…"** (Falun, The Hague, Kenya 2019). The map's dot styling should carry this distinction visually (filled lime dot = standing; ringed/outline dot = past programme/partnership) — this exact treatment is already written into the section's own default `map_caption` string in the liquid file ("standing programmes marked in lime, past programmes and partnerships ringed"), so the schema author already anticipated this pattern even though the markup doesn't implement it yet.
- **Hard exclusions carried over from OPERATIONS-MAP.md** (Proof Bank / safeguarding rules apply to the map same as the text band): never plot "Bamboo labs, Ethiopia" as a BBC-owned site (it's a 2019 collaborator project, not a standing BBC operation — plotting a pin overstates it exactly the way the Verified-2026 audit already corrected once); Camden vs Waltham Forest are different pins, don't merge; Brighton workshop needs James's confirmation before it gets a pin; no participant-level imagery/markers tied to a named prison.
- No vault images specific to a map graphic exist (this is an infographic, not a photo asset) — nothing to pull from the image bank for this element.

---

## 3. Fresh examples — 2–3 current best-in-class references for THIS element

### 3.1 charity: water — "Our Work" project map (charitywater.org/our-work)
**Does brilliantly:** Every completed water project is GPS-tagged and pinned on an interactive map, so a donor can zoom to a literal community and see what their money built, who built it, and what it cost — the map *is* the transparency mechanism, not decoration.
**Steal this:** The organising idea — group pins/regions with a live count next to them, and let the map *prove* the "backed by evidence" motif the rest of the Impact page already uses (asterisk-honesty, sourced stats). Concretely buildable: put the "45 countries · 4 prison sites · since 2012" kicker stat row directly under/beside the map (already planned per OPERATIONS-MAP.md), and make each dot's `aria-label`/tooltip text carry the same "we run…" / "we've taught in…" verb-honesty distinction vault language already specifies.
**Skip this:** The infrastructure — real-time Google Maps, GPS coordinates per project, zoom/pan interaction. That's a funded, ongoing-data-pipeline product, not a £0 static band on a Shopify theme. Building anything Google-Maps-shaped here would blow the £0 budget and the "editable, inline SVG" instruction outright.

### 3.2 World in Dots (worldindots.com) — dot-grid SVG world map generator
**Does brilliantly:** Constructs landmasses from a grid of small dots rather than solid path fills — adjustable dot size/density, brand-colour recolouring, explicitly built to be lightweight (small file size vs raster) and to adapt to light/dark backgrounds.
**Steal this:** The construction technique, not the tool. Replace the current 1.1MB, 2,213-path stock political map with a much smaller custom dot-grid base map (a few hundred dots max at BBC's operating scale — the page only needs ~7 world regions, not every country border) rendered as genuine inline `<svg>` in the Liquid template (not an `<img src>`), so individual location dots can be positioned as real SVG `<circle>` elements with `x`/`y` (or percentage-based) coordinates driven by section schema fields — which is what makes it "editable" per J2's spec, and what the current stub is missing entirely. Dot-grid landmasses also read cleanly as brutalist-editorial (flat, graphic, no gradients/shading) — consistent with DESIGN-BRIEF's "dial up the brutalist-editorial signature."
**Skip this:** Full country-count generation (all 195 countries) — BBC doesn't need every nation rendered, only enough landmass context to place ~10-15 operation dots plus a lighter "45 kit-countries" texture; over-building the base map re-creates the same 1.1MB weight problem it's meant to solve.

### 3.3 Flat dot-grid maps as a location marker overlay in modern SaaS/marketing sites (Stripe/Vercel-ecosystem "dotted map" pattern, e.g. the `sv-animations` "Dotted Map" component and the broader "Vercel aesthetic" dot-grid pattern used across Stripe, Linear and comparable product sites)
**Does brilliantly:** Uses a minimal, monochrome dot-grid map purely as a *backdrop texture*, then overlays a small number of accent-coloured location markers as the only colour on the whole graphic — the map recedes, the markers (and what they represent) carry all the visual weight.
**Steal this:** Directly matches FORMULA.md's "one lime surface moment per page section-group" rule — render the base map in a muted single tone (paper/steel-adjacent, not full-colour political fills) and reserve lime *only* for the location dots themselves (filled lime = standing operation, lime ring/outline = past programme, per the vault verb-honesty distinction above). This also solves OPERATIONS-MAP.md's mobile-legibility objection: a monochrome backdrop with a handful of bold lime dots stays readable small, whereas a full-colour detailed political map with 15 pins does not.
**Skip this:** Hover-triggered tooltips/animated pin-drop entrances as the *only* way to get location names — OPERATIONS-MAP.md already flags that mobile can't be visually verified in this repo's tooling and the reduced-motion rule is mandatory; any interactive/hover-only labelling must degrade to always-visible text (e.g. the existing grouped-chip list sits directly under/beside the map as the accessible, always-on version of the same data — map illustrates, list is source of truth).

---

## 4. Verdict — enough context to build?

**Mostly yes, with one decision only James can make before BUILD starts.**

**What's fully answered and buildable now:**
- The complete, evidence-checked location list and its verb-honesty ("we run" vs "we've taught in") distinction — OPERATIONS-MAP.md.
- The visual grammar to build it in (lime = standing, ring = past; one lime moment; monochrome dot-grid base; inline SVG not `<img>`) — synthesised from FORMULA.md + the three references above.
- Exactly what's missing in the current code (no dots, no coordinate fields, oversized stock SVG used as a flat image) — confirmed by reading `sections/bbc-impact-2026.liquid` and `assets/bbc-world-map.svg` directly this pass.
- The stat/count kicker row content (45 countries, top-5 by volume, 4 prison sites, since 2012) — Proof Bank.

**What's still missing / open, and who supplies it:**

| Gap | Vault gap or James question? |
|---|---|
| **J2 (build a plotted map) directly contradicts OPERATIONS-MAP.md's own recommendation ("grouped list, not a world map") for mobile-legibility and permanence-overstating reasons.** James's 2026-07-13 directive is explicit and overrides by G5 authority (his role is final call), but the contradiction should be surfaced, not silently buried — e.g. confirm whether the map fully *replaces* the grouped list or sits *alongside* it (list stays as the accessible/always-on fallback, map as an added visual, per §3.3 above). | **James question** — one line to confirm before BUILD. |
| Brighton workshop pin: OPERATIONS-MAP.md flags "confirm whether Brighton is still an active workshop" — unresolved since 2026-07-12. | **James question** (already logged in FORMULA.md §6 as outstanding). |
| Camden 1 Jul pilot: booked, but no post-delivery confirmation in the vault — plot as "confirmed" or "booked/pending"? | **James question** (Chris to confirm per OPERATIONS-MAP.md note). |
| "Bamboo labs, Ethiopia" — OPERATIONS-MAP.md explicitly warns against presenting this as a BBC-owned pin; needs James's read on whether/how it appears at all (e.g. folded into the Kenya/Rwanda "overseas programmes" cluster with careful wording, or omitted). | **James question.** |
| No approximate x/y (or lat/long) coordinate set exists yet for the ~10-15 dots against the chosen base-map viewBox — this is a build-time task (plot against the new SVG's own coordinate space), not a research gap; flagging so it's not skipped at BUILD. | Build task, not a gap. |
| Investec + LSBU logo files (unrelated to the map, but still open per FORMULA.md §6/QA-LOG) — noted for completeness, not blocking this element. | Vault/asset gap, already tracked. |

**Recommendation for the DEFINE step:** cite OPERATIONS-MAP.md (location data + verb-honesty rule), FORMULA.md §2/§4 (symbol/lime discipline), and this file's §3 (dot-grid-map-as-backdrop + lime-only-markers pattern, inline SVG not `<img>`) as the named references, per WORKFLOW.md's "a build with no reference named in its DEFINE is a smell" rule. Get James's one-line confirmation on the map-vs-list question and the Brighton/Camden/Ethiopia pin calls before cutting the new SVG, since those decide which dots exist at all.
