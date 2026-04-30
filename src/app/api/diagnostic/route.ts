import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
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

const SYSTEM_PROMPT = `Return valid JSON matching the provided schema exactly. No markdown, no prose outside the JSON.`;

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const text = extractText(body);
  if (!text) {
    return NextResponse.json(
      { error: `Provide a text description of at least ${MIN_TEXT_CHARS} characters.` },
      { status: 400 },
    );
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "ANTHROPIC_API_KEY is missing. Add it to your environment configuration." },
      { status: 500 },
    );
  }

  const client = new Anthropic({ apiKey });

  let anthropicResponse;
  try {
    anthropicResponse = await client.messages.create({
      model: "claude-opus-4-7",
      max_tokens: 4096,
      thinking: { type: "adaptive" },
      system: SYSTEM_PROMPT,
      messages: [{ role: "user", content: text }],
      // @ts-expect-error – output_config is a newer field not yet in the SDK types
      output_config: {
        format: {
          type: "json_schema",
          json_schema: {
            name: "diagnostic_response",
            strict: true,
            schema: diagnosticResponseJsonSchema,
          },
        },
      },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json(
      { error: "Anthropic request failed", details: message },
      { status: 502 },
    );
  }

  const textBlock = anthropicResponse.content.find((b) => b.type === "text");
  const content = textBlock && "text" in textBlock ? textBlock.text : undefined;

  if (typeof content !== "string") {
    return NextResponse.json(
      { error: "Anthropic returned an unexpected response format." },
      { status: 502 },
    );
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(content);
  } catch {
    return NextResponse.json(
      { error: "Anthropic response was not valid JSON.", details: content },
      { status: 502 },
    );
  }

  if (!isDiagnosticResponse(parsed)) {
    return NextResponse.json(
      { error: "Anthropic response did not match required diagnostic schema.", details: parsed },
      { status: 502 },
    );
  }

  return NextResponse.json(parsed);
}
