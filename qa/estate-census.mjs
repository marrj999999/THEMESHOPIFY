// Site-wide component census: visits every estate page on the DRAFT theme,
// extracts a structured inventory of repeating components + computed styles,
// and saves a full-page screenshot for evidence cropping.
import { chromium } from 'playwright';
import { writeFileSync, mkdirSync } from 'fs';
import { ALL_PAGES, previewUrl } from '/Users/jamesmarr/Projects/bbc-theme-new/qa/estate-pages.mjs';

const OUT = './qa/reports';
mkdirSync(OUT + '/shots', { recursive: true });

const slug = p => p.replace(/^\//, '').replace(/[^a-z0-9]+/gi, '-').replace(/^$/, 'home').slice(0, 60) || 'home';

const b = await chromium.launch({ channel: 'chrome' });
const ctx = await b.newContext({ viewport: { width: 1280, height: 900 }, reducedMotion: 'reduce', deviceScaleFactor: 1 });
const page = await ctx.newPage();

const results = [];
for (const path of ALL_PAGES) {
  const s = slug(path);
  try {
    await page.goto(previewUrl(path), { waitUntil: 'load', timeout: 45000 });
    await page.waitForTimeout(1200);
    await page.evaluate(async () => {
      document.querySelector('#shopify-pc__banner')?.remove();
      document.querySelectorAll('.rd-reveal').forEach(e => { e.style.opacity = 1; e.style.transform = 'none'; });
      for (let y = 0; y < document.documentElement.scrollHeight; y += 500) {
        window.scrollTo({ top: y, behavior: 'instant' });
        await new Promise(r => setTimeout(r, 90));
      }
      window.scrollTo({ top: 0, behavior: 'instant' });
      await new Promise(r => setTimeout(r, 400));
    });

    const data = await page.evaluate(() => {
      const cs = el => getComputedStyle(el);
      const txt = (el, n = 70) => (el?.textContent || '').replace(/\s+/g, ' ').trim().slice(0, n);
      const rectOf = el => { const r = el.getBoundingClientRect(); return { x: Math.round(r.x), y: Math.round(r.y + scrollY), w: Math.round(r.width), h: Math.round(r.height) }; };
      const vis = el => { const r = el.getBoundingClientRect(); return r.width > 4 && r.height > 4; };
      const caseOf = t => {
        const letters = t.replace(/[^a-zA-Z]/g, ''); if (!letters) return 'none';
        if (letters === letters.toLowerCase()) return 'lower';
        if (letters === letters.toUpperCase()) return 'CAPS';
        const words = t.split(/\s+/).filter(w => /[a-zA-Z]/.test(w));
        const capd = words.filter(w => /^[A-Z]/.test(w)).length;
        return capd > words.length * 0.6 ? 'Title' : 'Sentence';
      };
      const hex = c => { const m = c.match(/\d+/g); if (!m) return c; return '#' + m.slice(0, 3).map(n => (+n).toString(16).padStart(2, '0')).join('').toUpperCase(); };

      // headings
      const headings = [...document.querySelectorAll('main h1, main h2, main h3')].filter(vis).slice(0, 40).map(h => ({
        tag: h.tagName, t: txt(h, 60), case: caseOf(txt(h, 60)), size: Math.round(parseFloat(cs(h).fontSize)), tf: cs(h).textTransform,
      }));

      // kickers / eyebrows
      const kickers = [...document.querySelectorAll('.rd-eyebrow, [class*="kicker"], [class*="eyebrow"]')].filter(vis).slice(0, 20).map(k => ({
        t: txt(k, 50), case: caseOf(txt(k, 50)), tf: cs(k).textTransform, color: hex(cs(k).color), size: Math.round(parseFloat(cs(k).fontSize)), cls: k.className.split(/\s+/)[0], r: rectOf(k),
      }));

      // buttons / CTAs
      const btnEls = [...document.querySelectorAll('a, button')].filter(e => {
        if (!vis(e) || !txt(e)) return false;
        const c = cs(e);
        const cls = e.className || '';
        return /btn|button/i.test(cls) || (c.backgroundColor !== 'rgba(0, 0, 0, 0)' && c.display !== 'inline') || parseFloat(c.borderWidth) > 0;
      }).slice(0, 50);
      const buttons = btnEls.map(e => ({
        t: txt(e, 40), case: caseOf(txt(e, 40)), bg: hex(cs(e).backgroundColor), color: hex(cs(e).color),
        radius: cs(e).borderRadius.split(' ')[0], size: Math.round(parseFloat(cs(e).fontSize)), tf: cs(e).textTransform,
        arrow: /→|➔|➜/.test(e.textContent) ? 1 : 0, cls: (e.className || '').toString().split(/\s+/).slice(0, 2).join(' '), r: rectOf(e),
      }));

      // chips / badges / stamps
      const chips = [...document.querySelectorAll('[class*="chip"], [class*="badge"], [class*="stamp"], [class*="pill"], [class*="tag"]')]
        .filter(e => vis(e) && txt(e) && txt(e, 200).length < 80 && parseFloat(cs(e).fontSize) <= 16).slice(0, 30).map(e => ({
          t: txt(e, 50), case: caseOf(txt(e, 50)), bg: hex(cs(e).backgroundColor), color: hex(cs(e).color),
          radius: cs(e).borderRadius.split(' ')[0], brackets: /^\[.*\]$/.test(txt(e, 200)) ? 1 : 0, cls: (e.className || '').toString().split(/\s+/)[0], r: rectOf(e),
        }));

      // quotes / testimonials / press
      const qsel = 'blockquote, [class*="quote"]:not([class*="quotes"]), .bbc-testimonial, .rd-band--quotes figure, .rd-qscroll > *';
      const seenQ = new Set();
      const quotes = [...document.querySelectorAll(qsel)].filter(e => {
        if (!vis(e)) return false;
        const t = txt(e, 200); if (!t || t.length < 15) return false;
        for (const p of seenQ) if (e.contains(p) || p.contains(e)) return false;
        seenQ.add(e); return true;
      }).slice(0, 15).map(e => {
        const attr = e.querySelector('[class*="attr"], [class*="author"], [class*="source"], [class*="role"], cite, figcaption');
        return {
          t: txt(e, 60), attr: attr ? txt(attr, 50) : '', attrCase: attr ? caseOf(txt(attr, 50)) : '',
          marks: /[“”"]/.test(e.textContent) ? 1 : 0, stars: e.querySelector('[class*="star"]') ? 1 : 0,
          logo: e.querySelector('img, svg') ? 1 : 0, cls: (e.className || '').toString().split(/\s+/)[0] || e.tagName, r: rectOf(e),
        };
      });

      // case-study / story / article cards
      const cardSel = '.rd-cscard, [class*="story"], .article-card, [class*="journey"]';
      const seenC = new Set();
      const cscards = [...document.querySelectorAll(cardSel)].filter(e => {
        if (!vis(e)) return false;
        for (const p of seenC) if (e.contains(p) || p.contains(e)) return false;
        seenC.add(e); return true;
      }).slice(0, 12).map(e => {
        const a = e.querySelector('a');
        const chip = e.querySelector('[class*="chip"], [class*="badge"], [class*="stamp"]');
        const h = e.querySelector('h2,h3,h4,[class*="title"]');
        return { title: txt(h, 45), chip: chip ? txt(chip, 30) : '', cta: a ? txt(a, 30) : '', img: e.querySelector('img,video') ? 1 : 0,
          cls: (e.className || '').toString().split(/\s+/)[0], r: rectOf(e) };
      });

      // stat tiles
      const statSel = '.rd-stat, .bbc-stat, .bbc-stat-item, .bbc-stats__item, [class*="stat-item"], [class*="stat__"]';
      const seenS = new Set();
      const stats = [...document.querySelectorAll(statSel)].filter(e => {
        if (!vis(e)) return false;
        for (const p of seenS) if (e.contains(p) || p.contains(e)) return false;
        seenS.add(e); return true;
      }).slice(0, 16).map(e => {
        const v = e.querySelector('b, strong, [class*="value"], [class*="number"], [class*="num"]') || e.firstElementChild;
        const l = e.querySelector('[class*="label"], span:last-child');
        return { v: txt(v, 20), l: txt(l, 45), lCase: caseOf(txt(l, 45)), vColor: v ? hex(cs(v).color) : '', cls: (e.className || '').toString().split(/\s+/)[0], r: rectOf(e) };
      });

      // section background rhythm
      const secs = [...document.querySelectorAll('main > .shopify-section, main > section, #MainContent > .shopify-section')].slice(0, 30);
      const rhythm = secs.map(s => {
        let bgEl = s, bg = cs(s).backgroundColor, depth = 0;
        while (bg === 'rgba(0, 0, 0, 0)' && bgEl.firstElementChild && depth < 3) { bgEl = bgEl.firstElementChild; bg = cs(bgEl).backgroundColor; depth++; }
        return { bg: hex(bg), h: txt(s.querySelector('h1,h2,h3'), 30) };
      });

      // fonts in use (sample)
      const fontSet = new Set();
      [...document.querySelectorAll('h1,h2,h3,p,a,button,span')].slice(0, 400).forEach(e => fontSet.add(cs(e).fontFamily.split(',')[0].replace(/["']/g, '')));

      // system counts
      let rd = 0, bbc = 0;
      document.querySelectorAll('[class]').forEach(e => {
        const c = e.className.toString();
        if (/(^|\s)rd-/.test(c)) rd++;
        if (/(^|\s)bbc-/.test(c)) bbc++;
      });

      const fb = document.querySelector('footer');
      return {
        title: document.title, h1s: [...document.querySelectorAll('h1')].filter(vis).length,
        scrollH: document.documentElement.scrollHeight,
        crumb: !!document.querySelector('.rd-crumb, [class*="breadcrumb"], nav[aria-label*="readcrumb"]'),
        botbar: !!document.querySelector('.rd-botbar'),
        newsletter: !!fb?.querySelector('input[type="email"]'),
        footerSig: fb ? txt(fb, 90) : 'NONE',
        fonts: [...fontSet].slice(0, 8), rd, bbc,
        headings, kickers, buttons, chips, quotes, cscards, stats, rhythm,
      };
    });

    data.path = path; data.slug = s;
    await page.screenshot({ path: `${OUT}/shots/${s}.png`, fullPage: true });
    results.push(data);
    console.log(`OK ${path} rd:${data.rd} bbc:${data.bbc} q:${data.quotes.length} cs:${data.cscards.length} st:${data.stats.length}`);
  } catch (e) {
    results.push({ path, slug: s, error: String(e).slice(0, 120) });
    console.log(`ERR ${path}: ${String(e).slice(0, 80)}`);
  }
}
writeFileSync(`${OUT}/census.json`, JSON.stringify(results, null, 1));
console.log(`DONE ${results.length} pages -> ${OUT}/census.json`);
await b.close();
