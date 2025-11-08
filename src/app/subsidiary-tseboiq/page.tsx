"use client";

import SectionCard from "@/components/SectionCard";

export default function SubsidiaryTseboIQ() {
  return (
    <section className="py-20">
      <div className="container mx-auto px-5 max-w-7xl">
        <div className="mb-12">
          <h1 className="font-heading font-bold text-4xl md:text-5xl mb-4">
            tseboIQ — Subsidiary Detail
          </h1>
          <p className="text-slate text-lg max-w-3xl">
            HRTech platform (in build) that maps skills, experience, certifications, and reputation
            signals to match talent with companies.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <SectionCard title="What it solves">
            <p>
              Signal‑rich matching reduces hiring noise, accelerates placement, and improves
              retention.
            </p>
          </SectionCard>

          <SectionCard title="Status">
            <p>
              MVP architecture defined. Matching algorithm includes skills, experience,
              certifications, and weighted references.
            </p>
          </SectionCard>
        </div>

        <div className="grid grid-cols-1 gap-6">
          <SectionCard title="Partnerships">
            <p>
              Open to pilot partners (companies with hiring needs, training providers, and
              credential issuers).
            </p>
          </SectionCard>
        </div>
      </div>
    </section>
  );
}
