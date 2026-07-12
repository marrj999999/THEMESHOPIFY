import { chromium } from '/Users/jamesmarr/Projects/bbc-theme-new/node_modules/playwright/index.mjs';

const URL = 'https://bamboobicycleclub.org/pages/impact?preview_theme_id=196820238710';

const EXEC = '/Users/jamesmarr/Library/Caches/ms-playwright/chromium-1223/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing';
const browser = await chromium.launch({ headless: true, executablePath: EXEC });
const ctx = await browser.newContext({ viewport: { width: 375, height: 812 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
const page = await ctx.newPage();
await page.goto(URL, { waitUntil: 'networkidle', timeout: 60000 });

// decline cookies
try {
  const declineSelectors = ['text=/decline/i','text=/reject/i','text=/only necessary/i','#shopify-pc__banner__btn-decline','button:has-text("Decline")'];
  for (const s of declineSelectors) {
    const el = await page.$(s);
    if (el) { await el.click().catch(()=>{}); console.log('clicked cookie decline:', s); break; }
  }
} catch(e){}
await page.waitForTimeout(1500);

const info = await page.evaluate(() => {
  const themeId = window.Shopify && window.Shopify.theme ? window.Shopify.theme.id : 'unknown';
  const main = document.querySelector('main') || document.body;
  const sections = [...main.querySelectorAll('.shopify-section')].map((s,i) => {
    const r = s.getBoundingClientRect();
    const h2 = s.querySelector('h2');
    const eyebrow = s.querySelector('.rd-eyebrow, [class*="eyebrow"]');
    return {
      i,
      id: s.id || '',
      cls: (s.className||'').slice(0,60),
      firstChildCls: (s.firstElementChild && s.firstElementChild.className||'').slice(0,50),
      top: Math.round(r.top + window.scrollY),
      h: Math.round(r.height),
      h2: h2 ? h2.textContent.trim().slice(0,70) : '',
      eyebrow: eyebrow ? eyebrow.textContent.trim().slice(0,40) : ''
    };
  }).filter(s => s.h > 20);
  return {
    themeId,
    docHeight: document.documentElement.scrollHeight,
    title: document.title,
    sections
  };
});
console.log(JSON.stringify(info, null, 2));
await browser.close();
