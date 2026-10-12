# Continuous Ionic Laser Spine & Fluid Minimalism Design Spec

## 1. Overview & Goals
Transform the IONITY website into a fluid, cohesive, award-winning experience by:
1. Removing all harsh horizontal section divider lines (`border-top`, `border-bottom`) across the entire site to create a seamless infinite canvas.
2. Removing the obsolete `#tech` ("أدواتنا وتقنياتنا") section.
3. Simplifying the Cookie Consent UI into an ultra-minimal floating toast popup at the bottom of the viewport with a single sentence and two compact buttons `[موافق]` and `[رفض]`.
4. Integrating the **Ionic Energy Laser Spine** through the `#services` section, with a continuous cyan & electric blue beam weaving behind the 4 service cards in an S-curve, sequentially illuminating each card (01 → 02 → 03 → 04) as the laser passes it.
5. Elevating the service cards into luxury dark glassmorphism cards with modern tech badges `[01 // WEB]`, `[02 // CUSTOM]`, etc. and eye-friendly, calm ambient neon responsiveness.

---

## 2. Component Specifications

### 2.1 Section Divider Removal
- Remove `border-top` and `border-bottom` on:
  - `.hero-section`
  - `.services-section`
  - `.solutions-section`
  - `.about-section`
  - `.laser-stats-section`
  - `.contact-section-wrapper`
- Result: Background transitions fluidly from section to section without visual cuts.

### 2.2 Technology Section Removal
- Remove `<section id="tech"...>` from `index.html`.
- Remove from Glider section array if referenced by ID.

### 2.3 Minimal Cookie Toast
- HTML:
  ```html
  <div id="cookie-toast" class="cookie-toast" role="dialog" aria-label="ملفات تعريف الارتباط" hidden>
    <div class="cookie-toast-text">
      <span class="cookie-emoji" aria-hidden="true">🍪</span>
      <span>نستخدم ملفات تعريف الارتباط لتحسين تجربة التصفح.</span>
      <a href="privacy.html" class="cookie-link">الخصوصية</a>
    </div>
    <div class="cookie-toast-actions">
      <button class="cookie-btn cookie-btn-accept" id="cookie-accept" type="button">موافق</button>
      <button class="cookie-btn cookie-btn-reject" id="cookie-reject" type="button">رفض</button>
    </div>
  </div>
  ```
- CSS:
  - Fixed at bottom-end corner (bottom: 24px, right/left: 24px) or bottom-center.
  - Dark glass surface: `background: rgba(14, 18, 14, 0.94)`, `backdrop-filter: blur(12px)`.
  - Border: `1px solid var(--color-border)`.
  - Light mode: `background: rgba(255, 255, 255, 0.96)`, `border-color: #DFE4DA`.

### 2.4 Laser Services Grid & Sequential Reveal
- SVG Laser Track inside `#services`:
  - `viewBox="0 0 1400 900"`, `preserveAspectRatio="none"`.
  - Path weaved specifically behind the 4 cards:
    - Starts top-right (from stats / hero direction).
    - Loops around Card 1 (top-right card in RTL).
    - Swings across the center to Card 2 (top-left card in RTL).
    - Drops down and swings to Card 3 (bottom-right card in RTL).
    - Loops through Card 4 (bottom-left card in RTL) and exits downward towards `#solutions`.
  - Two beam layers:
    - Cyan primary beam with `#laser-glow-cyan` filter.
    - Electric blue secondary beam with `#laser-glow-blue` filter.
- Card Design (`.service-card`):
  - Ultra-refined dark glass surface.
  - Number badge: `01 // WEB`, `02 // SYSTEMS`, `03 // SAAS`, `04 // UI/UX`.
  - Interactive `.is-active` state:
    - Glowing cyan/green border.
    - Subtle ambient box shadow.
    - Icon glow.
- Sequential Animation Trigger:
  - `IntersectionObserver` detects `#services` entering viewport.
  - Animates beam `stroke-dashoffset`.
  - Staggered timers trigger `.is-active` on Card 1 (0ms), Card 2 (600ms), Card 3 (1200ms), Card 4 (1800ms).
  - Hovering any card gives immediate active highlight.

---

## 3. Accessibility & Responsive
- Respects `prefers-reduced-motion: reduce`: animation is disabled, all cards appear visible by default without laser delay.
- Mobile screens (≤ 991px):
  - Laser scales smoothly or hides gracefully if cramped, cards stack in a single column with simple stagger reveal.
  - Cookie toast stays compact at the bottom without obscuring mobile nav bar.
