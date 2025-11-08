"use client";

import SectionCard from "@/components/SectionCard";

export default function Services() {
  return (
    <section className="py-20">
      <div className="container mx-auto px-5 max-w-7xl">
        <div className="mb-12">
          <h1 className="font-heading font-bold text-4xl md:text-5xl mb-4">Shared Services</h1>
          <p className="text-slate text-lg max-w-3xl">
            Centralized capabilities each subsidiary can plug into for speed, quality, and cost
            efficiency.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <SectionCard title="Engineering">
            <p>Full‑stack web & mobile, DevOps, Azure, data & AI.</p>
          </SectionCard>

          <SectionCard title="Growth">
            <p>Brand, performance marketing, content systems, partnerships.</p>
          </SectionCard>

          <SectionCard title="Finance">
            <p>Capital allocation, FP&A, treasury, portfolio reporting.</p>
          </SectionCard>

          <SectionCard title="People">
            <p>Talent network, contracting, leadership development.</p>
          </SectionCard>

          <SectionCard title="Legal & Risk">
            <p>Contracts, IP, compliance, governance.</p>
          </SectionCard>

          <SectionCard title="Operations">
            <p>SOPs, automation, vendor management.</p>
          </SectionCard>
        </div>
      </div>
    </section>
  );
}
