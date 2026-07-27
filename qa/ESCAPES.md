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
