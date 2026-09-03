// Cross-engine smoke config: Firefox (Gecko), layout-contract assertions only.
export default {
  testDir: 'qa',
  testMatch: 'webkit-smoke.spec.mjs',
  timeout: 60000,
  retries: 1,
  workers: 3,
  use: { browserName: 'firefox', headless: true },
};
