"use client";

import { FormEvent } from "react";

export function ContactSection() {
  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
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
              placeholder="Full name"
              className="h-12 border-b-2 border-fg-primary bg-white px-0 font-body text-[15px] text-fg-primary placeholder:text-fg-secondary/40 outline-none"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="font-caption text-[10px] tracking-widest2 text-fg-secondary uppercase">
              Your Email
            </label>
            <input
              type="email"
              placeholder="email@company.com"
              className="h-12 border-b-2 border-fg-primary bg-white px-0 font-body text-[15px] text-fg-primary placeholder:text-fg-secondary/40 outline-none"
            />
          </div>
          <button
            type="submit"
            className="mt-4 inline-flex h-[52px] w-[220px] items-center justify-center rounded-[4px] bg-navy font-caption text-[11px] font-semibold tracking-widest3 text-gold transition-colors hover:bg-royal"
          >
            SEND MESSAGE
          </button>
        </form>
      </div>
    </section>
  );
}
