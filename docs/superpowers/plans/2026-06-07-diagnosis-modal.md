# Hero Diagnosis Modal Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the hero's structured-JSON diagnostic cards with AI-generated markdown rendered in a dark, brand-matched modal that auto-opens on every analysis (success or failure), while the enquiry email to Apex Motus continues to send on every server path.

**Architecture:** The `/api/diagnostic` route drops its JSON schema and returns `{ markdown }`. `HeroShell` stores the result and opens a new presentational `DiagnosisModal` that renders the markdown with `react-markdown` + scoped `.diagnosis-md` CSS. On failure the same modal shows a calm "Enquiry Received" message. Structured types and inline cards are removed.

**Tech Stack:** Next.js 14 (App Router), React 18, TypeScript, Tailwind CSS, `react-markdown`.

**Testing note:** This repo has no unit-test harness (scripts: `dev`/`build`/`lint`). Per the approved spec, verification is type-check (`npx tsc --noEmit`), lint (`npm run lint`), `curl` against the running dev server for the backend, and manual browser checks. The dev server hot-reloads, so changes apply live.

---

### Task 1: Add the `react-markdown` dependency

**Files:**
- Modify: `package.json`, `package-lock.json` (via npm)

- [ ] **Step 1: Install react-markdown**

Yarn/Corepack is misconfigured in this environment — use npm.

Run: `npm install react-markdown`
Expected: adds `react-markdown` to `dependencies`; no peer-dep errors against React 18.

- [ ] **Step 2: Verify it resolves**

Run: `node -e "require.resolve('react-markdown'); console.log('ok')"`
Expected: prints `ok`

- [ ] **Step 3: Commit**

```bash
git add package.json package-lock.json
git commit -m "chore: add react-markdown for diagnosis rendering"
```

---

### Task 2: Convert `/api/diagnostic` to return markdown

**Files:**
- Modify: `src/app/api/diagnostic/route.ts`

- [ ] **Step 1: Remove the structured-output machinery**

Delete these from the top of the file:
- the `import type { CriticalProblem, DiagnosticResponse, RiskCategory, SeverityLevel, RiskType } from "@/components/hero/types";` line
- the entire `diagnosticResponseJsonSchema` constant
- the `isSeverity`, `isRiskType`, `isRiskCategory`, `isDiagnosticResponse` functions
- the `formatDiagnosticResponse` function

Keep: `extractText`, `buildUnavailableMessage`, `notifyLead`, `getOpenAiApiKey`, `describeError`, `extractOutputText`, `ENQUIRY_FALLBACK_MESSAGE`, `EMAILJS_SEND_URL`, `MIN_TEXT_CHARS`, `OPENAI_RESPONSES_URL`.

- [ ] **Step 2: Replace the system prompt**

Find the `SYSTEM_PROMPT` constant and replace it with:

```ts
const SYSTEM_PROMPT = `You are a veteran Fortune 500 CEO and strategic consultant. Respond ONLY in clean GitHub-flavored Markdown — never HTML, and do NOT wrap the whole response in a code fence. Use "##" headings for sections (including one per numbered problem), "**bold**" for inline labels such as **The Exposure:**, and "---" horizontal rules between major sections. Keep it well structured and easy to read.`;
```

- [ ] **Step 3: Update the OpenAI request body**

In the `fetch(OPENAI_RESPONSES_URL, …)` call, replace the `body: JSON.stringify({ … })` object with (drops `text.format`, raises token budget):

```ts
      body: JSON.stringify({
        model,
        input: messages,
        max_output_tokens: 6000,
      }),
```

- [ ] **Step 4: Replace the post-response parsing/validation with a markdown string check**

Replace everything from `const content = extractOutputText(openAiResponse);` through the final `return NextResponse.json(parsed);` with:

```ts
  const markdown = extractOutputText(openAiResponse);

  if (typeof markdown !== "string" || markdown.trim().length === 0) {
    console.error("Diagnostic failed: AI returned an empty or non-text response.");
    await notifyLead(prompt, buildUnavailableMessage("AI returned an empty or non-text response."));
    return NextResponse.json({ error: ENQUIRY_FALLBACK_MESSAGE }, { status: 502 });
  }

  // Success: forward the enquiry with the full diagnosis. notifyLead is
  // best-effort and never throws, so an email problem can't break the result.
  await notifyLead(prompt, markdown.trim());

  return NextResponse.json({ markdown: markdown.trim() });
}
```

