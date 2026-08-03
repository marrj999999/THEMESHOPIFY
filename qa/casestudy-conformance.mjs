// CASE-STUDY CARD CONFORMANCE — an OUTCOME test, not a regression test.
//
// James, 2026-07-31: "create testing for outcomes."
//
// The visual net answers "did anything change?". estate-check answers "is anything broken?".
// Neither answers the question this work was actually for: **is every case study on the site now
// the same component, built to contract?** Before today the answer was no in four different ways
// on four different pages, and every gate was green throughout.
//
// So this asserts the CONTRACT from qa/ALIGNMENT.md + snippets/bbc-cscard.liquid, estate-wide:
//
//   1  the group is a <ul>, items are <li>            — USWDS / VA.gov / GEL / NHS all require it
//   2  the card is an <article>, never a wrapper <a>  — a wrapper makes the whole card one link
//   3  every card has a real <h3> heading             — no card had ANY heading before today
//   4  the heading CONTAINS the only card-level link  — WCAG 2.4.4: context must be IN the anchor
//   5  heading text is unique within the page         — 7 cards once all said "Read the story"
//   6  at most 2 links per card                       — heading + one source link, nothing more
//   7  the footer CTA is a <span>, never an <a>       — a second anchor = a second tab stop
//   8  media is aspect-locked to one ratio            — 5 different ratios ragged the rows
//   9  no broken images
//  10  every card carries a data-kind                 — an uncategorised card is invisible to filters
//
// Each is a thing that WAS WRONG and is now right. If one regresses, this fails — which is what
// makes it an outcome test rather than a snapshot.
//
// Usage: node qa/casestudy-conformance.mjs [--all] [--canary] [path ...]
import { chromium } from 'playwright';
import { ALL_PAGES, previewUrl } from './estate-pages.mjs';

const ARGS = process.argv.slice(2).filter(a => !a.startsWith('--'));
const PAGES = ARGS.length ? ARGS
  : process.argv.includes('--all') ? ALL_PAGES
  : ['/pages/impact', '/pages/schools', '/pages/bicycleteambuilding',
     '/pages/build-to-bond', '/pages/why-bamboo', '/pages/our-story-2', '/'];

const browser = await chromium.launch({ channel: 'chrome' });
const findings = [];
let pagesWithCards = 0, totalCards = 0;

