"use client";

import { FormEvent, useState } from "react";

export function ContactSection() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitState, setSubmitState] = useState<"idle" | "success" | "error">("idle");
  const [submitMessage, setSubmitMessage] = useState("");

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const send = async () => {
      setIsSubmitting(true);
      setSubmitState("idle");
      setSubmitMessage("");

      try {
        const response = await fetch("/api/contact", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name,
            email,
            message,
          }),
        });

        const result = (await response.json()) as { error?: string };

        if (!response.ok) {
          setSubmitState("error");
          setSubmitMessage(result.error ?? "We could not send your message. Please try again.");
          return;
        }

        setSubmitState("success");
        setSubmitMessage("Message sent. We will get back to you shortly.");
        setName("");
        setEmail("");
        setMessage("");
      } catch {
        setSubmitState("error");
        setSubmitMessage("Network error. Please try again.");
      } finally {
        setIsSubmitting(false);
      }
    };

    void send();
  };

  return (
    <section
      id="contact"
      className="overflow-visible border-b border-[#d4af37]/20 bg-surface-primary py-16"
    >
      <p className="px-6 pt-4 font-caption text-[11px] tracking-widest3 text-fg-secondary md:px-10 lg:px-20">
        05 / CONTACT
      </p>

      <h2 className="monumental-heading mt-6 uppercase">Contact</h2>

      <div className="mx-6 mt-6 h-[2px] w-14 bg-gold md:mx-10 lg:mx-20" />

      <div className="grid gap-12 px-6 pb-8 pt-12 md:px-10 lg:grid-cols-2 lg:gap-20 lg:px-20">
        <div className="flex flex-col gap-5">
          <span className="font-caption text-[10px] tracking-widest3 text-royal">
            START A CONVERSATION
          </span>
          <p className="font-body text-[17px] leading-[1.8] text-fg-secondary">
            Share your goals, and we will schedule a conversation around practical next steps for
            your business.
          </p>
          <a
            href="mailto:hello@apexmotus.com"
            className="font-caption text-[13px] tracking-[0.1em] text-navy"
          >
            hello@apexmotus.com
          </a>
        </div>

        <form onSubmit={onSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label className="font-caption text-[10px] tracking-widest2 text-fg-secondary uppercase">
              Your Name
            </label>
            <input
              name="name"
              placeholder="Full name"
              required
              value={name}
              onChange={(event) => setName(event.target.value)}
              className="h-12 border-b-2 border-fg-primary bg-white px-0 font-body text-[15px] text-fg-primary placeholder:text-fg-secondary/40 outline-none"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="font-caption text-[10px] tracking-widest2 text-fg-secondary uppercase">
              Your Email
            </label>
            <input
              name="email"
              type="email"
              placeholder="email@company.com"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="h-12 border-b-2 border-fg-primary bg-white px-0 font-body text-[15px] text-fg-primary placeholder:text-fg-secondary/40 outline-none"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="font-caption text-[10px] tracking-widest2 text-fg-secondary uppercase">
              Message
            </label>
            <textarea
              name="message"
              required
              rows={5}
              placeholder="Tell us what you need help with"
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              className="min-h-[150px] resize-y border-b-2 border-fg-primary bg-white px-0 py-3 font-body text-[15px] leading-[1.7] text-fg-primary placeholder:text-fg-secondary/40 outline-none"
            />
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-4 inline-flex h-[52px] w-[220px] items-center justify-center rounded-[4px] bg-navy font-caption text-[11px] font-semibold tracking-widest3 text-gold transition-colors hover:bg-royal disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? "SENDING..." : "SEND MESSAGE"}
          </button>
          {submitState !== "idle" ? (
            <p
              className={`font-body text-[14px] ${
                submitState === "success" ? "text-royal" : "text-[#a32f2f]"
              }`}
            >
              {submitMessage}
            </p>
          ) : null}
        </form>
      </div>
    </section>
  );
}
