"use client";

import ContactForm from "@/components/ContactForm";

export default function Contact() {
  return (
    <section className="py-20">
      <div className="container mx-auto px-5 max-w-7xl">
        <div className="mb-12 text-center">
          <h1 className="font-heading font-bold text-4xl md:text-5xl mb-4">Contact</h1>
          <p className="text-slate text-lg max-w-2xl mx-auto">
            Use the form below. We respond to relevant partnership and portfolio conversations.
          </p>
        </div>

        <ContactForm />
      </div>
    </section>
  );
}
