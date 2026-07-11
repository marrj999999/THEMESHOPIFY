/* ============================================================
   BBC Design-System Conformance Test  (styling + content)
   ------------------------------------------------------------
   A comparison test: asserts the LIVE rendered site against a
   golden SPEC of correct styling and correct content.
   Run in the browser console on the preview site (must be logged
   into Shopify admin so ?preview_theme_id resolves the draft):

     BBC.runStyle()            // check current page's computed styling
     await BBC.runContent()    // sweep every URL (sitemap) for content rules
     await BBC.runAll()        // style on a template set + full content sweep

   Returns/logs a PASS/FAIL report. Exit criteria: zero FAILs.
   ============================================================ */
window.BBC = (() => {
  const SPEC = {
    style: {
      fontFamily: /^"?Atkinson Hyperlegible Next/,     // one family, everywhere
      tokens: { '--forest':'#003C32', '--lime':'#D4FD62', '--bone':'#E6DCC8', '--steel-light':'#DEE6F0' },
      primaryButtonRadiusPx: 999,                        // pill
      forbidLegacyGreen: 'rgb(7, 62, 39)',               // retired #073e27
      canonicalForest: 'rgb(0, 60, 50)',                 // #003C32
      maxH1: 1,
      noHorizontalOverflow: true,
    },
    contentForbidden: {
      'stronger-than-steel': /stronger than steel/i,
      '28000-psi': /28,?000\s*psi/i,
      '56.7%': /56\.7\s*%/i,
      'net-negative': /net[- ]negative/i,
      '100%-completion': /100\s*%\s*completion/i,
      'most-sustainable-world': /most sustainable[^.]{0,20}world/i,
      '£11.41-sroi': /£\s*11\.41/i,
      'three-prisons': /three prisons|3 active prison/i,
      'ocn-1&2-mush': /level 1 (&|and) 2/i,
      '36-countries': /36\+?\s*countr/i,
      '13-years': /(thirteen|13)\s*years\b/i,
      'from-£500': /from\s*£\s*500\b/i,
      'hello@-email': /hello@bamboobicycleclub/i,
      '.com-email': /bamboobicycleclub\.com/i,
      'gmail-email': /bamboobicycleclub@gmail/i,
    },
    // required facts, only asserted where the topic appears
    contentRequired: {
      'countries-45': { when:/countr(y|ies)/i, must:/45\s*countr/i, label:'countries stated as 45' },
      'steel-compliant': { when:/tensile|strength|mild steel|comparable/i, must:/comparable to mild steel|bs iso 22157/i, label:'strength framed as "comparable to mild steel"' },
    },
    templates: ['/','/products/bamboo-bike-road-kit','/products/bamboo','/collections/home-build-kits',
                '/blogs/news/how-i-built-a-bamboo-bike-by-alessandro','/cart','/404-test-xyz'],
  };

  function runStyle(){
    const g=getComputedStyle, root=g(document.documentElement), fails=[];
    if(!SPEC.style.fontFamily.test(g(document.body).fontFamily)) fails.push('font-family != Atkinson Next ('+g(document.body).fontFamily.split(',')[0]+')');
    for(const [k,hex] of Object.entries(SPEC.style.tokens)){ const val=root.getPropertyValue(k).trim(); if(val && val.toUpperCase()!==hex) fails.push('token '+k+' = '+val+' (want '+hex+')'); }
    const btn=document.querySelector('.btn--primary,.rd-btn.rd-lime,.bbcst-btn.is-primary,.rd-nav-cta,.product-form__submit,button[name="add"]');
    if(btn){ const r=parseInt(g(btn).borderRadius); if(r && r<40 && r!==999) fails.push('primary button radius '+g(btn).borderRadius+' not pill'); }
    const legacy=[...document.querySelectorAll('*')].filter(e=>{const s=g(e);return s.backgroundColor===SPEC.style.forbidLegacyGreen||s.color===SPEC.style.forbidLegacyGreen;}).length;
    if(legacy) fails.push('legacy green on '+legacy+' element(s)');
    if(document.querySelectorAll('h1').length>SPEC.style.maxH1) fails.push('multiple <h1>');
    if(document.documentElement.scrollWidth>innerWidth+2) fails.push('horizontal overflow ('+document.documentElement.scrollWidth+'>'+innerWidth+')');
    const r={page:location.pathname, pass:!fails.length, fails};
    console.log((r.pass?'✅':'❌')+' STYLE '+r.page, r.fails); return r;
  }

  async function scanURL(u){
    const t=(await (await fetch(u+(u.includes('?')?'&':'?')+'_cb='+Date.now(),{credentials:'include'})).text());
    const body=t.replace(/[\s\S]*?<body/i,'<body').replace(/<[^>]+>/g,' ');
    const forbidden=Object.keys(SPEC.contentForbidden).filter(k=>SPEC.contentForbidden[k].test(body));
    const missing=Object.keys(SPEC.contentRequired).filter(k=>{const r=SPEC.contentRequired[k];return r.when.test(body)&&!r.must.test(body);}).map(k=>SPEC.contentRequired[k].label);
    return {u, forbidden, missing};
  }

  async function runContent(){
    const origin=location.origin;
    const idx=await (await fetch('/sitemap.xml',{credentials:'include'})).text();
    const subs=[...idx.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m=>m[1]);
    let urls=[]; for(const s of subs){ try{ const x=await (await fetch(s.replace(origin,''),{credentials:'include'})).text();
      urls.push(...[...x.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m=>m[1].replace(origin,'').split('?')[0])); }catch(e){} }
    urls=[...new Set(urls)]; const hits=[]; let done=0;
    const B=16; for(let i=0;i<urls.length;i+=B){ const rs=await Promise.all(urls.slice(i,i+B).map(scanURL));
      rs.forEach(r=>{ if(r.forbidden.length||r.missing.length) hits.push(r); done++; }); }
    const totals={}; hits.forEach(h=>h.forbidden.forEach(f=>totals[f]=(totals[f]||0)+1));
    console.log('CONTENT scanned '+done+' URLs · flagged '+hits.length, totals);
    return {scanned:done, flagged:hits.length, totals, hits};
  }

  // Build-QA: render-quality gates for a custom-built section on the current page.
  // Pass a selector for the section wrapper (e.g. '.bbc-hm', '.bbc-imp').
  function runBuild(sel){
    const root=document.querySelector(sel); const f=[];
    if(!root) return {sel, pass:false, fails:['section '+sel+' not rendered']};
    const g=getComputedStyle;
    const imgs=[...root.querySelectorAll('img')];
    const broken=imgs.filter(i=>i.complete&&i.naturalWidth===0).map(i=>i.alt.slice(0,20));
    if(broken.length) f.push('broken images: '+broken.join(' | '));
    if(document.documentElement.scrollWidth>innerWidth+2) f.push('horizontal overflow');
    const legacy=[...root.querySelectorAll('*')].filter(e=>{const s=g(e);return s.backgroundColor==='rgb(7, 62, 39)'||s.color==='rgb(7, 62, 39)';}).length;
    if(legacy) f.push('legacy green on '+legacy+' elements');
    if(document.querySelectorAll(sel+' h1').length>1) f.push('multiple <h1> in section');
    const h1=document.querySelector(sel+' h1');
    if(h1 && !/^"?Atkinson Hyperlegible Next/.test(g(h1).fontFamily)) f.push('hero not Atkinson Next');
    if(h1 && g(h1).fontWeight!=='800') f.push('hero not weight 800');
    if(!root.querySelector('iframe[src*="youtube"],iframe[src*="vimeo"]')) f.push('no embedded video');
    const r={sel, pass:!f.length, fails:f, images:imgs.length};
    console.log((r.pass?'✅':'❌')+' BUILD '+sel, r.fails); return r;
  }

  return { SPEC, runStyle, runContent, runBuild };
})();
console.log('BBC conformance loaded. Use BBC.runStyle() / await BBC.runContent().');
