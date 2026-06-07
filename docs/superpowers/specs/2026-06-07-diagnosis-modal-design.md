# Hero Diagnosis Modal — Design Spec

**Date:** 2026-06-07
**Status:** Approved (pending implementation plan)

## Problem

The hero business diagnostic currently forces the AI into a strict JSON schema
(`business_context`, `strategic_posture`, 5 `critical_problems`, `closing_directive`)
and renders it as fixed cards inline in the hero. This constrains the AI's
output and the inline cards are not a great reading experience for a long,
nuanced strategic audit.

We want the visitor to get a **proper modal** to read the AI's response, and the
AI to produce richer **markdown** prose. The enquiry email to Apex Motus must be
sent on **both success and failure**.

## Goals

1. AI returns expressive **markdown** instead of a constrained JSON schema.
2. The visitor always gets a **modal** to read the outcome — on success and on failure.
3. The enquiry email to Apex Motus is sent on **every** server-side path (already true; must stay true).
4. Dark, brand-matched modal (navy `#0f1738` + gold `#d4af37`), auto-opening on completion.

## Non-Goals

- No change to the email template or to sending the email client-side (it stays server-side).
- No reopen button after closing the modal (auto-open once per analysis is enough).
- No prettifying of the markdown inside the email — raw markdown in `{{message}}` is acceptable for an internal notification.

## Behavior

The modal **always opens after a server response**. Content differs by outcome:

| Outcome | Modal title | Modal content | Email to Apex Motus |
|---|---|---|---|
| Success | "Strategic Audit Diagnosis" | AI's markdown response | prompt + diagnosis |
| Failure (quota, outage, malformed output, missing key) | "Enquiry Received" | Calm message: "We hit a snag generating your instant diagnostic, but Apex Motus has received your enquiry and will be in touch shortly." | prompt + failure note |
| Input too short (client-side pre-submit) | — (no modal) | Inline form hint | nothing (never reaches server) |

Visitors never see provider/internal details (e.g. "OpenAI"); the real failure
reason is logged server-side and included in the email only.

## Data Flow

```
facts → buildDiagnosticPrompt(facts) → POST /api/diagnostic { text }
  server success → { markdown }                 → HeroShell: set markdown, title "Strategic Audit Diagnosis", open modal
  server failure → { error: <friendly msg> }    → HeroShell: set content = error, title "Enquiry Received", open modal
  (both server paths) → notifyLead(prompt, ...)  → email to Apex Motus
```

## Architecture

### Backend — `src/app/api/diagnostic/route.ts`

- **`SYSTEM_PROMPT`** rewritten to request clean GitHub-flavored Markdown:
  `##` headings, `**bold**` labels, `---` dividers, no raw HTML, no outer code fence.
- Remove `text.format: { type: "json_schema", ... }` from the request body — use
  default plain-text output. Increase `max_output_tokens` from 4096 to **6000** to
  avoid truncating a long audit.
- **Delete** `diagnosticResponseJsonSchema`, `isDiagnosticResponse`, `isSeverity`,
  `isRiskType`, `isRiskCategory`, `formatDiagnosticResponse`, and the
  `@/components/hero/types` import.
- Success: confirm output is a non-empty string (`extractOutputText`), then
  `await notifyLead(prompt, markdown)` and return `NextResponse.json({ markdown })`.
- **Failure handling is unchanged**: each failure branch logs the real reason
  server-side, calls `notifyLead(prompt, buildUnavailableMessage(reason))`, and
  returns `{ error: ENQUIRY_FALLBACK_MESSAGE }`. `notifyLead`,
  `buildUnavailableMessage`, `ENQUIRY_FALLBACK_MESSAGE`, `describeError`,
  `getOpenAiApiKey`, `extractOutputText`, `extractText` all stay.

### Frontend

**`src/components/hero/HeroShell.tsx`**
- State: replace `diagnosticResult: DiagnosticResponse | null` with
  `diagnosticContent: string | null`, `diagnosticTitle: string`, and
  `isModalOpen: boolean`.
