/* bbc-impact-hero.js — looping film behind the /pages/impact hero.
   Loaded with `defer` from layout/theme.liquid, gated to template.suffix == 'impact'.

   WHY THIS IS JS AND NOT MARKUP. The impact hero lives in sections/bbc-impact-2026.liquid,
   which renders <div class="rd-bg"><img></div> and has NO video setting at all. That file is
   ~112KB — past the single-emit round-trip limit — so the <video> cannot be added at source
   through the MCP pipe. Injecting it here is the only route that does not require rewriting
   112KB. If that file is ever edited by hand, move the <video> into the section, add a
   proper `video` schema setting, and delete this file.

   WHY THE URL IS HARDCODED. Same reason: with no section setting to read, there is nowhere
   for an editor-chosen file to come from. The clip is a 38s cut (1161x1000, 4.6MB) taken
   from the "Bamboo Gravel Bike Frame" master already in Shopify Files, trimmed to the
   95s-133s stretch which is hands/jig/tooling — the 140s+ region is presenter-to-camera and
   is deliberately excluded, it reads badly with no sound. To swap the film, replace SRC.

   THE POSTER STAYS VISIBLE UNDERNEATH. The section's own <img> is never removed — the video
   is layered over it and only fades in once it is genuinely playing. So every failure mode
   (blocked autoplay, decode error, offline, JS off) degrades to the photo the page already
   had, rather than to a black box. */
(function () {
  /* GENERALISED 2026-08-24: one config, one film per page. The tb page is NOT here -
     its section carries its own <video> (bbc-teambuilding-2026.liquid is small enough
     to edit at source); this file exists only for pages whose sections are past the
     single-emit limit (impact 112KB, about 40KB-but-loader-was-already-here). */
  var PAGES = [
    { root: '.bbc-rd-impact',
      /* SWAPPED 2026-08-24 (James): the gravel-build cut was a placeholder; this is
         the REAL story - a 34s face-safe highlights cut from the Lowdham Grange
         programme film (produced by the prison's Inside Media Department, 4K
         master in ~/Downloads "Bamboo BC Promo Vault.mp4"). Segments: prison
         aerial > empty classroom > BBC wall sign > hands-only build (tape, plans,
         marking, lacquer, assembly, seatpost, disc) > finished bike. Every
         participant-face segment excluded and the final cut was verified
         frame-by-frame - faces of participants must NEVER appear (safeguarding).
         Prev film (gravel build): 5d72641651c84f6dbaf1bf1613fad14b.mp4 */
      src: 'https://cdn.shopify.com/videos/c/o/v/5e1f0e89272a4823aa4fc777ea953bf3.mp4',
      poster: 'https://cdn.shopify.com/s/files/1/0502/8695/2631/files/preview_images/5e1f0e89272a4823aa4fc777ea953bf3.thumbnail.0000000000.jpg?v=1787576654' },
    { root: '.bbc-rd-about',
      src: 'https://cdn.shopify.com/videos/c/o/v/2dfa1972a3174904a552c493d527795a.mp4',
      poster: 'https://cdn.shopify.com/s/files/1/0502/8695/2631/files/preview_images/2dfa1972a3174904a552c493d527795a.thumbnail.0000000000.jpg?v=1787566787' }
  ];
  var page = null, hero = null;
  for (var i = 0; i < PAGES.length; i++) {
    var h = document.querySelector(PAGES[i].root + ' .rd-hero');
    if (h) { page = PAGES[i]; hero = h; break; }
  }
  if (!hero) return;
  var bg = hero.querySelector('.rd-bg');
  if (!bg || bg.querySelector('video')) return;

  var SRC = page.src;
  var POSTER = page.poster;

  /* Gates, matching the homepage hero's behaviour. A 4.6MB autoplaying file is not
     something to push at a phone on cellular, and reduced-motion is a stated preference,
     not a hint. Any gate failing simply leaves the existing photo in place. */
  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  /* phone gate removed 2026-08-24 - James: hero films must play on mobile too */
  var conn = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
  if (conn && (conn.saveData || /(^|-)2g$/.test(conn.effectiveType || ''))) return;

  var v = document.createElement('video');
  v.className = 'imp-film';
  v.muted = true;            // property, not attribute — Safari checks the property for autoplay
  v.defaultMuted = true;
  v.loop = true;
  v.playsInline = true;
  v.setAttribute('muted', '');
  v.setAttribute('loop', '');
  v.setAttribute('playsinline', '');
  v.setAttribute('webkit-playsinline', '');
  /* OPTIMISATION 2026-09-02: the film stays off the critical path. preload=none, no poster
     (the section's <img> already is the poster, so the 89KB thumbnail was a second download),
     low fetch priority, and loading only starts after the window load event — Lighthouse
     mobile measured LCP at 25s with the 3.3MB file preloading alongside the hero image. */
  v.setAttribute('preload', 'none');
  v.setAttribute('fetchpriority', 'low');
  v.setAttribute('aria-hidden', 'true');   // decorative; the <img> carries the real alt text
  v.setAttribute('tabindex', '-1');
  bg.appendChild(v);

  /* play() on a fresh element can resolve while the element is still paused at
     currentTime 0 — that exact bug shipped on the homepage hero, where the whole file
     downloaded and then sat on the poster. load() first, then start on `canplay`, and
     only mark it visible once `playing` has actually fired. */
  function start() {
    var p = v.play();
    if (p && p.catch) p.catch(function () { /* autoplay refused — photo stays */ });
  }
  /* Fade in two frames AFTER the first frame has painted at opacity 0: Chrome counts a
     video's first painted frame as a largest-contentful-paint candidate, and this film is the
     largest thing in the hero — on throttled mobile that put LCP at 25s. A frame painted at
     opacity 0 is not a candidate, and a later opacity change does not create one. */
  v.addEventListener('playing', function () {
    requestAnimationFrame(function () { requestAnimationFrame(function () { v.classList.add('is-on'); }); });
  }, { once: true });
  function begin() {
    v.src = SRC;
    v.load();
    if (v.readyState >= 3) start();
    else v.addEventListener('canplay', start, { once: true });
  }
  var deferStart = function () { setTimeout(begin, 600); };
  /* PHONES (2026-09-02): the film still plays on mobile (James, 24 Aug), but it starts on the
     visitor's first scroll or touch rather than on a timer. Chrome counts the film's first
     visible frame as a largest-contentful-paint candidate even when it fades in from opacity 0,
     so any timer-started film on a slow connection is scored as a 25-second LCP. Largest
     contentful paint stops being measured at the first user input, so an input-started film
     costs nothing on the score and nothing before the visitor has looked at the page. */
  var phone = window.matchMedia && window.matchMedia('(max-width: 767px), (pointer: coarse)').matches;
  if (phone) {
    var kicked = false;
    var kick = function () { if (kicked) return; kicked = true; begin(); };
    ['scroll', 'touchstart', 'pointerdown', 'keydown', 'wheel'].forEach(function (ev) { window.addEventListener(ev, kick, { once: true, passive: true }); });
  } else if (document.readyState === 'complete') deferStart();
  else window.addEventListener('load', deferStart, { once: true });

  /* Stop decoding while the tab is hidden — no reason to burn battery on a background
     loop nobody is looking at. */
  document.addEventListener('visibilitychange', function () {
    if (document.hidden) { v.pause(); }
    else if (v.classList.contains('is-on')) { start(); }
  });
})();

