"use client";

import { useState } from "react";
import { Input, Textarea, Button, Select, Option } from "@material-tailwind/react";

type SubmitState = "idle" | "success" | "error";

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    topic: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitState, setSubmitState] = useState<SubmitState>("idle");
  const [submitMessage, setSubmitMessage] = useState("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const send = async () => {
      setIsSubmitting(true);
      setSubmitState("idle");
      setSubmitMessage("");

      try {
        const response = await fetch("/api/contact", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });

        const result = (await response.json()) as { error?: string };

        if (!response.ok) {
          setSubmitState("error");
          setSubmitMessage(
            result.error ?? "We could not send your message. Please try again.",
          );
          return;
        }

        setSubmitState("success");
        setSubmitMessage("Message sent. We will get back to you shortly.");
        setFormData({
          name: "",
          email: "",
          company: "",
          topic: "",
          message: "",
        });
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
    <form
      onSubmit={handleSubmit}
      className="space-y-6 max-w-2xl mx-auto bg-ink/80 p-8 rounded-xl shadow-lg border border-slate/20"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Input
            color="cyan"
            label="Name"
            name="name"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            crossOrigin={undefined}
          />
        </div>
        <div>
          <Input
            color="cyan"
            label="Email"
            name="email"
            type="email"
            required
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            crossOrigin={undefined}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Input
            color="cyan"
            label="Company (optional)"
            name="company"
            value={formData.company}
            onChange={(e) => setFormData({ ...formData, company: e.target.value })}
            crossOrigin={undefined}
          />
        </div>
        <div>
          <Select
            color="cyan"
            label="Topic"
            name="topic"
            required
            value={formData.topic}
            onChange={(value) => setFormData({ ...formData, topic: value || "" })}
          >
            <Option value="Partnership">Partnership</Option>
            <Option value="Portfolio Inquiry">Portfolio Inquiry</Option>
            <Option value="General">General</Option>
          </Select>
        </div>
      </div>

      <div>
        <Textarea
          color="cyan"
          label="Message"
          name="message"
          required
          rows={6}
          value={formData.message}
          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
        />
      </div>

      <Button
        type="submit"
        color="amber"
        size="lg"
        fullWidth
        className="mt-4"
        disabled={isSubmitting}
        placeholder={undefined}
        onPointerEnterCapture={undefined}
        onPointerLeaveCapture={undefined}
        onResize={undefined}
        onResizeCapture={undefined}
      >
        {isSubmitting ? "Sending..." : "Send Message"}
      </Button>
      {submitState !== "idle" ? (
        <p
          className={`text-sm ${
            submitState === "success" ? "text-cyan" : "text-red-300"
          }`}
        >
          {submitMessage}
        </p>
      ) : null}
    </form>
  );
}
