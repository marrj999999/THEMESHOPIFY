# PATHWAYS-SPEC — "one mission, two pathways" band (Impact page)
*Research + build-ready spec, 2026-07-12. Replaces the "one craft, two arms" twin-card band in `sections/bbc-impact-2026.liquid` (lines 91–123). Companion to DESIGN-BRIEF.md / DESIGN-RESEARCH.md / BLOCK-SYSTEM.md. Verified against the draft theme 196820238710 preview (band renders as two identical bone `.rd-stamp` cards, both lime-tagged, 446px each).*

---

## 1 · Sceptical stakeholder review — what fails today

Reviewed as a funder/commissioner landing cold on /pages/impact (draft preview, 2026-07-12):

1. **Twin cards read as one thing said twice.** Both cards: same bone background `rgb(230,220,200)`, same 5px ink stamp-shadow, same lime tag, same h3 scale, same vertical numbered flow. The *only* differentiator is the copy. James's point exactly: prevention (early) and rehabilitation (further on) are different moments in one life — the layout says "two equal brochure panels".
2. **No shared origin point.** The mission sentence ("we set up bike-building workshops…") floats above as an h2, then the two cards just… start. Nothing *connects* the mission to the two programmes. The `.rd-arms__spine` element exists in the markup but is `display:none` — the connective tissue was designed and then switched off.
3. **No convergence.** The locked mission ends "…and a way forward." Neither card lands anywhere. A commissioner is left with two open-ended lists instead of one story: *one mission → two routes → the same destination*.
4. **Tags read as internal labels, not pathway brands.** "1. Prevention — Make Engineers" is org-chart language. "Make Engineers" and "Build to Bond" are real, nameable programmes — they should be branded as named pathways (display type), with the segmentation ("in schools / in prisons", "before / after") carried by structure, not crammed into one tag.
5. **The numbered flows are good but siloed.** The `.rd-flow` lime-node steps (deployed retrofit) are the strongest element — but each flow starts at "1" inside its own card with no shared node "0" (the mission) and no shared final node ("a way forward"). The steps also skip the OCN wording standard (arm 2 says "OCN accreditation", should be "OCN Level 2 accredited").
6. **Stranger test half-passed.** The h2 now carries the explain-to-a-stranger sentence (good — keep verbatim), but the card headers ("Before exclusion" / "After the system missed them") assume you already know the settings are *schools* and *prisons*. The words "school" and "prison" must appear at the top of each pathway, not buried in body copy.
7. **No CTA per pathway.** A school lead and a prison commissioner are different buyers standing in front of the same band; neither has a door to walk through. (Brief: CTAs repoint to Impact anchors / relevant pages.)

---

## 2 · Research — patterns worth stealing

### Sector references