- `handleAnalyzeBusiness`:
  - Client-side: facts too short → inline hint, return (no fetch, no modal).
  - Server success → set content = `payload.markdown`, title = "Strategic Audit Diagnosis", open modal.
  - Server failure → set content = `payload.error`, title = "Enquiry Received", open modal.
  - Network exception → set content = friendly fallback, title = "Enquiry Received", open modal.
- Render `<DiagnosisModal>` as a sibling of `<HeroViewport>`; pass
  `isOpen`, `title`, `content`, `onClose`.

**`src/components/hero/DiagnosisModal.tsx` (new)**
- Props: `isOpen: boolean`, `title: string`, `content: string`, `onClose: () => void`.
- Returns `null` when `!isOpen`.
- Fixed overlay: navy/translucent backdrop + centered panel
  (`max-w-3xl`, `max-h-[85vh]`, ink background, gold border, rounded).
- Header: `title` + gold uppercase label + close ✕ button.
- Scrollable body renders `<ReactMarkdown>{content}</ReactMarkdown>` inside a
  `.diagnosis-md` wrapper.
- Closes on: ✕ button, `Escape` key, backdrop click.
- A11y: `role="dialog"`, `aria-modal="true"`, `aria-label={title}`; focus the
  close button on open; lock `document.body` scroll while open; restore on close.

**`src/components/hero/HeroViewport.tsx`**
- Remove the inline `diagnosticResult` section, `ProblemCard`,
  `levelBadgeClass`, `riskTypeBadgeClass`, and the `diagnosticResult` prop.
- Keep the form, suggestion pills, the "Analysing…" spinner, and the inline
  hint used only for the client-side "too short" validation.

**`src/app/globals.css`**
- Add a scoped `.diagnosis-md` block styling rendered markdown to the brand:
  `h2`/`h3` white headings (Space Grotesk), `strong` → gold semibold (renders
  the `**The Exposure:**` labels in gold), `hr` → dashed gold divider, `p`
  white/85 with relaxed line-height, styled `ul`/`li`.

### Types — `src/components/hero/types.ts`
- Remove `DiagnosticResponse`, `CriticalProblem`, `SeverityLevel`, `RiskType`,
  `RiskCategory` (keep `HeroPhase`). Grep for any remaining importers first.

### Dependency
- Add **`react-markdown`** via `npm install react-markdown` (Yarn/Corepack is
  misconfigured in this environment). Updates `package.json` + `package-lock.json`.

## Security

- `react-markdown` renders to React elements, not `dangerouslySetInnerHTML`, and
  ignores raw HTML by default — so AI-generated (untrusted) markdown cannot
  inject `<script>`. No extra sanitizer needed as long as no `rehype-raw` plugin
  is added.

## Testing

- **Failure path** (verifiable now, given the OpenAI quota issue): submit facts →
  modal opens titled "Enquiry Received" with the calm message → enquiry email
  fires to Apex Motus. Confirm via server log + inbox.
- **Success path** (needs OpenAI quota restored): to verify modal + markdown
  rendering without waiting on billing, temporarily stub the route to return
  sample markdown, verify, then revert the stub.
- Interaction checks: Esc / backdrop / ✕ close; body-scroll lock while open;
  long-content scroll within `max-h-[85vh]`; mobile width; markdown headings,
  bold labels, and dividers styled per mockup A.

## Open Risks / Notes

- The email's `{{message}}` now carries raw markdown (`##`, `**`) — readable but
  not formatted. Accepted for an internal notification.
- `max_output_tokens = 6000` is a heuristic; if audits get truncated, raise it.
- "Email always sends" holds for every **server-side** path (success and all
  server failures), since `notifyLead` runs on the server. The one case that
  cannot email is a pure **client-side network exception** where the browser
  never reaches the server — there, the modal still opens with the friendly
  message, but no email is sent because the request never arrived. This is an
  acceptable, rare edge case.
