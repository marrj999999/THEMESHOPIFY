// CIC / SOCIAL-ENTERPRISE BENCHMARK — measure the field on the SAME metrics we measure ourselves.
//
// Created 2026-07-27. Every previous "how do we compare" answer in this project was an opinion
// formed by looking at screenshots. This measures instead, using the same probes estate-check
// runs against our own estate, so the comparison is like-for-like rather than impressionistic.
//
// The metric that matters most for our FORMULA §1 contract is TYPE-ROLE COUNT: how many distinct
// font sizes a site renders per role. It is a direct, objective proxy for design-system
// discipline, and it is the thing James keeps describing as "the visuals don't align".
//
// Peers chosen for genuine comparability: UK social enterprises and CICs, weighted towards
// (a) justice/prison/employment programmes — our mission peers, and
// (b) product-selling social enterprises — our commerce peers, since BBC sells kits.
//
// Usage: node qa/benchmark-cic.mjs [--out=qa/research/cic-benchmark.json]
import { chromium } from 'playwright';
import AxeBuilder from '@axe-core/playwright';
import { writeFileSync, mkdirSync } from 'fs';

const PEERS = [
  // Justice / employment / education programmes — mission peers
  ['Switchback', 'https://switchback.org.uk/'],
  ['Fine Cell Work', 'https://finecellwork.co.uk/'],
  ['Redemption Roasters', 'https://redemptionroasters.com/'],
  ['The Clink Charity', 'https://theclinkcharity.org/'],
  ['Bounce Back', 'https://bouncebackproject.com/'],
  ['Recycling Lives', 'https://recyclinglives.org/'],
  ['Emmaus UK', 'https://emmaus.org.uk/'],
  ['Change Please', 'https://changeplease.org/'],
  ['The Big Issue', 'https://www.bigissue.com/'],
  ['Social Enterprise UK', 'https://www.socialenterprise.org.uk/'],
  // Product-selling social enterprises — commerce peers
  ['Elvis & Kresse', 'https://www.elvisandkresse.com/'],
  ['Toast Brewing', 'https://www.toastbrewing.com/'],
  ['Divine Chocolate', 'https://www.divinechocolate.com/'],
  ['Belu Water', 'https://belu.org/'],
  ['Who Gives A Crap', 'https://uk.whogivesacrap.org/'],
  ["Tony's Chocolonely", 'https://tonyschocolonely.com/uk/en/'],
  ['Hiut Denim', 'https://hiutdenim.co.uk/'],
  ['Patagonia UK', 'https://eu.patagonia.com/gb/en/home/'],
  ['Riverford', 'https://www.riverford.co.uk/'],
  ['Cook Food', 'https://www.cookfood.net/'],
];

const US = ['BBC (our draft)', 'https://bamboobicycleclub.org/?preview_theme_id=196820238710'];

const outArg = process.argv.find(a => a.startsWith('--out='));
const OUT = outArg ? outArg.split('=')[1] : 'qa/research/cic-benchmark.json';

