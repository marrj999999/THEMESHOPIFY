# Rollout Tracker — CUSTOMTHEME20262 redesign
*Master coverage checklist. A page absent from this file is a bug in this file.
Gates: G1 static · G2 deploy integrity · G3 rendered · G4 regression · CRIT design critique · G5 James.
Status: ⬜ not started · 🔵 in progress · 🟡 deployed/awaiting James · ✅ closed (all gates + James same-version) · ⏸ parked by James.
Created 2026-07-11 (Phase 0). Update on every state change.*

## Phase gates (non-page work)
| Item | Status | Evidence |
|---|---|---|
| Phase 0 — brief locked, stale docs fixed, commit | ✅ | commits 9ff1c1a; vault Brand&Voice/Brand Guidelines fixed |
| Phase R — DESIGN-RESEARCH.md delivered | ✅ | qa/DESIGN-RESEARCH.md (R1+R2b; R2a analytics BLOCKED — needs GA4/GSC access for MCP identity) |
| Phase 1 — unified CSS deployed + regression sweep | 🟡 | bbc-tokens.css + 4 files deployed & read-back-identical; Gate-4 JS sweep clean on 7 pages (home/impact/why-bamboo/PDP/our-story/cart/collection); awaiting James (Gate 5) |
| Phase 4 — download card · email band · timeline · comparison table · world map · quote wall | ⬜ | |

## Pages (Tier 1 — already on standard; re-verify after Phase 1 CSS unification)
| Page | Section(s) | G1 | G2 | G3 | G4 | CRIT | G5 James | Status |
|---|---|---|---|---|---|---|---|---|
| /pages/why-bamboo | bbc-hero-band, bbc-stat-band, 3× bbc-pillar, bbc-statement, bbc-section, bbc-logo-wall, bbc-comparison, bbc-faq-section | | | | | | | ⬜ |
| Homepage (Phase 3 rebuild) | bbc-home-2026 + bbc-statement | | | | | | | ⬜ |

## Pages (Tier 2 — retrofit + content)
| Page | Section | Phase | Status |
|---|---|---|---|
| /pages/impact | bbc-impact-2026 | **2 (priority)** | 🟡 rebuild pass 1 deployed (D1–D8, D11 done; D9/D10/D12 open); awaiting James |
| /pages/workshop(s) | bbc-workshops-2026 | 5 | ⬜ |
| /pages/schools + education | bbc-education-2026 | 5 | ⬜ |
| /pages/prisons | bbc-commissioners-2026 (slimmed → points into Impact) | 5 | ⬜ |
| /pages/our-story-2 | bbc-about-2026 (+timeline band) | 5 | ⬜ |
| /pages/build-to-bond | bbc-build-to-bond-2026 (slimmed → folds into Impact; page may 301) | 5 | ⬜ |
| /pages/bicycleteambuilding + landing | bbc-teambuilding-2026 | 5 | ⬜ |
| /pages/support-mission | bbc-support-mission-2026 (seed content moves into Impact) | 5 | ⬜ |
| /pages/impact-report | bbc-impact-report-2026 | 5 | ⬜ |
| /pages/theory-of-change | bbc-toc-2026 | 5 | ⬜ |
| /pages/amersfoort-workshop | bbc-amersfoort-2026 | 5 | ⬜ |
| /pages/media-page | bbc-press-archive-2026 | 5 | ⬜ |
| /pages/gallery | bbc-page-2026 + bbc-share-build-2026 + bbc-gallery-grid-2026 | 5 | ⬜ |
| /pages/which-kit | bbc-kit-picker-2026 (+comparison table) | 5 | ⬜ |

## Pages (Tier 3 — commerce: type/buttons pass, keep density)
| Surface | Section | Status |
|---|---|---|
| 10 kit PDPs | bbc-product-2026 (+ "I can't build it" row, quote wall, white-default test) | ⬜ |
| Simple products / parts | bbc-product-simple-2026, bbc-parts | ⬜ |
| Collections + list | bbc-collection-2026, bbc-collections-list-2026 | ⬜ |
| Cart | bbc-cart-2026 | ⬜ |
| Account (7 templates) | bbc-account-2026 | ⬜ |
| Search / 404 / contact | bbc-search-2026, bbc-404-2026, bbc-contact-2026 | ⬜ |
| Blog + article | bbc-blog-2026, bbc-article-2026 | ⬜ |
| Header / footer | bbc-header-2026, bbc-footer-2026 (footer = Phase 4) | ⬜ |

