# Full content + image review — 2026 redesign (2026-06-12)

Reviewed **every** redesign surface (home, about, impact, education, workshops, contact, 10 PDPs, collection, cart, blog, article, search, 404, header, footer) on sandbox 195991470454, via 4 parallel reviewers + manual image checks. Three checks each: image content, completeness, fact-check (against the vault + prior audits). Deployed templates snapshotted to `_redesign-2026/sandbox-snapshot/` as ground truth.

## ✅ Fixed now (live on sandbox, commit 98031a0)
1. **[BLOCKER] Impact "Build to Bond" image was wrong** — `bbc-rd-family.jpg` was a frame on a workshop wall (no people) under an alt promising "grandparent + grandchild + balance bike". Root cause: IMG_5459/IMG_5128 filename confusion in the earlier image audit. Replaced with the real shot (man on a bamboo road bike + toddler on a bamboo balance bike) — alt now accurate.
2. **[HIGH] Leaked editor notes** — literal `(FLAG: confirm kg)` / `[FLAG: …]` strings were rendering in public spec tables + FAQs on Balance, Balance-flax, Custom PDPs (11). Stripped.
3. **[HIGH] Gravel PDP "98% would build again"** (unverified) — only kit not overriding the default. Changed the section default to a safe non-numeric line; no kit can leak it now.
4. **[HIGH] City PDP "why bamboo" image was an e-bike** (hub motor) on a non-powered commuter kit — misleading. Reverted to the bamboo-tubes macro.
5. **[HIGH] Workshops "from £595"** — broke the agreed no-public-price rule (and wrong vs £795). Replaced with an "All-in / materials, tools & tuition included" stat.
6. **[HIGH] Contact page 3 dead `#` buttons** — the hero route cards (Workshops & kits / Our programmes / Get involved) had no link_url. Wired to `/pages/workshops`, `/pages/impact`, `/pages/impact`.
7. **[HIGH] Footer "Join 15,000+ builders"** — ~4× overstatement (inherited from the old footer's "15,000+ enthusiasts" email count). → "Join 4,000+ builders".
8. **[LOW] Home "4,000 builders. 4,000 stories."** → "4,000+" for consistency.

## ⚠️ Needs James (data / rights / history — not guessed)
**Facts to confirm/correct:**
- **Kate Rawles ride dated 2018** on the About timeline — vault says she set off 2022, finished 2023 (2018 is the Green Heroes year). Confirm the correct year. [HIGH]
- **1,544 young people** (home + education) stated as a hard sourced stat — precise but unsourced for public use. OK to state? [HIGH]
- **CIC year**: pages say 2020; one vault doc says CIC #16257348 registered 2025. Which? (No Companies House API key to settle it.) [MED]
- **Impact "four hours a day"** vs the vault's "18 hours/week, 120 hours total" — don't reconcile. Confirm real schedule. [MED]
- **"Bamboo frames over 120 years old"** (home) — no source. Keep or cut? [MED]
- **"45% of prisoners lose contact with their children (Prison Reform Trust)"** (impact) — not in source docs; verify stat + attribution. [MED]
- **FT "IKEA effect"** pull quote (home) — confirm it's a real FT line. [LOW]

**Rights / sensitive:**
- **"HMPPS partner" badge** on Education — the one named prison-service association on a public page. Confirm public use + that "partner" is accurate. [BLOCKER until confirmed]
- **Impact hero** = busy workshop with identifiable faces above prison-focused copy. It's a public-workshop shot (not a breach), but flag if you'd prefer a non-people image there.

**Missing data:**
- **Balance bike weight (kg) + exact age range** — still unstated (the top parent question). Placeholder removed; supply real figures.
- **Custom kit lead time** — placeholder removed; supply real lead time.
- **Munich** hub missing (only London/Amersfoort/Toulouse). Bookable venue? If so I'll add a card.
- **Workshops credibility line** (CIC + enhanced-DBS + insured) present on Education, missing where consumers book. Add it? (recommended)

**Your Shopify config (can't set from here):**
- **Footer largely empty on sandbox**: 4 column menus have no Navigation menu assigned; all 4 social URLs blank (social row hidden); policy menu unset (privacy/terms/refund/shipping don't render). Assign in editor or send me the menus/URLs.
- **SEO** page titles + meta descriptions unset (live in Shopify admin, not the theme).

**Minor consistency (fix on request):**
- Gravel-lugged FAQ cites standard gravel build as "25–40 hrs"; gravel says "25–35". 
- Balance + Balance-flax both call themselves "our simplest kit" (and the "simplest" is the slower one).
- Home "Mountain" kit card uses a flax road-kit photo (no MTB cue) — real Tim's-MTB photos exist in the Shopify library if wanted.
- `/pages/workshops` and `/pages/bicycle-frame-building-workshop` both render the redesign workshops page — a canonical/redirect would be cleaner for SEO.

## ✓ Passed
- **No prison named** anywhere (hard rule holds across all 22 surfaces).
- All kit **prices correct + dynamic** (road £375 · gravel £385 · mtb £385 · city £375 · balance £165 · gravel-lugged £595 · road-lugged £795 · custom £495 · balance-flax £66 · fatbike £385); ratings correctly **blank**; related/bundle prices clean; no wrong cross-sell price.
- Cart, collection, blog, article, search, 404 — complete (empty-states handled, prose styled, no lorem, no dead links).
- All other images fit their context; Cycle-to-Work shown only as the canonical 25–39%.
- Header nav/search/cart/mobile drawer/bottom-bar all wired; both workshop URLs resolve.
