import { chromium } from '/Users/jamesmarr/Projects/bbc-theme-new/node_modules/playwright/index.mjs';
import fs from 'fs';
const EXEC = '/Users/jamesmarr/Library/Caches/ms-playwright/chromium-1223/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing';
const URL = 'https://bamboobicycleclub.org/pages/impact?preview_theme_id=196820238710';
const DIR = '/Users/jamesmarr/Projects/bbc-theme-new/qa/evidence/today';
const DESKTOP = process.argv[2] === 'desktop';
const VW = DESKTOP ? 1280 : 375;
const isMobile = !DESKTOP;
const suffix = DESKTOP ? '-d' : '';

const browser = await chromium.launch({ headless: true, executablePath: EXEC });
const ctx = await browser.newContext({ viewport: { width: VW, height: 812 }, deviceScaleFactor: 2, isMobile, hasTouch: isMobile });
const page = await ctx.newPage();
await page.goto(URL, { waitUntil: 'networkidle', timeout: 60000 });

// decline cookies
let cookieClicked = false;
for (const rx of [/decline/i, /reject/i, /only necessary/i, /essential only/i]) {
  try { const el = await page.$(`text=${rx}`); if (el) { await el.click({timeout:2000}).catch(()=>{}); cookieClicked = true; break; } } catch(e){}
}
await page.waitForTimeout(400);

// theme confirmation
const themeId = await page.evaluate(() => (window.Shopify && window.Shopify.theme && window.Shopify.theme.id) || null);

// count-up sampling (mobile only, before scroll)
let statSamples = null;
if (isMobile) {
  statSamples = await page.evaluate(async () => {
    const grab = () => [...document.querySelectorAll('.rd-num, .rd-stat__num, [class*="stat"] [class*="num"]')].slice(0,8).map(e=>e.textContent.trim());
    const s = [grab()];
    for (const d of [300,400,500,600]) { await new Promise(r=>setTimeout(r,d)); s.push(grab()); }
    return s;
  });
}

// full scroll to trigger lazy loads
await page.evaluate(async () => {
  const h = document.documentElement.scrollHeight;
  for (let y=0; y<h; y+=500){ window.scrollTo(0,y); await new Promise(r=>setTimeout(r,70)); }
  window.scrollTo(0,0);
});
await page.waitForTimeout(700);

const metrics = await page.evaluate(() => {
  const cs = el => getComputedStyle(el);
  const txt = el => (el.textContent||'').trim();
  const vis = e => { const r=e.getBoundingClientRect(); return r.width>8 && r.height>4; };
  const grab = sel => [...document.querySelectorAll(sel)].filter(vis).map(e=>({t:txt(e).slice(0,50),px:+parseFloat(cs(e).fontSize).toFixed(1),w:cs(e).fontWeight,tt:cs(e).textTransform,ta:cs(e).textAlign,x:Math.round(e.getBoundingClientRect().left)}));
  const W='.bbc-impact-2026-wrap ';
  const out={};
  out.themeId = (window.Shopify&&window.Shopify.theme&&window.Shopify.theme.id)||null;
  out.h1 = grab(W+'h1');
  out.h2 = grab(W+'h2');
  out.h3 = grab(W+'h3');
  out.eyebrows = grab(W+'[class*="eyebrow"]');
  out.chips = grab(W+'[class*="chip"], '+W+'[class*="tag"]:not(a)').slice(0,40);
  out.ledes = grab(W+'.rd-lede, '+W+'[class*="lede"]');
  out.buttons = [...document.querySelectorAll(W+'a[class*="btn"], '+W+'.rd-btn, '+W+'button')].filter(vis).map(e=>({t:txt(e).slice(0,32),px:+parseFloat(cs(e).fontSize).toFixed(1),bg:cs(e).backgroundColor,color:cs(e).color,bd:cs(e).borderColor,bw:cs(e).borderWidth,radius:cs(e).borderRadius,deco:cs(e).textDecorationLine}));
  out.imgs = [...document.querySelectorAll(W+'img')].filter(e=>e.getBoundingClientRect().width>4).map(e=>{const r=e.getBoundingClientRect();return {src:(e.currentSrc||e.src||'').split('/').pop().split('?')[0].slice(0,40),natW:e.naturalWidth,natH:e.naturalHeight,cw:Math.round(r.width),ch:Math.round(r.height),y:Math.round(r.top+window.scrollY)};});
  out.svgs = [...document.querySelectorAll(W+'svg')].map(e=>{const r=e.getBoundingClientRect();return {cls:(e.getAttribute('class')||'').slice(0,34),vb:e.getAttribute('viewBox')||'NONE',cw:Math.round(r.width),ch:Math.round(r.height)};}).filter(s=>s.cw<400&&s.cw>4);
  out.docW = document.documentElement.scrollWidth;
  out.winW = window.innerWidth;
  out.docH = document.documentElement.scrollHeight;
  out.overflowers = [];
  document.querySelectorAll(W+'*').forEach(e=>{const r=e.getBoundingClientRect(); if(r.right>window.innerWidth+2 && r.width<window.innerWidth && r.width>20){out.overflowers.push({cls:(e.className&&e.className.toString?e.className.toString():'').slice(0,34),right:Math.round(r.right),t:txt(e).slice(0,26)});}});
  out.overflowers = out.overflowers.slice(0,12);
  const body = document.querySelector('.bbc-impact-2026-wrap').innerText;
  out.banned = ['28,000','stronger than steel','56.7','11.41','280 per','100% completion','36+'].filter(b=>body.toLowerCase().includes(b.toLowerCase()));
  out.hasLearners = /\blearners?\b/i.test(body);
  out.hasPrisoners = /\bprisoners?\b/i.test(body);
  out.has45 = /45\s*countr/i.test(body);
  out.bodyLen = body.length;
  return out;
});

