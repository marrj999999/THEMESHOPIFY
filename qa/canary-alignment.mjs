// CANARY for the two loosened centring exemptions + the axis contentLeft upgrade.
// Injects known-bad fixtures and asserts the checks still catch them. A check that was only
// ever seen to pass is not evidence — and I just widened two exemptions, which is exactly the
// move that silently disarms a gate.
import { chromium } from 'playwright';
const br = await chromium.launch({ channel: 'chrome' });
const pg = await (await br.newContext({ viewport: { width: 1280, height: 900 } })).newPage();
await pg.setContent(`<style>
  body{margin:0}
  .host{width:1000px;padding:0 40px;border-left:5px solid red}
  /* BAD 1: a real block element inset both sides but NOT centred */
  .bad-centre{display:block;height:80px;width:600px;margin-left:60px;background:#ccc}
  /* GOOD: correctly margin-centred, must NOT be flagged */
  .good-centre{display:block;height:80px;width:600px;margin:0 auto;background:#eee}
  /* GOOD: inline-flex placed by text flow, must NOT be flagged (exemption 1) */
  .inline-btn{display:inline-flex;height:60px;width:300px;background:#ddd}
  /* GOOD: block correctly flush inside a bordered parent, must NOT be flagged (exemption 2) */
  .flush{display:block;height:80px;width:915px;background:#efe}
  /* GOOD: measure box on the axis — margin-right:0, no claim to centre (exemption 3) */
  .rd-mw-820px{display:block;height:80px;width:600px;margin-left:120px;margin-right:0;background:#eef}
  /* BAD: a measure box that DOES claim to centre (.rd-center) but does not — must still be caught.
     margin-left MUST NOT be 200px: the host's content box is 1000 and this box is 600, so 200
     would leave both gutters at exactly 200 and the fixture would be genuinely centred. The first
     draft of this canary made that mistake and reported the check dead when the FIXTURE was wrong.
     300 leaves 300/100 — unmistakably off-centre. */
  .rd-mw-620px.rd-center{display:block;height:80px;width:600px;margin-left:300px;margin-right:0;background:#fee}
</style>
<div class="host">
  <div class="bad-centre">BAD - off centre</div>
  <div class="good-centre">GOOD - centred</div>
  <p style="height:70px">some leading text <span class="inline-btn">inline</span></p>
  <div class="flush">GOOD - flush in bordered parent</div>
  <div class="rd-mw-820px">GOOD - measure box on the axis</div>
  <div class="rd-mw-620px rd-center">BAD - claims centring, is not centred</div>
</div>`);
const found = await pg.evaluate(() => {
  const R = e => e.getBoundingClientRect(); const out = [];
  for (const e of document.querySelectorAll('*')) {
    const r = R(e), p = e.parentElement && R(e.parentElement);
    if (!p || r.width < 200 || r.height < 40) continue;
    const pcs = getComputedStyle(e.parentElement);
    if (/grid|flex/.test(pcs.display)) continue;
    if (/^(TABLE|THEAD|TBODY|TFOOT|TR|TH|TD|CAPTION|COLGROUP|COL)$/.test(e.tagName)) continue;
    if (/table/.test(getComputedStyle(e).display)) continue;
    if (/^inline/.test(getComputedStyle(e).display)) continue;
    const cls = (e.className || '').toString();
    if (/rd-mw-/.test(cls) && !/rd-center|rd-mx-auto/.test(cls)) continue;
    const gL = (r.left - p.left) - (parseFloat(pcs.paddingLeft) || 0) - (parseFloat(pcs.borderLeftWidth) || 0);
    const gR = (p.right - r.right) - (parseFloat(pcs.paddingRight) || 0) - (parseFloat(pcs.borderRightWidth) || 0);
    if (gL < 4 || gR < 4) continue;
    if (Math.abs(gL - gR) > 2 && Math.abs(gL - gR) < 400) out.push(e.className || e.tagName);
  }
  return out;
});
// ── AXIS: the fixed/sticky exemption ────────────────────────────────────────────────────────
// Same risk as above — excluding pinned overlays could swallow a genuinely off-axis band.
const pg2 = await (await br.newContext({ viewport: { width: 390, height: 844 } })).newPage();
await pg2.setContent(`<style>
  body{margin:0}
  .rd-wrap{max-width:1200px;margin:0 auto;padding:0 18px;min-height:60px}
  .rd-wrap.bad-axis{padding:0 42px}                 /* BAD: off the shared content axis */
  #pinned{position:fixed;bottom:0;left:0;right:0}   /* GOOD: chrome, exempt */
  #pinned .rd-wrap{padding:0 16px}
</style>
<div class="rd-wrap" id="a">band one</div>
<div class="rd-wrap" id="b">band two</div>
<div class="rd-wrap" id="c">band three</div>
<div class="rd-wrap bad-axis" id="bad">off axis</div>
<div id="pinned"><div class="rd-wrap" id="chrome">sticky bar</div></div>`);
const axis = await pg2.evaluate(() => {
  const R = e => e.getBoundingClientRect();
  const wraps = [...document.querySelectorAll('.rd-wrap')].filter(e => {
    const r = R(e);
    if (r.width < 200 || r.height < 40) return false;
    if (/rd-mw-/.test((e.className || '').toString())) return false;
    for (let a = e; a && a !== document.body; a = a.parentElement) {
      if (/fixed|sticky/.test(getComputedStyle(a).position)) return false;
    }
    return true;
  }).map(e => {
    const cs = getComputedStyle(e), r = R(e);
    return { id: e.id, left: Math.round(r.left + (parseFloat(cs.paddingLeft) || 0) + (parseFloat(cs.borderLeftWidth) || 0)) };
  });
  const c = {}; wraps.forEach(w => c[w.left] = (c[w.left] || 0) + 1);
  const dom = Object.entries(c).sort((a, b) => b[1] - a[1])[0][0];
  return wraps.filter(w => String(w.left) !== dom).map(w => w.id);
});
await br.close();
const must = ['bad-centre', 'rd-mw-620px rd-center'], mustNot = ['good-centre', 'inline-btn', 'flush', 'rd-mw-820px'];
let ok = true;
if (!axis.includes('bad')) { console.log('✗ CANARY DEAD: a genuinely off-axis band was NOT caught'); ok = false; }
if (axis.includes('chrome')) { console.log('✗ FALSE POSITIVE: the pinned overlay WAS flagged as off-axis'); ok = false; }
if (axis.includes('bad') && !axis.includes('chrome')) console.log('✓ axis canary: caught the off-axis band; correctly ignored the fixed overlay');
for (const m of must)    if (!found.includes(m)) { console.log(`✗ CANARY DEAD: .${m} is genuinely off-centre and was NOT caught`); ok = false; }
for (const m of mustNot) if (found.includes(m))  { console.log(`✗ FALSE POSITIVE: .${m} is correct and WAS flagged`); ok = false; }
console.log(ok ? `✓ centring canary: caught ${must.join(',')}; correctly ignored ${mustNot.join(', ')}`
               : `  flagged: ${JSON.stringify(found)}`);
process.exit(ok ? 0 : 1);
