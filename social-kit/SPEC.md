# Bamboo Bicycle Club — Social Visual Kit SPEC

One-page guidance + 3 reusable card templates. Built for a one-person social operation: 3 hero posts/week (Mon/Tue/Wed/Fri, never Thursday), Buffer drafts only, James publishes.

---

## 1. PRINCIPLES (the six rules everything else hangs off)

1. **A person and an invitation, not a graphic.** BBC's best-ever post was James to camera asking a question. Real photos and clips of makers, hands, bamboo and benches lead the feed; template cards are the connective tissue, never the backbone. Target ratio: at most 1 card-led post in 4.
2. **Motion first, cards second.** Every static asset in the 100-persona sim lost (61–65% scroll-past); every winner moved. A template card never runs as the primary/lead asset on IG or FB — animate it (6–10s ken-burns/slow-reveal with caption overlay) or run it as slide 2+ of a carousel, a Story frame, or a LinkedIn document. Static-as-lead is allowed only on LinkedIn (1200×1200) where documents/cards are the native hero format.
3. **A card is right for exactly three jobs:** (a) a *sourced stat as punchline* — late in a carousel or as the one hard figure in-frame on a Build to Bond post, max ~1 stat graphic per fortnight; (b) a *quote/testimonial* where the photo can't be shown (anonymised Maker, safeguarding); (c) an *announcement/date* where the information IS the content. Never for press logos, awards, screenshots, kit/spec shots, or lists.
4. **Stories beat stats.** Numbers land late, alone and small — punchline or first-comment receipt, never the hook. The single exception: Build to Bond posts carry exactly ONE verified figure in-frame for funders, sourced from the Proof Bank only.
5. **Accessibility floor (non-negotiable):** all text on cards ≥4.5:1 contrast (≥3:1 only if ≥72px display); minimum 36px body / 28px meta text at 1080px export; one message per graphic ("treat it like a billboard") — detail goes in the caption where screen readers can reach it; alt text on every post; no flashing animation. Atkinson Hyperlegible is mission-aligned accessibility infrastructure, not decoration.
6. **Verify before shipping.** View the actual frames: picture matches caption; zero minors visible; no named/identifiable person linked to a prison; no banned claim on the visual. Nothing auto-publishes — everything lands in Buffer as a draft/reminder.

---

## 2. TOKENS

### Colour
Define once as CSS variables — do not hard-code hex values in layouts.

| Token | Hex | Role |
|---|---|---|
| `--forest` | **#003C32** ⚠️ | Primary dark: backgrounds, headers, wordmark on light |
| `--teal` | #3f8b66 | Secondary green, mid-tone, secondary CTA |
| `--steel` | #8da4c1 | Soft accent, light background tint |
| `--gold` | #ffa900 | CTA/emphasis — large display or chip fill only |
| `--cream` | #f8f7f4 | Light neutral background |
| `--lime` | #d4fd62 | Highlight on dark only (instructional) |
| `--sky` | #87ceeb | Highlight on dark only (workshop) |

✅ **FOREST resolved 2026-07-06:** #003C32 is canon (decided 2 Jul, verified in the live `--forest` token). All docs synced.

**Content-type pairings** (the bamboo stripe carries the accent, so colour signals type at a glance):
- **Instructional/how-to:** FOREST dark bg + LIME headline + TEAL/GOLD accents
- **Product/object story:** cream bg + TEAL + GOLD
- **Workshop/event:** FOREST or TEAL bg + GOLD + SKY

**Contrast rules:** LIME/SKY/YELLOW/PINK on dark backgrounds only, never as fills on cream. GOLD text on white/cream fails AA at body sizes — GOLD is for ≥72px display text or as a chip fill with FOREST text. Safe body pairs: FOREST on cream, white on FOREST, FOREST on GOLD.

