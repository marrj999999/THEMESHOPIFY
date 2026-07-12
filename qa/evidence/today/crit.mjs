import { chromium } from '/Users/jamesmarr/Projects/bbc-theme-new/node_modules/playwright/index.mjs';
import fs from 'fs';
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
await page.waitForTimeout(300);

// count-up sampling (mobile only, before scrolling)
let statSamples = [];
if (isMobile) {
  statSamples = await page.evaluate(async () => {
    const grab = () => [...document.querySelectorAll('.rd-num, [class*="stat"] [class*="num"], .rd-stat__num')].slice(0,6).map(e=>e.textContent.trim());
    const s0 = grab();
    await new Promise(r=>setTimeout(r,250)); const s1=grab();
    await new Promise(r=>setTimeout(r,500)); const s2=grab();
    await new Promise(r=>setTimeout(r,700)); const s3=grab();
    return {s0,s1,s2,s3};
  });
}

await page.evaluate(async () => {
  const h = document.documentElement.scrollHeight;
  for (let y=0; y<h; y+=600){ window.scrollTo(0,y); await new Promise(r=>setTimeout(r,60)); }
  window.scrollTo(0,0);
});
await page.waitForTimeout(600);

const metrics = await page.evaluate(() => {
  const out = {};
  const cs = el => getComputedStyle(el);
  const txt = el => (el.textContent||'').trim();
  const grab = (sel) => [...document.querySelectorAll(sel)].filter(e=>{const r=e.getBoundingClientRect();return r.width>10&&r.height>4;}).map(e=>({t:txt(e).slice(0,45),px:+parseFloat(cs(e).fontSize).toFixed(1),w:cs(e).fontWeight,tt:cs(e).textTransform,ta:cs(e).textAlign}));
  out.h1 = grab('.bbc-impact-2026-wrap h1');
  out.h2 = grab('.bbc-impact-2026-wrap h2');
  out.h3 = grab('.bbc-impact-2026-wrap h3');
  out.eyebrows = grab('[class*="eyebrow"]');
  out.ledes = grab('.rd-lede');
  out.buttons = [...document.querySelectorAll('.bbc-impact-2026-wrap a[class*="btn"], .bbc-impact-2026-wrap .rd-btn, .bbc-impact-2026-wrap button')].filter(e=>{const r=e.getBoundingClientRect();return r.width>20&&r.height>10;}).map(e=>({t:txt(e).slice(0,30),px:+parseFloat(cs(e).fontSize).toFixed(1),bg:cs(e).backgroundColor,color:cs(e).color,radius:cs(e).borderRadius,deco:cs(e).textDecorationLine}));
  out.logos = [...document.querySelectorAll('.bbc-impact-2026-wrap img')].filter(e=>{const r=e.getBoundingClientRect();return r.width>4;}).map(e=>{const r=e.getBoundingClientRect();return {src:(e.src||'').split('/').pop().split('?')[0].slice(0,34),natW:e.naturalWidth,natH:e.naturalHeight,cw:Math.round(r.width),ch:Math.round(r.height)};});
  out.svgLogos = [...document.querySelectorAll('.bbc-impact-2026-wrap svg')].map(e=>{const r=e.getBoundingClientRect();return {cls:(e.getAttribute('class')||'').slice(0,30),vb:e.getAttribute('viewBox')||'NONE',cw:Math.round(r.width),ch:Math.round(r.height)};}).filter(s=>s.cw<400);
  out.docW = document.documentElement.scrollWidth;
  out.winW = window.innerWidth;
  out.docH = document.documentElement.scrollHeight;
  out.overflowers = [];
  document.querySelectorAll('.bbc-impact-2026-wrap *').forEach(e=>{const r=e.getBoundingClientRect(); if(r.right>window.innerWidth+2 && r.width<window.innerWidth && r.width>20){out.overflowers.push({cls:(e.className&&e.className.toString?e.className.toString():'').slice(0,30),right:Math.round(r.right),t:(e.textContent||'').trim().slice(0,26)});}});
  out.overflowers = out.overflowers.slice(0,10);
  const body = document.querySelector('.bbc-impact-2026-wrap').innerText;
  const bannedList = ['28,000','stronger than steel','56.7','11.41','280 per','100% completion'];
  out.banned = bannedList.filter(b=>body.toLowerCase().includes(b.toLowerCase()));
  out.hasLearners = /\blearners?\b/i.test(body);
  out.hasPrisoners = /\bprisoners?\b/i.test(body);
  out.has36 = /36\+?\s*countr/i.test(body);
  out.has45 = /45\s*countr/i.test(body);
  out.axes = [...document.querySelectorAll('.bbc-impact-2026-wrap .rd-wrap, .bbc-impact-2026-wrap .rd-inner, .bbc-impact-2026-wrap .rd-pad > *:first-child')].slice(0,20).map(e=>{const r=e.getBoundingClientRect();return {cls:(e.className||'').slice(0,24),x:Math.round(r.left)};});
  return out;
});

