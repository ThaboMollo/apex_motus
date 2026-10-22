import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PlannedPage } from "@/components/ui/PlannedPage";
import { SOLUTIONS } from "@/content/site";

export function generateStaticParams() {
  return SOLUTIONS.pathways.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/solutions/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const p = SOLUTIONS.pathways.find((x) => x.slug === slug);
  return p ? { title: p.title, description: p.description } : {};
}

export default async function Page({ params }: PageProps<"/solutions/[slug]">) {
  const { slug } = await params;
  const p = SOLUTIONS.pathways.find((x) => x.slug === slug);
  if (!p) notFound();
  return (
    <PlannedPage
      title={p.title}
      summary={p.description}
      parent={{ label: "solutions", href: "/#solutions" }}
    />
  );
}
