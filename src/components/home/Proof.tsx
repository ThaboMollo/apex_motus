import { Container } from "@/components/layout/Container";
import { SectionLabel } from "@/components/layout/SectionHeader";
import { ArrowLink } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { PROOF, WALKTHROUGH_HREF } from "@/content/site";

export function Proof() {
  return (
    <section id="work" aria-labelledby="proof-title" className="border-t border-rule bg-paper-deep py-section">
      <Container className="grid gap-14 lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-5">
          <Reveal>
            <SectionLabel index="05">Proof &amp; credibility</SectionLabel>
          </Reveal>
          <Reveal as="h2" id="proof-title" className="h2 mt-10" index={1}>
            {PROOF.headline}
          </Reveal>
          <Reveal index={2}>
            <p className="lead mt-6 max-w-md">{PROOF.intro}</p>
            <div className="mt-8">
              <ArrowLink href={WALKTHROUGH_HREF}>{PROOF.cta}</ArrowLink>
            </div>
          </Reveal>
        </div>

        <div className="lg:col-span-6 lg:col-start-7">
          <ol className="border-t border-ink">
            {PROOF.items.map((item, idx) => (
              <Reveal
                as="li"
                key={item.label}
                index={idx}
                className="grid grid-cols-[3rem_1fr] gap-x-2 border-b border-rule py-8"
              >
                <span className="label pt-2 text-ink-soft">0{idx + 1}</span>
                <div>
                  <h3 className="h3">{item.label}</h3>
                  <p className="mt-3 max-w-md text-[0.9375rem] leading-relaxed text-ink-soft">{item.text}</p>
                </div>
              </Reveal>
            ))}
          </ol>
          <Reveal index={3}>
            <p className="label mt-6 flex items-start gap-3 text-ink-soft">
              <span
                aria-hidden="true"
                className="mt-0.5 inline-block size-2.5 shrink-0 bg-lime outline outline-1 outline-ink"
              />
              {PROOF.pending}
            </p>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
