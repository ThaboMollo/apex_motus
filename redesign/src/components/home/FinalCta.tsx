import { Container } from "@/components/layout/Container";
import { SectionLabel } from "@/components/layout/SectionHeader";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { FINAL, SITE, CONTACT_HREF } from "@/content/site";

const CHEVRON = "M30 0 H110 L230 200 L110 400 H30 L150 200 Z";

/* The hero motif resolved: echoes converge into one solid forward chevron. */
function ResolvedChevrons({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 520 400"
      className={className}
      fill="none"
      stroke="var(--color-ink)"
      strokeWidth="1.5"
    >
      <path d={CHEVRON} opacity="0.2" />
      <path d={CHEVRON} transform="translate(90 0)" opacity="0.4" />
      <path d={CHEVRON} transform="translate(180 0)" opacity="0.65" />
      <path d={CHEVRON} transform="translate(270 0)" fill="var(--color-ink)" stroke="none" />
    </svg>
  );
}

export function FinalCta() {
  return (
    <section id="contact" aria-labelledby="final-title" className="border-y border-ink bg-lime">
      <Container className="grid gap-14 py-section lg:grid-cols-12 lg:items-center lg:gap-8">
        <div className="lg:col-span-8">
          <Reveal>
            <SectionLabel index="07" className="text-ink">
              Start here
            </SectionLabel>
          </Reveal>
          <Reveal
            as="h2"
            id="final-title"
            className="display mt-10 max-w-[14ch] text-[clamp(2.75rem,1.4rem+6.2vw,7rem)] leading-[0.94]"
            index={1}
          >
            {FINAL.headline}
          </Reveal>
          <Reveal index={2}>
            <p className="mt-8 max-w-lg text-[length:var(--text-lead)] leading-[1.55] text-ink">{FINAL.body}</p>
            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <Button href={CONTACT_HREF} variant="ink" className="sm:min-w-64">
                {FINAL.primary}
              </Button>
              <Button href="/#solutions" variant="outline" className="sm:min-w-56">
                {FINAL.secondary}
              </Button>
            </div>
            <p className="label mt-8 text-ink">
              Or write to{" "}
              <a href={`mailto:${SITE.email}`} className="link-draw font-medium">
                {SITE.email}
              </a>
            </p>
          </Reveal>
        </div>

        <Reveal className="lg:col-span-4" index={3}>
          <ResolvedChevrons className="mx-auto h-auto w-full max-w-[16rem] lg:max-w-none" />
        </Reveal>
      </Container>
    </section>
  );
}
