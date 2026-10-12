# IONITY Impressive Scroll & Guided Navigation — Design Spec

**Date:** 2026-10-12  
**Status:** Approved  
**Author:** IONITY Design & Architecture Team  

---

## 1. Executive Summary

This specification outlines the architecture, interaction models, and technical implementation for an **Impressive Guided Scroll Experience** across the IONITY website.

The goal is to provide a premium, directional, and cinematic scrolling experience where the user feels guided through the website's narrative beats (Hero -> Services -> Solutions -> Process -> Studio/Team -> Tech -> Contact), while avoiding the pitfalls of rigid scroll-jacking.

---

## 2. Goals & Success Criteria

1. **Guided Impression:** Controlled, smooth wheel and touch transitions that magnetically guide the viewport to the start of each story beat.
2. **Tall Section Immunity:** Sections exceeding the viewport height (e.g. Services, About with 5-member team) must remain fully scrollable inside their boundary without clipping, trapping, or skipping content.
3. **Hardware-Accelerated & Fluid:** 60-120fps performance utilizing native CSS scroll snap as the foundational baseline and lightweight JavaScript inertia guiding for wheel events.
4. **Mobile & Touch Friendly:** Natural touch gestures preserved on mobile devices with CSS snap points ensuring clean landing stops without fighting user fingers.
5. **Sidebar Synchronization:** Seamless synchronization with the desktop lateral navigation and mobile navigation bars.
6. **Accessibility & Reduced Motion:** Full compliance with `prefers-reduced-motion: reduce` and keyboard navigation support (`ArrowUp`, `ArrowDown`, `PageUp`, `PageDown`, `Home`, `End`).

---

## 3. Architecture & Components

### 3.1 CSS Foundation (`assets/css/muffin.css`)
- **Container Setup:**
  ```css
  html {
    scroll-behavior: smooth;
    scroll-snap-type: y proximity;
  }
  ```
  `proximity` is selected over `mandatory` because it allows gentle resting positions within tall sections without forcing abrupt jumps, while still snapping neatly when arriving near section edges.

- **Section Snap Alignment:**
  Key story sections (`#home`, `#services`, `#solutions`, `#process`, `#about`, `#tech`, `#cta`, `#contact`):
  ```css
  section[id],
  .hero-section,
  .site-section {
    scroll-snap-align: start;
    scroll-snap-stop: normal;
    scroll-margin-top: clamp(1rem, 3vw, 2.5rem);
  }
  ```

- **Reduced Motion Fallback:**
  ```css
  @media (prefers-reduced-motion: reduce) {
    html {
      scroll-behavior: auto;
      scroll-snap-type: none;
    }
  }
  ```

### 3.2 Smart Glider Engine (`assets/js/main.js`)
- **Wheel Intent Detection:**
  - Detects vertical scroll wheel events (`wheel` event with `deltaY`).
  - Threshold: requires a minimum delta (`Math.abs(e.deltaY) > 20`) to filter accidental micro-movements.
  - Cooldown: ~650ms debounce/lockout after triggering a guided glide to prevent chaotic multi-section leaping.

- **Boundary Awareness for Tall Sections:**
  - Before gliding to the next section, checks if the current section's bottom is still below the viewport. If so, allows natural interior scrolling until the bottom threshold is reached.
  - Before gliding to the previous section, checks if the current section's top is scrolled above the viewport. If so, allows natural interior scrolling up until the section top is reached.

- **Keyboard Navigation Integration:**
  - Binds `ArrowDown`, `ArrowUp`, `PageDown`, `PageUp` to trigger the same smooth guided section transition.
  - Skips interception if focus is inside an input, textarea, or selectable element.

- **Navigation Synchronization:**
  - Immediately updates the active sidebar item and URL hash without page reload or jump.

---

## 4. Edge Cases & Error Handling

1. **User manual scrollbar dragging:**
   The glider engine only intercepts mouse `wheel` and directional keyboard events; clicking and dragging the browser scrollbar or mini-map remains 100% native and unrestricted.
2. **Trackpad momentum:**
   Trackpads generate long momentum event tails; the cooldown timer (650ms) plus delta threshold prevents repeated unintended section jumps.
3. **Form input interaction:**
   All wheel and key events ignore inputs, textareas, and interactive buttons so users filling the contact form are never scrolled away.

---

## 5. Verification & Testing Plan

1. **Desktop Chrome / Edge verification:**
   - Wheel scrolling from Hero downwards -> glides smoothly to Services, Solutions, Process, About, Tech, Contact.
   - Inside About (5 team members) -> smooth interior scrolling, does not jump until bottom/top is reached.
2. **Keyboard verification:**
   - Pressing `ArrowDown` steps down section by section.
   - Pressing `ArrowUp` steps up section by section.
3. **Mobile Responsive verification:**
   - Touch scrolling works smoothly with native touch deceleration.
   - Sidebar nav and active indicators update accurately.
