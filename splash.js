// Hide page instantly
document.documentElement.style.visibility = 'hidden';

(function(){
  // Only show once per session
  try {
    if(sessionStorage.getItem('ka-sp')){
      document.documentElement.style.visibility = '';
      return;
    }
  } catch(e){}

  if(window.matchMedia('(prefers-reduced-motion: reduce)').matches){
    document.documentElement.style.visibility = '';
    return;
  }

  var css = `
    #ka-splash {
      position: fixed; inset: 0; z-index: 999999;
      background: #050510;
      display: flex; align-items: center; justify-content: center;
      opacity: 1;
      transition: opacity 0.6s cubic-bezier(0.4, 0, 0.2, 1);
    }
    #ka-splash.ka-exit { opacity: 0; }
    .ka-dots { display: flex; align-items: center; gap: 12px; }
    .ka-dot {
      width: 8px; height: 8px; border-radius: 50%;
      background: #ffffff;
      animation: kaBounce 1.2s cubic-bezier(0.4, 0, 0.2, 1) infinite;
    }
    .ka-dot:nth-child(1) { animation-delay: 0s; }
    .ka-dot:nth-child(2) { animation-delay: 0.2s; }
    .ka-dot:nth-child(3) { animation-delay: 0.4s; }
    @keyframes kaBounce {
      0%, 100% { transform: translateY(0);     background: rgba(255,255,255,0.25); }
      50%       { transform: translateY(-14px); background: #7c3aed; }
    }
  `;

  var styleEl = document.createElement('style');
  styleEl.textContent = css;
  document.head.appendChild(styleEl);

  var splash = document.createElement('div');
  splash.id = 'ka-splash';
  splash.innerHTML = '<div class="ka-dots"><div class="ka-dot"></div><div class="ka-dot"></div><div class="ka-dot"></div></div>';

  function mount(){
    document.body.insertBefore(splash, document.body.firstChild);
    document.documentElement.style.visibility = '';

    // Mark as seen so it never shows again this session
    try{ sessionStorage.setItem('ka-sp','1'); }catch(e){}

    setTimeout(function(){
      splash.classList.add('ka-exit');
      setTimeout(function(){
        splash.remove();
        styleEl.remove();
      }, 650);
    }, 2000);
  }

  if(document.body){ mount(); }
  else { document.addEventListener('DOMContentLoaded', mount); }

})();
