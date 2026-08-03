// PIXEL-SAMPLED CONTRAST — the check axe structurally cannot perform.
//
// WHY THIS EXISTS (James, 2026-07-31: "our impact block on the home page CSS is clashing, why is
// it being missed")
//
// The home page's impact band rendered its eyebrow in var(--subtle) #384540 on #003C32 — a
// contrast ratio of 1.24:1, invisible. estate-check runs axe and asserts on `axe.violations`.
// axe put this node in `axe.incomplete` instead, with the reason:
//
//     "Element's background color could not be determined due to a background gradient"
//
// and `incomplete` was discarded. So the moment .rd-dark gained its bloom/grid gradient, axe
// stopped being able to judge contrast on EVERY dark band, and the gate went quiet. 35 nodes on
// the home page alone were in that blind spot. A gate that falls silent because the site changed
// is worse than one that fails: it reads as an improvement.
//
// axe is right to refuse — it reasons about the CSS cascade, and the true colour behind text on a
// gradient is not derivable that way. So do not reason about it: RENDER the page, hide the text,
// and sample the pixels that are actually painted behind it. That works for gradients, images,
// blend modes, overlays and anything else, because it measures the result rather than the recipe.
//
// Usage: node qa/contrast-check.mjs [--all] [path ...]
import { chromium } from 'playwright';
import { writeFileSync, mkdirSync } from 'fs';
import { ALL_PAGES, previewUrl } from './estate-pages.mjs';

const ARGS = process.argv.slice(2).filter(a => !a.startsWith('--'));
const PAGES = ARGS.length ? ARGS
  : process.argv.includes('--all') ? ALL_PAGES
  : ['/', '/pages/impact', '/pages/programmes', '/pages/workshops', '/pages/schools',
     '/pages/why-bamboo', '/pages/build-to-bond', '/products/gravel-frame-build-kit'];

const luminance = ([r, g, b]) => {
  const f = v => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); };
  return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
};
const ratio = (a, b) => {
  const L1 = luminance(a), L2 = luminance(b);
  return (Math.max(L1, L2) + 0.05) / (Math.min(L1, L2) + 0.05);
};

// Collect every element that paints its own text, with the geometry of the TEXT itself (via
// Range), not the element box — an element box can extend far beyond its glyphs and would average
// in background the text never sits on.
function collect() {
  const out = [];
  const walk = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  const seen = new Set();
  let n;
  while ((n = walk.nextNode())) {
    const txt = (n.textContent || '').trim();
    if (txt.length < 2) continue;
    const el = n.parentElement;
    if (!el || seen.has(el)) continue;
    // Skip anything not actually shown to a user.
    if (el.closest('[aria-hidden="true"], [hidden], script, style, noscript, svg')) continue;
    // Shopify's preview bar is not the site. It is fixed to the bottom of the window in preview
    // mode only, and it overlaps the theme's own fixed bottom nav — which made the nav's labels
    // sample the preview bar's near-black background and report 1.02:1 on text that is fine in
    // production. estate-check already excludes [id^="PBar"] from axe for the same reason.
    if (el.closest('[id^="PBar"], #preview-bar-iframe, .shopify-preview-bar')) continue;
    const cs = getComputedStyle(el);
    if (cs.visibility === 'hidden' || cs.display === 'none' || parseFloat(cs.opacity) < 0.1) continue;
    // A CLOSED <details> keeps its content in the DOM *and in layout*, and its computed
    // `visibility` is NOT 'hidden' — so every guard above passes and the sampler cheerfully
    // measures an accordion answer no user can see. On 2026-08-03 that was 6 of 17 estate
    // findings: the workshops and bicycle-frame-building-workshop care copy, the
    // support-mission Companies-House answer, and the custom-frame lead-time copy — all
    // reported 1.2–1.8:1, all inside shut accordions, all fine once opened.
    // checkVisibility() understands content-visibility and catches it; nothing else here does.
    // This matters beyond tidiness: a false FAIL is a gate defect (ESCAPES #10), because the
    // real findings have to be picked out of the noise by hand, and eventually won't be.
    if (el.checkVisibility && !el.checkVisibility({ checkOpacity: true, checkVisibilityCSS: true })) continue;
    // Off-canvas drawers, mega-menus and the consent banner are not on screen in the default
    // state; judging them here produces findings a user can never see.
    if (el.closest('[class*=drawer], [class*=mega], #shopify-pc__banner, .skip-to-content-link')) continue;
    const r = document.createRange(); r.selectNodeContents(n);
    const box = r.getBoundingClientRect();
    if (box.width < 4 || box.height < 4) continue;
    // Visually-hidden patterns park content off-canvas (the skip link sits at rect [-1,-1,48,48]).
    // It is not visible, so its contrast is not a defect a user can experience.
    if (box.left + box.width <= 0 || box.top + scrollY + box.height <= 0) continue;
    if (box.left >= document.documentElement.clientWidth) continue;
    seen.add(el);
    const size = parseFloat(cs.fontSize), weight = parseInt(cs.fontWeight) || 400;
    el.setAttribute('data-cc-id', String(out.length));
    out.push({
      id: out.length,
      color: cs.color,
      size, weight,
      // WCAG 1.4.3: large text is >=24px, or >=18.66px when bold.
      large: size >= 24 || (size >= 18.66 && weight >= 700),
      cls: (el.className || '').toString().slice(0, 40) || el.tagName,
      txt: txt.slice(0, 34),
    });
  }
  return out;
}