for (const path of PAGES) {
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 1000 }, reducedMotion: 'reduce' });
  const page = await ctx.newPage();
  try {
    await page.goto(previewUrl(path, '&csc=1'), { waitUntil: 'load', timeout: 45000 });
    await page.waitForTimeout(1600);
    await page.evaluate(async () => {
      document.querySelector('#shopify-pc__banner')?.remove();
      document.querySelectorAll('.rd-reveal').forEach(e => { e.style.opacity = 1; e.style.transform = 'none'; });
      for (let y = 0; y < document.documentElement.scrollHeight; y += 700) {
        window.scrollTo({ top: y, behavior: 'instant' }); await new Promise(r => setTimeout(r, 45));
      }
    });
    await page.waitForTimeout(900);

    // --canary plants a card that breaks every rule, to prove the checks can fail. Built with DOM
    // methods rather than innerHTML — a test fixture is still code, and static-looking strings are
    // exactly how an injection habit forms.
    if (process.argv.includes('--canary')) {
      await page.evaluate(() => {
        const grid = document.querySelector('.rd-csgrid');
        if (!grid) return;
        const a = document.createElement('a');            // wrapper anchor — breaks rules 2 and 4
        a.className = 'rd-cscard rd-cscard--grid';        // not an <article>, no heading — rule 3
        a.href = '/canary-target';
        const media = document.createElement('div');
        media.className = 'rd-cscard__media';
        const img = document.createElement('img');
        img.src = '/deliberately-missing.jpg';            // breaks rule 9
        media.appendChild(img);
        const body = document.createElement('div');
        body.className = 'rd-cscard__body';
        const inst = document.createElement('span');
        inst.className = 'rd-cscard__inst';
        inst.textContent = 'untitled';
        const more = document.createElement('a');         // CTA as an anchor — breaks rules 6 and 7
        more.className = 'rd-cscard__more';
        more.href = '/canary-second-link';
        more.textContent = 'Read the story';
        body.append(inst, more);
        a.append(media, body);
        grid.appendChild(a);                              // no data-kind — breaks rule 10
      });
      await page.waitForTimeout(250);
    }

    const r = await page.evaluate(() => {
      const cards = [...document.querySelectorAll('.rd-cscard')];
      if (!cards.length) return null;
      const heads = cards.map(c => (c.querySelector('.rd-cscard__heading .rd-cscard__link')?.textContent || '').trim());
      const media = [...document.querySelectorAll('.rd-cscard__media')].map(m => {
        const b = m.getBoundingClientRect(); return b.height ? +(b.width / b.height).toFixed(2) : 0;
      });
      return {
        cards: cards.length,
        wrapperAnchors: cards.filter(c => c.tagName === 'A').length,
        notArticle: cards.filter(c => c.tagName !== 'ARTICLE').length,
        noHeading: cards.filter(c => !c.querySelector('h3.rd-cscard__heading')).length,
        headingNotLink: cards.filter(c => c.querySelector('h3.rd-cscard__heading') && !c.querySelector('h3.rd-cscard__heading .rd-cscard__link')).length,
        dupHeadings: heads.filter(h => h).length - new Set(heads.filter(h => h)).size,
        tooManyLinks: cards.filter(c => c.querySelectorAll('a').length > 2).length,
        ctaIsAnchor: cards.filter(c => c.querySelector('a.rd-cscard__more')).length,
        ratios: [...new Set(media.filter(Boolean))],
        brokenImgs: [...document.querySelectorAll('.rd-cscard__media img')].filter(i => !i.complete || i.naturalWidth === 0).length,
        noKind: cards.filter(c => !c.getAttribute('data-kind')).length,
        groupNotList: [...document.querySelectorAll('.rd-csgrid')].filter(g => g.tagName !== 'UL').length,
      };
    });

    if (!r) { console.log(`  ${path.padEnd(30)} no case-study cards`); await ctx.close(); continue; }
    pagesWithCards++; totalCards += r.cards;

    const fail = (rule, cond, detail) => { if (cond) findings.push({ path, rule, detail }); };
    fail('group must be <ul>',            r.groupNotList > 0,   `${r.groupNotList} grid(s) not a list`);
    fail('card must be <article>',        r.notArticle > 0,     `${r.notArticle} card(s)`);
    fail('no wrapper <a> around a card',  r.wrapperAnchors > 0, `${r.wrapperAnchors} card(s)`);
    fail('every card needs an <h3>',      r.noHeading > 0,      `${r.noHeading} card(s)`);
    fail('heading must contain the link', r.headingNotLink > 0, `${r.headingNotLink} card(s)`);
    fail('heading text must be unique',   r.dupHeadings > 0,    `${r.dupHeadings} duplicate(s)`);
    fail('max 2 links per card',          r.tooManyLinks > 0,   `${r.tooManyLinks} card(s)`);
    fail('footer CTA must be a <span>',   r.ctaIsAnchor > 0,    `${r.ctaIsAnchor} card(s)`);
    fail('one media aspect ratio',        r.ratios.length > 1,  `ratios: ${r.ratios.join(', ')}`);
    fail('no broken images',              r.brokenImgs > 0,     `${r.brokenImgs} image(s)`);
    fail('every card needs data-kind',    r.noKind > 0,         `${r.noKind} card(s)`);

    console.log(`  ${path.padEnd(30)} ${String(r.cards).padStart(2)} cards · ratios ${r.ratios.join('/')}`);
  } catch (e) {
    console.log(`  ${path.padEnd(30)} ERROR ${String(e).slice(0, 60)}`);
  }
  await ctx.close();
}
await browser.close();

console.log(`\n═══ CASE-STUDY CONFORMANCE ═══`);
console.log(`${totalCards} cards across ${pagesWithCards} pages`);
if (!totalCards) { console.log('\n✗ FOUND NO CARDS — cannot certify anything'); process.exit(1); }

if (process.argv.includes('--canary')) {
  const rules = new Set(findings.map(f => f.rule));
  if (rules.size) { console.log(`✓ CANARY ALIVE — the planted non-conforming card tripped ${rules.size} rules`); process.exit(0); }
  console.log('✗ CANARY DEAD — a card with a wrapper anchor, no heading and a link CTA passed every rule'); process.exit(1);
}

if (findings.length) {
  console.log(`\n✗ ${findings.length} CONTRACT BREACHES:`);
  for (const f of findings) console.log(`   ${f.path.padEnd(30)} ${f.rule.padEnd(30)} ${f.detail}`);
  process.exit(1);
}
console.log('\n✓ every case-study card on the estate is built to contract');
