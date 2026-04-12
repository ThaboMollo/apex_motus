import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Terms and Conditions",
  description: "Read the Apex Motus terms and conditions for use of the site and services.",
  path: "/terms",
  keywords: ["terms and conditions", "site terms", "Apex Motus terms"],
});

export default function TermsLayout({ children }: { children: React.ReactNode }) {
  return children;
}

