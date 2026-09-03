// PRESENTATION BENCHMARK — how proof is SHOWN, not how much of it exists.
//
// Created 2026-07-27. The content benchmark counted numbers in the DOM and found us at 16 vs a
// field median of 20.5 — modestly low. But a number buried mid-paragraph and a number set at 52px
// in its own card are not the same asset, and counting cannot tell them apart. What a visitor
// actually SEES is the thing that matters.
//
// So this measures presentation:
//   · how LARGE each number is rendered relative to body text
//   · whether it sits in a dedicated stat container or inside running prose
//   · WHERE it is — above the fold, or three screens down
//   · how many "hero numbers" (>=2x body size) a page shows at all
//
// It also writes a screenshot per site — above-fold and full-page — so the numbers can be checked
// against what the page looks like, which is how three false findings were caught on 2026-07-24
// and -27. Measure, then LOOK.
//
// Usage: node qa/benchmark-presentation.mjs
import { chromium } from 'playwright';
import { writeFileSync, mkdirSync } from 'fs';

const SITES = [
  ['BBC', 'https://bamboobicycleclub.org/?preview_theme_id=196820238710'],
  // Strongest evidence performers from the content benchmark — worth learning from
  ['WhoGivesACrap', 'https://uk.whogivesacrap.org/'],
  ['Divine', 'https://www.divinechocolate.com/'],
  ['BigIssue', 'https://www.bigissue.com/'],
  ['Switchback', 'https://switchback.org.uk/'],
  ['RecyclingLives', 'https://recyclinglives.org/'],
  ['Toast', 'https://www.toastbrewing.com/'],
  ['Belu', 'https://belu.org/'],
  ['TonysChocolonely', 'https://tonyschocolonely.com/uk/en/'],
  ['FineCellWork', 'https://finecellwork.co.uk/'],
];

const DATE = new Date().toISOString().slice(0, 10);
const SHOTS = `qa/research/presentation-shots`;
mkdirSync(SHOTS, { recursive: true });

const browser = await chromium.launch({ channel: 'chrome', headless: true });
const results = [];

for (const [name, url] of SITES) {
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 }, userAgent:
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126 Safari/537.36' });
  const page = await ctx.newPage();
  const rec = { name };
  try {
    await page.goto(url, { waitUntil: 'load', timeout: 45000 });
    await page.waitForTimeout(2200);
    for (const label of [/^accept all$/i, /^accept$/i, /^allow all$/i, /^i agree$/i, /^got it$/i, /^decline$/i]) {
      try { const b = page.getByRole('button', { name: label }).first();
        if (await b.isVisible({ timeout: 600 })) { await b.click({ timeout: 1200 }); await page.waitForTimeout(600); break; } } catch {}
    }
    // settle lazy content
    await page.evaluate(async () => {
      for (let y = 0; y < document.documentElement.scrollHeight; y += 700) {
        window.scrollTo({ top: y, behavior: 'instant' }); await new Promise(r => setTimeout(r, 70));
      }
      window.scrollTo({ top: 0, behavior: 'instant' }); await new Promise(r => setTimeout(r, 500));
    });

    Object.assign(rec, await page.evaluate(() => {
      const SKIP = '#shopify-pc__banner,.shopify-pc__banner,cart-drawer,.drawer,#insta-feed,[id^="PBar"]';
      const painted = e => !e.closest(SKIP)
        && (!e.checkVisibility || e.checkVisibility({ checkVisibilityCSS: true }))
        && e.getBoundingClientRect().height > 4 && getComputedStyle(e).visibility === 'visible';

      const bodySize = (() => {
        const ps = [...document.querySelectorAll('p')].filter(painted)
          .filter(e => (e.textContent || '').trim().length > 60)
          .map(e => parseFloat(getComputedStyle(e).fontSize));
        return ps.length ? ps.sort((a, b) => a - b)[Math.floor(ps.length / 2)] : 16;
      })();

      // Every leaf element whose text is essentially a number (a "stat figure").
      const figures = [...document.querySelectorAll('*')].filter(e => {
        if (e.children.length > 0 || !painted(e)) return false;
        const t = (e.textContent || '').trim();
        return /^[£$€]?\d[\d,.]*\s*(\+|%|k|m|bn|million|billion)?$/i.test(t) && t.length <= 12;
      }).map(e => {
        const cs = getComputedStyle(e);
        const r = e.getBoundingClientRect();
        const parentCls = (e.parentElement?.className || '').toString();
        return {
          text: (e.textContent || '').trim(),
          px: Math.round(parseFloat(cs.fontSize)),
          weight: cs.fontWeight,
          y: Math.round(r.top + window.scrollY),
          // in a dedicated stat container, or loose in prose?
          inStatBlock: /stat|figure|number|count|metric|impact|fact|num/i.test(parentCls)
            || /stat|figure|number|count|metric|impact|fact|num/i.test((e.className || '').toString()),
        };
      });

      const heroNumbers = figures.filter(f => f.px >= bodySize * 2);
      const aboveFold = figures.filter(f => f.y < 900);
      return {
        bodySize: Math.round(bodySize),
        figureCount: figures.length,
        heroNumbers: heroNumbers.length,
        maxFigurePx: figures.length ? Math.max(...figures.map(f => f.px)) : 0,
        figureToBodyRatio: figures.length ? +(Math.max(...figures.map(f => f.px)) / bodySize).toFixed(1) : 0,
        inStatBlocks: figures.filter(f => f.inStatBlock).length,
        figuresAboveFold: aboveFold.length,
        firstFigureY: figures.length ? Math.min(...figures.map(f => f.y)) : null,
        pageHeight: document.documentElement.scrollHeight,
        samples: figures.sort((a, b) => b.px - a.px).slice(0, 5).map(f => `${f.text}@${f.px}px y${f.y}`),
      };
    }));

    await page.screenshot({ path: `${SHOTS}/${name}-fold.png` });
    await page.screenshot({ path: `${SHOTS}/${name}-full.png`, fullPage: true });
  } catch (e) { rec.error = String(e.message).slice(0, 80); }
  results.push(rec);
  console.log(`${rec.error ? '✗' : '✓'} ${name.padEnd(18)} ${rec.error || `figures ${rec.figureCount} · hero(≥2x body) ${rec.heroNumbers} · biggest ${rec.maxFigurePx}px (${rec.figureToBodyRatio}x body) · in stat blocks ${rec.inStatBlocks} · above fold ${rec.figuresAboveFold} · first at y${rec.firstFigureY}`}`);
  await ctx.close();
}
await browser.close();
writeFileSync('qa/research/presentation-benchmark.json', JSON.stringify(results, null, 1));
console.log(`\n→ qa/research/presentation-benchmark.json · shots in ${SHOTS}/`);
