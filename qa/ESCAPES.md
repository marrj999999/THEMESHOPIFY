# ESCAPES — every defect that got past a gate, and the check that now catches it

*Created 2026-07-24. The rule: **an escape is not closed until a check exists that would have
caught it.** A one-off fix leaves the hole open; a new assertion closes it. This is the
continual-improvement engine — the same reasoning the WORKFLOW rules already carry
("Added 2026-07-24 after the overflow-x:hidden timeline-kill went unnoticed for weeks").*

Columns: what escaped · who/what found it · which gate SHOULD have caught it · what was added.

---

## 2026-07-24 — the "green tick that means nothing" batch

Nine escapes in one day, all the same shape: **a gate reported success while doing nothing.**
That shape is now the thing to hunt for, not any individual bug.

| # | Escape | Found by | Gate that should have caught it | Check added |
|---|---|---|---|---|
| 1 | **Token ratchet never executed.** An unclosed quote in `gate-check.sh` turned `bash qa/stylelint-ratchet.sh \|\| exit 1` into part of an `echo` string. The gate printed the command as text and still reported PASS — every push since round-1 cleared a gate that wasn't running. | Running the gate and reading its output instead of trusting the commit message | `gate-check.sh` itself | Quote fixed (b6235a8). **Permanent fix: `qa/canary.mjs`** (below) |
| 2 | **Visual suite matched zero tests** — `playwright.config.ts` (legacy smoke suite) out-ranks our `.mjs` in config resolution. | First real execution | the suite | `--config` documented as mandatory in WORKFLOW 4.6 + config header |
| 3 | **Positional filter resolved to `qa/qa/…`** — `qa/visual.spec.mjs` as an argument resolves against `testDir: 'qa'`. "No tests found" reads like a clean run if you skim the tail. | Same | the suite | Documented; bare `--config` invocation is now the contract |
| 4 | **`toHaveScreenshot()` missing `.png`** — all 48 tests errored before capturing anything. | Same | the suite | Fixed (f79874f) |
| 5 | **Consent banner baked into baselines** — Shopify's `#shopify-pc__banner`, a 239px fixed overlay, sat across the hero. Its visibility depends on cookie state, so every future run would have diffed on consent rather than content. | **Opening the first captured PNG by eye.** No assertion would have flagged it | nothing existed | Masked in `visual.spec.mjs`; principle recorded — automated diff decides *where* to look, a human still looks |
| 6 | **`claim-lint` and `estate-check` had divergent banned lists.** `claim-lint` gained "nationally recognised"; `estate-check`'s `BANNED` never did. Source-clean + rendered-unchecked = the phrase live on two draft pages under two green gates. | Sweeping draft templates by hand | both | Both lists widened **and** cross-referenced in comments so the next divergence is visible |
| 7 | **Stale local files would have regressed the draft.** `bbc-build-to-bond` ("prisoners"), `bbc-impact-mission` ("Level 1 & 2", "Guaranteed interview on release"), `bbc-social-impact` (alt text "prisoners"). Git mtimes said "local is newer" and were wrong. | Full 608-file checksum audit against the draft | `claim-lint` had no pattern for any of these three | Patterns added: `Level 1 & 2`, `guaranteed interview`, narrow `prisoners` |
| 8 | **Wrong OCN course title in 14 places, correct title in 0.** Vault Claims Register says "Workshop Skills and Sustainable Manufacturing"; the theme said "Sustainable Design & Manufacturing". `CLAUDE.md` carried the error, which is how it propagated. | **Reading the vault** (WORKFLOW 1.5, mandated but only ever done for one page) | no gate encoded the register | Pattern added to both lists; `CLAUDE.md` corrected. **Durable fix pending: generate the lists FROM `System/Claims Register.md`** so a register update propagates automatically |
| 9 | **Visual net blind to copy changes.** Predicted a diff on `/pages/impact` after the OCN edit; got 48/48 clean. The change was real (forced rewrite → different md5). `maxDiffPixelRatio: 0.015` on a 1280×11757 page allowed **225,734** differing pixels, ~19× the changed label. Even absolute 2,500 px missed a short label at the reveal system's 0.3 opacity. | **Making a falsifiable prediction and having it fail** | the visual net | `maxDiffPixels: 2500` absolute (height no longer buys a free pass) **+ `qa/fingerprint.mjs`** — text/type-role fingerprints, the right instrument for copy |

### 10 — the inverse failure: a gate crying wolf

| Escape | Found by | Check added |
|---|---|---|
| **16 false "dead link" FAILs.** The estate run reported 16 broken internal links (plus an aggregate "16 dead" row) — all HTTP 503. Re-fetched directly: **16/16 returned 200.** Shopify sheds load with 503 while the crawl runs alongside other traffic; the crawler retried 429 only. | Re-fetching every flagged URL instead of accepting the FAIL | Retry widened to 503 and 0, 3 attempts, longer backoff |

Worth its own row because it is the *opposite* of escapes 1–9 and just as corrosive: a gate
that cries wolf trains you to skim past FAIL lines — which is precisely how nine real gate
defects survived. **A false FAIL is a defect in the gate, not noise to tolerate.**

---

## 2026-07-27 — the measurement-quality batch

Five findings in one day were **artefacts of crude proxies, not real defects.** Each would have
led to changing something that was working.

| # | The "finding" | What it really was |
|---|---|---|
| 11 | Type-role spread 8 vs median 6 — "body scale undisciplined" | Four of five body sizes were legitimate documented roles (caption 13, footnote 14, body 18, lede 22); the fifth is FORMULA's own step/list 16. Counting *sizes* conflates "roles used correctly" with "sizes used at random". Replaced by `type-drift-audit.mjs`: does the SAME class render at different sizes? → 5 real drifts in 168 classes, now fixed, 98.8% consistent |
| 12 | 9 classes drifting | 4 were behaviour/colour modifiers (`rd-reveal`, `rd-lime`, `rd-on-dark`, `bbc-counted`) applied across many sizes by design. Excluded |
| 13 | Homepage scores zero-knowledge 0/2 | The proxy read the first 700 chars of `body.innerText` — consent banner, cart drawer, nav. The real hero explains who/what/for-whom in its sub-line |
| 14 | Only 2 of 18 quotes attributed | Regex expected "— Firstname Lastname"; BBC attributes with publication names. **8 of 8 verified attributed** |
| 15 | Estate reports 16 dead links | All 16 returned 200 on direct fetch — Shopify shedding load with 503. Crawler retried 429 only (fixed) |

**The rule this establishes:** *verify a finding before acting on it — most urgently when the fix
would be satisfying.* Four of these five would have produced a confident commit "fixing" healthy
code. The verification that settled each was cheap: read the actual element, fetch the actual URL,
compare the actual screenshots.

A corollary for the tools: **a proxy is a hypothesis, not a result.** Any new metric ships with at
least one hand-verified example before its numbers are quoted anywhere.

| 16 | Impact page has "8 bordered boxes vs a cap of 6" — a FORMULA §8 violation needing band redesign | Reading the flagged elements' actual computed styles | Detector counted any border-top, radius or background as a box. The 5 flagged in the evidence wall were `rd-cscard__foot` — a **border-top rule**, which IS device D6, the pattern the research prescribes. True boxes (3+ sides): **1**. The page was already compliant, and the "fix" would have degraded it |
| 17 | Impact page is 2.5× too long, cut ~500 words | Checking where the words were | The quotes band measured 214 words from 12 slide elements, only 6 unique — 187 words of carousel clones. Real figure 1,158 not 1,336; ratio 2.1× not 2.5×. Both benchmark harnesses now subtract slider clones |
| 18 | **Canary reports "VISUAL GATE BLIND — THRESHOLD TOO LOOSE"** after the pathway de-box | Reading `canary-visual.spec.mjs` instead of acting on its verdict | The canary confirms its OWN baseline at step 1 before injecting a change at step 3. A legitimate design change to `/pages/impact` fails at step 1, so the threshold is never exercised — yet the message blamed the threshold. Tuning `maxDiffPixels` would have loosened a healthy gate to silence a stale PNG. `canary.mjs` now branches on the step-3-only string `VISUAL GATE IS BLIND` and otherwise reports **STALE CANARY BASELINE** with the reseed command — and warns against `--update-snapshots`, which bakes the injected "CANARY" text into the baseline |

### Also found, not strictly escapes — checks that were never real

