// BAND-SEQUENCE ANALYSIS — what blocks does a page use, in what order?
//
// Created 2026-07-27. Every benchmark so far measured pages as a lump: how long, how many words,
// how many numbers. None of them looked at STRUCTURE — and structure is the thing we actually
// have to rebuild. "Our impact page is 2.5x the median" tells you to cut. It does not tell you
// what the page should be made of, or what order to tell the story in.
//
// This segments each page into bands, classifies what each band DOES, and prints the sequence.
// Run across a peer set it answers two questions the block library depends on:
//   1. Which blocks does this page type actually need? (the union of what peers use)
//   2. What order does the story go in? (the common sequence)
//
// Classification is heuristic and deliberately coarse — it is looking for the SHAPE of a page,
// not a semantic reading. Every signature is printed alongside the label so a wrong call is
// visible rather than hidden, which is the lesson of the week applied to a new tool.
//
// Usage: node qa/benchmark-sequence.mjs --set=workshops
import { chromium } from 'playwright';
import { writeFileSync, mkdirSync } from 'fs';

const SETS = {
  workshops: [
    ['BBC workshops', 'https://bamboobicycleclub.org/pages/workshops?preview_theme_id=196820238710'],
    ['Ellis Briggs', 'https://www.ellisbriggscycles.co.uk/framebuilding-course/'],
    ['Stayer Cycles', 'https://www.stayercycles.com/courses/'],
    ['Scottish Framebuilders', 'http://rothaircycles.com/scottishframebuildersworkshop-com/'],
    ['West Dean', 'https://www.westdean.ac.uk/degrees-and-diplomas/courses?level=College+Awards'],
    ['London Sculpture', 'https://londonsculptureworkshop.org/'],
    ['Bristol Bike Project', 'https://thebristolbikeproject.org/maintenance/courses/'],
  ],
  programmes: [
    ['BBC programmes', 'https://bamboobicycleclub.org/pages/programmes?preview_theme_id=196820238710'],
    ['Switchback', 'https://switchback.org.uk/what-we-do/'],
    ['Bounce Back', 'https://www.bouncebackproject.com/training/'],
    ['Onward Lives', 'https://onwardlives.org/our-programmes/'],
    ['Key4Life', 'https://key4life.org.uk/programme-overview/'],
    ['StandOut', 'https://www.standout.org.uk/standout-programme'],
    ['Spark Inside', 'https://www.sparkinside.org/our-work'],
  ],
  ours: [
    ['BBC homepage', 'https://bamboobicycleclub.org/?preview_theme_id=196820238710'],
    ['BBC impact', 'https://bamboobicycleclub.org/pages/impact?preview_theme_id=196820238710'],
  ],
  impact: [
    ['BBC impact', 'https://bamboobicycleclub.org/pages/impact?preview_theme_id=196820238710'],
    ['Switchback', 'https://switchback.org.uk/what-we-do/#impact'],
    ['Fine Cell Work', 'https://finecellwork.co.uk/pages/the-impact'],
    ['Who Gives A Crap', 'https://uk.whogivesacrap.org/pages/our-impact'],
    ["Tony's Chocolonely", 'https://uk.tonyschocolonely.com/pages/tonys-impact'],
    ['Big Issue', 'https://www.bigissue.com/big-issue-group-impact/'],
    ['Emmaus UK', 'https://emmaus.org.uk/what-we-do/'],
  ],
};

const setArg = (process.argv.find(a => a.startsWith('--set=')) || '--set=workshops').split('=')[1];
const PAGES = SETS[setArg];
if (!PAGES) { console.error(`unknown set. available: ${Object.keys(SETS).join(', ')}`); process.exit(1); }

const browser = await chromium.launch({ channel: 'chrome', headless: true });
const out = [];

