# Product Showcase Section Specification

## Purpose

Display Apex Motus products as real, usable solutions that enhance business performance.
This section must build credibility and transition the user from "understanding Apex" → "seeing proof".

---

## Section Structure

### Section ID

- id: "products"

### Layout

- Full-width section
- Background: subtle contrast from previous section (e.g. slightly darker or lighter)
- Centered container (max-width: 1200px)
- Vertical spacing: large (padding-top: 80px, padding-bottom: 80px)

---

## Section Header

### Title

- Text: "Our Tools. Your Advantage."

### Subtitle

- Text: "Real systems designed to improve how your business operates, scales, and performs."

### Alignment

- Centered

---

## Product Grid

### Layout

- Grid system:
  - Desktop: 3 columns
  - Tablet: 2 columns
  - Mobile: 1 column

- Gap: 24px–32px

---

## Product Card Component

### Component Name

- ProductCard

### Card Structure

#### 1. Product Name

- Large, bold text

#### 2. Short Description (1–2 lines MAX)

- Must be outcome-driven, not technical

#### 3. CTA Button

- Text: "View Product"
- Opens product in new tab

---

## Products (Initial Data)

### 1. ClinicOS

- Name: "ClinicOS"
- Description: "Streamline patient flow, bookings, and clinic operations with a unified system."
- Links:
  - Main UI: https://clinic-os-ui.vercel.app/c/bahaleng-health-center
  - Portal: https://clinic-os-portal.vercel.app

---

### 2. ScanYa

- Name: "ScanYa"
- Description: "Scan, access, and manage assets instantly using QR-powered workflows."
- Link:
  - https://scanya.vercel.app/

---

### 3. tseboIQ

- Name: "tseboIQ"
- Description: "Unlock talent intelligence and make smarter hiring and workforce decisions."
- Link:
  - https://tseboiq.netlify.app/

---

## Interaction & UX

### Hover Effects

- Card slightly elevates (translateY: -4px to -8px)
- Subtle shadow increase
- CTA button becomes more prominent

### Click Behavior

- Opens product link in new tab (target="\_blank")

---

## Animation (Optional but Recommended)

### On Scroll

- Fade-in + slight upward motion
- Stagger animation between cards (100ms delay per card)

---

## Design Tone

- Clean
- Minimal
- High-end SaaS
- No clutter
- Focus on clarity and outcome

---

## Developer Notes

- Component must be reusable
- Product data should be stored in an array/object for easy scaling
- Avoid hardcoding layout — use responsive utilities (Tailwind recommended)
- Ensure fast load (no heavy images required initially)

---

## Future Enhancements (DO NOT BUILD NOW)

- Add case studies per product
- Add metrics (e.g. "reduced wait time by 40%")
- Add demo video previews
- Add "Book Demo" CTA per product

---

## Positioning Reminder

This section is NOT a portfolio.

It is proof that:

> Apex Motus builds real systems that improve real businesses.

Every element must reinforce that.
