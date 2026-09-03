import { chromium } from 'playwright';
const URL='https://bamboobicycleclub.org/pages/programmes?preview_theme_id=198837993846';
const OUT=process.argv[2];
const b=await chromium.launch();
const p=await b.newPage({viewport:{width:375,height:812},deviceScaleFactor:2});
await p.goto(URL,{waitUntil:'networkidle',timeout:60000});
await p.addStyleTag({content:'*{scroll-behavior:auto !important}'});
const shots=[['hero','.rd-hero'],['split-band','.rd-split'],['case-studies','.rd-csgrid'],['tier-cards','.rd-grid.rd-g3']];
for(const [name,sel] of shots){
  const el=await p.$(sel);
  if(!el){ console.log('skip (not found):',name); continue; }
  await el.scrollIntoViewIfNeeded();
  await p.waitForTimeout(700);
  await el.screenshot({path:`${OUT}/mobile-${name}.png`});
  const box=await el.boundingBox();
  console.log(`${name}: ${Math.round(box.width)}x${Math.round(box.height)}`);
}
await p.screenshot({path:`${OUT}/mobile-full-page.png`,fullPage:true});
console.log('full-page saved');
await b.close();
