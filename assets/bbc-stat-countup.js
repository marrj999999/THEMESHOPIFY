/* BBC stat count-up v2 — 2026-07-02. Vanilla, no libraries.
   v2 fix: numbers are NEVER pre-zeroed — the zero state only exists during the
   animation itself, so if the observer never fires the true number just shows.
   Small numbers (<10) don't animate (0->1 looks broken). Years skipped.
   Respects prefers-reduced-motion. */
(function () {
  var reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduced || !('IntersectionObserver' in window)) return;
  var SEL = '.rd-num, .bbc-trust-bar__stat, .bbc-trust-stats__value, .bbc-problem__stat-number, .bbc-impact-stats__number';
  var els = document.querySelectorAll(SEL);
  if (!els.length) return;

  function parse(text) {
    var m = text.match(/^([^0-9]*?)([0-9][0-9,]*(?:\.[0-9]+)?)(.*)$/);
    if (!m) return null;
    var pre = m[1], numStr = m[2], suf = m[3];
    if (/[A-Za-z]/.test(pre)) return null;                       /* "Since 2012" */
    var plain = numStr.replace(/,/g, '');
    if (/^(19|20)\d{2}$/.test(plain) && !pre && !/[%+£kK]/.test(suf)) return null;  /* years */
    var n = parseFloat(plain);
    if (!n || n < 10) return null;                               /* 0->1 counts look broken */
    return { pre: pre, n: n, suf: suf, dec: (numStr.split('.')[1] || '').length, grouped: numStr.indexOf(',') > -1, final: text };
  }
  function fmt(v, p) {
    var s = p.dec ? v.toFixed(p.dec) : Math.round(v).toString();
    if (p.grouped) s = s.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return p.pre + s + p.suf;
  }
  function animate(el, p) {
    var D = 1300, t0 = null;
    function step(ts) {
      if (!t0) t0 = ts;
      var t = Math.min((ts - t0) / D, 1);
      var e = 1 - Math.pow(1 - t, 4);
      el.textContent = fmt(p.n * e, p);
      if (t < 1) requestAnimationFrame(step);
      else { el.textContent = p.final; el.classList.add('bbc-counted'); }  /* restore EXACT original */
    }
    requestAnimationFrame(step);
  }
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      if (!en.isIntersecting) return;
      io.unobserve(en.target);
      if (en.target._bbcCount) animate(en.target, en.target._bbcCount);
    });
  }, { threshold: 0.25 });                                       /* v2: was 0.6 — edge-clipped bands never fired */
  els.forEach(function (el) {
    if (el.children.length) return;
    if (el.classList.contains('bbc-counted')) return;  /* pre-marked = render instantly (impact page, 2026-07-12) */
    var p = parse(el.textContent.trim());
    if (!p) return;
    el._bbcCount = p;
    el.style.fontVariantNumeric = 'tabular-nums';
    io.observe(el);                                              /* v2: no pre-zeroing — text untouched until visible */
  });
})();

/* moneyTidy — Dawn's variant-change JS reformats .money spans with 2dp; strip exact .00 only. */
(function () {
  function strip(el) { var t = el.textContent; var s = t.replace(/\.00(?=\D|$)/g, ''); if (s !== t) el.textContent = s; }
  function sweep(root) { if (root.querySelectorAll) { var l = root.querySelectorAll('.money'); for (var i = 0; i < l.length; i++) strip(l[i]); } }
  sweep(document);
  document.addEventListener('DOMContentLoaded', function () { sweep(document); });
  if ('MutationObserver' in window) {
    new MutationObserver(function (ms) {
      for (var i = 0; i < ms.length; i++) {
        var m = ms[i];
        if (m.target && m.target.classList && m.target.classList.contains('money')) strip(m.target);
        for (var j = 0; j < m.addedNodes.length; j++) { var n = m.addedNodes[j]; if (n.nodeType === 1) { if (n.classList && n.classList.contains('money')) strip(n); sweep(n); } }
      }
    }).observe(document.documentElement, { subtree: true, childList: true });
  }
})();

/* rdMarqueeInit — press-logo marquee (progressive): clones the logo row into a
   scrolling track. Skipped entirely under prefers-reduced-motion. */
(function rdMarqueeInit() {
  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  function build() {
    document.querySelectorAll('.rd-logobar.rd-marquee-src').forEach(function (bar) {
      if (bar._rdMarq) return; bar._rdMarq = true;
      var track = document.createElement('div'); track.className = 'rd-marquee-track';
      while (bar.firstChild) track.appendChild(bar.firstChild);
      var clone = track.cloneNode(true); clone.setAttribute('aria-hidden', 'true');
      bar.appendChild(track); bar.appendChild(clone); bar.classList.add('rd-marquee-on');
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', build); else build();
})();
