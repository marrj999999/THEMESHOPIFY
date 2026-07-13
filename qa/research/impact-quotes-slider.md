# Impact Quotes Band — Verified Quotes + Slider Spec
*Research 2026-07-13. Brief: James — "quotes should all be impact" (current sq1–sq5 are product/ride quotes, wrong register) + make it a proper slider block.*

**Current state (why this exists):** `templates/page.impact.json` blocks sq1–sq5 read "The satisfaction is enormous / It rides like it was on rails / 100k on the first weekend / The imperfections are beautiful / A year on — still rides beautifully" — builder-product register on the impact page. The band (`rd-qscroll` in `sections/bbc-impact-2026.liquid` L290–305, CSS `assets/bbc-statement.css` L862–866) is already a scroll-snap rail but has **no buttons, no counter, no slide semantics** — swipe/scroll only, which fails WCAG operability for the slider interaction.

---

## PART 1 — Verified impact quotes (use these)

Every quote below has a traceable source. Verification chain: vault `Business/Case Studies/Verified 2026/` (168-note June-2026 audit vs primary sources) + `Marketing/Verified 2026 — Blog & Press Audit (Canonical Record).md` + `Business/Proof Bank.md`. Banned-claims check done: none of these contain £11.41 / 100% / 28k PSI / 56.7%.

### Recommended set (order = slider order; strongest first — NN/g: slide 1 gets ~89% of engagement)

**Q1 · Maker (anonymised) — the emotional anchor, put first**
> "The bike was the first thing I ever made with my own hands. When my daughter rode it on family visit day, I felt like a dad again."
- **Attribution line:** `Maker, Build to Bond`
- **Source:** vault-canonical Maker voice — `Context/BBC Narrative.md` L50, `Context/Programme Library.md` L81, `Grants/Grant Parts Library.md` L129, `Grants/Bid Pack/Impact One-Pager.md` L54 (the grant bid-pack wording, sanctioned for external use).
- **Safeguarding:** attribution MUST stay exactly "Maker, Build to Bond" — no name, and keep the prison out of the attribution line (bid-pack rule: anonymous, never add a name). One audit (`System/Operation Log.md` L72) flagged this quote's citation as previously mis-cited — it is programme-records voice, not press; do not attribute it to FT/Inside Time.

**Q2 · Prison staff**
> "The bamboo bike course offers more than just technical training — it provides an avenue for creativity, teamwork, and self-expression."
- **Attribution line:** `Sally Allsopp, Industries and Community Manager, HMP Lowdham Grange` *(small source tag: Inside Time, Nov 2025)*
- **Source:** verified **verbatim against the primary Inside Time article** ("Bamboozling way to build bikes", Ben Leapman, 17 Nov 2025, insidetime.org) — vault note `Verified 2026/inside-time-bamboozling-way-to-build-bikes-bamboo-bicycle-club-at-lowdham-grange.md` ("Verified quotes — all confirmed verbatim"). Live re-post: https://bamboobicycleclub.org/blogs/news/inside-time-bamboozling-way-to-build-bikes-bamboo-bicycle-club-at-lowdham-grange
- **Notes:** named staff + named prison = allowed. Use full current title "Industries and Community Manager" in new BBC copy (audit correction; press said "Industries Manager"). The longer variant with second sentence ("Watching the pride on a father's face…" — currently in `b2b_quote`) lives in `System/BBC Company Info.md` L72 but only the first sentence is press-verified — keep the band to the verified sentence.

**Q3 · Government endorsement**
> "Innovative projects, such as Build to Bond, support rehabilitation and help people leave prison as better citizens, boosting the economy and keeping our streets safe."
- **Attribution line:** `Lord Timpson, UK Prisons Minister`
- **Source:** verified verbatim — FT "How Bamboo Bicycle Club is helping to break the prison cycle" (Sept 2025, Marion Willingham) + Inside Time. Vault: `Verified 2026/financial-times-how-bamboo-bicycle-club-is-helping-to-break-the-prison-cycle.md` ("genuine and verbatim"). Live: https://bamboobicycleclub.org/blogs/news/financial-times-how-bamboo-bicycle-club-is-helping-to-break-the-prison-cycle
- **Alternate (also verified verbatim, Inside Time):** "Finding employment after release reduces the chance of reoffending significantly, which is why we are improving opportunities to help prisoners turn their lives around." — use one, not both.

