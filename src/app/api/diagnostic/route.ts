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
