import { chromium } from 'playwright';
const b=await chromium.launch();
for(const [n,w,h] of [['laptop',1440,780],['mobile',375,812]]){
  const p=await b.newPage({viewport:{width:w,height:h},deviceScaleFactor:2});
  await p.goto('https://bamboobicycleclub.org/pages/programmes?preview_theme_id=198837993846',{waitUntil:'networkidle',timeout:60000});
  const el=await p.$('.bbc-seenat');
  await el.scrollIntoViewIfNeeded(); await p.waitForTimeout(1200);
  await el.screenshot({path:`qa/evidence/2026-08-28/seenat-${n}.png`});
  const m=await p.evaluate(()=>[...document.querySelectorAll('.bbc-seenat__logo')].map(i=>({
    alt:i.alt.slice(0,20), w:Math.round(i.getBoundingClientRect().width), h:Math.round(i.getBoundingClientRect().height)})));
  console.log(n, JSON.stringify(m));
  await p.close();
}
await b.close();
