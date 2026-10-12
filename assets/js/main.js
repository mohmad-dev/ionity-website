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
  var sections = document.querySelectorAll('[data-nav-id]');
  var sidebarLinks = document.querySelectorAll('.sidebar-nav-item[data-target]');
  var mobileLinks = document.querySelectorAll('.mobile-nav-link[data-target]');

  function updateActiveLink() {
    var scrollPos = window.scrollY + 120;
    var active = '';

    sections.forEach(function (section) {
      if (section.offsetTop <= scrollPos) {
        active = section.getAttribute('data-nav-id');
      }
    });

    sidebarLinks.forEach(function (link) {
      link.classList.toggle('active', link.getAttribute('data-target') === active);
    });

    mobileLinks.forEach(function (link) {
      link.classList.toggle('active', link.getAttribute('data-target') === active);
    });
  }

  window.addEventListener('scroll', updateActiveLink, { passive: true });
  updateActiveLink();

  /* Smooth scroll for nav links */
  document.addEventListener('click', function (e) {
    var link = e.target.closest('a[href^="#"]');
    if (!link) return;
    var id = link.getAttribute('href').slice(1);
    var target = document.getElementById(id);
    if (!target) return;
    e.preventDefault();
    var top = target.getBoundingClientRect().top + window.scrollY - 30;
    window.scrollTo({ top: top, behavior: 'smooth' });
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

})();
