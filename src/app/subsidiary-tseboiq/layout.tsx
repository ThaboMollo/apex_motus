import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "tseboIQ Subsidiary",
  description:
    "Learn about tseboIQ, an Apex Motus HRTech subsidiary focused on signal-rich talent matching.",
  path: "/subsidiary-tseboiq",
  keywords: ["tseboIQ", "HRTech platform", "talent matching"],
});

export default function SubsidiaryTseboIQLayout({ children }: { children: React.ReactNode }) {
  return children;
}

