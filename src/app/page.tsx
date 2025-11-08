"use client";

import Hero from "@/components/Hero";
import SectionCard from "@/components/SectionCard";

export default function Home() {
  return (
    <>
      <Hero />

      {/* Investment Thesis Section */}
      <section id="thesis" className="py-20">
        <div className="container mx-auto px-5 max-w-7xl">
          <div className="mb-12">
            <h2 className="font-heading font-bold text-3xl md:text-4xl mb-4">Investment Thesis</h2>
            <p className="text-slate text-lg max-w-3xl">
              We pursue ventures with recurring revenue, strong unit economics, and defensible moats.
              Our edge is operational design: shared services and software that compound across the
              portfolio.
            </p>
          </div>

          <div className="relative pl-6 space-y-6">
            <div className="absolute left-2 top-0 bottom-0 w-0.5 bg-slate/30" />
            
            <div className="relative">
              <div className="absolute left-[-27px] top-2 w-2.5 h-2.5 rounded-full bg-gradient-to-br from-cyan to-royal shadow-lg shadow-cyan/50" />
              <div>
                <strong className="text-cyan">01 • Hunt the right prey.</strong>
                <p className="text-slate mt-1">
                  Problem–solution fit and real distribution before we commit.
                </p>
              </div>
            </div>

            <div className="relative">
              <div className="absolute left-[-27px] top-2 w-2.5 h-2.5 rounded-full bg-gradient-to-br from-cyan to-royal shadow-lg shadow-cyan/50" />
              <div>
                <strong className="text-cyan">02 • Systems before scale.</strong>
                <p className="text-slate mt-1">
                  Document, automate, templatize. Reuse across brands.
                </p>
              </div>
            </div>

            <div className="relative">
              <div className="absolute left-[-27px] top-2 w-2.5 h-2.5 rounded-full bg-gradient-to-br from-cyan to-royal shadow-lg shadow-cyan/50" />
              <div>
                <strong className="text-cyan">03 • Cash‑flow compounding.</strong>
                <p className="text-slate mt-1">
                  Reinvest steady profits, not hype. Build anti‑fragility.
                </p>
              </div>
            </div>

            <div className="relative">
              <div className="absolute left-[-27px] top-2 w-2.5 h-2.5 rounded-full bg-gradient-to-br from-cyan to-royal shadow-lg shadow-cyan/50" />
              <div>
                <strong className="text-cyan">04 • Governance & risk.</strong>
                <p className="text-slate mt-1">
                  Controls that protect the downside while enabling decisive moves.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Vision Section */}
      <section className="py-20 bg-gradient-to-b from-transparent to-navy/30">
        <div className="container mx-auto px-5 max-w-7xl">
          <div className="text-center max-w-3xl mx-auto">
            <div className="text-gold font-extrabold tracking-widest text-xs uppercase mb-3">
              Our Vision
            </div>
            <h2 className="font-heading font-bold text-3xl md:text-4xl mb-6">
              Building for the Long Game
            </h2>
            <p className="text-slate text-lg">
              We're not chasing unicorns. We're building a portfolio of sustainable, profitable
              businesses that solve real problems and create lasting value. Each venture is designed
              to dominate its category through superior execution, not hype.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
