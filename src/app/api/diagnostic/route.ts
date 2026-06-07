import { NextResponse } from "next/server";

const MIN_TEXT_CHARS = 20;
const OPENAI_RESPONSES_URL = "https://api.openai.com/v1/responses";

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

const SYSTEM_PROMPT = `You are a veteran Fortune 500 CEO and strategic consultant. Respond ONLY in clean GitHub-flavored Markdown — never HTML, and do NOT wrap the whole response in a code fence. Use "##" headings for sections (including one per numbered problem), "**bold**" for inline labels such as **The Exposure:**, and "---" horizontal rules between major sections. Keep it well structured and easy to read.`;

const EMAILJS_SEND_URL = "https://api.emailjs.com/api/v1.0/email/send";

// Shown to the visitor whenever the AI diagnostic can't be produced. It hides
// provider/internal details on purpose and reassures them the enquiry was
// captured — the real reason is logged server-side and emailed to the inbox.
const ENQUIRY_FALLBACK_MESSAGE =
  "We hit a snag generating your instant diagnostic, but Apex Motus has received your enquiry and will be in touch shortly.";

// Builds the "RESULT" portion of the email for an enquiry whose AI diagnostic
// could NOT be generated (quota, outage, malformed response, etc.). The full
// prompt is still included above it, so the lead is fully actionable for manual
// follow-up.
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
// "To Email" field. The enquiry template only has a {{message}} placeholder, so
// the full prompt sent to the AI AND the `result` (the diagnosis on success, or
// a failure note when the AI step fails) are combined into that single field.
// NEVER throws — a notification problem must not change what the visitor sees,
// and it is called from both the success and failure paths.
async function notifyLead(prompt: string, result: string): Promise<void> {
  const serviceId = process.env.EMAILJS_SERVICE_ID;
  const templateId = process.env.EMAILJS_DIAGNOSTIC_TEMPLATE_ID;
  const publicKey = process.env.EMAILJS_PUBLIC_KEY;
  const privateKey = process.env.EMAILJS_PRIVATE_KEY;

  if (!serviceId || !templateId || !publicKey || !privateKey) {
    console.warn("Diagnostic email skipped: EmailJS env vars are not fully configured.");
    return;
  }

  const message = [
    "=== PROMPT SENT TO THE AI ===",
    prompt,
    "",
    "=== RESULT ===",
    "",
    result,
  ].join("\n");

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
  // notifyLead combines this with the result into the email's {{message}} field.
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
        max_output_tokens: 6000,
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
