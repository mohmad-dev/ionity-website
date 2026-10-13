/**
 * IONITY — Main JavaScript Controller
 * Handles: preloader, nav scroll, mobile menu, scroll animations,
 *          contact form, dynamic copyright year.
 * File: assets/js/main.js
 *
 * Dependencies: none (vanilla JS only; jQuery retained for audio-controller compat)
 */

(function () {
  'use strict';

  /* ─────────────────────────────────────────────────
     0. Custom Green Cursor (Desktop)
  ───────────────────────────────────────────────── */
  (function initCustomCursor() {
    var cursor = document.getElementById('custom-cursor');
    if (!cursor) return;

    var isTouch = window.matchMedia('(hover: none) or (pointer: coarse)').matches;
    if (isTouch) {
      cursor.style.display = 'none';
      return;
    }

    var dot = cursor.querySelector('.cursor-dot');
    var ring = cursor.querySelector('.cursor-ring');
    var isVisible = false;

    window.addEventListener('mousemove', function (e) {
      var pos = 'translate3d(' + e.clientX + 'px, ' + e.clientY + 'px, 0) translate(-50%, -50%)';

      if (!isVisible) {
        isVisible = true;
        cursor.classList.add('is-visible');
      }

      if (dot) dot.style.transform = pos;
      if (ring) ring.style.transform = pos;
    }, { passive: true });

    document.addEventListener('mouseleave', function () {
      isVisible = false;
      cursor.classList.remove('is-visible');
    });

    document.addEventListener('mouseenter', function () {
      isVisible = true;
      cursor.classList.add('is-visible');
    });

    var interactiveSel = 'a, button, input, textarea, select, [role="button"], .card, .btn, .sidebar-nav-item, .clickable';
    document.addEventListener('mouseover', function (e) {
      if (e.target && e.target.closest(interactiveSel)) {
        cursor.classList.add('is-hovering');
      }
    });

    document.addEventListener('mouseout', function (e) {
      if (e.target && e.target.closest(interactiveSel)) {
        cursor.classList.remove('is-hovering');
      }
    });

    document.addEventListener('mousedown', function () {
      cursor.classList.add('is-down');
    });

    document.addEventListener('mouseup', function () {
      cursor.classList.remove('is-down');
    });
  })();


  /* ─────────────────────────────────────────────────
     1. Preloader
  ───────────────────────────────────────────────── */
  function hidePreloader() {
    var el = document.querySelector('.preloader');
    if (!el) return;
    el.classList.add('is-hidden');
    setTimeout(function () {
      if (el.parentNode) el.parentNode.removeChild(el);
    }, 600);
  }

  if (document.readyState === 'complete') {
    setTimeout(hidePreloader, 400);
  } else {
    window.addEventListener('load', function () {
      setTimeout(hidePreloader, 400);
    });
  }


  /* ─────────────────────────────────────────────────
     2. Navigation — scroll state & active link
  ───────────────────────────────────────────────── */
  var header = document.querySelector('.mobile-header');

  function updateNavScroll() {
    if (!header) return;
    if (window.scrollY > 24) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', updateNavScroll, { passive: true });
  updateNavScroll();

  /* Active section highlighting */
  function updateActiveLink() {
    var rawSections = document.querySelectorAll('section[data-nav-id]');
    var sections = [];
    var seen = {};

    rawSections.forEach(function (s) {
      var id = s.getAttribute('data-nav-id');
      if (!seen[id]) {
        seen[id] = true;
        sections.push(s);
      }
    });

    var scrollPos = window.scrollY + 180;
    var active = 'home';

    if ((window.innerHeight + window.scrollY) >= (document.body.offsetHeight - 80)) {
      active = 'contact';
    } else {
      sections.forEach(function (section) {
        var top = section.getBoundingClientRect().top + window.scrollY;
        if (scrollPos >= top) {
          active = section.getAttribute('data-nav-id');
        }
      });
    }

    var sidebarLinks = document.querySelectorAll('.sidebar-nav-item[data-target]');
    var mobileLinks = document.querySelectorAll('.mobile-nav-link[data-target]');

    sidebarLinks.forEach(function (link) {
      link.classList.toggle('active', link.getAttribute('data-target') === active);
    });

    mobileLinks.forEach(function (link) {
      link.classList.toggle('active', link.getAttribute('data-target') === active);
    });
  }

  window.addEventListener('scroll', updateActiveLink, { passive: true });
  window.addEventListener('resize', updateActiveLink, { passive: true });
  updateActiveLink();

  /* Smooth scroll for nav links */
  document.addEventListener('click', function (e) {
    var link = e.target.closest('a[href^="#"]');
    if (!link) return;
    var href = link.getAttribute('href');
    if (!href || href === '#') return;
    var id = href.slice(1);
    var target = document.getElementById(id);
    if (!target) return;
    e.preventDefault();
    var top = target.getBoundingClientRect().top + window.scrollY - 20;
    window.scrollTo({ top: top, behavior: 'smooth' });
    if (history.pushState) {
      history.pushState(null, null, '#' + id);
    }
  });


  /* ─────────────────────────────────────────────────
     3. Mobile Navigation
  ───────────────────────────────────────────────── */
  var hamburger = document.querySelector('.nav-hamburger');
  var mobileNav = document.querySelector('.mobile-nav');
  var mobileOverlay = document.querySelector('.mobile-nav-overlay');

  function openMobileNav() {
    if (!mobileNav) return;
    mobileNav.classList.add('is-open');
    hamburger && hamburger.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }

  function closeMobileNav() {
    if (!mobileNav) return;
    mobileNav.classList.remove('is-open');
    hamburger && hamburger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  if (hamburger) {
    hamburger.addEventListener('click', function () {
      var isOpen = mobileNav && mobileNav.classList.contains('is-open');
      isOpen ? closeMobileNav() : openMobileNav();
    });
  }

  if (mobileOverlay) {
    mobileOverlay.addEventListener('click', closeMobileNav);
  }

  /* Close mobile nav when a link is clicked */
  if (mobileNav) {
    mobileNav.querySelectorAll('.mobile-nav-link').forEach(function (link) {
      link.addEventListener('click', closeMobileNav);
    });
  }

  /* Escape key closes menu */
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeMobileNav();
  });


  /* ─────────────────────────────────────────────────
     4. Scroll-reveal Animations (IntersectionObserver)
  ───────────────────────────────────────────────── */
  if ('IntersectionObserver' in window) {
    var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!prefersReducedMotion) {
      var revealObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            revealObserver.unobserve(entry.target);
          }
        });
      }, {
        rootMargin: '0px 0px -8% 0px',
        threshold: 0.1
      });

      document.querySelectorAll('[data-reveal]').forEach(function (el) {
        revealObserver.observe(el);
      });
    } else {
      /* Immediately show all when motion is reduced */
      document.querySelectorAll('[data-reveal]').forEach(function (el) {
        el.classList.add('is-visible');
      });
    }
  } else {
    /* Fallback: show all */
    document.querySelectorAll('[data-reveal]').forEach(function (el) {
      el.classList.add('is-visible');
    });
  }


  /* ─────────────────────────────────────────────────
     4b. Precision SVG Stroke Drawing Controller
  ───────────────────────────────────────────────── */
  function initSvgStrokeAnimation() {
    var svgPaths = document.querySelectorAll(
      '.bg-outline-svg path, .contact-channel-bg-svg path'
    );

    svgPaths.forEach(function (path) {
      try {
        var length = path.getTotalLength();
        if (length && length > 0) {
          path.style.strokeDasharray = length + ' ' + length;
          path.style.strokeDashoffset = length;
          path.style.transition = 'stroke-dashoffset 2.2s cubic-bezier(0.16, 1, 0.3, 1)';
        }
      } catch (e) {}
    });

    if ('IntersectionObserver' in window) {
      var svgObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            var paths = entry.target.querySelectorAll('path');
            paths.forEach(function (p) {
              p.style.strokeDashoffset = '0';
            });
            entry.target.classList.add('is-drawn');
            svgObserver.unobserve(entry.target);
          }
        });
      }, { rootMargin: '0px 0px -5% 0px', threshold: 0.1 });

      document.querySelectorAll('.bg-outline-svg, .contact-channel-bg-svg, .section-watermark-svg').forEach(function (svg) {
        svgObserver.observe(svg);
      });
    } else {
      svgPaths.forEach(function (path) {
        path.style.strokeDashoffset = '0';
      });
      document.querySelectorAll('.section-watermark-svg').forEach(function (svg) {
        svg.classList.add('is-drawn');
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSvgStrokeAnimation);
  } else {
    initSvgStrokeAnimation();
  }


  /* ─────────────────────────────────────────────────
     5. Contact Form Handling
  ───────────────────────────────────────────────── */
  var contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();

      var submitBtn = contactForm.querySelector('[type="submit"]');
      var successMsg = document.getElementById('form-success');
      var errorMsg   = document.getElementById('form-error');

      /* Reset state */
      if (successMsg) successMsg.hidden = true;
      if (errorMsg)   errorMsg.hidden = true;

      /* Basic validation */
      var name    = contactForm.querySelector('[name="name"]');
      var email   = contactForm.querySelector('[name="email"]');
      var message = contactForm.querySelector('[name="message"]');
      var isValid = true;

      [name, email, message].forEach(function (field) {
        if (field && !field.value.trim()) {
          field.setAttribute('aria-invalid', 'true');
          isValid = false;
        } else if (field) {
          field.removeAttribute('aria-invalid');
        }
      });

      if (email && email.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
        email.setAttribute('aria-invalid', 'true');
        isValid = false;
      }

      if (!isValid) {
        if (errorMsg) errorMsg.hidden = false;
        return;
      }

      /* Submit state */
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.setAttribute('aria-busy', 'true');
      }

      /* 
       * ⚠️ OWNER_ACTION: Replace this section with your actual form submission.
       * Options: Formspree, EmailJS, a backend endpoint, etc.
       * Current: Opens WhatsApp with pre-filled message as fallback.
       */
      var lang = document.documentElement.lang || 'ar';
      var nameVal    = name    ? name.value.trim()    : '';
      var emailVal   = email   ? email.value.trim()   : '';
      var messageVal = message ? message.value.trim() : '';

      var waText = (lang === 'ar')
        ? 'مرحباً، اسمي ' + nameVal + ' (' + emailVal + ') - ' + messageVal
        : 'Hello, my name is ' + nameVal + ' (' + emailVal + ') - ' + messageVal;

      /* ⚠️ OWNER_ACTION: Replace +000000000000 with the real WhatsApp number */
      var waUrl = 'https://wa.me/?text=' + encodeURIComponent(waText);

      /* Show success before opening */
      if (successMsg) successMsg.hidden = false;
      contactForm.reset();

      setTimeout(function () {
        window.open(waUrl, '_blank', 'noopener');
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.removeAttribute('aria-busy');
        }
      }, 600);
    });
  }


  /* ─────────────────────────────────────────────────
     6. Dynamic Copyright Year
  ───────────────────────────────────────────────── */
  document.querySelectorAll('.js-year').forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });


  /* ─────────────────────────────────────────────────
     7. Slick Hero Slider (if present, kept for compat)
  ───────────────────────────────────────────────── */
  if (typeof jQuery !== 'undefined' && typeof jQuery.fn.slick === 'function') {
    jQuery(document).ready(function ($) {
      var $slider = $('.hero-slider');
      if ($slider.length) {
        $slider.slick({
          infinite:     true,
          slidesToShow: 1,
          autoplay:     true,
          autoplaySpeed: 5000,
          fade:         true,
          arrows:       false,
          dots:         true,
          pauseOnHover: false
        });
      }
    });
  }


  /* ─────────────────────────────────────────────────
     8. Theme Controller (Dark ↔ Comfortable Light)
  ───────────────────────────────────────────────── */
  var sunSvg = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>';
  var moonSvg = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>';

  function updateThemeUI(theme) {
    var isLight = theme === 'light';
    document.documentElement.setAttribute('data-theme', theme);

    document.querySelectorAll('[data-action="toggle-theme"]').forEach(function (btn) {
      btn.innerHTML = isLight ? moonSvg : sunSvg;
      var titleText = isLight ? 'التبديل إلى الوضع الليلي' : 'التبديل إلى الوضع النهاري';
      btn.setAttribute('title', titleText);
      btn.setAttribute('aria-label', titleText);
    });

    var fullLogos = document.querySelectorAll('.sidebar-logo-img, .footer-logo-img');
    fullLogos.forEach(function (img) {
      img.src = isLight ? 'assets/images/logos/ionity-logo-full-dark.svg' : 'assets/images/logos/ionity-logo-full.svg';
    });

    var compactLogos = document.querySelectorAll('.mobile-logo-img');
    compactLogos.forEach(function (img) {
      img.src = isLight ? 'assets/images/logos/ion-logo-compact-dark.svg' : 'assets/images/logos/ion-logo-compact.svg';
    });
  }

  function toggleTheme() {
    var current = document.documentElement.getAttribute('data-theme') || 'dark';
    var next = current === 'dark' ? 'light' : 'dark';
    localStorage.setItem('ionity-theme', next);
    updateThemeUI(next);
  }

  document.querySelectorAll('[data-action="toggle-theme"]').forEach(function (btn) {
    btn.addEventListener('click', toggleTheme);
  });

  var initialTheme = localStorage.getItem('ionity-theme') || 'dark';
  updateThemeUI(initialTheme);


  /* ─────────────────────────────────────────────────
     9. Smart Glider Engine — Guided Section Scroll
  ───────────────────────────────────────────────── */
  (function initSmartGlider() {

    /* Bail immediately on touch/reduced-motion devices */
    var isTouch = window.matchMedia('(hover: none) or (pointer: coarse)').matches;
    var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    /* ── Scroll Progress Bar ─────────────────────── */
    var progressFill = document.getElementById('scroll-progress-fill');

    function updateProgressBar() {
      if (!progressFill) return;
      var docH = document.documentElement.scrollHeight - window.innerHeight;
      var pct  = docH > 0 ? (window.scrollY / docH) * 100 : 0;
      progressFill.style.width = Math.min(pct, 100).toFixed(2) + '%';
    }

    window.addEventListener('scroll', updateProgressBar, { passive: true });
    updateProgressBar();

    /* ── On touch/reduced-motion: progress bar only, no glider ── */
    if (isTouch || prefersReducedMotion) return;

    /* ── Build ordered section list ──────────────── */
    /* Include ALL site-sections even those without data-nav-id (process, tech) */
    function getSections() {
      return Array.from(document.querySelectorAll('.site-section'));
    }

    /* ── Determine the section currently most "in view" ──────── */
    function getActiveSectionIndex(sections) {
      var vh   = window.innerHeight;
      var sy   = window.scrollY;
      var best = 0;

      for (var i = 0; i < sections.length; i++) {
        var rect = sections[i].getBoundingClientRect();
        /* Section starts in the top half of viewport → it's the active one */
        if (rect.top <= vh * 0.35) {
          best = i;
        }
      }
      return best;
    }

    /* ── Glide to a section by index ─────────────── */
    var isGliding = false;
    var cooldown  = false;
    var COOLDOWN_MS = 700; /* ms to lock glider after a glide triggers */

    function glideToSection(section) {
      if (!section) return;
      isGliding = true;
      cooldown  = true;

      var targetY = section.getBoundingClientRect().top + window.scrollY;

      /* Subtract mobile header height on small screens */
      if (window.innerWidth <= 991) {
        targetY = Math.max(0, targetY - 64);
      }

      window.scrollTo({ top: targetY, behavior: 'smooth' });

      /* Kick IntersectionObserver re-run for reveals in target section */
      var reveals = section.querySelectorAll('[data-reveal]:not(.is-visible)');
      reveals.forEach(function(el) {
        /* Small delay ensures the scroll lands first */
        setTimeout(function() {
          el.classList.add('is-visible');
        }, 400);
      });

      /* Update nav immediately */
      var navId = section.getAttribute('data-nav-id');
      if (navId) {
        document.querySelectorAll('[data-target]').forEach(function(link) {
          link.classList.toggle('active', link.getAttribute('data-target') === navId);
        });
      }

      /* Unlock after scroll animation completes */
      setTimeout(function() {
        isGliding = false;
      }, 900);

      setTimeout(function() {
        cooldown = false;
      }, COOLDOWN_MS);
    }

    /* ── Tall section boundary helpers ─────────────── */
    function sectionIsScrolledToBottom(section) {
      var rect = section.getBoundingClientRect();
      /* Section bottom is at or above viewport bottom */
      return rect.bottom <= window.innerHeight + 8;
    }

    function sectionIsScrolledToTop(section) {
      var rect = section.getBoundingClientRect();
      /* Section top is at or above the viewport top */
      return rect.top >= -8;
    }

    /* ── Wheel Handler ────────────────────────────── */
    var wheelAccum = 0;
    var WHEEL_THRESHOLD = 60; /* pixels of accumulated delta to trigger glide */

    window.addEventListener('wheel', function(e) {
      if (cooldown || isGliding) {
        /* During glide, consume the event to prevent native scroll override */
        return;
      }

      var sections = getSections();
      if (!sections.length) return;

      var idx     = getActiveSectionIndex(sections);
      var current = sections[idx];

      /* Accumulate deltas to distinguish intentional scroll from micro-nudge */
      wheelAccum += e.deltaY;

      if (Math.abs(wheelAccum) < WHEEL_THRESHOLD) return;

      var direction = wheelAccum > 0 ? 1 : -1;
      wheelAccum = 0; /* reset accumulator */

      if (direction > 0) {
        /* Scrolling DOWN */
        /* If current section hasn't been fully seen yet, let native scroll run */
        if (!sectionIsScrolledToBottom(current)) return;
        /* Otherwise glide to next section */
        var next = sections[idx + 1];
        if (next) {
          e.preventDefault();
          glideToSection(next);
        }
      } else {
        /* Scrolling UP */
        /* If we're not at the top of the current section yet, let native scroll run */
        if (!sectionIsScrolledToTop(current)) return;
        /* Otherwise glide to previous section */
        var prev = sections[idx - 1];
        if (prev) {
          e.preventDefault();
          glideToSection(prev);
        }
      }
    }, { passive: false }); /* Must be non-passive to call preventDefault */

    /* Reset wheel accumulator on scroll pause */
    var wheelResetTimer = null;
    window.addEventListener('wheel', function() {
      clearTimeout(wheelResetTimer);
      wheelResetTimer = setTimeout(function() { wheelAccum = 0; }, 150);
    }, { passive: true });

    /* ── Keyboard Navigation ──────────────────────── */
    document.addEventListener('keydown', function(e) {
      /* Skip if focus is inside a form element */
      var tag = document.activeElement ? document.activeElement.tagName : '';
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;
      if (document.activeElement && document.activeElement.isContentEditable) return;

      if (cooldown || isGliding) return;

      var sections = getSections();
      if (!sections.length) return;
      var idx = getActiveSectionIndex(sections);

      if (e.key === 'ArrowDown' || e.key === 'PageDown') {
        var next = sections[idx + 1];
        if (next) {
          e.preventDefault();
          glideToSection(next);
        }
      } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
        var prev = sections[idx - 1];
        if (prev) {
          e.preventDefault();
          glideToSection(prev);
        }
      } else if (e.key === 'Home') {
        e.preventDefault();
        glideToSection(sections[0]);
      } else if (e.key === 'End') {
        e.preventDefault();
        glideToSection(sections[sections.length - 1]);
      }
    });

  })();


  /* ─────────────────────────────────────────────────
     10. Cookie Consent Controller (Minimalist Toast)
  ───────────────────────────────────────────────── */
  (function initCookieConsent() {
    var toast = document.getElementById('cookie-toast');
    if (!toast) return;

    var STORAGE_KEY = 'ionity-cookie-consent';
    var savedConsent = null;
    try {
      savedConsent = JSON.parse(localStorage.getItem(STORAGE_KEY));
    } catch (e) {}

    /* Show toast if no choice has been saved yet */
    if (!savedConsent) {
      setTimeout(function() {
        toast.hidden = false;
      }, 700);
    }

    function saveConsent(accepted) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify({
          accepted: !!accepted,
          timestamp: Date.now()
        }));
      } catch (e) {}
      toast.hidden = true;
    }

    var acceptBtn = document.getElementById('cookie-accept');
    if (acceptBtn) {
      acceptBtn.addEventListener('click', function() {
        saveConsent(true);
      });
    }

    var rejectBtn = document.getElementById('cookie-reject');
    if (rejectBtn) {
      rejectBtn.addEventListener('click', function() {
        saveConsent(false);
      });
    }
  })();


  /* ─────────────────────────────────────────────────
     11. Services Laser Spine & Synchronized Card Reveal
  ───────────────────────────────────────────────── */
  (function initServicesLaser() {
    var servicesSec = document.getElementById('services');
    if (!servicesSec) return;

    var cards = servicesSec.querySelectorAll('.service-card');
    var beam1 = servicesSec.querySelector('.srv-laser-beam-1');
    var beam2 = servicesSec.querySelector('.srv-laser-beam-2');
    var spark = document.getElementById('srv-photon-spark');

    if (!cards.length || !beam1) return;

    var prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReduced) {
      cards.forEach(function (card) {
        card.classList.add('is-revealed');
      });
      return;
    }

    var totalLength = 3111;
    try {
      totalLength = beam1.getTotalLength() || 3111;
    } catch (e) {}

    var hasTriggered = false;

    /* Prep initial stroke offset so the laser draws forward from 0 */
    beam1.style.animation = 'none';
    beam1.style.strokeDasharray = totalLength + ' ' + totalLength;
    beam1.style.strokeDashoffset = totalLength;

    if (beam2) {
      beam2.style.animation = 'none';
      beam2.style.strokeDasharray = totalLength + ' ' + totalLength;
      beam2.style.strokeDashoffset = totalLength;
    }

    /* Precise path distance checkpoints & active passing zones for each card */
    var checkpoints = [
      { card: cards[0], targetLen: totalLength * 0.19, minP: 0.11, maxP: 0.27, triggered: false },
      { card: cards[1], targetLen: totalLength * 0.39, minP: 0.32, maxP: 0.48, triggered: false },
      { card: cards[2], targetLen: totalLength * 0.65, minP: 0.56, maxP: 0.72, triggered: false },
      { card: cards[3], targetLen: totalLength * 0.86, minP: 0.78, maxP: 0.94, triggered: false }
    ];

    function updatePassingBorders(p1) {
      checkpoints.forEach(function (cp) {
        if (!cp.card) return;
        var isPassing = (p1 >= cp.minP && p1 <= cp.maxP);
        if (isPassing) {
          cp.card.classList.add('is-beam-passing');
        } else {
          cp.card.classList.remove('is-beam-passing');
        }
      });
    }

    function startAmbientBorderSync() {
      var ambientStart = performance.now();
      var period1 = 14000; /* matches srvLaserFlow1 14s */

      function syncLoop(now) {
        if (!servicesSec.classList.contains('is-offscreen')) {
          var elapsed = now - ambientStart;
          var p1 = (elapsed % period1) / period1;
          updatePassingBorders(p1);
        }
        requestAnimationFrame(syncLoop);
      }

      requestAnimationFrame(syncLoop);
    }

    function startLaserSurge() {
      if (hasTriggered) return;
      hasTriggered = true;

      /* 600ms contemplation pause so the user settles on the section first */
      setTimeout(function () {
        var duration = 4800; /* 4.8s calm, contemplative surge */
        var startTime = null;

        if (spark) {
          spark.classList.add('is-active');
        }

        function step(timestamp) {
          if (!startTime) startTime = timestamp;
          var progress = Math.min((timestamp - startTime) / duration, 1);

          /* Gentle sinusoidal ease-in-out (no sudden fast burst at the start) */
          var ease = 0.5 - 0.5 * Math.cos(progress * Math.PI);
          var currentLen = totalLength * ease;
          var currentOffset = totalLength - currentLen;

          /* Draw laser lines smoothly */
          beam1.style.strokeDashoffset = currentOffset;
          if (beam2) {
            beam2.style.strokeDashoffset = Math.max(0, currentOffset + 120);
          }

          /* Move traveling photon spark along SVG curve */
          if (spark) {
            try {
              var pt = beam1.getPointAtLength(currentLen);
              spark.setAttribute('cx', pt.x);
              spark.setAttribute('cy', pt.y);
            } catch (e) {}
          }

          /* Materialize each card calmly as the laser spark enters its zone */
          checkpoints.forEach(function (cp) {
            if (!cp.triggered && ease >= cp.minP) {
              cp.triggered = true;
              if (cp.card) {
                cp.card.classList.add('is-revealed');
              }
            }
          });

          /* Illuminate card border blue ONLY while the beam is actively passing through it */
          updatePassingBorders(ease);

          if (progress < 1) {
            requestAnimationFrame(step);
          } else {
            /* Surge complete: fade out traveling spark & clear initial passing state */
            if (spark) {
              spark.classList.remove('is-active');
            }
            updatePassingBorders(-1);

            /* Ensure all cards are revealed */
            cards.forEach(function (card) {
              card.classList.add('is-revealed');
            });

            /* Hand off seamlessly to continuous ambient wave flow & synced border illumination */
            setTimeout(function () {
              beam1.style.strokeDasharray = '450 1100';
              beam1.style.animation = 'srvLaserFlow1 14s linear infinite';
              if (beam2) {
                beam2.style.strokeDasharray = '450 1100';
                beam2.style.animation = 'srvLaserFlow2 18s linear infinite';
              }
              startAmbientBorderSync();
            }, 400);
          }
        }

        requestAnimationFrame(step);
      }, 600);
    }

    function checkLaser() {
      if (hasTriggered) return;
      var rect = servicesSec.getBoundingClientRect();
      var winH = window.innerHeight || document.documentElement.clientHeight;
      if (rect.top < winH * 0.65 && rect.bottom > 150) {
        startLaserSurge();
      }
    }

    window.addEventListener('scroll', checkLaser, { passive: true });
    window.addEventListener('resize', checkLaser, { passive: true });
    setTimeout(checkLaser, 300);

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting && !hasTriggered) {
          startLaserSurge();
        }
      });
    }, {
      threshold: 0.25,
      rootMargin: '0px 0px -60px 0px'
    });

    observer.observe(servicesSec);
  })();


  /* ─────────────────────────────────────────────────
     12. GPU Performance Optimizer — Pause Offscreen Animations
  ───────────────────────────────────────────────── */
  (function initOffscreenAnimationPause() {
    if (!('IntersectionObserver' in window)) return;
    var animatedSections = document.querySelectorAll('.hero-section, .laser-stats-section, .services-section');
    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.remove('is-offscreen');
        } else {
          entry.target.classList.add('is-offscreen');
        }
      });
    }, { rootMargin: '120px 0px 120px 0px' });

    animatedSections.forEach(function (sec) {
      obs.observe(sec);
    });
  })();


  /* ─────────────────────────────────────────────────
     13. Interactive Product Details Modal Controller
  ───────────────────────────────────────────────── */
  (function initProductDetailsModal() {
    var modal = document.getElementById('product-details-modal');
    if (!modal) return;

    var badgeEl      = document.getElementById('modal-product-badge');
    var titleEl      = document.getElementById('modal-product-title');
    var headlineEl   = document.getElementById('modal-product-headline');
    var tagsEl       = document.getElementById('modal-product-tags');
    var imgEl        = document.getElementById('modal-product-img');
    var mediaWrap    = modal.querySelector('.product-modal-media-wrap');
    var introEl      = document.getElementById('modal-product-intro');
    var sectionsEl   = document.getElementById('modal-product-sections');
    var conclusionEl = document.getElementById('modal-product-conclusion');
    var ctaEl        = document.getElementById('modal-product-cta');

    var currentProductKey = null;
    var lastFocusedElement = null;

    function getLang() {
      return document.documentElement.lang === 'en' ? 'en' : 'ar';
    }

    function renderProductModal(productKey) {
      if (!window.IONITY_PRODUCT_DETAILS) return;
      var lang = getLang();
      var data = window.IONITY_PRODUCT_DETAILS[lang] && window.IONITY_PRODUCT_DETAILS[lang][productKey];
      if (!data) return;

      currentProductKey = productKey;

      if (badgeEl) badgeEl.textContent = data.badge || '';
      if (titleEl) titleEl.textContent = data.title || '';
      if (headlineEl) headlineEl.textContent = data.headline || '';

      if (tagsEl) {
        tagsEl.innerHTML = '';
        if (Array.isArray(data.tags) && data.tags.length) {
          data.tags.forEach(function (tagText) {
            var chip = document.createElement('span');
            chip.className = 'product-modal-tag-chip';
            chip.textContent = tagText;
            tagsEl.appendChild(chip);
          });
          tagsEl.style.display = 'flex';
        } else {
          tagsEl.style.display = 'none';
        }
      }

      if (imgEl) {
        imgEl.src = data.image || '';
        imgEl.alt = data.title || '';
      }

      if (mediaWrap) {
        if (productKey === 'cura') {
          mediaWrap.classList.add('is-contain');
        } else {
          mediaWrap.classList.remove('is-contain');
        }
      }

      if (introEl) introEl.textContent = data.intro || '';

      if (sectionsEl) {
        sectionsEl.innerHTML = '';
        if (Array.isArray(data.sections)) {
          data.sections.forEach(function (sec) {
            var col = document.createElement('div');
            col.className = 'product-pillar-item';
            var h4 = document.createElement('h4');
            h4.className = 'product-pillar-title';
            h4.textContent = sec.title;
            var p = document.createElement('p');
            p.className = 'product-pillar-desc';
            p.textContent = sec.desc;
            col.appendChild(h4);
            col.appendChild(p);
            sectionsEl.appendChild(col);
          });
        }
      }

      if (conclusionEl) conclusionEl.textContent = data.conclusion || '';

      if (ctaEl) {
        ctaEl.textContent = data.ctaText || (lang === 'ar' ? 'تواصل معنا' : 'Contact Us');
        ctaEl.setAttribute('href', data.ctaLink || '#contact');
      }
    }

    function openModal(productKey) {
      lastFocusedElement = document.activeElement;
      renderProductModal(productKey);
      modal.classList.add('is-open');
      modal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';

      var closeBtn = modal.querySelector('.product-modal-close');
      if (closeBtn) closeBtn.focus();
    }

    function closeModal() {
      modal.classList.remove('is-open');
      modal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
      if (lastFocusedElement && typeof lastFocusedElement.focus === 'function') {
        lastFocusedElement.focus();
      }
    }

    /* Open click listeners */
    document.addEventListener('click', function (e) {
      var trigger = e.target.closest('[data-open-modal]');
      if (trigger) {
        e.preventDefault();
        var key = trigger.getAttribute('data-open-modal');
        if (key) openModal(key);
      }
    });

    /* Close click listeners */
    modal.addEventListener('click', function (e) {
      if (e.target.closest('[data-action="close-product-modal"]')) {
        e.preventDefault();
        closeModal();
      }
      /* If clicking CTA button inside modal, close modal to allow smooth scroll to #contact */
      if (e.target.closest('#modal-product-cta')) {
        closeModal();
      }
    });

    /* Close on Escape key */
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && modal.classList.contains('is-open')) {
        closeModal();
      }
    });

    /* Re-render if language toggles */
    document.addEventListener('click', function (e) {
      if (e.target.closest('[data-action="toggle-lang"]') && modal.classList.contains('is-open') && currentProductKey) {
        setTimeout(function () {
          renderProductModal(currentProductKey);
        }, 60);
      }
    });
  })();

})();
