# Master Implementation Plan

## 1) Objective

Rebuild the Apex Motus website as a single, modern landing page aligned to `ApexMotus_spec.md`, while preserving only brand/theming primitives from the current project.

## 2) Scope

In scope:

- New landing page with sections: Hero (AI prompt flow), About, Product Showcase, Contact.
- OpenAI integration for generating 5 potential business problems.
- Post-response conversion form flow based on accuracy selection (0 vs 1-5).
- Resend email flow for submitted leads.
- Vercel-ready deployment and environment setup.

Out of scope for this rebuild pass:

- Legacy multi-page structure (`/services`, `/portfolio`, `/privacy`, etc.).
- Existing component hierarchy except reusable theme primitives.
- Backend persistence/database unless required later.

## 3) Architecture Decisions

- Framework: Next.js App Router (existing stack).
- Styling: Tailwind CSS with retained brand tokens and typography.
- Server actions/API routes:
  - `POST /api/insights` (OpenAI call: facts -> 5 potential problems).
  - `POST /api/lead` (Resend call: lead form submission -> inbox).
- Client state model:
  - Hero interaction controlled by explicit UI state machine.

## 4) Hero State Machine

States:

1. `facts_input`: user enters 5 facts.
2. `ai_loading`: request in-flight.
3. `ai_result`: show generated 5 potential problems.
4. `accuracy_pick`: user selects 0-5.
5. `lead_form`: show form with conditional message.
6. `submit_success` / `submit_error`.

Rules:

- Require exactly 5 facts before submitting.
- Disable repeated submit while loading.
- Accuracy choice controls message:
  - `0`: coffee message.
  - `1..5`: tailored solution message.

## 5) Data Contracts

`/api/insights` request:

- `facts: string[]` (length 5)

`/api/insights` response:

- `problems: string[]` (length 5)
- `rawModel?: string` (optional for tracing)

`/api/lead` request:

- `firstName`, `lastName`, `company`, `email`, `phone`
- `accuracyScore` (0-5)
- `facts` and `problems` (optional but recommended for context)

`/api/lead` response:

- `ok: boolean`
- `message: string`

## 6) Delivery Phases

Phase A - Foundation reset:

- Remove legacy pages/components.
- Keep and normalize theme tokens, fonts, and brand assets.
- Create minimal route structure for the single landing page.

Phase B - Hero AI workflow:

- Build facts input UI and client validation.
- Integrate `POST /api/insights`.
- Render AI result and accuracy controls.

Phase C - Lead capture:

- Build conditional lead form and messaging.
- Integrate `POST /api/lead` with Resend.
- Add success/error feedback and basic anti-spam hardening (honeypot + cooldown).

Phase D - Supporting sections:

- Implement concise About section.
- Implement product showcase section driven by simple config list.
- Implement contact section aligned with brand style.

Phase E - Hardening and launch:

- SEO metadata, social tags, robots/sitemap review.
- Accessibility pass.
- QA/regression testing.
- Vercel environment setup and production deployment.

## 7) Validation and Testing Plan

- Unit tests for request validation helpers.
- Integration tests for API route success/error paths (mock OpenAI/Resend).
- E2E flow:
  - Facts -> AI output -> accuracy select -> lead submit -> success.
  - Failure flows for AI and email endpoints.
- Manual responsive checks (mobile/tablet/desktop).

## 8) Risks and Mitigations

- OpenAI latency/failure:
  - Add timeout, retry policy (single retry), and clear fallback error copy.
- Prompt unpredictability:
  - Constrain output format and validate count = 5 before rendering.
- Lead quality/noise:
  - Add form validation, honeypot, and rate limit logic at API edge.
- Deployment misconfiguration:
  - Add explicit env var checklist and preflight diagnostics at startup.

## 9) Definition of Done

- Landing page fully matches spec behavior and section structure.
- Old site content/routes removed or intentionally redirected.
- Theme identity retained (colors, fonts, logos).
- OpenAI + Resend flows working in production.
- Verified on Vercel with secure environment variables.
