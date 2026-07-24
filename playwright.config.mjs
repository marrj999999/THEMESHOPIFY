// Visual regression config (estate plan 2026-07-24c) — run: npx playwright test qa/visual.spec.mjs
export default {
  testDir: 'qa',
  testMatch: 'visual.spec.mjs',
  timeout: 60000,
  retries: 1,
  workers: 3,
  use: { channel: 'chrome', headless: true },
  expect: { toHaveScreenshot: { maxDiffPixelRatio: 0.015, animations: 'disabled' } },
  snapshotPathTemplate: 'qa/visual-baselines/{arg}{ext}',
};
