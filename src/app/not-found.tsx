import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/Button";
import { SectionLabel } from "@/components/layout/SectionHeader";
import { Period } from "@/components/brand/Period";

export default function NotFound() {
  return (
    <Container className="py-section">
      <SectionLabel index="404">Off the map</SectionLabel>
      <h1 className="display mt-8 text-[length:var(--text-display)] leading-[0.96]">
        That page doesn’t exist<Period />
      </h1>
      <p className="lead mt-8 max-w-xl">The link may be out of date, or the page hasn’t been built yet.</p>
      <div className="mt-10 max-w-xs">
        <Button href="/">Back to home</Button>
      </div>
    </Container>
  );
}
