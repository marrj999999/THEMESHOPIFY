import { chromium } from '@playwright/test';
const [outDir, ...paths] = process.argv.slice(2);
const b = await chromium.launch();
for (const p of paths) {
  for (const [vp,w,h] of [['mobile',390,844],['desktop',1440,900]]) {
    const ctx = await b.newContext({ viewport:{width:w,height:h}, reducedMotion:'reduce' });
    const pg = await ctx.newPage();
    await pg.goto('https://bamboobicycleclub.org'+p, { waitUntil:'networkidle', timeout:60000 });
    await pg.waitForTimeout(2500);
    await pg.evaluate(async()=>{ for(let y=0;y<document.body.scrollHeight;y+=700){window.scrollTo(0,y);await new Promise(r=>setTimeout(r,50));} window.scrollTo(0,0); });
    await pg.waitForTimeout(400);
    const slug = (p.replace(/^\//,'').replace(/[\/?=&]/g,'-') || 'home');
    await pg.screenshot({ path: `${outDir}/${slug}-${vp}.png`, fullPage: true });
    await ctx.close(); await new Promise(r=>setTimeout(r,700));
  }
  console.log('shot', p);
}
await b.close();
