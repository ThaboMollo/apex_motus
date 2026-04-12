import type { Metadata } from "next";
import { AboutSection } from "@/components/AboutSection";
import { ContactSection } from "@/components/ContactSection";
import Footer from "@/components/Footer";
import { FeaturesSection } from "@/components/FeaturesSection";
import { HeroFlowSection } from "@/components/HeroFlowSection";
import { ProductShowcaseSection } from "@/components/ProductShowcaseSection";
import { buildPageMetadata } from "@/lib/seo";
import { SITE_NAME, SITE_URL } from "@/lib/site";

export const metadata: Metadata = buildPageMetadata({
  title: "Business Growth Tools and Advisory",
  description:
    "Apex Motus helps businesses remove growth friction with practical tools, restructuring, and hands-on execution guidance.",
  path: "/",
  keywords: [
    "business growth tools",
    "operational consulting",
    "business restructuring",
    "execution advisory",
  ],
});

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${SITE_URL}/#organization`,
      name: SITE_NAME,
      url: SITE_URL,
      logo: `${SITE_URL}/apex_motus_logo_no_bg.png`,
      email: "apex.motus.inc@gmail.com",
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      url: SITE_URL,
      name: SITE_NAME,
      publisher: {
        "@id": `${SITE_URL}/#organization`,
      },
      inLanguage: "en-ZA",
    },
  ],
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <HeroFlowSection />
      <div className="h-screen" />
      <main>
        <AboutSection />
        <FeaturesSection />
        <ProductShowcaseSection />
        <ContactSection />
        <Footer />
      </main>
    </>
  );
}
