// TYPE DRIFT — the honest metric.
//
// Created 2026-07-27, after the CIC benchmark's cruder metric ("how many distinct sizes does a
// role render") flagged BBC as 19th of 21 for design discipline. Investigating the five "body
// sizes" on the homepage found FOUR of them were legitimate, documented roles — caption 13,
// footnote 14, body 18, lede 22 — and the fifth (16px) is FORMULA §1's step/list role used in
// door cards and the footer tagline. Nothing was actually broken.
//
// Counting sizes conflates "five roles used correctly" with "five sizes used at random". The
// question that actually detects inconsistency is:
//
//     Does the SAME class render at DIFFERENT sizes across the estate?
//
// Same class, different size = real drift — the component means one thing here and another there.
// Different class, different size = a design system doing its job.
//
// (The peer comparison in cic-benchmark.md remains valid: both sides were measured the same crude
// way. It is the INTERPRETATION that needed this correction, not the ranking.)
//
// Usage: node qa/type-drift-audit.mjs
import { chromium } from 'playwright';
import { writeFileSync, mkdirSync } from 'fs';

const BASE = 'https://bamboobicycleclub.org';
const P = 'preview_theme_id=196820238710';
const DATE = new Date().toISOString().slice(0, 10);
const PAGES = ['/', '/pages/impact', '/pages/programmes', '/pages/workshops', '/pages/schools',
  '/pages/why-bamboo', '/pages/bicycleteambuilding', '/pages/our-story-2', '/pages/which-kit',
  '/pages/build-to-bond', '/pages/theory-of-change', '/pages/impact-report', '/pages/prisons',
  '/pages/support-mission', '/collections/home-build-kits', '/products/gravel-frame-build-kit',
  '/products/bottom-bracket-68mm', '/pages/contact-us', '/pages/gallery', '/blogs/news'];

const browser = await chromium.launch({ channel: 'chrome', headless: true });
const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
const page = await ctx.newPage();

// class -> Map(size -> [pages])
const byClass = new Map();

for (const path of PAGES) {
  try {
    await page.goto(BASE + path + (path.includes('?') ? '&' : '?') + P + '&td=1', { waitUntil: 'load', timeout: 40000 });
    await page.waitForTimeout(600);
    const rows = await page.evaluate(() => {
      const TP = '#shopify-pc__banner,.shopify-pc__banner,#insta-feed,[id^="PBar"],.shopify-payment-button';
      const painted = e => !e.closest(TP)
        && (!e.checkVisibility || e.checkVisibility({ checkVisibilityCSS: true }))
        && e.getBoundingClientRect().height > 4 && e.getBoundingClientRect().width > 20
        && getComputedStyle(e).visibility === 'visible';
      const out = [];
      for (const e of document.querySelectorAll('[class]')) {
        if (!painted(e)) continue;
        const txt = (e.textContent || '').trim();
        if (txt.length < 8) continue;
        // Only leaf-ish text nodes — a wrapper's font-size is inherited noise.
        if (e.children.length > 1) continue;
        for (const cls of (e.className || '').toString().split(/\s+/)) {
          // Our design-system classes only. rd-cmp-* are per-instance one-offs, not roles.
          if (!/^(rd|bbc|ew|bbcst)-/.test(cls)) continue;
          if (/^rd-cmp-/.test(cls)) continue;
          // Skip pure layout/spacing utilities — they carry no type meaning.
          if (/^rd-(mt|mb|ml|mr|p|g|grid|flex|wrap|between|center|mx|mw|maxw)/.test(cls)) continue;
          // Skip BEHAVIOUR and COLOUR modifiers. These are deliberately applied across elements of
          // many different sizes — rd-reveal is the scroll-animation hook, rd-lime/rd-on-dark are
          // surface modifiers, bbc-counted is the count-up hook. Reporting them as "type drift"
          // is the cry-wolf failure (ESCAPES #10): they are not type roles and never were.
          if (/^(rd-reveal|rd-in|rd-stagger|rd-lime|rd-on-dark|rd-dark|rd-light|rd-center|rd-left|bbc-counted|rd-anim|rd-hover)$/.test(cls)) continue;
          out.push([cls, Math.round(parseFloat(getComputedStyle(e).fontSize))]);
        }
      }
      return out;
    });
    for (const [cls, size] of rows) {
      if (!byClass.has(cls)) byClass.set(cls, new Map());
      const m = byClass.get(cls);
      if (!m.has(size)) m.set(size, new Set());
      m.get(size).add(path);
    }
    process.stdout.write('.');
  } catch { process.stdout.write('x'); }
}
await browser.close();

const drift = [];
for (const [cls, sizes] of byClass) {
  if (sizes.size < 2) continue;
  // Ignore classes that only ever appear once per size — likely a one-off, not a system role.
  const total = [...sizes.values()].reduce((n, s) => n + s.size, 0);
  if (total < 3) continue;
  drift.push({
    cls,
    sizes: [...sizes.entries()].map(([px, pages]) => ({ px, pages: [...pages].length, where: [...pages].slice(0, 3) }))
      .sort((a, b) => a.px - b.px),
  });
}
drift.sort((a, b) => b.sizes.length - a.sizes.length || a.cls.localeCompare(b.cls));

let out = `TYPE DRIFT AUDIT — ${DATE}\n` +
  `Same class rendering different sizes across ${PAGES.length} pages @1280.\n` +
  `Same class + different size = real drift. Different class + different size = a design system.\n\n` +
  `${byClass.size} design-system classes measured · ${drift.length} showing drift\n\n`;
for (const d of drift) {
  out += `${d.cls}\n`;
  for (const s of d.sizes) out += `   ${String(s.px).padStart(3)}px on ${s.pages} page(s)  e.g. ${s.where.join(', ')}\n`;
}
if (!drift.length) out += 'No class renders at more than one size. The system is internally consistent.\n';

mkdirSync(`qa/evidence/${DATE}`, { recursive: true });
writeFileSync(`qa/evidence/${DATE}/type-drift-audit.txt`, out);
console.log('\n' + out);