| Item | Detail |
|---|---|
| `theme-smoke.spec.ts` 8/8 failing | Three defects, all in the tests, none in the site: asserted zero console errors while Shopify's own `shop.app` iframe 403s on every load; picked hidden nav dropdown links as "the first product"; demanded a visible checkout button on an **empty cart** and required `<cart-drawer>` to become visible when it always exists and only shows when opened. Now seeds the cart and asserts `/cart.js item_count` — outcome, not affordance. 8/8 passing; add-to-cart and checkout genuinely tested for the first time. |
| `assets/bbc-tokens.css` does not exist | `TYPE-SCALE.md` calls it "the contract… loads last, wins" and the tracker records it deployed and read-back-identical. It 404s on local, draft and live. The type scale is duplicated across ≥4 sheets with 17 `bbc-*.css` files competing on cascade order — the mechanism behind the inconsistency. |

---

## The permanent fix — `qa/canary.mjs` (Quality Layer 1)

Escapes 1–4 and 9 share one root cause: **a gate that cannot fail still reports success.**
Before any new check is trusted, feed it a known-bad fixture it MUST reject:

| Gate | Canary | Must |
|---|---|---|
| claim-lint | temp file with `28,000 PSI`, `nationally recognised` | exit 1 |
| estate-check `BANNED` | banned string injected into the page under test | emit FAIL |
| token ratchet | CSS with one extra literal | exit 1 |
| visual net | small text change injected via `addStyleTag` | produce a diff |
| motion-check | `overflow:hidden` forced on `html` | FAIL |
| gate-check | malformed schema JSON | exit 1 |

**A canary that passes means the gate is dead → block the pass.** Escape #9 is the sharpest
argument for it: the visual net had genuinely run, genuinely compared, and was genuinely
blind — only a deliberate known-bad input would have exposed that.

## Waivers ratchet DOWN

14 named waivers today. If waivers grow freely, "0 FAIL" stops meaning anything — you can
waive your way to green. A waiver is a deferred defect with an owner, not a pass.

---

## 2026-07-27 — measurement-quality, second batch

| # | The "finding" | What it really was |
|---|---|---|
| 19 | **"97 rows below the band genuinely differ — not a uniform shift."** Nearly stopped the option-B re-baseline. | A too-strict row test. It declared a row "different" if any sampled pixel moved by >6 on any channel — a threshold that **glyph antialiasing trips every time** across two browser sessions. Sweeping candidate offsets settled it: −37px scored **0.19% / 0.35% / 0.44%** of pixels over an 80-delta in three regions, against 1.4–6.8% at −36 or −38. The shift *is* uniform; the residual is sub-pixel text rasterisation. **Rule: a pixel comparison across browser sessions needs an antialiasing-tolerant threshold, and "is it a shift?" is answered by sweeping offsets, not by testing one.** |
| 20 | **"The impact page height is unstable run-to-run (11804 / 11818 / 11841)."** Would have discredited the visual gate on this page. | My measurement omitted the spec's own MASK (which hides video, iframes and the map). Under the gate's actual conditions the page is **11804 on 4 consecutive runs, variance 0px**. The instability was in the instrument, not the page. |
| 21 | Band audit showed bands 4–9 growing 23→57→278→230px after a change scoped to `.rd-path` — implying wide collateral damage | Same cause as #20: unmasked runs let late-loading media resize bands. Verified structurally instead — `.rd-path` occurs **0 times outside band 3**, and bands 0–2 never moved, so only band 3's height can change. |

**The through-line for all three:** when a measurement contradicts a structural argument, suspect the
measurement first. The structural fact here (a selector scoped to one band cannot move another) was
knowable in one query and outranked three increasingly elaborate pixel analyses.

---

## 2026-07-28 — the gate that passed a change I could see

| # | Escape | Found by | Check needed |
|---|---|---|---|
| 22 | **Visual net passed 48/48 on a change visible to the naked eye.** The `.rd-lumen` bloom + dot-grid treatment was added to a dark band and the suite reported clean. Measured against the pre-change baseline: **39,274 pixels differ by >2, 20,408 by >8 — but only 544 exceed the ~26 per-channel delta that `threshold: 0.1` counts**, and 544 is under `maxDiffPixels: 800`. The gate behaved exactly as configured; it is simply **blind to large-area, low-contrast change** — which is precisely what any background, gradient, scrim or atmosphere treatment is. | Not trusting a green tick on a change I had just looked at | The full-page net cannot police this class. Backgrounds need either an **element-level screenshot with a tighter threshold**, or a computed-style assertion that the treatment is present (e.g. `.rd-lumen::after` has a non-`none` background-image). Recorded, not yet built. |

This is escape #9's twin. #9 was the net missing a small high-contrast change (a short text label
on a tall page); this is the net missing a **large low-contrast** one. Both come from a single
global threshold pair trying to police two very different kinds of difference.

**Standing consequence: a green visual run is evidence only for changes in the band the threshold
can see.** For anything atmospheric, look at the render — the screenshot is the instrument, the
diff is not.

---

## 2026-07-29 — a failing gate that still allowed a push

| # | Escape | Found by | Check added |
|---|---|---|---|
| 23 | **The token ratchet FAILED and the push went through anyway.** Two independent faults lined up. (a) I invoked the gate as `bash qa/gate-check.sh … \| tail -3 && node qa/push-theme.mjs …` — piping into `tail` means `&&` sees **tail's** exit code, always 0, so a failing gate never stopped the chain. (b) `gate-check.sh` only deleted its `.gate-pass` token on the *normal* failure path at the bottom of the script, but line 9's `bash qa/stylelint-ratchet.sh \|\| exit 1` exits immediately — so a ratchet failure never reached the cleanup and left the **previous** run's token in place. `push-theme.mjs` only asks whether the token is under 10 minutes old, so it accepted it. | Reading the gate output instead of trusting that `&&` had guarded the push | `gate-check.sh` now does `rm -f qa/.gate-pass` **first, before any check runs**, which closes every early-exit path at once. Proven: forced a ratchet failure → gate exit 1 → token removed → `push-theme.mjs` refused with "BLOCKED". |

Two lessons, and the second is the general one:

1. **Never pipe a gate into anything.** `set -o pipefail` would also fix it, but the habit is simpler: run the gate, capture its exit code, *then* decide.
2. **A guard that cleans up only on its expected failure path is not a guard.** `exit 1` anywhere above the cleanup silently preserves stale state. Invalidate first, validate second — the same shape as ESCAPES #1, where a gate reported success while executing nothing.

---

## 2026-07-29 — a shared primitive with a bigger blast radius than it looked

| # | Escape | Found by | Check added |
|---|---|---|---|
| 24 | **De-boxing `.rd-card.rd-stamp` silently rebuilt the shop grid.** The class reads as "the editorial stamp card" from schools and programmes, where it holds pricing and pathway cards — and it is *also* every product card on every collection page (12 on `/collections/all`). The de-box replaced their enclosure with an L-rule, which does not enclose a product image, so the rule ran beside the photo and the grid read as broken. On a revenue page. No gate caught it: contrast passed, the ratchet passed, axe passed, and the visual net failed *every* page anyway because the footer had changed in the same pass — so 42 failures said nothing. | **A CONTROL PAGE.** `collection` has no steps and no editorial cards, so its only diff should have been the footer. Its first differing row was y810 against a footer starting at y2738 — a 1,900px gap that had no business existing | De-box scoped to `.rd-grid .rd-card.rd-stamp:not([href*="/products/"])`. Verified by class, not by eye: collection 12/12 boxed, programmes 9/9 ruled, schools 5 ruled + 1 boxed |

**The transferable lesson: when a change is estate-wide, check a page that should NOT have
changed.** Every page failing tells you nothing; one page failing *where it shouldn't* tells you
everything. Re-reading the pages I had edited would never have found this — I was looking at
exactly the cards I meant to change, and they looked right.

**Corollary for shared primitives:** before editing one, list where it actually renders. A grep of
section files gives the sections; only the rendered estate gives the *contexts*. "18 sections use
`.rd-stamp`" hid the fact that one of those contexts was the entire shop.

---

## 2026-07-29 — CSS refactor safety, and a baseline that went stale

Removing `!important` is the right thing and the dangerous thing: a load-bearing one looks
identical to a decorative one until something reflows three pages away. `qa/css-fingerprint.mjs`
makes the browser the authority — capture every element's computed style, change, re-capture,
and demand **zero** movement.

