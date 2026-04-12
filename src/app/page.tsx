import { AboutSection } from "@/components/AboutSection";
import { ContactSection } from "@/components/ContactSection";
import Footer from "@/components/Footer";
import { FeaturesSection } from "@/components/FeaturesSection";
import { HeroFlowSection } from "@/components/HeroFlowSection";
import { ProductShowcaseSection } from "@/components/ProductShowcaseSection";

export default function Home() {
  return (
    <>
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
