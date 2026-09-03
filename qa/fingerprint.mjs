// TEXT FINGERPRINTS — estate-wide change detection for CONTENT.
//
// Why this exists (2026-07-24, empirical): the pixel net passed 48/48 while an OCN course title
// had visibly changed on /pages/impact. Two reasons, both measured:
//   · maxDiffPixelRatio scales with page height — 1.5% of the 1280×11757 impact page allowed
//     225,734 differing pixels, ~19× a changed text label. Fixed by moving to absolute
//     maxDiffPixels, but that only narrowed the hole.
//   · even at 2,500 px absolute, a single short label rendered at the reveal system's 0.3
//     from-state produced too few differing pixels to trip it.
// Pixel diffing is strong on layout and weak on copy. Copy is what carries our compliance risk
// (banned claims, prices, qualification titles), so it needs its own instrument.
//
// A fingerprint is the page's visible text plus its type-role sizes: ~5–20KB per page, roughly
// 100× cheaper than a screenshot, diffs as readable lines in git, and catches exactly what the
// pixel net cannot. Run it, then `git diff` the output — every copy change shows up as text.
//
// Usage: node qa/fingerprint.mjs [--widths=390,1280]
import { chromium } from 'playwright';
import { mkdirSync, writeFileSync } from 'fs';

const BASE = 'https://bamboobicycleclub.org';
const P = 'preview_theme_id=196820238710';
const DATE = new Date().toISOString().slice(0, 10);
const OUT = `qa/evidence/${DATE}/fingerprints`;

const PAGES = ['/', '/pages/impact', '/pages/programmes', '/pages/workshops', '/pages/schools',
  '/pages/why-bamboo', '/pages/bicycleteambuilding', '/pages/our-story-2', '/pages/which-kit',
  '/pages/build-to-bond', '/pages/theory-of-change', '/pages/impact-report', '/pages/prisons',
  '/pages/support-mission', '/pages/contact-us', '/pages/gallery', '/pages/club-news',
  '/collections/home-build-kits', '/products/gravel-frame-build-kit', '/products/bottom-bracket-68mm'];

const widthArg = process.argv.find(a => a.startsWith('--widths='));
const WIDTHS = widthArg ? widthArg.split('=')[1].split(',').map(Number) : [1280];

mkdirSync(OUT, { recursive: true });
const browser = await chromium.launch({ channel: 'chrome' });

for (const w of WIDTHS) {
  const ctx = await browser.newContext({ viewport: { width: w, height: 900 } });
  const page = await ctx.newPage();
  for (const path of PAGES) {
    try {
      await page.goto(BASE + path + (path.includes('?') ? '&' : '?') + P + '&fp=1', { waitUntil: 'load', timeout: 40000 });
      await page.waitForTimeout(500);
      const fp = await page.evaluate(() => {
        // Type-role sizes: the FORMULA §1 contract ("one size per role"). Recorded per page so a
        // scale drift shows up as a diff line rather than needing a separate audit.
        const roles = {};
        for (const sel of ['h1', 'h2', 'h3', 'p', '.rd-eyebrow', '.rd-lbl', 'button', '.rd-btn']) {
          const sizes = [...new Set([...document.querySelectorAll(sel)]
            .filter(e => e.getBoundingClientRect().height > 0)
            .map(e => getComputedStyle(e).fontSize))].sort();
          if (sizes.length) roles[sel] = sizes.join(',');
        }
        const text = (document.body.innerText || '')
          .split('\n').map(l => l.trim()).filter(Boolean).join('\n');
        return { title: document.title, h: document.documentElement.scrollHeight, roles, text };
      });
      const body = [
        `# ${path} @${w}`,
        `title: ${fp.title}`,
        `height: ${fp.h}`,
        ...Object.entries(fp.roles).map(([k, v]) => `type ${k}: ${v}`),
        '--- text ---',
        fp.text,
      ].join('\n');
      writeFileSync(`${OUT}/${w}-${(path.replace(/[\/?=&]+/g, '_') || 'home')}.txt`, body);
      process.stdout.write('.');
    } catch (e) {
      process.stdout.write('x');
    }
  }
  await ctx.close();
}
await browser.close();
console.log(`\nfingerprints → ${OUT} (git diff to see every copy/type change)`);
