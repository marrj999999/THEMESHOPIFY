# BBC 2026 Redesign — Complete Site Audit
**Date:** 2026-06-20 · **Theme:** Draft/preview 196243292534 (NOT the live theme) · **Method:** 9 parallel specialist agents (source + copy analysis) + lead visual walkthrough (rendered preview, desktop + computed-mobile).

---

## Verdict

| | |
|---|---|
| **Overall score** | **6.8 / 10** |
| **Launch readiness** | **Needs work** (focused 1–2 week pass, not a rebuild) |
| **Headline** | A genuinely strong, mission-led rebuild with a best-in-class narrative spine, warm voice, disciplined design tokens and mature accessibility — held back by three recurring problems: contradictory headline numbers, people-first imagery violated on the key emotional beats, and conversion/support gaps. |

### Dimension scores
| Dimension | Score | One-line verdict |
|---|---|---|
| Messaging & voice | **8** | Distinctive, warm, best-in-class hero + funding loop; let down by cross-page stat/price contradictions. |
| Concept & social-impact integration | **7.5** | Mission genuinely threaded through commerce; undermined by contradictory numbers + one unsubstantiated carbon claim. |
| Accessibility & mobile | **7.5** | Genuinely a11y-conscious; one systemic flaw — CMS alt text degrades to empty when a field is blank. |
| Storytelling & narrative | **7** | Strong arc; repeatedly undercut by lifeless object imagery on the emotional beats. |
| Design system & layout | **7** | Coherent token system + distinctive stamp-card language; one latent `!important` image bug + square gallery crop. |
| Brand identity & consistency | **6** | Strong component vocab, but an undocumented forest+lime rebrand, a hero in foreign fonts, and one page on the old palette. |
| UX, IA & conversion | **6** | Clean chrome; confused primary CTA, price-blind shop path, workshop "booking" that's really a contact form. |
| Support & customer journey | **6** | Exceptional product page; the wider support system is half-built (Help → legacy pages, WhatsApp linked nowhere). |
| Imagery & emotional fit | **6** | Hero/product strong; flagship Build-to-Bond still on an empty-room shot used twice. |

---

## What's genuinely strong (keep / protect)

1. **The "funding loop" device** — *You build → Profits fund → A life changes* — and the line *"We're not a bike shop with a charity attached. The workshops fund the mission — directly."* It makes an abstract CIC model instantly legible and is repeated point-of-sale on every product page. Best-in-class for a social enterprise.
2. **Warm, jargon-free voice** with real attributed quotes (Louise, Tamas, Maialen) and the Build-to-Bond father line *"When my daughter rode it on family visit day, I felt like a dad again"* — placed safeguarding-safe.
3. **Claims responsibly de-risked** since the old site: the false "28,000 PSI / stronger than mild steel" claim is gone; Why-Bamboo now uses honest sourced ranges and openly concedes where carbon wins — strong inoculation against greenwashing.
4. **Coherent token-driven design system** (`rd-*` vocabulary, the distinctive stamp-card motif, fluid `clamp()` type), scoped under `.bbc-rd` so it can't leak into legacy CSS.
5. **Mature accessibility + conversion craft**: skip link, real keyboard dropdowns, reduced-motion gating, labelled forms; JS-free add-to-cart, sticky buy bar, honest review handling. The **product page is exceptional** at de-risking a daunting DIY build ("you can't really ruin it", "you're never on your own", warranty line under the buy button).

---

## Cross-cutting themes (the same problems recur across dimensions)

1. **Numerical claim discipline is the #1 credibility risk.** The same figures are re-typed per file and have desynced. Flagged independently by the messaging, concept and storytelling audits. → needs a single **claims register**.
2. **People-first imagery is violated structurally, not incidentally** — object/studio fallbacks leak onto story/mission/impact beats because the *schema defaults and alt text steer editors there*. → encode people-first as a content-model constraint.
3. **An unresolved central identity question** (forest+lime+Atkinson vs forest+gold+Plus-Jakarta) propagates into colour tokens, CTA colour, three competing font systems, a stranded hero and a contradicting brand guideline. → one written brand decision resolves a whole chain.
4. **The site half-knows its own best practices but doesn't enforce them** — the right cohort fallback, the one working cover class, default-chained alts and excellent desktop keyboard nav all exist, but the defaults/labels/mobile drawer contradict them. → the fix is *consolidation*, not new work.
5. **Conversion + support infrastructure lag the content quality** — hidden prices, ambiguous CTA, workshop "booking" = contact form, promised WhatsApp not clickable, no post-purchase journey.
6. **Hardcoded page handles + stale guidance need a pre-launch reconciliation** against the live theme.

