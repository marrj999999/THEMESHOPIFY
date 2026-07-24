// Visual regression config (estate plan 2026-07-24c)
// Run: npx playwright test --config=playwright.config.mjs   (--config is REQUIRED: playwright.config.ts,
// the legacy theme-smoke suite, otherwise wins config resolution.)
export default {
  testDir: 'qa',
  testMatch: 'visual.spec.mjs',
  timeout: 60000,
  retries: 1,
  workers: 3,
  use: { channel: 'chrome', headless: true },
  expect: {
    toHaveScreenshot: {
      // maxDiffPixels (absolute), NOT maxDiffPixelRatio (2026-07-24). A ratio scales with page
      // height, so our very tall full-page shots bought a huge free pass: 1.5% of the 1280×11757
      // impact page = 225,734 pixels — about 19× a changed text label (~420×28 = 11,760 px). The
      // net duly passed 48/48 while an OCN course title had visibly changed on that page. A gate
      // that cannot fail on a real change is not a gate.
      // 2,500 absorbs font antialiasing/subpixel noise while still catching a single changed line.
      maxDiffPixels: 2500,
      animations: 'disabled',
    },
  },
  snapshotPathTemplate: 'qa/visual-baselines/{arg}{ext}',
};
