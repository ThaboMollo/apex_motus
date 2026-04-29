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
      "@type": ["Organization", "LocalBusiness"],
      "@id": `${SITE_URL}/#organization`,
      name: SITE_NAME,
      url: SITE_URL,
      logo: {
        "@type": "ImageObject",
        url: `${SITE_URL}/apex_motus_logo_no_bg.png`,
        width: 400,
        height: 200,
      },
      email: "apex.motus.inc@gmail.com",
      description:
        "Apex Motus is a South African business growth advisory firm that helps businesses remove operational, strategic, and scaling bottlenecks through practical tools, restructuring, and hands-on execution guidance.",
      address: {
        "@type": "PostalAddress",
        addressCountry: "ZA",
        addressRegion: "South Africa",
      },
      areaServed: {
        "@type": "Country",
        name: "South Africa",
      },
      knowsAbout: [
        "Business Growth",
        "Operational Consulting",
        "Business Restructuring",
        "Strategic Advisory",
        "Execution Support",
        "SME Growth",
      ],
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
    {
      "@type": "Service",
      "@id": `${SITE_URL}/#service-tools`,
      name: "Business Growth Tools",
      description:
        "Process visibility dashboards, operational workflow tooling, and decision support for leadership teams.",
      provider: { "@id": `${SITE_URL}/#organization` },
      areaServed: { "@type": "Country", name: "South Africa" },
      serviceType: "Business Operations Tooling",
    },
    {
      "@type": "Service",
      "@id": `${SITE_URL}/#service-restructuring`,
      name: "Business Restructuring",
      description:
        "Role and responsibility redesign, delivery model optimization, and performance governance alignment for scalable operations.",
      provider: { "@id": `${SITE_URL}/#organization` },
      areaServed: { "@type": "Country", name: "South Africa" },
      serviceType: "Business Restructuring Consulting",
    },
    {
      "@type": "Service",
      "@id": `${SITE_URL}/#service-guidance`,
      name: "Hands-on Execution Guidance",
      description:
        "Technical bottleneck analysis, procedural simplification, and strategic execution support delivered directly with leadership teams.",
      provider: { "@id": `${SITE_URL}/#organization` },
      areaServed: { "@type": "Country", name: "South Africa" },
      serviceType: "Strategic Advisory",
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