const contrasts = await page.evaluate(() => {
  const parseRGB=s=>{const m=s.match(/rgba?\(([^)]+)\)/);if(!m)return null;const p=m[1].split(',').map(x=>parseFloat(x));return {r:p[0],g:p[1],b:p[2],a:p[3]===undefined?1:p[3]};};
  const linz=c=>{c/=255;return c<=0.03928?c/12.92:Math.pow((c+0.055)/1.055,2.4);};
  const lum=g=>0.2126*linz(g.r)+0.7152*linz(g.g)+0.0722*linz(g.b);
  const ratio=(f,b)=>{const L1=lum(f),L2=lum(b);const a=Math.max(L1,L2),c=Math.min(L1,L2);return (a+0.05)/(c+0.05);};
  const effBg=el=>{let e=el;while(e){const b=parseRGB(getComputedStyle(e).backgroundColor);if(b&&b.a>0.5)return b;e=e.parentElement;}return {r:255,g:255,b:255};};
  const els=[...document.querySelectorAll('.bbc-impact-2026-wrap h1,.bbc-impact-2026-wrap h2,.bbc-impact-2026-wrap h3,.bbc-impact-2026-wrap p,.bbc-impact-2026-wrap li,.bbc-impact-2026-wrap a,.bbc-impact-2026-wrap [class*="eyebrow"],.bbc-impact-2026-wrap [class*="chip"],.bbc-impact-2026-wrap cite,.bbc-impact-2026-wrap .rd-num,.bbc-impact-2026-wrap span')];
  const res=[];const seen=new Set();
  for(const el of els){const r=el.getBoundingClientRect();if(r.width<10||r.height<6)continue;if(el.children.length&&!['A','CITE'].includes(el.tagName)){if([...el.children].some(c=>c.textContent.trim()===el.textContent.trim()))continue;}const fg=parseRGB(getComputedStyle(el).color);if(!fg)continue;const bg=effBg(el);const cr=ratio(fg,bg);const t=(el.textContent||'').trim().slice(0,36);if(!t)continue;const key=t+Math.round(cr*10);if(seen.has(key))continue;seen.add(key);res.push({t,cr:+cr.toFixed(2),px:+parseFloat(getComputedStyle(el).fontSize).toFixed(0),w:getComputedStyle(el).fontWeight,tag:el.tagName});}
  res.sort((a,b)=>a.cr-b.cr);
  return res.slice(0,30);
});

fs.writeFileSync(`${DIR}/gate-metrics-${DESKTOP?'d':'m'}.json`, JSON.stringify({VW,cookieClicked,themeId,statSamples,metrics,contrastsLow:contrasts}, null, 2));

// band detection + screenshots
const count = await page.evaluate(() => {
  const wrap=document.querySelector('.bbc-impact-2026-wrap');
  const cands=[...wrap.querySelectorAll('.rd-pad, .rd-pad-sm, .rd-split, section')];
  const uniq=[];const seen=new Set();
  cands.map(el=>({el,top:el.getBoundingClientRect().top+window.scrollY,h:el.getBoundingClientRect().height})).filter(o=>o.h>80).sort((a,b)=>a.top-b.top).forEach(o=>{const t=Math.round(o.top);if([...seen].some(x=>Math.abs(x-t)<24))return;seen.add(t);uniq.push({el:o.el,h:Math.round(o.h)});});
  uniq.forEach((o,i)=>o.el.setAttribute('data-gband',String(i)));
  return uniq.map(o=>o.h);
});
const names=['stats','one-craft-two-arms','inside-workshop','build-to-bond-feature','the-evidence-stories','where-we-work','recognised-by','why-now-policy','whats-next','get-involved','final-cta'];

const band0top = await page.evaluate(()=>{const e=document.querySelector('[data-gband="0"]');return e?Math.round(e.getBoundingClientRect().top+window.scrollY):700;});
await page.evaluate(()=>window.scrollTo(0,0));
await page.waitForTimeout(200);
await page.screenshot({ path:`${DIR}/band-00-hero${suffix}.png`, clip:{x:0,y:0,width:VW,height:Math.min(band0top+40,812)} });

for(let i=0;i<count.length;i++){
  const h = await page.$(`[data-gband="${i}"]`);
  if(!h) continue;
  const nm = names[i]||('band'+i);
  try {
    // Always use full-page scroll + clip screenshot (NOT elementHandle.screenshot()) —
    // element screenshots of tall (>~1500px) elements containing mix-blend-mode
    // pseudo-elements (.rd-duotone) render as a flat dark gradient in headless
    // Chromium (compositing artifact), a false positive verified against true
    // full-page renders during this pass. clip-based capture matches what a real
    // visitor sees.
    const box = await h.boundingBox();
    await page.evaluate(y=>window.scrollTo(0,y), Math.round(box.y));
    await page.waitForTimeout(200);
    await page.screenshot({ path:`${DIR}/band-${String(i+1).padStart(2,'0')}-${nm}${suffix}.png`, clip:{x:0,y:0,width:VW,height:Math.min(count[i],3800)} });
  } catch(e){ console.log('shot fail',i,nm,e.message.slice(0,60)); }
}
console.log((DESKTOP?'DESKTOP':'MOBILE')+' done. themeId='+themeId+' cookieClicked='+cookieClicked+' docH='+metrics.docH+' docW='+metrics.docW+' winW='+metrics.winW+' bands='+count.length);
console.log('bandHeights='+JSON.stringify(count));
if(statSamples) console.log('statSamples='+JSON.stringify(statSamples));
await browser.close();
