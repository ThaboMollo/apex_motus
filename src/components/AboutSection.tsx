"use client";

import { useMemo, useState } from "react";

type Capability = {
  id: string;
  label: string;
  title: string;
  summary: string;
  points: string[];
};

const capabilities: Capability[] = [
  {
    id: "tools",
    label: "Tools",
    title: "Tools that remove growth friction",
    summary:
      "We design practical tooling that gives leadership teams a clearer view of execution and performance.",
    points: [
      "Process visibility dashboards",
      "Operational workflow tooling",
      "Decision support for leadership",
    ],
  },
  {
    id: "restructuring",
    label: "Restructuring",
    title: "Restructuring for scalable operations",
    summary:
      "We rework business structures to reduce drag and align teams, systems, and accountability.",
    points: [
      "Role and responsibility redesign",
      "Delivery model optimization",
      "Performance governance alignment",
    ],
  },
  {
    id: "guidance",
    label: "Hands-on Guidance",
    title: "Hands-on guidance through critical changes",
    summary:
      "We work directly with teams to resolve technical, procedural, and strategic bottlenecks quickly.",
    points: [
      "Technical bottleneck analysis",
      "Procedural simplification",
      "Strategic execution support",
    ],
  },
];

export function AboutSection() {
  const [activeId, setActiveId] = useState(capabilities[0].id);

  const activeCapability = useMemo(
    () => capabilities.find((item) => item.id === activeId) ?? capabilities[0],
    [activeId],
  );

  return (
    <section id="about" className="border-b border-navy/15 bg-[#f1eeea]">
      <div className="mx-auto flex min-h-[78vh] max-w-7xl items-center px-5 py-20 md:py-28">
        <div className="grid w-full gap-12 lg:grid-cols-[1.1fr_1fr] lg:gap-16">
          <div>
            <h2 className="font-heading text-4xl font-bold leading-tight text-navy md:text-5xl">
              Who is Apex Motus?
            </h2>
            <p className="mt-5 max-w-3xl text-xl text-navy/90">
              Apex Motus empowers businesses to grow faster and scale bigger.
            </p>
            <p className="mt-4 max-w-3xl text-lg text-navy/90">
              We provide tools, business restructuring, hands-on guidance.
            </p>
            <p className="mt-4 max-w-3xl text-lg text-navy/90">
              We help businesses identify and eliminate bottlenecks, whether
              technical, procedural, or strategic.
            </p>
            <p className="mt-8 text-base font-semibold text-royal">
              Scroll down to discover how we can help your business thrive.
            </p>
          </div>

          <div className="self-center">
            <p className="mb-4 text-sm font-semibold uppercase tracking-wide text-navy/70">
              Explore How We Work
            </p>

            <div
              role="tablist"
              aria-label="Apex Motus capabilities"
              className="mb-4 flex flex-wrap gap-2"
            >
              {capabilities.map((capability) => {
                const isActive = capability.id === activeCapability.id;
                return (
                  <button
                    key={capability.id}
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    aria-controls={`capability-panel-${capability.id}`}
                    onClick={() => setActiveId(capability.id)}
                    className={`rounded-[4px] border px-3 py-2 text-sm font-semibold transition-all ${
                      isActive
                        ? "border-royal bg-royal text-white"
                        : "border-navy/25 bg-white text-navy/85 hover:border-royal hover:text-royal"
                    }`}
                  >
                    {capability.label}
                  </button>
                );
              })}
            </div>

            <div
              id={`capability-panel-${activeCapability.id}`}
              role="tabpanel"
              className="rounded-[4px] border border-navy/30 bg-[#111b45] p-6 text-white shadow-md transition-all duration-200 sm:p-7"
            >
              <h3 className="font-heading text-2xl font-semibold text-white sm:text-4xl">
                {activeCapability.title}
              </h3>
              <p className="mt-3 text-white/95">{activeCapability.summary}</p>
              <ul className="mt-5 space-y-2">
                {activeCapability.points.map((point) => (
                  <li key={point} className="text-sm text-white/95">
                    {point}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
