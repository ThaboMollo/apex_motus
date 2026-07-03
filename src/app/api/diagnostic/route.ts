import { NextResponse } from "next/server";

const MIN_TEXT_CHARS = 20;
const OPENAI_COMPLETIONS_URL = "https://api.openai.com/v1/chat/completions";
const GEMINI_BASE_URL = "https://generativelanguage.googleapis.com/v1beta/models";

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

// Pulls a short, human-readable reason out of an AI error payload (or any
// value) for the failure-notification email. Works for both OpenAI and Gemini error formats.
function describeError(detail: unknown): string {
  if (typeof detail === "string") return detail;
  if (detail && typeof detail === "object") {
    const message = (detail as { error?: { message?: unknown } }).error?.message;
    if (typeof message === "string") return message;
  }
  return "Unknown error.";
}

function extractOpenAiText(response: unknown): string | undefined {
  if (typeof response !== "object" || response === null) return undefined;
  const choices = (response as { choices?: unknown }).choices;
  if (!Array.isArray(choices) || choices.length === 0) return undefined;
  const message = choices[0]?.message;
  if (message && typeof message === "object" && "content" in message) {
    const content = message.content;
    if (typeof content === "string") {
      return content;
    }
  }
  return undefined;
}

function extractGeminiText(response: unknown): string | undefined {
  if (typeof response !== "object" || response === null) return undefined;
  const candidates = (response as { candidates?: unknown }).candidates;
  if (!Array.isArray(candidates) || candidates.length === 0) return undefined;
  const content = candidates[0]?.content;
  if (content && typeof content === "object" && "parts" in content) {
    const parts = content.parts;
    if (Array.isArray(parts) && parts.length > 0) {
      const text = parts[0]?.text;
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

  let markdown: string | undefined;
  let openAiError: string | undefined;
  let geminiError: string | undefined;

  // 1. Attempt OpenAI
  const openAiApiKey = getOpenAiApiKey();
  if (!openAiApiKey) {
    openAiError = "OpenAI API key is not configured.";
  } else {
    const model = process.env.OPENAI_MODEL ?? "gpt-4o-mini";
    try {
      const response = await fetch(OPENAI_COMPLETIONS_URL, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${openAiApiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model,
          messages,
          max_tokens: 4000,
        }),
      });

      const openAiResponse = await response.json().catch(() => null);

      if (!response.ok) {
        openAiError = `OpenAI API returned status ${response.status}: ${describeError(openAiResponse)}`;
      } else {
        const textResult = extractOpenAiText(openAiResponse);
        if (typeof textResult === "string" && textResult.trim().length > 0) {
          markdown = textResult.trim();
        } else {
          openAiError = "OpenAI returned an empty or malformed completion response.";
        }
      }
    } catch (err) {
      openAiError = err instanceof Error ? err.message : String(err);
    }
  }

  // 2. Attempt Gemini Fallback if OpenAI failed
  if (!markdown) {
    console.warn(`OpenAI diagnostic attempt failed. Falling back to Gemini. Error details: ${openAiError}`);
    
    const geminiApiKey = process.env.GEMINI_API_KEY;
    if (!geminiApiKey) {
      geminiError = "Gemini API key is not configured.";
    } else {
      const geminiModel = process.env.GEMINI_MODEL ?? "gemini-2.5-flash";
      try {
        const response = await fetch(`${GEMINI_BASE_URL}/${geminiModel}:generateContent?key=${geminiApiKey}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            contents: [
              {
                role: "user",
                parts: [
                  {
                    text: text,
                  },
                ],
              },
            ],
            systemInstruction: {
              parts: [
                {
                  text: SYSTEM_PROMPT,
                },
              ],
            },
            generationConfig: {
              maxOutputTokens: 4000,
            },
          }),
        });

        const geminiResponse = await response.json().catch(() => null);

        if (!response.ok) {
          geminiError = `Gemini API returned status ${response.status}: ${describeError(geminiResponse)}`;
        } else {
          const textResult = extractGeminiText(geminiResponse);
          if (typeof textResult === "string" && textResult.trim().length > 0) {
            markdown = textResult.trim();
          } else {
            geminiError = "Gemini returned an empty or malformed completion response.";
          }
        }
      } catch (err) {
        geminiError = err instanceof Error ? err.message : String(err);
      }
    }
  }

  // 3. Handle outcome
  if (!markdown) {
    // Both failed
    const combinedReason = `OpenAI Error: [${openAiError || "unknown"}]. Gemini Error: [${geminiError || "unknown"}].`;
    console.error("Diagnostic generation failed for all configured AI providers:", combinedReason);
    
    await notifyLead(prompt, buildUnavailableMessage(combinedReason));
    return NextResponse.json({ error: ENQUIRY_FALLBACK_MESSAGE }, { status: 502 });
  }

  // Success (either OpenAI or Gemini)
  await notifyLead(prompt, markdown);
  return NextResponse.json({ markdown });
}
