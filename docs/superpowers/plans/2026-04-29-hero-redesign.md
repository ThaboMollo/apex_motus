# Hero Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transform the Apex Motus hero section into a claude.ai-inspired AI-native experience with an aurora background, typewriter headline, auto-growing textarea input, and a CEO-persona diagnostic API — replacing the old pill input and split-fact API.

**Architecture:** New components (`FactsTextarea`, `SuggestionPills`) replace the old ones (`ChatInput`, `SuggestionChips`). Types move to the shared `types.ts`. The API route switches from a pre-split `facts[]` payload to a free-form `text` string, and the system prompt becomes a Fortune 500 CEO persona. `HeroShell` owns state and passes it down; `HeroViewport` renders the typewriter and results.

**Tech Stack:** Next.js 15 App Router, TypeScript, Tailwind CSS (gold/navy tokens), OpenAI chat completions with `json_schema` structured output, CSS keyframe animations (no canvas, no JS for aurora).

---

## File Map

| Status | File | Purpose |
|---|---|---|
| Modify | `src/components/hero/types.ts` | Add `CriticalProblem`, `DiagnosticResponse`, `RiskCategory`, `SeverityLevel`, `RiskType` |
| Create | `src/components/hero/suggestions.ts` | 50-item `HERO_SUGGESTIONS` pool |
| Modify | `src/app/globals.css` | Add aurora blob CSS (`.blob`, `@keyframes drift`, `@keyframes blink`) |
| Create | `src/components/hero/FactsTextarea.tsx` | Auto-growing textarea with send button and fact counter |
| Create | `src/components/hero/SuggestionPills.tsx` | 4 randomly sampled suggestion pills |
| Modify | `src/app/api/diagnostic/route.ts` | CEO persona prompt, new JSON schema, `text` input |
| Modify | `src/components/hero/HeroShell.tsx` | Remove fact-splitting, send `{text}`, update types, add blob divs |
| Modify | `src/components/hero/HeroViewport.tsx` | Typewriter, swap components, update result rendering |
| Delete | `src/components/hero/ChatInput.tsx` | Replaced by `FactsTextarea` |
| Delete | `src/components/hero/SuggestionChips.tsx` | Replaced by `SuggestionPills` |

---

### Task 1: Centralize Types in `types.ts`

**Files:**
- Modify: `src/components/hero/types.ts`

- [ ] **Step 1: Replace `types.ts` with the full shared type set**

```typescript
export type HeroPhase = "expanded" | "precollapse" | "collapsed";

export type RiskCategory =
  | "operations"
  | "sales"
  | "team"
  | "finance"
  | "technology"
  | "customer_experience"
  | "strategy"
  | "compliance";

export type SeverityLevel = "low" | "medium" | "high";
export type RiskType = "execution" | "structural";

export type CriticalProblem = {
  title: string;
  category: RiskCategory;
  severity: SeverityLevel;
  risk_type: RiskType;
  the_exposure: string;
  ceo_perspective: string;
  mitigating_move: string;
};

export type DiagnosticResponse = {
  business_context: string;
  strategic_posture: string;
  critical_problems: CriticalProblem[];
  closing_directive: string;
};
```

- [ ] **Step 2: Verify TypeScript compiles**

Run: `cd /Users/thabomollomponya/Dev/apexMotus && npx tsc --noEmit 2>&1 | head -30`

Expected: errors will appear because `HeroShell` and `HeroViewport` still use the old local types. That is expected — they are fixed in later tasks.

- [ ] **Step 3: Commit**

```bash
git add src/components/hero/types.ts
git commit -m "feat: add diagnostic types to shared types.ts"
```

---

### Task 2: Create the Suggestions Pool

**Files:**
- Create: `src/components/hero/suggestions.ts`

- [ ] **Step 1: Create the file with the 50-item pool**