for (const [name, url] of PAGES) {
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 }, userAgent:
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126 Safari/537.36' });
  const page = await ctx.newPage();
  const rec = { name, url };
  try {
    await page.goto(url, { waitUntil: 'load', timeout: 45000 });
    await page.waitForTimeout(2200);
    for (const label of [/^accept all$/i, /^accept$/i, /^allow all$/i, /^i agree$/i, /^got it$/i, /^decline$/i]) {
      try { const b = page.getByRole('button', { name: label }).first();
        if (await b.isVisible({ timeout: 600 })) { await b.click({ timeout: 1200 }); await page.waitForTimeout(500); break; } } catch {}
    }
    await page.evaluate(async () => {
      for (let y = 0; y < document.documentElement.scrollHeight; y += 700) {
        window.scrollTo({ top: y, behavior: 'instant' }); await new Promise(r => setTimeout(r, 60));
      }
      window.scrollTo({ top: 0, behavior: 'instant' }); await new Promise(r => setTimeout(r, 400));
    });

    rec.bands = await page.evaluate(() => {
      const SKIP = '#shopify-pc__banner,.shopify-pc__banner,cart-drawer,.drawer,[id^="PBar"],header,footer,nav';
      const wc = t => (t || '').split(/\s+/).filter(Boolean).length;

      // Candidate bands: direct children of the main content wrapper, plus <section>s.
      const root = document.querySelector('main, #MainContent, [role=main]') || document.body;
      let cands = [...root.querySelectorAll('section, [class*="section" i], [class*="band" i], [class*="block" i]')];
      if (cands.length < 3) cands = [...root.children];
      cands = cands.filter(e => {
        if (e.closest(SKIP)) return false;
        const r = e.getBoundingClientRect();
        return r.height > 120 && wc(e.innerText) > 3;
      });
      // Keep the INNERMOST band-sized elements, not the outermost. First attempt kept outermost
      // and collapsed whole pages into one "band" — BBC's workshops page came back as a single
      // 609-word hero, because its content lives inside one big section wrapper. A band is the
      // smallest thing that still reads as a full-width beat, so drop any candidate that contains
      // another candidate.
      let bands = cands.filter(e => !cands.some(o => o !== e && e.contains(o)));
      // Guard: if that still yields almost nothing, the page nests shallowly — fall back to the
      // children of the tallest candidate.
      if (bands.length < 3) {
        const tallest = cands.sort((a, b) => b.getBoundingClientRect().height - a.getBoundingClientRect().height)[0];
        if (tallest) bands = [...tallest.children].filter(e => {
          const r = e.getBoundingClientRect();
          return r.height > 120 && wc(e.innerText) > 3;
        });
      }
      return bands.slice(0, 18).map(e => {
        const txt = e.innerText || '';
        const words = wc(txt);
        const imgs = e.querySelectorAll('img, picture, video').length;
        const quotes = e.querySelectorAll('blockquote, q, [class*="quote" i], [class*="testimonial" i]').length;
        const lists = e.querySelectorAll('ol, ul').length;
        const details = e.querySelectorAll('details, [class*="accord" i], [class*="faq" i]').length;
        const btns = [...e.querySelectorAll('a, button')].filter(a => {
          const t = (a.textContent || '').trim();
          return t.length > 2 && t.length < 40;
        }).length;
        const forms = e.querySelectorAll('form, input').length;
        // Isolated figures — a leaf whose whole text is a number, the "proof" signal.
        const figures = [...e.querySelectorAll('*')].filter(n => n.children.length === 0
          && /^[£$€]?\d[\d,.]*\s*(\+|%|k|m)?$/i.test((n.textContent || '').trim())).length;
        const h = e.querySelector('h1, h2, h3');
        const hLevel = h ? +h.tagName[1] : 0;
        const hSize = h ? Math.round(parseFloat(getComputedStyle(h).fontSize)) : 0;
        const rect = e.getBoundingClientRect();
        const bg = getComputedStyle(e).backgroundColor;
        // crude light/dark read of the band surface
        const m = bg.match(/\d+/g);
        const lum = m ? (0.2126 * m[0] + 0.7152 * m[1] + 0.0722 * m[2]) / 255 : null;

        // ---- classification, coarse and printed with its evidence ----
        let type = 'editorial';
        if (hLevel === 1 || (hSize >= 48 && rect.top + window.scrollY < 1200)) type = 'hero';
        else if (figures >= 2 && words < 120) type = 'proof-strip';
        else if (details >= 2) type = 'faq';
        else if (quotes >= 1 && words < 220) type = 'quote';
        else if (imgs >= 4 && words < 90) type = 'logo-wall/gallery';
        else if (forms >= 2) type = 'form';
        else if (lists >= 1 && /\b(step|stage|week|day \d|how it works|process)\b/i.test(txt) && words < 400) type = 'steps';
        else if (imgs >= 2 && words >= 90) type = 'cards/evidence';
        else if (btns >= 1 && words < 70) type = 'cta-band';
        else if (words < 60) type = 'spacer/minor';

        return { type, words, imgs, quotes, figures, btns, lists, details, hLevel, hSize,
          y: Math.round(rect.top + window.scrollY),
          surface: lum === null ? '?' : (lum < 0.5 ? 'dark' : 'light'),
          head: (h ? h.textContent : '').trim().replace(/\s+/g, ' ').slice(0, 46) };
      });
    });
  } catch (e) { rec.error = String(e.message).slice(0, 80); }
  out.push(rec);

  console.log(`\n════ ${name}${rec.error ? '  ERROR: ' + rec.error : ''}`);
  (rec.bands || []).forEach((b, i) =>
    console.log(`  ${String(i + 1).padStart(2)}. ${b.type.padEnd(18)} ${String(b.words).padStart(4)}w ` +
      `img${String(b.imgs).padStart(2)} fig${String(b.figures).padStart(2)} q${b.quotes} btn${String(b.btns).padStart(2)} ` +
      `${b.surface.padEnd(5)} h${b.hLevel}@${b.hSize}px  ${b.head}`));
  await ctx.close();
}
await browser.close();
mkdirSync('qa/research', { recursive: true });
writeFileSync(`qa/research/sequence-${setArg}.json`, JSON.stringify(out, null, 1));

// Sequence summary — what the field's story order looks like
console.log(`\n\n════ SEQUENCE SUMMARY · ${setArg}`);
for (const r of out) {
  if (!r.bands) continue;
  console.log(`  ${r.name.padEnd(24)} ${r.bands.map(b => b.type).join(' → ')}`);
}
console.log(`\n→ qa/research/sequence-${setArg}.json`);
