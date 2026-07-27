# R1 — the length finding, corrected
*2026-07-27 · `node qa/benchmark-page.mjs --set=<type>` now records total / chrome / main separately*

## What I reported, and why it was wrong

I told James five of six page types run **2.9–4.7× the field on word count**, called it a
house-wide length problem, and proposed a content-cutting programme across seven pages.

That measured `document.body.innerText`, which counts **navigation as page copy**. Our header
carries **813 words and 54 links** in a mega-menu that sits in the DOM on every page inside a bar
111px tall. Peers carry 52–314 words of chrome; we carry ~946 on every single page.

## The corrected picture

| Page type | Our main | Peer median | Ratio | **Our chrome** | Peer median | **Ratio** |
|---|---|---|---|---|---|---|
| PDP | 1,357 | 751 | 1.8× | 942 | 139 | **6.8×** |
| Schools | 642 | 339 | 1.9× | 946 | 120 | **7.9×** |
| Programmes | 850 | 440 | 1.9× | 946 | 71 | **13.3×** |
| Impact | 1,336 | 545 | 2.5× | 946 | 107 | **8.8×** |
| Collection | 204 | 781 | **0.3×** | 946 | 135 | **7.0×** |
| **Average** | | | **1.7×** | | | **8.8×** |

**Page copy averages 1.7× the field median — moderately long, not a crisis.**
**Chrome averages 8.8× the field median. That is the outlier.**

## What actually changes

**1 · The programme I proposed was largely wrong.** Rewriting seven pages to cut copy would have
attacked a 1.7× problem while ignoring an 8.8× one. Schools at 642 words against Greenpower's 170
is still worth trimming; programmes at 1.9× is mid-pack once Switchback (1,517 main words — nearly
twice ours) is in view. **Collection is 0.3× — genuinely lean.**

**2 · One fix beats seven.** The header is a single component on every page. Reducing a 54-link
mega-menu would do more for perceived weight across the estate than rewriting every page's copy,
and it is one piece of work rather than seven.

**3 · But I still cannot recommend the nav change.** Changing navigation without click data is
guesswork, and analytics is exactly what is blocked: GA4 returns zero properties, GSC zero sites,
and the Shopify analytics MCP fails on every call. **This is now the single strongest argument for
unblocking analytics** — it is the difference between a defensible change and a guess on the most
impactful component on the site.

**4 · The impact page is the one genuine copy outlier at 2.5×** — and it is also where our mission
language leads the field (42 mission-words, highest in set). Worth trimming, carefully.

## Why this took a correction to find

The original metric was cheap and looked authoritative. It produced a large, confident, actionable
number — and the action it implied was mostly wasted work. It was caught by asking *where are those
words?* rather than accepting the total.

This is the seventh crude-measurement correction of the week, and the pattern is consistent enough
to be a rule: **a proxy that aggregates is a proxy that hides.** Totals conflate; the fix is always
to decompose before acting.

## Status of the targets set from the old metric

The targets in `cic-benchmark.md` and `page-comparison-plan.md` were derived from total words and
are **superseded**. New targets, from main content only:

| Page type | Main words now | Target | Basis |
|---|---|---|---|
| Impact | 1,336 | ≤800 | 2.5× → ~1.5× median |
| PDP | 1,357 | ≤1,000 | 1.8× → ~1.3×, allowing for a considered purchase |
| Schools | 642 | ≤450 | 1.9× → ~1.3× |
| Programmes | 850 | hold | already mid-field once Switchback is counted |
| Collection | 204 | hold | leanest in its set |
| **Chrome (all pages)** | **946** | **≤300** | still 2× the peer median — deliberately conservative, and needs analytics first |
