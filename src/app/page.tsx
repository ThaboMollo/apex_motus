import type { Metadata } from "next";
import { Hero } from "@/components/home/Hero";
import { Problem } from "@/components/home/Problem";
import { Solutions } from "@/components/home/Solutions";
import { Methodology } from "@/components/home/Methodology";
import { Products } from "@/components/home/Products";
import { Proof } from "@/components/home/Proof";
import { Philosophy } from "@/components/home/Philosophy";
import { FinalCta } from "@/components/home/FinalCta";

/*
 * Resolved against `metadataBase` (SITE.url), so this emits
 * <link rel="canonical" href="https://apexmotus.co.za/">. Add a canonical to
 * a holding page only when it stops being `noindex` — Google treats
 * noindex + canonical as a conflicting signal.
 */
export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

export default function Home() {
  return (
    <>
      <Hero />
      <Problem />
      <Solutions />
      <Methodology />
      <Products />
      <Proof />
      <Philosophy />
      <FinalCta />
    </>
  );
}
