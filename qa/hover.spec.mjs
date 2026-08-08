// HOVER-STATE baselines — the interaction layer the full-page net cannot see.
// Canonical interactive components, hovered, element-screenshot pixel-diffed.
import { test, expect } from '@playwright/test';
const P = 'preview_theme_id=196820238710';
const BASE = 'https://bamboobicycleclub.org';
const TARGETS = [
  ['/', 'pill-lime', 'a.rd-btn.rd-lime'],
  ['/', 'pill-ghost', 'a.rd-btn:not(.rd-lime)'],
  ['/', 'nav-link', '.rd-nav-link'],
  ['/', 'door-card', '.rd-door'],
  ['/pages/impact', 'cscard', '.rd-cscard'],
  ['/pages/impact', 'path-card', '.rd-path'],
  ['/pages/schools', 'logocell', 'a.rd-logocell'],
  ['/pages/impact', 'pill-forest', 'a.rd-btn:not(.rd-ghost)'],
];
for (const [path, name, sel] of TARGETS) {
  test(`hover-${name}`, async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto(BASE + path + '?' + P, { waitUntil: 'load' });
    await page.addStyleTag({ content: '#shopify-pc__banner{display:none!important} .rd-reveal{opacity:1!important;transform:none!important} *{transition-duration:0s!important}' });
    // settle the two nondeterminisms element shots can race: the home ew reveal (class-driven,
    // untouched by the rd-reveal neutralizer) and web-font load re-metrics.
    await page.evaluate(async () => {
      document.querySelectorAll('.will-anim').forEach((e) => e.classList.add('is-on'));
      await document.fonts.ready;
    });
    const el = page.locator(sel).first();
    await el.scrollIntoViewIfNeeded();
    await page.waitForTimeout(400);
    await el.hover();
    await page.waitForTimeout(250);
    // maxDiffPixels calibrated 2026-08-08: the lift transform's subpixel rasterization can
    // flicker a ~1px AA seam (~1,100px on the cscard); real drift measures in the thousands.
    await expect(el).toHaveScreenshot(`hover-${name}.png`, { animations: 'disabled', maxDiffPixels: 2500 });
  });
}