**Q4 · Funder**
> "Bamboo Bicycle Club reconnects excluded learners with education by delivering hands-on, industry-relevant, accredited programmes in sustainable design and mobility to open pathways into further study, employment or enterprise."
- **Attribution line:** `Investec Beyond Business — 2025 award citation (£24,000, one of four winners from 148 applicants)`
- **Source:** official programme copy, **verbatim confirmed** on bbbc.org.uk (Bromley by Bow Centre "Investec Beyond Business Champions 2025") — vault note `Verified 2026/investec-beyond-business-2025-bamboo-bicycle-club-wins-24-000-award.md` (classification: GENUINE). Live: https://bamboobicycleclub.org/blogs/news/investec-beyond-business-2025-bamboo-bicycle-club-wins-24-000-award
- **⚠️ Replaces** the "A truly inspiring cohort…" quote currently in `cred_quote1` — that line's speaker is **unconfirmed** (appears only in the redirected duplicate post; City AM attributes only a Ruth Leas paraphrase). Don't reuse without confirming who said it.

**Q5 · Press one-liner**
> "Pandas eat it. Schoolchildren used to be caned with it. But now prisoners at Lowdham Grange have found a surprising new use for bamboo — making bicycles out of it."
- **Attribution line:** `Inside Time, November 2025` *(prisoners' national newspaper, 100k+ readership)*
- **Source:** the real Ben Leapman article intro — explicitly verified "not a fabrication" in `Verified 2026/inside-time-making-bike-building-accessible-to-everyone-in-prisons.md` L54. Primary: https://insidetime.org/comment/bamboozling-way-to-build-bikes/
- **Note:** retains the source's word "prisoners" — correct for an attributed press quote (audit ruling); BBC voice elsewhere stays "Makers".

**Q6 · Founder-in-press (optional 6th)**
> "For a lot of prisoners, the programmes offered are quite dull, but bamboo bikes have that cool factor that excites them. In the programme there's maths and English, but it's built into design, creativity and bike mechanics."
- **Attribution line:** `James Marr, Founder — in Inside Time`
- **Source:** verified verbatim against Inside Time primary (same audit note as Q2).

**Q7 · Corporate/partner (optional, if a partner voice is wanted)**
> "We are delighted to partner with Bamboo Bicycle Club to create these brilliant bespoke bicycles for our guests to enjoy."
- **Attribution line:** `Hilton London Bankside`
- **Source:** verified quote in `Verified 2026/hilton-bankside-staff-training-and-public-hire-bikes.md` (canonical record entry). More "partnership" than "impact" — use only if the band needs a corporate voice.

**Press one-liner alternate:** the FT headline itself — *"How Bamboo Bicycle Club is helping to break the prison cycle"* — `Financial Times, September 2025` (ft.com/content/6ebe2eba-b832-4289-9924-2e9f948d5f98). Headline = fully traceable, zero fabrication risk.

### Excluded (and why — do not resurrect without new verification)
- **"Alex passed his science module…"** (teacher, teaching-stem-with-purpose blog) — the post is **NOT in the 168-note Verified 2026 audit**; given the site's documented history of AI-fabricated quotes, unusable until checked against a primary source. This leaves an **education-voice gap** — the Investec citation (Q4) partly covers it ("reconnects excluded learners with education").
- **Oratory School head quote** ("I'm very excited that James Marr and Russell Hollie…") — unaudited, speaker unnamed in extraction; verify against the school's own announcement before use.
- **"A truly inspiring cohort…"** — unconfirmed speaker (see Q4).
- **UCL lines** — BBC's own voice describing the partnership, not a UCL quote; both UCL posts are partly-fabricated/duplicates.
- **Sally Allsopp second sentence** as standalone — only vault-internal, not press-verified.
- **NLCF** — £18,000 "Pedal Forward" won Jul 2025 is real (Proof Bank) but **no NLCF quote exists anywhere in the vault** — nothing to use.
- All sq1–sq5 current quotes — real builder register but not impact; move them to a product/community page if wanted, don't delete the copy.

**Count by voice:** Maker (anonymised) 1 · prison staff 1 · government 2 (use 1) · funder 1 · press 2 (Inside Time intro + FT headline alternate) · founder-in-press 1 · corporate partner 1 · education partner 0 (verified gap, flagged).

---

## PART 2 — Slider component spec

### Research basis
- **W3C WAI carousel tutorial + ARIA APG carousel pattern:** all functionality keyboard-operable (WCAG 2.1.1); users must be able to pause any movement (2.2.2) — simplest compliance: **no autoplay at all**; slide changes must be perceivable (4.1.2); container `aria-roledescription="carousel"`, slides `role="group"` + `aria-roledescription="slide"` + `aria-label="2 of 6"`; prev/next activation must NOT move focus; buttons before the slides in tab order.
- **NN/g evidence:** auto-forwarding carousels annoy users and reduce visibility ("Auto-Forwarding Carousels, Accordions Annoy Users"); slide 1 gets ~89% of engagement (Notre Dame data, cited by NN/g) → order quotes by importance; never auto-forward on mobile. Manual, user-paced carousels with visible controls + position indicator are the acceptable form ("Designing Effective Carousels").
- **Reference implementations:** (1) W3C APG carousel example (the canonical ARIA wiring); (2) Heydon Pickering, *Inclusive Components* — "A Content Slider": CSS scroll-snap rail + real buttons + no JS-positioning, JS only decorates — this is the architecture to copy; (3) **in-theme**: Dawn's `SliderComponent` (`assets/global.js` L728–827) — scroll-based slider with `.slider-button` prev/next + `.slider-counter--current/total`, proof the pattern is native Shopify practice (don't reuse it here — it drags Dawn CSS; ours is ~25 lines).

