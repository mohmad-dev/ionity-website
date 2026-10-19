# Linear-Inspired Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transform IONITY website into a refined, engineering-first Linear-style experience while strictly preserving the laser beams in Stats and Services, vertical stats (+5, +50, 100%), and background floating SVG patterns.

**Architecture:** Update HTML structure and CSS modules (`tokens.css`, `muffin.css`, `theme-light.css`, `components.css`) to implement quiet developer-aesthetic typography, high-contrast OLED surfaces, and a Linear-style live systems terminal card replacing the spinning orbital visual. Maintain full bilingual dictionary coverage in `lang-data.js`.

**Tech Stack:** Vanilla HTML5, CSS3 Custom Properties (Design Tokens), Vanilla JS (Bilingual & Modal), SVG filters & animations.

## Global Constraints
- Strictly preserve laser beam in Stats (`laser-svg`, `laser-beam-1`, `laser-beam-2`).
- Strictly preserve laser beam & dynamic spark in Services (`srv-laser-track`, `srv-laser-beam`, `srv-photon-spark`).
- Strictly preserve vertical numbers: `+5 سنوات خبرة تقنية`, `+50 مشروع رقمي تم تسليمه`, `100% التزام بالجودة والاستقرار`.
- Strictly preserve background floating SVG particles across all sections.
- Strictly maintain Mohamed's exact title: `كبير مهندسي الأنظمة والذكاء الاصطناعي`.
- Maintain full Arabic (RTL) & English (LTR) language switching with zero missing keys.
- Comply with UI UX Pro Max rules: eliminate continuous decorative rotation, respect prefers-reduced-motion, smooth 180-220ms transitions.

---

### Task 1: Update Design Tokens & Typography Scale
**Files:**
- Modify: `assets/css/tokens.css`

- [ ] **Step 1: Refine font tokens, line-heights, and surface variables in `tokens.css`**
  - Add `--font-mono: 'JetBrains Mono', 'Fira Code', 'Courier New', monospace;`
  - Update `--shadow-card` to subtle Linear 1px border glow.
  - Update `--radius-lg` and `--radius-md` for tighter precision corners.
- [ ] **Step 2: Verify token changes do not break base layout**
  - Check browser rendering via dev server or validation.
- [ ] **Step 3: Commit token updates**
  - `git commit -am "style: update design tokens for Linear-inspired precision and typography"`

---

### Task 2: Language Dictionary Updates for Hero Status Pill & Copy
**Files:**
- Modify: `assets/js/lang-data.js`

- [ ] **Step 1: Add new dictionary keys in `lang-data.js` for Arabic and English**
  - Add `heroStatusPill`: AR: "متاح لمشاريع Q1 / Q2 2026", EN: "Available for Q1 / Q2 Projects"
  - Add `terminalHeaderTitle`: AR: "ionity / production / live-systems", EN: "ionity / production / live-systems"
  - Ensure all other existing product, service, and team keys remain intact.
- [ ] **Step 2: Commit dictionary updates**
  - `git commit -am "feat(i18n): add Linear hero status pill and terminal strings in lang-data"`

---

### Task 3: Hero Section Markup & Linear Terminal Card
**Files:**
- Modify: `index.html:260-340`

- [ ] **Step 1: Replace generic eyebrow with Linear-style status pill**
  - Replace `<p class="hero-eyebrow">` with `<div class="hero-status-pill"><span class="status-indicator-dot"></span><span data-key="heroStatusPill">متاح لمشاريع Q1 / Q2 2026</span></div>`.
- [ ] **Step 2: Replace orbital visual with `.hero-terminal-card`**
  - Replace `.hero-ionic-visual` (atomic rings, HUD cards) with `.hero-terminal-card` featuring:
    - Chrome bar with 3 dots and breadcrumb `ionity / us-east / production`.
    - Real-time service status outputs for `excellence-crm`, `qura-health`, `acer-security`.
    - Live metrics line: `uptime 99.98% · latency 1.4ms · edge deployed`.
- [ ] **Step 3: Commit Hero markup changes**
  - `git commit -am "feat(hero): replace orbital visual with Linear-style engineering terminal card"`

---

### Task 4: CSS Implementation for Hero Terminal Card & Linear Polish
**Files:**
- Modify: `assets/css/muffin.css`
- Modify: `assets/css/theme-light.css`

- [ ] **Step 1: Remove obsolete orbital keyframes and add `.hero-terminal-card` in `muffin.css`**
  - Add styles for `.hero-status-pill`, `.hero-terminal-card`, `.terminal-chrome`, `.terminal-content`, `.terminal-line`.
  - Add subtle Linear border highlight and monospace formatting.
- [ ] **Step 2: Add light mode overrides in `theme-light.css`**
  - Ensure `.hero-terminal-card` has a clean paper-canvas border and readable contrasting text in light theme.
- [ ] **Step 3: Commit CSS changes**
  - `git commit -am "style(hero): implement Linear terminal card styles with light/dark theme support"`

---

### Task 5: Refine Services, Products, and Team Showcase Styling
**Files:**
- Modify: `assets/css/muffin.css`
- Modify: `assets/css/components.css`

- [ ] **Step 1: Clean up card animations and remove heavy hover-lifts**
  - Set smooth 200ms ease transitions per UI UX Pro Max.
  - Remove excessive radial glow on team avatars; apply clean subtle 1px accent border.
- [ ] **Step 2: Confirm laser beams and background SVG particles are preserved intact**
  - Verify `.laser-stats-section` and `.services-laser-bg` are unmodified and visually verified.
- [ ] **Step 3: Commit styling polish**
  - `git commit -am "style: polish services, products, and team cards to Linear design standards"`

---

### Task 6: Visual Testing, Bilingual Verification & Final Push
**Files:**
- Test: `index.html`, `privacy.html`, `terms.html`

- [ ] **Step 1: Start local server and test via Chrome DevTools MCP**
  - Verify Hero, Stats, Services, Products, and Team in Dark mode.
  - Toggle to Light mode and verify contrast.
  - Toggle to English (EN) and verify LTR layout and translation.
- [ ] **Step 2: Commit any visual bugfixes**
- [ ] **Step 3: Push to GitHub Pages (`origin/main`)**
  - `git push origin main`
- [ ] **Step 4: Confirm GitHub Pages live deployment**
