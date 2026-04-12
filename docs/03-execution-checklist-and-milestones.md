# Execution Checklist and Milestones

## Milestone 0 - Setup and Guardrails

- [ ] Confirm branch strategy for rebuild.
- [ ] Confirm exact theming assets/tokens to preserve.
- [ ] Add/update `.env.local.example` with required variables:
  - [ ] `OPENAI_API_KEY`
  - [ ] `OPENAI_MODEL` (default selected model)
  - [ ] `RESEND_API_KEY`
  - [ ] `LEAD_INBOX_EMAIL`
- [ ] Decide whether to keep dark/light toggle or fixed mode.

## Milestone 1 - Teardown + Skeleton

- [ ] Remove legacy pages/components not in spec.
- [ ] Keep only theming and brand primitives.
- [ ] Create new landing shell in `src/app/page.tsx` with section anchors.
- [ ] Ensure `npm run build` succeeds with skeleton implementation.

Acceptance:

- [ ] Old site routes/content are no longer surfaced.
- [ ] New skeleton renders with preserved brand theme.

## Milestone 2 - Hero AI Flow

- [ ] Build 5-fact input UX with clear per-fact fields.
- [ ] Validate exactly 5 non-empty facts client-side.
- [ ] Implement `POST /api/insights` route.
- [ ] Add prompt template that always asks model for exactly 5 problems.
- [ ] Parse/validate AI output length before rendering.
- [ ] Add loading and error states.

Acceptance:

- [ ] User can submit facts and receive exactly 5 generated problems.
- [ ] Failures show actionable recovery messaging.

## Milestone 3 - Accuracy Conversion and Lead Form

- [ ] Render accuracy buttons `0..5` after AI output.
- [ ] Switch to conditional lead form message based on selection.
- [ ] Implement lead form fields (first, last, company, email, phone).
- [ ] Add client/server validation and sanitization.
- [ ] Implement `POST /api/lead` route with Resend.
- [ ] Add success and failure UX.

Acceptance:

- [ ] Accuracy flow and conditional messaging behave exactly as spec.
- [ ] Valid form submissions produce delivered emails.

## Milestone 4 - Remaining Sections

- [ ] Implement concise About section copy.
- [ ] Implement Product Showcase from config-driven URL list.
- [ ] Implement Contact section aligned with brand styling.

Acceptance:

- [ ] All sections in spec exist and are functional.
- [ ] Product links open correct hosted pages.

## Milestone 5 - QA, Performance, Deployment

- [ ] Accessibility pass: headings, labels, keyboard navigation, contrast.
- [ ] SEO/meta pass: title, description, OG, robots.
- [ ] Performance pass: bundle review, image optimization, loading states.
- [ ] Cross-browser/device checks.
- [ ] Deploy to Vercel and validate env vars.
- [ ] Smoke-test production form submissions.

Acceptance:

- [ ] Production URL is stable and spec-compliant.
- [ ] Core funnel (facts -> AI -> accuracy -> lead submit) verified end-to-end.

## Open Inputs Needed From You

- [ ] Product showcase URLs for each product.
- [ ] Destination email address(es) for inbound leads.
- [ ] Preferred OpenAI model choice and tone guidance for generated problem statements.
- [ ] Final About section copy approval (or direction to draft).