- [ ] **Step 5: Type-check**

Run: `npx tsc --noEmit`
Expected: no errors referencing `route.ts` (pre-existing unrelated errors, if any, are unchanged).

- [ ] **Step 6: Verify the failure path end-to-end (quota error is expected today)**

Ensure the dev server is running (`npm run dev`). Then:

Run:
```bash
curl -s -X POST http://localhost:3000/api/diagnostic \
  -H "Content-Type: application/json" \
  -d '{"text":"You are a CEO consultant. Here are the facts: We are a 12-person logistics startup in Cape Town, R2M ARR."}'
```
Expected: `{"error":"We hit a snag generating your instant diagnostic, but Apex Motus has received your enquiry and will be in touch shortly."}` and the server log shows `Diagnostic failed (AI request): …`. (Confirms no `OpenAI`/`details` leak and the email still fires.)

- [ ] **Step 7: Commit**

```bash
git add src/app/api/diagnostic/route.ts
git commit -m "feat: diagnostic API returns markdown instead of structured JSON"
```

---

### Task 3: Add `.diagnosis-md` markdown styles

**Files:**
- Modify: `src/app/globals.css`

- [ ] **Step 1: Append the styling block to the end of the file**

```css
/* ── Diagnosis modal markdown ─────────────────────────── */
.diagnosis-md {
  color: rgba(255, 255, 255, 0.85);
  font-family: var(--font-body), Georgia, serif;
  font-size: 15px;
  line-height: 1.7;
}
.diagnosis-md h2 {
  font-family: var(--font-heading), Georgia, serif;
  color: #ffffff;
  font-size: 22px;
  margin: 22px 0 10px;
}
.diagnosis-md h2:first-child,
.diagnosis-md h3:first-child {
  margin-top: 0;
}
.diagnosis-md h3 {
  font-family: var(--font-heading), Georgia, serif;
  color: #ffffff;
  font-size: 18px;
  margin: 18px 0 8px;
}
.diagnosis-md p {
  margin: 0 0 12px;
}
.diagnosis-md strong {
  color: #d4af37;
  font-weight: 600;
}
.diagnosis-md ul,
.diagnosis-md ol {
  margin: 0 0 12px;
  padding-left: 20px;
}
.diagnosis-md li {
  margin: 0 0 6px;
}
.diagnosis-md hr {
  border: none;
  border-top: 1px dashed rgba(212, 175, 55, 0.4);
  margin: 18px 0;
}
.diagnosis-md a {
  color: #22d3ee;
  text-decoration: underline;
}
```

- [ ] **Step 2: Commit**

```bash
git add src/app/globals.css
git commit -m "style: add .diagnosis-md markdown styling for the diagnosis modal"
```

---

### Task 4: Create the `DiagnosisModal` component

**Files:**
- Create: `src/components/hero/DiagnosisModal.tsx`

- [ ] **Step 1: Write the component**

```tsx
"use client";

import { useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";

type DiagnosisModalProps = {
  isOpen: boolean;
  title: string;
  content: string;
  onClose: () => void;
};

export function DiagnosisModal({ isOpen, title, content, onClose }: DiagnosisModalProps) {
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKeyDown);

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-navy/80 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className="flex max-h-[85vh] w-full max-w-3xl flex-col overflow-hidden rounded-[10px] border border-gold/35 bg-ink shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
          <span className="font-caption text-[10px] uppercase tracking-[0.15em] text-gold">
            {title}
          </span>
          <button
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="text-white/60 transition-colors hover:text-white"
          >
            <span className="text-2xl leading-none">&times;</span>
          </button>
        </div>
        <div className="diagnosis-md overflow-y-auto px-5 py-5 sm:px-7 sm:py-6">
          <ReactMarkdown>{content}</ReactMarkdown>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Type-check**

Run: `npx tsc --noEmit`
Expected: no errors referencing `DiagnosisModal.tsx`.

- [ ] **Step 3: Commit**

```bash
git add src/components/hero/DiagnosisModal.tsx
git commit -m "feat: add DiagnosisModal component"
```

---

### Task 5: Wire the modal into `HeroShell`

**Files:**
- Modify: `src/components/hero/HeroShell.tsx`

- [ ] **Step 1: Add the import**

Below `import { HeroViewport } from "./HeroViewport";` add:

```tsx
import { DiagnosisModal } from "./DiagnosisModal";
```

And change the types import line from:

```tsx
import { HeroPhase, DiagnosticResponse } from "./types";
```
to:
```tsx
import { HeroPhase } from "./types";
```

- [ ] **Step 2: Replace the result state**

Replace:

```tsx
  const [diagnosticResult, setDiagnosticResult] = useState<DiagnosticResponse | null>(null);
