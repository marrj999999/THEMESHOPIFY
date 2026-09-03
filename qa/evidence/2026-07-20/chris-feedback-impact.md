# Impact page — Chris Barrett feedback implementation (2026-07-20)

Source: Chris Barrett email Wed 15 Jul. Plan + comparative research: `~/.claude/plans/dial-it-up-yes-golden-aurora.md` (current-plan section).

## Change set — `sections/bbc-impact-2026.liquid`
1. **NEW "book a discovery call" band, moved above the fold** (directly under the hero, before STATS).
   - Chris: *"Redo this to serve as the main call to action. Change it to 'Book a discovery call' and move it to the top."*
   - **[R] research refinement:** ONE dominant CTA (Unbounce "one main course"; Mighty Ally "one call-to-action"), so the three route cards are now secondary **text links** (`rd-path__cta`) instead of competing lime buttons.
   - Routes to `/pages/contact-us?subject=discovery-call` (no booking tool exists in the vault — James chose contact-form routing 2026-07-20; swap to Calendly later).
   - New schema settings: `help_cta_label`, `help_cta_url`.
2. **"WHAT'S NEXT" band REMOVED** — Chris: *"Remove this entirely to reduce the page length."* Settings retained in schema, no longer rendered.
3. **"Who backs this" — customer segments added** (new `segment` block type: tag / question / benefit / link).
   - Chris: *"Outline this further to clearly show who our customer is and how they benefit."*
   - **[R] Bounce Back pattern** — each segment addressed as THEIR OWN question, answered with the benefit, then routed. Sits above the existing funder/accreditation logo strip, which is retained (James's choice: keep funder credibility).
   - Copy is vault-sourced (Education MOC / Corporate MOC / Sales Pitches) — no invented offers or prices.

## Still to do in this change set
- Template (`page.impact.json`): hero CTA → `/pages/programmes` (covers both arms), discovery-call copy, add the 4 `segment` blocks, cut "both pathways" policy stats to the 2 sourced ones.
- Homepage: 3-audience fold + corporate CTA fold.

## Verification — DONE, all green (2026-07-20)
**Impact** (desktop 1280 + mobile 390): `book a discovery call.` is the **first h2** (directly under hero) ✓ · funding band **gone** ✓ · **4 customer segments** render (school / prison / team day / build your own) ✓ · policy stats cut to the 2 MoJ-sourced (`9pts`, `39%`) ✓ · hero CTA → `/pages/programmes` (covers both arms) ✓ · no Liquid errors · overflow 0.
**Homepage**: band order now HERO → STATS → **DOORS** → **IMPACT FEATURE** → FUNDING LOOP → … ✓ · fold 2 = 3 audience doors ("want to build your own?" / "commissioning for a prison?" / "running a school or college?") ✓ · fold 3 = corporate CTA "a team day that leaves something behind." → `/pages/bicycleteambuilding` ✓ · duplicate "Read the impact" link removed (**0** instances) ✓ · mobile overflow 0, 3 doors render ✓.

## Original verification plan
- Gate: claim-lint + schema JSON validation must pass.
- Render: Puppeteer desktop 1280 + mobile 390 — assert no horizontal overflow, no Liquid errors, canonical type scale intact (hero 96 / h2 86), discovery-call band appears directly under the hero, funding band gone.

## ⚠️ Publishing risks (unchanged, James to resolve)
- Google / GM Motors / McLaren marked **UNVERIFIED** in Corporate MOC ("do not cite publicly") vs the Jul-11 brief saying James vouches — conflict.
- Corporate price conflict: Sales Pitches £595/person vs Corporate MOC "no price card exists" — do not publish a price.
