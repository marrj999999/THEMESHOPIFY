# Anti-blocky layouts — breaking the box without breaking the system
*Research deliverable, 2026-07-12. Brief: James's verdict that the Impact page (and the whole FORMULA) reads "blocky and AI slop — every band is eyebrow → big lowercase heading → grid of bordered cards." This file diagnoses the exact repetition with measured evidence, gives a buildable device library, prescribes ONE device per band for the Impact page, and adds anti-blocky rules to FORMULA.md.*

*Evidence: live draft `196820238710` `/pages/impact`, headless Chrome (Puppeteer), DOM + computed-style extraction, band screenshots. Token/CSS facts read from `assets/bbc-redesign-2026.css`, `bbc-statement.css`, `bbc-layout.css`. Reference grounding: DESIGN-RESEARCH.md R1 board + web (Bloomberg Businessweek / Turley, Stripe Press, Balenciaga, Mammoth, Matheson, Readymag post-grid, charity:water, Big Issue).*

**Constraints honoured throughout:** every device is CSS-only (no JS libraries), uses the four existing surfaces + `--ink`/`--bone`/`--lime` (no new hex), keeps the one-left-axis for *text*, preserves AAA (devices move geometry, not contrast; decorative type is `aria-hidden`), keeps every block editable via schema, £0.

---

## 1 · Diagnosis — the repetition, measured

The page is **hero + 11 content bands**. I measured the opener, surface, and content primitive of each. The "AI slop" feeling is not vague — it is three motifs repeating on a fixed skeleton:

### 1a. The identical opener (10 of 11 bands)
Every content band opens with the **same three rows in the same order**: lime-dash eyebrow (14px, 700, `letter-spacing:.18em`, uppercase, top-left) → lowercase h2 (`clamp(43px,7vw,86px)`) → lede sentence. This is literally mandated by FORMULA §4 ("eyebrow → h2 → lede → content → CTA, every band, same order"). Measured eyebrows, top to bottom:

`the record since 2012` · `what we do` · `why now` · `inside the workshop` · `the follow-on` · `where we operate` · `every kind of impact` · `what's next` · `get involved` · `recognised by` · `join in`

11/11 bands carry this eyebrow chip; 11/11 use the identical vertical stack. **The reader's eye learns the template by band 3 and stops seeing individual bands** — the single biggest driver of the "slop" read.

### 1b. The repeating bordered box (5 bands, one shared signature)
The theme has ONE card recipe and reuses it everywhere: `border:2.5px solid var(--ink); border-radius:10px; box-shadow:5px 5px 0 var(--ink)` (`.rd-cscard`, `.rd-card.rd-stamp`, `bbc-redesign-2026.css:120,134`). The **same 5px hard-offset shadow is also on every button** (`.rd-btn.rd-lime`, `:53`). So the box motif is inescapable — cards and CTAs share it. Measured bordered-box count per band (computed `border-top-width ≥ 1`):

| Band | Content primitive | Bordered boxes |
|---|---|---|
| 1 what we do | 2 pathway cards + lime callout box | 3 |
| 5 where we operate | **2×2 grid** of boxes, lime number-badge in each top-right corner | 4 |
| 6 the evidence | **3-up grid** of image-top cards (chip → text → "read the story →") | 3 (+6 nested) |
| 8 get involved | **3-up grid** of chip-cards | 3 |
| 9 recognised by | steel callout box + report card + quote box | 7 |

Bands **5, 6, 8** are near-clones: eyebrow → lowercase h2 → lede → *grid of hard-shadow bordered cards*. Three bands with the identical shape is what "every band is a grid of bordered cards" means, measured.

### 1c. The repeating numeric badge
The lime circle-with-number appears as (a) corner badges on the where-we-operate boxes (`4`, `10`, `3`, `45`) and (b) numbered step-nodes in what's-next and inside the pathway cards. Same lime-disc motif, twice, reinforcing sameness.

