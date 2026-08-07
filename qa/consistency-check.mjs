// CONSISTENCY CHECK — the feedback loop for qa/CONSISTENCY-SPEC.md.
// Renders a representative page set from the DRAFT theme and measures each law
// that can be measured from the DOM. Run before every push, like claim-lint:
//   npm run check:consistency
// Exit 1 on hard-law failure; warns (exit 0) on advisory laws pending content work.
// 2026-08-07: born from the 69-page census (see vault: Reports/Website Consistency
// Audit 2026-08-07). Thresholds encode the POST-fix target state.
import { chromium } from 'playwright';
import { previewUrl } from './estate-pages.mjs';

const PAGES = ['/', '/pages/impact', '/pages/workshops', '/pages/schools',
  '/collections/home-build-kits', '/products/gravel-frame-build-kit',
  '/pages/which-kit', '/pages/our-story-2', '/blogs/news', '/pages/support-mission'];

const b = await chromium.launch({ channel: 'chrome' });
const page = await (await b.newContext({ viewport: { width: 1280, height: 900 }, reducedMotion: 'reduce' })).newPage();

const R = { kickersCaps: [], pillRadius: [], pillUnderline: [], retiredGreen: [],
  chipCaseMix: [], attrDash: [], qtagRunon: [], statNoSource: [], crumbMissing: [], fontLeak: [] };

