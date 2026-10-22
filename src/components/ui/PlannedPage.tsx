import { Container } from "@/components/layout/Container";
import { SectionLabel } from "@/components/layout/SectionHeader";
import { Button } from "@/components/ui/Button";
import { Period } from "@/components/brand/Period";
import { CONTACT_HREF } from "@/content/site";

/*
 * Honest holding page for routes that belong to later build phases.
 * Marked as planned, explains what will live here, and offers a real next step.
 */
export function PlannedPage({
  title,
  summary,
  parent,
}: {
  title: string;
  summary: string;
  parent?: { label: string; href: string };
}) {
  return (
    <Container className="py-section">
      <SectionLabel index="Planned">Page in development</SectionLabel>
      <h1 className="display mt-10 max-w-[16ch] text-[length:var(--text-display)] leading-[0.96]">
        {title}
        <Period />
      </h1>
      <p className="lead mt-8 max-w-xl">{summary}</p>
      <p className="label mt-8 text-ink-soft">This page is part of a later build phase.</p>
      <div className="mt-10 flex flex-col gap-3 sm:flex-row">
        <Button href={CONTACT_HREF} className="sm:min-w-64">
          Discuss your challenge
        </Button>
        <Button href={parent?.href ?? "/"} variant="outline" className="sm:min-w-56">
          {parent ? `Back to ${parent.label}` : "Back to home"}
        </Button>
      </div>
    </Container>
  );
}
