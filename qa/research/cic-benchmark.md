# CIC / social-enterprise benchmark — measured, not described
*2026-07-27 · `node qa/benchmark-cic.mjs` · raw data `cic-benchmark.json` · 21 homepages @1280, all 21 measured successfully*

Every previous "how do we compare" answer in this project came from looking at screenshots. This
measures 20 peers on **exactly the metrics `estate-check` runs against us**, so the comparison is
like-for-like. Peers are split between **mission comparators** (Switchback, Fine Cell Work,
Redemption Roasters, The Clink, Bounce Back, Recycling Lives, Emmaus, Change Please, Big Issue,
SEUK) and **commerce comparators** (Elvis & Kresse, Toast, Divine, Belu, Who Gives A Crap, Tony's,
Hiut, Patagonia, Riverford, Cook) — BBC is both, and judging a kit shop only against charities
would flatter us.

## Where we stand

| Metric | BBC | Field median | Best | Worst | Verdict |
|---|---|---|---|---|---|
| Page length (viewports) | **13.1** | 8.2 | 2.7 | 18.4 | ✗ 60% longer than median |
| **Type-role spread** | **8** | 6 | 2 | 9 | ✗ **3rd worst of 21** |
| axe serious violations | **4** | 2 | 0 | 7 | ✗ 2× median |
| Words on homepage | **1,962** | 669 | 138 | 2,054 | ✗ ~3× median, 2nd highest |
| Evidence numbers on page | **16** | 20.5 | 3 | 119 | ✗ below median |
| Display h1 | **115px** | 46.5 | 16 | 80 | ✓ largest in field — deliberate |
| LCP | **512ms** | 596 | 240 | 3,504 | ✓ better than median |
| CTAs | 8 | 6.5 | 2 | 15 | ~ mid-field |

## The finding that matters most

**Type-role spread — we rank 19th of 21.** This is the objective proxy for design-system
discipline, and it is precisely what James keeps describing as *"the visuals don't align"*. The
field's disciplined end runs 2–5 (Bounce Back 2, Clink 3, SEUK 3, Fine Cell 5, Hiut 5, Patagonia 5).
We sit at 8.

The breakdown says exactly where it comes from:

```
BBC homepage:  h1 [115]        ← 1 size. Perfect.
               h2 [22, 95]     ← 2 sizes
               body [13,14,16,18,22]  ← FIVE sizes
```

The masthead is disciplined. **The body scale is not.** Five body sizes on one page against a
contract that specifies one.

### And a self-inflicted one the gates could not see

`qa/TYPE-SCALE.md` specifies **body = 18px, "brief-locked"**. The homepage renders **16px**.

Our new FORMULA §1 check would never catch this: it asserts *one size per role*, not *the right
size per role*. A page rendering 16px body consistently everywhere would pass while silently
contradicting a locked brief decision. **That is a real gap in B1, found by the outside loop —
exactly the failure mode the benchmark exists to catch.** Fix logged below.

## Where we genuinely lead

- **The masthead is the loudest in the field by 44%** — 115px against a next-best of 80px
  (Toast, Divine). TYPE-SCALE called this "a step beyond every documented system ceiling"; the
  measurement confirms it is not just beyond the docs, it is beyond the field. This is a real,
  defensible signature. Keep it.
- **Speed** — 512ms LCP against a 596ms median, in a field where SEUK hits 3.5s. Our worst
  performance problems are already solved.

## Where we are weakest, in priority order

**1 · Length and density.** 13.1 viewports and 1,962 words against medians of 8.2 and 669. We are
the second-wordiest homepage measured. Only Belu (18.4vp) and Switchback (13.9vp) are longer, and
Switchback is a pure-narrative charity with no shop. QA-LOG D12 already flagged page length as an
outlier on impact; the benchmark shows it is a *house pattern*, not one page.

**2 · Body-scale drift** (above) — five sizes, and the winning one contradicts the locked brief.

**3 · Accessibility.** 4 serious violations against a median of 2, with Riverford at 0 and four
peers at 1. For a CIC delivering education and prison programmes this is the least defensible
metric on the list — and since 24 July axe runs across all 72 pages, so the full number will be
larger than this single homepage sample.

**4 · Evidence density — the counterintuitive one.** We show *fewer* numbers than the median peer
(16 vs 20.5) despite being an impact organisation with a 168-note verified Proof Bank. Peers that
lead here (Who Gives A Crap 119, Big Issue, Divine) put quantified proof on the page constantly.
We have better evidence than most of this field and show less of it.

## Targets

Concrete, measurable, and set from the field rather than from taste:

| Metric | Now | Target | Rationale |
|---|---|---|---|
| Type-role spread | 8 | **≤5** | Upper quartile of the field; Hiut/Patagonia/Fine Cell sit here |
| Body sizes per page | 5 | **1** (18px) | Our own brief-locked contract |
| Homepage viewports | 13.1 | **≤9** | Just above field median; keeps our narrative depth |
| Homepage words | 1,962 | **≤1,100** | Mid-field, not shortest — we have more to explain than a chocolate bar |
| axe serious | 4 | **0** | Riverford proves 0 is achievable on a commerce site |
| Evidence numbers | 16 | **≥25** | Above median; we have the Proof Bank to back it |
| h1 display | 115px | **hold** | Our signature. Do not regress to the field. |
| LCP | 512ms | **hold ≤600ms** | Already a strength; protect it during any redesign |

## Actions arising

1. **Close the B1 conformance gap** — the type check must assert role sizes match the canonical
   `--type-*` values, not merely that there is one of them. (Implemented; see commit.)
2. **Body-scale consolidation** — collapse `[13,14,16,18,22]` to the contract's 18px body plus
   named caption/lede roles. This is a visible estate-wide change and needs James's eye before
   deploying; it is not a silent refactor.
3. **Length discipline** — feed the ≤9vp / ≤1,100-word targets into B2's per-page work as an
   explicit constraint, so pages are cut as they are rebuilt rather than in a later sweep.
4. **Accessibility to zero** — the estate-wide axe run (B3) produces the queue.
5. **Put the Proof Bank on the page** — an evidence-density target for B2, not a new band.

## Method notes / limitations

- Homepages only, desktop 1280, single run. Directional, not a lab result — LCP especially varies
  by run and by CDN geography.
- Consent overlays are dismissed where a standard "accept" control is present; some peers may
  still measure with a banner in place, which inflates their role counts slightly (it inflated
  ours by an `<h2>` at 21.5px until third-party UI was excluded — see ESCAPES #10).
- `h1Max: null` for The Clink and Bounce Back means no visible `<h1>` was found — itself an
  accessibility finding about those sites, not a measurement failure.
- Re-run per milestone. It is calibration, not a gate.
