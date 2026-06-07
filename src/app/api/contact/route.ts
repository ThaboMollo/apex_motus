import { NextResponse } from "next/server";

type ContactPayload = {
  name: string;
  email: string;
  company?: string;
  topic?: string;
  message: string;
};

function isNonEmpty(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function isEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function parsePayload(payload: unknown): ContactPayload | null {
  if (typeof payload !== "object" || payload === null) {
    return null;
  }

  const cast = payload as Partial<ContactPayload>;
  if (
    !isNonEmpty(cast.name) ||
    !isNonEmpty(cast.email) ||
    !isNonEmpty(cast.message)
  ) {
    return null;
  }

  const normalized: ContactPayload = {
    name: cast.name.trim(),
    email: cast.email.trim(),
    company: isNonEmpty(cast.company) ? cast.company.trim() : undefined,
    topic: isNonEmpty(cast.topic) ? cast.topic.trim() : undefined,
    message: cast.message.trim(),
  };

  if (!isEmail(normalized.email)) {
    return null;
  }

  if (normalized.name.length < 2 || normalized.message.length < 10) {
    return null;
  }

  if (
    normalized.name.length > 120 ||
    normalized.email.length > 320 ||
    (normalized.company?.length ?? 0) > 160 ||
    (normalized.topic?.length ?? 0) > 120 ||
    normalized.message.length > 4000
  ) {
    return null;
  }

  return normalized;
}

export async function POST(request: Request) {
  let payload: unknown;

  try {
    payload = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid request body." },
      { status: 400 },
    );
  }

  const parsed = parsePayload(payload);
  if (!parsed) {
    return NextResponse.json(
      {
        error:
          "Please provide a valid name, email address, and a message with at least 10 characters.",
      },
      { status: 400 },
    );
  }

  const serviceId = process.env.EMAILJS_SERVICE_ID;
  const templateId = process.env.EMAILJS_TEMPLATE_ID;
  const publicKey = process.env.EMAILJS_PUBLIC_KEY;
  const privateKey = process.env.EMAILJS_PRIVATE_KEY;

  if (!serviceId || !templateId || !publicKey || !privateKey) {
    return NextResponse.json(
      {
        error:
          "EmailJS is not configured. Set EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, EMAILJS_PUBLIC_KEY, and EMAILJS_PRIVATE_KEY.",
      },
      { status: 500 },
    );
  }

  // EmailJS auto-escapes dynamic template variables before inserting them into
  // the HTML template, so we send raw (trimmed) values here — escaping them
  // ourselves would double-escape and surface "&amp;" in the delivered email.
  // Keys must match the {{placeholders}} in the EmailJS template. The template
  // currently uses {{name}}, {{full_name}}, {{email_address}}, and {{message}};
  // company and topic are sent too so you can add {{company}}/{{topic}} to the
  // template later without touching this code.
  const templateParams = {
    name: parsed.name,
    full_name: parsed.name,
    email_address: parsed.email,
    company: parsed.company ?? "Not provided",
    topic: parsed.topic ?? "General",
    message: parsed.message,
  };

  const emailjsResponse = await fetch(
    "https://api.emailjs.com/api/v1.0/email/send",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        service_id: serviceId,
        template_id: templateId,
        user_id: publicKey,
        accessToken: privateKey,
        template_params: templateParams,
      }),
    },
  );

  if (!emailjsResponse.ok) {
    const details = await emailjsResponse.text();
    return NextResponse.json(
      { error: "Failed to send message.", details },
      { status: emailjsResponse.status },
    );
  }

  return NextResponse.json({ ok: true });
}
