import Image from "next/image";
import { Container } from "@/components/layout/Container";
import { SectionLabel } from "@/components/layout/SectionHeader";
import { ProblemDiagram } from "@/components/home/ProblemDiagram";
import { Reveal } from "@/components/ui/Reveal";
import { PROBLEM } from "@/content/site";

export function Problem() {
  return (
    <section id="problem" aria-labelledby="problem-title" className="problem py-section">
      <Container>
        <Reveal>
          <SectionLabel index="01">The problem</SectionLabel>
        </Reveal>

        <div className="mt-10 grid gap-8 lg:grid-cols-12 lg:gap-8">
          <Reveal as="h2" id="problem-title" className="h2 lg:col-span-8" index={1}>
            {PROBLEM.headline}
          </Reveal>
          <Reveal as="div" className="lg:col-span-4 lg:pt-3" index={2}>
            <p className="lead">{PROBLEM.body}</p>
          </Reveal>
        </div>

        <div className="mt-14 grid gap-10 lg:mt-20 lg:grid-cols-12 lg:gap-8">
          <Reveal className="on-ink lg:sticky lg:top-28 lg:col-span-6 lg:self-start" index={1}>
            <figure className="relative isolate overflow-hidden bg-ink p-5 sm:p-8">
              <Image
                src="/images/problem-concrete-beams.jpg"
                alt=""
                fill
                sizes="(min-width: 1024px) 48vw, 100vw"
                className="-z-10 object-cover"
              />
              {/* dark wash: photograph reads as texture, diagram stays legible */}
              <div aria-hidden="true" className="absolute inset-0 -z-10 bg-ink/80" />
              <ProblemDiagram className="h-auto w-full" />
              <figcaption className="label mt-6 flex items-center justify-between gap-4 text-grey">
                <span>Fig. 02 · Fragmented operations</span>
                <span className="flex items-center gap-2">
                  <span aria-hidden="true" className="inline-block size-2.5 bg-lime" />
                  Missing link
                </span>
              </figcaption>
            </figure>
          </Reveal>

          <ol className="lg:col-span-6 lg:col-start-7">
            {PROBLEM.challenges.map((c, idx) => (
              <Reveal
                as="li"
                key={c.title}
                index={idx}
                className="border-t border-rule last:border-b"
              >
                <div
                  data-row={idx + 1}
                  className="grid grid-cols-[2.75rem_1fr] gap-x-2 py-5 transition-colors duration-[var(--duration-base)] hover:bg-paper-deep sm:py-6"
                >
                  <span className="label pt-1.5 text-ink-soft">0{idx + 1}</span>
                  <div>
                    <h3 className="h3 text-[1.25rem] sm:text-[1.375rem]">{c.title}</h3>
                    <p className="mt-2 max-w-md text-[0.9375rem] leading-relaxed text-ink-soft">{c.text}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </ol>
        </div>
      </Container>
    </section>
  );
}
