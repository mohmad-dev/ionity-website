# Products & Systems Showcase Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transform the prototype `#solutions` section into a real showcase of IONITY's 3 flagship products (Excellence CRM, ACER, and Cura) with real image assets, exact editorial copywriting, and an interactive details modal.

**Architecture:** Client-side HTML5/CSS3/Vanilla JS implementation. Product cards in `.solutions-grid` with dynamic triggers opening a shared accessible glassmorphic modal (`#product-details-modal`). Bilingual Arabic/English content stored in `assets/js/lang-data.js` and hydrated via `data-key` and modal data lookup.

**Tech Stack:** HTML5, CSS3 (CSS Variables, Flexbox/Grid, Backdrop Filter), Vanilla JavaScript (ES6+), Git.

## Global Constraints
- Strictly adhere to user-approved copywriting and editorial guidelines:
  - Excellence CRM buttons: `استكشف النظام` / `اطلب عرضًا تجريبيًا`
  - ACER buttons: `استكشف قدرات ACER` / `ناقش متطلباتك الأمنية`
  - Cura buttons: `استكشف المنصة` / `ناقش احتياجات منشأتك`
- No exaggerated guarantees or unsupported buzzwords (no "zero false positives" guarantee, no unverified compliance badges, no internal technical jargon like "bcmath" on external cards).
- All changes must be fully responsive and support Arabic (RTL) and English (LTR).

---

### Task 1: Asset Preparation & Storage

**Files:**
- Create: `assets/images/products/excellence-crm.png`
- Create: `assets/images/products/acer-cybersecurity.jpg`
- Create: `assets/images/products/cura-health.png`

**Interfaces:**
- Consumes: User-uploaded images in `.user_uploaded/`
- Produces: Web-accessible images referenced by `<img src="assets/images/products/...">`

- [ ] **Step 1: Create directory `assets/images/products` if it doesn't exist**
- [ ] **Step 2: Copy image files to target destinations**
- [ ] **Step 3: Verify all 3 files exist and have valid file sizes (> 10KB)**
- [ ] **Step 4: Commit assets to git**

---

### Task 2: Localization Strings in `assets/js/lang-data.js`

**Files:**
- Modify: `assets/js/lang-data.js`

**Interfaces:**
- Consumes: Approved text from design spec `docs/superpowers/specs/2026-10-13-products-showcase-design.md`
- Produces: `window.IONITY_STRINGS.ar` and `window.IONITY_STRINGS.en` updated with keys for cards, highlights, and modal detail objects.

- [ ] **Step 1: Add Arabic strings (`IONITY_STRINGS.ar`) for section headers, cards, and modal content**
- [ ] **Step 2: Add matching English strings (`IONITY_STRINGS.en`) for section headers, cards, and modal content**
- [ ] **Step 3: Validate JavaScript syntax by running node check or browser evaluation**
- [ ] **Step 4: Commit changes to git**

---

### Task 3: Product Cards Structure in `index.html`

**Files:**
- Modify: `index.html:612-774`

**Interfaces:**
- Consumes: Product image assets from Task 1, language keys from Task 2
- Produces: Modern `.product-card` markup replacing dummy SVG prototypes, with `data-open-modal="excellence"`, `data-open-modal="acer"`, `data-open-modal="cura"` triggers.

- [ ] **Step 1: Replace dummy SVG solutions cards with Excellence CRM, ACER, and Cura cards**
- [ ] **Step 2: Ensure correct `data-key` attributes on titles, descriptions, categories, chips, and buttons**
- [ ] **Step 3: Verify HTML validation and closing tags**
- [ ] **Step 4: Commit changes to git**

---

### Task 4: Interactive Modal Markup, CSS Styles & JavaScript Logic

**Files:**
- Modify: `index.html` (modal container before `</body>`)
- Modify: `assets/css/muffin.css` (product cards & modal styles)
- Modify: `assets/js/main.js` (modal open/close logic, accessibility, data rendering)

**Interfaces:**
- Consumes: Click events on `[data-open-modal]`, strings from `window.IONITY_STRINGS`
- Produces: Accessible modal dialog with focus trapping, `Escape` key close, backdrop blur, scroll locking, and smooth entrance animation.

- [ ] **Step 1: Add modal markup in `index.html` with accessibility attributes (`role="dialog"`, `aria-modal="true"`)**
- [ ] **Step 2: Add CSS rules for `.product-card`, image badges, tags, and `.product-modal` in `assets/css/muffin.css`**
- [ ] **Step 3: Implement modal controller in `assets/js/main.js` with active language awareness**
- [ ] **Step 4: Commit changes to git**

---

### Task 5: End-to-End Verification, Browser Testing & Git Push

**Files:**
- Test: `index.html` on local development server `http://localhost:8000`

- [ ] **Step 1: Ensure background dev server is running on port 8000**
- [ ] **Step 2: Open browser or curl to test page loading and check console errors**
- [ ] **Step 3: Test modal opening and closing for all 3 products**
- [ ] **Step 4: Test Arabic/English language switching for products and modal**
- [ ] **Step 5: Capture visual verification screenshots**
- [ ] **Step 6: Push all commits to `origin main`**
