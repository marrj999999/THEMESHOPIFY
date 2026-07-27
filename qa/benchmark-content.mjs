// CONTENT BENCHMARK — storytelling, case studies, quotes, facts.
//
// Created 2026-07-27. The design benchmark (benchmark-cic.mjs) measures how a site LOOKS.
// This measures what it SAYS, because that is where a social enterprise actually competes:
// whether a stranger learns who you are, whether the proof is attributed, and whether the
// stories are about named people or about the organisation.
//
// Everything here is a proxy, and deliberately a conservative one — the point is relative
// position across 21 sites measured identically, not an absolute score.
//
// Usage: node qa/benchmark-content.mjs
import { chromium } from 'playwright';
import { writeFileSync, mkdirSync } from 'fs';

const PEERS = [
  ['BBC (our draft)', 'https://bamboobicycleclub.org/?preview_theme_id=196820238710'],
  ['Switchback', 'https://switchback.org.uk/'],
  ['Fine Cell Work', 'https://finecellwork.co.uk/'],
  ['Redemption Roasters', 'https://redemptionroasters.com/'],
  ['The Clink Charity', 'https://theclinkcharity.org/'],
  ['Bounce Back', 'https://bouncebackproject.com/'],
  ['Recycling Lives', 'https://recyclinglives.org/'],
  ['Emmaus UK', 'https://emmaus.org.uk/'],
  ['Change Please', 'https://changeplease.org/'],
  ['The Big Issue', 'https://www.bigissue.com/'],
  ['Social Enterprise UK', 'https://www.socialenterprise.org.uk/'],
  ['Elvis & Kresse', 'https://www.elvisandkresse.com/'],
  ['Toast Brewing', 'https://www.toastbrewing.com/'],
  ['Divine Chocolate', 'https://www.divinechocolate.com/'],
  ['Belu Water', 'https://belu.org/'],
  ['Who Gives A Crap', 'https://uk.whogivesacrap.org/'],
  ["Tony's Chocolonely", 'https://tonyschocolonely.com/uk/en/'],
  ['Hiut Denim', 'https://hiutdenim.co.uk/'],
  ['Patagonia UK', 'https://eu.patagonia.com/gb/en/home/'],
  ['Riverford', 'https://www.riverford.co.uk/'],
  ['Cook Food', 'https://www.cookfood.net/'],
];

const browser = await chromium.launch({ channel: 'chrome', headless: true });
const results = [];

for (const [name, url] of PEERS) {
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 }, userAgent:
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126 Safari/537.36' });
  const page = await ctx.newPage();
  const rec = { name };
  try {
    await page.goto(url, { waitUntil: 'load', timeout: 45000 });
    await page.waitForTimeout(2200);
    for (const label of [/^accept all$/i, /^accept$/i, /^allow all$/i, /^i agree$/i, /^got it$/i]) {
      try { const b = page.getByRole('button', { name: label }).first();
        if (await b.isVisible({ timeout: 600 })) { await b.click({ timeout: 1200 }); await page.waitForTimeout(500); break; } } catch {}
    }
    Object.assign(rec, await page.evaluate(() => {
      const text = document.body.innerText || '';
      const firstScreen = text.slice(0, 700);

      // QUOTES — blockquote/q elements, plus curly-quoted runs long enough to be testimony.
      const quoteEls = [...document.querySelectorAll('blockquote, q, [class*="quote" i], [class*="testimonial" i]')]
        .filter(e => (e.textContent || '').trim().length > 40);
      const quoteTexts = quoteEls.map(e => (e.textContent || '').trim());
      const curly = (text.match(/[""][^""]{40,400}[""]/g) || []);
      const quotes = Math.max(quoteEls.length, curly.length);
      // Attribution proxy: a quote block containing a short line that looks like a name
      // (two capitalised words), or an em-dash/"—" byline immediately after.
      const attributed = quoteTexts.filter(t => /[—–-]\s*[A-Z][a-z]+ [A-Z][a-z]+/.test(t)
        || /\b[A-Z][a-z]+ [A-Z][a-z]+,\s*[a-z]/.test(t)).length;

      // NAMED PEOPLE — "Firstname Lastname" occurrences, a proxy for people-led storytelling.
      const nameMatches = text.match(/\b[A-Z][a-z]{2,12} [A-Z][a-z]{2,14}\b/g) || [];
      const stop = /^(Privacy Policy|Terms|Cookie|Read More|Find Out|Learn More|Get Involved|Sign Up|Social Enterprise|United Kingdom|Great Britain|New Arrivals|Gift Card|Our Story|Our Impact|Contact Us|Build Your|Bamboo Bicycle|The Clink|Big Issue|Fine Cell|Change Please|Who Gives|Recycling Lives|Emmaus UK|Toast Brewing|Divine Chocolate|Belu Water|Hiut Denim|Cook Food)/;
      const namedPeople = [...new Set(nameMatches.filter(n => !stop.test(n)))].length;

      // FACTS — numbers with units/scale that read as claims, and whether sources appear.
      const stats = (text.match(/\b\d[\d,]*\+?\s*(people|learners|makers|prisoners|students|countries|years|tonnes|kg|litres|bikes|meals|jobs|%|per cent)\b/gi) || []).length;
      const percentages = (text.match(/\b\d{1,3}(\.\d)?%/g) || []).length;
      // Source signals: citation-ish words near numbers, or a footnote marker system.
      const sourceSignals = (text.match(/\b(source|according to|research by|study|report|data from|MoJ|Ministry of Justice|ONS|evaluation)\b/gi) || []).length;

      // CASE STUDIES — cards/links whose wording signals a story rather than a product.
      const caseStudyLinks = [...document.querySelectorAll('a')].filter(a => {
        const t = (a.textContent || '').trim();
        return /case stud|success stor|their story|read .*stor|meet |our maker|impact stor/i.test(t);
      }).length;

      // ZERO-KNOWLEDGE TEST — does the first screenful say who/what/for-whom?
      const saysWhat = /\b(we|our)\b/i.test(firstScreen) && /\b(build|make|train|teach|support|help|grow|sell|brew|roast)\b/i.test(firstScreen);
      const saysWho = /\b(prison|people|young|homeless|refugee|maker|farmer|student|school|community|beginner)\b/i.test(firstScreen);

      return {
        quotes, attributedQuotes: attributed,
        namedPeople, stats, percentages, sourceSignals, caseStudyLinks,
        zeroKnowledge: (saysWhat ? 1 : 0) + (saysWho ? 1 : 0),
        words: text.split(/\s+/).filter(Boolean).length,
      };
    }));
  } catch (e) { rec.error = String(e.message).slice(0, 80); }
  results.push(rec);
  console.log(`${rec.error ? '✗' : '✓'} ${name.padEnd(22)} ${rec.error || `quotes ${rec.quotes} (attr ${rec.attributedQuotes}) · names ${rec.namedPeople} · stats ${rec.stats} · % ${rec.percentages} · sources ${rec.sourceSignals} · cases ${rec.caseStudyLinks} · zk ${rec.zeroKnowledge}/2`}`);
  await ctx.close();
}
await browser.close();
mkdirSync('qa/research', { recursive: true });
writeFileSync('qa/research/content-benchmark.json', JSON.stringify(results, null, 1));
console.log('\n→ qa/research/content-benchmark.json');
