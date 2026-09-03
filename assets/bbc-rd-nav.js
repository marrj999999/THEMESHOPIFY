/* Bamboo Bicycle Club — redesign nav (2026). Loaded with `defer` from
   sections/bbc-header-2026.liquid. Handles the mobile drawer, the bottom-bar
   Menu button, the sticky auto-hide header, and predictive search.
   Results are built with textContent/setAttribute (no innerHTML).
   cache-bust 2026-08-24: impact film swapped to the prison highlights reel.
   2026-08-24 later: + phone film starter for the home hero (see bottom). */
(function () {
  var header = document.getElementById('rd-header2026');
  if (!header) return;
  var btn = document.getElementById('rd-menubtn');

  function setOpen(open) {
    header.classList.toggle('rd-open', open);
    if (btn) {
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
      btn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    }
    // move focus into the drawer on open so keyboard/screen-reader users land inside it
    if (open) {
      var dr = header.querySelector('.rd-mobile');
      var first = dr && dr.querySelector('input, a, button');
      if (first) first.focus();
    }
  }
  if (btn) btn.addEventListener('click', function () { setOpen(!header.classList.contains('rd-open')); });

  // close the drawer after tapping any link inside it
  var drawer = header.querySelector('.rd-mobile');
  if (drawer) drawer.addEventListener('click', function (e) { if (e.target.closest('a')) setOpen(false); });

  // Escape closes the mobile drawer and returns focus to the menu button
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && header.classList.contains('rd-open')) {
      setOpen(false);
      if (btn) btn.focus();
    }
  });

  // bottom-bar Menu button opens the drawer; flag body so content clears the fixed bar
  var botmenu = document.getElementById('rd-botmenu');
  if (botmenu) botmenu.addEventListener('click', function () { setOpen(true); window.scrollTo({ top: 0, behavior: 'smooth' }); });
  if (document.querySelector('.rd-botbar')) document.body.classList.add('rd-has-botbar');

  // sticky auto-hide: hide on scroll-down, reveal on scroll-up; shadow once scrolled
  var lastY = window.pageYOffset || 0, ticking = false;
  function onScroll() {
    var y = window.pageYOffset || 0;
    header.classList.toggle('rd-stuck', y > 4);
    if (Math.abs(y - lastY) > 6) {
      if (y > lastY && y > 120 && !header.classList.contains('rd-open')) header.classList.add('rd-hidden');
      else header.classList.remove('rd-hidden');
      lastY = y;
    }
    ticking = false;
  }
  window.addEventListener('scroll', function () { if (!ticking) { window.requestAnimationFrame(onScroll); ticking = true; } }, { passive: true });

  // predictive search — progressive enhancement; the form still submits to native /search.
  function wireSearch(form) {
    var input = form.querySelector('input[name=q]');
    var wrap = form.closest('.rd-search-wrap');
    var results = wrap && wrap.querySelector('.rd-results');
    if (!input || !results) return;
    var action = form.getAttribute('action') || '/search';
    var t;
    function clear() { while (results.firstChild) results.removeChild(results.firstChild); }
    input.addEventListener('input', function () {
      clearTimeout(t);
      var q = input.value.trim();
      if (q.length < 2) { results.classList.remove('rd-show'); clear(); return; }
      t = setTimeout(function () {
        fetch(action + '/suggest.json?q=' + encodeURIComponent(q) + '&resources[type]=product,page&resources[limit]=6&resources[options][unavailable_products]=last')
          .then(function (r) { return r.json(); })
          .then(function (d) {
            var R = (d.resources && d.resources.results) || {};
            var items = [].concat(R.products || [], R.pages || []).slice(0, 6);
            clear();
            if (!items.length) {
              var e = document.createElement('div'); e.className = 'rd-empty';
              e.textContent = 'No matches — try “gravel”, “workshop” or “impact”.';
              results.appendChild(e);
            } else {
              items.forEach(function (it, i) {
                var a = document.createElement('a');
                a.setAttribute('href', it.url || '#');
                a.textContent = it.title || '';
                if (i === 0) a.className = 'rd-kbd';
                results.appendChild(a);
              });
            }
            results.classList.add('rd-show');
          })
          .catch(function () { results.classList.remove('rd-show'); });
      }, 180);
    });
    input.addEventListener('keydown', function (e) { if (e.key === 'Escape') { results.classList.remove('rd-show'); input.blur(); } });
    document.addEventListener('click', function (e) { if (wrap && !wrap.contains(e.target)) results.classList.remove('rd-show'); });
  }
  Array.prototype.forEach.call(header.querySelectorAll('.rd-search'), wireSearch);

  // Keyboard navigation for desktop dropdown menus (WCAG 2.1 AA)
  var drops = header.querySelectorAll('.rd-has-drop');
  Array.prototype.forEach.call(drops, function (wrap) {
    var trigger = wrap.querySelector('.rd-nav-link');
    var menu = wrap.querySelector('.rd-drop');
    if (!trigger || !menu) return;
    var items = menu.querySelectorAll('a[role="menuitem"]');

    function openDrop() {
      trigger.setAttribute('aria-expanded', 'true');
      wrap.classList.add('rd-drop-open');
      if (items.length) items[0].focus();
    }
    function closeDrop(returnFocus) {
      trigger.setAttribute('aria-expanded', 'false');
      wrap.classList.remove('rd-drop-open');
      if (returnFocus) trigger.focus();
    }

    // Enter / Space on trigger opens dropdown
    trigger.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        if (trigger.getAttribute('aria-expanded') === 'true') {
          closeDrop(false);
          // let the link navigate
        } else {
          e.preventDefault();
          openDrop();
        }
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        openDrop();
      } else if (e.key === 'Escape') {
        closeDrop(true);
      }
    });

    // Arrow keys inside dropdown
    Array.prototype.forEach.call(items, function (item, idx) {
      item.addEventListener('keydown', function (e) {
        if (e.key === 'ArrowDown') {
          e.preventDefault();
          if (idx < items.length - 1) items[idx + 1].focus();
        } else if (e.key === 'ArrowUp') {
          e.preventDefault();
          if (idx > 0) items[idx - 1].focus(); else trigger.focus();
        } else if (e.key === 'Escape') {
          e.preventDefault();
          closeDrop(true);
        } else if (e.key === 'Tab') {
          closeDrop(false);
        }
      });
    });

    // Close on outside click
    document.addEventListener('click', function (e) {
      if (!wrap.contains(e.target)) closeDrop(false);
    });
  });
})();

