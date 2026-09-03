import { chromium } from '/Users/jamesmarr/Projects/bbc-theme-new/node_modules/playwright/index.mjs';
const EXEC = '/Users/jamesmarr/Library/Caches/ms-playwright/chromium-1223/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing';
const URL = 'https://bamboobicycleclub.org/pages/impact?preview_theme_id=196820238710';
const DIR = '/Users/jamesmarr/Projects/bbc-theme-new/qa/evidence/today';
const VW = process.argv[2] === 'desktop' ? 1280 : 375;
const isMobile = VW === 375;
const tag = isMobile ? 'm' : 'd';

const browser = await chromium.launch({ headless: true, executablePath: EXEC });
const ctx = await browser.newContext({ viewport: { width: VW, height: 812 }, deviceScaleFactor: 2, isMobile, hasTouch: isMobile });
const page = await ctx.newPage();
await page.goto(URL, { waitUntil: 'networkidle', timeout: 60000 });
try { const el = await page.$('text=/decline/i'); if (el) await el.click().catch(()=>{}); } catch(e){}
await page.evaluate(async () => { const h=document.documentElement.scrollHeight; for(let y=0;y<h;y+=500){window.scrollTo(0,y);await new Promise(r=>setTimeout(r,50));} window.scrollTo(0,0); });
await page.waitForTimeout(500);

const count = await page.evaluate(() => {
  const wrap=document.querySelector('.bbc-impact-2026-wrap');
  const cands=[...wrap.querySelectorAll('.rd-pad, .rd-pad-sm, .rd-split')];
  const uniq=[];const seen=new Set();
  cands.map(el=>({el,top:el.getBoundingClientRect().top+window.scrollY})).sort((a,b)=>a.top-b.top).forEach(o=>{const t=Math.round(o.top);if([...seen].some(x=>Math.abs(x-t)<20))return;seen.add(t);uniq.push(o.el);});
  uniq.forEach((el,i)=>el.setAttribute('data-critband',String(i)));
  return uniq.length;
});
const names=['stats','what-we-do','why-now','inside-workshop','follow-on','where-we-operate','whats-next','get-involved','recognised-by','final-cta'];

const band0top = await page.evaluate(()=>{const e=document.querySelector('[data-critband="0"]');return e?Math.round(e.getBoundingClientRect().top+window.scrollY):700;});
await page.evaluate(()=>window.scrollTo(0,0));
await page.waitForTimeout(200);
await page.screenshot({ path:`${DIR}/${tag}-band-00-hero.png`, clip:{x:0,y:0,width:VW,height:Math.min(band0top+40,812)} });

for(let i=0;i<count;i++){
  const h = await page.$(`[data-critband="${i}"]`);
  if(!h) continue;
  const nm = names[i]||('band'+i);
  try { await h.scrollIntoViewIfNeeded(); await page.waitForTimeout(120); await h.screenshot({ path:`${DIR}/${tag}-band-${String(i+1).padStart(2,'0')}-${nm}.png` }); }
  catch(e){ console.log('shot fail',i,nm,e.message.slice(0,60)); }
}
console.log(tag.toUpperCase()+' shots done, bands='+count);
await browser.close();
