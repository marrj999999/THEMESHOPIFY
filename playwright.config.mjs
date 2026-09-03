// Visual regression config (estate plan 2026-07-24c)
// Run: npx playwright test --config=playwright.config.mjs   (--config is REQUIRED: playwright.config.ts,
// the legacy theme-smoke suite, otherwise wins config resolution.)
export default {
  testDir: 'qa',
  testMatch: ['visual.spec.mjs', 'hover.spec.mjs'],
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
      // Calibrated against qa/canary-visual.spec.mjs, which injects one label change and REQUIRES
      // the comparison to fail. At maxDiffPixels 2500 + default threshold 0.2 the canary still
      // passed — i.e. the gate was blind. Two knobs matter and only one is obvious:
      //   · threshold = per-pixel colour distance. The default 0.2 dismisses faint glyph pixels,
      //     and our reveal system renders many elements at 0.3 opacity, so real text changes land
      //     well inside it. This is what actually caused the blindness.
      //   · maxDiffPixels = how many differing pixels are tolerated overall.
      // Tune only with the canary: tighten until it detects, then confirm the 48-shot suite still
      // passes clean. A number that makes the canary pass is a number that hides real changes.
      threshold: 0.1,
      maxDiffPixels: 800,
      animations: 'disabled',
    },
  },
  snapshotPathTemplate: 'qa/visual-baselines/{arg}{ext}',
};