async function measure(page, name, url) {
  const rec = { name, url };
  try {
    await page.addInitScript(() => {
      window.__v = { lcp: 0, cls: 0 };
      try {
        new PerformanceObserver(l => { for (const e of l.getEntries()) window.__v.lcp = e.startTime; })
          .observe({ type: 'largest-contentful-paint', buffered: true });
        new PerformanceObserver(l => { for (const e of l.getEntries()) if (!e.hadRecentInput) window.__v.cls += e.value; })
          .observe({ type: 'layout-shift', buffered: true });
      } catch {}
    });
    const t0 = Date.now();
    const resp = await page.goto(url, { waitUntil: 'load', timeout: 45000 });
    rec.status = resp ? resp.status() : 0;
    await page.waitForTimeout(2500);

    // Dismiss the most common consent patterns so measurements see the real page, not an overlay.
    for (const label of [/^accept all$/i, /^accept$/i, /^allow all$/i, /^i agree$/i, /^got it$/i, /^ok$/i]) {
      try {
        const b = page.getByRole('button', { name: label }).first();
        if (await b.isVisible({ timeout: 700 })) { await b.click({ timeout: 1500 }); await page.waitForTimeout(600); break; }
      } catch {}
    }

    const m = await page.evaluate(() => {
      const round = v => Math.round(parseFloat(v));
      const painted = e => {
        if (e.checkVisibility && !e.checkVisibility({ checkVisibilityCSS: true })) return false;
        const r = e.getBoundingClientRect();
        return r.height > 4 && r.width > 20 && getComputedStyle(e).visibility === 'visible';
      };
      const sizesOf = sel => [...new Set([...document.querySelectorAll(sel)].filter(painted)
        .map(e => round(getComputedStyle(e).fontSize)))].sort((a, b) => a - b);

      const h1 = sizesOf('h1'), h2 = sizesOf('h2'), h3 = sizesOf('h3');
      // Body = paragraphs long enough to be prose, not micro-labels.
      const body = [...new Set([...document.querySelectorAll('p')].filter(painted)
        .filter(e => (e.textContent || '').trim().length > 60)
        .map(e => round(getComputedStyle(e).fontSize)))].sort((a, b) => a - b);

      const text = document.body.innerText || '';
      return {
        pageHeight: document.documentElement.scrollHeight,
        h1Sizes: h1, h2Sizes: h2, h3Sizes: h3, bodySizes: body,
        h1Max: h1.length ? Math.max(...h1) : null,
        bodyMain: body.length ? body[Math.floor(body.length / 2)] : null,
        // MAIN-CONTENT SPLIT (R1, 2026-07-27). Counting document.body.innerText conflates page
        // copy with navigation: our header carries 813 words and 54 links in a hidden mega-menu on
        // every page, which made us look 2.9-4.7x the field on "words" when programmes is actually
        // mid-field on main content. Peers carry 105-150 words of chrome; we carry ~1,000. Compare
        // on `mainWords` — `words` is kept so older runs stay readable.
        words: text.split(/\s+/).filter(Boolean).length,
        chromeWords: (() => {
          const wc = t => (t || '').split(/\s+/).filter(Boolean).length;
          const els = [...document.querySelectorAll('header, nav, footer, [role=banner], [role=contentinfo]')]
            .filter(e => !e.closest('main'));
          // de-dupe nested matches so a nav inside a header is not counted twice
          const top = els.filter(e => !els.some(o => o !== e && o.contains(e)));
          return top.reduce((n, e) => n + wc(e.innerText), 0);
        })(),
        mainWords: (() => {
          const wc = t => (t || '').split(/\s+/).filter(Boolean).length;
          const main = document.querySelector('main, #MainContent, [role=main]');
          if (main) return wc(main.innerText);
          // Fallback for sites with no <main>: total minus chrome, floored at 0.
          const els = [...document.querySelectorAll('header, nav, footer, [role=banner], [role=contentinfo]')];
          const top = els.filter(e => !els.some(o => o !== e && o.contains(e)));
          return Math.max(0, wc(document.body.innerText) - top.reduce((n, e) => n + wc(e.innerText), 0));
        })(),
        images: document.querySelectorAll('img').length,
        links: document.querySelectorAll('a[href]').length,
        // Buttons/links styled as primary actions, a rough CTA-density proxy.
        ctas: [...document.querySelectorAll('a,button')].filter(e => {
          if (!painted(e)) return false;
          const t = (e.textContent || '').trim();
          return t.length > 2 && t.length < 40 && /donate|shop|buy|support|join|get involved|sign up|subscribe|book|contact|learn more|find out/i.test(t);
        }).length,
        // Does the page put numbers on screen at all? Proxy for evidence-led storytelling.
        bigNumbers: (text.match(/\b\d[\d,]{1,}\+?\b/g) || []).length,
        vitals: window.__v || { lcp: 0, cls: 0 },
      };
    });
    Object.assign(rec, m);
    rec.loadMs = Date.now() - t0;
    rec.viewports = +(m.pageHeight / 800).toFixed(1);
    rec.typeRoleSpread = (m.h1Sizes.length || 0) + (m.h2Sizes.length || 0) + (m.bodySizes.length || 0);

    try {
      const axe = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']).analyze();
      const serious = axe.violations.filter(v => ['critical', 'serious'].includes(v.impact));
      rec.axeSerious = serious.length;
      rec.axeNodes = serious.reduce((n, v) => n + v.nodes.length, 0);
      rec.axeTop = serious.slice(0, 3).map(v => v.id);
    } catch (e) { rec.axeSerious = null; }
  } catch (e) {
    rec.error = String(e.message).slice(0, 100);
  }
  return rec;
}

mkdirSync('qa/research', { recursive: true });
const browser = await chromium.launch({ channel: 'chrome', headless: true });
const results = [];
for (const [name, url] of [US, ...PEERS]) {
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 }, userAgent:
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126 Safari/537.36' });
  const page = await ctx.newPage();
  const rec = await measure(page, name, url);
  results.push(rec);
  console.log(`${rec.error ? '✗' : '✓'} ${name.padEnd(22)} ${rec.error ? rec.error : `${rec.viewports}vp · h1 ${rec.h1Max}px · body ${rec.bodyMain}px · roles ${rec.typeRoleSpread} · axe ${rec.axeSerious} · LCP ${Math.round(rec.vitals?.lcp || 0)}ms`}`);
  await ctx.close();
}
await browser.close();
writeFileSync(OUT, JSON.stringify(results, null, 1));
console.log(`\n→ ${OUT}`);
