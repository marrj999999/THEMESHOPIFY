// Cross-engine smoke config: WebKit (Safari core), layout-contract assertions only.
export default {
  testDir: 'qa',
  testMatch: 'webkit-smoke.spec.mjs',
  timeout: 60000,
  retries: 1,
  workers: 3,
  use: { browserName: 'webkit', headless: true },
};
