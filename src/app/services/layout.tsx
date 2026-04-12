import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Shared Services",
  description:
    "Explore Apex Motus shared services across engineering, growth, finance, legal, people, and operations.",
  path: "/services",
  keywords: ["shared services", "business operations", "engineering and growth services"],
});

export default function ServicesLayout({ children }: { children: React.ReactNode }) {
  return children;
}