### Decision
**CSS scroll-snap rail (keep existing `rd-qscroll`) + prev/next buttons + "2 / 6" counter, progressive enhancement, NO autoplay, NO library.** Pure scroll alone fails WCAG (swipe/scrollbar-only operation, no position feedback); a JS-positioned carousel throws away the native scroll/swipe already working. Enhancement wins: no JS → band still fully scrollable and readable; JS → buttons + counter appear.

### Markup sketch (editable Shopify blocks — extends existing `scrollquote` block)

```liquid
{%- assign sq = section.blocks | where: "type", "scrollquote" -%}
{%- if sq.size > 0 -%}
<section class="rd-pad-sm rd-paper rd-band--quotes">
  <div class="rd-wrap rd-qhead">
    {%- if section.settings.quotes_label != blank -%}<span class="rd-eyebrow">{{ section.settings.quotes_label }}</span>{%- endif -%}
    <div class="rd-qnav" hidden> {%- comment -%} un-hidden by JS {%- endcomment -%}
      <button type="button" class="rd-qbtn" data-dir="-1" aria-label="Previous quote">&larr;</button>
      <span class="rd-qcount" aria-live="polite"><b>1</b>&thinsp;/&thinsp;{{ sq.size }}</span>
      <button type="button" class="rd-qbtn" data-dir="1" aria-label="Next quote">&rarr;</button>
    </div>
  </div>
  <div class="rd-qscroll" role="region" aria-roledescription="carousel"
       aria-label="{{ section.settings.quotes_label | default: 'what the impact sounds like' }}" tabindex="0">
    {%- for block in sq -%}
    <figure class="rd-qscroll__item" role="group" aria-roledescription="slide"
            aria-label="{{ forloop.index }} of {{ sq.size }}" {{ block.shopify_attributes }}>
      <blockquote class="rd-qscroll__q">&ldquo;{{ block.settings.text }}&rdquo;</blockquote>
      <figcaption class="rd-qscroll__a">{{ block.settings.attr }}
        {%- if block.settings.source != blank %} <span class="rd-qsrc">· {{ block.settings.source }}</span>{% endif -%}
      </figcaption>
    </figure>
    {%- endfor -%}
  </div>
</section>
{%- endif -%}
```

Schema: keep `scrollquote` block (`text` textarea, `attr` text), **add** `{ "type": "text", "id": "source", "label": "Source tag (e.g. Inside Time, Nov 2025)" }`. Attribution stays James-editable per block; max_blocks 8.

### CSS (tokens: paper/forest/lime/steel; statement scale per FORMULA §1)

```css
/* rail — existing L862-866 kept: snap x mandatory, full-bleed pad, 78vw/520px items */
.bbc-rd-impact .rd-qscroll{ scroll-behavior:smooth; }
@media (prefers-reduced-motion: reduce){ .bbc-rd-impact .rd-qscroll{ scroll-behavior:auto; } }
.bbc-rd-impact .rd-qscroll:focus-visible{ outline:3px solid var(--forest); outline-offset:4px; }
.bbc-rd-impact .rd-qhead{ display:flex; align-items:center; justify-content:space-between; gap:16px; }
.bbc-rd-impact .rd-qnav{ display:flex; align-items:center; gap:10px; }
.bbc-rd-impact .rd-qbtn{ width:44px; height:44px; border-radius:50%; border:2px solid var(--forest);
  background:transparent; color:var(--forest); font-size:18px; cursor:pointer; } /* 44px = touch target */
.bbc-rd-impact .rd-qbtn:hover{ background:var(--lime); }        /* lime only as interaction accent */
.bbc-rd-impact .rd-qbtn[disabled]{ opacity:.3; cursor:default; background:transparent; }
.bbc-rd-impact .rd-qcount{ font-size:14px; font-weight:800; color:var(--forest); font-variant-numeric:tabular-nums; }
/* quote type stays statement-scale: clamp(24px,3vw,38px)/1.15/800 with ✱ prefix (existing) —
   NO card borders, NO boxes: type IS the band (§8 rule 3; band shape = rail) */
```

