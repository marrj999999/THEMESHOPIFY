---
title: Impact Page Benchmark 2026-09-02
type: report
tags: [type/report, workstream/website, topic/impact, claims, status/active]
created: 2026-09-02
updated: 2026-09-02
source: ten peer impact pages fetched live 2026-09-02 (Playwright + tavily) + Claims Register + Proof Bank + Q2 2026 figures
related: [[Workstreams/Shopify and Website]], [[Workstreams/Justice Pages & Impact Refocus 2026-08]], [[System/Claims Register]], [[Business/Proof Bank]], [[Reports/Q2 2026 Impact Report — Figures]]
---

# Impact Page Benchmark — 2026-09-02

James (2 Sep): *"research against 10 other impact pages and also check if we are missing any content that should be listed."*

Artifact (tables, scorecard): **Impact Page Benchmark** — https://claude.ai/code/artifact/8024de7c-3d69-44ab-a80b-8584d22854f3 (mirrored in the theme repo at `qa/research/impact-page-benchmark.html`).
Preview build with the additions: https://bamboobicycleclub.org/pages/impact?preview_theme_id=199089193334 — **not live**.

## The ten pages
| Org | Page | Leads with |
|---|---|---|
| Redemption Roasters | /pages/social-impact | "Live impact data, August 2026" — 6 stats, 2 with comparators (1.8% reoffending vs 38%; 87.5% 90-day retention vs 58%); report archive 2020–25; referral form |
| Switchback | /what-we-do | 60% "real lasting change"; 91% no reoffending in a year vs 45% national; 3-stage process; 10 pathways; theory of change; 4 awards |
| The Clink Charity | impact reports 2023/2025 + Justice Data Lab | JDL: 16% vs 25% comparison, "statistically significant"; Robin Corbett Award 2026 |
| Onward Lives (ex Recycling Lives) | /our-impact | £27.1m social value 2024/25; 132 into paid work; reoffending <7%; sponsorship menu investment→return |
| Key4Life | home | 8% reoffending vs >50%; SROI £13.46; 62% in work vs 17%; governor/corporate/patron quotes |
| Fine Cell Work | /pages/the-impact | one long participant story; links to annual report, theory of change, stitcher survey |
| The Bike Project | /impact | "Our Impact 2024/25": 91% cycling weekly; 210 t CO2; 1,732 bikes; what's next; past reports |
| Bikeworks | /our-impact | highlights each with a named independent evaluator (Dr Kay Inckle) + linked report; SE100 award |
| World Bicycle Relief | /the-impact | 3 outcome %s; 14.7× ROI; IDinsight RCT; "measuring our impact"; 2026 goals; where we work |
| Greenhouse Sports | /our-impact | 14 more school days; 77% wellbeing; 58% vs 38% behaviour; Independent Research Board (17 academics) |

Also read: Change Please (governance, 100% profits, award logos, charity+CIC numbers); Timpson Foundation (12% of 4,500 colleagues with convictions; 75% stay). Cycling UK and Sustrans impact URLs are dead.

## Scorecard (20 elements seen across the set)
Preview page now lists **17 of 20**. Live page listed 11.

**Missing on live, now on the preview (all Register/Proof Bank approved wording):**
1. **3,500+ bikes built** — output count (8/10 peers lead with one). Replaces the "2 OCN Level 2 courses" stat in the record; courses stay in the prisons strand.
2. **108 contact hours per Maker, per course** — dosage (4/10). On the hands-on-training station.
3. **13 prison staff trained as instructors in 2026, across three sites** — in the prisons strand lede ("we train the prison staff who run it"). Year-scoped by rule; re-count each year.
4. **Recognition row** (5/10 peers list awards; we listed none): Investec Beyond Business 2025 winner (1 of 4 from 148) · Kevin McCloud's Green Heroes, Grand Designs Live 2018 · Match: Design & Sport, Musée du Luxembourg 2024 · National Justice Museum, Working Through It, 2026.
5. **Identity line** (5/10): Bamboo Mobility Project CIC, not a registered charity · UKPRN 10098630 · two OCN London bespoke Level 2 courses · activity since 2012, CIC 2025 · workshops London, Amersfoort, Toulouse, Brighton. "Where the money goes" deliberately off (no executed profit-transfer policy filed).
6. **Link to /pages/theory-of-change** from the stations band (the page existed, linked from nowhere).

**Already ahead of the set:** dated figures; MoJ context with mandatory wording; "how we count" note (only WBR + Greenhouse have one); press strip; funders band; 37 filtered case studies (peers show 3–5 — consider 12 + "show all").

**Needs James before it goes on:**
- **"This quarter" strip** (Redemption device): Q2 2026 — 31 learners engaged · 9 staff & peer mentors trained · 44 undergraduates across two universities. Candidates flagged in [[Reports/Q2 2026 Impact Report — Figures]]; need a Register row + sign-off.
- **n + year on the 26% uplift** (4/10 peers give sample sizes).
- **OCN EQA visit Jan 2026** as an external check — Register boundary: "delivered Level 2 assessment quality", not Assured Status. James's call.
- **Cohort wording D2** ("cohorts of up to 8").

**Cannot list (and what unlocks it):**
| Peer device | Why not | Unlock |
|---|---|---|
| Reoffending vs national (6/10) | no BBC-measured outcome; MoJ 39% as ours is banned | **MoJ Justice Data Lab** application (free; The Clink's route). Needs participant identifiers, a treatment group of roughly 60, a data-sharing agreement with HMPPS/operators. Lowdham + Lindholme cohorts may reach it within a year |
| SROI / social value £ | £11.41 banned, no study | commissioned SROI with named author and method — only after the reoffending data exists |
| Post-release employment % | not tracked | follow-up agreement with operators; site-kept peer-instructor/employment log |
| Carbon / waste figure | 56.7% banned; no LCA | an LCA of one frame via UCL/Swansea |
| Named participant stories (7/10) | consent gate; no participant + named prison | consent artefact agreed with the operator; staff voice until then |
| Named prison list | count formula only | D1 + pipeline check at every change |

**Deliberately not re-added:** "what's next" targets (2/10 peers; Chris cut it in July).

## Observations
- Peers are short (Redemption ~3.5k chars vs ours ~15k); the evidence wall is the bulk.
- Comparators on every number is the biggest gap, and it is an evidence gap not a page gap — JDL is the affordable route.
- The Q2 report's tone ("the numbers are modest and we have not manufactured any") is the model; it is already the voice of the honesty note.
- Nobody in the set pairs a participant with a prison; our rule matches the field.

## Verification (preview)
Gate PASS (0 CSS literals, claim-lint clean) · read-back identical (section, CSS, template) · live-check: 0 banned claims, 0 contradictions · screenshots 1440 + 390 in `qa/evidence/2026-09-02`. Live theme untouched; live rollout = section + CSS + `templates/page.impact.json` after James's go.

## Log
- 2026-09-02 — benchmark run, six additions built on the preview, report written. Awaiting James: go-live, the four decisions above.
