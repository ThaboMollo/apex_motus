# Teardown and Theme Retention Plan

## Goal

Delete/replace current website implementation while preserving only reusable theming assets and brand identity.

## 1) Keep List (Theme + Brand Only)

Keep and refactor as needed:

- Tailwind color/font tokens from `tailwind.config.js`.
- CSS variables and global theme primitives from `src/app/globals.css` (cleaned).
- Brand assets in `public/`:
  - `apex_motus_logo*.png`
  - `apex_motus_logo_svg.svg`
  - `apex_motus_icon*.png`
  - `apex_motus_icon.ico`

## 2) Replace List (Legacy App Structure)

Remove or fully replace:

- Existing pages and route content not in the new spec:
  - `src/app/contact/page.tsx`
  - `src/app/portfolio/page.tsx`
  - `src/app/privacy/page.tsx`
  - `src/app/services/page.tsx`
  - `src/app/subsidiary-tseboiq/page.tsx`
  - `src/app/terms/page.tsx`
- Existing content components tied to old narrative:
  - `src/components/Hero.tsx`
  - `src/components/ContactForm.tsx`
  - `src/components/SectionCard.tsx`
  - `src/components/Navbar.tsx`
  - `src/components/Footer.tsx` (unless repurposed minimally)

## 3) New Target Structure

Proposed minimal structure after reset:

- `src/app/layout.tsx` (new shell + metadata)
- `src/app/page.tsx` (single landing page)
- `src/app/globals.css` (theme primitives + global base styles)
- `src/app/api/insights/route.ts` (OpenAI)
- `src/app/api/lead/route.ts` (Resend)
- `src/components/sections/HeroFlow.tsx`
- `src/components/sections/AboutSection.tsx`
- `src/components/sections/ProductShowcase.tsx`
- `src/components/sections/ContactSection.tsx`
- `src/lib/theme.ts` (optional token export)
- `src/lib/validation.ts`
- `src/lib/env.ts`
- `src/lib/products.ts` (URLs to populate showcase)

## 4) Theming Extraction Tasks

1. Normalize palette names and usage:
   - Keep `navy`, `ink`, `royal`, `plum`, `cyan`, `gold`, `slate`, `silver`.
2. Keep typography:
   - `Space Grotesk` for headings, `Inter` for body.
3. Remove legacy utility styles not needed by the rebuilt UX.
4. Standardize spacing, radius, focus ring, and shadow tokens.
5. Ensure dark/light behavior is intentional (or lock to one mode if required).

## 5) Deletion Strategy (Safe Execution)

1. Capture current keep-list assets/tokens first.
2. Replace route tree with the new single-page structure.
3. Remove unused components and types.
4. Run typecheck/build and remove dead imports.
5. Verify no references remain to deleted routes/components.

## 6) Exit Criteria for Teardown Phase

- No legacy sections/pages from old site remain in active navigation or route tree.
- Only approved theming/brand artifacts are retained.
- Project compiles with a minimal landing page skeleton before feature build continues.
