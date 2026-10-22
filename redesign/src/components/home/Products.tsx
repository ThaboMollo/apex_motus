import { Container } from "@/components/layout/Container";
import { SectionLabel } from "@/components/layout/SectionHeader";
import { ArrowLink } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { ClinicVisual, ScanVisual } from "@/components/home/ProductVisuals";
import { PRODUCTS } from "@/content/site";

const VISUALS: Record<string, React.ComponentType<{ className?: string }>> = {
  clinicos: ClinicVisual,
  scanya: ScanVisual,
};

export function Products() {
  const items = PRODUCTS.items.filter((p) => p.published);
  return (
    <section id="products" aria-labelledby="products-title" className="border-t border-rule pb-section pt-section">
      <Container>
        <Reveal>
          <SectionLabel index="04">Technology &amp; products</SectionLabel>
        </Reveal>
        <div className="mt-10 grid gap-8 lg:grid-cols-12">
          <Reveal as="h2" id="products-title" className="h2 lg:col-span-8" index={1}>
            {PRODUCTS.headline}
          </Reveal>
          <Reveal className="lg:col-span-4 lg:pt-3" index={2}>
            <p className="lead">{PRODUCTS.intro}</p>
          </Reveal>
        </div>

        <ul className="mt-14 grid gap-6 lg:mt-20 lg:grid-cols-2 lg:gap-8">
          {items.map((p, idx) => {
            const Visual = VISUALS[p.slug];
            return (
              <Reveal as="li" key={p.slug} index={idx} className="flex flex-col border border-ink bg-paper">
                <div className="border-b border-ink bg-paper-deep p-6 sm:p-10">
                  {Visual && <Visual className="mx-auto h-auto w-full max-w-md" />}
                </div>
                <div className="flex flex-1 flex-col p-6 sm:p-10">
                  <p className="label flex items-center justify-between gap-4 text-ink-soft">
                    <span>Product 0{idx + 1}</span>
                    <span>{p.category}</span>
                  </p>
                  <h3 className="display mt-6 text-[clamp(2.25rem,1.6rem+3vw,4rem)] leading-none">{p.name}</h3>
                  <p className="mt-5 max-w-md text-[1.0625rem] leading-relaxed">{p.positioning}</p>
                  {"detail" in p && p.detail && (
                    <p className="mt-3 max-w-md text-[0.9375rem] leading-relaxed text-ink-soft">{p.detail}</p>
                  )}
                  <div className="mt-auto pt-10">
                    <ArrowLink href={`/products/${p.slug}`}>
                      Learn more<span className="sr-only"> about {p.name}</span>
                    </ArrowLink>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </ul>
      </Container>
    </section>
  );
}