### 1d. The dead right half (the axis taken too literally)
One-left-axis is correct for text, but bands 3, 5, 6 lock ALL content into the left ~55–60% and leave a **40–45% empty right column** on desktop (measured: contained `.rd-wrap` content ends ~x=790 of 1280). The emptiness reads as "unfinished template," not "editorial restraint," because nothing occupies it.

**Summary of the offence:** a fixed 3-row opener on 10/11 bands + one bordered-box recipe (shared with the buttons) reused in 5 bands + 3 near-clone card-grid bands + a dead right column. The bones are good (surface alternation dark/paper/steel is already working; the hero is genuinely strong). The fix is not new content — it is **breaking the opener monotony and retiring the single box recipe**, one device at a time.

---

## 2 · Device library — 12 ways to break the box, inside the system

Each device: what it is · a real site doing it · why it kills the template feel · how it lands in the BBC system (CSS sketch, existing tokens only) · mobile behaviour · editability. **Rule of use: one device per band, never two** (§4).

> Tokens available: `--ink #0E1A17` · `--bone #E6DCC8` · `--paper #F1E9D8` · `--forest` · `--lime` · `--steel` · `--charcoal` · `--rd-container 1200px` · surfaces `.rd-dark/.rd-paper/.rd-steel` · pads `.rd-pad 88px` / `.rd-pad-sm 64px` · `.rd-wrap` (max 1200, `padding:0 32px`).

### D1 · Full-bleed image (contained → edge-to-edge)
- **What:** the photo breaks out of `.rd-wrap` to touch both viewport edges; no border, no card, no shadow — the image *is* the band. Caption sits as a marginal line.
- **Reference:** Balenciaga (Bureau Borsche) and Matheson Food Co — hard-cropped full-bleed imagery, type kept on the flat band before/after, never fighting the photo.
- **Why it works:** there is no box to read. It also breaks the dead-right-column problem by refusing the axis entirely (allowed — the axis governs *text*).
- **CSS:** `.rd-bleed{ width:100vw; margin-left:calc(50% - 50vw); }` on the media div only; keep an `aspect-ratio` + `object-fit:cover`. Caption: `.rd-bleed__cap{ max-width:34em; padding:12px 32px; font-size:14px; color:var(--charcoal); }`.
- **Mobile:** already full-width; nothing to do (the `100vw` math is a no-op at ≤`--rd-wrap` padding).
- **Editable:** existing image block + a "full-bleed" checkbox in the block schema.

### D2 · Ghost numeral (the number as architecture)
- **What:** one giant verified figure — `2012`, `45`, `39%` — set at 18–28vw as a layout object in the dead right column or behind the heading, `aria-hidden`, decorative. Not a badge; a wall.
- **Reference:** Toggl (big type = big numbers), Bloomberg Businessweek/Turley (numerals as composition).
- **Why it works:** converts empty space into an anchor and makes the stat the architecture instead of a chip inside a box.
- **CSS:** `.rd-ghost{ position:absolute; right:0; top:0; font-size:clamp(9rem,26vw,22rem); line-height:.8; font-weight:800; letter-spacing:-.04em; color:var(--forest); opacity:.08; pointer-events:none; }` (`--lime` at low opacity on dark surfaces). Parent band `position:relative; overflow:clip`.
- **Mobile:** drop to `opacity:.06` behind the heading, or hide `≤600px` (`display:none`) — it's decorative, never load-bearing.
- **Editable:** the number is a block text field; `aria-hidden` so it never doubles a screen-reader stat.

