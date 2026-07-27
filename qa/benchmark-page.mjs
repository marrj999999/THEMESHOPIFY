// PER-PAGE PEER BENCHMARK — generalised, so any page type can be compared, repeatably.
//
// Created 2026-07-27 in answer to "have you compared each page against 10 other sites?"
// The honest answer was no: homepage only (20-21 peers), plus one impact-page study from July.
// Twenty-three pages had never been compared to anything.
//
// HOW MANY COMPARISONS — decided from evidence, not taste:
//   · 20 peers (cic-benchmark) gave a stable median with clear outliers.
//   · 10 peers (presentation-benchmark) still gave unambiguous signal — our y3897 outlier was
//     obvious against nine others.
//   · Below ~8, one odd site drags the median enough to mislead.
//   → 8-12 per page type. Enough for a stable median, few enough that every peer is genuinely
//     the SAME page type, which matters more than raw count. A PDP compared against homepages
//     teaches nothing.
//
// TIERING, because not every page earns a peer study:
//   Tier A (10-12 peers): pages that take money or carry the mission — PDP, collection,
//                         impact, programmes, workshops, schools, homepage.
//   Tier B (6-8 peers):   supporting pages — about, contact, teambuilding, why-bamboo.
//   Tier C (0 peers):     long-tail utility — geometry tables, privacy, size guide. Structural
//                         checks only; a peer study would cost more than it returns.
//
// Usage: node qa/benchmark-page.mjs --set=pdp
import { chromium } from 'playwright';
import { writeFileSync, mkdirSync } from 'fs';