| # | Escape | Found by | Fix |
|---|---|---|---|
| 25 | **Desktop-only evidence nearly certified a mobile-only stylesheet.** The first fingerprint captured 1280px only. `bbc-mobile-fixes.css` carries 146 `!important` that a desktop capture never exercises — a clean diff would have "proved" a change safe while never rendering the rules it touched. | Noticing the file was mobile-scoped before trusting the result | Fingerprint now captures 1280 **and** 390 — 10,324 elements across 26 page/viewport combos |
| 26 | **A "successful" multi-file push silently pushed nothing.** `push-theme.mjs` crashed partway through 8 files; the surrounding shell reported the earlier gate PASS, and the subsequent diff showed only 21 moved values — which read as "the change was safe" when in fact **not one file had reached the draft**. The 21 was the noise floor. | Verifying local-vs-draft byte equality instead of trusting the push output | Push one file at a time and confirm sync. A diff is only meaningful once the change is provably live |
| 27 | **A baseline captured 40 minutes earlier had gone stale.** After fully reverting a batch, the estate still showed 4,310 moved values against that older baseline — with every file byte-identical to git HEAD. Two consecutive captures then showed **0**. The site itself drifts (app content, lazily-injected sections), so an old baseline manufactures phantom regressions. | Re-measuring the noise floor rather than hunting a bug that was not in the CSS | **Capture the baseline immediately before the change**, never once at the start of a long session |

**Result of the refactor itself:** 72 `!important` removed from `bbc-redesign-2026.css`
(289 → 217) with **0 of 166,980 property values moved** — proven decorative. A wider 8-file batch
moved 5,333 values, so it was reverted rather than shipped: the knock-on effects (stripping one
`!important` lets a different rule win, which changes padding, which changes height) mean each
file needs its own bisect cycle, not a single sweep.

### 28 — the fingerprint measured under different conditions than the gate it was defending

`qa/css-fingerprint.mjs` reported **0 of 166,980 property values moved** after removing 72
`!important`. The visual net then failed **48/48**, with the homepage 224px taller than baseline.

Both instruments were working. They were measuring **different pages**:

| | conditions |
|---|---|
| visual net (`visual.spec.mjs`) | applies a MASK — `visibility:hidden` on `.bbc-media, video, iframe, .rd-mapwide` |
| fingerprint | no mask; only the cookie banner removed |

A change can be equivalent unmasked and not equivalent masked, because hiding an element changes
what the surrounding layout resolves to. **An equivalence test only certifies the conditions it
actually rendered.**

**But the strip was not the cause.** Bisecting settled it: restoring the pre-strip file (289
`!important`) and re-running gave **3 failed** on the same pages. Every file was byte-identical to
HEAD, and the page height was stable across three consecutive runs (11,115px each). The baselines
had gone stale against a site that had moved underneath them — the same phenomenon as #27, over a
longer interval.

**Two corrections this leaves:**
1. The fingerprint must replicate the visual spec's mask before it can certify anything the visual
   net will later judge. Until it does, "0 moved" means less than it appears.
2. **Never diagnose from one instrument when a second disagrees.** The contradiction was the
   finding — chasing either number alone would have led to reverting a safe change (or shipping an
   unsafe one) for the wrong reason.

## 2026-07-31 — the audit that certified 10 pages and said "all pages"

James: *"Do all 72."* Widening `qa/layout-audit.mjs` from its own hand-typed 10-page list at a
hardcoded 1280 viewport to the full estate (69 pages × 1280 and 390 = 138 measurements) produced
two real defects and four instrument defects. The instrument defects are the more important half.

### 29 — a short page list reads exactly like a clean estate

`layout-audit.mjs` carried a private `PAGES` array of 10 entries and `viewport:{width:1280}`, and
on success printed **"✓ alignment contract holds across all pages"**. That sentence was true of 10
of 69 pages at one of two viewports, and was indistinguishable from an estate-wide pass. The audit
was never wrong; it was silent, which is worse, because silence is what a pass looks like.

**Fixed:** one shared `qa/estate-pages.mjs` exporting `ALL_PAGES`; `--all` runs the estate at both
viewports; `--assert` refuses to certify unless all 138 page/viewports produced bands.
**Rule:** an audit must never own its page list. Import it.

### 30 — two mobile-only defects that desktop evidence could not have found

- `.rd-trustband{padding:15px 24px}` added a gutter **on top of** `.rd-wrap`'s own, putting its
  content at 42px on mobile against everything else at 18px. Invisible at ≥1280 by arithmetic: the
  wrap hits its 1200px max-width and the surplus is absorbed by `margin:auto`, so content lands at
  72px either way. 4 pages.
