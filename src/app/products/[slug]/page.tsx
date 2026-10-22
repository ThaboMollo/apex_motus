import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PlannedPage } from "@/components/ui/PlannedPage";
import { PRODUCTS } from "@/content/site";

const published = PRODUCTS.items.filter((p) => p.published);

export function generateStaticParams() {
  return published.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/products/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const p = published.find((x) => x.slug === slug);
  // Holding page: real content lands in a later phase, so keep it out of the index.
  const robots = { index: false, follow: true };
  return p ? { title: p.name, description: p.positioning, robots } : { robots };
}

export default async function Page({ params }: PageProps<"/products/[slug]">) {
  const { slug } = await params;
  const p = published.find((x) => x.slug === slug);
  if (!p) notFound();
  return (
    <PlannedPage
      title={p.name}
      summary={p.positioning}
      parent={{ label: "products", href: "/#products" }}
    />
  );
}
