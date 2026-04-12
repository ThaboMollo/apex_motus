import { NextResponse } from "next/server";

type ContactPayload = {
  name: string;
  email: string;
  message: string;
};

function isNonEmpty(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function isEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function escapeHtml(input: string): string {
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function parsePayload(payload: unknown): ContactPayload | null {
  if (typeof payload !== "object" || payload === null) {
    return null;
  }

  const cast = payload as Partial<ContactPayload>;
  if (!isNonEmpty(cast.name) || !isNonEmpty(cast.email) || !isNonEmpty(cast.message)) {
    return null;
  }

  const normalized: ContactPayload = {
    name: cast.name.trim(),
    email: cast.email.trim(),
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
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
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

  const resendApiKey = process.env.RESEND_API_KEY;
  if (!resendApiKey) {
    return NextResponse.json(
      { error: "RESEND_API_KEY is missing. Add it to your environment configuration." },
      { status: 500 },
    );
  }

  const to = process.env.CONTACT_TO_EMAIL ?? "hello@apexmotus.com";
  const from = process.env.CONTACT_FROM_EMAIL ?? "Apex Motus <onboarding@resend.dev>";
  const safeName = escapeHtml(parsed.name);
  const safeEmail = escapeHtml(parsed.email);
  const safeMessage = escapeHtml(parsed.message).replace(/\n/g, "<br />");

  const resendResponse = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${resendApiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: [to],
      reply_to: parsed.email,
      subject: `New Apex Motus contact request from ${parsed.name}`,
      text: [`Name: ${parsed.name}`, `Email: ${parsed.email}`, "", "Message:", parsed.message].join("\n"),
      html: `
        <div>
          <p><strong>Name:</strong> ${safeName}</p>
          <p><strong>Email:</strong> ${safeEmail}</p>
          <p><strong>Message:</strong></p>
          <p>${safeMessage}</p>
        </div>
      `,
    }),
  });

  if (!resendResponse.ok) {
    const details = await resendResponse.text();
    return NextResponse.json(
      { error: "Failed to send message.", details },
      { status: resendResponse.status },
    );
  }

  return NextResponse.json({ ok: true });
}