```
with:
```tsx
  const [diagnosticContent, setDiagnosticContent] = useState("");
  const [diagnosticTitle, setDiagnosticTitle] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
```

- [ ] **Step 3: Replace the analyze handler's result logic**

Replace the body of `handleAnalyzeBusiness` from `setAnalysisError("");` to the end of its `try/catch` with:

```tsx
    setAnalysisError("");
    setIsAnalyzing(true);

    try {
      const response = await fetch("/api/diagnostic", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });

      const payload = (await response.json()) as
        | { markdown?: string }
        | { error?: string };

      if (!response.ok || !("markdown" in payload) || typeof payload.markdown !== "string") {
        const message =
          "error" in payload && typeof payload.error === "string"
            ? payload.error
            : "We hit a snag generating your instant diagnostic, but Apex Motus has received your enquiry and will be in touch shortly.";
        setDiagnosticTitle("Enquiry Received");
        setDiagnosticContent(message);
        setIsModalOpen(true);
        return;
      }

      setDiagnosticTitle("Strategic Audit Diagnosis");
      setDiagnosticContent(payload.markdown);
      setIsModalOpen(true);
    } catch {
      setDiagnosticTitle("Enquiry Received");
      setDiagnosticContent(
        "We hit a snag generating your instant diagnostic, but Apex Motus has received your enquiry and will be in touch shortly.",
      );
      setIsModalOpen(true);
    } finally {
      setIsAnalyzing(false);
    }
```

Note: the early `setDiagnosticResult(null)` previously used in the too-short branch is no longer needed — that branch only sets `analysisError` and returns.

- [ ] **Step 4: Update the `too short` validation branch**

Ensure the guard near the top of `handleAnalyzeBusiness` reads (drop the old `setDiagnosticResult(null)` call):

```tsx
    if (facts.length < MIN_TEXT_CHARS) {
      setAnalysisError("Please describe your business a bit more before analysing.");
      return;
    }
```

- [ ] **Step 5: Update the render — remove `diagnosticResult` prop, add the modal**

Replace the `<HeroViewport … />` element with:

```tsx
      <HeroViewport
        composerText={composerText}
        onComposerTextChange={setComposerText}
        onAnalyze={handleAnalyzeBusiness}
        isAnalyzing={isAnalyzing}
        analysisError={analysisError}
        onViewCompanyDetails={handleViewCompanyDetails}
      />
      <DiagnosisModal
        isOpen={isModalOpen}
        title={diagnosticTitle}
        content={diagnosticContent}
        onClose={() => setIsModalOpen(false)}
      />
```

- [ ] **Step 6: Type-check (will fail on HeroViewport until Task 6)**

Run: `npx tsc --noEmit`
Expected: the only new error is that `HeroViewport` still declares the `diagnosticResult` prop — resolved in Task 6. No other new errors.

- [ ] **Step 7: Commit**

```bash
git add src/components/hero/HeroShell.tsx
git commit -m "feat: open DiagnosisModal on analyze (success and failure)"
```

---

### Task 6: Strip inline cards from `HeroViewport`

**Files:**
- Modify: `src/components/hero/HeroViewport.tsx`

- [ ] **Step 1: Update imports**

Change:
```tsx
import { CriticalProblem, DiagnosticResponse } from "./types";
```
to: remove the line entirely (no remaining type usage from `./types`).

- [ ] **Step 2: Remove the `diagnosticResult` prop**

In `type HeroViewportProps`, delete the line:
```tsx
  diagnosticResult: DiagnosticResponse | null;
