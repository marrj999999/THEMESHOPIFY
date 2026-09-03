import { chromium } from '/Users/jamesmarr/Projects/bbc-theme-new/node_modules/playwright/index.mjs';
const EXEC = '/Users/jamesmarr/Library/Caches/ms-playwright/chromium-1223/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing';
const URL = 'https://bamboobicycleclub.org/pages/impact?preview_theme_id=196820238710';
const browser = await chromium.launch({ headless: true, executablePath: EXEC });
const ctx = await browser.newContext({ viewport: { width: 375, height: 812 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
const page = await ctx.newPage();
await page.goto(URL, { waitUntil: 'networkidle', timeout: 60000 });
try { const el = await page.$('text=/decline/i'); if (el) await el.click().catch(()=>{}); } catch(e){}
await page.waitForTimeout(1200);

const bands = await page.evaluate(() => {
  const wrap = document.querySelector('.bbc-impact-2026-wrap') || document.querySelector('main');
  // find candidate band elements: direct section-like blocks
  const cands = [...wrap.querySelectorAll('section, .rd-band, [class*="rd-"][class*="band"], div[class*="band"]')];
  const seen = new Set();
  const out = [];
  for (const el of cands) {
    const r = el.getBoundingClientRect();
    if (r.height < 80 || r.width < 100) continue;
    const top = Math.round(r.top + window.scrollY);
    const key = top + ':' + Math.round(r.height);
    // skip nested duplicates roughly
    const h2 = el.querySelector('h2');
    const eyebrow = el.querySelector('[class*="eyebrow"]');
    out.push({
      cls: (el.className||'').slice(0,55),
      top, h: Math.round(r.height),
      bg: getComputedStyle(el).backgroundColor,
      h2: h2 ? h2.textContent.trim().slice(0,60) : '',
      eyebrow: eyebrow ? eyebrow.textContent.trim().slice(0,32) : ''
    });
  }
  out.sort((a,b)=>a.top-b.top);
  return out;
});
console.log('BAND COUNT', bands.length);
bands.forEach((b,i)=>console.log(String(i).padStart(2),'top='+String(b.top).padStart(6),'h='+String(b.h).padStart(5),'| bg:'+b.bg.slice(0,20).padEnd(22),'| eyebrow:'+(b.eyebrow||'-').padEnd(26),'| h2:'+b.h2,'| .'+b.cls));
await browser.close();
