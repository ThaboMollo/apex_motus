import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Contact",
  description:
    "Contact Apex Motus to discuss business growth priorities, operational bottlenecks, and practical next steps.",
  path: "/contact",
  keywords: ["contact Apex Motus", "business advisory contact", "strategy consultation"],
});

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children;
}

