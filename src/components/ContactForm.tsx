"use client";

import { useState } from "react";
import { Input, Textarea, Button, Select, Option } from "@material-tailwind/react";

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    topic: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Form will be handled by Netlify Forms automatically
    // The form element needs to have the data-netlify attribute
  };

  return (
    <form
      name="contact"
      method="POST"
      data-netlify="true"
      onSubmit={handleSubmit}
      className="space-y-6 max-w-2xl mx-auto bg-ink/80 p-8 rounded-xl shadow-lg border border-slate/20"
    >
      <input type="hidden" name="form-name" value="contact" />
      
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

      <Button type="submit" color="amber" size="lg" fullWidth className="mt-4" placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} onResize={undefined} onResizeCapture={undefined}>
        Send Message
      </Button>
    </form>
  );
}
