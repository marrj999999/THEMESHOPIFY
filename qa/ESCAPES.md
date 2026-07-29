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
