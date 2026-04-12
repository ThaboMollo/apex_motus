import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Privacy Policy",
  description: "Read the Apex Motus privacy policy and data handling practices.",
  path: "/privacy",
  keywords: ["privacy policy", "data protection", "Apex Motus privacy"],
});

export default function PrivacyLayout({ children }: { children: React.ReactNode }) {
  return children;
}

