# Apex Motus — Website Rebuild · Prompt 01 Plan

Status: implemented on `dev`. This document records the plan that the build followed and the decisions still open.

## 1. Inputs inspected

| Source | Finding |
|---|---|
| Supplied brand boards (10 images) | Wordmark, PX monogram, palette, type system, logo usage rules, pillars, website direction, stationery. Boards are **visual references**; only images 1 and 2 are logo artwork. |
| Logo files | Raster only (PNG on a ~#FBFBFB canvas, 1145×1374). **No vector or transparent masters were supplied.** |
| Live site (apexmotus.co.za) | Describes itself as a growth advisory firm / holding company. Lists ClinicOS, ScanYa, tseboIQ. Only public contact: `apex.motus.inc@gmail.com`. No phone, address, leadership or legal pages. |
| Nental proposal + plan preview | Confirms Apex Motus builds working operational products; copy and front-end direction owned by Nental. No client names or outcomes disclosed. |
| ClinicOS build spec (`02_Research`) | MVP modules: scheduling, patient records, billing. Single pilot clinic. |
| Product URLs | `scanya.vercel.app` renders only the title "scanYa". `clinic-os-ui…/c/bahaleng-health-center` returned 404 to a server fetch. `tseboiq` returns only a `<title>`. **No product claim beyond the live-site one-liners could be verified.** |

## 2. Asset preparation (safe process)

Logos were **not redrawn or re-set in a font**. Process (`scripts/prepare-logos.py`):
1. Take the supplied raster; treat luminance as an alpha mask (background → transparent).
2. Crop to the ink bounding box (6 px pad), upscale the mask 3× (Lanczos), apply a smoothstep edge re-sharpen to remove canvas grain.
3. Fill with exact brand colours: Charcoal `#0B0B0B` (primary) and Off-white `#F5F5ED` (inverse, for dark backgrounds — the inverted version shown on the logo-usage board).

Geometry, proportions and spacing are untouched. **Request to client: vector (SVG/AI/PDF) masters** to replace these before launch.

## 3. Architecture

- Next.js App Router, TypeScript, Tailwind v4 (`@theme` tokens in CSS), Radix Dialog (mobile menu), Lucide icons.
- Server components by default. Client components only where interaction needs them: `Header` (scroll state), `MobileMenu` (Radix dialog), `MethodologyExplorer`, `Reveal` (IntersectionObserver).
- No animation library: CSS transitions/keyframes cover every motion need. (Motion for React can be added in later prompts if choreography grows.)
- All page copy and routes live in `src/content/site.ts` so later prompts extend data, not markup.
- Routes not yet built exist as honest "planned" pages (`PlannedPage`), never dead links.

## 4. Design tokens

| Token | Value | Use |
|---|---|---|
| `paper` | `#F5F5ED` | Canvas (≈60%) |
| `ink` | `#0B0B0B` | Text, structure (≈25%) |
| `grey` | `#C6C6C6` | Rules, surfaces, supporting graphics (≈10%) — **never body text** (fails contrast) |
| `lime` | `#E6FF19` | Actions + emphasis (≈5%) — **never text on paper**, always a fill with ink text |
| `ink-soft` | `#4F4F4A` | Secondary text (≥7:1 on paper) |

Type: Manrope (display, tracking −0.04em), Inter (UI/body), IBM Plex Mono (labels, indices). Fluid scale via `clamp()`: display, h2, h3, lead, body, small, mono-label.

## 5. Homepage content map

01 Navigation · 02 Hero · 03 Problem · 04 Solution pathways · 05 Methodology (interactive) · 06 Technology & Products · 07 Proof & credibility · 08 Brand philosophy · 09 Final conversion · 10 Footer.

## 6. Motion approach

Load: hero copy rises in (≤ 600 ms total), hero graphic draws once. Scroll: single reveal per block, staggered 60 ms. Interaction: methodology marker travels between stages; philosophy capsules fill on reveal. All motion disabled under `prefers-reduced-motion`. No parallax, no scroll hijack, no looping decoration.

## 7. Responsive strategy

Mobile-first. Hero stacks (copy, CTA, then graphic capped in height). Problem diagram sits above the list. Solutions: 1 → 2 → 4 columns. Methodology: vertical rail on mobile, horizontal track on desktop. Validated at 375, 768, 1440 plus intermediate widths.

## 8. Open decisions / awaiting approval

1. Vector logo masters.
2. Confirm the four solution pathways against company materials (live site currently shows Tools / Restructuring / Hands-on Guidance).
3. tseboIQ: on the live site but not in the Prompt 01 brief — present in data (`published: false`), hidden.
4. Product detail copy beyond the live-site one-liners; product URLs (ScanYa/ClinicOS demos are stubs/404 from a server fetch).
5. Approved case studies, testimonials, leadership credentials (none supplied — none invented).
6. Contact route: currently `mailto:` to the only verified address. Decide on a form + email provider.
7. Privacy policy and Terms (do not exist; footer shows "in preparation", not links).
8. Photography: three supplied concrete-architecture images are in use (hero, problem panel, philosophy band; `public/images/`). They appear to be AI-generated: confirm provenance/licence before launch. Three more candidates are parked in `docs/imagery-unused/`.
9. Production domain cut-over (`apexmotus.co.za` is untouched).
