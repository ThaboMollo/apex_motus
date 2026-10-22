import { HeroVisual } from "@/components/home/HeroVisual";
import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/Button";
import { Period } from "@/components/brand/Period";
import { CONTACT_HREF, HERO } from "@/content/site";

const i = (n: number) => ({ "--i": n }) as React.CSSProperties;

export function Hero() {
  return (
    <section aria-labelledby="hero-title" className="relative">
      <Container className="grid gap-12 pb-14 pt-10 lg:grid-cols-12 lg:items-center lg:gap-8 lg:pb-20 lg:pt-16">
        <div className="lg:col-span-7">
          <p className="label anim-rise flex items-center gap-3 text-ink-soft" style={i(0)}>
            <span aria-hidden="true" className="inline-block size-2 bg-lime outline outline-1 outline-ink" />
            {HERO.eyebrow}
          </p>

          <h1
            id="hero-title"
            className="display anim-lift mt-7 text-[length:var(--text-display)] leading-[0.96]"
            style={i(1)}
          >
            {HERO.headline}
            <Period />
          </h1>

          <p className="lead anim-rise mt-8 max-w-[34rem]" style={i(2)}>
            {HERO.body}
          </p>

          <div className="anim-rise mt-10 flex flex-col gap-3 sm:flex-row" style={i(3)}>
            <Button href={CONTACT_HREF} className="sm:min-w-64">
              {HERO.primary}
            </Button>
            <Button href="/#approach" variant="outline" arrow="right" className="sm:min-w-56">
              {HERO.secondary}
            </Button>
          </div>
        </div>

        <figure className="anim-fade lg:col-span-5" style={i(2)}>
          <HeroVisual />
          <figcaption className="label mt-4 flex justify-between text-ink-soft">
            <span>Fig. 01</span>
            <span>Progress through a structure</span>
          </figcaption>
        </figure>
      </Container>

      <Container>
        <ul
          aria-label="Capability areas"
          className="label flex flex-wrap gap-x-5 gap-y-2 border-t border-rule py-5 text-ink-soft sm:gap-x-8"
        >
          {HERO.rail.map((w, idx) => (
            <li key={w} className="flex items-center gap-5 sm:gap-8">
              {w}
              {idx < HERO.rail.length - 1 && <span aria-hidden="true">/</span>}
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