- `.rd-foot-wrap` is a **second wrap class** with the same 32px desktop gutter that was never added
  to the `max-width:520px` rule — the footer sat 14px right of the body on **every page**. Invisible
  to the axis check as written, because both wraps are flush at `boxLeft:0`; only measuring the
  **content** edge (which the check's own comment always claimed it did) exposes it. 45 pages.

**Rule, now ALIGNMENT.md §1a:** the side gutter belongs to `.rd-wrap` alone. A band may set
vertical padding; it must never set horizontal.

### 31 — three false positives, all the same shape, all "position not set by margins"

A parent's 5px decorative **border** counted as its child's gap; an **inline-flex** link placed by
text flow measured as if margin-positioned; a `position:fixed` **sticky buy-bar** treated as a
content band (10 PDPs). Each is the grid/flex false positive from #3 wearing a new costume.

All three fixes **widen an exemption** — the change most likely to silently switch a check off. So
`qa/canary-alignment.mjs` now holds a genuinely off-centre block and a genuinely off-axis band
beside the legitimate patterns, and `canary.mjs` fails the build if either stops being caught.
**Rule:** proving a check went quiet is not proving it is right.

### 32 — three harnesses silently measured the LIVE theme for one page

`layout-audit`, `block-audit` and `css-fingerprint` all built ``` `${BASE}${path}?${PREVIEW}` ```.
For the one list entry carrying its own query — `/search?q=bamboo` — that yields
`/search?q=bamboo?preview_theme_id=…`, where the second `?` is literal and the id is swallowed into
the value of `q`. **The draft was never previewed; the live theme was measured and reported as the
draft.** Every past "clean" covering `/search` was a statement about live.

It surfaced only because a footer fix verified on 44 pages appeared to miss exactly one — the
asymmetry was the tell, not the failure itself. `estate-check.mjs` had always joined correctly,
which is the whole argument for one helper instead of four copies.

**Fixed:** `previewUrl()` in `qa/estate-pages.mjs`; canary asserts the **parsed** `preview_theme_id`
via `new URL()`, not the string.
**Rule:** a harness that quietly measures the wrong target is worse than one that crashes.

### The lessons

1. **Coverage is a claim.** "All pages" must name how many, at which viewports, and refuse to pass
   unless it measured them.
2. **A metric must measure what its comment says.** The axis check said "content" and measured
   border boxes for weeks.
3. **Read the summary statistic before believing it.** The visual diff's bounding box spanned the
   full page height, implying everything had moved; the changed pixels were in fact two clusters —
   the footer, and 105px of wordmark anti-aliasing. Acting on the bounding box would have started a
   hunt for a regression that did not exist.
4. **An asymmetry in a result is evidence.** 44 of 45 is not "nearly done", it is a question.

### 33 — two rules in this repo encoding opposite contracts, and neither audit could see it

Found by running estate-check after the alignment work: **T2 (one text axis, ≤8px) failed 27 times
across 7 pages**, having passed with 0 fails on 27 July. A `.rd-wrap.rd-mw-820px` measure column
was centred, putting its heading 190px in from every other band heading at 1568.

The cause was mine, twice over:
- `bbc-universal.css` already carried the correct axis rule, with a comment naming this exact
  +190px symptom.
- `bbc-align.css` (written this session) declared `margin-inline:auto !important` on
  `[class*="rd-mw-"]`, out-ranking it on both weight and load order.

**Neither alignment audit could have caught it.** `layout-audit.mjs` *excludes* `.rd-mw-*` from the
axis check by design (false positive #2) and runs at 1280/390, where the indent is smallest.
estate-check T2 runs at 768/1024/1568/1920 and does not exclude them. Two instruments, opposite
contracts, both "passing" their own definition.

**Resolved in favour of the axis** (James delegated: *"decide the best option for optimised
website"*). The deciding fact is that the indent is `(container − measure) / 2` and therefore not
constant — 19px at 768, 102px at 1024, 190px at 1568+. A deliberate typographic device is
proportional; an indent that is merely leftover space reads as sloppiness at one width and
misalignment at another. Nothing is lost: a measure box's benefit is LINE LENGTH (WCAG 1.4.8),
independent of horizontal position.

Verified: 8 pages × 4 viewports, spread 0px, measure still 820px, `text-align:left`.
Consequence accepted and flagged to James: wide media blocks inside a measure column now sit left
with white space to the right (34% at 1568, inside FORMULA §8's 40% dead-column limit). Per-band
opt-out is one class — `.rd-mx-auto`.

**Then the fix broke my own centring check**, which flagged 92 axis-aligned measure boxes as
"inset on both sides but not centred". That check's stated purpose is *things that CLAIM to be
centred but are not*; a box with `margin-right:0` makes no such claim. Exempted — narrowly, so a
`.rd-center` measure box that genuinely fails to centre is still caught.

**And the canary for that exemption reported DEAD — because the FIXTURE was wrong, not the check.**
The "known-bad" off-centre box was `width:600` with `margin-left:200` inside a 1000px content box,
which leaves both gutters at exactly 200: a perfectly centred box labelled broken. Had it passed
first time, the exemption would have been "confirmed" on evidence that was itself wrong.

### The lesson

**When two gates disagree, do not pick the one that lets you continue.** Three times this session
the disagreement *was* the finding: fingerprint vs visual net, layout-audit vs estate-check T2, and
canary vs fixture. A gate that agrees with you proves nothing; a gate that contradicts you is the
only one doing work.

## 2026-07-31 (later) — "our impact block on the home page CSS is clashing, why is it being missed"

James pointed at one band. It held four defects, each missed by a different mechanism, and the
answer to *why* turned out to matter far more than the band itself.

### 34 — the contrast gate went SILENT when the site changed

`estate-check` asserts on `axe.violations` and discards `axe.incomplete`. The home impact band's
eyebrow rendered `var(--subtle)` #384540 on #003C32 — **1.24:1, invisible**. axe did not miss it;
axe *declined* it:

    "Element's background color could not be determined due to a background gradient"

That reason appeared the moment `.rd-dark` gained its bloom/grid gradient — **a change I made
earlier the same session**. From then on axe could not compute the background on ANY dark band, so
every contrast finding there moved from `violations` to `incomplete` and vanished from the gate.
35 nodes on the home page alone sat in that blind spot.

**A gate that falls silent because the site changed is worse than one that fails: it reads as an
improvement.** Nothing went red. The number of violations went *down*.

**Fixed** with `qa/contrast-check.mjs`: render the page, hide the glyphs, sample the pixels
actually painted behind the text. axe reasons about the cascade and is right to refuse — the true
colour behind text on a gradient is not derivable that way. Measuring the *result* instead of the
*recipe* works for gradients, photographs, blend modes and overlays alike.

### 35 — building that check took FOUR false-positive classes of my own

Every one produced confident, specific, wrong findings before being caught:

1. **126 nodes at exactly 1.00:1.** `color:transparent` did not hide the glyphs, because this theme
   sets `-webkit-text-fill-color` (the report-link paint-over) which overrides it. The sampler read
   the text as its own background. *100+ nodes at a suspiciously identical ratio is an instrument
   fault, not a uniformly broken estate.*
2. **White footer links "on light grey".** A `*{...!important}` stylesheet rule loses to any author
   rule with a class, because !important ties break on specificity. Inline `setProperty(...,
   'important')` was needed.
3. **"builders trained" on rgb(227,227,227)** — bone text plainly legible on forest. Cause:
   `fullPage` screenshots make Chrome resize the viewport, so every `100vh` hero reflows and the
   coordinates measured beforehand no longer describe the image. Fixed by sampling viewport
   captures at successive scroll offsets — measure and sample in the SAME state.
4. **16 PDP findings inside a collapsed accordion.** Contents stay in the DOM with normal computed
   styles; the panel clips them with `max-height:0; overflow:hidden`. Checking the element's own
   `display`/`visibility` says "visible" for text nobody can see.

### 36 — what the honest check then found

14,995 text nodes across 69 pages × 2 viewports; **39 below WCAG AA**. The worst was not the
eyebrow James spotted but `/pages/programmes`: all five "how it works" step descriptions at
**1.04:1** — the copy explaining how the prison and school programmes run, invisible. Root cause
one line: `.rd-steps li p{ color:var(--charcoal) }`, a light-surface colour. **The line directly
above it already carried a `.rd-dark` variant for `border-top-color`** — the dark case was
considered and the text colour simply missed.

The other three impact-band defects were the same family of "component styled for paper, dropped
onto forest", plus a de-box that left `border-radius` and a `background` behind on elements that
had become bare rules.

### The lessons

1. **Ask what a gate does with the results it cannot judge.** `violations` vs `incomplete` is not a
   detail; it is the difference between a check and a comfort blanket.
2. **A gate going quieter is a finding, not a win.** Track the count of *undecidable* results, not
   only failures.
3. **Measuring the rendered result is harder than reading the source — and that is exactly why the
   source-reading checks were silent.** Four false-positive classes in one script is the price;
   paying it is not optional if the claim is "this text is readable".

## 2026-07-31 (later still) — standardising the case-study card across the estate

James: *"for casestudies we should have a standard block across all parts of the website … so the
same look"*, then *"populate all the other case studies … check the thumbnail and or integrated
video"*. Peer research (12 charity/social-enterprise sites + 6 published design systems) produced
`snippets/bbc-cscard.liquid`. What the work exposed:

### 37 — the divergence was hiding real WCAG failures, not just styling drift

Eight sections rendered the same `.rd-cscard` class four different ways. Underneath that:

- **No card had a heading element.** The title was `<span class="rd-cscard__inst">` in all eight.
- **"Read the story" was the link text on all seven Impact cards**, with seven destinations. WCAG
  2.4.4 counts only the ENCLOSING paragraph/list-item as programmatically determined context, so a
  descriptive sibling `<span>` does not qualify. The cards failed it.
- **Five of eight sections wrapped the whole card in `<a>`**, making the accessible name the entire
  card body — rejected by BBC GEL, the NHS service manual and Roselli alike.

The fix is the published pattern: heading contains the only card-level link; the card still feels
clickable via a stretched `::before`; the footer CTA is a `<span>`, never a second destination.

### 38 — three Shopify/Liquid traps, each of which failed SILENTLY

1. **Filters are not allowed in `render` arguments.** `url: settings.cs_url | default: '…'` does not
   error — the argument simply arrives blank. The flagship card rendered with no link and no CTA
   at all. Resolve defaults into a variable first.
2. **Shopify strips block settings that are not in the section schema AT SAVE TIME.** Templates
   were pushed before the sections carrying the new `outcome` field, so all ten headlines were
   silently dropped and every card fell back to its institution name. **Schema first, then
   template** — always.
3. **`gate-check.sh` does not validate Liquid syntax.** An unbalanced `{%- endif -%}` passed the
   gate and was caught only by the Shopify API on push. A push can also partially succeed: the CSS
   and snippet landed while the section was rejected, leaving the draft briefly mismatched.

### 39 — a crude script edit closed the wrong element, on two files at once

The migration searched for the FIRST `{%- endfor -%}` in each file with no start offset, so it
closed the **logo grid** with `</ul>` instead of the case-study grid. Both pages then rendered a
stray full-width `.rd-wrap`. Caught by the alignment audit (1 band off-axis), not by eye and not by
the Liquid tag-balance check — which counts Liquid tags, not HTML.

A follow-on trap: a naive tag-balance scanner also reports false positives, because it matches the
words `schema`/`comment` INSIDE comment prose. The authoritative Liquid validator is the Shopify
API itself.

### 40 — "check the thumbnail" found three content defects no gate would ever catch

- `/blogs/schools-and-education/southbank-utc-…` carries `lowdham-workshop-empty…` — a **prison**
  workshop photo on a school story. Dropped from the selection.
- **One photograph serves three case studies** (Macallan, Upcycle Brixton, Reed's School — all
  `SRW08823_*` variants of one shoot), two of them originally adjacent in the same row. Neither
  article has an alternative image in its body, so this needs a real picture, not a code fix.
  Mitigated by reordering; flagged for James.
- Reed's School's photo shows adults, not sixth-formers.

**The lesson:** image *correctness* is invisible to every automated check we have. `estate-check`
verifies an image loads; nothing verifies it shows the right thing. Any content population must
include a human look at every thumbnail.

### Status at handover — 4 of 7 pages standardised

Impact, Team Building, Schools, Build-to-Bond: `<article>`, heading links, zero wrapper anchors.
Remaining: **Why Bamboo** (its visible cards come from `build_gallery`, an instance of the generic
`bbc-section` — the migration of `bbc-why-bamboo-2026.liquid` was real but pointed at markup the
page does not use), **Home** (bespoke grid CSS, hardcoded cards — deferred deliberately), and
**About** (migrated, but the page has zero `story` blocks so nothing renders).

---

## 2026-08-03 — estate contrast sweep: 77 sub-AA nodes, three root causes, one self-inflicted regression

Full pixel-sampled sweep of 69 pages × 2 viewports: **77 below AA → 1** (and that 1 is an
instrument artefact, below). 15,428 text nodes measured. Everything here was measured, deployed
to draft `196820238710` through `gate-check.sh`, read back byte-identical, and re-measured.

### 41 — a matched colour pair split in half: the featured prison card rendered blank

`/pages/impact` had **32 nodes at 1.00:1** — foreground and background the *exact same* colour.
The whole text column of the featured Build-to-Bond card (the Sally Allsopp quote, the outcome
pills, "Read the full story") was invisible, at both viewports, and had been through a CRIT pass.

`bbc-statement.css` strips the card fill for the Impact page's borderless grid
(`.bbc-rd-impact .rd-cscard{background:transparent !important}`), but `[data-family="programme"]`
in `bbc-redesign-2026.css` pairs **bone text WITH a forest fill**. Remove one half of a pair and
the other half is left standing on the page's own bone.

**The lesson:** a background and a text colour set in different files are a single unit. Any rule
that overrides one must say what happens to the other. Only `programme` broke — `applied`
(steel+ink) and `recognition` (paper, no colour) degrade safely — so the failure is invisible
until exactly the wrong family lands on exactly the wrong page.

### 42 — a direct element match always beats inheritance (and the fix was worse, twice)

`bbc-foundation.css:363` sets a bare `p{color:var(--bbc-text)}`. A container can set light text
on a dark band and any nested `<p>` is silently reset to ink, because a directly-matching
selector beats an inherited value. On `/pages/why-bamboo` the hero lede is a `<p>` inside
`div.rd-lede`: the div computed `#eef3ec`, the `<p>` inside it computed `#14211C` on `#003C32`.

**Then the fix caused more damage than the bug.** Cut 1, `.bbc-rd p{color:inherit}` at (0,1,1),
outranked every single-class rule a page sets on its own paragraphs — including the legacy
size-guide's `.hero-subtitle{color:#fff}` at (0,1,0). Cut 2 named dark surfaces, and listed
`.bbc-rd .rd-dark p` — **the same (0,2,1) as the existing, correct
`.bbc-rd .rd-dark p{color:rgb(207,216,210)}`**. Equal specificity breaks on source order, so
being later in the file it replaced a good light colour with `inherit`, which resolved to the
press quote's own `rgba(7,62,39,.75)`: legacy forest on current forest at **1.01:1 on 16 product
pages**. Cut 3 targets only `.bbc-rd .rd-lede p`, the actual defect.

**The lesson:** when adding a defensive rule, grep for the selector you are about to write. If a
rule with the same specificity already exists, you are not adding a safety net, you are silently
replacing someone's decision. A broad fix for a narrow defect is a bug with better PR.

### 43 — two instruments disagreed, and the defect was geometry, not colour

Pillar text on `/pages/why-bamboo` read as ink-on-bone (~9:1) via the cascade and 1.08:1 on a
*photographic* background via pixel sampling. Both were right. `.bbcpl-media` carries
`aspect-ratio:16/10` (from `snippets/bbc-media.liquid`) and is a grid item that stretches to the
row height — so with `width:auto` the ratio resolved **width from height**: 1137px and 1329px
inside a 780px column, overrunning the text by 357px and 548px, with the absolutely-filled photo
painting under the copy. The reversed pillar also ran 387px past the viewport. `width:100%` makes
the ratio derive height from width, as intended.

**The lesson:** ESCAPES #28 said never diagnose from one instrument when a second disagrees. The
corollary: when they disagree, the disagreement itself is the finding. A colour checker and a
layout checker contradicting each other is what a layout bug looks like from the colour side.

### 44 — the gate was measuring things nobody can see (and the canary caught my fix)

7 of the 17 findings after the first fix pass were false: 6 were text inside **closed
`<details>`** — which keeps content in layout with computed `visibility:visible`, so every guard
in `contrast-check.mjs` passed it — and 1 was a button sampled while the theme's own fixed
`.bbc-sup__sticky` bar covered it. Proof for the last one is arithmetic:
`rgba(255,255,255,.96)` over forest `rgb(0,60,50)` is **exactly** the `rgb(245,247,247)` reported.

Both are now guarded: `checkVisibility({checkOpacity,checkVisibilityCSS})`, and a general
fixed/sticky overlay-intersection test replacing the hard-coded 76px preview-bar strip.

**But the first cut of the overlay guard matched on `position` alone**, which caught the *closed
cart drawer* (`.drawer.is-empty`, fixed at 0,0,1280,900) — so "covered by an overlay" was true
for all 229 nodes and the run certified **nothing**, reporting `measured 0`. `--canary` caught it
immediately. Overlays now additionally require visibility, opacity and a non-transparent
background.

**The lesson:** every exclusion added to a gate is a chance to stop measuring. The canary is not
ceremony — it is the only thing standing between "we fixed the estate" and "we blinded the tool
and called it green". Run it after *every* exclusion, including the ones that look obviously safe.

### 45 — FOUR audits wrote every run into a hardcoded evidence folder

The scope guard (narrow run must not clobber a broad one) was in place; the **date** was the
literal string `'2026-07-31'` at two places. So every run after 31 July silently overwrote that
day's evidence — and the tool could never satisfy `gate-check.sh` step 5, which requires evidence
under *today's* date. My own first sweep destroyed the 31 July file before I noticed. Now
`new Date().toISOString().slice(0,10)`.

**The lesson:** a guard against one collision axis reads as a guard against collision. The
comment above it described the danger accurately and still missed the axis it did not name.

### Known instrument limitation, still open

`/pages/support-mission@390` reports the "Talk to James about funding" button at 1.27:1. Measured
directly it is `rgb(230,220,200)` on its own `rgb(0,60,50)` fill — **~9:1, in both mobile and
desktop emulation**. The overlay guard does not always fire for it. It is the only finding left
in the estate and it is not a defect; do not "fix" the button.

**Scope correction (same day):** this was not one tool. `contrast-check.mjs` ('2026-07-31'),
`block-audit.mjs` ('2026-07-29'), `layout-audit.mjs` ('2026-07-29') and `sameness.mjs`
('2026-07-28') all hardcoded their evidence day. Every run of any of them since those dates
silently overwrote that folder — and I destroyed two historical files myself (the 31 Jul contrast
estate file and the 29 Jul block-audit file) before spotting the pattern. All four now use
`new Date().toISOString().slice(0,10)`. A run's evidence is now filed under the day it ran.

### 46 — "14 classes drift" was mostly components doing their job

The block and type audits group by ONE class name, so a component with variants reports several
values and reads as broken. Checked properly (full class list + owning band, per instance):

- `.rd-card` radius 0/12/6px = the de-boxed Impact treatment, the base card, and `.rd-stamp`.
  Three deliberate variants.
- `.rd-q` 22px = an explicit `.rd-fs-clamp18px2vw22` modifier on PDPs (19 instances); 28px is
  the norm (27 instances); 42px is a page-scoped `!important` on Impact.
- `.rd-big` 21 vs 24px and `.rd-sm` 14 vs 15px = `.rd-loop .rd-step` vs `.rd-jt` — the same
  utility class inside two different components, which is a design system, not drift.
- Every `textAlign` entry (rd-eyebrow, rd-lede, rd-big, rd-sm, bbc-press*, rd-loop) is a band
  opting into centring, which ALIGNMENT rule 7 explicitly permits — "hierarchy, not uniformity",
  itself a correction of an earlier pass that made the estate worse by enforcing uniformity.

**Two were real, and both are fixed:** `.rd-body` rendered 14px on /pages/gallery and 18px in
171 other instances, because a `<figcaption>` wore the body class with an inline font-size — it
is a caption, now `.rd-gal__cap` on the caption token. And `.rd-cta-row` declared
`display:flex; gap:14px` ONLY inside `.rd-hero`, so its 12+ uses elsewhere were plain block divs;
`bbc-teambuilding-2026.liquid:130` had been asking for `rd-jc-center` on a block element, where
justify-content is inert, so that centring had never once worked.

**The lesson:** grouping by class name cannot tell a variant from a defect. Before "fixing"
drift, print the full class list and the owning band for every instance — the modifier that
explains it is usually right there. ESCAPES #12 learned this once already; the audits still
report it this way, so it will keep needing to be re-learned unless they carry the modifier.

---

## #41 — A surface system that has never once rendered (2026-08-04)

**Escape.** `.rd-paper`, `.rd-steel`, `.rd-dark` and `.rd-forest` were written as descendant
selectors — `.bbc-rd .rd-paper { background: var(--paper) }`. `bbc-section.liquid` emits both
classes on the **same element**: `<div class="bbc-rd rd-paper">`. A descendant selector cannot
match a single element, so those bands never received a paper, steel or dark background. Every
one fell through to `.bbc-rd { background: var(--bone) }`.

**Scope — measured, not assumed.** This hit only pages assembled from **generic** band sections.
Bespoke `bbc-<page>-2026` sections nest their bands inside the wrapper, so the descendant
selector matches and they were always correct:

```
/pages/impact      surface on the .bbc-rd element: 0   nested inside it: 8   → always worked
/pages/why-bamboo  surface on the .bbc-rd element: 6   nested inside it: 1   → 6 of 7 flat
```

That is the whole explanation for "why does Why Bamboo look different from Impact". Not type,
not tokens, not spacing — Impact's bands were nested and Why Bamboo's were not.

**How long.** Since the rules were written. Not a regression — it never worked.

**What it cost.** `/pages/why-bamboo` measured seven repeated surfaces against Impact's two, and
the fix looked like a template job. It was not: the template already alternated correctly. Every
session that "fixed the alternation" by editing template JSON changed a value that the CSS then
threw away. This is the single largest contributor to the sense that the work was going in
circles — the page genuinely did not change, no matter what was edited.

**Why nothing caught it.** Every check we own asks *does this node meet contrast* or *is this
type role consistent*. Bone passes contrast. Bone is on-palette. `page-standard.mjs` counted the
repeats and reported them accurately for two days; nobody asked **why** a template that
alternates renders flat, because the template was the obvious suspect and it reads correctly.

**The generalisable rule.** When measured output contradicts source that reads correctly,
suspect the selector, not the content. Specifically: **a class the section emits as a sibling of
`.bbc-rd` must be styled with a compound selector.** Before writing `.bbc-rd .x`, check whether
`.x` is ever emitted on the `.bbc-rd` element itself.

**Canary.** `qa/page-standard.mjs` samples the *computed* background of every band, so it fails
the moment a surface stops resolving. It reported `rd-paper -> rgb(230,220,200)` before the fix
and `rgb(241,233,216)` after — the same probe that found this is the one that guards it.

---

## #42 — I reported empty bands that were my own screenshot artefact (2026-08-04)

**Near-escape, caught before any edit.** A full-page capture of `/pages/why-bamboo` showed
several bands as near-black rectangles with large blank areas, which read as failed images and
missing headings. It was about to become a bug report.

The page is fine. `fullPage: true` stitches a scrolled capture, and the reveal animations use
`animation-timeline: view()`. Elements outside their entry range paint at their start state —
opacity 0, translated. Scrolling the page first to force lazy images to load makes it *worse*,
because every element is then behind its trigger.

**Confirmed by DOM before acting:** images `complete`, `naturalWidth` 1500, headings present.
An in-view element screenshot showed a correct, well-built pillar.

**Rule.** `fullPage` is unusable as evidence on any page with scroll-driven reveals. Screenshot
the element after `scrollIntoViewIfNeeded()` plus a settle wait. This is the third time a
scroll-position artefact has produced a false defect report (see the stuck-reveal false positive
of 2026-08-03); the difference this time is that it was checked against the DOM before anything
was "fixed".

---

## #43 — My own conformance check invented the gap it was measuring (2026-08-04)

**Escape.** `page-standard.mjs` scored rule S1 ("every non-hero band opens with an eyebrow") by
testing `querySelector('.rd-eyebrow')`. `bbc-pillar` and `bbc-statement` render an eyebrow under
their own component class — `.bbcpl-idx` (the "— 01 the science" rule + number + kicker line) and
`.bbcst-eyebrow`. Four bands on `/pages/why-bamboo` were scored as failures while displaying an
eyebrow on screen.

**What it cost.** `/pages/why-bamboo` was published as **S1 50%** in `PAGE-STANDARD.md` and
`SITE-SYSTEM.md`. Its real figure is **83%**. Home was published at 90%; it is 100%. Worse, both
documents used "opens only half its bands with an eyebrow" as evidence that the page's assembled
architecture was the problem, and cited that as justification for migrating its content into a
bespoke section. A false measurement was the load-bearing argument for a large piece of work.

**How it was caught.** By accident, and only because of an unrelated task: an in-view screenshot
taken to check something else clearly showed "— 01 the science" in a band the report called
eyebrow-less. Nothing in the QA system would have found it — the check was self-consistent, ran
clean, and produced a plausible number every time.

**The generalisable rule, and it is the same one as #41 one level up.** #41 said: when measured
output contradicts source that reads correctly, suspect the selector. This is that rule applied
to *our own instruments*. A conformance check that hard-codes one class name is not measuring the
design rule, it is measuring a naming convention — and a design system with per-component classes
will fail it silently and forever.

**Concretely:** any check asserting a *design* property must enumerate every class that satisfies
it, and should be spot-checked against a rendering before its number is published anywhere. Two
of the last three false conclusions in this project came from trusting a number over an image.

---

## #44 — the same artefact as #42, a different mechanism, and the fix that ends it (2026-08-18)

**Near-escape, caught before any edit — but only just.** Capturing `/pages/why-bamboo` for the
rebuild, the accessibility pillar's whole media half and every card in the build gallery came out
as flat dark rectangles. `bbc-rd-frame-build.jpg` was about to be reported as a broken asset, and
I had already started reasoning about a fix to `bbc-media`'s fallback branch.

**It was not a broken asset.** The file is present on the theme, the CDN returns `200` with
389 KB of valid JPEG, and it decodes to 1600×1200. What failed was my capture: the script scrolled
the page in 700px jumps 90ms apart to force lazy images in, then screenshotted. Fast programmatic
scrolling outruns lazy-loading — the browser never commits to fetching an image that was only
briefly near the viewport. Reloading and scrolling at a human pace (200px steps, 260ms apart, then
a settle) loaded it every time, and flipping `loading="eager"` on the stalled element loaded it
instantly.

**Not the same cause as #42.** #42 was reveal-animation start-state under `fullPage`. This is
lazy-load starvation. Same symptom, same page, same wrong conclusion available — which is the
point: "band renders black" has now had two distinct innocent causes and zero real ones.

**Rule — make the capture prove it, don't trust the pixels.** Any screenshot script used as
evidence must, before capturing: set `loading = 'eager'` on every `img`, await each one's
`load`/`error`, and then assert that zero images have `naturalWidth === 0` — printing the list if
any remain. `qa/`-adjacent capture scripts now do this and log `all images loaded` or a named
list. A capture that cannot state that images loaded is not evidence, and a black band in one is
a claim about the script, not the page.

**Cost of the near-miss.** Roughly an hour of investigation, and it very nearly produced a
"fix" to `bbc-media` for a bug that does not exist — which would have shipped real risk to every
image on the estate to solve an imaginary one. Fourth scroll/paint artefact in this project
(2026-08-03, #42, and a stuck-reveal false positive before it).

---

## #45 — block-audit reports 22 "drifting" classes and none of them is drift (2026-08-18)

**A gate that cries wolf, found while answering "are all pages on the correct blocks?"**
`block-audit.mjs` measured 288 classes across 11 pages and reported **22 drifting on a layout
property**. Every structural one was traced to source. All six are deliberate:

| reported "drift" | what it actually is |
|---|---|
| `rd-card` radius 0/6/12px, border none/2.5px/1.5px | three documented variants: base card, `.rd-stamp`, and `.rd-grid .rd-card.rd-stamp` de-boxed in grids. The CSS comment at bbc-redesign-2026.css:222 records that de-boxing `.rd-stamp` *globally* was tried and rejected as "too wide a blast radius" — the narrow rule is the fix, not the bug |
| `rd-step` padding + radius | `.rd-loop .rd-step:last-child` is the lime payoff step ("You build → Profits fund → **A life changes**") |
| `rd-stagger` gap 24 vs 28px | the gap comes from the container — `.rd-grid` vs `.acc-cards`. `rd-stagger` is a motion utility, it sets no gap |
| `rd-stat` padding 0 vs 40px 0 0 | `.rd-stats.rd-dim` is the tick-marked variant; the padding makes room for the tick rule |
| `bbc-media__img` radius 0 vs 14px | media inside `.acc-cards` is rounded to match the card |
| `textAlign` centre vs left (most of the 22) | the per-band `align` setting. A band is allowed to be centred |

**Why this is the same defect as #43, pointing the other way.** #43 was a check that measured a
class name and *invented* a gap. This one measures a class name and invents *drift* — because
`.rd-card` is not a component, it is a shared root class that three components extend. Grouping by
class name conflates them by construction, so the number can never go to zero and nobody will ever
read the report. A gate whose output is 100% false positives is off, whatever it prints.

**Rule.** A conformance check must group by the **full class signature** an element carries (or
explicitly enumerate the variant modifiers it expects), not by one class in the list. Until
block-audit does that, treat its count as a list of *places to look*, never as defects — and do
not "fix" anything it reports without first tracing the rule that produces the value.

**What the estate actually scores**, measured the same afternoon: census 69/69 OK · anatomy
conformance all OK · editability 0 findings across 25 sections · band-grammar OK · page-standard
0 pages outside the standard. The pages are on the correct blocks. One gate just says otherwise.

---

## #46 — I broke three untouched pages by claiming a class name that was taken (2026-08-19)

**Caught by the visual suite, not by me.** The why-bamboo "material, drawn" rebuild added a
positioned dimension callout and I named its class `.rd-dim`:

```css
.bbc-rd .rd-dim{ position:absolute; ... }
```

`.rd-dim` was already the estate's **dimension-tick modifier for stat rows**
(`bbc-redesign-2026.css:713`, `.bbc-rd .rd-stats.rd-dim`). Absolutely positioning it collapsed
the stat rows on `/pages/our-story-2` and both kit PDPs — **three pages this work never touched**
— each losing 160–380px of height. Every targeted gate stayed green: geometry 0, consistency
15/15, contrast clean, page-standard 100%. They all check the page you are working on.

**Worse: the component already existed.** `bbc-consistency-2026.css:381` has `.rd-dim-callout`
(+ `.rd-dimwrap`), the estate's dimension callout, already used by the Band split variant. I had
built a second one and given it a colliding name. The fix was to delete mine and add a
positioned modifier to theirs — which is also why the callout now looks identical to every other
callout on the site, instead of merely similar.

**Rule, and it is two rules.**
1. **Grep the class name before you claim it.** `grep -rn "\.rd-yourname\b" assets/` costs one
   second. A new class that collides with an old one is indistinguishable from a CSS bug on
   pages nobody is looking at.
2. **Grep for the component before you build it.** Search the CSS for what the thing *does*
   ("callout", "badge", "tick") — not the name you were about to give it. The estate is large
   enough that the thing you need usually exists.

**Why the gates could not have caught it.** Page-scoped checks pass by construction when the
damage is elsewhere. The estate-wide pixel diff is the only instrument that sees it, and it only
sees it because baselines exist for pages nobody edited that day. That is the argument for
running the full visual suite before commit, not just the page you changed.

---

## #47 — layout was an accident of copy length (2026-08-19)

**Found by looking, prompted by James: "improve the consistency and layout"** on the
"real people, real builds" band of /pages/our-story-2.

`bbc-cscard` derived each card's grid size from its own content:

```liquid
{%- elsif _len > 150 -%}{%- assign _auto = 'tall' -%}   {# grid-row: span 2 #}
```

So a blurb of 151 characters produced a double-height card and one of 149 did not. Card
size — a layout decision — was being made by an incidental property of the copy. The band
was rendering cards at 226, 314, 468, 540, 636, 663 and 696px in the same three-column
grid, with dead gaps beside the tall ones where a neighbouring card stretched to fill.

Nobody wrote a bug. The rule was added deliberately (2026-08-01, "long copy needs the
height rather than being cramped") and it reads as reasonable. It only fails at the scale
where content varies freely, which is exactly what a blog-fed band does.

**Removed the length rule.** What remains is deliberate and stable: no media → `flat`,
video → `wide`, everything else → `unit`, with an explicit `size` override for an editor
who wants a specific card to lead. Six pages use the mosaic (our-story-2, prisons,
programmes, support-mission, theory-of-change, workshop) so all six get steadier rows.

**Then the band itself dropped the mosaic.** Even with sizing fixed, a `wide` video card is
two columns AND taller than its neighbour, so whatever sits beside it stretches. /pages/impact
— the estate's other case-study wall, same component — uses the plain uniform grid and reads
cleanly. Same job, same layout: `stories_mosaic: false`. The band lost ~1,000px of dead
space and its CTAs now align across every row.

**Rule.** Never derive a layout property from a content measurement that authors change
freely. Tie it to something the author chooses on purpose — a setting, a variant, a media
type — or the design drifts every time somebody edits a sentence.

---

## #48 — a schema label that promised "blank hides", and a `| default:` that made it a lie
*2026-08-19 · sections/bbc-home-2026.liquid*

James asked for four things off the home hero: "Enhanced-DBS facilitators · public-liability
insured" and "BBC training & customer records". Both are settings. Both looked like a
two-field job in the theme editor. Neither could be cleared there.

```liquid
{{ section.settings.hero_proof_src | default: 'BBC training & customer records' }}
{%- assign _cred = section.settings.hero_cred | default: 'Enhanced-DBS facilitators…' -%}
```

Liquid's `default` fires on an EMPTY string, not just a missing one. So blanking the field
in the editor, saving, and reloading leaves the old line on the page — the fallback fills the
hole you just made. `hero_cred`'s schema label literally read **"Hero trust line (blank
hides)"**. It did not hide. The label documented an intention the code contradicted, which is
worse than no label: it tells the editor the thing they just tried should have worked.

**Fix.** Drop the Liquid fallback and gate on `!= blank`, so blank means blank. The schema
`"default"` still populates a newly added section — that is the right place for a default,
because it applies once at insert time instead of overriding the author forever.

**Rule.** `| default:` on an editable setting is a value the author cannot delete. Use it only
where empty is genuinely impossible; anywhere else put the default in the schema and let blank
mean blank. If a label claims blank hides, that claim is a test — write it.

**Also caught, by the guard rather than by me.** The first attempt cleared the values by
parsing `templates/index.json`, editing, and re-serialising. Its own diff check refused the
result: `JSON.stringify` drops Shopify's `\/` escapes, so nine unrelated URL lines would have
been rewritten. Byte-identical semantics, but hard rule #4 is about not rewriting this file at
all. Raw-string replacement of the two values touched 2 lines and nothing else. A guard that
only allows the diff you predicted is worth more than one that checks the result parses.

---

## #49 — the page answered the brochure, not the email
*2026-08-19 · templates/product.kit-gravel.json · the kit PDP rebuild*

The gravel PDP was 14,331px on desktop and 21,418px on mobile across eleven
full-width marketing bands. It read as a confident page. A probe with every
accordion forced open found it carried **no** tyre clearance, **no** hub spacing,
**no** brake standard, **no** bottom-bracket spec, **no** cable routing, **no**
rack mounts, **no** frame weight, **no** rider-weight limit, and not one instance
of the words customs, duty, import or VAT — on or off the page, including the
policy pages.

The vault has all of it. `Business/Sales Intelligence — Email Archive Mining.md`
ranks 34,300 mined customer emails: shipping/delivery ~1,170, sizing ~730,
tools ~720, price ~560, durability ~460, customs/VAT ~740 combined, and component
compatibility "arguably the true no.1 by reading volume". About 80% of kit sales
are international. The page over-served tools and build-time — three separate
bands each — and omitted the top two themes entirely.

**Rule.** Length is not the defect; composition is. Before adding to a long page,
count what it already answers against what people actually ask. A page can be
enormous and still be thin.

---

## #50 — a claim that passed the linter and broke the register
*2026-08-19 · same page*

The PDP carried a stat block reading **"Swansea · University tested"** and an FAQ
saying the frames are "independently tested at Swansea University" and "with
proper care they last for years."

`System/Claims Register.md` says, in terms: *"Do not describe a home-build adult
frame as tested, safe or compliant from historical material/frame research
alone."* Swansea tested the bamboo **tubing** to BS ISO 22157:2019. It did not
test a frame a customer glued together at home — and PS-001, an open incident, is
an adult frame that separated at multiple joints on its first ride.

claim-lint passed the page. It carries `stronger than steel`, `28,000 PSI`,
`nationally recognised`, `100% completion` — a list of banned *phrases*. This
claim used none of them. It was built from true components: the lab is real, the
standard is real, the figure is real. What was wrong was the **subject** — a
material result presented as a product result.

Replaced with James's own wording from `Projects/FAQ Rewrite 2026-08-19.md`, plus
the boundary the register implies: the tubing figure, then "that figure is for the
tubing we supply, not for a finished frame: how strong your bike ends up is
decided by your joints."

**Rule.** A phrase blacklist cannot catch a true sentence about the wrong subject.
When a claim moves from material to assembly, from one site to an organisation, or
from a cohort to a population, the words can stay identical while the claim stops
being supported. Those need a human read against the register, not a regex.

---

## #51 — three cuts that did nothing, and one that half did
*2026-08-19 · same rebuild*

Trimming the page, I blanked six settings to remove a duplicated Q&A band:

```python
for k in (...):
    if low["settings"].get(k): low["settings"][k] = ""   # <-- silently a no-op
```

The keys were **absent** from the template — the band was rendering from its
schema defaults. `.get(k)` returned None, the guard skipped, nothing was written,
and the band came back 829px tall on the next render. An absent key and an empty
key look the same in a diff of the template and behave in opposite ways: absent
falls back to the schema default, empty suppresses. The fix was to assign
unconditionally.

The same session produced the mirror-image of this in the home hero (#48), where a
Liquid `| default:` made an *empty* value behave like an absent one. Same root
confusion, opposite direction.

**Rule.** In Shopify templates, "blank it" and "remove it" are different
operations with different results. Deciding which you mean is part of the edit,
and the only proof is a re-render — not the diff.

---

## #52 — the featured story was also the first card under it
*2026-08-19 · sections/bbc-impact-2026.liquid · the evidence-wall slider*

Turning the flagship case study into a rotating slider meant promoting four stories
into `feature` blocks. The stories they were promoted *from* stayed in the wall — so
the page showed the UCL cargo-bike slide and then repeated it, same image and same
headline, as the very first card beneath it.

Nothing in the build flagged it. The slider was correct, the wall was correct, and
each was tested on its own: four slides, six cards, all four sectors present. The
defect only exists in the relationship between them, which is exactly what a
component-level check cannot see. It took a screenshot of the finished region.

**Fix.** The wall skips any story whose URL appears in a feature block, and the
"show all N" count skips them too — otherwise the button promises more than it can
reveal. Matching on URL rather than a hand-set flag means promoting or demoting a
story in the editor keeps working with no second place to remember.

**Rule.** When you promote content into a new position, the old position is now a
duplicate until proven otherwise. Check the finished page, not the two components.

---

## #53 — the accessible choice was also the deterministic one
*2026-08-19 · same slider*

An auto-rotating carousel is a classic source of flaky screenshot tests: capture at
6.9s and 7.1s and you get different pages. The impact visual baselines are full-page
captures that take several seconds, so this looked like a test I was about to make
unreliable.

It is deterministic, and for free. `qa/visual.spec.mjs` runs with
`reducedMotion: 'reduce'`, and the slider honours `prefers-reduced-motion` by never
starting the timer — written for readers with vestibular sensitivity, not for the
test suite. Verified both ways: under `reduce` the slide is unchanged after 16s and
the pause control is hidden; under `no-preference` it advances two slides.

**Rule.** Autoplay respecting the OS motion preference is not only correct for
readers — it is what makes the component testable. If a motion feature is hard to
screenshot deterministically, check whether it is honouring reduced-motion first.
The bug is usually there.

---

## #54 — a decorative rule outlived the thing it was decorating
*2026-08-19 · assets/bbc-statement.css · the impact evidence grid*

James: "the top is changing height and the bottom is straight — align correctly."

Two separate causes, neither visible in the code I had just written.

**The cascade.** `bbc-statement.css` carried:

```css
.bbc-rd-impact .rd-csgrid > :nth-child(2){ margin-top:clamp(40px,6vw,80px); }
.bbc-rd-impact .rd-csgrid > :nth-child(3){ margin-top:clamp(20px,3vw,40px); }
```

Written when the big featured card was the grid's FIRST child, so the next two dropped
away from it in a deliberate editorial diagonal. Moving the featured card into its own
slider left the rule staggering three ordinary cards against nothing: row one began at
y3376, y3416, y3456. The CSS was never wrong; its premise moved out from under it, and
the file that changed was a different one in a different language.

**The stretch.** `align-items:start` let each card keep its natural height, so a 454px
card sat beside two 600px ones. Nothing in the DOM says a row is uneven — it took
measuring every card's top and height and grouping by row.

**Rule.** When you move an element out of a container, grep the stylesheets for
positional selectors on that container — `:nth-child`, `:first-child`, `+`, `~`. They
encode an arrangement, and nothing warns you when the arrangement changes.

---

## #55 — the fix for one thing quietly disabled another
*2026-08-19 · same edit*

The alignment fix added `display:flex` to `.rd-cscard-item`. The rule that enforces the
six-card cap is `[data-evwall] [data-overflow][hidden]{display:none}`. Both are three
selectors of specificity; `bbc-statement.css` loads later; `display:flex` won.

All 28 capped cards were painted again and the page went from 8,382px back to 14,743px
— undoing the entire point of the change James had asked for one message earlier. The
cards still carried `[hidden]`, so every functional check I had written kept passing:
"shown 6" counted the attribute, not the pixels. What caught it was an unrelated number
in an unrelated test — the page height in the slider-jump probe reading 14,743 when it
should have read ~8,400.

Fixed twice over: `:not([hidden])` on every layout rule, and the hide rule promoted to
`display:none !important`, because whether a card is on the page is not a layout
decision and must not be settled by cascade order.

**Rule.** `[hidden]` is a contract, and any bare `display:` on the same elements can
break it silently. Guard layout rules with `:not([hidden])`. And assert on rendered
geometry, not just on attributes — an element with `hidden` that still paints will pass
every check that asks the DOM instead of the box.

---

## #56 — a logo wall makes a claim without words
*2026-08-19 · sections/bbc-impact-2026.liquid · /pages/impact #backers*

Five marks sat in one row under **"backed by & accredited by"**. Checked against
`System/Claims Register.md`, only two of the five were backers:

| Mark | What it is |
|---|---|
| Investec Beyond Business | 2025 winner, £24,000 — a funder |
| National Lottery Community Fund | Pedal Forward, £18,000 — a funder |
| OCN London | the awarding body — an accreditor, not a backer |
| HMPPS | a **customer**: programmes run under direct contracts. The £120k bid is drafted, not won |
| London South Bank University | the register allows only *"access to a room with jigs in LSBU's engineering labs in late 2025"*. The 5 Aug 2025 agreement has **blank LSBU signature fields**; no award, invoice or delivery record exists |

The register already prohibits "LSBU £70,000 equipment investment", "LSBU Innovation
Hub" and any current LSBU delivery site. A logo under "backed by & accredited by"
asserts the same relationship without writing a sentence — so none of the wording
gates could see it. claim-lint reads text; nothing reads a row of images against what
each image is entitled to say.

**Fix.** Each block declares its relationship and the band renders a labelled group
per relationship: funded by / accredited by / delivered with. LSBU removed. The
grouping is the honest fix and also the layout fix — it gives the row the structure it
never had, and every mark now sits on a tile of identical size instead of at whatever
dimensions its source file happened to be.

**Also.** Two verified Timpson quotes exist. The band ran the general one — *"Finding
employment after release reduces the chance of reoffending…"* — alone, four lines deep,
under the heading "who backs it". It is verbatim and correctly attributed, but it is
about government policy and never mentions BBC. The one that does *("Innovative
projects such as Build to Bond…")* now leads, with the policy line beside it as
context.

**Rule.** Audit logo walls the way you audit sentences. Ask what each mark is entitled
to claim, and label the group so the page cannot be read as claiming more.

## 2026-09-02 — Site-vs-Vault review: eleven live breaches under green gates

| What escaped | Where (live) | Found by | Gate that should have caught it | Assertion added |
|---|---|---|---|---|
| Feltham named as a live site | impact-report, support-mission | vault review | claim-lint / estate-check (no pattern) | `/\bFeltham\b/` + canary fixture |
| "4 prison sites running" vs "five" | support-mission vs prisons/impact | review | nothing compared pages | live-check `prison-site-count` contradiction |
| "Level 1 … OCN approval in progress" ×5 | schools, FAQ, impact-report, toc, support-mission | review | claim-lint (only `Level 1 & 2` banned) | `/\bLevel 1\b(?! ?& ?2)/` |
| "independently tested" + "last for years" on PDPs | gravel-lugged, road (and 6 more kit templates) | review | claim-lint — true-parts/wrong-subject (19 Aug) | patterns + canary |
| "36 countries" | gravel PDP stat block | review | estate-check had the pattern but was never run on live PDPs; FAQ was **waived** | waiver removed; live-check no-waiver rule |
| "six Makers" | FAQ, support-mission | review | no pattern (open decision D2) | `/\b(six|6) Makers\b/` |
| Timpson present-tense / paraphrased quote | impact-report | review | nothing checked attribution form | live-check `timpson-attribution` UNDATED = FAIL |
| "rideable" ×3 pages | teambuilding, programmes, toc | 7 Aug audit asked for it; never added | claim-lint | `/\brideable\b/` |
| "Enhanced-DBS facilitators" ×4 | prisons, schools, teambuilding, speaker | 27 Aug note flagged it | no register row, no pattern | `/Enhanced[- ]DBS/` |
| "10% of profits" | support-mission hardcoded fallback | review | claim-lint reads source — it was a `default:` in Liquid nobody grepped | pattern + fallback rewritten |
| "BBC Education CIC" | schools | review | no pattern | `/Education CIC/` |
| `qa/README.md` quoted stale canon (36 countries, Level 1 Award) | repo doc | review | — docs copied the canon | README now points at the Register only |
| "rated the day 9–10/10" | impact (Project Zero story blurb + councils flow) | review of the preview build, 2 Sep | banned-claims.mjs had the pattern since 31 Jul but live-check was never run on /pages/impact after the 27 Aug refocus | fixed on the preview template; live fix rides with the impact v2 rollout |

**Rule reinforced.** A pattern list only catches what someone already wrote down; the live-check contradiction lane catches the class (two pages, two answers) without needing the words in advance.
