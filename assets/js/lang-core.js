/**
 * IONITY — Language Core Controller
 * Manages Arabic ↔ English switching for the new site structure.
 * File: assets/js/lang-core.js
 */

(function () {
  'use strict';

  /* ── State ──────────────────────────────────────────── */
  var currentLang = localStorage.getItem('ionity-lang') || 'ar';

  /* ── Helpers ────────────────────────────────────────── */
  function qs(sel, ctx)  { return (ctx || document).querySelector(sel); }
  function qsa(sel, ctx) { return Array.from((ctx || document).querySelectorAll(sel)); }

  /* ── Apply a string key to multiple elements ─────────── */
  function setText(sel, value, ctx) {
    if (!value) return;
    qsa(sel, ctx).forEach(function (el) { el.textContent = value; });
  }

  function setHTML(sel, value, ctx) {
    if (!value) return;
    qsa(sel, ctx).forEach(function (el) { el.innerHTML = value; });
  }

  /* ── Apply language to the full document ────────────── */
  function applyLang(lang) {
    if (!window.IONITY_STRINGS || !window.IONITY_STRINGS[lang]) return;
    var s = window.IONITY_STRINGS[lang];
    var isAr = lang === 'ar';

    /* 1. Document attributes */
    document.documentElement.lang = lang;
    document.documentElement.dir  = isAr ? 'rtl' : 'ltr';
    document.body.classList.toggle('lang-ar', isAr);

    /* 2. Navigation links */
    var navMap = {
      '[data-key="navHome"]':     s.navHome,
      '[data-key="navServices"]': s.navServices,
      '[data-key="navSolutions"]': s.navSolutions,
      '[data-key="navWork"]':     s.navWork,
      '[data-key="navAbout"]':    s.navAbout,
      '[data-key="navContact"]':  s.navContact,
      '[data-key="navCta"]':      s.navCta
    };

    Object.keys(navMap).forEach(function (sel) {
      qsa(sel).forEach(function (el) { el.textContent = navMap[sel]; });
    });

    /* 3. Language toggle buttons & sidebar elements */
    qsa('[data-key="toggleBtn"]').forEach(function (el) {
      el.textContent = s.toggleBtn;
    });
    setText('[data-key="sidebarSub"]', s.sidebarSub);
    setText('[data-key="statusAvailable"]', s.statusAvailable);

    /* 4. Hero section */
    setText('[data-key="heroEyebrow"]', s.heroEyebrow);
    setText('[data-key="heroHeadlineBase"]', s.heroHeadlineBase);
    setText('[data-key="heroHeadlineAccent"]', s.heroHeadlineAccent);
    setText('[data-key="heroBody"]', s.heroBody);
    setText('[data-key="heroCtaPrimary"]', s.heroCtaPrimary);
    setText('[data-key="heroCtaSecondary"]', s.heroCtaSecondary);
    setText('[data-key="heroFloatTag"]', s.heroFloatTag);

    /* 5. Trust stats */
    setText('[data-key="stat1Value"]', s.stat1Value);
    setText('[data-key="stat1Label"]', s.stat1Label);
    setText('[data-key="stat2Value"]', s.stat2Value);
    setText('[data-key="stat2Label"]', s.stat2Label);
    setText('[data-key="stat3Value"]', s.stat3Value);
    setText('[data-key="stat3Label"]', s.stat3Label);

    /* 6. Services section */
    setText('[data-key="servicesLabel"]', s.servicesLabel);
    setText('[data-key="servicesTitle"]', s.servicesTitle);
    setText('[data-key="servicesBody"]', s.servicesBody);
    setText('[data-key="service1Title"]', s.service1Title);
    setText('[data-key="service1Body"]', s.service1Body);
    setText('[data-key="service1Link"]', s.service1Link);
    setText('[data-key="service2Title"]', s.service2Title);
    setText('[data-key="service2Body"]', s.service2Body);
    setText('[data-key="service2Link"]', s.service2Link);
    setText('[data-key="service3Title"]', s.service3Title);
    setText('[data-key="service3Body"]', s.service3Body);
    setText('[data-key="service3Link"]', s.service3Link);
    setText('[data-key="service4Title"]', s.service4Title);
    setText('[data-key="service4Body"]', s.service4Body);
    setText('[data-key="service4Link"]', s.service4Link);

    /* 7. About section */
    setText('[data-key="aboutLabel"]', s.aboutLabel);
    setText('[data-key="aboutTitle"]', s.aboutTitle);
    setText('[data-key="aboutBody"]', s.aboutBody);
    setText('[data-key="diff1Title"]', s.diff1Title);
    setText('[data-key="diff1Desc"]', s.diff1Desc);
    setText('[data-key="diff2Title"]', s.diff2Title);
    setText('[data-key="diff2Desc"]', s.diff2Desc);
    setText('[data-key="diff3Title"]', s.diff3Title);
    setText('[data-key="diff3Desc"]', s.diff3Desc);
    setText('[data-key="diff4Title"]', s.diff4Title);
    setText('[data-key="diff4Desc"]', s.diff4Desc);
    setText('[data-key="aboutNum1Value"]', s.aboutNum1Value);
    setText('[data-key="aboutNum1Label"]', s.aboutNum1Label);
    setText('[data-key="aboutNum2Value"]', s.aboutNum2Value);
    setText('[data-key="aboutNum2Label"]', s.aboutNum2Label);
    setText('[data-key="aboutNum3Value"]', s.aboutNum3Value);
    setText('[data-key="aboutNum3Label"]', s.aboutNum3Label);
    setText('[data-key="aboutNum4Value"]', s.aboutNum4Value);
    setText('[data-key="aboutNum4Label"]', s.aboutNum4Label);

    /* 7b. Team showcase */
    setText('[data-key="teamLabel"]', s.teamLabel);
    setText('[data-key="teamTitle"]', s.teamTitle);
    setText('[data-key="teamDesc"]', s.teamDesc);
    setText('[data-key="memberRole1"]', s.memberRole1);
    setText('[data-key="memberRole2"]', s.memberRole2);
    setText('[data-key="memberRole3"]', s.memberRole3);
    setText('[data-key="memberRole4"]', s.memberRole4);
    setText('[data-key="memberRole5"]', s.memberRole5);

    /* 8. Process section */
    setText('[data-key="processLabel"]', s.processLabel);
    setText('[data-key="processTitle"]', s.processTitle);
    setText('[data-key="processBody"]', s.processBody);
    setText('[data-key="step1Title"]', s.step1Title);
    setText('[data-key="step1Body"]', s.step1Body);
    setText('[data-key="step2Title"]', s.step2Title);
    setText('[data-key="step2Body"]', s.step2Body);
    setText('[data-key="step3Title"]', s.step3Title);
    setText('[data-key="step3Body"]', s.step3Body);
    setText('[data-key="step4Title"]', s.step4Title);
    setText('[data-key="step4Body"]', s.step4Body);

    /* 9. Solutions section */
    setText('[data-key="solutionsLabel"]', s.solutionsLabel);
    setText('[data-key="solutionsTitle"]', s.solutionsTitle);
    setText('[data-key="solutionsBody"]', s.solutionsBody);
    setText('[data-key="solutionsNote"]', s.solutionsNote);
    setText('[data-key="solutionsCta"]', s.solutionsCta);

    /* 10. Tech section */
    setText('[data-key="techLabel"]', s.techLabel);
    setText('[data-key="techTitle"]', s.techTitle);
    setText('[data-key="techBody"]', s.techBody);
    setText('[data-key="techCat1"]', s.techCat1);
    setText('[data-key="techCat2"]', s.techCat2);
    setText('[data-key="techCat3"]', s.techCat3);
    setText('[data-key="techCat4"]', s.techCat4);

    /* 11. CTA section */
    setText('[data-key="ctaLabel"]', s.ctaLabel);
    setText('[data-key="ctaTitle"]', s.ctaTitle);
    setText('[data-key="ctaBody"]', s.ctaBody);
    setText('[data-key="ctaPrimary"]', s.ctaPrimary);
    setText('[data-key="ctaSecondary"]', s.ctaSecondary);
    setText('[data-key="ctaMergedTitle"]', s.ctaMergedTitle);
    setText('[data-key="ctaMergedDesc"]', s.ctaMergedDesc);

    /* 11b. Contact Section (Image 2) */
    setText('[data-key="contactSupportTitle"]', s.contactSupportTitle);
    setText('[data-key="contactDirectTitle"]', s.contactDirectTitle);
    setText('[data-key="contactSupportBtn"]', s.contactSupportBtn);
    setText('[data-key="contactDirectBtn"]', s.contactDirectBtn);
    setText('[data-key="contactFormTitle"]', s.contactFormTitle);
    setText('[data-key="contactFormSubtitle"]', s.contactFormSubtitle);
    setText('[data-key="sendBtn"]', s.sendBtn);

    /* 12. Footer */
    setText('[data-key="footerDesc"]', s.footerDesc);
    setText('[data-key="footerNavTitle"]', s.footerNavTitle);
    setText('[data-key="footerContactTitle"]', s.footerContactTitle);

    /* 13. Copyright (with dynamic year) */
    var year = new Date().getFullYear();
    var copy = s.copyright ? s.copyright.replace('{year}', year) : '';
    setText('[data-key="copyright"]', copy);

    /* 14. Contact form placeholders */
    var namePh    = isAr ? 'الاسم الكامل' : 'Full name';
    var emailPh   = isAr ? 'البريد الإلكتروني' : 'Email address';
    var messagePh = isAr ? 'اكتب رسالتك هنا...' : 'Write your message here...';

    qsa('[name="name"]').forEach(function (el)    { el.placeholder = namePh; });
    qsa('[name="email"]').forEach(function (el)   { el.placeholder = emailPh; });
    qsa('[name="message"]').forEach(function (el) { el.placeholder = messagePh; });

    /* 15. Save preference */
    localStorage.setItem('ionity-lang', lang);
    currentLang = lang;
  }

  /* ── Toggle ─────────────────────────────────────── */
  function toggleLanguage() {
    applyLang(currentLang === 'ar' ? 'en' : 'ar');
  }

  /* ── Bind all toggle buttons ────────────────────── */
  function bindToggleButtons() {
    document.addEventListener('click', function (e) {
      if (e.target.closest('[data-action="toggle-lang"]')) {
        toggleLanguage();
      }
    });
  }

  /* ── Init ───────────────────────────────────────── */
  function init() {
    bindToggleButtons();
    applyLang(currentLang);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
