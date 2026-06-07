import { NextResponse } from "next/server";
import type { CriticalProblem, DiagnosticResponse, RiskCategory, SeverityLevel, RiskType } from "@/components/hero/types";

const MIN_TEXT_CHARS = 20;
const OPENAI_RESPONSES_URL = "https://api.openai.com/v1/responses";

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

const EMAILJS_SEND_URL = "https://api.emailjs.com/api/v1.0/email/send";

// Shown to the visitor whenever the AI diagnostic can't be produced. It hides
// provider/internal details on purpose and reassures them the enquiry was
// captured — the real reason is logged server-side and emailed to the inbox.
const ENQUIRY_FALLBACK_MESSAGE =
  "We hit a snag generating your instant diagnostic, but Apex Motus has received your enquiry and will be in touch shortly.";

// Formats the structured AI diagnosis into a readable plain-text block for the
// {{message}} field. EmailJS escapes template variables, so this must stay
// plain text (no HTML); line breaks render only if the template's {{message}}
// container uses `white-space: pre-wrap`. This is the main place to shape what
// lands in the inbox — adjust labels/ordering here to taste.
function formatDiagnosticResponse(response: DiagnosticResponse): string {
  const problems = response.critical_problems
    .map((p, i) =>
      [
        `${i + 1}. ${p.title}  [${p.category.replace(/_/g, " ")} | ${p.severity} severity | ${p.risk_type} risk]`,
        `   Exposure: ${p.the_exposure}`,
        `   CEO Perspective: "${p.ceo_perspective}"`,
        `   Mitigating Move: ${p.mitigating_move}`,
      ].join("\n"),
    )
    .join("\n\n");

  return [
    `Business Context: ${response.business_context}`,
    "",
    `Strategic Posture: ${response.strategic_posture}`,
    "",
    "5 Critical Problems:",
    problems,
    "",
    `Closing Directive: ${response.closing_directive}`,
  ].join("\n");
}

// Builds the {{message}} body for an enquiry whose AI diagnostic could NOT be
// generated (quota, outage, malformed response, etc.). The full prompt is still
// in {{facts}}, so the lead is fully actionable for manual follow-up.
function buildUnavailableMessage(reason: string): string {
  return [
    "The AI diagnostic could not be generated for this enquiry, so no problems",
    "are listed below. The prompt above was still captured — please follow up",
    "manually.",
    "",
    `Reason: ${reason}`,
  ].join("\n");
}

// Best-effort lead email to the inbox configured in the EmailJS template's
// "To Email" field. Sends the full prompt that was sent to the AI in {{facts}}
// and `message` in {{message}} (the diagnosis on success, or a failure note
// when the AI step fails). NEVER throws — a notification problem must not change
// what the visitor sees, and it is called from both the success and failure paths.
async function notifyLead(prompt: string, message: string): Promise<void> {
  const serviceId = process.env.EMAILJS_SERVICE_ID;
  const templateId = process.env.EMAILJS_DIAGNOSTIC_TEMPLATE_ID;
  const publicKey = process.env.EMAILJS_PUBLIC_KEY;
  const privateKey = process.env.EMAILJS_PRIVATE_KEY;

  if (!serviceId || !templateId || !publicKey || !privateKey) {
    console.warn("Diagnostic email skipped: EmailJS env vars are not fully configured.");
    return;
  }

  try {
    const res = await fetch(EMAILJS_SEND_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        service_id: serviceId,
        template_id: templateId,
        user_id: publicKey,
        accessToken: privateKey,
        template_params: {
          name: "a Hero Diagnostic visitor",
          facts: prompt,
          message,
        },
      }),
    });

    if (!res.ok) {
      console.error(`Diagnostic email failed: EmailJS ${res.status}: ${await res.text()}`);
    }
  } catch (err) {
    console.error("Diagnostic email notification failed:", err);
  }
}

function getOpenAiApiKey(): string | undefined {
  return process.env.OPEN_AI_API ?? process.env.OPENAI_API_KEY;
}