```typescript
export const HERO_SUGGESTIONS: string[] = [
  "We rely on referrals",
  "We are a consultancy firm",
  "We stock in bulk and resell",
  "We develop software solutions based on client requirements",
  "We provide 24/7 personalised support",
  "We offer white-glove delivery and installation",
  "We provide on-site technical training",
  "We act as an outsourced department",
  "We offer emergency rapid-response times",
  "We provide bespoke tailoring for specialised equipment",
  "We facilitate networking and industry connections",
  "We offer concierge-level project management",
  "We manufacture in small batches for high quality",
  "We source exclusively from local producers",
  "We provide try-before-you-buy sample programs",
  "We offer subscription-based inventory replenishment",
  "We curate best-in-class product bundles",
  "We use 100% eco-friendly and compostable packaging",
  "We offer lifetime warranties on all craftsmanship",
  "We refurbish and resell high-end electronics",
  "We provide white-label manufacturing for other brands",
  "We provide API integrations between disparate systems",
  "We offer rapid prototyping and 3D modelling",
  "We provide creative direction and brand strategy",
  "We perform deep-dive technical security audits",
  "We offer fractional C-suite leadership talent",
  "We specialise in legacy system maintenance and repair",
  "We provide interactive data visualisation and analytics",
  "We offer UX/UI optimisation for digital platforms",
  "We conduct hyper-local market research",
  "We operate a low-overhead model to reduce client costs",
  "We offer flexible pay-as-you-grow payment plans",
  "We have no minimum order quantities",
  "We offer geographic exclusivity to our partners",
  "We provide turnkey solutions for retail franchises",
  "We leverage family-owned heritage and stability",
  "We offer risk-free performance-based trials",
  "We pivot service offerings based on real-time trends",
  "We provide navigation through complex regulatory red tape",
  "We offer unbundled services to prevent overpaying",
  "We specialise in sourcing hard-to-find or obsolete parts",
  "We provide linguistic and cultural localisation",
  "We cater to high-net-worth individuals requiring privacy",
  "We operate as an artisan workshop for handmade goods",
  "We provide 24-hour disaster recovery services",
  "We offer pop-up retail and temporary storefront solutions",
  "We focus on inclusive and accessible design standards",
  "We provide just-in-time inventory management",
  "We offer exclusive community membership access",
  "We provide radical transparency in the supply chain",
];
```

- [ ] **Step 2: Commit**

```bash
git add src/components/hero/suggestions.ts
git commit -m "feat: add 50-item hero suggestions pool"
```

---

### Task 3: Add Aurora CSS to `globals.css`

**Files:**
- Modify: `src/app/globals.css`

- [ ] **Step 1: Append aurora blob styles to the end of `globals.css`**

Add these styles at the end of the file (before any closing braces if applicable):

```css
/* ── Aurora background blobs ─────────────────────────── */
@keyframes drift1 {
  0%,100% { transform: translate(0,0) scale(1); }
  33%      { transform: translate(40px,-30px) scale(1.08); }
  66%      { transform: translate(-25px,45px) scale(0.95); }
}
@keyframes drift2 {
  0%,100% { transform: translate(0,0) scale(1); }
  33%      { transform: translate(-50px,35px) scale(1.12); }
  66%      { transform: translate(30px,-20px) scale(0.93); }
}
@keyframes drift3 {
  0%,100% { transform: translate(0,0) scale(1); }
  33%      { transform: translate(20px,50px) scale(0.97); }
  66%      { transform: translate(-40px,-30px) scale(1.06); }
}
@keyframes blink {
  0%,100% { opacity: 1; }
  50%     { opacity: 0; }
}

.blob {
  position: absolute;
  border-radius: 50%;
  filter: blur(70px);
  pointer-events: none;
}
.blob-1 {
  width: 520px;
  height: 380px;
  background: radial-gradient(ellipse, rgba(28,44,163,0.55) 0%, transparent 70%);
  top: -10%;
  left: -8%;
  animation: drift1 14s ease-in-out infinite;
}
.blob-2 {
  width: 460px;
  height: 340px;
  background: radial-gradient(ellipse, rgba(100,40,160,0.45) 0%, transparent 70%);
  bottom: -5%;
  right: -6%;
  animation: drift2 18s ease-in-out infinite;
}
.blob-3 {
  width: 340px;
  height: 300px;
  background: radial-gradient(ellipse, rgba(212,175,55,0.12) 0%, transparent 70%);
  top: 30%;
  right: 10%;
  animation: drift3 22s ease-in-out infinite;
}

@media (prefers-reduced-motion: reduce) {
  .blob { animation: none; }
}
```

- [ ] **Step 2: Commit**

```bash
git add src/app/globals.css
git commit -m "feat: add aurora blob CSS keyframes and blob styles"
```

---

### Task 4: Create `FactsTextarea`

**Files:**
- Create: `src/components/hero/FactsTextarea.tsx`

- [ ] **Step 1: Create the component**