/* ---------------------------------------------------------------------------
   CREDIBILITY LEDGER PAIRING (2026-08-24). Separate IIFE on purpose: the film
   IIFE above returns early on phones / reduced-motion / save-data, and the
   pairing must run in ALL of those cases.

   WHY: in the "who backs it." band the section renders ALL logo tiles, then ALL
   notes, per group - so "2025 winner" floated under two funder logos with no
   visual owner. Tiles and notes are emitted from the same block loop in the same
   order, so note i belongs to tile i; this zips them. Markup fix at source is
   blocked by the section's size (~112KB, past the single-emit limit).
   Styling for .rd-backs__tilewrap/.rd-backs__cap lives in bbc-align.css.
   FAILURE MODE: any group where counts differ is skipped untouched, and with JS
   off the notes stay below the tiles - today's layout, not a break. */
(function () {
  var grps = document.querySelectorAll('.bbc-rd-impact .rd-backs__grp');
  if (!grps.length) return;
  grps.forEach(function (g) {
    if (g.querySelector('.rd-backs__tilewrap')) return;   // already paired
    var tiles = [].slice.call(g.querySelectorAll('.rd-backs__tile'));
    var notes = [].slice.call(g.querySelectorAll('.rd-backs__note'));
    if (!tiles.length || tiles.length !== notes.length) return;
    tiles.forEach(function (tile, i) {
      /* 2026-09-02: the wrapper is the <li> now, and the tile becomes a <div> inside it —
         a <div> between <ul> and <li> failed the list-semantics audit (Lighthouse 'listitem'). */
      var wrap = document.createElement('li');
      wrap.className = 'rd-backs__tilewrap';
      tile.parentNode.insertBefore(wrap, tile);
      var tileDiv = document.createElement('div');
      for (var a = 0; a < tile.attributes.length; a++) tileDiv.setAttribute(tile.attributes[a].name, tile.attributes[a].value);
      while (tile.firstChild) tileDiv.appendChild(tile.firstChild);
      tile.remove();
      wrap.appendChild(tileDiv);
      var cap = document.createElement('p');
      cap.className = 'rd-backs__cap';
      cap.textContent = notes[i].textContent.trim();
      wrap.appendChild(cap);
      notes[i].remove();
    });
  });
})();
