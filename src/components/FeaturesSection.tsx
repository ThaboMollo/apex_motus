const features = [
  {
    category: "TOOLS",
    title: "Tools that remove growth friction",
    body:
      "We design practical tooling that gives leadership teams a clearer view of execution and performance. Process visibility dashboards, operational workflow tooling, and decision support for leadership.",
  },
  {
    category: "RESTRUCTURING",
    title: "Restructuring for scalable operations",
    body:
      "We rework business structures to reduce drag and align teams, systems, and accountability. Role and responsibility redesign, delivery model optimization, and performance governance alignment.",
  },
  {
    category: "HANDS-ON GUIDANCE",
    title: "Hands-on guidance through critical changes",
    body:
      "We work directly with teams to resolve technical, procedural, and strategic bottlenecks quickly. Technical bottleneck analysis, procedural simplification, and strategic execution support.",
  },
];

export function FeaturesSection() {
  return (
    <section
      id="features"
      className="overflow-visible border-b border-[#d4af37]/20 bg-surface-primary py-16"
    >
      <p className="px-6 pt-4 font-caption text-[11px] tracking-widest3 text-fg-secondary md:px-10 lg:px-20">
        03 / FEATURES
      </p>

      <h2 className="monumental-heading mt-6 uppercase">Features</h2>

      <div className="mx-6 mt-6 h-[2px] w-14 bg-gold md:mx-10 lg:mx-20" />

      <div className="grid gap-10 px-6 pb-8 pt-12 md:px-10 lg:grid-cols-3 lg:gap-14 lg:px-20">
        {features.map((feature) => (
          <article key={feature.title} className="flex flex-col gap-[18px]">
            <span className="font-caption text-[10px] tracking-widest3 text-royal">
              {feature.category}
            </span>
            <h3 className="font-heading text-[26px] font-semibold leading-snug text-fg-primary">
              {feature.title}
            </h3>
            <p className="font-body text-[15px] leading-[1.75] text-fg-secondary">{feature.body}</p>
            <a href="#contact" className="font-caption text-[12px] tracking-[0.1em] text-navy">
              Explore →
            </a>
          </article>
        ))}
      </div>
    </section>
  );
}
