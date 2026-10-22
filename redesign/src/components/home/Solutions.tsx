import { Container } from "@/components/layout/Container";
import { SectionLabel } from "@/components/layout/SectionHeader";
import { ArrowLink } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { PathwayGlyph } from "@/components/home/PathwayGlyph";
import { SOLUTIONS } from "@/content/site";

export function Solutions() {
  return (
    <section id="solutions" aria-labelledby="solutions-title" className="pb-section">
      <Container>
        <Reveal>
          <SectionLabel index="02">What Apex Motus solves</SectionLabel>
        </Reveal>

        <div className="mt-10 grid gap-8 lg:grid-cols-12">
          <Reveal as="h2" id="solutions-title" className="h2 lg:col-span-8" index={1}>
            {SOLUTIONS.headline}
          </Reveal>
          <Reveal className="lg:col-span-4 lg:pt-3" index={2}>
            <p className="lead">{SOLUTIONS.intro}</p>
          </Reveal>
        </div>

        <ul className="mt-14 grid border-t border-ink sm:grid-cols-2 lg:mt-20 lg:grid-cols-4">
          {SOLUTIONS.pathways.map((p, idx) => (
            <Reveal
              as="li"
              key={p.slug}
              index={idx}
              className="group relative flex flex-col border-b border-rule sm:border-r sm:[&:nth-child(2n)]:border-r-0 lg:border-r lg:[&:nth-child(2n)]:border-r lg:last:border-r-0"
            >
              <span
                aria-hidden="true"
                className="absolute inset-x-0 top-0 h-1 origin-left scale-x-0 bg-lime transition-transform duration-[var(--duration-slow)] ease-[var(--ease-out-quart)] group-hover:scale-x-100 group-focus-within:scale-x-100"
              />
              <div className="flex flex-1 flex-col px-0 py-8 sm:px-6 sm:[li:nth-child(odd)_&]:pl-0 lg:[li:nth-child(odd)_&]:pl-6 lg:[li:first-child_&]:pl-0 lg:py-10">
                <div className="flex items-start justify-between">
                  <span className="label text-ink-soft">0{idx + 1}</span>
                  <PathwayGlyph slug={p.slug} className="size-10 text-ink" />
                </div>

                <h3 className="h3 mt-12 lg:mt-16 lg:min-h-[2.24em]">{p.title}</h3>
                <p className="mb-8 mt-4 text-[0.9375rem] leading-relaxed text-ink-soft">{p.description}</p>

                <div className="mt-auto border-t border-rule pt-5">
                  <p className="label text-ink-soft">Recognisable when</p>
                  <p className="mt-2 text-[0.9375rem] leading-relaxed sm:min-h-[4.9rem]">{p.recognisable}</p>
                </div>

                <div className="pt-8">
                  <ArrowLink href={`/solutions/${p.slug}`}>
                    Explore<span className="sr-only"> {p.title}</span>
                  </ArrowLink>
                </div>
              </div>
            </Reveal>
          ))}
        </ul>
      </Container>
    </section>
  );
}
