// THE canonical estate page list — one source for every audit.
//
// Extracted from qa/estate-check.mjs on 2026-07-31. Before this, qa/layout-audit.mjs carried its
// own hand-picked list of 10 pages, which is how mobile alignment on the other 62 went unchecked
// for weeks: an audit silently scoped to a subset reads exactly like an audit that passed.
// Any new estate-wide check should import from here rather than retype a list.
export const ALL_PAGES = [
  '/', '/pages/impact', '/pages/programmes',
  '/pages/workshops', '/pages/schools', '/pages/why-bamboo',
  '/pages/bicycleteambuilding', '/pages/contact-us', '/pages/support-mission',
  '/pages/which-kit', '/pages/gallery', '/pages/our-story-2',
  '/pages/build-to-bond', '/pages/prisons', '/pages/theory-of-change',
  '/pages/impact-report', '/pages/toulouse-workshop', '/pages/bicycle-frame-building-workshop',
  '/pages/media-page', '/pages/club-news', '/pages/support-centre',
  '/pages/team-building', '/pages/frequently-asked-questions', '/pages/james-marr-founder',
  '/pages/size-guide', '/pages/cycle-to-work-scheme',
  '/pages/university-papers', '/pages/geometry', '/pages/gravel-geometry',
  '/pages/road-bike-geometry', '/pages/easy-build-geometry', '/pages/mini-velo-geometry',
  '/pages/whats-in-the-box', '/pages/gravel-frame-comparison', '/pages/privacy-policy',
  '/pages/bamboo-bike-stem-lesson', '/pages/bamboo-frame-nea-project', '/pages/free-bamboo-speaker-workshop',
  '/collections', '/collections/home-build-kits', '/collections/component-packs',
  '/collections/maker-shop', '/collections/clothing', '/collections/road',
  '/collections/gravel-adventure', '/collections/mtb', '/collections/balance-bikes',
  '/collections/gift', '/products/gravel-frame-build-kit', '/products/bamboo-bike-road-kit',
  '/products/road-carbon-frame-build-kit', '/products/gravel-lugged-build-kit', '/products/29er-frame-build-kit',
  '/products/city-bike-frame-kit', '/products/fatbike-home-build-kit', '/products/custom-frame',
  '/products/balance-bike-lugged-kit-1', '/products/balance-bike-flax-kit-with-resins', '/products/bottom-bracket-68mm',
  '/products/single-speed-component-pack', '/products/bamboo-bicycle-club-gift-card', '/products/bamboo-bicycle-club-beanie',
  '/cart', '/search?q=bamboo', '/blogs/news',
  '/account/login', '/account/register', '/blogs/news/project-zero-impact-case-study',
];

export const BASE = 'https://bamboobicycleclub.org';
export const PREVIEW = 'preview_theme_id=196820238710';

// Join the preview param CORRECTLY. Three harnesses hardcoded `${BASE}${path}?${PREVIEW}`, which
// for the one list entry that already carries a query — '/search?q=bamboo' — produced
// `/search?q=bamboo?preview_theme_id=…`. The second '?' is literal, so the id was swallowed into
// the value of q and the page silently rendered the LIVE theme. Every "the draft is clean" claim
// covering /search was therefore a claim about live. Found 2026-07-31 when a footer fix verified
// on 44 pages appeared to have missed exactly one. estate-check.mjs already did this correctly;
// the others did not, which is the argument for one helper rather than four copies.
export const previewUrl = (path, extra = '') =>
  BASE + path + (path.includes('?') ? '&' : '?') + PREVIEW + extra;