```tsx
"use client";

import { useEffect, useRef } from "react";

type FactsTextareaProps = {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  isLoading: boolean;
};

function countFacts(text: string): number {
  return text
    .split(/[.\n,;!?]/)
    .map((s) => s.trim())
    .filter((s) => s.length > 4).length;
}

export function FactsTextarea({ value, onChange, onSubmit, isLoading }: FactsTextareaProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 200)}px`;
  }, [value]);

  const canSubmit = value.trim().length >= 20 && !isLoading;
  const factCount = countFacts(value);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.metaKey || e.ctrlKey) && e.key === "Enter" && canSubmit) {
      e.preventDefault();
      onSubmit();
    }
  };

  return (
    <div className="rounded-2xl border border-gold/25 bg-white/[0.06] px-5 pb-3 pt-4 transition-shadow focus-within:border-gold/50 focus-within:shadow-[0_0_30px_rgba(212,175,55,0.07)]">
      <textarea
        ref={textareaRef}
        rows={2}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Start with your first fact — e.g. We rely on referrals for most new clients…"
        className="w-full resize-none overflow-y-auto bg-transparent font-body text-[15px] leading-relaxed text-white/88 placeholder:italic placeholder:text-white/25 focus:outline-none"
        style={{ maxHeight: "200px" }}
        disabled={isLoading}
      />
      <div className="mt-2 flex items-center justify-between border-t border-white/[0.07] pt-2">
        <span
          className={`font-caption text-[11px] ${factCount > 0 ? "text-gold" : "text-white/30"}`}
        >
          {factCount === 0 ? "0 facts detected" : `${factCount} fact${factCount === 1 ? "" : "s"} detected`}
        </span>
        <button
          type="button"
          onClick={onSubmit}
          disabled={!canSubmit}
          className="rounded-lg bg-gold px-4 py-1.5 font-caption text-[11px] font-bold tracking-widest text-navy shadow-[0_0_16px_rgba(212,175,55,0.35)] transition-opacity disabled:opacity-35"
        >
          {isLoading ? "Analysing…" : "Analyse →"}
        </button>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Verify it compiles**

Run: `npx tsc --noEmit 2>&1 | grep FactsTextarea`

Expected: no errors for this file specifically.

- [ ] **Step 3: Commit**

```bash
git add src/components/hero/FactsTextarea.tsx
git commit -m "feat: add FactsTextarea component with auto-grow and fact counter"
```

---

### Task 5: Create `SuggestionPills`

**Files:**
- Create: `src/components/hero/SuggestionPills.tsx`

- [ ] **Step 1: Create the component**

```tsx
"use client";

import { useMemo, useRef } from "react";
import { HERO_SUGGESTIONS } from "./suggestions";

type SuggestionPillsProps = {
  currentValue: string;
  onSelect: (appendedValue: string) => void;
};

function sampleFour(pool: string[]): string[] {
  const copy = [...pool];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy.slice(0, 4);
}

export function SuggestionPills({ currentValue, onSelect }: SuggestionPillsProps) {
  const pills = useMemo(() => sampleFour(HERO_SUGGESTIONS), []);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const handleClick = (suggestion: string) => {
    let next: string;
    const trimmed = currentValue.trimEnd();
    if (trimmed.length === 0) {
      next = suggestion;
    } else if (/[.,;\n]$/.test(trimmed)) {
      next = `${trimmed} ${suggestion}`;
    } else {
      next = `${trimmed}. ${suggestion}`;
    }
    onSelect(next);

    // focus the textarea after appending
    if (!textareaRef.current) {
      textareaRef.current = document.querySelector<HTMLTextAreaElement>("textarea");
    }
    textareaRef.current?.focus();
  };

  return (
    <div className="mt-3 flex flex-wrap justify-center gap-2">
      {pills.map((pill) => (
        <button
          key={pill}
          type="button"
          onClick={() => handleClick(pill)}
          className="rounded-full border border-white/15 px-3.5 py-1.5 font-body text-[12px] text-white/55 transition-colors hover:border-gold/45 hover:bg-gold/5 hover:text-gold/90"
        >
          {pill}
        </button>
      ))}
    </div>
  );
}
```

- [ ] **Step 2: Verify it compiles**

Run: `npx tsc --noEmit 2>&1 | grep SuggestionPills`

Expected: no errors for this file.

- [ ] **Step 3: Commit**

```bash
git add src/components/hero/SuggestionPills.tsx
git commit -m "feat: add SuggestionPills component with Fisher-Yates random sample"
```

---

### Task 6: Rewrite the Diagnostic API Route

**Files:**
- Modify: `src/app/api/diagnostic/route.ts`

- [ ] **Step 1: Rewrite `route.ts` with the CEO persona and new schema**

```typescript
import { NextResponse } from "next/server";
import type { CriticalProblem, DiagnosticResponse, RiskCategory, SeverityLevel, RiskType } from "@/components/hero/types";

const MIN_TEXT_CHARS = 20;

const diagnosticResponseJsonSchema = {
  type: "object",
  additionalProperties: false,
  required: ["business_context", "strategic_posture", "critical_problems", "closing_directive"],
  properties: {
    business_context: { type: "string" },
    strategic_posture: { type: "string" },
    closing_directive: { type: "string" },
    critical_problems: {
      type: "array",
      minItems: 5,
      maxItems: 5,
      items: {
        type: "object",
        additionalProperties: false,
        required: [
          "title",
          "category",
          "severity",
          "risk_type",
          "the_exposure",
          "ceo_perspective",
          "mitigating_move",
        ],
        properties: {
          title: { type: "string" },
          category: {
            type: "string",
            enum: [
              "operations",
              "sales",
              "team",
              "finance",
              "technology",
              "customer_experience",
              "strategy",
              "compliance",
            ],
          },
          severity: { type: "string", enum: ["low", "medium", "high"] },
          risk_type: { type: "string", enum: ["execution", "structural"] },
          the_exposure: { type: "string" },
          ceo_perspective: { type: "string" },
          mitigating_move: { type: "string" },
        },
      },
    },
  },
} as const;

function extractText(payload: unknown): string | null {
  if (typeof payload !== "object" || payload === null || !("text" in payload)) {
    return null;
  }
  const { text } = payload as { text?: unknown };
  if (typeof text !== "string" || text.trim().length < MIN_TEXT_CHARS) {
    return null;
  }
  return text.trim();
}

function isSeverity(v: unknown): v is SeverityLevel {
  return v === "low" || v === "medium" || v === "high";
}

function isRiskType(v: unknown): v is RiskType {
  return v === "execution" || v === "structural";
}

function isRiskCategory(v: unknown): v is RiskCategory {
  return (
    v === "operations" ||
    v === "sales" ||
    v === "team" ||
    v === "finance" ||
    v === "technology" ||
    v === "customer_experience" ||
    v === "strategy" ||
    v === "compliance"
  );
}

function isDiagnosticResponse(data: unknown): data is DiagnosticResponse {
  if (typeof data !== "object" || data === null) return false;
  const d = data as Partial<DiagnosticResponse>;
  if (
    typeof d.business_context !== "string" ||
    typeof d.strategic_posture !== "string" ||
    typeof d.closing_directive !== "string" ||
    !Array.isArray(d.critical_problems) ||
    d.critical_problems.length !== 5
  ) {
    return false;
  }
  return d.critical_problems.every((p) => {
    if (typeof p !== "object" || p === null) return false;
    const c = p as Partial<CriticalProblem>;
    return (
      typeof c.title === "string" &&
      isRiskCategory(c.category) &&
      isSeverity(c.severity) &&
      isRiskType(c.risk_type) &&
      typeof c.the_exposure === "string" &&
      typeof c.ceo_perspective === "string" &&
      typeof c.mitigating_move === "string"
    );
  });
}

const SYSTEM_PROMPT = `You are a veteran Fortune 500 CEO and Strategic Consultant with 30 years of experience scaling companies and navigating market disruptions. Your tone is clinical, decisive, and focused on long-term enterprise value.

You will receive a free-form description of a business written by its owner or leadership team. It may be a list of facts, a paragraph, or a mix. Extract all relevant context.

Analysis Framework:
1. Identify the Friction — where do these facts create immediate operational or financial bottlenecks?
2. Predict the Blind Spots — what second-order consequences are invisible to most founders but obvious to a seasoned enterprise leader?
3. Risk Mapping — classify each threat as either an Execution Risk (internal, within the business's control) or a Structural Risk (external — market, regulatory, or competitive forces).

Output exactly 5 Critical Problems — current vulnerabilities or near-term predicted threats. For each problem provide:
- The Exposure: why this specific combination of business facts creates this vulnerability.
- The CEO Perspective: one sentence only — a hard, unfiltered truth about the problem.
- The Mitigating Move: one high-level strategic action to neutralize or contain the threat.

Be concrete. Do not hedge. Name the actual risk plainly.
Return valid JSON matching the provided schema exactly. No markdown, no prose outside the JSON.`;

function buildUserPrompt(text: string): string {
  return `Here is what I know about this business:\n\n${text}\n\nPerform the strategic audit. Identify the 5 most critical problems this business is either facing now or will face within the next 12 months.`;
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const text = extractText(body);
  if (!text) {
    return NextResponse.json(
      { error: `Provide a text description of at least ${MIN_TEXT_CHARS} characters.` },
      { status: 400 },
    );
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "OPENAI_API_KEY is missing. Add it to your environment configuration." },
      { status: 500 },
    );
  }

  const model = process.env.OPENAI_MODEL ?? "gpt-4o-mini";

  const openAIResponse = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      temperature: 0.4,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: buildUserPrompt(text) },
      ],
      response_format: {
        type: "json_schema",
        json_schema: {
          name: "diagnostic_response",
          strict: true,
          schema: diagnosticResponseJsonSchema,
        },
      },
    }),
  });

  if (!openAIResponse.ok) {
    const errorBody = await openAIResponse.text();
    return NextResponse.json(
      { error: "OpenAI request failed", details: errorBody },
      { status: openAIResponse.status },
    );
  }

  const completion = (await openAIResponse.json()) as {
    choices?: Array<{ message?: { content?: string } }>;
  };

  const content = completion.choices?.[0]?.message?.content;
  if (typeof content !== "string") {
    return NextResponse.json(
      { error: "OpenAI returned an unexpected response format." },
      { status: 502 },
    );
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(content);
  } catch {
    return NextResponse.json(
      { error: "OpenAI response was not valid JSON.", details: content },
      { status: 502 },
    );
  }

  if (!isDiagnosticResponse(parsed)) {
    return NextResponse.json(
      { error: "OpenAI response did not match required diagnostic schema.", details: parsed },
      { status: 502 },
    );
  }

  return NextResponse.json(parsed);
}
```

- [ ] **Step 2: Verify it compiles**

Run: `npx tsc --noEmit 2>&1 | grep "route.ts"`

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/app/api/diagnostic/route.ts
git commit -m "feat: rewrite diagnostic API with CEO persona and new JSON schema"
```

---

### Task 7: Update `HeroShell`

**Files:**
- Modify: `src/components/hero/HeroShell.tsx`

- [ ] **Step 1: Rewrite `HeroShell.tsx`**

Remove the local type definitions, remove fact-splitting logic, send `{ text }`, and add aurora blobs to the JSX.

```tsx
"use client";

import { useEffect, useRef, useState } from "react";
import { HeroCollapsedNav } from "./HeroCollapsedNav";
import { HeroViewport } from "./HeroViewport";
import { HeroPhase, DiagnosticResponse } from "./types";

const COLLAPSE_DELAY_MS = 100;
const COLLAPSE_TRIGGER_PX = 10;
const MIN_TEXT_CHARS = 20;

export function HeroShell() {
  const [phase, setPhase] = useState<HeroPhase>("expanded");
  const [composerText, setComposerText] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisError, setAnalysisError] = useState("");
  const [diagnosticResult, setDiagnosticResult] = useState<DiagnosticResponse | null>(null);
  const timerRef = useRef<number | null>(null);
  const phaseRef = useRef<HeroPhase>("expanded");

  const clearTimer = () => {
    if (timerRef.current !== null) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  const setPhaseSafe = (nextPhase: HeroPhase) => {
    phaseRef.current = nextPhase;
    setPhase(nextPhase);
  };

  const collapseToSection = (targetId?: string) => {
    if (phaseRef.current !== "expanded") {
      if (phaseRef.current === "collapsed" && targetId) {
        const section = document.getElementById(targetId);
        section?.scrollIntoView({ behavior: "smooth", block: "start" });
      }
      return;
    }

    clearTimer();
    setPhaseSafe("precollapse");
    timerRef.current = window.setTimeout(() => {
      setPhaseSafe("collapsed");
      timerRef.current = null;
      if (targetId) {
        window.requestAnimationFrame(() => {
          const section = document.getElementById(targetId);
          section?.scrollIntoView({ behavior: "smooth", block: "start" });
        });
      }
    }, COLLAPSE_DELAY_MS);
  };

  useEffect(() => {
    const onScroll = () => {
      if (window.scrollY <= COLLAPSE_TRIGGER_PX) {
        clearTimer();
        if (phaseRef.current !== "expanded") {
          setPhaseSafe("expanded");
        }
        return;
      }

      if (phaseRef.current === "expanded") {
        collapseToSection();
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      clearTimer();
    };
  }, []);

  const handleTalkToUs = () => {
    if (phaseRef.current === "expanded") {
      collapseToSection("contact");
      return;
    }
    const contactSection = document.getElementById("contact");
    contactSection?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleViewCompanyDetails = () => {
    collapseToSection("about");
  };

  const handleAnalyzeBusiness = async () => {
    const text = composerText.trim();
    if (text.length < MIN_TEXT_CHARS) {
      setAnalysisError("Please describe your business a bit more before analysing.");
      setDiagnosticResult(null);
      return;
    }

    setAnalysisError("");
    setIsAnalyzing(true);
    setDiagnosticResult(null);

    try {
      const response = await fetch("/api/diagnostic", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });

      const payload = (await response.json()) as
        | DiagnosticResponse
        | { error?: string; details?: unknown };

      if (!response.ok) {
        setAnalysisError(
          "error" in payload && typeof payload.error === "string"
            ? payload.error
            : "Unable to analyse the business right now.",
        );
        return;
      }

      setDiagnosticResult(payload as DiagnosticResponse);
    } catch {
      setAnalysisError("Network error while analysing your business.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <section className={`hero-shell hero-${phase}`} aria-label="Hero">
      <div className="absolute inset-0 bg-surface-dark" />
      <div className="blob blob-1" />
      <div className="blob blob-2" />
      <div className="blob blob-3" />

      <HeroCollapsedNav onTalkToUs={handleTalkToUs} />
      <HeroViewport
        composerText={composerText}
        onComposerTextChange={setComposerText}
        onAnalyze={handleAnalyzeBusiness}
        isAnalyzing={isAnalyzing}
        analysisError={analysisError}
        diagnosticResult={diagnosticResult}
        onViewCompanyDetails={handleViewCompanyDetails}
      />
    </section>
  );
}
```

- [ ] **Step 2: Verify it compiles**

Run: `npx tsc --noEmit 2>&1 | grep "HeroShell"`

Expected: no errors from HeroShell.

- [ ] **Step 3: Commit**

```bash
git add src/components/hero/HeroShell.tsx
git commit -m "feat: update HeroShell to send free-form text and add aurora blob divs"
```

---

### Task 8: Rewrite `HeroViewport`

**Files:**
- Modify: `src/components/hero/HeroViewport.tsx`

- [ ] **Step 1: Rewrite `HeroViewport.tsx` with typewriter, new components, and new result rendering**

```tsx
"use client";

import { useEffect, useState } from "react";
import { FactsTextarea } from "./FactsTextarea";
import { SuggestionPills } from "./SuggestionPills";
import { CriticalProblem, DiagnosticResponse } from "./types";

const HEADLINE = "Give me 5 facts about your business, and I'll give you 5 potential problems.";
const TYPEWRITER_INTERVAL_MS = 38;

type HeroViewportProps = {
  composerText: string;
  onComposerTextChange: (value: string) => void;
  onAnalyze: () => void;
  isAnalyzing: boolean;
  analysisError: string;
  diagnosticResult: DiagnosticResponse | null;
  onViewCompanyDetails: () => void;
};

function levelBadgeClass(level: "low" | "medium" | "high") {
  if (level === "high") return "border-red-300/40 bg-red-300/20 text-red-100";
  if (level === "medium") return "border-yellow-300/40 bg-yellow-300/20 text-yellow-100";
  return "border-emerald-300/40 bg-emerald-300/20 text-emerald-100";
}

function riskTypeBadgeClass(riskType: "execution" | "structural") {
  if (riskType === "structural") return "border-purple-300/40 bg-purple-300/10 text-purple-200";
  return "border-sky-300/40 bg-sky-300/10 text-sky-200";
}

function ProblemCard({ problem }: { problem: CriticalProblem }) {
  return (
    <article className="rounded-[4px] border border-white/20 bg-white/5 p-4">
      <div className="flex flex-wrap items-center gap-2">
        <h4 className="font-heading text-[22px] text-white">{problem.title}</h4>
        <span className="rounded-[4px] border border-white/25 px-2 py-0.5 font-caption text-[10px] uppercase tracking-[0.14em] text-white/75">
          {problem.category.replace("_", " ")}
        </span>
        <span
          className={`rounded-[4px] border px-2 py-0.5 font-caption text-[10px] uppercase tracking-[0.14em] ${levelBadgeClass(problem.severity)}`}
        >
          {problem.severity} severity
        </span>
        <span
          className={`rounded-[4px] border px-2 py-0.5 font-caption text-[10px] uppercase tracking-[0.14em] ${riskTypeBadgeClass(problem.risk_type)}`}
        >
          {problem.risk_type === "execution" ? "Execution Risk" : "Structural Risk"}
        </span>
      </div>

      <p className="mt-3 font-caption text-[11px] uppercase tracking-[0.15em] text-gold">
        The Exposure
      </p>
      <p className="mt-1 font-body text-[15px] leading-relaxed text-white/85">
        {problem.the_exposure}
      </p>

      <p className="mt-3 font-caption text-[11px] uppercase tracking-[0.15em] text-gold">
        CEO Perspective
      </p>
      <p className="mt-1 font-body text-[15px] italic leading-relaxed text-white/85">
        &ldquo;{problem.ceo_perspective}&rdquo;
      </p>

      <p className="mt-3 font-caption text-[11px] uppercase tracking-[0.15em] text-gold">
        Mitigating Move
      </p>
      <p className="mt-1 font-body text-[15px] leading-relaxed text-white/85">
        {problem.mitigating_move}
      </p>
    </article>
  );
}

export function HeroViewport({
  composerText,
  onComposerTextChange,
  onAnalyze,
  isAnalyzing,
  analysisError,
  diagnosticResult,
  onViewCompanyDetails,
}: HeroViewportProps) {
  const [displayedHeadline, setDisplayedHeadline] = useState("");

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      i += 1;
      setDisplayedHeadline(HEADLINE.slice(0, i));
      if (i >= HEADLINE.length) {
        clearInterval(interval);
      }
    }, TYPEWRITER_INTERVAL_MS);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="hero-body relative z-20 h-[calc(100%-72px)] overflow-y-auto">
      <div className="mx-auto flex min-h-full w-full max-w-5xl flex-col items-center justify-center px-4 py-8 sm:px-6 sm:py-10">
        <p className="mb-5 font-caption text-[10px] uppercase tracking-[0.18em] text-gold/72">
          Apex Motus &mdash; Business Growth Advisory &middot; South Africa
        </p>

        <h1 className="max-w-4xl text-balance text-center font-heading text-[clamp(30px,6vw,72px)] leading-tight text-white">
          {displayedHeadline}
          <span
            className="ml-0.5 inline-block h-[1em] w-[2px] translate-y-[0.1em] bg-gold align-middle"
            style={{ animation: "blink 0.9s step-end infinite" }}
          />
        </h1>

        <div className="mt-4 max-w-2xl text-center">
          <p className="font-body text-[16px] leading-relaxed text-white/65 sm:text-[18px]">
            We help South African businesses remove what&rsquo;s slowing them down.
          </p>
          <p className="mt-1 font-body text-[15px] leading-relaxed text-gold/80">
            If none of our 5 problems are accurate &mdash; coffee&rsquo;s on us.
          </p>
        </div>

        <div className="mt-6 w-full sm:mt-8">
          <FactsTextarea
            value={composerText}
            onChange={onComposerTextChange}
            onSubmit={onAnalyze}
            isLoading={isAnalyzing}
          />
        </div>

        <SuggestionPills currentValue={composerText} onSelect={onComposerTextChange} />

        {isAnalyzing ? (
          <p className="mt-3 text-center font-body text-[15px] text-gold">
            Analysing operational, strategic, and scaling risks…
          </p>
        ) : null}

        {analysisError ? (
          <p className="mt-3 max-w-3xl text-center font-body text-[15px] text-red-200">
            {analysisError}
          </p>
        ) : null}

        {diagnosticResult ? (
          <section className="mt-6 w-full max-w-4xl space-y-4 rounded-[4px] border border-gold/30 bg-navy/55 p-4 sm:p-6">
            <div>
              <h3 className="font-caption text-[11px] uppercase tracking-[0.15em] text-gold">
                Business Context
              </h3>
              <p className="mt-2 font-body text-[16px] text-white/85">
                {diagnosticResult.business_context}
              </p>
            </div>

            <div>
              <h3 className="font-caption text-[11px] uppercase tracking-[0.15em] text-gold">
                Strategic Posture
              </h3>
              <p className="mt-2 font-body text-[16px] text-white/85">
                {diagnosticResult.strategic_posture}
              </p>
            </div>

            <div className="space-y-3">
              <h3 className="font-caption text-[11px] uppercase tracking-[0.15em] text-gold">
                5 Critical Problems
              </h3>
              <div className="space-y-3">
                {diagnosticResult.critical_problems.map((problem, index) => (
                  <ProblemCard key={`${problem.title}-${index}`} problem={problem} />
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-caption text-[11px] uppercase tracking-[0.15em] text-gold">
                Closing Directive
              </h3>
              <p className="mt-2 font-body text-[15px] text-white/85">
                {diagnosticResult.closing_directive}
              </p>
            </div>
          </section>
        ) : null}

        <button
          type="button"
          onClick={onViewCompanyDetails}
          className="mt-6 rounded-[4px] border border-gold/50 bg-gold/10 px-4 py-2 font-caption text-[10px] font-semibold uppercase tracking-widest2 text-gold transition-colors hover:bg-gold/20 sm:mt-8 sm:px-5 sm:text-[11px]"
        >
          View Company Details
        </button>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Verify full TypeScript build passes**

Run: `npx tsc --noEmit 2>&1`

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/hero/HeroViewport.tsx
git commit -m "feat: rewrite HeroViewport with typewriter, FactsTextarea, SuggestionPills, new result rendering"
```

---

### Task 9: Delete Old Components

**Files:**
- Delete: `src/components/hero/ChatInput.tsx`
- Delete: `src/components/hero/SuggestionChips.tsx`

- [ ] **Step 1: Delete the replaced files**

```bash
rm src/components/hero/ChatInput.tsx
rm src/components/hero/SuggestionChips.tsx
```

- [ ] **Step 2: Verify no remaining imports of deleted files**

Run: `grep -r "ChatInput\|SuggestionChips" src/ --include="*.tsx" --include="*.ts"`

Expected: no output (zero matches).

- [ ] **Step 3: Full build check**

Run: `npx tsc --noEmit 2>&1`

Expected: clean output, zero errors.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "chore: delete ChatInput and SuggestionChips (replaced by FactsTextarea and SuggestionPills)"
```

---

## Self-Review

**Spec coverage check:**

| Spec requirement | Covered in task |
|---|---|
| Aurora background — 3 CSS blob divs, no JS | Task 3 (CSS) + Task 7 (JSX) |
| Typewriter headline at 38ms/char, blinking cursor | Task 8 |
| Eyebrow line copy above h1 | Task 8 |
| Tagline — two lines below h1 | Task 8 |
| `FactsTextarea` — auto-grow, max 200px, send inside | Task 4 |
| Fact counter (splits on `.`, `\n`, etc.) | Task 4 |
| Cmd/Ctrl+Enter submit | Task 4 |
| Send button disabled when `< 20 chars` or loading | Task 4 |
| `SuggestionPills` — 4 from 50-item pool, Fisher-Yates | Task 5 |
| Click pill appends with smart separator logic | Task 5 |
| 50-item suggestions pool | Task 2 |
| API accepts `{ text }` not `{ facts[] }` | Task 6 |
| Validation: `text.trim().length >= 20` | Task 6 |
| CEO persona system prompt | Task 6 |
| New JSON schema: `the_exposure`, `ceo_perspective`, `mitigating_move` | Task 6 |
| `risk_type: "execution" | "structural"` badge | Task 8 |
| Result rendering: new field names | Task 8 |
| Delete `ChatInput.tsx` and `SuggestionChips.tsx` | Task 9 |
| Types centralized in `types.ts` | Task 1 |

**Type consistency check:** `DiagnosticResponse` and `CriticalProblem` are imported from `types.ts` in `HeroShell`, `HeroViewport`, and `route.ts` — no duplication. All field names (`the_exposure`, `ceo_perspective`, `mitigating_move`, `business_context`, `strategic_posture`, `closing_directive`, `critical_problems`) are consistent across schema, type guard, TypeScript types, and JSX rendering.
