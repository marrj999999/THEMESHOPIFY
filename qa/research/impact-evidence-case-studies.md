# Case studies as impact EVIDENCE — research + consolidation proposal (2026-07-22)

Commissioned by James: "we have multiple case studies sections — research best-practice layouts,
how to present as impact evidence, what to show and not show, how to make interactive, what we
have and need." Research-first per the Loop step-1.5; NO build until James picks.

## 1 · What best practice says (banked board + fresh research)

| Principle | Source | BBC translation |
|---|---|---|
| **Story + number + date + checkable source = evidence.** Story alone is marketing. | NPC good-impact-reporting; charity:water "Give water. Get proof." | Every case-study card carries one outcome line, a date, and a provenance chip that links out (Inside Time, BBC News, Investec…) |
| **Anchor against a baseline.** "71% into work vs 10% nationally" (Switchback) is the single strongest device in the justice sector | switchback.org.uk | We already hold this shape: 90%+ completion; 9pts (MoJ education evidence); 39% (MoJ family-contact research, never a BBC outcome) |
| **Precise beats rounded for assessors**; rounded is fine for shoppers | charity:water (209,241 projects) | Funder-facing bands use exact counts where they exist (OCN awards, cohort sizes); commerce keeps "4,000+" |
| **Depth beats volume.** One flagship story told properly per audience, not 20 shallow cards | Big Issue impact page; NPC | Build to Bond = the flagship. One deep card, satellites per audience |
| **Third-party voice outranks self-praise** | charity:water badge wall; Cowboy press wall | Investec's published rationale, Inside Time, Guardian, BBC News do the talking; our copy frames |
| **Web summary + dated PDF.** Skimmers read the page; grant officers need the artifact | Big Issue (BII Impact Report PDF) | The dated Impact-report PDF remains open blocker #7 |
| **Balance = credibility.** The best reports admit limits | NPC | Caveat lines stay ON the page ("MoJ research, not our outcome data"; "Urumuri's figure") — honesty is already the brand motif |
| **Ethical storytelling: dignity, consent, participants as narrators — never pity** | Lightful / Reliant Creative / Orangewood; charity:water consent protocol | Makers speak in their own words; first-name-or-role only; hands/detail imagery in prisons; adults full consent, minors need release |

## 2 · What to SHOW (all of it exists, verified)