| Ref | URL | What it does that BBC should steal |
|---|---|---|
| **Switchback** (prison-leavers charity, London) | switchback.org.uk/what-we-do/ | The gold standard for this exact problem: a **linear staged journey** — "In Prison → In Training → In Work" — three labelled stages with plain-language descriptions and a duration per stage ("last three months inside"), then **stats attached to the journey** (91% don't reoffend vs 45% nationally). Steal: stages as a connected spine with time-anchored labels; per-stage plain language; outcome stated at the end of the track, not floating. |
| **charity: water** | charitywater.org/about | Mission as a **mechanism, not a mood** — "100% of public donations fund water projects; philanthropists cover our costs" — plus a proof promise ("we prove every project — GPS + photos"). Steal: the pathway band should end with a mechanism/proof line, and precise claims only. Notably: even c:w uses *no fancy diagram* — one sentence + trust signals. The diagram must stay dumb-simple. |
| **Big Issue Changing Lives** | bigissue.com/supportservices/ | The product-as-mechanism loop stated in **earnings-shaped numbers** ("109,000 vendors, £158m earned since 1991") and an end-to-end vendor pathway (set up to sell → earn → signposted → training and employment). Steal: pathway steps phrased as things the *participant* does/gains, not services BBC provides. |
| **Tony's Chocolonely** | us.tonyschocolonely.com | (From DESIGN-RESEARCH lane 2.) Mission interrupt placed *inside* the flow, never a silo. Confirms: this band must not become an academic diagram island — it's one scroll-stop with a story shape. |
| **NPC theory-of-change guidance** | thinknpc.org/resource-hub/ten-steps/ | "If your ToC diagram needs A3 paper and a magnifying glass, it is too complex… aim for a one-page visual." Sector-standard advice: **one origin, few arrows, one outcome**. Validates the fork-with-convergence over anything richer. |
| **DESIGN-RESEARCH lane 3 synthesis** | (in-repo) | "Neither charity:water nor Big Issue draws an academic ToC diagram; both compress to a 3-step flow with the product as connector… three nodes, one connecting line, lime accent on the middle node, footnoted with the locked mission sentence." This band is that pattern, forked into two. |

### CSS technique references (all £0, Dawn-safe, no JS)

| Technique | Ref | Use here |
|---|---|---|
| Vertical timeline via `::before` line + `border-radius:50%` node markers, counters for numbering | freefrontend.com/css-timelines/ · visusllc.com/blog/building-a-multi-step-timeline-with-pure-css--a-creative-frontend-solution | Already shipped in `.bbc-rd-impact .rd-flow` (numbered lime nodes on a spine). Reuse untouched; add dark-surface overrides only. |
| Two-column timeline with a central guiding bar | alvarotrigo.com/blog/html-css-timelines/ · uicookies.com/css-timeline/ | Basis for the desktop fork: absolutely-positioned pseudo-element stems/bar in a fixed-height connector row — no SVG, no images. |
| Colour-coding two tracks on one system | (tube-map convention; NPC "one page" rule) | One origin colour (forest), two track accents (lime = schools, steel = prisons), one convergence accent (lime). Never more. |
| Scroll reveal | in-repo `.rd-reveal` (bbc-statement.css, scroll-driven, reduced-motion-safe) | Add to each pathway card; zero new code. |

**What was searched and rejected:** generic "choose your path" hero splits (two full-bleed halves — kills the shared-mission story); alternating left/right single timelines (implies sequence between the two programmes — they're parallel, not sequential); interactive tabs (hides one pathway — a funder must see both at once; also tabs are the pattern the block-caching gotcha punishes).

---

## 3 · Recommended layout — THE WINNER: "fork and converge"

One mission node branches into two visually distinct, colour-coded pathway panels that re-converge on a single outcome strip. The story reads top-to-bottom on every viewport: **one mission → two settings → same destination.**

The differentiation is *meaningful, not decorative*: schools/prevention = **light panel** (paper, lime track — before, early, daylight); prisons/rehabilitation = **dark panel** (forest, steel track — after, inside, sober — per the brief's "mission beats: forest-led, more sober"). The convergence strip is the band's single lime moment.

### Desktop wireframe (≥760px)

```
┌─ paper band (.rd-pad .rd-paper) ──────────────────────────────────────────┐
│ what we do                                    ← eyebrow (lowercase)       │
│ we set up bike-building workshops that                                    │
│ deliver STEM education around the world.      ← h2, statement scale      │
│                                                 (KEEP VERBATIM)           │
│                                                                            │
│                            (✱)                ← forest node, lime ✱       │
│                             │                   "one mission,             │
│              ┌──────────────┴──────────────┐    two pathways" label       │
│              │ (lime dot)        (steel dot)│  ← fork: forest lines,      │
│              │                              │    track-coloured terminals │
│  ┌───────────▼────────────┐   ┌────────────▼───────────┐                 │
│  │ in schools · before     │   │ in prisons · after      │ ← track chips  │
│  │ exclusion   [LIME chip] │   │             [STEEL chip]│                │
│  │                         │   │                         │                │
│  │ make engineers          │   │ build to bond           │ ← pathway name,│
│  │ (display lowercase)     │   │ (display lowercase)     │   h3 big       │
│  │ who it's for — 1 line   │   │ who it's for — 1 line   │                │
│  │                         │   │                         │                │
│  │ ① taster session        │   │ ① join the workshop     │ ← .rd-flow     │
│  │ ② short course, real    │   │ ② OCN Level 2 accredited│   (reused;     │
│  │   build                 │   │ ③ build a bike for      │   steel nodes  │
│  │ ③ OCN Level 1 accredited│   │   your child            │   on dark)     │
│  │ ④ warm hand-off to      │   │ ④ become a peer         │                │
│  │   college or training   │   │   instructor            │                │
│  │                         │   │ ⑤ link to work on       │                │
│  │ bring it to your        │   │   release               │                │
│  │ school →                │   │ commission a            │ ← per-pathway  │
│  │                         │   │ programme →             │   CTA links    │
│  │ PAPER bg · lime-700     │   │ FOREST bg · forest-700  │                │
│  │ stamp shadow            │   │ stamp shadow · bone text│                │
│  └───────────┬─────────────┘   └────────────┬────────────┘                │
│              └──────────────┬───────────────┘                             │
│  ┌──────────────────────────▼──────────────────────────┐                 │
│  │ both pathways end in the same place ✱ a way forward. │ ← LIME strip,   │
│  └──────────────────────────────────────────────────────┘   forest text   │
│  ✱ the same hands-on engineering course in both settings —               │
│    built around a bike the maker keeps.       ← footnote, in-band        │
└────────────────────────────────────────────────────────────────────────────┘
```

### Mobile wireframe (375px-first, ≤759px)

```
┌────────────────────────────┐
│ what we do                 │
│ we set up bike-building    │   Fork geometry disappears; the story
│ workshops that deliver     │   becomes ONE continuous left rail:
│ STEM education around      │   mission node → pathway A card →
│ the world.                 │   pathway B card → converge strip,
│                            │   all connected by a 3px forest stem
│ (✱) one mission,           │   down the left edge (the same spine
│  │  two pathways           │   grammar as .rd-flow).
│  │                         │
│ ┌┴─────────────────────┐   │
│ │ in schools · before   │   │   Cards full-width, stacked in
│ │ make engineers        │   │   life-order (before → after).
│ │ …steps ①–④…           │   │   Track colour = chip + node fills
│ │ bring it to your      │   │   (colour is never the only cue:
│ │ school →              │   │   chips carry the words).
│ └┬─────────────────────┘   │
│  │                         │
│ ┌┴─────────────────────┐   │
│ │ in prisons · after    │   │
│ │ build to bond (dark)  │   │
│ │ …steps ①–⑤…           │   │
│ │ commission a          │   │
│ │ programme →           │   │
│ └┬─────────────────────┘   │
│ ┌┴─────────────────────┐   │
│ │ both pathways end in  │   │
│ │ the same place ✱      │   │
│ │ a way forward. (lime) │   │
│ └──────────────────────┘   │
│ ✱ footnote                 │
└────────────────────────────┘
```

---

## 4 · Colour / track assignments — tokens only

| Element | Token | Notes |
|---|---|---|
| Band surface | `.rd-paper` (existing) | Unchanged. |
| Mission node ✱ | circle `var(--forest)`, glyph `var(--lime)` | The asterisk-honesty motif IS the origin node. |
| Fork lines | `var(--forest)` at 3px | One connective colour; tracks identified at the terminals + chips, because lime/steel 3px lines fail contrast on paper. |
| Fork terminal dots | A: `var(--lime)` · B: `var(--steel,#DEE6F0)`, both with 2px `var(--ink)` border | Track colour introduced at the moment of divergence. |
| Pathway A card | bg `var(--paper,#F1E9D8)`, border `2.5px var(--ink)`, shadow `5px 5px 0 var(--lime-700)` | Reuses the existing `.rd-stamp.rd-lime` shadow convention (bbc-redesign-2026.css:121). Paper-on-bone = subtle lift; the lime shadow is the track signature. |
| Pathway A chip | bg `var(--lime)`, text `var(--forest)`, border `var(--ink)` | Existing `.rd-tag.rd-lime` pair — AAA (forest on lime ≈ 9.9:1). |
| Pathway A flow nodes | existing `.rd-flow__step::before` (lime fill, forest border/number) | Zero changes. |
| Pathway B card | bg `var(--forest)`, text `var(--bone)`, border `2.5px var(--forest-700)`, shadow `5px 5px 0 var(--forest-700)` | The sober dark panel. Bone on forest ≈ 10.9:1 AAA. |
| Pathway B chip | bg `var(--steel,#DEE6F0)`, text `var(--ink)` | Steel promoted per brief ("stand-out boxes"). Ink on steel ≈ 12:1 AAA. `var(--steel,#DEE6F0)` follows the existing fallback pattern (bbc-statement.css:357) — **no new hex**. |
| Pathway B flow nodes | fill `var(--steel,#DEE6F0)`, number `var(--ink)`, border `var(--bone)`; spine stem `var(--bone)` @ .35 opacity | Dark-surface override of `.rd-flow`. |
| Pathway B body text | `#cfe0d7` | The established forest-surface body pair (bbc-statement.css:65). Not a new hex. |
| Converge strip | bg `var(--lime)`, text `var(--forest)`, border `2.5px var(--ink)` | The band's ONE lime surface moment (brief: lime ration relaxed but never two limes adjacent — next band is `rd-dark` forest ✓; chip-lime inside card A is a component accent, separated by the paper gutter ✓). |
| Footnote | `#3a443f` on paper | Existing `.bbcst-note` pair. |
| CTAs | text-link style: A `var(--forest)` underline; B `var(--bone)` with `var(--lime)` underline | Existing `.bbcpl-cta` grammar, both surfaces already solved. |

**No gold anywhere in this band** (gold-near-lime ban). **No new hex values** — every colour above is an existing token or an already-committed pair.

---

## 5 · Copy skeleton (all editable via section settings)

Every line maps to a schema setting; defaults below. Lowercase display per brief; proper nouns (OCN, SEND, PRU) keep case.

| Setting | Default copy |
|---|---|
| `arms_eyebrow` (keep) | `what we do` |
| `arms_title` (keep, VERBATIM — the stranger-test sentence) | `we set up bike-building workshops that deliver STEM education around the world.` |
| `fork_label` (new) | `one mission, two pathways` |
| **Pathway 1** | |
| `arm1_chip` (rename of arm1_tag) | `in schools · before exclusion` |
| `arm1_name` (new — display name) | `make engineers` |
| `arm1_who` (new) | `for SEND, PRU and at-risk young people being pushed out of the classroom — often their first positive encounter with engineering.` |
| `arm1_flow` (keep, retune) | `taster session \| short course, real build \| OCN Level 1 accredited \| warm hand-off to college or training` |
| `arm1_cta_label` / `arm1_cta_url` (new) | `bring it to your school →` / `/pages/schools` |
| **Pathway 2** | |
| `arm2_chip` | `in prisons · after` |
| `arm2_name` (new) | `build to bond` |
| `arm2_who` (new) | `for people inside prison rebuilding skills, family ties and a route to work on release.` |
| `arm2_flow` (keep, retune) | `join the workshop course \| OCN Level 2 accredited \| build a bike for your child \| become a peer instructor \| link to work on release` |
| `arm2_cta_label` / `arm2_cta_url` (new) | `commission a programme →` / `/pages/contact-us` |
| **Convergence** | |
| `converge_title` (new) | `both pathways end in the same place ✱ a way forward.` |
| `converge_note` (repurpose arms_tagline) | `✱ the same hands-on engineering course in both settings — built around a bike the maker keeps.` |

Claim-lint check on defaults: no banned figures (no 28,000 PSI / 56.7% / £11.41 / £280 / 100% / "36 countries"); OCN wording is the exact "OCN Level 1 accredited" / "OCN Level 2 accredited" placeholders, never mushed; Build to Bond carries no start-year claim; no participant+prison linkage. Run `scripts/claim-lint.sh` before push regardless.

**Body settings `arm1_body`/`arm2_body`:** retire from the layout (the who-line + steps replace them). Keep the settings in the schema for backwards compatibility but stop rendering — or render as an optional second paragraph under `_who` if James wants the longer copy back.

---

## 6 · CSS — add to `assets/bbc-statement.css`, scoped `.bbc-rd-impact`

Appends below the existing "IMPACT PAGE RETROFIT" block. Reuses `.rd-flow` (numbered lime nodes) untouched; adds only fork, panels, dark-flow overrides, converge. Tokens only.

```css
/* ============================================================
   PATHWAYS BAND — fork & converge (2026-07-12 spec)
   One mission node → two colour-coded pathway panels
   (schools = light/lime · prisons = dark/steel) → one
   lime convergence strip. Reuses .rd-flow numbered nodes.
   ============================================================ */
/* fork connector (desktop) — pure CSS, aria-hidden in markup */
.bbc-rd-impact .rd-fork{ position:relative; height:96px; margin-top:clamp(20px,3vw,36px); }
.bbc-rd-impact .rd-fork__node{
  position:absolute; left:50%; top:0; transform:translateX(-50%);
  width:44px; height:44px; border-radius:50%; background:var(--forest,#003C32);
  color:var(--lime,#D4FD62); display:grid; place-items:center;
  font-size:26px; font-weight:800; line-height:1; z-index:1;
}
.bbc-rd-impact .rd-fork__label{
  position:absolute; left:calc(50% + 34px); top:10px;
  font-size:14px; font-weight:800; letter-spacing:.04em;
  text-transform:lowercase; color:var(--forest,#003C32); white-space:nowrap;
}
.bbc-rd-impact .rd-fork::before{ /* stem down from node */
  content:""; position:absolute; left:50%; top:44px; height:18px; width:3px;
  background:var(--forest,#003C32); transform:translateX(-50%);
}
.bbc-rd-impact .rd-fork::after{ /* horizontal split bar */
  content:""; position:absolute; top:62px; left:25%; right:25%; height:3px;
  background:var(--forest,#003C32);
}
.bbc-rd-impact .rd-fork__drop{ position:absolute; top:62px; width:3px; height:34px; background:var(--forest,#003C32); }
.bbc-rd-impact .rd-fork__drop.is-a{ left:calc(25% - 1.5px); }
.bbc-rd-impact .rd-fork__drop.is-b{ right:calc(25% - 1.5px); }
.bbc-rd-impact .rd-fork__drop::after{ /* track-coloured terminal dot */
  content:""; position:absolute; left:50%; bottom:-7px; transform:translateX(-50%);
  width:14px; height:14px; border-radius:50%; border:2px solid var(--ink,#0E1A17);
}
.bbc-rd-impact .rd-fork__drop.is-a::after{ background:var(--lime,#D4FD62); }
.bbc-rd-impact .rd-fork__drop.is-b::after{ background:var(--steel,#DEE6F0); }

/* pathway panels (replace the twin .rd-card.rd-stamp) */
.bbc-rd-impact .rd-paths{ display:grid; grid-template-columns:1fr 1fr; gap:clamp(20px,3vw,36px); align-items:stretch; }
.bbc-rd-impact .rd-path{
  border:2.5px solid var(--ink,#0E1A17); border-radius:6px;
  padding:clamp(24px,3vw,38px); display:flex; flex-direction:column;
}
.bbc-rd-impact .rd-path--schools{ background:var(--paper,#F1E9D8); box-shadow:5px 5px 0 var(--lime-700,#9BC02E); }
.bbc-rd-impact .rd-path--prisons{ background:var(--forest,#003C32); border-color:var(--forest-700,#002A23); box-shadow:5px 5px 0 var(--forest-700,#002A23); }
/* track chip */
.bbc-rd-impact .rd-path__chip{
  align-self:flex-start; font-size:13px; font-weight:800; letter-spacing:.06em;
  text-transform:lowercase; padding:6px 14px; border-radius:999px;
  border:1.5px solid var(--ink,#0E1A17);
  background:var(--lime,#D4FD62); color:var(--forest,#003C32);
}
.bbc-rd-impact .rd-path--prisons .rd-path__chip{ background:var(--steel,#DEE6F0); color:var(--ink,#0E1A17); border-color:var(--steel,#DEE6F0); }
/* pathway name — small display moment, lowercase, left */
.bbc-rd-impact .rd-path__name{
  font-size:clamp(2rem,3.4vw,2.9rem); line-height:.97; letter-spacing:-.02em;
  font-weight:800; text-transform:lowercase; margin:16px 0 0; color:var(--ink,#0E1A17);
}
.bbc-rd-impact .rd-path--prisons .rd-path__name{ color:var(--bone,#E6DCC8); }
.bbc-rd-impact .rd-path__who{ font-size:16px; line-height:1.55; margin:10px 0 0; max-width:34em; color:#3a443f; }
.bbc-rd-impact .rd-path--prisons .rd-path__who{ color:#cfe0d7; }
/* dark-surface overrides for the reused .rd-flow numbered nodes */
.bbc-rd-impact .rd-path--prisons .rd-flow__step{ color:var(--bone,#E6DCC8); }
.bbc-rd-impact .rd-path--prisons .rd-flow__step::before{
  background:var(--steel,#DEE6F0); color:var(--ink,#0E1A17); border-color:var(--bone,#E6DCC8);
}
.bbc-rd-impact .rd-path--prisons .rd-flow__step::after{ background:var(--bone,#E6DCC8); opacity:.35; }
/* per-pathway CTA (bottom-pinned, matches .bbcpl-cta grammar) */
.bbc-rd-impact .rd-path__cta{
  margin-top:auto; padding-top:22px; align-self:flex-start;
  font-size:15px; font-weight:700; text-decoration:none;
  color:var(--forest,#003C32); border-bottom:2px solid var(--forest,#003C32); padding-bottom:2px;
}
.bbc-rd-impact a.rd-path__cta:not(#_){ color:var(--forest,#003C32); } /* beat the global inherit rule */
.bbc-rd-impact .rd-path--prisons .rd-path__cta,
.bbc-rd-impact .rd-path--prisons a.rd-path__cta:not(#_){ color:var(--bone,#E6DCC8); border-bottom-color:var(--lime,#D4FD62); }
.bbc-rd-impact .rd-path__cta:hover{ opacity:.65; }

/* convergence strip — the band's single lime surface */
.bbc-rd-impact .rd-converge{
  margin-top:clamp(24px,3vw,40px); background:var(--lime,#D4FD62);
  border:2.5px solid var(--ink,#0E1A17); border-radius:6px;
  box-shadow:5px 5px 0 var(--ink,#0E1A17);
  padding:clamp(20px,2.6vw,30px) clamp(22px,3vw,38px);
}
.bbc-rd-impact .rd-converge__title{
  font-size:clamp(1.5rem,2.8vw,2.2rem); line-height:1.05; letter-spacing:-.02em;
  font-weight:800; text-transform:lowercase; margin:0; color:var(--forest,#003C32);
}
.bbc-rd-impact .rd-converge__title .bbcst-star{ color:var(--forest,#003C32); }
.bbc-rd-impact .rd-converge__note{ font-size:14px; line-height:1.6; margin:14px 0 0; color:#3a443f; max-width:66ch; }

/* mobile: fork geometry collapses to one continuous left rail */
@media (max-width:759px){
  .bbc-rd-impact .rd-paths{ grid-template-columns:1fr; gap:0; }
  .bbc-rd-impact .rd-fork{ height:auto; padding:6px 0 22px 0; }
  .bbc-rd-impact .rd-fork::before{ left:21px; top:44px; bottom:0; height:auto; transform:none; }
  .bbc-rd-impact .rd-fork::after,
  .bbc-rd-impact .rd-fork__drop{ display:none; }
  .bbc-rd-impact .rd-fork__node{ left:0; transform:none; }
  .bbc-rd-impact .rd-fork__label{ left:60px; top:12px; white-space:normal; }
  .bbc-rd-impact .rd-path{ position:relative; margin-left:14px; }
  .bbc-rd-impact .rd-path + .rd-path{ margin-top:0; }
  /* rail segment between stacked cards */
  .bbc-rd-impact .rd-path::before{
    content:""; position:absolute; left:5px; top:-24px; height:24px; width:3px;
    background:var(--forest,#003C32); transform:translateX(-100%);
  }
  .bbc-rd-impact .rd-path--prisons{ margin-top:24px; }
  .bbc-rd-impact .rd-converge{ margin-left:14px; position:relative; }
  .bbc-rd-impact .rd-converge::before{
    content:""; position:absolute; left:5px; top:-24px; height:24px; width:3px;
    background:var(--forest,#003C32); transform:translateX(-100%);
  }
  .bbc-rd-impact .rd-converge{ margin-top:24px; }
}
```

Also **delete** the section-inline `.rd-arms` patch `<style>` block in `bbc-impact-2026.liquid` (lines 25–29) when the new markup lands — Gate-1 rule: no new inline section CSS; the old rules become dead.

---

## 7 · Liquid markup sketch (replaces lines 99–120 of `sections/bbc-impact-2026.liquid`)

```liquid
<div class="rd-fork" aria-hidden="true">
  <span class="rd-fork__node">&#10033;</span>
  <span class="rd-fork__label">{{ section.settings.fork_label }}</span>
  <span class="rd-fork__drop is-a"></span>
  <span class="rd-fork__drop is-b"></span>
</div>
<div class="rd-paths">
  <div class="rd-path rd-path--schools rd-reveal">
    <span class="rd-path__chip">{{ section.settings.arm1_chip }}</span>
    <h3 class="rd-path__name">{{ section.settings.arm1_name }}</h3>
    <p class="rd-path__who">{{ section.settings.arm1_who }}</p>
    {%- assign a1 = section.settings.arm1_flow | split: '|' -%}
    <div class="rd-flow">{%- for st in a1 -%}<span class="rd-flow__step">{{ st | strip }}</span>{%- endfor -%}</div>
    {%- if section.settings.arm1_cta_label != blank -%}
      <a class="rd-path__cta" href="{{ section.settings.arm1_cta_url | default: '/pages/schools' }}">{{ section.settings.arm1_cta_label }}</a>
    {%- endif -%}
  </div>
  <div class="rd-path rd-path--prisons rd-reveal">
    <span class="rd-path__chip">{{ section.settings.arm2_chip }}</span>
    <h3 class="rd-path__name">{{ section.settings.arm2_name }}</h3>
    <p class="rd-path__who">{{ section.settings.arm2_who }}</p>
    {%- assign a2 = section.settings.arm2_flow | split: '|' -%}
    <div class="rd-flow">{%- for st in a2 -%}<span class="rd-flow__step">{{ st | strip }}</span>{%- endfor -%}</div>
    {%- if section.settings.arm2_cta_label != blank -%}
      <a class="rd-path__cta" href="{{ section.settings.arm2_cta_url | default: '/pages/contact-us' }}">{{ section.settings.arm2_cta_label }}</a>
    {%- endif -%}
  </div>
</div>
{%- if section.settings.converge_title != blank -%}
<div class="rd-converge rd-reveal">
  <p class="rd-converge__title">{{ section.settings.converge_title }}</p>
  {%- if section.settings.converge_note != blank -%}<p class="rd-converge__note">{{ section.settings.converge_note }}</p>{%- endif -%}
</div>
{%- endif -%}
```

Notes:
- The `.rd-flow__arrow` spans are dropped (the retrofit already `display:none`s them; the node spine does the connecting).
- Fork is `aria-hidden` decorative; reading order (mission h2 → pathway A → pathway B → convergence) tells the full story to screen readers without it. Chips carry the setting words, so colour is never the only differentiator (WCAG 1.4.1).
- Schema: add `fork_label`, `arm1_chip/arm1_name/arm1_who/arm1_cta_label/arm1_cta_url`, `arm2_*` equivalents, `converge_title`, `converge_note` as `text`/`textarea` settings with the §5 defaults. Keep `arm1_tag/arm1_title/arm1_body` etc. in the schema (unused) so existing template JSON doesn't error; the template must be updated via the pull-edit-put-readback workflow (draft theme **196820238710** only, `.shopifyignore` lift/restore, never MAIN).

---

## 8 · QA checklist for the build session

1. `scripts/claim-lint.sh` clean before push.
2. AAA spot-checks with `getComputedStyle()` on the preview: chip pairs, dark-card body `#cfe0d7`, converge forest-on-lime.
3. 375px CSS review (browser tooling can't render mobile — reason from the `@media (max-width:759px)` block; the rail must connect node → card A → card B → converge with no orphan stubs).
4. Screenshot preview before/after; visual diff the band.
5. Reduced-motion: `.rd-reveal` is already gated; the band must be fully legible with zero animation.
6. Adjacency: confirm the band's neighbours are still stats-dark above and policy-dark below — the lime converge strip sits inside the paper band, so no lime-adjacent-lime.
7. Editor pass: every string in §5 editable in the theme customiser; no hardcoded copy.
```
