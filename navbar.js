(function () {

  var scripts = document.querySelectorAll('script[src*="navbar.js"]');
  var tag = scripts[scripts.length - 1];
  var active = tag ? (tag.getAttribute('data-page') || 'home') : 'home';

  var path = window.location.pathname || '';
  var fileName = (path.split('/').pop() || 'index.html').split('?')[0].split('#')[0];
  if (!fileName) fileName = 'index.html';

  var isFr = /-fr\.html$/i.test(fileName);

  var storedLang = '';
  try { storedLang = localStorage.getItem('ka_lang') || ''; } catch (e) {}
  if (isFr) {
    try { localStorage.setItem('ka_lang', 'fr'); } catch (e) {}
  }
  var preferFr = isFr || storedLang === 'fr';

  /** Same page, other language (language switcher EN | FR) */
  var LANG_SWITCH = {
    'index.html': { en: 'index.html', fr: 'index-fr.html' },
    'index-fr.html': { en: 'index.html', fr: 'index-fr.html' },
    'services.html': { en: 'services.html', fr: 'services-fr.html' },
    'services-fr.html': { en: 'services.html', fr: 'services-fr.html' },
    'about.html': { en: 'about.html', fr: 'about-fr.html' },
    'about-fr.html': { en: 'about.html', fr: 'about-fr.html' },
    'contact.html': { en: 'contact.html', fr: 'contact-fr.html' },
    'contact-fr.html': { en: 'contact.html', fr: 'contact-fr.html' },
    'articles.html': { en: 'articles.html', fr: 'articles-fr.html' },
    'articles-fr.html': { en: 'articles.html', fr: 'articles-fr.html' },
    'article-1.html': { en: 'article-1.html', fr: 'article-1-fr.html' },
    'article-1-fr.html': { en: 'article-1.html', fr: 'article-1-fr.html' },
    'article-2.html': { en: 'article-2.html', fr: 'article-2-fr.html' },
    'article-2-fr.html': { en: 'article-2.html', fr: 'article-2-fr.html' },
    'article-3.html': { en: 'article-3.html', fr: 'article-3-fr.html' },
    'article-3-fr.html': { en: 'article-3.html', fr: 'article-3-fr.html' }
  };

  function switcherHref(targetLang) {
    var key = fileName.toLowerCase();
    if (LANG_SWITCH[key]) return LANG_SWITCH[key][targetLang];
    if (targetLang === 'en') {
      if (/-fr\.html$/i.test(fileName)) return fileName.replace(/-fr\.html$/i, '.html');
      return fileName;
    }
    if (targetLang === 'fr' && /\.html$/i.test(fileName) && !/-fr\.html$/i.test(fileName)) {
      return fileName.replace(/\.html$/i, '-fr.html');
    }
    return 'index-fr.html';
  }

  var hrefEn = switcherHref('en');
  var hrefFr = switcherHref('fr');

  /** Nav menu targets: French build uses -fr URLs where they exist */
  var FR_PAGE = {
    'index.html': 'index-fr.html',
    'services.html': 'services-fr.html',
    'about.html': 'about-fr.html',
    'contact.html': 'contact-fr.html',
    'articles.html': 'articles-fr.html',
    'article-1.html': 'article-1-fr.html',
    'article-2.html': 'article-2-fr.html',
    'article-3.html': 'article-3-fr.html'
  };

  function pageHref(enFile) {
    if (!preferFr) return enFile;
    var k = enFile.toLowerCase();
    return FR_PAGE[k] || enFile;
  }

  var cta = active === 'home' ? '#contact' : pageHref('contact.html');

  var pages = [
    { k: 'home',     l: preferFr ? 'Accueil' : 'Home',               h: pageHref('index.html') },
    { k: 'services', l: preferFr ? 'Services' : 'Services',          h: pageHref('services.html') },
    { k: 'about',    l: preferFr ? 'Qui sommes-nous' : 'Who We Are', h: pageHref('about.html') },
    { k: 'articles', l: preferFr ? 'Articles' : 'Articles',          h: pageHref('articles.html') },
    { k: 'contact',  l: preferFr ? 'Contact' : 'Contact',            h: pageHref('contact.html') }
  ];

  var ctaLabel = preferFr ? 'Lancer un Projet' : 'Start a Project';
  var homeHref = preferFr ? 'index-fr.html' : 'index.html';

  var switcherDesktop =
    '<div class="ka-lang-switcher ka-lang-switcher--desktop" aria-label="Language switcher" style="display:flex;align-items:center;gap:6px;margin-right:30px;font-family:&quot;Inter&quot;,sans-serif;font-size:.78rem;font-weight:600;color:rgba(255,255,255,.62);">' +
      '<a href="' + hrefEn + '" onclick="try{localStorage.setItem(\'ka_lang\',\'en\')}catch(e){}" style="color:' + (isFr ? 'rgba(255,255,255,.62)' : '#fff') + ';text-decoration:none;">EN</a>' +
      '<span>|</span>' +
      '<a href="' + hrefFr + '" onclick="try{localStorage.setItem(\'ka_lang\',\'fr\')}catch(e){}" style="color:' + (isFr ? '#fff' : 'rgba(255,255,255,.62)') + ';text-decoration:none;">FR</a>' +
    '</div>';
  var switcherMobile =
    '<div class="ka-lang-switcher ka-lang-switcher--mobile" aria-label="' + (preferFr ? 'Choisir la langue' : 'Choose language') + '">' +
      '<div class="ka-lang-pills" role="group">' +
        '<a href="' + hrefEn + '" onclick="try{localStorage.setItem(\'ka_lang\',\'en\')}catch(e){}" class="ka-lang-pill' + (isFr ? '' : ' on') + '">EN</a>' +
        '<span class="ka-lang-sep" aria-hidden="true"></span>' +
        '<a href="' + hrefFr + '" onclick="try{localStorage.setItem(\'ka_lang\',\'fr\')}catch(e){}" class="ka-lang-pill' + (isFr ? ' on' : '') + '">FR</a>' +
      '</div>' +
    '</div>';

  /* CSS */
  var css = [
    '@font-face{font-family:"Sonny Gothic";src:url("./Fontspring-DEMO-sonnygothic-black.otf") format("opentype");font-weight:900;font-style:normal;font-display:swap}',
    '#ka-nav{position:fixed;top:0;left:0;right:0;height:72px !important;z-index:9999;display:flex;align-items:center;padding:0 clamp(24px,5vw,80px) !important;background:transparent;border-bottom:1px solid transparent;transition:background .4s,border-color .4s,box-shadow .4s,transform .3s}',
    '#ka-nav.stuck{background:rgba(5,5,16,.85);backdrop-filter:blur(20px);-webkit-backdrop-filter:blur(20px);border-bottom:1px solid rgba(124,58,237,.18);box-shadow:0 8px 32px rgba(0,0,0,.35)}',
    '#ka-nav .w{display:flex;align-items:center;justify-content:space-between;width:100%;max-width:1380px;margin:0 auto;position:relative}',
    '#ka-nav .logo{display:flex;align-items:center;text-decoration:none;flex-shrink:0;transition:opacity .25s;transform:scale(1) !important;transform-origin:left center}',
    '#ka-nav .logo:hover{opacity:.8}',
    '#ka-nav .logo img{width:88px !important;height:88px !important;object-fit:contain;flex-shrink:0;filter:drop-shadow(0 0 10px rgba(124,58,237,.45));margin-left:-10px !important;margin-right:-14px !important;transform:scale(1) !important;transform-origin:center center}',
    '#ka-nav .logo-text{display:flex;flex-direction:column;gap:3px;transform:scale(1) !important;transform-origin:left center}',
    '#ka-nav .logo-name{font-family:"Sonny Gothic","Rajdhani","Impact",sans-serif;font-size:1.05rem !important;font-weight:900;letter-spacing:.10em !important;text-transform:uppercase;color:#fff;line-height:1}',
    '#ka-nav .logo-tag{font-family:"Inter",sans-serif;font-size:.48rem !important;letter-spacing:.26em !important;text-transform:uppercase;color:rgba(255,255,255,.38);line-height:1}',
    '#ka-nav ul{position:absolute;left:50%;transform:translateX(-50%);display:flex;align-items:center;gap:2px;list-style:none;margin:0;padding:0}',
    '#ka-nav ul a{font-family:"Inter",sans-serif;font-size:.84rem;font-weight:500;color:rgba(255,255,255,.5);text-decoration:none;padding:7px 14px;border-radius:6px;white-space:nowrap;transition:color .2s,background .2s;display:block}',
    '#ka-nav ul a:hover{color:#fff;background:rgba(255,255,255,.06)}',
    '#ka-nav ul a.on{color:#fff;background:rgba(124,58,237,.15)}',
    '#ka-nav .cta{font-family:"Inter",sans-serif;font-size:.84rem;font-weight:600;color:#fff;text-decoration:none;padding:9px 22px;border-radius:50px;background:linear-gradient(135deg,#8E2DE2 0%,#4A00E0 100%);box-shadow:none;white-space:nowrap;flex-shrink:0;transition:transform .2s ease,filter .2s ease}',
    '#ka-nav .cta:hover{transform:translateY(-2px);filter:brightness(1.06)}',
    '#ka-nav .cta:active{transform:scale(.95);filter:brightness(.9)}',
    '#ka-burger{display:none;flex-direction:column;justify-content:center;gap:5px;width:40px;height:40px;padding:8px;background:none;border:none;cursor:pointer;z-index:10001;flex-shrink:0}',
    '#ka-burger .b{display:block;width:22px;height:2px;background:rgba(255,255,255,.85);border-radius:2px;transition:transform .35s,opacity .25s}',
    '#ka-burger.open .b:nth-child(1){transform:translateY(7px) rotate(45deg)}',
    '#ka-burger.open .b:nth-child(2){opacity:0}',
    '#ka-burger.open .b:nth-child(3){transform:translateY(-7px) rotate(-45deg)}',
    '#ka-overlay{position:fixed;inset:0;background:rgba(5,5,16,.96);backdrop-filter:blur(24px);-webkit-backdrop-filter:blur(24px);z-index:9998;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:6px;opacity:0;pointer-events:none;transition:opacity .3s}',
    '#ka-overlay.open{opacity:1;pointer-events:all}',
    '#ka-overlay a.ml{font-family:"Inter",sans-serif;font-size:1.25rem;font-weight:600;color:rgba(255,255,255,.65);text-decoration:none;padding:12px 28px;border-radius:10px;letter-spacing:.04em;transition:color .2s,background .2s}',
    '#ka-overlay a.ml:hover,#ka-overlay a.ml.on{color:#fff;background:rgba(124,58,237,.12)}',
    '#ka-overlay a.mc{margin-top:16px;font-family:"Inter",sans-serif;font-size:.9rem;font-weight:600;color:#fff;text-decoration:none;padding:11px 28px;border-radius:50px;background:linear-gradient(135deg,#8E2DE2 0%,#4A00E0 100%);box-shadow:none;transition:transform .2s ease,filter .2s ease}',
    '#ka-overlay a.mc:hover{transform:translateY(-2px);filter:brightness(1.06)}',
    '#ka-overlay a.mc:active{transform:scale(.95);filter:brightness(.9)}',
    'html,body{overflow-x:hidden}',
    '@media(max-width:900px){#ka-nav ul a{font-size:.8rem;padding:7px 10px}}',
    '@media(max-width:768px){#ka-nav{padding:0 20px}#ka-nav ul,#ka-nav .cta{display:none}#ka-burger{display:flex}#ka-nav .ka-lang-switcher--desktop{display:none!important}}',
    '.ka-lang-switcher{display:flex;align-items:center;gap:8px;font-family:"Inter",sans-serif;color:rgba(255,255,255,.6)}',
    '.ka-lang-switcher--desktop{margin-right:18px}',
    '.ka-lang-switcher--mobile{width:auto;max-width:none;flex-direction:row;align-items:center;justify-content:center;align-self:center;gap:0;margin-top:18px}',
    '.ka-lang-pills{display:inline-flex;align-items:center;justify-content:center;gap:0;padding:0;border:none;background:transparent;-webkit-tap-highlight-color:transparent}',
    '.ka-lang-sep{width:1px;height:11px;margin:0 18px;background:rgba(255,255,255,.12);flex-shrink:0;border-radius:1px}',
    '.ka-lang-pill{flex:none;padding:6px 2px;font-size:.75rem;font-weight:500;color:rgba(255,255,255,.34);text-decoration:none;text-align:center;line-height:1;letter-spacing:.2em;text-transform:uppercase;border-bottom:2px solid transparent;margin-bottom:-1px;transition:color .2s ease,border-color .2s ease,opacity .2s ease;-webkit-tap-highlight-color:transparent}',
    '.ka-lang-pill:hover{color:rgba(255,255,255,.62)}',
    '.ka-lang-pill.on{color:#fff;border-bottom-color:#9d4edd}',
    '.ka-lang-pill.on:hover{color:#fff;border-bottom-color:#b794f6}',
    '.ka-lang-pill:active{opacity:.85}',
    '@media(min-width:769px){.ka-lang-switcher--mobile{display:none}}'
  ].join('');

  var s = document.createElement('style');
  s.textContent = css;
  document.head.appendChild(s);

  /* HTML */
  var desktopLinks = pages.map(function (p) {
    return '<li><a href="' + p.h + '"' + (p.k === active ? ' class="on"' : '') + '>' + p.l + '</a></li>';
  }).join('');

  var mobileLinks = pages.map(function (p) {
    return '<a href="' + p.h + '" class="ml' + (p.k === active ? ' on' : '') + '">' + p.l + '</a>';
  }).join('');

  var nav = document.createElement('nav');
  nav.id = 'ka-nav';
  nav.innerHTML =
    '<div class="w">' +
      '<a href="' + homeHref + '" class="logo">' +
        '<img src="./LOGO.png" alt="Kesh Aura">' +
        '<div class="logo-text">' +
          '<span class="logo-name">Kesh Aura</span>' +
          '<span class="logo-tag">Digital Agency</span>' +
        '</div>' +
      '</a>' +
      '<ul>' + desktopLinks + '</ul>' +
      '<div style="display:flex;align-items:center;gap:12px;flex-shrink:0">' +
        switcherDesktop +
        '<a href="' + cta + '" class="cta">' + ctaLabel + '</a>' +
        '<button id="ka-burger" aria-label="Menu">' +
          '<span class="b"></span>' +
          '<span class="b"></span>' +
          '<span class="b"></span>' +
        '</button>' +
      '</div>' +
    '</div>';

  var ov = document.createElement('div');
  ov.id = 'ka-overlay';
  ov.innerHTML = mobileLinks + switcherMobile + '<a href="' + cta + '" class="mc">' + ctaLabel + '</a>';

  document.body.insertAdjacentElement('afterbegin', ov);
  document.body.insertAdjacentElement('afterbegin', nav);

  // Enforce home navbar/logo sizing on every page (including services).
  navbarSizingLock();

  /* Logic */
  var burger = document.getElementById('ka-burger');
  var overlay = document.getElementById('ka-overlay');
  var navbar = document.getElementById('ka-nav');
  var lastY = 0, hidden = false;

  function navbarSizingLock() {
    var n = document.getElementById('ka-nav');
    if (!n) return;
    n.style.height = '72px';
    n.style.padding = '0 clamp(24px,5vw,80px)';

    var logo = n.querySelector('.logo');
    if (logo) {
      logo.style.transform = 'scale(1)';
      logo.style.transformOrigin = 'left center';
    }

    var img = n.querySelector('.logo img');
    if (img) {
      img.style.width = '88px';
      img.style.height = '88px';
      img.style.marginLeft = '-10px';
      img.style.marginRight = '-14px';
      img.style.transform = 'scale(1)';
      img.style.transformOrigin = 'center center';
      img.style.maxWidth = '88px';
      img.style.minWidth = '88px';
      img.style.maxHeight = '88px';
      img.style.minHeight = '88px';
    }

    var name = n.querySelector('.logo-name');
    if (name) {
      name.style.fontSize = '1.05rem';
      name.style.letterSpacing = '.10em';
      name.style.lineHeight = '1';
    }

    var tag = n.querySelector('.logo-tag');
    if (tag) {
      tag.style.fontSize = '.48rem';
      tag.style.letterSpacing = '.26em';
      tag.style.lineHeight = '1';
    }
  }

  window.addEventListener('scroll', function () {
    var y = window.scrollY;
    navbar.classList.toggle('stuck', y > 50);
    if (y - lastY > 6 && y > 120 && !hidden) { navbar.style.transform = 'translateY(-100%)'; hidden = true; }
    else if (lastY - y > 4 && hidden) { navbar.style.transform = 'translateY(0)'; hidden = false; }
    lastY = y;
  }, { passive: true });

  function openMenu() {
    overlay.classList.add('open'); burger.classList.add('open');
    document.body.style.overflow = 'hidden';
    if (window.gsap) gsap.fromTo(overlay.querySelectorAll('a'), { y: 16, opacity: 0 }, { y: 0, opacity: 1, duration: 0.4, ease: 'power2.out', stagger: 0.05 });
  }
  function closeMenu() {
    overlay.classList.remove('open'); burger.classList.remove('open');
    document.body.style.overflow = '';
  }

  burger.addEventListener('click', function () { overlay.classList.contains('open') ? closeMenu() : openMenu(); });
  overlay.querySelectorAll('a').forEach(function (a) { a.addEventListener('click', closeMenu); });
  window.addEventListener('resize', function () { if (window.innerWidth > 768) closeMenu(); });

})();
