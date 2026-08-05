// LAYER-1 VISUAL REGRESSION — committed baselines; any pixel drift fails.
// Baselines: npx playwright test qa/visual.spec.mjs --update-snapshots (only after an eyeball).
import { test, expect } from '@playwright/test';
const P = 'preview_theme_id=196820238710';
const BASE = 'https://bamboobicycleclub.org';
// Widened 2026-08-05 from 12 pages to every page the 2026 band system governs, plus the
// template representatives that were already here. The 12-page list predated the estate sweep
// and left build-to-bond, prisons, support-mission, theory-of-change, impact-report, media-page,
// gallery and the team-building pair with no visual net at all — several of which changed
// materially this week.
//
// The ten kit PDPs share sections/bbc-product-2026.liquid, so a per-PDP baseline catches only
// per-product CONTENT drift (images, copy) rather than template drift. Two are kept — gravel
// (17 bands) and 29er (18, the one structural outlier) — because ten near-identical full-page
// baselines at four widths each is ~75MB of PNG that does not delta-compress, for coverage the
// card/product contract tests already give. If per-product image regressions become a real
// problem, add the rest then and accept the weight knowingly.
const PAGES = [
  ['home', '/'],
  ['impact', '/pages/impact'], ['whybamboo', '/pages/why-bamboo'],
  ['programmes', '/pages/programmes'], ['schools', '/pages/schools'], ['prisons', '/pages/prisons'],
  ['workshops', '/pages/workshops'], ['workshop-frame', '/pages/bicycle-frame-building-workshop'],
  ['teambuilding', '/pages/bicycleteambuilding'], ['team-building', '/pages/team-building'],
  ['ourstory', '/pages/our-story-2'], ['support-mission', '/pages/support-mission'],
  ['build-to-bond', '/pages/build-to-bond'], ['theory-of-change', '/pages/theory-of-change'],
  ['impact-report', '/pages/impact-report'], ['media-page', '/pages/media-page'],
  ['gallery', '/pages/gallery'], ['whichkit', '/pages/which-kit'],
  ['collection', '/collections/home-build-kits'],
  ['pdp-kit', '/products/gravel-frame-build-kit'], ['pdp-kit-29er', '/products/29er-frame-build-kit'],
  ['pdp-part', '/products/bottom-bracket-68mm'],
];
const WIDTHS = [[390, 844], [768, 1024], [1280, 800], [1568, 900]];
// mask volatile regions: marquees, videos, maps, count-ups settle variance
// #shopify-pc__banner = the cookie-consent overlay. It is fixed-position, so display:none
// cannot shift layout — and it MUST go: its visibility depends on cookie state, so leaving
// it in bakes a 239px overlay into the reference and every later run diffs on consent state.
// Hidden for the screenshot only; no consent is granted either way.
const MASK_CSS = `
  .bbc-press__track, .rd-qtrack { animation: none !important; transform: none !important; }
  .bbc-media, video, iframe, .rd-mapwide { visibility: hidden !important; }
  #shopify-pc__banner { display: none !important; }
`;
for (const [name, path] of PAGES) {
  for (const [w, h] of WIDTHS) {
    test(`${name}@${w}`, async ({ page }) => {
      await page.setViewportSize({ width: w, height: h });
      await page.goto(BASE + path + (path.includes('?') ? '&' : '?') + P + '&vr=1', { waitUntil: 'load' });
      await page.addStyleTag({ content: MASK_CSS });
      // settle: full prescroll loads lazy imgs + completes entrances, then back to top
      await page.evaluate(async () => {
        for (let y = 0; y < document.documentElement.scrollHeight; y += 600) { window.scrollTo({ top: y, behavior: 'instant' }); await new Promise(r => setTimeout(r, 90)); }
        window.scrollTo({ top: 0, behavior: 'instant' });
        await new Promise(r => setTimeout(r, 600));
      });
      await expect(page).toHaveScreenshot(`${name}-${w}.png`, { fullPage: true });
    });
  }
}
