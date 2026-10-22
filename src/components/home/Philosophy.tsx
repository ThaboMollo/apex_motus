import Image from "next/image";
import { Container } from "@/components/layout/Container";
import { SectionLabel } from "@/components/layout/SectionHeader";
import { Period } from "@/components/brand/Period";
import { Reveal } from "@/components/ui/Reveal";
import { PHILOSOPHY } from "@/content/site";

/*
 * Brand philosophy: the purpose statement, then three pillars as a typographic
 * list, not a card grid. Each pillar carries a capsule meter: progress →
 * engineering → the apex fills 34% → 67% → 100%, ending in the forward chevron.
 */
export function Philosophy() {
  return (
    <section id="about" aria-labelledby="philosophy-title" className="py-section">
      <Container>
        <Reveal>
          <SectionLabel index="06">{PHILOSOPHY.label}</SectionLabel>
        </Reveal>

        <Reveal
          as="h2"
          id="philosophy-title"
          className="display mt-10 text-[clamp(2.75rem,1rem+8.6vw,10rem)] leading-[0.92]"
          index={1}
        >
          {PHILOSOPHY.purpose}
          <Period />
        </Reveal>
        <Reveal index={2}>
          <p className="label mt-8 max-w-xl text-ink-soft">{PHILOSOPHY.intro}</p>
        </Reveal>

        <Reveal index={1}>
          <figure className="relative mt-14 aspect-[4/3] overflow-hidden border border-ink bg-paper-deep sm:aspect-[16/9] lg:mt-20 lg:aspect-[21/9]">
            <Image
              src="/images/philosophy-concrete-stairs.jpg"
              alt="A wide concrete staircase rising between monolithic walls toward a glazed entrance."
              fill
              sizes="(min-width: 1440px) 1296px, 100vw"
              className="object-cover object-[50%_62%]"
            />
          </figure>
        </Reveal>

        <ol className="mt-16 border-t border-ink lg:mt-24">
          {PHILOSOPHY.pillars.map((p, idx) => (
            <Reveal
              as="li"
              key={p.word}
              index={idx}
              className="group grid gap-8 border-b border-rule py-10 lg:grid-cols-12 lg:gap-8 lg:py-14"
            >
              <div className="lg:col-span-7">
                <p className="label text-ink-soft">[ {p.n} ]</p>
                <p className="display mt-4 text-[clamp(3rem,1.2rem+8.4vw,9rem)] leading-[0.92] transition-transform duration-[var(--duration-slow)] ease-[var(--ease-out-quart)] group-hover:translate-x-2">
                  {p.word}
                </p>
                <div className="mt-8 flex max-w-md items-center gap-3" aria-hidden="true">
                  <div className="relative h-5 flex-1 overflow-hidden rounded-full border border-ink">
                    <div
                      className="capsule-fill absolute inset-y-0 left-0 bg-ink"
                      style={{ width: `${p.level * 100}%`, "--i": idx } as React.CSSProperties}
                    />
                  </div>
                  <svg viewBox="0 0 28 32" className="h-6 w-5 shrink-0">
                    <path
                      d="M4 2 H12 L24 16 L12 30 H4 L16 16 Z"
                      fill="var(--color-lime)"
                      stroke="var(--color-ink)"
                      strokeWidth="1.5"
                    />
                  </svg>
                </div>
              </div>

              <div className="lg:col-span-5 lg:pt-9">
                <p className="label text-ink">{p.line}</p>
                <p className="lead mt-4">{p.body}</p>
                <div className="mt-6 border-t border-rule pt-5">
                  <p className="label text-ink-soft">In practice</p>
                  <p className="mt-2 text-[0.9375rem] leading-relaxed">{p.practice}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </ol>
      </Container>
    </section>
  );
}
