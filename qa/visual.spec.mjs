// LAYER-1 VISUAL REGRESSION — committed baselines; any pixel drift fails.
// Baselines: npx playwright test qa/visual.spec.mjs --update-snapshots (only after an eyeball).
import { test, expect } from '@playwright/test';
const P = 'preview_theme_id=196820238710';
const BASE = 'https://bamboobicycleclub.org';
const PAGES = [
  ['home', '/'], ['impact', '/pages/impact'], ['programmes', '/pages/programmes'],
  ['workshops', '/pages/workshops'], ['schools', '/pages/schools'], ['whybamboo', '/pages/why-bamboo'],
  ['teambuilding', '/pages/bicycleteambuilding'], ['ourstory', '/pages/our-story-2'],
  ['whichkit', '/pages/which-kit'], ['collection', '/collections/home-build-kits'],
  ['pdp-kit', '/products/gravel-frame-build-kit'], ['pdp-part', '/products/bottom-bracket-68mm'],
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
