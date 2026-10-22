import { Container } from "@/components/layout/Container";
import { SectionLabel } from "@/components/layout/SectionHeader";
import { MethodologyExplorer } from "@/components/home/MethodologyExplorer";
import { Reveal } from "@/components/ui/Reveal";
import { METHOD } from "@/content/site";

export function Methodology() {
  return (
    <section id="approach" aria-labelledby="approach-title" className="border-t border-rule pb-section pt-section">
      <Container>
        <Reveal>
          <SectionLabel index="03">Our methodology</SectionLabel>
        </Reveal>
        <div className="mt-10 grid gap-8 lg:grid-cols-12">
          <Reveal as="h2" id="approach-title" className="h2 lg:col-span-8" index={1}>
            {METHOD.headline}
          </Reveal>
          <Reveal className="lg:col-span-4 lg:pt-3" index={2}>
            <p className="lead">{METHOD.intro}</p>
          </Reveal>
        </div>
        <Reveal className="mt-16 lg:mt-24" index={1}>
          <MethodologyExplorer />
        </Reveal>
      </Container>
    </section>
  );
}
