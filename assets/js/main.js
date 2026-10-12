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

    var mouseX = -100, mouseY = -100;
    var ringX = -100, ringY = -100;
    var isVisible = false;

    window.addEventListener('mousemove', function (e) {
      mouseX = e.clientX;
      mouseY = e.clientY;

      if (!isVisible) {
        isVisible = true;
        cursor.classList.add('is-visible');
        ringX = mouseX;
        ringY = mouseY;
      }

      if (dot) {
        dot.style.left = mouseX + 'px';
        dot.style.top = mouseY + 'px';
      }
    }, { passive: true });

    document.addEventListener('mouseleave', function () {
      isVisible = false;
      cursor.classList.remove('is-visible');
    });

    document.addEventListener('mouseenter', function () {
      isVisible = true;
      cursor.classList.add('is-visible');
    });

    function renderCursor() {
      if (isVisible && ring) {
        ringX += (mouseX - ringX) * 0.18;
        ringY += (mouseY - ringY) * 0.18;
        ring.style.left = ringX + 'px';
        ring.style.top = ringY + 'px';
      }
      requestAnimationFrame(renderCursor);
    }
    requestAnimationFrame(renderCursor);

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


})();
