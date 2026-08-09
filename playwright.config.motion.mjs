// Motion smoke config: Chromium, real motion in the default project.
export default {
  testDir: 'qa',
  testMatch: 'motion-smoke.spec.mjs',
  timeout: 60000,
  retries: 1,
  workers: 2,
  use: { headless: true, viewport: { width: 1280, height: 900 } },
};
