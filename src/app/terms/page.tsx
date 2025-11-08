"use client";

import { Card, CardBody } from "@material-tailwind/react";

export default function Terms() {
  const lastUpdated = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <section className="py-20">
      <div className="container mx-auto px-5 max-w-4xl">
        <div className="mb-12">
          <h1 className="font-heading font-bold text-4xl md:text-5xl mb-4">
            Terms & Conditions
          </h1>
          <p className="text-slate">Last updated: {lastUpdated}</p>
        </div>

        <Card className="bg-ink/80 border border-slate/20">
          <CardBody className="space-y-6">
            <div>
              <h2 className="font-heading font-bold text-2xl mb-3">Acceptance</h2>
              <p className="text-slate">
                By accessing this site, you agree to these Terms. If you do not agree, do not use
                the site.
              </p>
            </div>

            <div>
              <h2 className="font-heading font-bold text-2xl mb-3">Use of Site</h2>
              <p className="text-slate">
                You may not misuse the site, attempt to access non‑public areas, or interfere with
                its operation.
              </p>
            </div>

            <div>
              <h2 className="font-heading font-bold text-2xl mb-3">Intellectual Property</h2>
              <p className="text-slate">
                All content is owned by Apex Motus or its licensors. No rights are granted except as
                expressly stated.
              </p>
            </div>

            <div>
              <h2 className="font-heading font-bold text-2xl mb-3">Disclaimers</h2>
              <p className="text-slate">
                Content is provided "as is" without warranties. We do not guarantee availability,
                accuracy, or fitness for a particular purpose.
              </p>
            </div>

            <div>
              <h2 className="font-heading font-bold text-2xl mb-3">Limitation of Liability</h2>
              <p className="text-slate">
                To the maximum extent permitted by law, we are not liable for indirect or
                consequential damages arising from your use of the site.
              </p>
            </div>

            <div>
              <h2 className="font-heading font-bold text-2xl mb-3">Third‑Party Links</h2>
              <p className="text-slate">
                Links to other sites are provided for convenience and do not imply endorsement. We
                are not responsible for their content.
              </p>
            </div>

            <div>
              <h2 className="font-heading font-bold text-2xl mb-3">Changes</h2>
              <p className="text-slate">
                We may modify these Terms at any time. Continued use constitutes acceptance of
                changes.
              </p>
            </div>

            <div>
              <h2 className="font-heading font-bold text-2xl mb-3">Governing Law</h2>
              <p className="text-slate">
                These Terms are governed by the laws of South Africa, without regard to conflict of
                law principles.
              </p>
            </div>

            <div>
              <h2 className="font-heading font-bold text-2xl mb-3">Contact</h2>
              <p className="text-slate">
                Questions about these Terms? Use the contact form and select "General".
              </p>
            </div>
          </CardBody>
        </Card>
      </div>
    </section>
  );
}
