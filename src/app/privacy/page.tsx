"use client";

import { Card, CardBody } from "@material-tailwind/react";

export default function Privacy() {
  const lastUpdated = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <section className="py-20">
      <div className="container mx-auto px-5 max-w-4xl">
        <div className="mb-12">
          <h1 className="font-heading font-bold text-4xl md:text-5xl mb-4">Privacy Policy</h1>
          <p className="text-slate">Last updated: {lastUpdated}</p>
        </div>

        <Card className="bg-ink/80 border border-slate/20">
          <CardBody className="space-y-6">
            <div>
              <h2 className="font-heading font-bold text-2xl mb-3">Introduction</h2>
              <p className="text-slate">
                Apex Motus ("we", "our", "us") respects your privacy. This Policy explains how we
                collect, use, disclose, and protect personal information when you interact with our
                website and services.
              </p>
            </div>

            <div>
              <h2 className="font-heading font-bold text-2xl mb-3">Information We Collect</h2>
              <ul className="list-disc list-inside space-y-2 text-slate">
                <li>
                  <strong>Provided by you:</strong> name, email, company, and message content
                  submitted via forms.
                </li>
                <li>
                  <strong>Automatic:</strong> technical data (device, browser, pages visited) via
                  cookies or similar technologies.
                </li>
              </ul>
            </div>

            <div>
              <h2 className="font-heading font-bold text-2xl mb-3">How We Use Information</h2>
              <ul className="list-disc list-inside space-y-2 text-slate">
                <li>To respond to inquiries and provide requested information.</li>
                <li>To improve, secure, and operate our website and services.</li>
                <li>To comply with legal obligations and enforce our terms.</li>
              </ul>
            </div>

            <div>
              <h2 className="font-heading font-bold text-2xl mb-3">Legal Bases</h2>
              <p className="text-slate">
                We process personal data based on legitimate interests, consent (where applicable),
                and legal obligations.
              </p>
            </div>

            <div>
              <h2 className="font-heading font-bold text-2xl mb-3">Sharing</h2>
              <p className="text-slate">
                We do not sell personal data. We may share with service providers under contract,
                professional advisors, or authorities where required by law.
              </p>
            </div>

            <div>
              <h2 className="font-heading font-bold text-2xl mb-3">Data Retention</h2>
              <p className="text-slate">
                We keep personal data only as long as necessary for the purposes described or as
                required by law.
              </p>
            </div>

            <div>
              <h2 className="font-heading font-bold text-2xl mb-3">Security</h2>
              <p className="text-slate">
                We implement reasonable technical and organizational measures to protect data. No
                method is 100% secure.
              </p>
            </div>

            <div>
              <h2 className="font-heading font-bold text-2xl mb-3">Your Rights</h2>
              <p className="text-slate">
                Subject to applicable law, you may request access, correction, deletion, or
                restriction of your data. Contact us via the form.
              </p>
            </div>

            <div>
              <h2 className="font-heading font-bold text-2xl mb-3">International Transfers</h2>
              <p className="text-slate">
                Where data is transferred across borders, we use appropriate safeguards permitted by
                law.
              </p>
            </div>

            <div>
              <h2 className="font-heading font-bold text-2xl mb-3">Children</h2>
              <p className="text-slate">
                Our site is not directed to children under 16 and we do not knowingly collect their
                data.
              </p>
            </div>

            <div>
              <h2 className="font-heading font-bold text-2xl mb-3">Changes</h2>
              <p className="text-slate">
                We may update this Policy from time to time. The "Last updated" date will reflect
                the latest revision.
              </p>
            </div>

            <div>
              <h2 className="font-heading font-bold text-2xl mb-3">Contact</h2>
              <p className="text-slate">
                To exercise rights or ask questions, use the contact form on this site and select
                "General".
              </p>
            </div>
          </CardBody>
        </Card>
      </div>
    </section>
  );
}
