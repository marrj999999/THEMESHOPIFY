# Visual CSS/UX audit — browser-verified (2026-06-12)

First audit done on the **rendered** sandbox (via Claude-in-Chrome on the user's logged-in browser) — previously impossible (the unpublished theme needs the Shopify-admin session). Method per page: a JS contrast scanner (flags any text <4.5:1 / large <3:1 on solid backgrounds) + full-page screenshots at desktop + computed-style inspection. Fixes applied to `assets/bbc-redesign-2026.css` (+ `bbc-blog-2026.liquid`), redeployed, re-verified.

## Root cause of the long-reported "invisible buttons / white-on-light"
The **live theme's legacy global stylesheets** (`bbc-foundation.css`, `bbc-accessibility.css`, `bbc-unified-styles.css`) are loaded on every page and set `a:not(.button):not(.btn)…{color:var(--bbc-forest)}` at specificity up to **(0,5,2)** — which beats every redesign rule and leaked into `.bbc-rd`, forcing links and the "Book a build" CTA to **dark-forest-on-dark** (invisible). Code-only analysis never caught it because the conflicting rules live in *other files*. Fixed with a defensive `!important` insulation layer (the redesign loads last).

## Fixed (browser-verified, commits b5e9486 / 71b8e5f)
- **Header "Book a build" CTA** — was forest-on-forest (1.02:1) → bone-on-forest (readable).
- **Mobile drawer "Book a build" CTA** (`.rd-mcta`) — was ink-on-forest (invisible) → bone.
- **Home door cards** ("Build your own" etc.) — white title/body sat over the bright sky of the photo; darkened the image overlay (.15→.45–.95) so text is legible.
- **Hero** (all pages) — stronger scrim (vertical + left-column gradient) + crisp dual text-shadow on h1/eyebrow/lede, so left-aligned hero text is legible over bright photos (the home `hero-ride` cloud-sky was the worst case).
- **Header top/bottom gap** — removed the live theme's 56px header-group padding (dead bone/white band above+below the header on every page); header now flush.
- **Blog category tabs** — were dumping **all 100+ article tags** (years, brands, topics) = an unusable wall. Constrained to a curated, editable list (new `category_tags` setting). Active tab confirmed bone-on-forest.

## Verified clean at desktop (contrast scanner = 0 solid-bg offenders each)
Home · About · Impact (Build-to-Bond family image confirmed correct) · Workshops (inline build-teaser video plays with controls + rainbow poster) · Gravel PDP (correct £385, "Add to cart", blank rating) · Collection (all kit prices correct, square cards) · Contact (3 route buttons now linked, form fields correct) · 404 · Blog · Search.

## Responsive
Verified by CSS inspection (could not shrink the browser viewport below ~1730px in this session): 940px breakpoint → mobile drawer + bottom tab bar (ARIA-correct); progressive grid collapses (split→1col @900, footer 4→2→1, stats 4→2, cart stack); reduced-motion handled. The mobile drawer CTA bug above was found+fixed via computed-style inspection.

## Needs James (not theme-fixable)
- **Education page is unreachable**: the page `bamboo-bicycle-club-education` is a **draft** AND a URL redirect sends `/pages/bamboo-bicycle-club-education → /pages/schools`. Both are store-wide settings (affect the live site), so left untouched. To launch: publish the page + remove/repoint the redirect (or move the `bamboo-bicycle-club-education` template suffix onto the published `schools` page). Couldn't visually audit it as a result, but it shares the now-fixed global chrome.
- **⚠️ Blog content compliance**: a `/blogs/news` article's **featured image** shows a wall sign naming **"HM Prison Lowdham Grange"** — a public never-name-prison breach. This is article content (shows on the live site too), not the theme. Spawned a separate task to scan all ~600 articles (4 blogs) for prison names in text + image signage. James must edit/replace those article images.

## Not individually screenshotted (share the verified global system)
Cart (empty in session), Article (needs an article), the 9 non-gravel PDPs (same section, per-kit configs reviewed earlier). Offer to spot-check on request.
