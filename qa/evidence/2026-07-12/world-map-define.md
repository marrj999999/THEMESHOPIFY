# DEFINE — J2: world map infographic (where-we-operate band)

## What this pass closes
James's request (via task): upgrade the "where we operate" band on /pages/impact from
text-only group cards to a WORLD MAP INFOGRAPHIC — "more interesting than just more text".
Map sits ABOVE the existing 4 opgroup cards; cards + full-picture link stay.

## FORMULA rows in scope
- §4 band anatomy: map slots into the existing band between lede/sites-list and the group cards; no new band.
- §2 symbols: markers reuse the lime-dot node language (lime on light); ✱ footnote carries the 45-countries stat.
- §5 communication: verb-honest marker classes — lime solid = standing operations ("we run"),
  ringed/hollow = past programmes & partnerships ("we've taught in") per OPERATIONS-MAP.md wording care.
  This is how the map avoids the "training hubs" overstatement the Verified-2026 audit flagged
  (Kenya 2019 one-off, Rwanda 2024 partnership, Ethiopia = collaborator-led, Falun 2018, The Hague school project).

## Research check (WORKFLOW 1.5)
- Banked: qa/OPERATIONS-MAP.md is the verified location list (used verbatim; nothing unverified mapped).
  Its "grouped list, not a map" recommendation is superseded by James's explicit map request,
  but its two honesty mechanisms are kept: (a) two marker classes so one-offs don't read as
  permanent sites, (b) the 4 group cards remain below as the legible mobile fallback —
  the map is additive, not a replacement (directly answers the mobile-illegibility concern).
- Reference pattern ("steal this"): impact-report world maps from B-corp/charity annual reports
  (e.g. Fairtrade/WWF style): muted dot-grid landmass + brand-colour markers + one oversized
  stat block in empty ocean space + tiny legend. Adopted: dot-grid land (muted, recedes),
  Europe magnifier inset (6 of 9 markers cluster in Europe — unreadable without it),
  big "45 countries" stat in the South Pacific dead space. Avoided: choropleth shading of
  45 kit countries (implies per-country data we don't publish; caption carries the stat instead).

## Definition of done
1. assets/bbc-world-map.svg — equirectangular projection computed from real lat/longs
   (no guessed positions), viewBox present, tokens only (mist land, lime/forest markers, paper-transparent bg).
2. Markers (9): London/UK cluster label, Amersfoort, Toulouse, Munich (lime = standing) ·
   Falun, The Hague, Nairobi, Kigali, Addis Ababa (ringed = past programmes/partnerships).
3. Wired into sections/bbc-impact-2026.liquid above the opgroup cards — image setting
   (defaults to the asset) + editable caption + editable alt. Zero hardcoded band copy.
4. CSS in assets/bbc-statement.css scoped .bbc-rd-impact — full-width, max-height 420px desktop,
   mobile-safe; gentle marker pulse lives inside the SVG (it renders via <img>, so external CSS
   can't reach it) with prefers-reduced-motion guard.
5. Gate-check clean → push (section only; no template change — new settings fall back to schema
   defaults) → Playwright verify at 375px + desktop on preview_theme_id=196820238710,
   screenshot to qa/evidence/2026-07-12/map-band.png, eyeball continental sanity
   (Kenya on east Africa, UK on Britain).