const browser = await chromium.launch({ channel: 'chrome' });
const findings = [];
let measured = 0;

for (const path of PAGES) {
  for (const [vw, vh, mob] of [[1280, 900, false], [390, 844, true]]) {
    const ctx = await browser.newContext({ viewport: { width: vw, height: vh }, isMobile: mob, deviceScaleFactor: 1, reducedMotion: 'reduce' });
    const page = await ctx.newPage();
    try {
      await page.goto(previewUrl(path, '&cc=1'), { waitUntil: 'load', timeout: 45000 });
      await page.waitForTimeout(1500);
      await page.evaluate(async () => {
        document.querySelectorAll('.rd-reveal').forEach(e => { e.style.opacity = 1; e.style.transform = 'none'; });
        document.querySelector('#shopify-pc__banner')?.remove();
        for (let y = 0; y < document.documentElement.scrollHeight; y += 800) {
          window.scrollTo({ top: y, behavior: 'instant' }); await new Promise(r => setTimeout(r, 50));
        }
        window.scrollTo({ top: 0, behavior: 'instant' }); await new Promise(r => setTimeout(r, 300));
      });

      // --canary: plant a node with the EXACT defect this script was written for — the pre-fix
      // eyebrow colour on the gradient dark band — and require the real code path to report it.
      // Every exclusion added here (preview bar, off-canvas, bottom strip) narrows what is judged,
      // and each one could silently swallow real findings. "It stopped complaining" is not proof.
      if (process.argv.includes('--canary')) {
        await page.evaluate(() => {
          const band = document.querySelector('.rd-dark, .rd-forest');
          if (!band) return;
          const s = document.createElement('p');
          s.textContent = 'CANARY invisible text on dark';
          s.setAttribute('data-canary', '1');
          s.style.cssText = 'color:#384540;font-size:14px;font-weight:700;padding:4px;';
          (band.querySelector('.rd-wrap') || band).prepend(s);
        });
        await page.waitForTimeout(150);
      }

      const items = await page.evaluate(collect);
      if (!items.length) { console.log(`  ${path}@${vw}: no text found — skipping`); await ctx.close(); continue; }

      // Hide every glyph, leaving backgrounds, borders and images exactly as painted. Text is made
      // transparent rather than display:none so nothing reflows — the boxes measured above must
      // still describe the same pixels.
      // -webkit-text-fill-color MUST be cleared too. This theme sets it deliberately (the
      // report-link paint-over fix), and it OVERRIDES `color`. Without this line the glyphs stay
      // painted, the sampler reads the text itself as its own background, and every node returns
      // exactly 1.00:1 — which is how the first run of this script produced 126 confident,
      // completely false findings. 100+ nodes at a suspiciously identical ratio is an instrument
      // fault, not an estate that is uniformly broken.
      await page.addStyleTag({ content: `*::before, *::after {
        color: transparent !important;
        -webkit-text-fill-color: transparent !important;
        text-shadow: none !important;
      }` });
      // A `*{...!important}` STYLESHEET rule is not enough. !important ties are broken by
      // specificity, and `*` scores 0,0,0 — so any author rule with a class and !important (this
      // theme has many, including the -webkit-text-fill-color paint-over) still wins and the
      // glyphs keep painting. The sampler then reads leftover text as background: white footer
      // links came back as "white on light grey" when the footer is forest. Inline declarations
      // with priority 'important' outrank every author rule regardless of specificity, so set
      // them per element instead. Pseudo-elements cannot take inline styles, hence the sheet above.
      await page.evaluate(() => {
        document.querySelectorAll('*').forEach(e => {
          e.style.setProperty('color', 'transparent', 'important');
          e.style.setProperty('-webkit-text-fill-color', 'transparent', 'important');
          e.style.setProperty('text-shadow', 'none', 'important');
          e.style.setProperty('text-decoration-color', 'transparent', 'important');
        });
      });
      await page.waitForTimeout(250);

      // Sample from VIEWPORT screenshots at successive scroll positions — never fullPage.
      // A fullPage capture makes Chrome resize the viewport to the document height, so every
      // viewport-relative length (100vh heroes, svh/dvh units, sticky offsets) reflows and the
      // document coordinates measured beforehand no longer describe the image. That is how
      // "builders trained" — bone text plainly legible on forest — was reported as sitting on
      // rgb(227,227,227). Measuring and sampling in the SAME state removes the whole class.
      const sampled = {};
      const pageH = await page.evaluate(() => document.documentElement.scrollHeight);
      for (let top = 0; top < pageH; top += Math.floor(vh * 0.9)) {
        await page.evaluate(y => window.scrollTo({ top: y, behavior: 'instant' }), top);
        await page.waitForTimeout(120);
        const shot = await page.screenshot();   // viewport only
        const got = await page.evaluate(async ([b64, items, prev]) => {
        const img = new Image();
        await new Promise(r => { img.onload = r; img.src = 'data:image/png;base64,' + b64; });
        const c = document.createElement('canvas');
        c.width = img.width; c.height = img.height;
        const cx = c.getContext('2d', { willReadFrequently: true });
        cx.drawImage(img, 0, 0);
        const res = Object.assign({}, prev);
        // Generalise the bottom-strip reservation below. That line hard-codes 76px for Shopify's
        // preview bar, but the THEME ships fixed furniture too: .bbc-sup__sticky is a support-page
        // CTA bar with background rgba(255,255,255,.96), fixed at the bottom at 390. It painted
        // over the "Talk to James about funding" button, so the sampler read the bar's near-white
        // (rgb 245,247,247) instead of the button's own forest fill and reported 1.27:1 on text
        // that is bone-on-forest at ~9:1 (2026-08-03). Any fixed/sticky box does this, so collect
        // them by computed position rather than by name — a hard-coded height cannot keep up.
        // An overlay only contaminates a sample if it is VISIBLE and actually PAINTS something.
        // The first cut of this filter matched on position alone and excluded every node on the
        // page — the closed cart drawer (.drawer.is-empty, .cart-drawer__overlay) is fixed at
        // 0,0,1280,900, so "covered by an overlay" was true for all 229 nodes and the run
        // certified nothing. The canary caught it; without the canary this would have read as a
        // clean estate. Require visibility, opacity and a non-transparent background.
        const overlays = [...document.querySelectorAll('body *')].filter(e => {
          const cs = getComputedStyle(e);
          if (cs.position !== 'fixed' && cs.position !== 'sticky') return false;
          if (e.checkVisibility && !e.checkVisibility({ checkOpacity: true, checkVisibilityCSS: true })) return false;
          if (parseFloat(cs.opacity) < 0.1) return false;
          const bg = cs.backgroundColor.match(/rgba?\(([^)]+)\)/);
          const alpha = bg && bg[1].split(',').length > 3 ? parseFloat(bg[1].split(',')[3]) : (bg ? 1 : 0);
          if (!alpha) return false;                      // transparent wrapper paints nothing
          const r = e.getBoundingClientRect();
          return r.width > 40 && r.height > 10;
        }).map(e => ({ el: e, r: e.getBoundingClientRect() }));
        for (const it of items) {
          const el = document.querySelector(`[data-cc-id="${it.id}"]`);
          if (!el) continue;
          const tn = [...el.childNodes].find(n => n.nodeType === 3 && n.textContent.trim().length > 1);
          if (!tn) continue;
          const rg = document.createRange(); rg.selectNodeContents(tn);
          const b = rg.getBoundingClientRect();
          // only sample when the text is FULLY inside this viewport capture
          if (res[it.id]) continue;              // first clean sample wins
          if (b.height < 4 || b.width < 4) continue;
          // Reserve the bottom strip of every capture. Shopify's preview bar is fixed to the
          // VIEWPORT bottom and is painted over whatever is there, so excluding the bar's own
          // element is not enough — any text that happens to land under it samples its near-black
          // background and reports ~1.0:1. With a 0.9×vh scroll step, anything skipped here is
          // captured higher up on the next pass.
          if (b.bottom > c.height - 76) continue;
          if (b.top < 0 || b.bottom > c.height || b.left < 0 || b.right > c.width) continue;
          // Covered by fixed/sticky furniture at THIS scroll position — the pixels behind the
          // text in this capture belong to the overlay, not to the text's own surface. Skip and
          // let a later scroll step catch it uncovered (0.9×vh steps guarantee another look).
          // Ancestors are excluded: a sticky header legitimately IS the background of its own
          // labels, and dropping those would silently stop judging the header.
          if (overlays.some(o => !o.el.contains(el) &&
                b.right > o.r.left && b.left < o.r.right &&
                b.bottom > o.r.top && b.top < o.r.bottom)) continue;
          // CLIPPED BY AN ANCESTOR — a collapsed accordion keeps its contents in the DOM with
          // normal computed styles (not display:none, not visibility:hidden); the panel simply
          // clips them with max-height:0 + overflow:hidden. Checking the element's own styles
          // therefore says "visible" for text nobody can see, which is how "Facebook Group:" and
          // "14-day returns…" inside the PDP's closed "Need Help?" panel were reported as 1.07:1
          // contrast defects. Require the text to actually survive every clipping ancestor.
          let clipped = false;
          for (let a = el.parentElement; a && a !== document.body; a = a.parentElement) {
            const acs = getComputedStyle(a);
            if (!/hidden|clip|auto|scroll/.test(acs.overflow + acs.overflowY + acs.overflowX)) continue;
            const ar = a.getBoundingClientRect();
            const vis = Math.min(b.bottom, ar.bottom) - Math.max(b.top, ar.top);
            if (vis < b.height * 0.5) { clipped = true; break; }
          }
          if (clipped) continue;
          const x = Math.round(b.left), y = Math.round(b.top);
          const w = Math.max(1, Math.round(b.width)), h = Math.max(1, Math.round(b.height));
          const d = cx.getImageData(x, y, w, h).data;
          // The WORST pixel behind the text decides legibility, not the average: text over a
          // gradient can be fine at one end and unreadable at the other, and an average hides
          // exactly that. Bucket the pixels and keep the one closest in luminance to the text.
          const lum = ([r, g, bl]) => {
            const f = v => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); };
            return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(bl);
          };
          const fg = it.color.match(/[\d.]+/g).slice(0, 3).map(Number);
          const fgL = lum(fg);
          const step = Math.max(1, Math.floor((w * h) / 4000));
          const px = [];
          for (let i = 0; i < w * h; i += step) {
            const p = i * 4;
            if (d[p + 3] < 250) continue;
            px.push([d[p], d[p + 1], d[p + 2]]);
          }
          if (!px.length) continue;
          // Rank by how close each pixel is to the text luminance (worst first), then take the
          // 10th percentile rather than the single worst. The absolute worst pixel is usually an
          // artefact — one anti-aliased border pixel, or a sliver of an adjacent element clipped
          // into the text's bounding box — and letting one pixel decide produced false failures.
          // The 10th percentile still catches a genuine gradient whose dark end swallows the text,
          // because that is a large region, not a stray pixel.
          px.sort((a, b) => Math.abs(lum(a) - fgL) - Math.abs(lum(b) - fgL));
          res[it.id] = px[Math.floor(px.length * 0.10)];
        }
        return res;
      }, [shot.toString('base64'), items, sampled]);
        for (const k of Object.keys(got)) if (!sampled[k]) sampled[k] = got[k];
      }
      await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));

      items.forEach((it) => {
        const bg = sampled[it.id];
        if (!bg) return;
        measured++;
        const fg = it.color.match(/[\d.]+/g).slice(0, 3).map(Number);
        const cr = ratio(fg, bg);
        const need = it.large ? 3 : 4.5;
        if (cr < need) {
          findings.push({ page: `${path}@${vw}`, cls: it.cls, txt: it.txt,
            fg: `rgb(${fg.join(',')})`, bg: `rgb(${bg.join(',')})`,
            ratio: +cr.toFixed(2), need, size: it.size, y: it.y });
        }
      });
      console.log(`  ${path}@${vw}: ${items.length} text nodes measured`);
    } catch (e) {
      console.log(`  ${path}@${vw}: ERROR ${String(e).slice(0, 70)}`);
    }
    await ctx.close();
  }
}
await browser.close();

