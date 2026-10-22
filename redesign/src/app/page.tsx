import { Hero } from "@/components/home/Hero";
import { Problem } from "@/components/home/Problem";
import { Solutions } from "@/components/home/Solutions";
import { Methodology } from "@/components/home/Methodology";
import { Products } from "@/components/home/Products";
import { Proof } from "@/components/home/Proof";
import { Philosophy } from "@/components/home/Philosophy";
import { FinalCta } from "@/components/home/FinalCta";

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