for (const path of PAGES) {
  try {
    await page.goto(previewUrl(path), { waitUntil: 'load', timeout: 45000 });
    await page.waitForTimeout(900);
    await page.evaluate(async () => {
      document.querySelector('#shopify-pc__banner')?.remove();
      for (let y = 0; y < document.documentElement.scrollHeight; y += 600) {
        window.scrollTo({ top: y, behavior: 'instant' }); await new Promise(r => setTimeout(r, 60));
      }
    });
    const d = await page.evaluate(() => {
      const cs = el => getComputedStyle(el);
      const vis = el => { const r = el.getBoundingClientRect(); return r.width > 4 && r.height > 4; };
      const hex = c => { const m = c.match(/\d+/g); return m ? '#' + m.slice(0, 3).map(n => (+n).toString(16).padStart(2, '0')).join('').toUpperCase() : c; };
      const out = { kickersCaps: 0, pillRadius: [], pillUnderline: 0, retiredGreen: 0, chipCases: new Set(), attrDash: [], qtagRunon: 0, statNoSource: 0, crumb: !!document.querySelector('.rd-crumb'), fontLeak: new Set() };
      document.querySelectorAll('.rd-eyebrow, [class*="eyebrow"]').forEach(k => {
        if (vis(k) && cs(k).textTransform === 'uppercase') out.kickersCaps++;
      });
      document.querySelectorAll('a.rd-btn, button.rd-btn, .rd-nav-cta').forEach(e => {
        if (!vis(e)) return;
        const c = cs(e), bg = hex(c.backgroundColor);
        if (bg === '#073E27') out.retiredGreen++;
        if (bg !== '#000000' && c.backgroundColor !== 'rgba(0, 0, 0, 0)') {
          const r = parseFloat(c.borderRadius); if (r < 60) out.pillRadius.push((e.textContent || '').trim().slice(0, 24));
          if (c.textDecorationLine.includes('underline')) out.pillUnderline++;
        }
      });
      document.querySelectorAll('[class*="chip"], .rd-tag, .bbcpl-qtag').forEach(e => {
        if (!vis(e) || !(e.textContent || '').trim()) return;
        const t = (e.textContent || '').trim(); if (!/[a-zA-Z]/.test(t)) return;
        const rendered = cs(e).textTransform;
        out.chipCases.add(rendered === 'uppercase' ? 'CAPS' : rendered === 'lowercase' ? 'lower' : (t === t.toLowerCase() ? 'lower' : 'Mixed'));
      });
      document.querySelectorAll('figcaption, [class*="attr"], [class*="author"], cite').forEach(e => {
        const t = (e.textContent || '').trim();
        if (/^[—–-]\s/.test(t)) out.attrDash.push(t.slice(0, 30));
        if (/peer-reviewed[A-Za-z]/.test(t.replace(/\s+/g, ' '))) out.qtagRunon++;
      });
      document.querySelectorAll('.rd-stat').forEach(s => {
        if (!vis(s)) return;
        const hasSrc = !!s.querySelector('[class*="src"], [class*="source"], small') ||
          /records|updated|since|source|shopify|ocn/i.test((s.textContent || ''));
        if (!hasSrc) out.statNoSource++;
      });
      [...document.querySelectorAll('h1,h2,p,a')].slice(0, 200).forEach(e => {
        const f = cs(e).fontFamily.split(',')[0].replace(/["']/g, '');
        if (!/Atkinson|ui-monospace|Material/i.test(f)) out.fontLeak.add(f);
      });
      out.chipCases = [...out.chipCases]; out.fontLeak = [...out.fontLeak];
      return out;
    });
    if (d.kickersCaps) R.kickersCaps.push(`${path} ×${d.kickersCaps}`);
    if (d.pillRadius.length) R.pillRadius.push(`${path}: ${d.pillRadius.join('|')}`);
    if (d.pillUnderline) R.pillUnderline.push(`${path} ×${d.pillUnderline}`);
    if (d.retiredGreen) R.retiredGreen.push(`${path} ×${d.retiredGreen}`);
    if (d.chipCases.length > 1) R.chipCaseMix.push(`${path}: ${d.chipCases.join('+')}`);
    if (d.attrDash.length) R.attrDash.push(`${path}: ${d.attrDash.join('|')}`);
    if (d.qtagRunon) R.qtagRunon.push(`${path}`);
    if (d.statNoSource) R.statNoSource.push(`${path} ×${d.statNoSource}`);
    if ((path.startsWith('/collections') || path.startsWith('/blogs')) && !d.crumb) R.crumbMissing.push(path);
    if (d.fontLeak.length) R.fontLeak.push(`${path}: ${d.fontLeak.join(',')}`);
    console.log(`checked ${path}`);
  } catch (e) { console.log(`ERR ${path}: ${String(e).slice(0, 80)}`); }
}
await b.close();

const HARD = [
  ['LAW 1 · kickers render lowercase', R.kickersCaps],
  ['LAW 2 · filled CTAs are pills (radius ≥60)', R.pillRadius],
  ['LAW 2 · no underlines inside pills', R.pillUnderline],
  ['LAW 4 · no leading-dash attributions', R.attrDash],
  ['LAW 4 · peer-reviewed tag not run-on', R.qtagRunon],
  ['LAW 9 · breadcrumb on collection/blog', R.crumbMissing],
];
const SOFT = [
  ['LAW 2 · retired #073E27 buttons (settings_data pending)', R.retiredGreen],
  ['LAW 3 · single chip case per page', R.chipCaseMix],
  ['LAW 6 · stats carry a source line (content pending)', R.statNoSource],
  ['LAW 7/type · non-system fonts', R.fontLeak],
];
let fail = 0;
console.log('\n================ CONSISTENCY CHECK ================');
for (const [name, arr] of HARD) {
  const bad = Array.isArray(arr) ? arr.length : arr;
  console.log(`${bad ? '✗ FAIL' : '✓ PASS'}  ${name}${bad ? '  → ' + arr.join(' · ') : ''}`);
  if (bad) fail = 1;
}
for (const [name, arr] of SOFT) {
  const bad = Array.isArray(arr) ? arr.length : arr;
  console.log(`${bad ? '⚠ WARN' : '✓ PASS'}  ${name}${bad ? '  → ' + arr.join(' · ') : ''}`);
}
console.log('===================================================');
process.exit(fail);