### D3 · Marginalia rail (the eyebrow leaves the stack)
- **What:** the eyebrow, source citations and ✱ footnotes move OUT of the vertical stack into a narrow left (or right) margin column, print-style, aligned to the heading's first baseline.
- **Reference:** Stripe Press (press.stripe.com) and Tufte sidenotes — labels and notes live in the margin, not in the body flow.
- **Why it works:** directly attacks §1a — when the eyebrow is a *margin label* instead of row 1 of the stack, the band stops opening like every other band. It also makes the one-left-axis productive: the axis becomes a labelled rail.
- **CSS:** `.rd-rail{ display:grid; grid-template-columns:minmax(120px,1fr) minmax(0,3.4fr); gap:clamp(24px,4vw,72px); }` — eyebrow + source in column 1, heading + body in column 2. Column 1 items: `align-self:start; position:sticky; top:24px` (optional).
- **Mobile:** `grid-template-columns:1fr` — rail stacks above content (eyebrow returns to top, acceptably, on small screens only).
- **Editable:** pure layout wrapper; no content change. Section setting: `layout: rail`.

### D4 · Asymmetric split (7/3, 8/4 — never 50/50)
- **What:** a hard `7fr 3fr` split where the heading owns the wide column and stats/notes stack in the narrow rail, creating editorial tension instead of a centred row.
- **Reference:** magazine 7fr/3fr grids; Mammoth Brands (one display size over near-flat surface, off-centre).
- **Why it works:** imbalance reads as *designed*; the symmetric stat row reads as *template*.
- **CSS:** `.rd-split--73{ display:grid; grid-template-columns:7fr 3fr; gap:clamp(24px,4vw,64px); align-items:end; }` (reuse the existing `.rd-split` scaffolding; add the ratio variant).
- **Mobile:** `grid-template-columns:1fr`.
- **Editable:** ratio as a `select` (50/50 · 70/30 · 60/40) on the split block.

### D5 · Type crossing the boundary (one seam-stitch per page)
- **What:** the last element of band N — a heading or ghost numeral — laps down onto band N+1 across the surface-colour change, refusing the band edge. **Exactly one per page**, saved for a moment that matters (the finale).
- **Reference:** Bloomberg Businessweek/Turley grid-violation; classic brutalist "acknowledge the grid, then break it."
- **Why it works:** the strongest signal that bands are not sealed boxes — an element deliberately trespasses.
- **CSS:** on the crossing element: `position:relative; z-index:2; margin-bottom:calc(-0.28em);` or, to lap the next band, `transform:translateY(40px)` + `margin-bottom:-40px`. Next band needs `position:relative` and enough top pad to receive it.
- **Mobile:** halve the overlap (`translateY(18px)`), or drop to 0 — never let it collide with body text.
- **Editable:** a "bleed into next section" toggle on ONE block; gated by the §4 one-per-page rule.

### D6 · Borderless cards — ruled or bare (retire the box recipe)
- **What:** delete the `2.5px` border + `5px` hard shadow + radius. Separate items by a single hairline rule or pure whitespace — a newspaper column set, not a card grid. **This is the highest-leverage fix: it neutralises §1b across 3–5 bands at once.**
- **Reference:** Balenciaga's list-like nav; Stripe Press index pages — content floats on the surface, structure comes from rules and gaps.
- **Why it works:** removes the exact chrome (`box-shadow:5px 5px 0 var(--ink)`) that makes every card and button read as the same object.
- **CSS:** `.rd-cards--bare .rd-card{ background:transparent; border:0; border-radius:0; box-shadow:none; }` then structure via `.rd-cards--ruled .rd-card{ border-top:2px solid var(--ink); padding-top:20px; }` (the ✱-hairline) or just `gap:clamp(32px,5vw,72px)`.
- **Mobile:** stacks with top rules — reads as a clean list.
- **Editable:** card-style `select` on the section: `bordered · ruled · bare`. (Keep `bordered` available so the one allowed box band, §4, can still use it.)

### D7 · Staggered / offset grid (drop the second column)
- **What:** grid items sit at different vertical offsets — every 2nd (or 2nd+3rd) column pushed down 48–80px — so a 3-up row stops reading as one sealed block.
- **Reference:** Readymag "post-grid" thinking; editorial brick layouts.
- **Why it works:** vertical rhythm breaks the "three identical boxes in a rigid row" gestalt while keeping the grid's editability.
- **CSS:** `.rd-grid--stagger{ align-items:start; } .rd-grid--stagger > :nth-child(2){ margin-top:clamp(40px,6vw,80px); } .rd-grid--stagger > :nth-child(3){ margin-top:clamp(20px,3vw,40px); }`
- **Mobile:** offsets removed at single-column (`@media(max-width:760px){ …{ margin-top:0 } }`).
- **Editable:** automatic once the class is on; no content change.