---

## Prioritised action list

### P1 — Before launch (credibility / blocking)
1. **Reconcile all load-bearing numbers to a single source of truth.** (effort S, impact high)
   - `bbc-home-2026.liquid:651` says **"100% completion"**; the same homepage stat block (`:796`), Impact (`:430`) and the Impact policy comment (`:14`) say **90%**. Two completion figures on one page.
   - `bbc-home-2026:635` "from **£375**" vs product `:16/:782` "from **£385**".
   - **£11.41 SROI** attributed to "PACT research" (`home:797`, `impact:431`) despite `impact:14` flagging it *unconfirmed — no attribution*.
   - Build a claims register (completion %, £11.41, 56.7% carbon, builders 4,000+, countries 36+, price, build time) with exact wording + source; reference verbatim everywhere.
2. **Fix people-first imagery on the emotional beats + the schema defaults that cause it.** (M, high)
   - The flagship **Build to Bond story uses an empty prison room (`bbc-rd-b2b.jpg`) twice on the Impact page** (`:87` feature, `:128` card). Replace with anonymised hands-on-joint and the **finished child's balance bike** (fully publishable, *is* the emotional payload).
   - Why-Bamboo accessibility/rehab feature (`:420`) and Education case-study/platform defaults (`:157`, `:135/:367`) fall back to frame-on-table / watermarked shots.
   - Rewrite the `home:648` impact-feature **alt default** (currently "frame on a build template") and the picker label — they steer editors to object shots even though the image fallback is now correctly people.
3. **Neutralise the global `img{height:auto!important}` rule + fix the square product gallery.** (S, high)
   - **Verified live:** `.rd-split .rd-media` feature images render 427px inside a 520px box (the rule defeats `object-fit:cover`); card/gallery `.rd-img-cover`/`.rd-ph` images are fine. Scope the rule out of `.bbc-rd` or give the split-media/hero/door/video images `height:100%!important`.
   - `.rd-cmp-22077` `aspect-ratio:1/1` crops landscape kit flat-lay photos ~37% top+bottom on the conversion-critical product page → use `4/3` or `object-fit:contain`.
4. **Resolve the primary-CTA identity + conversion leaks.** (M, high)
   - Global **"Book a build"** steers a worldwide *kit-buying* audience to a London *workshop enquiry*. Split into "Shop kits" (primary) + "Book a workshop" (secondary), or repoint.
   - Homepage kit cards show **no price** and link to a catch-all collection → add "from £X" + direct product links.
   - **Audit every hardcoded workshop handle against the live theme** (header default + mobile bottom-bar `:155`) — risk of dead-ending on a legacy layout.

### P2 — Strongly recommended
5. **Decide the canonical brand spec** (colour + fonts) and make code + guideline + CLAUDE.md agree; unify the homepage hero's stranded Fraunces/Hanken fonts; move `why-bamboo` off the old hardcoded palette. (M, medium)
6. **Make promised support real:** build a `bbc-support-2026` / FAQ hub in the `.bbc-rd` system (Help + FAQ currently land on off-brand legacy pages); make the WhatsApp/forum/YouTube channels **clickable** (promised on every product page, linked nowhere); add a contact response-time line + a post-purchase/order-tracking touchpoint. (L, medium)
7. **Replace the watermarked low-res `bbc-rd-edu.jpg`** on the Education credibility page; add visible prices + real dates to the workshop path. (S, medium)

### P3 — Polish
8. **Add inline `| default:` alt text to every CMS image** (the fix landed in only 2 of ~18 slots — blank fields ship empty alts); add Escape-to-close + focus management to the **mobile drawer**; bump `.rd-btn.rd-text` to 44px tap targets; then run one **automated a11y pass** (axe/Lighthouse) on the rendered preview. A shared `snippets/bbc-rd-img.liquid` (alt default + srcset + width/height) would make correctness the default. (M, medium)
9. Resolve `why-bamboo` "Net-negative" carbon cell + "world's most accessible" superlative; reconcile the **CIC legal name** (Bamboo Mobility Project CIC) consistently with a registration number in the footer; vary the final CTA so the site ends on emotion, not a third repetition of the Build/Partner/Fund triad.

---

