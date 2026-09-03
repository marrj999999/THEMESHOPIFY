# 2026-08-19 — why-bamboo "the material, drawn"

## prepush-design-390-*.png
Mobile read of the design BEFORE pushing (gate 4 LOOK). These are renders of the
standalone Claude Design preview `preview/2026-why-bamboo-drawn.html`, which
carries no media queries — so it shows the hero, callouts and datasheet grid
NOT collapsing. That is a limitation of the preview file, not of the build:
the theme CSS added to bbc-redesign-2026.css collapses .rd-dhero at 900px,
hides .rd-dim under 749px, and steps the datasheet 4→2→1 columns at 900/520.
Post-deploy mobile shots below are the real check.