### D8 · Index / directory list (list primitive, not box primitive)
- **What:** replace a card grid with a typeset directory row: name on the left, dotted leader, count/value on the right — a table of contents.
- **Reference:** charity:water pathways list; Stripe Press book index; Big Issue impact figures as an earnings line.
- **Why it works:** swaps the box primitive for a *list* primitive — the where-we-operate boxes (4 sites, 10 schools, 3 hubs, 45 countries) are literally a directory pretending to be cards.
- **CSS:** `.rd-index{ display:grid; } .rd-index__row{ display:grid; grid-template-columns:auto 1fr auto; align-items:baseline; gap:12px; padding:16px 0; border-bottom:1px solid var(--charcoal); } .rd-index__row::after` — leader via a middle `<span>` with `border-bottom:2px dotted`.
- **Mobile:** value wraps under name; keep the bottom rule.
- **Editable:** each row a block (name / value / link).

### D9 · Rotated seal (one handmade off-axis object)
- **What:** a single rotated circular or rectangular seal — `since 2012`, `OCN Level 2`, `CIC` — overlapping an image corner or heading at ~−5°. **One per page.**
- **Reference:** brutalist stamps; Who Gives A Crap's seal-of-approval devices; packaging.
- **Why it works:** one deliberately hand-placed, off-grid object reads as human, not generated. (Note: the theme's existing `.rd-stamp` class is *not* rotated — it's the hard-shadow box; this device is a new rotated seal, name it `.rd-seal` to avoid the collision.)
- **CSS:** `.rd-seal{ display:inline-grid; place-items:center; width:clamp(88px,12vw,132px); aspect-ratio:1; border:2.5px solid var(--ink); border-radius:999px; transform:rotate(-5deg); font-weight:800; text-transform:uppercase; letter-spacing:.06em; font-size:13px; text-align:center; background:var(--lime); color:var(--forest); }` positioned `absolute` over a corner.
- **Mobile:** keep, smaller (`clamp` handles it); ensure it doesn't cover a face in the photo.
- **Editable:** seal text + on/off toggle; capped at one by §4.

### D10 · Statement pull-quote (de-box the quote)
- **What:** a quote or mission line as the band's ONLY content, at near-heading scale, no border, no quote-box — big type on lime or forest with a hanging ✱ in the margin.
- **Reference:** Mammoth / Toggl conversational admissions set large; Bloomberg statement spreads.
- **Why it works:** the page already boxes its best line ("both pathways end in the same place ✱") and the Sally Allsopp quote. Removing the box turns a card into a moment.
- **CSS:** `.rd-statement{ font-size:clamp(28px,4.2vw,52px); line-height:1.08; font-weight:800; letter-spacing:-.02em; max-width:18ch; } .rd-statement .rd-star{ margin-left:-0.6em; }` (hang the ✱ into the margin). No border, no shadow.
- **Mobile:** scales via clamp; measure `≤18ch` keeps it a statement, not a paragraph.
- **Editable:** quote/attribution as blocks.

### D11 · Density alternation (pacing, not a class)
- **What:** deliberately alternate a content-dense band (grid/list of 3+ items) with a sparse breather (one image, or one sentence on a full surface). A rhythm rule enforced by the band map, using the existing `.rd-pad` / `.rd-pad-sm` and content volume.
- **Reference:** Stripe Press vertical pacing; Tony's mid-scroll mission interrupt (one sparse mission band between commercial bands).
- **Why it works:** when every band is equally busy, the page flattens; a breather resets the eye and makes the next dense band land.
- **CSS:** none new — governed by §4 rule 5 (no 3 consecutive dense bands) and choice of `.rd-pad-sm` for breathers.
- **Editable:** editorial sequencing in the template JSON.