/* ---------------------------------------------------------------------------
   IMPACT HERO LOADER (2026-08-21; gate widened 2026-08-24 to include the story
   page). Separate IIFE, deliberately NOT inside the nav one above - that returns
   early when #rd-header2026 is absent, and this must not inherit that condition.

   WHY IT LIVES IN THE NAV FILE, which is the honest part. The correct home for this
   is a page-gated <script> in layout/theme.liquid, right after bbc-stat-countup.js.
   That edit is written and ready but was NOT deployed: theme.liquid is 613 lines of
   dense pre-existing Dawn Liquid (colour-scheme loop, JSON-LD, an inline prefetch
   blocker) and the only write path available here is a whole-file replace typed out
   by hand. A single mistyped character in that file breaks every page on the site,
   which is a bad trade for a script tag. This file, by contrast, is small, fully
   readable, loads with `defer` from the header section on every template, and its
   worst failure mode is that the nav or the hero film stops working - visible
   immediately and trivially reverted.

   PROPER CLEANUP, in preference order:
     1. Move the <video> into sections/bbc-impact-2026.liquid with a real `video`
        schema setting, next time that file is edited by hand. Then delete both this
        block and assets/bbc-impact-hero.js.
     2. Failing that, move this loader to a page-gated tag in layout/theme.liquid.

   URL DERIVATION: assets all sit in the same directory, so the sibling URL comes from
   this script's own src - INCLUDING its ?v= query. An earlier revision stripped the
   query as "meaningless" and that was wrong, expensively: Shopify's CDN caches the
   bare URL long-term, so after bbc-impact-hero.js was updated the page kept executing
   a stale 1.5KB copy while the theme asset was 5.8KB - the film IIFE ran (it existed
   in both versions) and the new pairing IIFE silently did not, which made the deploy
   LOOK half-broken. Carrying the parent's ?v= re-busts the child on every bbc-rd-nav
   deploy, and the two files change together in practice. If the child is ever updated
   WITHOUT touching this file, redeploy this file too (any byte - the hash is what
   matters).
   --------------------------------------------------------------------------- */
