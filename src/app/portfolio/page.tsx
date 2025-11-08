"use client";

import Link from "next/link";
import SectionCard from "@/components/SectionCard";
import { Button } from "@material-tailwind/react";

export default function Portfolio() {
  return (
    <section className="py-20">
      <div className="container mx-auto px-5 max-w-7xl">
        <div className="mb-12">
          <h1 className="font-heading font-bold text-4xl md:text-5xl mb-4">
            Portfolio & Incubations
          </h1>
          <p className="text-slate text-lg max-w-3xl">
            Public brand pages will appear as ventures move from incubation to growth. We are
            currently building <strong className="text-cyan">tseboIQ</strong>.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <SectionCard badge="HRTech • In Build" title="tseboIQ">
            <p className="mb-4">
              Skills graph + matching platform connecting talent and companies with
              reputation‑weighted references.
            </p>
            <Link href="/subsidiary-tseboiq">
              <Button color="cyan" size="sm" placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} onResize={undefined} onResizeCapture={undefined}>
                View details
              </Button>
            </Link>
          </SectionCard>

          <SectionCard badge="Pipeline" title="New Ventures">
            <p>
              We evaluate opportunities with asymmetric upside and clear distribution advantages.
            </p>
          </SectionCard>

          <SectionCard badge="Partnerships" title="Co‑build">
            <p>
              Have distribution or data? We co‑build where our shared services unlock leadership.
            </p>
          </SectionCard>
        </div>
      </div>
    </section>
  );
}