- **The bulletproof five** (vault `Grants/Case Study Signposts.md` — survive an assessor's Google):
  Investec £24k (City AM + investec.com) · Inside Time Lowdham feature · BBC News Kate Strong ·
  Guardian 2012 "UK's first" · Musée du Luxembourg Paris 2024.
- **Measured outcomes**: 26% confidence uplift (measured) · 90%+ completion · OCN Level 2 · 3 Makers
  → peer instructors · cohort 6→8 growth · 6-week × 18hr structure · since late 2024 (never "March 2025").
- **Named-partner stories** per audience: Rwanda/Urumuri (24+4, their figure, attributed) · South Bank
  Engineering UTC (partner listing verifiable) · Soraya + Stuart Heritage/Guardian (wellbeing) ·
  Glenn NZ (RNZ radio) + Karl San Diego (global reach behind the 45) · Loafly e-cargo (Innovate-UK-grade R&D).
- Provenance chips + dates on every card; audience routing stays (the Bounce-Back segment band).

## 3 · What NOT to show (hard lines)

1. The ⛔ four: Core77 "Best of 2016" (was Bamboobee's) · Telegraph feature (unfindable) · GM Motors team build (no evidence; Corporate MOC: do not cite) · Luxembourg City History Museum (wrong museum).
2. Named/identifiable participant + named prison — never (prison name alone OK). No Maker names in any prison story.
3. Invented specifics from ⚠️ notes: "12 per cohort" · "seven bikes" (Hague) · "six students six bikes" (UTC) · "£70,000 equipment" (LSBU) · "March 2025 launch".
4. Banned stats (28k PSI / stronger-than-steel absolute / 56.7% / £11.41 / £280 / 100% / "36 countries").
5. Misattribution: Sally Allsopp's quote is NOT FT content — **was live on the page credited "in the Financial Times"; fixed 2026-07-22**, now attributed to her role only. "IKEA effect" line stays FT-only.
6. Funder £ amounts (James's rule: names/logos, no amounts — Investec's £24k appears only inside the linked third-party coverage, not our copy). No identifiable minors. No pity/deficit framing.
7. UTC post image is a prison photo — never reuse; imagery per card must be its own story's.

## 4 · Interactivity (fits the system, £0, reduced-motion safe)

| Pattern | Cost | Verdict |
|---|---|---|
| **Audience filter tabs** on one evidence wall (all / schools / prisons / community / global) | tiny JS or CSS :target | ✅ core proposal |
| **Expandable proof cards** — outcome row visible, `<details>` opens the fuller account + caveat + source | native, accessible | ✅ core proposal |
| **Video-in-card** via existing bbc-media + lightbox (Kenya card already wired this way) | built | ✅ reuse |
| Checkable-source links out with `?ref=impact-evidence` | none | ✅ (the charity:water "proof" move) |
| Map-linked stories (click a country → its story) | medium JS on the built map | Phase-2 nice-to-have |
| Podcast/audio (Switchback "Flip the Script") | new medium | ❌ not now |
| Carousels/auto-sliders for evidence | — | ❌ evidence shouldn't move; the quote reel stays the only marquee |

## 5 · Have vs need

**HAVE:** 168-note verified archive (56 ✅ grant-valid, mapped per audience with caveats) · bulletproof five ·
25 Story Bank builder stories (colour, ≤2 at a time per its own rule) · measured outcome set · verified
press quote bank · components: rd-cscard (+video variant), segment cards, quote reel, bbc-media,
video-lightbox, world map · watch-data (build-process content outperforms story 8:2 — keep evidence tight, lead with craft footage where video exists).

**NEED (small):** OCN award *counts* + exact titles (James, long-owed) · consent re-check on each card
image · the dated Impact-report PDF (blocker #7) · James's pick of 6–8 wall cards from the ✅ set ·
(later) GA4 to see what evidence visitors actually open.

## 6 · Proposal — one evidence system, three layers (awaiting James)

The page currently has three overlapping story layers (flagship B2B card · 3-card "real projects" grid ·
quote reel) plus segments. Consolidate meaning, not bands:

- **A · The proof (flagship):** keep the Build to Bond deep card; add an outcome row
  (6-week × 18hr · OCN L2 · 26% measured confidence uplift · 3 peer instructors · since late 2024)
  + provenance chips → FT original, Inside Time, Investec.
- **B · The evidence wall:** upgrade the 3-card grid to 6–8 filterable proof cards from §2
  (tabs: all/schools/prisons/community/global; each = kind chip · one outcome line · verified quote ·
  date · source link · optional video). Replaces "showcase" cards with evidence cards.
- **C · Texture stays:** quote reel (voices) and segment band (routing) unchanged — they are not
  evidence and stop pretending to be.
- TB/Education pages keep their own casestudy blocks but draw ONLY from the ✅ set.
- Nothing new to build component-wise: it's rd-cscard + a filter row + details element.

**Open for James:** which 6–8 cards; OCN counts; PDF commissioning; approve the filter-tab interaction.

Sources: thinknpc.org (good impact reporting, user-voice) · switchback.org.uk · charitywater.org ·
bigissue.com impact + BII report PDF · lightful.com / reliantcreative.org / orangewoodfoundation.org
(ethical storytelling) · vault: Grants/Case Study Signposts.md · Business/Case Studies/Verified 2026 ·
Marketing/Story Bank · qa/DESIGN-RESEARCH.md lanes 2–3.
