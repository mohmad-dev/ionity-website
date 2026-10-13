# Design Spec: IONITY Products & Systems Showcase (Excellence CRM, ACER, Cura)

**Date**: 2026-10-13  
**Status**: Approved by User  
**Author**: Antigravity & User Collaboration  

---

## 1. Executive Summary & Goals

Transform IONITY's current prototype solutions section (`#solutions`) into a real showcase of 3 flagship products:
1. **Excellence CRM** (`نظام إكسلنس لإدارة الأعمال`): Commercial ERP & CRM for sales, billing, inventory, purchasing, receivables, and operational performance.
2. **ACER** (`Autonomous Cybersecurity & Exploitation Reasoning`): AI-driven cybersecurity research and pentesting reasoning system designed for local / controlled deployments.
3. **Cura** (`منصة كورا للحلول الطبية`): Healthcare SaaS platform organizing clinic and medical center operations, patient records, appointments, and role-based access.

The design features:
- **Card Experience in Main Page**: Modern, high-conversion cards with real image assets, exact professional copywriting, concise feature highlights, and distinct action buttons.
- **Interactive Details Modal**: A smooth, lightweight glassmorphic popup displaying the comprehensive breakdown and sections for each product without leaving or cluttering the main page.
- **Bilingual Support**: Full Arabic and English translations in `lang-data.js`.
- **Editorial Compliance**: 100% adherence to realistic claims, no inflated guarantees ("zero false positives", "100% tamper-proof", etc.), clean terminology, and consistent CTAs.

---

## 2. Asset Management

Save user-uploaded assets with proper naming and optimized dimensions:
- `assets/images/products/excellence-crm.png` (from `media_1791911212909_185c841f.png`)
- `assets/images/products/acer-cybersecurity.jpg` (from `media_1791911350209_d076c009.jpg`)
- `assets/images/products/cura-health.png` (from `media_1791911564060_95675372.png`)

---

## 3. Architecture & Components

### 3.1. Main Page Grid (`#solutions` in `index.html`)
The section header will be updated:
- Label: `منتجاتنا وأنظمتنا` / `Our Products & Systems`
- Title: `أنظمة مصممة لواقع الأعمال والتحديات التقنية` / `Systems Built for Real Business & Technical Challenges`
- Body: `حلول برمجية متخصصة تم بناؤها بمعمارية رصينة لتنظيم العمليات، تعزيز الأمان، وتطوير الخدمات.` / `Specialized software solutions engineered to organize operations, bolster security, and streamline workflows.`

Three cards in `.solutions-grid`:
- **Card 1: Excellence CRM**
  - Category: `إدارة الأعمال · CRM & ERP`
  - Name: `Excellence CRM`
  - Arabic Subtitle: `نظام إكسلنس لإدارة الأعمال`
  - Description: `منصة لإدارة المبيعات والعملاء والمخزون والمشتريات والحسابات في مكان واحد، مع متابعة الفواتير والمديونيات وحركة المنتجات من خلال لوحة تحكم موحّدة.`
  - Highlights:
    - `إدارة المبيعات والفواتير`
    - `العملاء والمديونيات`
    - `المخزون والمشتريات`
    - `الحسابات والتقارير`
  - CTAs: `استكشف النظام` (`data-modal="excellence"`) & `اطلب عرضًا تجريبيًا` (`href="#contact"`)
- **Card 2: ACER**
  - Category: `الأمن السيبراني · AI Security`
  - Name: `ACER`
  - Subtitle: `Autonomous Cybersecurity & Exploitation Reasoning` / `تحليل أمني أعمق، مع تحكم أكبر في بيئتك.`
  - Description: `مشروع للأمن السيبراني يعتمد على الذكاء الاصطناعي لدعم اختبار الاختراق وتحليل النتائج والتحقق من الثغرات، مع تصميم يستهدف التشغيل المحلي والبيئات التي تتطلب قيودًا صارمة على انتقال البيانات.`
  - Highlights:
    - `تشغيل محلي عند توافر متطلباته`
    - `تحليل سياق التطبيق ومنطق الأعمال`
    - `التحقق من النتائج بأدلة قابلة للمراجعة`
    - `تقارير فنية وتوصيات للمعالجة`
  - CTAs: `استكشف قدرات ACER` (`data-modal="acer"`) & `ناقش متطلباتك الأمنية` (`href="#contact"`)
- **Card 3: Cura**
  - Category: `الحلول الطبية · Healthcare SaaS`
  - Name: `Cura`
  - Subtitle: `إدارة أكثر تنظيمًا للعيادات والمراكز الطبية.`
  - Description: `منصة لإدارة العمليات اليومية للمنشآت الطبية، مع تنظيم بيانات العيادات والمرضى والمواعيد وتدفقات العمل وفق احتياجات المنشأة.`
  - Highlights:
    - `إدارة العيادات والأطباء`
    - `ملفات المرضى والسجلات الطبية`
    - `تنظيم المواعيد وتدفقات العمل`
    - `صلاحيات منفصلة حسب الدور`
  - CTAs: `استكشف المنصة` (`data-modal="cura"`) & `ناقش احتياجات منشأتك` (`href="#contact"`)

### 3.2. Product Details Modal Component
A single shared, accessible modal overlay (`#product-details-modal`):
- HTML Structure:
  - `.product-modal-backdrop`
  - `.product-modal-dialog`
    - `.product-modal-header`: Category chip, Product Name, Subtitle, Close Button (`aria-label="Close"`).
    - `.product-modal-body`:
      - Product Banner / Showcase Image.
      - Product Lead / Intro block.
      - Product Feature Pillars (Cards / Accordions with clean icons).
      - Conclusion block.
    - `.product-modal-footer`:
      - Dynamic Action CTA (`اطلب عرضًا تجريبيًا` / `ناقش متطلباتك الأمنية` / `ناقش احتياجات منشأتك`).
- Keyboard & Accessibility:
  - Closes on `Escape` key press.
  - Closes on clicking outside modal dialog (backdrop click).
  - Traps focus while open and restores focus to triggering button upon close.
  - Body scroll lock (`overflow: hidden`) when modal is active.

### 3.3. Localization (`assets/js/lang-data.js`)
- Structured JSON dictionary for all strings in Arabic and English.
- `IONITY_STRINGS.ar` and `IONITY_STRINGS.en` updated with keys for:
  - Section titles, labels, card summaries.
  - Full modal titles, introductions, pillars, and buttons for all three products.

---

## 4. Visual & UI Guidelines
- Dark, clean aesthetic matching IONITY design language (`--color-surface`, `--color-accent` neon-tint highlights).
- High visual readability, elegant badge chips, subtle glow borders on hover.
- Modal scrollable with custom slim scrollbar, responsive padding for mobile viewports (< 768px).

---

## 5. Verification Plan
1. **Asset Integrity**: Ensure images load properly with no broken paths.
2. **Modal Interaction**:
   - Click "استكشف النظام" on Excellence -> Opens Excellence details modal.
   - Click "استكشف قدرات ACER" on ACER -> Opens ACER details modal.
   - Click "استكشف المنصة" on Cura -> Opens Cura details modal.
   - Test close button, backdrop click, and `Escape` key.
3. **Responsive Testing**: Verify on mobile (375px), tablet (768px), and desktop (1280px).
4. **Bilingual Switcher**: Verify that switching language to English translates cards and modal contents seamlessly.
5. **Git Commit & Push**: Commit all files with clean commit messages.