### JS (vanilla, 24 lines, no libraries — decorates only)

```html
<script>
(() => {
  document.querySelectorAll('.rd-band--quotes').forEach((band) => {
    const rail = band.querySelector('.rd-qscroll'),
          nav  = band.querySelector('.rd-qnav'),
          cur  = band.querySelector('.rd-qcount b'),
          items = [...rail.querySelectorAll('.rd-qscroll__item')];
    if (!nav || items.length < 2) return;
    nav.hidden = false;
    const [prev, next] = nav.querySelectorAll('.rd-qbtn');
    const index = () => {
      const x = rail.scrollLeft;
      let best = 0;
      items.forEach((el, i) => { if (Math.abs(el.offsetLeft - rail.offsetLeft - x) <
        Math.abs(items[best].offsetLeft - rail.offsetLeft - x)) best = i; });
      return best;
    };
    const paint = () => { const i = index(); cur.textContent = i + 1;
      prev.disabled = i === 0; next.disabled = i === items.length - 1; };
    nav.addEventListener('click', (e) => { const b = e.target.closest('.rd-qbtn');
      if (b) items[Math.min(items.length - 1, Math.max(0, index() + +b.dataset.dir))]
        .scrollIntoView({ block:'nearest', inline:'start', behavior:'smooth' }); });
    rail.addEventListener('scroll', () => requestAnimationFrame(paint), { passive:true });
    paint();
  });
})();
</script>
```

Notes: buttons never move focus (APG-correct); `scrollIntoView` respects the CSS `scroll-behavior` + reduced-motion override; ends are `disabled` (no infinite loop — counter stays honest); counter `aria-live="polite"` announces "2 / 6" to screen readers on change; no autoplay so no pause control is required (WCAG 2.2.2 satisfied by omission).

### Mobile behaviour
- Native swipe + snap (already working); item width `min(78vw,520px)` leaves a next-quote **peek** — the primary "there's more" affordance.
- Buttons remain visible on mobile (WCAG: swipe must never be the only operation) — 44px targets sit right of the eyebrow; if the row gets tight <380px, keep buttons and let the eyebrow wrap above.
- No autoplay on any viewport (NN/g: especially harmful on mobile).
- Long quotes (Q1 is 3 lines at 24px): rail uses `align-items:flex-start` implicitly via block flow — verify attribution baseline alignment on the eyeballed-mobile-screenshot gate (FORMULA §7).

### §8 anti-blocky compliance
- Band shape = **rail** (one of the 7 shapes) — check neighbours in `page.impact.json` so no adjacent band is also a rail (rule 2).
- **No boxes:** quotes are bare statement-scale type with the ✱ prefix; zero borders/cards added (rules 3, "no boxes" brief). The only chrome is two outline-circle buttons + a 14px counter.
- **Containment break intact:** rail bleeds full-viewport via the existing `padding:… max(32px, calc((100vw - 1200px)/2 + 32px))` trick (rule 5 support).
- Eyebrow: nav sits opposite the eyebrow on one line — or count this band as one of the ≥2 eyebrow-relocation bands by moving the eyebrow into the nav row right-aligned (rule 4).
- Voice variety does the visual work: alternate attribution chip colour is unnecessary — keep colour out of it (FORMULA §2: words always, colour never the only cue).

### Sources
- W3C WAI Carousels tutorial — https://www.w3.org/WAI/tutorials/carousels/
- W3C ARIA APG Carousel Pattern — https://www.w3.org/WAI/ARIA/apg/patterns/carousel/
- NN/g, Auto-Forwarding Carousels Annoy Users — https://www.nngroup.com/articles/auto-forwarding/
- NN/g, Carousel Usability — https://www.nngroup.com/articles/designing-effective-carousels/
- Heydon Pickering, Inclusive Components: A Content Slider — https://inclusive-components.design/a-content-slider/
- In-theme: Dawn `SliderComponent`, `assets/global.js` L728–827
