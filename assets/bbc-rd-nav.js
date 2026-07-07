/* Bamboo Bicycle Club — redesign nav (2026). Loaded with `defer` from
   sections/bbc-header-2026.liquid. Handles the mobile drawer, the bottom-bar
   Menu button, the sticky auto-hide header, and predictive search.
   Results are built with textContent/setAttribute (no innerHTML). */
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