// Peer sets are page-type matched. Add sets as page types come up for work.
//
// URLs are DISCOVERED, never guessed. The first version of this file hardcoded plausible-looking
// product URLs and 7 of 10 returned 404 — producing a "benchmark" in which peers averaged 1.4
// viewports and 150 words against our 15.8 and 2,354. Those numbers looked like a dramatic
// finding and were pure artefact. Each peer now starts from a browse page and we follow its first
// real product link, so the page under test is whatever that site actually ships.
const SETS = {
  pdp: {
    label: 'Product detail page — social-enterprise / craft goods',
    ours: ['BBC gravel kit', 'https://bamboobicycleclub.org/products/gravel-frame-build-kit?preview_theme_id=196820238710'],
    // [name, browse page, product-URL pattern, reject pattern]
    // The reject pattern matters: "first product link" kept returning gift vouchers, donations and
    // workshop bookings, which are not comparable to a physical kit.
    discover: [
      ['Elvis & Kresse', 'https://www.elvisandkresse.com/collections/all', /\/products\//, /voucher|gift-card|donat|workshop/i],
      ['Hiut Denim', 'https://hiutdenim.co.uk/collections/all', /\/products\//, /voucher|gift-card|donat/i],
      ['Who Gives A Crap', 'https://uk.whogivesacrap.org/collections/all', /\/products\//, /voucher|gift-card|donat/i],
      ['Divine Chocolate', 'https://www.divinechocolate.com/collections/all', /\/products\//, /voucher|gift-card|donat/i],
      ['Fine Cell Work', 'https://finecellwork.co.uk/collections/all', /\/products\//, /voucher|gift-card|donat|membership/i],
      ['Belu', 'https://belu.org/collections/all', /\/products\//, /voucher|gift-card|donat/i],
      ['Toast Brewing', 'https://www.toastbrewing.com/collections/beer', /\/products\//, /voucher|gift-card|donat/i],
      ["Tony's Chocolonely", 'https://tonyschocolonely.com/uk/en/our-chocolate-bars', /\/(our-chocolate-bars|products)\/[a-z0-9-]{5,}/, /voucher|gift-card/i],
      ['Riverford', 'https://www.riverford.co.uk/organic-vegetable-boxes', /\/(vegetable|fruit|veg)-box|\/product/, /voucher|gift-card/i],
      ['Patagonia', 'https://eu.patagonia.com/gb/en/shop/mens', /\/product\//, /gift-card/i],
    ],
  },

  impact: {
    label: 'Impact / our-impact page — social enterprises and charities',
    ours: ['BBC impact', 'https://bamboobicycleclub.org/pages/impact?preview_theme_id=196820238710'],
    discover: [
      ['Switchback', 'https://switchback.org.uk/', /impact|results|outcomes/i, /blog|news/i],
      ['Fine Cell Work', 'https://finecellwork.co.uk/', /impact|our-work|what-we-do/i, /blog|news|shop/i],
      ['The Clink Charity', 'https://theclinkcharity.org/', /impact|our-work|results/i, /blog|news/i],
      ['Bounce Back', 'https://bouncebackproject.com/', /impact|our-work|what-we-do/i, /blog|news/i],
      ['Recycling Lives', 'https://recyclinglives.org/', /impact|our-work/i, /blog|news/i],
      ['Emmaus UK', 'https://emmaus.org.uk/', /impact|our-work|what-we-do/i, /blog|news|shop/i],
      ['Change Please', 'https://changeplease.org/', /impact|our-work/i, /blog|news|shop/i],
      ['The Big Issue', 'https://www.bigissue.com/', /impact|about/i, /blog|news|subscri/i],
      ['Who Gives A Crap', 'https://uk.whogivesacrap.org/', /impact|our-impact|giving/i, /blog|shop|product/i],
      ["Tony's Chocolonely", 'https://tonyschocolonely.com/uk/en/', /mission|impact|annual-fair-report/i, /shop|product|bars/i],
      ['Divine Chocolate', 'https://www.divinechocolate.com/', /impact|farmer|our-story/i, /shop|product/i],
      ['Belu', 'https://belu.org/', /impact|our-purpose|what-we-do/i, /shop|product/i],
    ],
  },

  collection: {
    label: 'Collection / shop listing page',
    ours: ['BBC home-build kits', 'https://bamboobicycleclub.org/collections/home-build-kits?preview_theme_id=196820238710'],
    discover: [
      ['Elvis & Kresse', 'https://www.elvisandkresse.com/', /\/collections\/[a-z0-9-]{3,}/, /all$|policies/i],
      ['Hiut Denim', 'https://hiutdenim.co.uk/', /\/collections\/[a-z0-9-]{3,}/, /all$|policies/i],
      ['Who Gives A Crap', 'https://uk.whogivesacrap.org/', /\/collections\/[a-z0-9-]{3,}/, /all$|policies/i],
      ['Divine Chocolate', 'https://www.divinechocolate.com/', /\/collections\/[a-z0-9-]{3,}/, /all$|policies/i],
      ['Fine Cell Work', 'https://finecellwork.co.uk/', /\/collections\/[a-z0-9-]{3,}/, /all$|policies/i],
      ['Belu', 'https://belu.org/', /\/collections\/[a-z0-9-]{3,}/, /all$|policies/i],
      ['Toast Brewing', 'https://www.toastbrewing.com/', /\/collections\/[a-z0-9-]{3,}/, /all$|policies/i],
      ['Riverford', 'https://www.riverford.co.uk/', /\/(shop|organic)[a-z0-9-\/]*/, /policies|account/i],
      ['Patagonia', 'https://eu.patagonia.com/gb/en/home/', /\/shop\/[a-z0-9-]{3,}/, /gift-card/i],
      ["Tony's Chocolonely", 'https://tonyschocolonely.com/uk/en/', /\/(our-chocolate-bars|shop)/, /gift/i],
    ],
  },
};
const setArg = (process.argv.find(a => a.startsWith('--set=')) || '--set=pdp').split('=')[1];
const SET = SETS[setArg];
if (!SET) { console.error(`unknown set "${setArg}". Available: ${Object.keys(SETS).join(', ')}`); process.exit(1); }

const SHOTS = `qa/research/page-shots/${setArg}`;
mkdirSync(SHOTS, { recursive: true });
const browser = await chromium.launch({ channel: 'chrome', headless: true });
const results = [];

// Resolve each peer's real product URL from its browse page.
async function discover(ctx, browseUrl, pattern, reject) {
  const p = await ctx.newPage();
  try {
    await p.goto(browseUrl, { waitUntil: 'load', timeout: 45000 });
    await p.waitForTimeout(2000);
    for (const label of [/^accept all$/i, /^accept$/i, /^allow all$/i, /^i agree$/i, /^got it$/i]) {
      try { const b = p.getByRole('button', { name: label }).first();
        if (await b.isVisible({ timeout: 600 })) { await b.click({ timeout: 1200 }); await p.waitForTimeout(500); break; } } catch {}
    }
    // SAME-HOST ONLY. Without this, discovery follows whatever matches the pattern anywhere on the
    // page: the Big Issue homepage yielded a ted.com privacy policy, which would have entered the
    // benchmark as "The Big Issue's impact page". Also reject obvious non-pages (PDF/asset paths).
    const href = await p.evaluate(([re, rj]) => {
      const rx = new RegExp(re, 'i');
      const rej = rj ? new RegExp(rj, 'i') : null;
      const host = location.hostname.replace(/^www\./, '');
      const a = [...document.querySelectorAll('a[href]')]
        .map(a => a.href)
        .filter(h => {
          let u; try { u = new URL(h); } catch { return false; }
          const sameHost = u.hostname.replace(/^www\./, '').endsWith(host.split('.').slice(-2).join('.'));
          if (!sameHost) return false;
          if (/\.(pdf|jpe?g|png|zip|docx?)$/i.test(u.pathname)) return false;
          if (/wp-content|\/uploads\//i.test(u.pathname)) return false;
          return rx.test(h) && !(rej && rej.test(h));
        });
      return a[0] || null;
    }, [pattern.source, reject ? reject.source : null]);
    return href;
  } catch { return null; } finally { await p.close(); }
}

const targets = [SET.ours];
{
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 }, userAgent:
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126 Safari/537.36' });
  for (const [name, browseUrl, pattern, reject] of SET.discover) {
    const url = await discover(ctx, browseUrl, pattern, reject);
    if (url) { targets.push([name, url]); console.log(`  discovered ${name}: ${url.slice(0, 90)}`); }
    else console.log(`  ✗ ${name}: no product link found on ${browseUrl}`);
  }
  await ctx.close();
}
console.log('');

for (const [name, url] of targets) {
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 }, userAgent:
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126 Safari/537.36' });
  const page = await ctx.newPage();
  const rec = { name };
  try {
    const resp = await page.goto(url, { waitUntil: 'load', timeout: 45000 });
    rec.status = resp ? resp.status() : 0;
    await page.waitForTimeout(2200);
    for (const label of [/^accept all$/i, /^accept$/i, /^allow all$/i, /^i agree$/i, /^got it$/i, /^decline$/i]) {
      try { const b = page.getByRole('button', { name: label }).first();
        if (await b.isVisible({ timeout: 600 })) { await b.click({ timeout: 1200 }); await page.waitForTimeout(500); break; } } catch {}
    }
    Object.assign(rec, await page.evaluate(() => {
      const SKIP = '#shopify-pc__banner,.shopify-pc__banner,cart-drawer,.drawer,[id^="PBar"]';
      const painted = e => !e.closest(SKIP)
        && (!e.checkVisibility || e.checkVisibility({ checkVisibilityCSS: true }))
        && e.getBoundingClientRect().height > 4 && getComputedStyle(e).visibility === 'visible';
      const text = document.body.innerText || '';
      const fold = 900;

      const addToCart = [...document.querySelectorAll('button,a,input[type=submit]')].filter(e =>
        painted(e) && /add to (cart|basket|bag)|buy now|add to trolley|order now|subscribe/i.test(
          (e.textContent || '') + (e.value || '')));
      const atcY = addToCart.length ? Math.round(addToCart[0].getBoundingClientRect().top + window.scrollY) : null;

      const price = [...document.querySelectorAll('*')].filter(e =>
        e.children.length === 0 && painted(e) && /^[£$€]\s?\d[\d.,]*$/.test((e.textContent || '').trim()));
      const priceY = price.length ? Math.round(price[0].getBoundingClientRect().top + window.scrollY) : null;
      const priceSize = price.length ? Math.round(parseFloat(getComputedStyle(price[0]).fontSize)) : null;

      return {
        pageHeight: document.documentElement.scrollHeight,
        viewports: +(document.documentElement.scrollHeight / 900).toFixed(1),
        words: text.split(/\s+/).filter(Boolean).length,
        images: [...document.querySelectorAll('img')].filter(painted).length,
        imagesAboveFold: [...document.querySelectorAll('img')].filter(e =>
          painted(e) && e.getBoundingClientRect().top < fold).length,
        addToCartY: atcY,
        addToCartAboveFold: atcY !== null && atcY < fold,
        priceY, priceSize,
        // Trust signals a shopper looks for on a considered purchase.
        hasReviews: /review|rating|★|stars?\b/i.test(text),
        hasShipping: /delivery|shipping|dispatch/i.test(text.slice(0, 6000)),
        hasReturns: /returns?|refund|guarantee|warranty/i.test(text),
        hasSizing: /size|dimension|fit guide|geometry|measurement/i.test(text),
        hasFAQ: /frequently asked|faq|questions/i.test(text),
        // Does the PDP carry the mission, or is it a plain shop page?
        missionWords: (text.match(/\b(impact|social enterprise|charity|prison|community|sustainab|fair ?trade|recycl|donat)/gi) || []).length,
      };
    }));
    await page.screenshot({ path: `${SHOTS}/${name.replace(/[^a-z0-9]+/gi, '-')}-fold.png` });
  } catch (e) { rec.error = String(e.message).slice(0, 80); }
  // A page with almost no text did not really load (consent wall, JS-only render, redirect stub).
  // Marking it invalid keeps it out of every median rather than silently dragging one down.
  if (!rec.error && (rec.words ?? 0) < 120) rec.invalid = `only ${rec.words} words — page did not load usefully`;
  results.push(rec);
  console.log(`${rec.error ? '✗' : '✓'} ${name.padEnd(20)} ${rec.error || `${rec.viewports}vp · ${rec.words}w · ATC y${rec.addToCartY}${rec.addToCartAboveFold ? ' (fold✓)' : ''} · price ${rec.priceSize}px y${rec.priceY} · imgs ${rec.imagesAboveFold}/${rec.images} · mission ${rec.missionWords}`}`);
  await ctx.close();
}
await browser.close();
writeFileSync(`qa/research/page-benchmark-${setArg}.json`, JSON.stringify({ set: SET.label, results }, null, 1));
console.log(`\n→ qa/research/page-benchmark-${setArg}.json · shots in ${SHOTS}/`);