### Type
- **Family:** Atkinson Hyperlegible (self-hosted/embedded woff2 — never loaded from Google). Weights 400 body / 700 headings only. Fallback if a pipeline can't embed it: Plus Jakarta Sans. Fraunces and Hanken Grotesque are dead — never use.
- **Pull-quote accent:** Georgia serif italic (echoes the site's `rd-pull` component) — quote card only.
- **Scale at 1080px canvas:** display 96–120px · headline 72px · subhead 48px · body 36px (floor) · meta/source 28px (floor, still ≥4.5:1). Sentence case throughout — no ALL-CAPS body, no fancy Unicode fonts.

### Logo
- Copy logo files out of `~/Downloads` into the kit asset folder first (fragile paths): `LOGOBBC_f9e58266….png`, `idIT_I4Xj2_logos.svg`; master PDF at `~/Desktop/BBC_Master_Guidelines.pdf`.
- **Two-colour rule:** wordmark and symbol always different colours; symbol bright, NEVER black. Light bg → FOREST wordmark + TEAL symbol. Dark bg → white wordmark + LIME or GOLD symbol.
- **Clearspace** = thickness of the letter-B stroke, enforced by template safe margins. Position: bottom-right, small.

### Graphic device
The **bamboo stripe**: 40px vertical stripe with a transparent node break at 48–52% of its height, left edge on 1:1 cards, top edge on 9:16 story variants. Stripe colour = content-type accent.

---

## 3. TEMPLATE SPECS — 3 cards at 1080×1080

**Shared geometry (all three):**
- Canvas 1080×1080. Outer margin 64px all sides. Bamboo stripe: x 0–40, full height, node gap y 518–562.
- **IG grid-crop zone:** the profile grid crops 1:1 to a 3:4 tile — keep all text and logos inside the central 810px width (x 135–945). Combined with margins, the working text column is **x 135–945, y 64–1016**.
- Logo lockup bottom-right: max height 72px, anchored 64px from right and bottom edges.
- Export: PNG, sRGB. The same 1080×1080 canvas re-exports directly as a LinkedIn PDF-carousel slide (6–10 slides) and as a 1200×1200 LinkedIn single image (upscale 1.11×).
- **Story/Reel variant (1080×1920):** same layout tokens; keep top 250px and bottom 420px completely clear (design to Reels margins — then it's safe in Stories too); reserve right 120px for the engagement rail; leave a designated blank "sticker zone" (poll/question/link) roughly y 1250–1450, centre. Bamboo stripe runs along the top edge instead of the left.

### (a) SOURCED STAT card — "the punchline"
*Job: one verified figure, attributed, used late (carousel slide 4+ / Build to Bond in-frame figure). Never the cover, never the hook.*

- **Background:** FOREST solid (funder-facing default) or cream for product contexts.
- **Layout (dark version):**
  - y 64–140: series kicker, 36px Atkinson 700, accent colour (LIME/GOLD/SKY per content type), e.g. "Build to Bond".
  - y ~300–560: the figure, 200–240px Atkinson 700, white. One number only (e.g. "90%+").
  - y ~580–700: what it means, 48px Atkinson 400, white, max 2 lines, sentence case (e.g. "of Makers complete the course").
  - y ~720–800: **comparator line (optional, named pattern):** 36px, accent colour — "vs 20% nationally (MoJ)".
  - y ~900–952: **source line — MANDATORY, the card does not exist without it:** 28px Atkinson 400, steel/60%-white, e.g. "Source: OCN accreditation records, 2025". Mirrors the site's "no stat without a source field" rule.
- **Copy library (hard-coded approved stats):** 4,000+ builders trained · 36+ countries · since 2012 · 90%+ prison-course completion. OCN titles EXACT per context: prisons "OCN Level 2 — Sustainable Design & Manufacturing"; schools "OCN Level 1 Award — Practical Manufacturing Skills" — never "Level 1 & 2" mushed.
- **Hard-blocked (lint before render):** "28,000 PSI" / "stronger than steel" (say "comparable to mild steel, tested to BS ISO 22157 at Swansea University") · "56.7% lower carbon" (say "grown not mined, regrows in 3–5 years") · "£11.41 SROI" · "£280 per learner" · "100% completion".
- **Story variant:** figure sits y 700–1000; source line above the sticker zone; poll/question sticker invited in the sticker zone.

### (b) QUOTE / testimonial card — anonymised-Maker safe
*Job: carry a Maker's or customer's voice when the face can't or shouldn't be shown.*

- **Background:** cream (default) or FOREST for Build to Bond. Optional: a *hands/bench/bamboo detail photo* (no faces) at 20% opacity under a FOREST scrim ≥ 4.5:1 for the text.
- **Layout:**
  - y 64–160: oversized opening quote mark, 160px Georgia, accent colour.
  - y ~220–760: the quote, 60–72px **Georgia italic** (the `rd-pull` echo), FOREST on cream / white on FOREST, max 6 lines, one thought only. Longer quotes go in the caption, not the card.
  - y ~820–880: attribution, 36px Atkinson 700: **first name OR role only** — "Danny, Maker" / "A Maker on Build to Bond" / "Workshop customer, London".
  - y ~900–950: context line, 28px Atkinson 400, muted.
- **Safeguarding logic built into the template (checklist rendered in the template file comments):**
  - Attribution may carry a name OR a prison, **never both** — and never split across slides of one carousel.
  - Say "Maker", never prisoner/participant/offender; "Build to Bond", never "the prison programme".
  - If a photo layer is used: no faces of Makers in prison contexts, no minors ever; the empty-Lowdham-workshop shot is the model for prison imagery.
  - Attribute the achievement to the Maker — no "we taught them" BBC-centring lines on the visual.
- **Story variant:** quote block y 500–1100; attribution above sticker zone; suggested sticker: question box "Ask a Maker anything".

### (c) ANNOUNCEMENT / date card — workshops, courses, open days
*Job: the information is the content — date, place, one action.*

- **Background:** content-type pairing — workshop announcements default TEAL bg with GOLD + SKY accents; course/instructional announcements FOREST bg with LIME.
- **Layout:**
  - y 64–150: kicker, 36px Atkinson 700, accent — "Workshop" / "New course" / "Open day".
  - y ~200–480: event name, 88–96px Atkinson 700, white (or FOREST on lighter TEAL if it passes 4.5:1 — verify), max 3 lines.
  - y ~520–640: **date block:** 48px Atkinson 700, white — day-of-week + date + time ("Saturday 26 July, 10:00"). British format, sentence case.
  - y ~660–740: place, 36px Atkinson 400 (naming a prison site here is allowed — with no person named or shown anywhere on the asset/carousel).
  - y ~800–890: **CTA chip:** GOLD fill, FOREST text, 36px Atkinson 700, 24px corner radius, e.g. "Book your bench" — matches the web primary-button rule. Secondary CTA: TEAL fill, white text.
- **Copy voice:** second person, warm, invitational — "Come build with us", never "We're excited to announce". No emojis on the visual; the caption may use one or two on IG, none on LinkedIn.
- **Story variant:** date block centred y 800–1000; CTA chip replaced by the native **link sticker** in the sticker zone (don't paint a fake button where the real one goes). Add a countdown sticker for events ≤7 days out.

---

## 4. RULES (ship-blockers, checked on every asset)

**Safety — Makers and prisons**
- Naming a prison BBC works at: allowed. Linking a named or otherwise identifiable Maker to a named prison: NEVER — including across slides of one carousel or a post+caption pair.
- No minors in any asset, ever (the one consent exception; all adult customer imagery is cleared). View every frame — filename-based pairing has shipped a breach before.
- Vocabulary: "Makers", "Build to Bond". The maker is the hero, BBC is the guide — no saviourism lines, no pity framing, no generalising about a country/region.

**Stats**
- Every number on a visual has an in-frame source line. Proof Bank only; if unverified, leave it out. Approved list and banned list as in §3(a); run claim-lint (the `scripts/claim-lint.sh` pattern) over copy before publishing.
- Max ~1 stat graphic per fortnight; on Build to Bond, exactly one figure in-frame.

**Alt text (every post, at publish)**
- 1–2 sentences, <125 chars on Reel covers. Describe what's shown and why it matters; transcribe any text baked into the graphic; never open with "Image of/Picture of". Use the native alt fields on IG and LinkedIn.

**Publishing mechanics**
- Buffer drafts/reminders only — James publishes, Mon/Tue/Wed/Fri (never Thursday). IG 10:30/12:30; LinkedIn Tue/Wed 08:00–09:00, from James's profile, no emojis, rewritten not mirrored. Hashtags: 3–5 niche, camelCased, in the caption, never on the visual. Blog images: always the https:// CDN og:image URL (http:// renders broken). No watermarked re-uploads to FB/Reels.

---

## 5. ANTI-PATTERNS — do not build

1. **A static card as the lead feed asset** — the sim's bottom four were all static stills. Animate it, carousel it, or Story it.
2. **Stat-card-as-hook or list-card templates** — "stats are not interesting and a list is pointless" (James, 17 Jun). No "5 reasons…", no update-list tiles.
3. **Press logo / award photo / webpage screenshot layouts** — the two worst validated posts ever (0.35, 0.37). Press coverage re-leads with a making clip + outcome line; the logo goes in the caption or first comment.
4. **Product/kit/spec sheet cards** — under-performing category; object stories run as "The Bike That…" photo/video, not graphics.
5. **A template-first grid of branded tiles** — BBC's advantage is authentic workshop material; the kit makes real photos consistent, it doesn't replace them. No more than 1-in-4 posts card-led; no two static-portrait-style assets in one fortnight.
6. **Corporate anything:** "We're excited to announce", "Kind regards", "leverage", emoji spam, ALL-CAPS, fake urgency. Every line passes the frame-sticker test ("Yes it is Bamboo. Now fork off!").
7. **Raw auto-captions, Google-hosted fonts, black logo symbols, single-colour lockups, GOLD body text on cream, highlight colours on light backgrounds, hard-coded FOREST hex, invented palette colours.**
8. **Auto-publishing, Thursday scheduling, and any asset shipped without the §4 visual audit.**

---

*Implementation note: build the three cards as one HTML/CSS file with CSS variables for all tokens (`--forest` swap-ready), a `data-type` attribute switching the content-type pairing, and a `data-format` switch for 1080×1080 / 1080×1920. Render via headless screenshot at exact canvas size.*