/*
 * mobile.js — Kesh Aura
 * Services carousel + hero fixes for mobile only.
 * Place in kesh-aura/ root. Add to every page before </body>:
 * <script src="mobile.js"></script>
 */

(function () {
  if (window.innerWidth > 768) return;
  var isFr = /-fr(\.html)?$/i.test(window.location.pathname);

  function init() {
    // Language: navbar.js hides EN|FR in the bar on small screens; overlay shows minimal EN | FR toggle.

    // ── Premium services ticker (replaces stats on mobile) ──────────────
    var statsEl = document.querySelector('.hero__stats');
    if (!document.querySelector('.ka-ticker')) {
      var services = [
        'Social Media Management',
        'Brand Identity',
        'Web Design & Development',
        'Paid Advertising',
        'SEO & Content',
        'AI Automation',
        'Photography & Video',
        'Brand Strategy',
        'Custom Software'
      ];

      var ticker = document.createElement('div');
      ticker.className = 'ka-ticker';
      var track = document.createElement('div');
      track.className = 'ka-ticker__track';

      [false, true].forEach(function(hidden) {
        services.forEach(function(s) {
          var item = document.createElement('div');
          item.className = 'ka-ticker__item';
          if (hidden) item.setAttribute('aria-hidden', 'true');
          item.innerHTML = '<span class="ka-ticker__dot"></span>' + s;
          track.appendChild(item);
        });
      });

      ticker.appendChild(track);

      if (statsEl && statsEl.parentNode) {
        statsEl.parentNode.insertBefore(ticker, statsEl.nextSibling);
      }

      requestAnimationFrame(function() {
        var w = track.scrollWidth / 2;
        var dur = Math.max(20000, Math.min(Math.round(w * 5), 38000));
        track.style.animationDuration = dur + 'ms';
      });
    }

    // ── Hero fix ────────────────────────────────────────────────────────
    var hero      = document.querySelector('.hero');
    var container = document.querySelector('.hero__container');
    var mascot    = document.querySelector('.hero__mascot');
    var title     = document.querySelector('.hero__title');
    var subtitle  = document.querySelector('.hero__subtitle');
    if (hero)      hero.style.cssText += ';height:100vh;min-height:100vh;max-height:100vh;overflow:hidden';
    if (container) container.style.cssText += ';min-height:unset;height:auto;padding-top:15vh;padding-bottom:3vh';
    if (mascot)    mascot.style.height = '36vh';
    if (isFr) {
      var words = title ? title.querySelectorAll('.word-cycle__item') : [];
      if (words.length >= 3) {
        words[0].textContent = 'STRATÉGIE';
        words[1].textContent = 'IMPACT';
        words[2].textContent = 'VISION';
      }
      if (subtitle) {
        subtitle.textContent = 'Agence 360° de Digital Marketing. Nous aidons les entreprises à accélérer en ligne.';
      }
      document.body.classList.add('ka-fr-mobile');
    } else if (subtitle) {
      subtitle.textContent = '360° Digital Marketing Agency. We help businesses accelerate online.';
    }

    // ── Carousel setup ──────────────────────────────────────────────────
    var carousel = document.querySelector('.services__grid');
    if (!carousel) return;

    var uiWrap    = document.getElementById('svcUiWrap');
    var ctaMobile = document.getElementById('svcCtaMobile');
    var numEl     = document.getElementById('svcCurrent');
    var trackEl   = document.getElementById('svcDotsTrack');
    var cards     = Array.from(carousel.querySelectorAll('.service-card'));
    var total     = cards.length;
    var lastSnap  = -1;
    var live      = false;

    // Show mobile UI
    if (uiWrap)    uiWrap.style.display = 'block';
    if (ctaMobile) ctaMobile.style.display = 'flex';

    // Build segmented capsules dynamically — one per card
    var segs = [];
    if (trackEl) {
      trackEl.innerHTML = '';
      for (var si = 0; si < total; si++) {
        var seg = document.createElement('div');
        seg.className = 'svc-seg';
        // Set initial distance from card 0
        var initDist = si > 2 ? 'far' : String(si);
        seg.setAttribute('data-dist', initDist);
        trackEl.appendChild(seg);
        segs.push(seg);
      }
    }

    // JS owns every visual property on cards — disable CSS transitions
    cards.forEach(function(c) { c.style.transition = 'none'; });

    // ── Math helpers ───────────────────────────────────────────────────
    function lerp(a, b, t) { return a + (b - a) * t; }
    function clamp(v, lo, hi) { return v < lo ? lo : v > hi ? hi : v; }

    // Pixels between consecutive card snap-centers
    function getStride() {
      return cards.length > 1
        ? cards[1].offsetLeft - cards[0].offsetLeft
        : cards[0].offsetWidth + 14;
    }

    // Fractional card index at current scroll position
    function getFrac() {
      var s = getStride();
      if (!s) return 0;
      var sl0 = cards[0].offsetLeft - (carousel.clientWidth / 2 - cards[0].offsetWidth / 2);
      return (carousel.scrollLeft - sl0) / s;
    }

    // ── Per-frame paint ────────────────────────────────────────────────
    // Drives card opacity/border/shadow AND the progress bar fill
    function paint() {
      if (!live) return;
      var f = getFrac();

      // Card visuals — interpolated live from scroll position
      cards.forEach(function(card, i) {
        var dist = clamp(Math.abs(i - f), 0, 2);
        var g    = clamp(1 - dist, 0, 1);
        var ty   = dist <= 1 ? lerp(-5, 5, dist) : lerp(5, 9, dist - 1);
        var op   = dist <= 1 ? lerp(1.0, 0.35, dist) : lerp(0.35, 0.08, dist - 1);

        card.style.transform   = 'translateY(' + ty.toFixed(1) + 'px)';
        card.style.opacity     = op.toFixed(3);
        card.style.borderColor = g > 0.02
          ? 'rgba(124,58,237,' + (g * 0.75).toFixed(2) + ')'
          : 'rgba(255,255,255,0.055)';
        card.style.boxShadow = g > 0.05
          ? '0 0 0 1px rgba(124,58,237,' + (g*0.18).toFixed(2) + '),' +
            '0 6px 24px rgba(0,0,0,' + (0.12+0.28*g).toFixed(2) + '),' +
            '0 0 ' + Math.round(g*12) + 'px rgba(124,58,237,' + (g*0.12).toFixed(2) + '),' +
            'inset 0 1px 0 rgba(255,255,255,' + (g*0.05).toFixed(2) + ')'
          : 'none';
      });

      // Bubble indicator — update on snap change
      // Each dot gets data-dist = distance from active (0=active, 1=next, etc.)
      var snap = clamp(Math.round(f), 0, total - 1);
      if (snap !== lastSnap) {
        lastSnap = snap;
        if (numEl) numEl.textContent = snap + 1;
        segs.forEach(function(seg, si) {
          var dist = Math.abs(si - snap);
          // Only 3 dots visible: 0=active, 1=near, 2=far-dim, 3+=hidden
          seg.setAttribute('data-dist', dist > 2 ? 'far' : String(dist));
        });
      }
    }

    // ── RAF loop — only active while scrolling ─────────────────────────
    var rafId = null, idleTimer = null;

    function startLoop() {
      if (rafId) return;
      (function loop() { paint(); rafId = requestAnimationFrame(loop); })();
    }
    function stopLoop() {
      if (rafId) { cancelAnimationFrame(rafId); rafId = null; }
      paint();
    }

    carousel.addEventListener('scroll', function() {
      startLoop();
      clearTimeout(idleTimer);
      idleTimer = setTimeout(stopLoop, 120);
    }, { passive: true });

    // ── Entrance: stagger cards up, then unlock live paint ─────────────
    if (numEl) numEl.textContent = '1';
    // data-dist already set during build above

    cards.forEach(function(c) {
      c.style.opacity   = '0';
      c.style.transform = 'translateY(22px)';
    });

    var ran = false;
    function go() {
      if (ran) return;
      ran = true;

      cards.forEach(function(card, i) {
        setTimeout(function() {
          card.style.transition = 'opacity 0.44s ease, transform 0.44s cubic-bezier(0.16,1,0.3,1)';
          void card.offsetHeight;
          card.style.opacity   = '1';
          card.style.transform = 'translateY(0)';
        }, i * 55);
      });

      setTimeout(function() {
        cards.forEach(function(c) {
          c.style.transition = 'none';
          c.style.transform  = '';
        });
        live = true;
        paint();
      }, (total - 1) * 55 + 480);
    }

    // ── Fire entrance when carousel near viewport ──────────────────────
    var rect = carousel.getBoundingClientRect();
    if (rect.top < window.innerHeight + 500) {
      go();
    } else {
      var obs = new IntersectionObserver(function(entries) {
        if (entries[0].isIntersecting) { obs.disconnect(); go(); }
      }, { rootMargin: '0px 0px 500px 0px', threshold: 0 });
      obs.observe(carousel);
    }


  } // end init()

  // Fire after full page load — layout is fully calculated
  if (document.readyState === 'complete') {
    init();
  } else {
    window.addEventListener('load', init);
  }

})();
