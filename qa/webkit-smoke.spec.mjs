// CROSS-ENGINE SMOKE (WebKit ≈ Safari rendering core): every estate page must
// load without console errors, without horizontal overflow, with exactly one H1.
// Pixel baselines stay Chromium-only (cross-engine antialiasing makes shared
// baselines meaningless); this asserts the layout CONTRACT instead.
import { test, expect } from '@playwright/test';
import { ALL_PAGES, previewUrl } from './estate-pages.mjs';
test.use({ viewport: { width: 1280, height: 900 } });
for (const path of ALL_PAGES) {
  test(`webkit ${path}`, async ({ page }) => {
    const errors = [];
    page.on('pageerror', e => errors.push(String(e).slice(0, 120)));
    await page.goto(previewUrl(path), { waitUntil: 'load', timeout: 45000 });
    await page.waitForTimeout(600);
    const m = await page.evaluate(() => ({
      overflow: document.documentElement.scrollWidth - window.innerWidth,
      h1s: document.querySelectorAll('h1').length,
    }));
    expect(m.overflow, 'horizontal overflow px').toBeLessThanOrEqual(2);
    expect(m.h1s, 'exactly one h1').toBe(1);
    expect(errors, 'no page errors').toEqual([]);
  });
}