### D12 · Overlapping layers (panel laps image)
- **What:** a text panel overlaps an image corner (z-index) rather than sitting beside it in a tidy split — planes stacked, not tiled.
- **Reference:** the 2025 asymmetric-layout trend (overlapping elements); Patagonia story cards inset into imagery.
- **Why it works:** replaces the side-by-side box pair with layered depth — no two-box row to read.
- **CSS:** `.rd-overlap{ position:relative; } .rd-overlap__panel{ position:relative; z-index:2; margin-top:clamp(-96px,-8vw,-48px); margin-left:clamp(0px,4vw,64px); max-width:40ch; background:var(--bone); padding:28px; }`
- **Mobile:** unstack — `margin-top:0; margin-left:0` at `≤760px` so it flows normally (this is the classic asymmetric-mobile failure; kill the overlap on small screens).
- **Editable:** layout variant on the media+text block.

---

## 3 · Per-band prescription — ONE device each, an alternating rhythm

Restraint is the credibility: **exactly one device per band, no two adjacent bands share a device, and no three dense bands run consecutively.** The hero already *is* the model (full-bleed photo + big lowercase type, left rag) — leave it. Assignment for the 11 content bands:

| # | Band (eyebrow) | Surface | Today's shape | **Device** | What changes | Rhythm |
|---|---|---|---|---|---|---|
| 0 | the record since 2012 | dark | 4-col stat strip | **D2 ghost numeral** | `2012` ghosted large behind the stat row; stats stay borderless | sparse |
| 1 | what we do | paper | 2 bordered pathway cards + lime box | **D6 borderless (hairline fork)** | drop card borders/shadows; schools-path vs prison-path split by one vertical ✱-hairline | dense |
| 2 | why now | dark | symmetric stat row | **D4 asymmetric 7/3** | heading owns 7fr; the 4 policy stats stack in a 3fr rail with hanging sources | medium |
| 3 | inside the workshop | paper | image + text, dead right half | **D1 full-bleed image** | workshop photo goes edge-to-edge; caption as a margin line; text below | bleed |
| 4 | the follow-on | dark | split + boxed quote | **D10 statement quote** | de-box the Sally Allsopp line; set large on forest, ✱ hanging | sparse |
| 5 | where we operate | paper | **2×2 bordered boxes + corner badges** | **D8 index/directory** | four boxes → a typeset directory (site · leader · count); retires the corner-badge boxes | medium |
| 6 | the evidence | paper | **3-up bordered image-cards** | **D7 staggered grid** | keep the 3 photos (needed) but offset col 2 down ~72px + drop border/shadow; chip overlaps image | dense |
| 7 | what's next | paper | 3 numbered nodes | **D3 marginalia rail** | the 1/2/3 become large margin figures; ambitions in the main column; eyebrow leaves the stack | sparse |
| 8 | get involved | steel | **3-up bordered chip-cards** | **D6 borderless (ruled)** | the 3 equal doors become 3 rule-separated columns, no boxes (FORMULA's allowed 3-CTA grid) | medium |
| 9 | recognised by | paper | steel box + report card + quote box | **D9 rotated seal** | credentials (OCN/CIC) become a small rotated-seal cluster; de-box the proof rows to ✱ lines | dense |
| 10 | join in | dark, centred | boxed final CTA | **D5 boundary-cross** | the closing heading laps up across the paper→forest seam — the one seam-stitch, saved for the finale | sparse |

**Adjacency check (no repeats touching):** D2·D6·D4·D1·D10·D8·D7·D3·D6·D9·D5 — D6 recurs at bands 1 and 8 but never adjacent; every neighbouring pair differs. **Density check:** sparse→dense→medium→bleed→sparse→medium→dense→sparse→medium→dense→sparse — no three dense in a row. **Box budget after this:** bordered-box bands drop from 5 to ~1 (band 8 could keep bordered if James prefers the doors boxed — that is the one allowed box band under §4 rule 2).

Note the two open CRIT axis defects (bands 4 "inside the workshop" desktop x=262, and 9 "get involved" desktop x=313, `CRIT-impact-today.md` defect 1) are *superseded* by this work where they overlap: band 3's D1 bleed and band 8's D6 ruled layout both re-lay those wrappers — fix the axis in the same edit rather than patching the old `.rd-mw-820px` centring first.

---

## 4 · Rules to add to FORMULA.md (new §8 — anti-blocky grammar)

So every future page inherits the grammar, not just Impact. All are gate-checkable.

**§8 · Anti-blocky grammar (blocking at Gate 1)**

1. **One device per band, never two.** A band gets exactly one break-the-box device from the library (D1–D12). Stacking a bleed image + a stagger + a seal in one band is the *other* failure mode (chaos) — equally rejected. Restraint is the credibility.
2. **No two adjacent bands share a layout shape.** Shape = the content primitive (card-grid · index-list · asymmetric-split · statement · image-bleed · stat-row · marginalia-rail). Maintain a per-page device map; the adjacency check is a gate.
3. **One bordered-card band per page, maximum.** The `border:2.5px + box-shadow:5px 5px 0 var(--ink)` recipe may appear in **at most one** band. Every other multi-item band uses bare/ruled cards (D6), an index list (D8), or a staggered grid (D7). Page-wide bordered-box count ≤ 6.
4. **The eyebrow may not open every band.** At least **2 bands per page** relocate the eyebrow to a marginalia rail (D3) or drop it (the heading carries). **No more than 3 consecutive bands** may use the top-left `eyebrow → h2 → lede` opener.
5. **At least one containment break per page.** One or more bands must break the frame: full-bleed image (D1), type crossing a boundary (D5), or a ghost numeral in the margin (D2). But **exactly one** boundary-cross (D5) per page — it's the rare move.
6. **No dead right column.** If the one-left-axis leaves >40% of a *contained* band empty on desktop, that space must carry a device (ghost numeral, marginalia, offset image) or the band goes full-bleed. Dead space is a defect, not "the axis working." (The axis governs **text**; images and ghost numerals may leave it.)
7. **Density alternation.** No 3 consecutive dense bands (dense = a grid/list of 3+ items). Insert a sparse breather — one statement or one image — between dense runs.

**Unchanged and still in force:** the one-left-axis for text, the type-role table (§1), the symbol system (§2), AAA floor 7:1, claims discipline, zero-knowledge headers. §8 changes *geometry and rhythm*, nothing about contrast, copy, or claims.

---

## 5 · Top 5 devices + the rhythm principle

If only five ship, ship these — they neutralise the measured offences (§1a–1d) in priority order:

1. **D6 Borderless cards (ruled/bare)** — retires the one box recipe shared by 5 bands and all the buttons. Single highest-leverage change.
2. **D3 Marginalia rail** — moves the eyebrow out of the stack so bands stop opening identically (kills §1a).
3. **D2 Ghost numeral** — fills the dead right column and makes verified numbers the architecture (kills §1d, on-brand with "big type = falsifiable numbers").
4. **D1 Full-bleed image** — one contained-to-edge break per page; lets a photo be the band with no box at all.
5. **D8 Index/directory list** — swaps the box primitive for a list primitive where content is really a directory (where-we-operate).

**The rhythm principle:** *a page is a sequence, not a stack of equal boxes.* Alternate on every axis at once — dense band then sparse breather, contained band then full-bleed, top-left-eyebrow opener then marginalia rail, box then list — and never let the same shape touch itself. One device per band keeps each move legible; the alternation across bands is what turns eleven templated blocks into one edited page.

**File:** `/Users/jamesmarr/Projects/bbc-theme-new/qa/research/anti-blocky-layouts.md`