```
And remove `diagnosticResult,` from the destructured function parameters.

- [ ] **Step 3: Delete the card helpers and component**

Delete `levelBadgeClass`, `riskTypeBadgeClass`, and the entire `ProblemCard` function.

- [ ] **Step 4: Delete the inline result section**

Remove the entire `{diagnosticResult ? ( <section …> … </section> ) : null}` block from the JSX. Keep the `isAnalyzing` spinner block, the `analysisError` block, and the "View Company Details" button.

- [ ] **Step 5: Type-check**

Run: `npx tsc --noEmit`
Expected: no errors (the Task 5 mismatch is now resolved).

- [ ] **Step 6: Lint**

Run: `npm run lint`
Expected: no new lint errors in `HeroViewport.tsx` or `HeroShell.tsx` (no unused imports/vars).

- [ ] **Step 7: Commit**

```bash
git add src/components/hero/HeroViewport.tsx
git commit -m "refactor: remove inline diagnostic cards from HeroViewport"
```

---

### Task 7: Remove unused structured types

**Files:**
- Modify: `src/components/hero/types.ts`

- [ ] **Step 1: Confirm nothing else imports the doomed types**

Run: `grep -rn "DiagnosticResponse\|CriticalProblem\|RiskCategory\|SeverityLevel\|RiskType" src`
Expected: no matches remain (Tasks 2, 5, 6 removed them all). If any remain, fix those references before deleting.

- [ ] **Step 2: Reduce `types.ts` to just `HeroPhase`**

Replace the entire file contents with:

```ts
export type HeroPhase = "expanded" | "precollapse" | "collapsed";
```

- [ ] **Step 3: Type-check**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add src/components/hero/types.ts
git commit -m "chore: drop unused structured diagnostic types"
```

---

### Task 8: Verify the success path via a temporary stub, then revert

The OpenAI quota is currently exhausted, so the success path can't be exercised live. Temporarily stub the route to confirm the modal + markdown rendering, then revert.

**Files:**
- Temporarily modify: `src/app/api/diagnostic/route.ts`

- [ ] **Step 1: Insert a temporary early return at the top of `POST`**

Immediately after `const prompt = messages.map(...)...` (the line that builds `prompt`), temporarily add:

```ts
  // TEMP STUB — remove after verifying the modal.
  if (process.env.DIAGNOSTIC_STUB === "1") {
    const sample = [
      "## Strategic Audit Diagnosis",
      "",
      "You are not just running a go-karting company. The biggest issue is **risk concentration without asset control.**",
      "",
      "---",
      "",
      "## 1. Venue Control Risk",
      "",
      "**The Exposure:** You operate in a hired parking area you do not control.",
      "",
      "**CEO Perspective:** A business that depends on a space it does not control is not scalable.",
      "",
      "**The Mitigating Move:** Secure a long-term exclusive-use agreement.",
      "",
      "---",
      "",
      "## Bottom-Line CEO View",
      "",
      "Your biggest problem is **operational legitimacy**, not demand.",
    ].join("\n");
    await notifyLead(prompt, sample);
    return NextResponse.json({ markdown: sample });
  }
```

- [ ] **Step 2: Restart needed? No — just set the env and re-run dev**

Stop the dev server, then run: `DIAGNOSTIC_STUB=1 npm run dev`

- [ ] **Step 3: Manual browser verification**

Open `http://localhost:3000`. Type 20+ characters of business facts and click analyze. Confirm:
- Modal **auto-opens** titled "Strategic Audit Diagnosis".
- Markdown renders: `##` as white headings, `**The Exposure:**` in gold, `---` as a dashed gold divider.
- Body **scrolls** within the panel; background page does not scroll.
- **Esc**, the **✕** button, and a **backdrop click** all close it.
- Resize to mobile width (~375px): panel fits with padding, content readable.

- [ ] **Step 4: Verify the failure modal**

Stop the server and run plain `npm run dev` (no stub). Submit again. Confirm the modal opens titled "Enquiry Received" with the calm message, and the server log shows the email send attempt.

- [ ] **Step 5: Remove the stub**

Delete the entire `// TEMP STUB …` block added in Step 1.

- [ ] **Step 6: Final checks**

Run: `npx tsc --noEmit && npm run lint`
Expected: clean.

Run: `grep -n "DIAGNOSTIC_STUB\|TEMP STUB" src/app/api/diagnostic/route.ts`
Expected: no matches (stub fully removed).

- [ ] **Step 7: Commit**

```bash
git add src/app/api/diagnostic/route.ts
git commit -m "test: verify diagnosis modal success path (stub removed)"
```

---

## Done When

- AI response renders as styled markdown in an auto-opening dark modal.
- Failure opens the same modal titled "Enquiry Received" with the calm message; no provider details leak to the client.
- The enquiry email to Apex Motus fires on every server path (verified via server log on the failure path).
- `npx tsc --noEmit` and `npm run lint` are clean; no `DiagnosticResponse`/`CriticalProblem` references remain; the stub is gone.
