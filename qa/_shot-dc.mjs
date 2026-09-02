import { chromium } from '@playwright/test';
const [file,out,w,h] = process.argv.slice(2);
const b = await chromium.launch(); const pg = await b.newPage({ viewport:{width:+w,height:+h}, reducedMotion:'no-preference' });
await pg.goto('file://'+file); await pg.waitForTimeout(2500);
await pg.screenshot({ path: out, fullPage:true }); await b.close(); console.log('shot', out);
