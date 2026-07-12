# LOOK verdict — J2: world map infographic (where-we-operate band)

Deployed to draft 196820238710 (Shopify.theme.id confirmed in-page on every run).
Files pushed via qa/push-theme.mjs after gate-check pass: assets/bbc-world-map.svg,
assets/bbc-statement.css, sections/bbc-impact-2026.liquid. No template change —
new settings (map_enable/map_image/map_alt/map_caption) fall back to schema defaults.

## Screenshots (eyeballed, both viewports)
- map-band.png (desktop 1280) — map sits between the sites lede and the 4 opgroup cards.
  Continental sanity PASS: UK marker on Britain, Nairobi/Kigali/Addis Ababa on east Africa,
  Falun on Scandinavia, Toulouse on France, Munich on Germany. Europe inset ("europe, up close")
  carries the 6-marker cluster legibly. 45-countries stat strip + two-class legend under the map.
  Caption renders: "✱ kits built in 45 countries · standing programmes marked in lime, past
  programmes and partnerships ringed". Cookie dialog re-rendered into the lower half of the
  stitch — same known capture artifact as prior CRIT (declined on load; not a page defect);
  the 4 group cards + full-picture CTA verified clean on the mobile shot.
- map-band-mobile.png (375×812) — no horizontal overflow (scrollWidth delta 0), map compact,
  caption fully readable at 14px, all 4 group cards + CTA + HMPPS partner line intact below.
  Map micro-labels are small at 375px as expected — the caption and the group cards are the
  mobile-legible layer (per DEFINE mitigation; OPERATIONS-MAP concern addressed).

## Measured
- figure width 1160px desktop (breakout from 820 wrap, centred), 343px mobile; overflow 0 both.
- img natural loads from CDN (bbc-world-map.svg?v=…), complete=true both viewports.
- caption computed 14px both viewports.

## Honesty mechanics carried from OPERATIONS-MAP.md
- Lime solid = standing (London/UK, Amersfoort, Toulouse, Munich).
- Ringed = past programmes/partnerships (Falun 2018, The Hague, Nairobi 2019, Kigali 2024,
  Addis Ababa collaboration) — one-offs never presented as permanent sites.
- 45 countries (Proof Bank, James-approved 2026-07-07); "since 2012" canon. No banned claims
  (claim-lint clean in gate-check).
- Marker pulse animation lives inside the SVG (renders via <img>) with a
  prefers-reduced-motion guard that freezes it to a static 0.22-opacity halo.

VERDICT: PASS for handoff — awaiting James (G5) on the preview link.