const contrasts = await page.evaluate(() => {
  function parseRGB(s){const m=s.match(/rgba?\(([^)]+)\)/);if(!m)return null;const p=m[1].split(',').map(x=>parseFloat(x));return {r:p[0],g:p[1],b:p[2],a:p[3]===undefined?1:p[3]};}
  function linz(c){c/=255;return c<=0.03928?c/12.92:Math.pow((c+0.055)/1.055,2.4);}
  function lum(rgb){return 0.2126*linz(rgb.r)+0.7152*linz(rgb.g)+0.0722*linz(rgb.b);}
  function ratio(fg,bg){const L1=lum(fg),L2=lum(bg);const a=Math.max(L1,L2),b=Math.min(L1,L2);return (a+0.05)/(b+0.05);}
  function effBg(el){let e=el;while(e){const b=parseRGB(getComputedStyle(e).backgroundColor);if(b&&b.a>0.5)return b;e=e.parentElement;}return {r:255,g:255,b:255};}
  const els=[...document.querySelectorAll('.bbc-impact-2026-wrap h1,.bbc-impact-2026-wrap h2,.bbc-impact-2026-wrap h3,.bbc-impact-2026-wrap p,.bbc-impact-2026-wrap li,.bbc-impact-2026-wrap a,.bbc-impact-2026-wrap [class*="eyebrow"],.bbc-impact-2026-wrap [class*="chip"],.bbc-impact-2026-wrap cite,.bbc-impact-2026-wrap .rd-num')];
  const res=[];const seen=new Set();
  for(const el of els){const r=el.getBoundingClientRect();if(r.width<10||r.height<6)continue;if(el.children.length&&!['A','CITE'].includes(el.tagName)){if([...el.children].some(c=>c.textContent.trim()===el.textContent.trim()))continue;}const fg=parseRGB(getComputedStyle(el).color);if(!fg)continue;const bg=effBg(el);const cr=ratio(fg,bg);const t=(el.textContent||'').trim().slice(0,32);const key=t+Math.round(cr*10);if(seen.has(key))continue;seen.add(key);res.push({t,cr:+cr.toFixed(2),px:+parseFloat(getComputedStyle(el).fontSize).toFixed(0),tag:el.tagName});}
  res.sort((a,b)=>a.cr-b.cr);
  return res;
});

fs.writeFileSync(`${DIR}/metrics-${tag}.json`, JSON.stringify({VW,statSamples,metrics,contrastsLow:contrasts.slice(0,25)}, null, 2));

const bands = await page.evaluate(() => {
  const wrap=document.querySelector('.bbc-impact-2026-wrap');
  const cands=[...wrap.querySelectorAll('section, .rd-band, div[class*="band"], .rd-pad, .rd-pad-sm, .rd-split')];
  const out=[];const seenTop=new Set();
  for(const el of cands){const r=el.getBoundingClientRect();if(r.height<80||r.width<100)continue;const top=Math.round(r.top+window.scrollY);if([...seenTop].some(t=>Math.abs(t-top)<20))continue;seenTop.add(top);out.push({top,h:Math.round(r.height)});}
  out.sort((a,b)=>a.top-b.top);
  return out;
});

async function clip(name, top, h){
  const clipH = Math.min(h, 4000);
  await page.evaluate(()=>window.scrollTo(0,0));
  await page.waitForTimeout(150);
  try { await page.screenshot({ path: `${DIR}/${name}`, clip:{x:0,y:top,width:VW,height:clipH}, animations:'disabled' }); }
  catch(e){ console.log('clip fail',name,e.message); }
}
const names=['stats','what-we-do','why-now','inside-workshop','follow-on','where-we-operate','whats-next','get-involved','recognised-by','final-cta'];
await clip(`${tag}-band-00-hero.png`, 0, bands.length?bands[0].top+40:800);
for(let i=0;i<bands.length;i++){
  const nm = names[i] || ('band'+i);
  await clip(`${tag}-band-${String(i+1).padStart(2,'0')}-${nm}.png`, bands[i].top, bands[i].h);
}
console.log(tag.toUpperCase()+' done. docH='+metrics.docH+' docW='+metrics.docW+' bands='+bands.length);
console.log('statSamples', JSON.stringify(statSamples));
await browser.close();