(function () {
  if (!document.querySelector('.bbc-rd-impact .rd-hero, .bbc-rd-about .rd-hero')) return;
  if (document.querySelector('script[src*="bbc-impact-hero"]')) return;
  var me = document.currentScript || document.querySelector('script[src*="bbc-rd-nav"]');
  if (!me || !me.src) return;
  var url = me.src.replace(/bbc-rd-nav\.js/, 'bbc-impact-hero.js');
  if (url === me.src) return;   // filename did not match; do nothing
  var s = document.createElement('script');
  s.src = url;
  s.defer = true;
  document.head.appendChild(s);
})();

/* ---------------------------------------------------------------------------
   HOME HERO PHONE FILM STARTER (2026-08-24, James: theme is now LIVE and "none
   of the hero videos are visual on mobile - fix"). Every hero's player gated
   films off under 750px - the original data-saving choice. The six section-owned
   heroes were fixed at source; the HOME hero cannot be: its player is inline in
   sections/bbc-home-2026.liquid (105KB, past the single-emit limit) and requires
   min-width:750px before it even attaches the <source>. This IIFE re-runs that
   attach + load + canplay-start sequence on phones only. Reduced-motion and
   save-data users still keep the poster - those are stated preferences, not
   screen sizes. Delete when bbc-home-2026.liquid is next edited by hand.
   --------------------------------------------------------------------------- */
(function () {
  if (!window.matchMedia || !window.matchMedia('(max-width: 749px)').matches) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  var c = navigator.connection || {};
  if (c.saveData || /(^|-)2g$/.test(c.effectiveType || '')) return;
  var v = document.querySelector('.bbc-rd-home .ew-video');
  if (!v || v.querySelector('source') || !v.dataset.src) return;
  var s = document.createElement('source');
  s.src = v.dataset.src; s.type = 'video/mp4';
  v.appendChild(s);
  v.preload = 'auto';
  v.muted = true; v.defaultMuted = true;
  v.load();
  function start() { var p = v.play(); if (p && p.catch) p.catch(function () { /* refused - poster stands */ }); }
  if (v.readyState >= 3) start();
  else v.addEventListener('canplay', start, { once: true });
})();

/* ---------------------------------------------------------------------------
   OUR-STORY TIMELINE RESTYLE (2026-08-24, James: "not a big fan of the timeline
   design" + his iPhone screenshots showed alternate rows CLIPPED off-screen -
   a WebKit-only overflow the Chromium pane cannot reproduce, rooted in the old
   grid-column/absolute-fill layout).
   THE REDESIGN, in the estate's flat culm language: the skeuomorphic bamboo pole
   and brown node rings become the 3px lime culm-dash rail every hero carries;
   each entry gets a lime node; rows are plain block flow on phones (nothing for
   WebKit to mis-place) and a simple two-column grid from 900px. Injected as a
   <style> from this site-wide file because bbc-about-2026.liquid (40KB) styles
   its timeline from the estate sheet - same precedent as the impact film
   loader above. FOLD INTO THE SECTION on its next hand edit, then delete this.
   --------------------------------------------------------------------------- */
