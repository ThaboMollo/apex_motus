import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Portfolio and Incubations",
  description:
    "See Apex Motus ventures and incubation initiatives, including the in-build tseboIQ platform.",
  path: "/portfolio",
  keywords: ["business portfolio", "venture incubation", "tseboIQ"],
});

export default function PortfolioLayout({ children }: { children: React.ReactNode }) {
  return children;
}

