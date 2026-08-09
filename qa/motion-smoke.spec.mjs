// MOTION SMOKE — live-behaviour assertions for the §11/§11b motion system.
// Two contexts, matching the MOTION.md contract:
//   default  — motion RUNS (count-ups tick, scroll-driven states progress)
//   reduce   — motion is INERT and everything renders final instantly
// Chromium (view() support). Run: npm run test:motion
import { test, expect } from '@playwright/test';

const P = 'preview_theme_id=196820238710';
const BASE = 'https://bamboobicycleclub.org';

test.describe('motion runs (no-preference)', () => {
  test('hero stats count up and settle on the exact figure', async ({ page }) => {
    // the hero is above the fold, so the count fires at load — sample from t=0
    await page.goto(`${BASE}/?${P}`, { waitUntil: 'domcontentloaded' });
    const samples = await page.evaluate(async () => {
      const grab = () => document.querySelector('.ew-proof li b')?.textContent.trim() ?? '';
      const vals = [];
      for (let i = 0; i < 18; i++) { vals.push(grab()); await new Promise(r => setTimeout(r, 120)); }
      return vals;
    });
    const distinct = new Set(samples.filter(Boolean));
    expect(distinct.size, 'count-up produced intermediate values').toBeGreaterThan(1);
    const last = samples[samples.length - 1];
    expect(last, 'settles on a real figure').toMatch(/^[0-9][0-9,]*\+?$/);
    expect(samples[samples.length - 2], 'stable at the end').toBe(last);
  });

  test('comparison bars grow through entry', async ({ page }) => {
    await page.goto(`${BASE}/pages/why-bamboo?${P}`, { waitUntil: 'load' });
    await page.evaluate(() => document.querySelector('#shopify-pc__banner')?.remove());
    // the page inflates as embeds load — seek positions iteratively, never trust
    // an absolute offset (this exact staleness produced 3 false failures today)
    const seek = async (targetTop) => {
      for (let i = 0; i < 4; i++) {
        await page.evaluate((t) => {
          const el = document.querySelector('.wbx');
          scrollBy(0, el.getBoundingClientRect().top - t);
        }, targetTop);
        await page.waitForTimeout(280);
      }
      return page.evaluate(() => Math.round(document.querySelector('.wbx').getBoundingClientRect().top));
    };
    const readScale = () => page.evaluate(() => {
      const t = getComputedStyle(document.querySelector('.wbx .wbx-bf')).transform;
      return t === 'none' ? 1 : new DOMMatrixReadOnly(t).a;
    });
    await seek(860);                    // band just entering
    const early = await readScale();
    await seek(-600);                   // band scrolled well in — past every range end
    const settled = await readScale();
    expect(early, 'entering bar is partial').toBeLessThan(0.99);
    expect(settled, 'settled bar is full').toBeGreaterThan(0.99);
  });

  test('door grid cascades (later children lag earlier ones mid-entry)', async ({ page }) => {
    await page.goto(`${BASE}/?${P}`, { waitUntil: 'load' });
    await page.evaluate(() => document.querySelector('#shopify-pc__banner')?.remove());
    // settle lazy media first — positions measured pre-load drift by ~1000px
      await page.evaluate(async () => {
      for (let y = 0; y < document.body.scrollHeight; y += 900) { scrollTo(0, y); await new Promise(r => setTimeout(r, 60)); }
      scrollTo(0, 0); await new Promise(r => setTimeout(r, 300));
    });
    const y = await page.evaluate(() => {
      const el = document.querySelector('.rd-grid.rd-g3.rd-stagger');
      return el ? el.getBoundingClientRect().top + scrollY : -1;
    });
    expect(y).toBeGreaterThan(0);
    await page.evaluate((v) => scrollTo(0, v), y - 800);
    await page.waitForTimeout(200);
    const ops = await page.evaluate(() =>
      [...document.querySelectorAll('.rd-grid.rd-g3.rd-stagger > *')].map((e) => parseFloat(getComputedStyle(e).opacity)));
    // at mid-entry the last door must not be ahead of the first
    expect(ops[ops.length - 1]).toBeLessThanOrEqual(ops[0] + 0.001);
  });
});

test.describe('motion is inert (reduce)', () => {
  test.use({ contextOptions: { reducedMotion: 'reduce' } });

  test('stats render final instantly; nothing is scaled or hidden', async ({ page }) => {
    await page.goto(`${BASE}/pages/why-bamboo?${P}`, { waitUntil: 'load' });
    await page.evaluate(() => document.querySelector('#shopify-pc__banner')?.remove());
    const y = await page.evaluate(() => {
      const el = document.querySelector('.wbx-bar .wbx-bf');
      return el ? el.getBoundingClientRect().top + scrollY : -1;
    });
    await page.evaluate((v) => scrollTo(0, v), Math.max(0, y - 830));
    await page.waitForTimeout(200);
    const barT = await page.evaluate(() => getComputedStyle(document.querySelector('.wbx-bar .wbx-bf')).transform);
    expect(barT, 'bar untransformed under reduce').toBe('none');
    await page.goto(`${BASE}/?${P}`, { waitUntil: 'load' });
    const stat = await page.evaluate(() => document.querySelector('.ew-proof li b')?.textContent.trim());
    expect(stat, 'stat renders its final value instantly').toMatch(/^[0-9][0-9,]*\+?$/);
  });
});
