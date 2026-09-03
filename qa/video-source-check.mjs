// VIDEO SOURCE GUARD — YouTube only. No Reels.
//
// James, 2026-07-31: "don't use any reels source videos from youtube."
//
// Every moving-image embed on the estate must come from YouTube. Instagram Reels, TikTok and
// Facebook video are not acceptable sources for site content: they carry third-party tracking,
// they break when a post is deleted or an account changes visibility, and their aspect ratios
// fight the card system.
//
// The check deliberately distinguishes an EMBED from a LINK. Every page footer links to
// instagram.com/bamboobicycleclub — that is a social profile link and is fine. What is not fine
// is an <iframe>, <video> or player wired to a Reel. A naive grep for "instagram" flags all 7
// footer links and reports a clean estate as broken; that is why this looks at embeds only.
//
// Usage: node qa/video-source-check.mjs [--all] [path ...]
import { chromium } from 'playwright';
import { ALL_PAGES, previewUrl } from './estate-pages.mjs';

const ARGS = process.argv.slice(2).filter(a => !a.startsWith('--'));
const PAGES = ARGS.length ? ARGS
  : process.argv.includes('--all') ? ALL_PAGES
  : ['/', '/pages/impact', '/pages/schools', '/pages/bicycleteambuilding', '/pages/why-bamboo',
     '/pages/build-to-bond', '/pages/workshops', '/products/gravel-frame-build-kit'];

const BANNED = /instagram\.com\/(p|reel|tv)\/|\/reel\/|fb\.watch|facebook\.com\/.*\/videos?\/|tiktok\.com\/.*\/video\/|vm\.tiktok/i;

const browser = await chromium.launch({ channel: 'chrome' });
const bad = [], ok = [];
let measured = 0;

for (const path of PAGES) {
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 }, reducedMotion: 'reduce' });
  const page = await ctx.newPage();
  try {
    await page.goto(previewUrl(path, '&vsrc=1'), { waitUntil: 'load', timeout: 45000 });
    await page.waitForTimeout(1400);
    await page.evaluate(async () => {
      for (let y = 0; y < document.documentElement.scrollHeight; y += 800) {
        window.scrollTo({ top: y, behavior: 'instant' }); await new Promise(r => setTimeout(r, 40));
      }
    });
    const found = await page.evaluate(() => {
      // EMBEDS ONLY — players and the attributes that become players. Anchors are excluded on
      // purpose: a link to a social profile is not a video source.
      const nodes = [...document.querySelectorAll('iframe[src], video[src], video source[src], [data-yt], [data-video], [data-embed]')];
      return nodes.map(e => ({
        src: e.getAttribute('src') || e.getAttribute('data-yt') || e.getAttribute('data-video') || e.getAttribute('data-embed') || '',
        tag: e.tagName.toLowerCase(),
      })).filter(x => x.src);
    });
    measured++;
    for (const f of found) {
      if (BANNED.test(f.src)) bad.push(`${path}  <${f.tag}>  ${f.src.slice(0, 90)}`);
      else if (/youtu/i.test(f.src)) ok.push(f.src);
    }
  } catch (e) {
    console.log(`  ${path}: ERROR ${String(e).slice(0, 60)}`);
  }
  await ctx.close();
}
await browser.close();

console.log(`\n═══ VIDEO SOURCES ═══`);
console.log(`measured ${measured}/${PAGES.length} pages · ${ok.length} YouTube embeds · ${bad.length} banned`);
if (!measured) { console.log('\n✗ MEASURED NOTHING — cannot certify anything'); process.exit(1); }

if (bad.length) {
  console.log(`\n✗ NON-YOUTUBE VIDEO EMBEDS:`);
  bad.forEach(b => console.log('   ' + b));
  process.exit(1);
}
console.log('\n✓ every video embed on the estate is served from YouTube');
