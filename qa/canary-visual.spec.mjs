// VISUAL GATE CANARY — proves the pixel net can still fail.
//
// Escape #9 (2026-07-24): the net returned 48/48 clean while an OCN course title had visibly
// changed on /pages/impact. maxDiffPixelRatio scaled with page height, so the 1280x11757 impact
// page was allowed 225,734 differing pixels — ~19x the changed label. The gate had genuinely run,
// genuinely compared, and was genuinely blind. Only a deliberate known-bad input exposes that.
//
// This test captures the page, injects a small realistic text change, and asserts the comparison
// FAILS. If it passes, the threshold is too loose and the visual gate is decorative.
//
// Run: npx playwright test --config=playwright.config.canary.mjs
import { test, expect } from '@playwright/test';

const BASE = 'https://bamboobicycleclub.org';
const P = 'preview_theme_id=196820238710';
const MASK = `
  .bbc-press__track, .rd-qtrack { animation: none !important; transform: none !important; }
  .bbc-media, video, iframe, .rd-mapwide { visibility: hidden !important; }
  #shopify-pc__banner { display: none !important; }
`;

async function settle(page) {
  await page.addStyleTag({ content: MASK });
  await page.evaluate(async () => {
    for (let y = 0; y < document.documentElement.scrollHeight; y += 600) {
      window.scrollTo({ top: y, behavior: 'instant' }); await new Promise(r => setTimeout(r, 90));
    }
    window.scrollTo({ top: 0, behavior: 'instant' });
    await new Promise(r => setTimeout(r, 600));
  });
}

test('visual gate detects a small injected text change', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto(`${BASE}/pages/impact?${P}&vr=1`, { waitUntil: 'load' });
  await settle(page);

  // 1. Establish/confirm the canary baseline (written on first run).
  await expect(page).toHaveScreenshot('canary-impact.png', { fullPage: true });

  // 2. Inject a change the size of a real defect — one short label, the same scale as the OCN
  //    title edit that slipped through. Not a whole-page repaint: an easy change proves nothing.
  //
  //    Picking the element is the subtle part. A first version used `getBoundingClientRect().height > 0`
  //    and selected <h2 class="cart__empty-text"> inside the CLOSED cart drawer — `visibility: hidden`
  //    still occupies layout, so it has height but paints nothing. The canary then reported the gate
  //    blind when nothing had actually changed on screen. checkVisibility() tests paintedness, not
  //    layout, and we additionally require the element to sit within the document flow.
  const changed = await page.evaluate(() => {
    const el = [...document.querySelectorAll('.rd-lbl, h3, h2, p')].find(e => {
      if (!e.checkVisibility || !e.checkVisibility({ checkVisibilityCSS: true, checkOpacity: true })) return false;
      const r = e.getBoundingClientRect();
      const txt = (e.textContent || '').trim();
      return r.height > 10 && r.width > 80 && txt.length > 12 && getComputedStyle(e).visibility === 'visible';
    });
    if (!el) return null;
    const before = el.textContent.trim();
    el.textContent = 'CANARY ' + before;
    const r = el.getBoundingClientRect();
    return { tag: el.tagName, y: Math.round(r.top + window.scrollY), w: Math.round(r.width), h: Math.round(r.height), before: before.slice(0, 40) };
  });
  expect(changed, 'no genuinely painted element found to mutate — canary cannot run').not.toBeNull();
  console.log(`canary mutated ${changed.tag} at y=${changed.y} (${changed.w}x${changed.h}): "${changed.before}"`);

  // 3. The gate MUST now fail. If it does not, it cannot see a real copy change.
  let detected = false;
  try {
    await expect(page).toHaveScreenshot('canary-impact.png', { fullPage: true, timeout: 8000 });
  } catch {
    detected = true;
  }
  expect(
    detected,
    'VISUAL GATE IS BLIND: an injected label change did not trip the comparison. ' +
    'Tighten expect.toHaveScreenshot.maxDiffPixels in playwright.config.mjs.'
  ).toBe(true);
});