// Pulls a short, human-readable reason out of an OpenAI error payload (or any
// value) for the failure-notification email.
function describeError(detail: unknown): string {
  if (typeof detail === "string") return detail;
  if (detail && typeof detail === "object") {
    const message = (detail as { error?: { message?: unknown } }).error?.message;
    if (typeof message === "string") return message;
  }
  return "Unknown error.";
}

function extractOutputText(response: unknown): string | undefined {
  if (typeof response !== "object" || response === null) return undefined;

  const maybeOutputText = (response as { output_text?: unknown }).output_text;
  if (typeof maybeOutputText === "string") {
    return maybeOutputText;
  }

  const output = (response as { output?: unknown }).output;
  if (!Array.isArray(output)) return undefined;

  for (const item of output) {
    if (typeof item !== "object" || item === null) continue;
    const content = (item as { content?: unknown }).content;
    if (!Array.isArray(content)) continue;

    for (const contentItem of content) {
      if (typeof contentItem !== "object" || contentItem === null) continue;
      const text = (contentItem as { text?: unknown }).text;
      if (typeof text === "string") {
        return text;
      }
    }
  }

  return undefined;
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

  // The exact messages sent to OpenAI — defined once and reused for both the
  // real API call and the email transcript, so the two can never drift apart.
  const messages = [
    { role: "system", content: SYSTEM_PROMPT },
    { role: "user", content: text },
  ];

  // A readable transcript of the full prompt (system + user), captured up front
  // so we can forward it on EVERY exit path below — even when the AI call fails.
  // This populates the email's {{facts}} field.
  const prompt = messages.map((m) => `[${m.role}]\n${m.content}`).join("\n\n");

  const apiKey = getOpenAiApiKey();
  if (!apiKey) {
    console.error("Diagnostic failed: OPEN_AI_API / OPENAI_API_KEY is not set.");
    await notifyLead(prompt, buildUnavailableMessage("Diagnostic service is not configured (missing API key)."));
    return NextResponse.json({ error: ENQUIRY_FALLBACK_MESSAGE }, { status: 502 });
  }

  const model = process.env.OPENAI_MODEL ?? "gpt-5.4-mini";

  let openAiResponse: unknown;
  try {
    const response = await fetch(OPENAI_RESPONSES_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        input: messages,
        text: {
          format: {
            type: "json_schema",
            name: "diagnostic_response",
            strict: true,
            schema: diagnosticResponseJsonSchema,
          },
        },
        max_output_tokens: 4096,
      }),
    });

    openAiResponse = await response.json().catch(() => null);

    if (!response.ok) {
      console.error("Diagnostic failed (AI request):", describeError(openAiResponse));
      await notifyLead(prompt, buildUnavailableMessage(describeError(openAiResponse)));
      return NextResponse.json({ error: ENQUIRY_FALLBACK_MESSAGE }, { status: 502 });
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("Diagnostic failed (network/exception):", message);
    await notifyLead(prompt, buildUnavailableMessage(message));
    return NextResponse.json({ error: ENQUIRY_FALLBACK_MESSAGE }, { status: 502 });
  }

  const content = extractOutputText(openAiResponse);

  if (typeof content !== "string") {
    console.error("Diagnostic failed: AI returned an unexpected response format.");
    await notifyLead(prompt, buildUnavailableMessage("AI returned an unexpected response format."));
    return NextResponse.json({ error: ENQUIRY_FALLBACK_MESSAGE }, { status: 502 });
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(content);
  } catch {
    console.error("Diagnostic failed: AI response was not valid JSON.");
    await notifyLead(prompt, buildUnavailableMessage("AI response was not valid JSON."));
    return NextResponse.json({ error: ENQUIRY_FALLBACK_MESSAGE }, { status: 502 });
  }

  if (!isDiagnosticResponse(parsed)) {
    console.error("Diagnostic failed: AI response did not match the required schema.");
    await notifyLead(prompt, buildUnavailableMessage("AI response did not match the required diagnostic format."));
    return NextResponse.json({ error: ENQUIRY_FALLBACK_MESSAGE }, { status: 502 });
  }

  // Success: forward the enquiry with the full diagnosis. notifyLead is
  // best-effort and never throws, so an email problem can't break the result.
  await notifyLead(prompt, formatDiagnosticResponse(parsed));

  return NextResponse.json(parsed);
}