## Tier 4/5 (no restyle)
| Item | Action | Status |
|---|---|---|
| page.about.json (11 legacy sections) | Retire template — James points about page at our-story-2 in admin | ⬜ |
| ~130 dead bbc-* sections | Archive list after publish; zero styling effort | ⬜ |

## Cross-cutting sweeps (whole theme — per-page work misses these)
| Sweep | Status | Evidence |
|---|---|---|
| Banned claims (claim-lint whole theme) | 🟡 | 2026-07-24: guards widened after finding claims live on the DRAFT under two green gates — `claim-lint` scans source, `estate-check` scans rendered, and a pattern in one but not the other is invisible. Both now carry: nationally recognised · Level 1 & 2 · guaranteed interview · Sustainable Design & Manufacturing (wrong OCN title) · prisoners. Every hit fixed, none waived; a documented ALLOW list covers only rule-statements, the MoJ framing the Claims Register approves verbatim, and third-party press quotes. DRAFT rendered-clean across 8 pages. **LIVE still carries the phrase on /pages/impact — James-owned.** |
| **OCN course title accuracy** | 🟡 | NEW 2026-07-24. Vault `System/Claims Register.md` gives the exact title "Workshop Skills and Sustainable Manufacturing" (ID 1130735). The theme published "Sustainable Design & Manufacturing" in 14 places and the correct title in 0. Fixed on draft: 6 sections + 5 templates; now renders correctly in 9 places. `CLAUDE.md` carried the wrong title too (corrected) — that was the propagation source. |
| "36" → "45 countries" everywhere | 🟡 | Rendered estate CLEAN (estate-check 2026-07-24, 0 FAIL) — section defaults/presets all fixed incl. the bbc-timeline milestone preset the round-3 sweep missed (b6235a8). REMAINING, all outside pushable code: (a) FAQ admin body + project-zero article = store content, WAIVED to James; (b) ~18 stale `templates/*.json` + `.bak` files — never pushed per hard rule, will resolve when James's editor content is re-pulled; (c) `main-impact-international.liquid`, dead Tier-4/5 section (referenced only by a .bak template) — archive, don't fix |
| Workshop price consistency | ✅ | RESOLVED 2026-07-24 by measuring the rendered draft rather than comparing docs: `/pages/workshops` and `/pages/bicycle-frame-building-workshop` both show **£595 / £695**, consistently. The £795 and "From £500" figures exist only in stale documentation, not on the site. No site change needed. |
| "Level 1 & 2" mushes → per-arm placeholders | ⬜ | |
| Logo SVG viewBox audit (all logo walls) | ⬜ | |
| info@ everywhere (no hello@/gmail) | ⬜ | |
| Makers language (no prisoners/learners) | ⬜ | |
| Alt text on all new/edited images | ⬜ | |
| Build-to-Bond year = 2024 · 14 years · people-trained label | ⬜ | |
| Jakarta/Fraunces/Hanken font remnants = zero | 🟡 | Deployed pages sweep = 0 rendered remnants; hardcoded refs remain in Tier-4/5 dead sections (retire, don't fix) |
| Editability: no hardcoded text/img/URL in touched sections | ⬜ | |
| Repeating-content de-dup (James's wince list) | ⬜ | |
| **Storytelling zero-knowledge pass — EVERY page's heads explain who/what (James 2026-07-12, see memory)** | 🔵 impact done pass 1 | |

## End-of-rollout completeness audit
| Item | Status |
|---|---|
| Every template ↔ tracker cross-check | ⬜ |
| Full-site before/after screenshot set (qa/pages.txt) | ⬜ |
| "What's missing?" critic pass → punch list → zero/parked | ⬜ |

## QA log
See `qa/QA-LOG.md` (defects, fixes, James verdicts).
