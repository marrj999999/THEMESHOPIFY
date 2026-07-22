# Shopify CSS best practice — research (2026-07-13)

Sources: shopify.dev (section-assets, best-practices), BlackbeltCommerce "Custom CSS Shopify Guide 2026", Ecom Panda "Dawn Customization 2026", Johnny Taft "Dawn technical breakdown".

## What Shopify recommends (the target architecture)
1. **Component CSS lives INSIDE its section/block/snippet** via a single `{% stylesheet %}` tag per file. Shopify bundles all of them into one `styles.css`, injects it once via `content_for_header`, **deduplicates per file**, and **subsets per page** — each page only loads the CSS of components in its render tree. → No cross-page conflicts, no unused CSS, automatic scoping.
2. **Design tokens = CSS custom properties in ONE place.** Override Dawn's variables (colours, type, spacing) in a single custom file; they cascade to every element. "Changing five variables does the work of hundreds of selector overrides."
3. **Use Dawn colour schemes** (3–4: primary/secondary/neutral/accent, defined in settings) applied via `color-scheme-N` classes → consistent colour rhythm across ALL pages incl. commerce/utility, without per-section styling.
4. **Avoid `!important`.** Beat specificity with specificity (`.product-form .product-form__submit.button {}`), not `!important`. `!important` is last-resort for third-party only.
5. **Two typefaces max**; mobile-first; remove unused CSS/JS; keep custom code in separate files + git so Dawn updates stay safe (don't edit base.css/component core files).

## How our theme violates it (why James sees inconsistency + drift)
- **~15 global CSS sheets load on EVERY page** (foundation 58KB, redesign-2026 88KB [not even linked], statement 64KB, unified-styles 26KB, 5 collection variants, mobile-fixes, etc.). They style the same things differently → whichever wins differs page to page.
- **`!important` wars** everywhere (rd- system is 100% `!important`, scoped to `.bbc-rd`) → the rd- look only applies on 2026 pages; Dawn commerce/utility pages fall back to Dawn defaults = the visible inconsistency.
- **3 button systems** (`.rd-btn` / `.bbc-btn` / `.button`).
- **Brand colours hardcoded**, NOT wired into Dawn colour schemes → commerce/utility pages don't inherit forest/lime/paper.
- My 2026-07-13 button fix (piling `!important` into the last-loaded token sheet) is **the same anti-pattern** — a transitional bridge, to be replaced by the token/colour-scheme approach below.

## Recommended migration (best-practice, sequenced)
1. **Tokens & colour schemes (biggest lever, lowest risk):** one canonical `:root` token set (bbc-tokens.css is already close), and wire brand forest/lime/paper/steel into Dawn's **colour schemes** so product/collection/cart/search/account/404/blog inherit the Impact palette automatically — no `!important`. This is how Dawn pages start to "look like Impact" the right way.
2. **One button component:** define once via variables/color-scheme; retire the 3 systems.
3. **Migrate section CSS into `{% stylesheet %}`** per section (auto-subset, auto-scope); dismantle the giant global sheets as their rules move in.
4. **Delete dead/redundant sheets** (~16 unloaded incl. redesign-2026.css 88KB; collapse 5 collection sheets → 1) and strip `!important` where scoping now suffices.
5. **Mobile-first + git-safe:** don't touch Dawn core files; all custom in our own files (already the case); regression-screenshot every page (Puppeteer, mobile+desktop) after each step.

## Note on Horizon
Shopify's 2025 default theme **Horizon** (theme blocks, 8-level nesting) is the future for NEW builds. We're on a Dawn 15.4 fork — no need to migrate; the above applies to Dawn.
