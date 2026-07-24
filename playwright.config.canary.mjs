// Canary config — MUST mirror playwright.config.mjs's expect settings, because the whole point
// is to test the REAL threshold the visual gate runs with. If you tune maxDiffPixels there,
// this inherits it by importing rather than duplicating the number.
import base from './playwright.config.mjs';

export default {
  ...base,
  testMatch: 'canary-visual.spec.mjs',
  retries: 0,          // a canary must not be "fixed" by a retry
  workers: 1,
  snapshotPathTemplate: 'qa/visual-baselines/canary/{arg}{ext}',
};
