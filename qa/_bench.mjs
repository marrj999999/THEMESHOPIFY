// Benchmark a page across breakpoints on TWO themes (live vs preview) and diff the numbers.
import { chromium } from 'playwright';
import { mkdirSync } from 'fs';
const PAGES = process.argv[2].split(',');
const OUT = process.argv[3];
const THEMES = { live: '196820238710', preview: '198837993846' };
const VPS = [['mobile',375,812],['tablet',768,1024],['laptop',1440,780]];
const b = await chromium.launch();
const results = [];
for (const page of PAGES) {
  for (const [vpName,w,h] of VPS) {
    const row = { page, vp: vpName };
    for (const [tName,tid] of Object.entries(THEMES)) {
      const p = await b.newPage({ viewport:{width:w,height:h}, deviceScaleFactor:1 });
      try {
        await p.goto(`https://bamboobicycleclub.org${page}?preview_theme_id=${tid}`,{waitUntil:'networkidle',timeout:60000});
        await p.addStyleTag({content:'*{scroll-behavior:auto!important;animation:none!important;transition:none!important}'});
        await p.waitForTimeout(400);
        const m = await p.evaluate(() => {
          const de=document.documentElement;
          const q=s=>document.querySelector(s);
          const box=e=>e?Math.round(e.getBoundingClientRect().height):null;
          const hero=q('.rd-hero'), bg=hero&&hero.querySelector('.rd-bg');
          const cards=[...document.querySelectorAll('.rd-cscard')].filter(c=>c.getBoundingClientRect().height>40);
          return { docH:de.scrollHeight, overflow:de.scrollWidth>de.clientWidth,
            heroH:box(hero), heroGap: hero&&bg? Math.round(hero.getBoundingClientRect().height-bg.getBoundingClientRect().height):null,
            cardMax: cards.length?Math.max(...cards.map(c=>Math.round(c.getBoundingClientRect().height))):null,
            h3: (()=>{const e=q('.rd-cscard__heading'); return e?getComputedStyle(e).fontSize:null;})() };
        });
        row[tName]=m;
        mkdirSync(`${OUT}/${tName}`,{recursive:true});
        await p.screenshot({path:`${OUT}/${tName}/${page.replace(/\//g,'_')||'home'}-${vpName}.png`,fullPage:true});
      } catch(e){ row[tName]={error:String(e).slice(0,60)}; }
      await p.close();
    }
    results.push(row);
  }
}
await b.close();
for(const r of results){
  const L=r.live||{}, P=r.preview||{};
  const d=(a,b)=>(a==null||b==null)?'-':(b-a>0?'+':'')+(b-a);
  console.log(`${r.page} @${r.vp}  docH ${L.docH}->${P.docH} (${d(L.docH,P.docH)})  hero ${L.heroH}->${P.heroH}  heroGap ${L.heroGap}->${P.heroGap}  card ${L.cardMax}->${P.cardMax}  h3 ${L.h3}->${P.h3}  ovf ${L.overflow}/${P.overflow}`);
}