(function () {
  if (!document.querySelector('.bbc-rd-about .rd-timeline.rd-culm')) return;
  if (document.getElementById('bbc-stl-2026')) return;
  var css = [
    '.bbc-rd .rd-timeline.rd-culm{padding-left:0}',
    '.bbc-rd .rd-timeline.rd-culm::before{left:8px!important;width:3px!important;border-radius:3px;background:repeating-linear-gradient(to bottom,#D4FD62 0 16px,rgba(6,35,28,.55) 16px 20px)!important;box-shadow:none!important}',
    '.bbc-rd .rd-timeline.rd-culm .rd-tl{display:block;position:relative;padding:26px 0 28px 44px;min-height:0;border-top:0}',
    '.bbc-rd .rd-timeline.rd-culm .rd-tl::before{left:3px!important;top:36px;width:13px!important;height:6px;border-radius:2px;background:#D4FD62!important;box-shadow:0 0 0 1.5px rgba(6,35,28,.6)!important}',
    '.bbc-rd .rd-timeline.rd-culm .rd-tl.rd-hot::before{box-shadow:0 0 0 1.5px rgba(6,35,28,.6),0 0 16px rgba(212,253,98,.6)!important}',
    '.bbc-rd .rd-timeline.rd-culm .rd-yr{font-size:clamp(26px,3vw,34px);line-height:1;margin:0 0 4px}',
    '.bbc-rd .rd-timeline.rd-culm .rd-tl .rd-tl-body{padding-left:0!important;margin-left:0!important;max-width:640px}',
    '.bbc-rd .rd-timeline.rd-culm .rd-tl .rd-tl-body h3,.bbc-rd .rd-timeline.rd-culm .rd-tl .rd-tl-body p{margin-left:0!important;padding-left:0!important}',
    '.bbc-rd .rd-timeline.rd-culm .rd-tl-body h3{margin:0 0 6px}',
    '.bbc-rd .rd-timeline.rd-culm .rd-tl-body p{max-width:60ch}',
    '.bbc-rd .rd-timeline.rd-culm .rd-tl-media{position:relative;margin:16px 0 0;width:100%;max-width:460px;aspect-ratio:16/10;border-radius:12px;overflow:hidden;box-shadow:0 0 0 1.5px rgba(230,220,200,.28)}',
    '.bbc-rd .rd-timeline.rd-culm .rd-tl + .rd-tl{border-top:1px solid rgba(230,220,200,.12)}',
    '@media(min-width:900px){',
    '.bbc-rd .rd-timeline.rd-culm .rd-tl{display:grid;grid-template-columns:110px minmax(0,1fr);gap:6px 22px;align-items:start;min-height:0}',
    '.bbc-rd .rd-timeline.rd-culm .rd-tl .rd-yr{grid-column:1}',
    '.bbc-rd .rd-timeline.rd-culm .rd-tl .rd-tl-body{grid-column:2}',
    '.bbc-rd .rd-timeline.rd-culm .rd-tl .rd-tl-media{grid-column:2;margin-top:14px;max-width:460px;aspect-ratio:16/10;align-self:start}',
    '}'
  ].join('');
  var s = document.createElement('style');
  s.id = 'bbc-stl-2026';
  s.textContent = css;
  document.head.appendChild(s);
})();

/* HOME DOORS 2x2 (2026-08-26) — FOLD INTO SECTION on next hand edit of bbc-home-2026.liquid.
   Chris's community door makes 4 doors; .rd-g3 is a fixed 3-col grid so the 4th wrapped ragged.
   Primary: :has() flips the grid to 2x2 at >=750px. Fallback (no :has): the 4th door spans the
   full row as a deliberate wide banner. Lives here because bbc-home-2026.liquid (105KB) and
   bbc-redesign-2026.css (148KB) both exceed the MCP whole-file emit limit. */
(function () {
  if (!document.querySelector('.bbc-rd-home')) return;
  var css = '@media (min-width:750px){' +
    '@supports selector(:has(*)){ .bbc-rd-home .rd-grid.rd-g3:has(> .rd-door:nth-of-type(4)){ grid-template-columns:repeat(2,1fr); } }' +
    '@supports not (selector(:has(*))){ .bbc-rd-home .rd-grid.rd-g3 > .rd-door:nth-of-type(4){ grid-column:1/-1; min-height:240px; } }' +
    '}';
  var s = document.createElement('style');
  s.id = 'bbc-doors-2026';
  s.textContent = css;
  document.head.appendChild(s);
})();

/* redeploy stamp 2026-09-02: bbc-impact-hero.js changed (preload none, rAF fade, li-valid ledger) — this byte re-busts its cached copy, per the URL DERIVATION note above. */

/* redeploy stamp 2026-09-02b: hero film starts on first input on phones. */