findings.sort((a, b) => a.ratio - b.ratio);
// The evidence day was hardcoded to '2026-07-31'. The scope guard below stops a narrow run
// clobbering a broad one on the same day, but nothing stopped a LATER DAY clobbering an
// earlier one: every run after 31 Jul wrote back into the 31 Jul folder, so each day's sweep
// silently destroyed the previous day's. It also meant this tool could never satisfy
// gate-check.sh step 5, which requires evidence under today's date. (2026-08-03)
const DAY = new Date().toISOString().slice(0, 10);
mkdirSync(`qa/evidence/${DAY}`, { recursive: true });
// Scope the filename. A single-page run used to overwrite the estate's results with its own two
// findings, silently destroying a 25-minute sweep's evidence while itself succeeding — the
// estate's 39 findings had to be recovered from a log on 2026-07-31. A narrow run must never be
// able to clobber a broad one.
const scope = PAGES.length > 8 ? 'estate' : PAGES.length === 1
  ? PAGES[0].replace(/[^a-z0-9]+/gi, '-').replace(/^-|-$/g, '') || 'home'
  : `set-${PAGES.length}`;
const out = `qa/evidence/${DAY}/contrast-${scope}.json`;
writeFileSync(out, JSON.stringify(findings, null, 2));

console.log(`\n═══ PIXEL-SAMPLED CONTRAST ═══`);
console.log(`measured ${measured} text nodes across ${PAGES.length} pages × 2 viewports`);
if (!measured) { console.log('\n✗ MEASURED NOTHING — cannot certify anything'); process.exit(1); }

if (process.argv.includes('--canary')) {
  const caught = findings.filter(f => /CANARY/.test(f.txt));
  if (caught.length) {
    console.log(`✓ CANARY ALIVE — planted #384540-on-gradient caught ${caught.length}× at ${caught[0].ratio}:1`);
    process.exit(0);
  }
  console.log('✗ CANARY DEAD — a 1.2:1 node on a gradient band was NOT reported.');
  console.log('  An exclusion (preview-bar strip, off-canvas, drawer) is swallowing real findings.');
  process.exit(1);
}

if (findings.length) {
  console.log(`\n✗ ${findings.length} below WCAG AA:`);
  for (const f of findings.slice(0, 40)) {
    console.log(`   ${f.ratio.toFixed(2)}:1 (needs ${f.need})  ${f.page.padEnd(34)} ${String(f.cls).padEnd(26)} ${f.fg} on ${f.bg}  "${f.txt}"`);
  }
  if (findings.length > 40) console.log(`   … and ${findings.length - 40} more`);
  console.log(`\n→ ${out}`);
  if (process.argv.includes('--assert')) process.exit(1);
} else {
  console.log('\n✓ every measured text node meets WCAG AA against its ACTUAL painted background');
}
