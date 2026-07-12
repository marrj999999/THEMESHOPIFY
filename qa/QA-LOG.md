# QA Log — CUSTOMTHEME20262 redesign
*Defects, fixes, verdicts. Newest first.*

## 2026-07-12 — Phase 2 diagnosis: /pages/impact (draft theme, desktop + 375px mobile emulation)

**The good news: no structural breakage found on the draft.**
- No horizontal overflow at 375px (only intentional off-canvas cart/skip-link).
- All story-card images load (200s incl. bbc-rd-cohort.jpg); the "empty dark cards" seen mid-scroll are **lazy-load lag**, not missing images.
- Bands stack correctly on mobile; stats band reflows 2×2; steel "Three ways" cards clean.
- The June-audit "rendering glitch" did not reproduce on the draft — it may have been fixed in the Jul 7–8 passes, or lives only on MAIN/live. **James to confirm on his phone against the draft preview**: https://bamboobicycleclub.org/pages/impact?preview_theme_id=196820238710

**Defects & gaps to fix in the Phase 2 rebuild (D# = defect):**
| # | Item | Type |
|---|---|---|
| D1 | Stats band says "90%" → canon is "90%+" | copy/claims |
| D2 | "learners" ×2 in workshop band → "Makers" (voice rule) | copy |
| D3 | Pathway flows render as run-on text with → arrows ("Taster→Short course…") — unreadable on mobile; convert to stacked step list (rd-steps) | design |
| D4 | Headline/eyebrows proper-case ("Building bikes. Rebuilding lives.", "BUILD BIKES · …") → brief says lowercase, dial-up | design |
| D5 | Missing: **Backed-by strip** (Investec · NLCF · LSBU · FT · Timpson — names/logos, NO £) | gap (plan) |
| D6 | Missing: **since-2012 / 14-years longevity anchor** as its own beat (only "since 2012" small print in stats) | gap (plan) |
| D7 | "From prisons to Patagonia" adventure wall still on page (~1,440px) → move to why-bamboo per plan | gap (plan) |
| D8 | "Read the 2026 impact report" button exists — needs the download-asset card treatment + verify target file exists | gap (plan) |
| D9 | Funder beat is thin: "Back the mission" CTA → needs how-the-money-works mechanism sentence + giving ladder + "talk to James" (charity:water pattern) | gap (plan) |
| D10 | Quote attribution per June audit (Sally Allsopp) — verify current quotes' state during rebuild | content |
| D11 | Lazy-load lag leaves flat forest blocks while scrolling — add width/height + poster/LQIP background to card media so the wait reads intentional | design |
| D12 | Page ~15,000px on mobile (~18 screens) — trim during restructure; folding in funder/commissioner/B2B beats must NOT grow it: cut D7 + de-dup to compensate | design |

**Gate status:** diagnosis only — no changes deployed this pass.

---

## 2026-07-12 — Phase 1 (foundation) — Gates 1–4 PASS
- G1: claim-lint clean after hardening (SVG false-positive fix) + 18 real stray banned claims fixed across stale local sections (commit fafceee). bbc-conformance.js found to be a browser-console script — runs at G3, not G1 (note for the loop).
- G2: 5 files deployed to 196820238710, read-back byte-identical.
- G3: draft theme confirmed (Shopify.theme.id), Atkinson rendering site-wide, --forest #003C32, --bbc-lime→#D4FD62, tokens sheet loaded, zero console errors. Homepage hero had been rendering **Georgia** (Fraunces declared but never loaded) — fixed to Atkinson 800.
- G4: JS font/regression sweep over home, impact, why-bamboo, gravel PDP, our-story-2, cart, collection — 0 Jakarta/Fraunces/Hanken/Georgia elements.
- G5 (James): ⏳ awaiting phone-check of the preview.