## Already fixed this session (verified on preview)
- **Homepage "Building bikes. Building futures." mission** → now a cohort of real people with their finished bikes (was a lifeless frame). ✅
- **Impact "Teaching Kenya to build"** → now the people-filled workshop (was the misplaced frame). ✅
- **Impact "UK to Singapore" (Tom & Nicky)** → real loaded touring bike (was a workbench). ✅
- **Press/partner logo cells** → uniform 34px logos in tightened cells across Impact/About/Why-Bamboo/Press; 5 logo SVGs given `viewBox` to stop 300px float. ✅
- Image audit across Impact/About/Why-Bamboo/Press: 0 broken, 0 distorted; no horizontal overflow desktop or mobile. ✅

## Lead visual-pass specifics (rendered, complements the source audit)
- **Education hero is a double miss:** shows a finished *gravel bike* (object) for a page about students, **and** the copy says students build a "bamboo speaker" — the image doesn't even match the product. (P1-2 / messaging)
- **Workshops hero** uses a finished bike at sunset (object) rather than people building — defensible as aspiration but weaker; **pattern: page heroes lean on bike/object shots.**
- **Contact** is good — warm "Talk to us… there is a door for you" over the *people* workshop image.
- **Product (Custom Frame Kit)** is strong — distinctive technical-illustration render (correct for a product page), reassurance chips, 1:1 support, clear price.
- **`.rd-split .rd-media` height bug confirmed live** (see P1-3).

---

---

## Asset ↔ Content Alignment audit (added — verifies every asset against its claim)
A dedicated pass checking that each **image, case study, video and logo** actually matches the content beside it and the article it links to. Source agents can't see media, so this is a lead visual + link-integrity pass.

**Case-study / story cards — link integrity (all verified by fetch):**
- Impact (11 cards), About (5), Education (8) — **every link resolves to its real article.** (A first-pass "UCL link broken" flag was a *false positive* from a loose `/404/` regex; re-tested → 200 with the correct article title.)

**Case-study / story cards — image ↔ story match:**
- **About "Teaching Kenya to build"** used the touring-bike *kit flat-lay* (`edad684e…c7398b96`) — wrong story. **Fixed → `bbc-rd-workshop.jpg` (people), now consistent with the Impact Kenya card.** ✅
- **2-by-Bamboo (Impact)** shares the *same* Cordillera photo as the Kate Rawles card — no authentic two-rider image exists in the library → needs a real 2-by-Bamboo photo (open item).
- **Build to Bond** (Impact feature + Impact card + About card) uses the *empty prison room* (`bbc-rd-b2b.jpg`) — safeguarding-constrained, needs anonymised hands / the child's balance bike (open item).
- Macallan, Coventry, Ghana, Jon (one-hand), Design Museum, and the Education `cs-*` cards: images are institution/topic-specific and read as aligned.

**Video ↔ section:**
- Home "Watch a real build" `<video>` (Shopify-hosted mp4) **resolves (200)** and matches its section; a working YouTube embed is also present. (A "video 404" flag was a *false positive* from a `Range:` request the Shopify video CDN rejects.)
- Workshop build video (`bbc-rd-build-teaser.mp4`) + YouTube embed resolve and are contextually correct.
- **Only flag:** the home build-video **poster** is the frame-on-table object shot — on-topic but not people-first (low–medium; already listed under imagery).

**Image ↔ copy (topical accuracy, beyond people-first):**
- **Education hero is a genuine content mismatch:** shows a finished *gravel bike* while the copy says students build a *"bamboo speaker"* STEM project — the image contradicts the product. Needs a real STEM/speaker-build photo (minors → consent required); interim option is a neutral people-building shot. (open item)

**Logos / other assets:** press + institution logos verified earlier (real outlets, `viewBox` fixed, uniform cells). ✅

**Method note:** alignment is now a first-class check — the workflow agents build the worklist (every asset + its context + adjacent claim + linked URL, flagging filename-level mismatches), and the lead verifies the actual media + link integrity, because *what a photo/video depicts cannot be judged from source*. Two "broken asset" flags this pass were false positives, both caught by direct re-verification before reporting.

---

## Open items for James (need a human decision / new assets)
- **Commission one safeguarding-compliant Build-to-Bond photo set** (anonymised hands on a joint + the finished child's balance bike). This single shoot fixes the three highest-severity imagery issues at once.
- **2-by-Bamboo card** still shares the Cordillera photo with the Kate Rawles card — no authentic two-rider image exists in the library; needs a real photo.
- **Confirm or soften the £11.41 SROI** provenance, the 90%/100% completion figure, and the "world's most accessible" claim.
