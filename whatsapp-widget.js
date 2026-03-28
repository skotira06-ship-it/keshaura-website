/*
 * whatsapp-widget.js — Kesh Aura Contact Widget
 * Premium expandable contact button with notification & animated message
 * Position: Bottom-left | All purple theme | Teaser resets each page load
 */

(function() {
  'use strict';

  // ── Configuration ──────────────────────────────────────────────────────
  var WHATSAPP_NUMBER = '212687714699';
  var PHONE_NUMBER    = '212727095894';

  var MESSAGES = {
    en: {
      whatsapp: "Hello Kesh Aura! I visited your website and I'm interested in your services. I'd love to learn more about how you can help my brand grow.",
      label: 'Contact us!',
      whatsappLabel: 'Chat on WhatsApp',
      phoneLabel: 'Call us'
    },
    fr: {
      whatsapp: "Bonjour Kesh Aura ! J'ai visité votre site web et je suis intéressé par vos services. J'aimerais en savoir plus sur la façon dont vous pouvez aider ma marque à se développer.",
      label: 'Contactez-nous !',
      whatsappLabel: 'Discuter sur WhatsApp',
      phoneLabel: 'Appelez-nous'
    }
  };

  // Detect language from URL
  var isFrench = /-fr(\.html)?$/i.test(window.location.pathname);
  var lang = isFrench ? 'fr' : 'en';
  var msg = MESSAGES[lang];
  
  // ── Styles ─────────────────────────────────────────────────────────────
  var style = document.createElement('style');
  style.textContent = `
    /* Container */
    #ka-contact-widget {
      position: fixed;
      bottom: 24px;
      left: 24px;
      z-index: 9989;
      opacity: 0;
      visibility: hidden;
      transform: translateY(10px);
      transition: opacity 0.4s cubic-bezier(0.16, 1, 0.3, 1), 
                  visibility 0.4s cubic-bezier(0.16, 1, 0.3, 1), 
                  transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
    }
    #ka-contact-widget.visible {
      opacity: 1;
      visibility: visible;
      transform: translateY(0);
    }

    /* Main button - clean, no glow */
    #ka-contact-main {
      width: 50px;
      height: 50px;
      border-radius: 50%;
      background: linear-gradient(135deg, #8E2DE2 0%, #4A00E0 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: transform 0.35s cubic-bezier(0.16, 1, 0.3, 1), 
                  background 0.3s ease;
      position: relative;
      border: none;
      outline: none;
    }
    #ka-contact-main:hover {
      transform: translateY(-2px) scale(1.03);
    }
    #ka-contact-main.active {
      background: linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%);
    }

    /* Main button icon */
    #ka-contact-main svg {
      width: 24px;
      height: 24px;
      fill: #fff;
      transition: transform 0.35s cubic-bezier(0.16, 1, 0.3, 1);
    }
    #ka-contact-main.active svg {
      transform: rotate(45deg);
    }

    /* Notification bubble */
    #ka-contact-notification {
      position: absolute;
      top: -4px;
      right: -4px;
      width: 20px;
      height: 20px;
      background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-family: 'Inter', -apple-system, sans-serif;
      font-size: 11px;
      font-weight: 700;
      color: #fff;
      border: 2px solid #050510;
      opacity: 0;
      transform: scale(0);
      transition: opacity 0.4s cubic-bezier(0.16, 1, 0.3, 1) 0.3s,
                  transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) 0.3s;
    }
    #ka-contact-notification.visible {
      opacity: 1;
      transform: scale(1);
      animation: ka-pulse 2s ease-in-out 1s infinite;
    }
    @keyframes ka-pulse {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.1); }
    }

    /* Message label - premium slide from right */
    #ka-contact-message {
      position: absolute;
      left: calc(100% + 14px);
      top: 50%;
      transform: translateY(-50%) translateX(20px);
      background: rgba(255, 255, 255, 0.98);
      backdrop-filter: blur(10px);
      padding: 10px 18px;
      border-radius: 25px;
      font-family: 'Inter', -apple-system, sans-serif;
      font-size: 14px;
      font-weight: 600;
      color: #1f2937;
      white-space: nowrap;
      pointer-events: none;
      opacity: 0;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
      transition: opacity 0.5s cubic-bezier(0.16, 1, 0.3, 1) 0.5s,
                  transform 0.5s cubic-bezier(0.16, 1, 0.3, 1) 0.5s;
    }
    #ka-contact-message::before {
      content: '';
      position: absolute;
      left: -6px;
      top: 50%;
      transform: translateY(-50%);
      width: 0;
      height: 0;
      border-top: 6px solid transparent;
      border-bottom: 6px solid transparent;
      border-right: 6px solid rgba(255, 255, 255, 0.98);
    }
    #ka-contact-message.visible {
      opacity: 1;
      transform: translateY(-50%) translateX(0);
    }

    /* Expanded buttons container */
    #ka-contact-buttons {
      position: absolute;
      bottom: 100%;
      left: 0;
      margin-bottom: 12px;
      display: flex;
      flex-direction: column;
      gap: 10px;
      opacity: 0;
      visibility: hidden;
      transform: translateY(20px);
      transition: opacity 0.35s cubic-bezier(0.16, 1, 0.3, 1),
                  visibility 0.35s cubic-bezier(0.16, 1, 0.3, 1),
                  transform 0.35s cubic-bezier(0.16, 1, 0.3, 1);
    }
    #ka-contact-buttons.visible {
      opacity: 1;
      visibility: visible;
      transform: translateY(0);
    }

    /* Individual action buttons - all purple, no glow */
    .ka-contact-btn {
      width: 50px;
      height: 50px;
      border-radius: 50%;
      background: linear-gradient(135deg, #8E2DE2 0%, #4A00E0 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      text-decoration: none;
      transition: transform 0.35s cubic-bezier(0.16, 1, 0.3, 1);
      opacity: 0;
      transform: scale(0.8) translateY(10px);
    }
    #ka-contact-buttons.visible .ka-contact-btn {
      opacity: 1;
      transform: scale(1) translateY(0);
    }
    /* Stagger animation */
    #ka-contact-buttons.visible .ka-contact-btn:nth-child(1) {
      transition-delay: 0.08s;
    }
    #ka-contact-buttons.visible .ka-contact-btn:nth-child(2) {
      transition-delay: 0.14s;
    }

    .ka-contact-btn:hover {
      transform: translateY(-2px) scale(1.05);
    }
    .ka-contact-btn svg {
      width: 22px;
      height: 22px;
      fill: #fff;
    }

    /* Mobile adjustments */
    @media (max-width: 768px) {
      #ka-contact-widget {
        bottom: 18px;
        left: 16px;
      }
      #ka-contact-main {
        width: 46px;
        height: 46px;
      }
      #ka-contact-main svg {
        width: 22px;
        height: 22px;
      }
      #ka-contact-notification {
        width: 18px;
        height: 18px;
        font-size: 10px;
      }
      #ka-contact-message {
        font-size: 13px;
        padding: 8px 16px;
        left: calc(100% + 12px);
      }
      .ka-contact-btn {
        width: 46px;
        height: 46px;
      }
      .ka-contact-btn svg {
        width: 20px;
        height: 20px;
      }
    }

    /* Overlay for closing */
    #ka-contact-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      z-index: 9988;
      display: none;
      cursor: default;
    }
    #ka-contact-overlay.active {
      display: block;
    }
  `;
  document.head.appendChild(style);

  // ── Build HTML ─────────────────────────────────────────────────────────
  var overlay = document.createElement('div');
  overlay.id = 'ka-contact-overlay';
  document.body.appendChild(overlay);

  var widget = document.createElement('div');
  widget.id = 'ka-contact-widget';
  widget.innerHTML = `
    <div id="ka-contact-buttons">
      <a href="tel:+${PHONE_NUMBER}" 
         id="ka-contact-phone" 
         class="ka-contact-btn"
         aria-label="${msg.phoneLabel}">
        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M20.01 15.38c-1.23 0-2.42-.2-3.53-.56-.35-.12-.74-.03-1.01.24l-1.57 1.97c-2.83-1.35-5.48-3.9-6.89-6.83l1.95-1.66c.27-.28.35-.67.24-1.02-.37-1.11-.56-2.3-.56-3.53 0-.54-.45-.99-.99-.99H4.19C3.65 3 3 3.24 3 3.99 3 13.28 10.73 21 20.01 21c.71 0 .99-.63.99-1.18v-3.45c0-.54-.45-.99-.99-.99z"/>
        </svg>
      </a>
      <a href="https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg.whatsapp)}" 
         id="ka-contact-whatsapp" 
         class="ka-contact-btn"
         target="_blank"
         rel="noopener noreferrer"
         aria-label="${msg.whatsappLabel}">
        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
        </svg>
      </a>
    </div>
    <div id="ka-contact-message">${msg.label}</div>
    <button id="ka-contact-main">
      <div id="ka-contact-notification">1</div>
      <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 9h12v2H6V9zm8 5H6v-2h8v2zm4-6H6V6h12v2z"/>
      </svg>
    </button>
  `;
  document.body.appendChild(widget);

  // ── State & Elements ───────────────────────────────────────────────────
  var mainBtn = document.getElementById('ka-contact-main');
  var buttonsContainer = document.getElementById('ka-contact-buttons');
  var notification = document.getElementById('ka-contact-notification');
  var messageLabel = document.getElementById('ka-contact-message');
  var isExpanded = false;
  var messageDismissTimer = null;
  var teaserDismissedThisPage = false;

  // ── Toggle expansion ───────────────────────────────────────────────────
  function toggleExpand() {
    isExpanded = !isExpanded;
    
    if (isExpanded) {
      mainBtn.classList.add('active');
      buttonsContainer.classList.add('visible');
      overlay.classList.add('active');
      
      if (!teaserDismissedThisPage) {
        teaserDismissedThisPage = true;
        dismissNotificationAndMessage();
      }
    } else {
      mainBtn.classList.remove('active');
      buttonsContainer.classList.remove('visible');
      overlay.classList.remove('active');
    }
  }

  function closeExpand() {
    if (isExpanded) {
      isExpanded = false;
      mainBtn.classList.remove('active');
      buttonsContainer.classList.remove('visible');
      overlay.classList.remove('active');
    }
  }

  function dismissNotificationAndMessage() {
    // Fade out both notification and message
    notification.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
    notification.style.opacity = '0';
    notification.style.transform = 'scale(0)';
    
    messageLabel.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
    messageLabel.style.opacity = '0';
    messageLabel.style.transform = 'translateY(-50%) translateX(20px)';
  }

  function showNotificationAndMessage() {
    // Show notification bubble immediately
    notification.classList.add('visible');
    
    // Show message label with delay
    setTimeout(function() {
      messageLabel.classList.add('visible');
    }, 500);
    
    // Auto-hide message after 6 seconds (but keep notification)
    messageDismissTimer = setTimeout(function() {
      messageLabel.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
      messageLabel.style.opacity = '0';
      messageLabel.style.transform = 'translateY(-50%) translateX(20px)';
    }, 6500);
  }

  // ── Event listeners ────────────────────────────────────────────────────
  mainBtn.addEventListener('click', function(e) {
    e.stopPropagation();
    toggleExpand();
  });

  overlay.addEventListener('click', closeExpand);

  // Close on Escape key
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') closeExpand();
  });

  // ── Scroll-based visibility ────────────────────────────────────────────
  var scrollThreshold = 400; // pixels
  var widgetVisible = false;

  function updateVisibility() {
    var scrolled = window.pageYOffset || document.documentElement.scrollTop;
    
    if (scrolled > scrollThreshold) {
      if (!widgetVisible) {
        widgetVisible = true;
        widget.classList.add('visible');
        
        if (!teaserDismissedThisPage) {
          setTimeout(function() {
            showNotificationAndMessage();
          }, 400);
        }
      }
    } else {
      if (widgetVisible) {
        widgetVisible = false;
        widget.classList.remove('visible');
        closeExpand(); // Close if open when scrolling back to top
        
        // Clear message timer if exists
        if (messageDismissTimer) {
          clearTimeout(messageDismissTimer);
          messageDismissTimer = null;
        }
      }
    }
  }

  // Initial check
  updateVisibility();

  // Listen to scroll
  window.addEventListener('scroll', updateVisibility, { passive: true });

  // Also check on resize
  window.addEventListener('resize', updateVisibility, { passive: true });

})();
