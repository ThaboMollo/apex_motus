import { NextResponse } from "next/server";

const FACT_COUNT = 5;
const MIN_FACT_CHARS = 8;

type DiagnosticRisk = {
  title: string;
  category:
    | "operations"
    | "sales"
    | "team"
    | "finance"
    | "technology"
    | "customer_experience"
    | "strategy"
    | "compliance";
  severity: "low" | "medium" | "high";
  likelihood_currently_happening: "low" | "medium" | "high";
  why_it_could_happen: string;
  current_warning_signs: string[];
  impact_if_ignored: string;
  recommended_next_step: string;
};

type DiagnosticResponse = {
  business_summary: string;
  venture_capitalist_view: string;
  top_5_risks: DiagnosticRisk[];
  final_assessment: string;
  call_to_action: string;
};

const diagnosticResponseJsonSchema = {
  type: "object",
  additionalProperties: false,
  required: [
    "business_summary",
    "venture_capitalist_view",
    "top_5_risks",
    "final_assessment",
    "call_to_action",
  ],
  properties: {
    business_summary: { type: "string" },
    venture_capitalist_view: { type: "string" },
    final_assessment: { type: "string" },
    call_to_action: { type: "string" },
    top_5_risks: {
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
          "likelihood_currently_happening",
          "why_it_could_happen",
          "current_warning_signs",
          "impact_if_ignored",
          "recommended_next_step",
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
          likelihood_currently_happening: {
            type: "string",
            enum: ["low", "medium", "high"],
          },
          why_it_could_happen: { type: "string" },
          current_warning_signs: {
            type: "array",
            minItems: 2,
            items: { type: "string" },
          },
          impact_if_ignored: { type: "string" },
          recommended_next_step: { type: "string" },
        },
      },
    },
  },
} as const;

function normalizeFacts(payload: unknown): string[] | null {
  if (typeof payload !== "object" || payload === null || !("facts" in payload)) {
    return null;
  }

  const { facts } = payload as { facts?: unknown };
  if (!Array.isArray(facts) || facts.length !== FACT_COUNT) {
    return null;
  }

  const trimmedFacts = facts.map((fact) => (typeof fact === "string" ? fact.trim() : ""));
  const allValid = trimmedFacts.every((fact) => fact.length >= MIN_FACT_CHARS);
  return allValid ? trimmedFacts : null;
}

function isSeverity(value: unknown): value is "low" | "medium" | "high" {
  return value === "low" || value === "medium" || value === "high";
}

function isRiskCategory(value: unknown): value is DiagnosticRisk["category"] {
  return (
    value === "operations" ||
    value === "sales" ||
    value === "team" ||
    value === "finance" ||
    value === "technology" ||
    value === "customer_experience" ||
    value === "strategy" ||
    value === "compliance"
  );
}

function isDiagnosticResponse(data: unknown): data is DiagnosticResponse {
  if (typeof data !== "object" || data === null) {
    return false;
  }

  const candidate = data as Partial<DiagnosticResponse>;
  if (
    typeof candidate.business_summary !== "string" ||
    typeof candidate.venture_capitalist_view !== "string" ||
    typeof candidate.final_assessment !== "string" ||
    typeof candidate.call_to_action !== "string" ||
    !Array.isArray(candidate.top_5_risks) ||
    candidate.top_5_risks.length !== FACT_COUNT
  ) {
    return false;
  }

  return candidate.top_5_risks.every((risk) => {
    if (typeof risk !== "object" || risk === null) {
      return false;
    }
    const castRisk = risk as Partial<DiagnosticRisk>;
    return (
      typeof castRisk.title === "string" &&
      isRiskCategory(castRisk.category) &&
      isSeverity(castRisk.severity) &&
      isSeverity(castRisk.likelihood_currently_happening) &&
      typeof castRisk.why_it_could_happen === "string" &&
      Array.isArray(castRisk.current_warning_signs) &&
      castRisk.current_warning_signs.every((sign) => typeof sign === "string") &&
      typeof castRisk.impact_if_ignored === "string" &&
      typeof castRisk.recommended_next_step === "string"
    );
  });
}

export async function POST(request: Request) {
  const facts = normalizeFacts(await request.json());
  if (!facts) {
    return NextResponse.json(
      {
        error:
          "Provide exactly 5 facts. Each fact must be at least 8 characters after trimming whitespace.",
      },
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

  const systemPrompt = [
    "You are a senior business diagnostic assistant.",
    "Analyze the supplied 5 business facts and identify the top 5 risks.",
    "You must return exactly 5 risks and strictly follow the JSON schema.",
    "Be concrete, strategic, and concise.",
  ].join(" ");

  const userPrompt = [
    "Business facts:",
    ...facts.map((fact, index) => `${index + 1}. ${fact}`),
    "",
    "Return a strategic diagnostic response.",
  ].join("\n");

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
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
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
