import { ProductCard } from "@/components/ProductCard";

const products = [
  {
    name: "ClinicOS",
    description:
      "Streamline patient flow, bookings, and clinic operations with a unified system.",
    primaryLink: {
      href: "https://clinic-os-ui.vercel.app/c/bahaleng-health-center",
      label: "Main UI",
    },
    secondaryLink: {
      href: "https://clinic-os-portal.vercel.app",
      label: "Portal",
    },
  },
  {
    name: "ScanYa",
    description:
      "Scan, access, and manage assets instantly using QR-powered workflows.",
    primaryLink: {
      href: "https://scanya.vercel.app/",
      label: "Main Site",
    },
  },
  {
    name: "tseboIQ",
    description:
      "Unlock talent intelligence and make smarter hiring and workforce decisions.",
    primaryLink: {
      href: "https://tseboiq.netlify.app/",
      label: "Main Site",
    },
  },
];

export function ProductShowcaseSection() {
  return (
    <section
      id="products"
      className="border-b border-navy/15 bg-[#ece9e5] py-20 md:py-24"
    >
      <div className="mx-auto w-full max-w-[1200px] px-6 md:px-10">
        <header className="mx-auto max-w-3xl text-center">
          <h2 className="font-heading text-[clamp(34px,6vw,68px)] font-bold leading-tight text-fg-primary">
            Our Tools. Your Advantage.
          </h2>
          <p className="mt-4 font-body text-[18px] leading-relaxed text-fg-secondary">
            Real systems designed to improve how your business operates, scales,
            and performs.
          </p>
        </header>

        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-8">
          {products.map((product, index) => (
            <ProductCard
              key={product.name}
              name={product.name}
              description={product.description}
              primaryLink={product.primaryLink}
              secondaryLink={product.secondaryLink}
              delayMs={index * 100}
            />
          ))}
        </div>
        <header className="mx-auto max-w-3xl text-center mt-8">
          <p className="mt-4 font-body text-[18px] leading-relaxed text-fg-secondary">
            By the way, this is just the beginning
          </p>
        </header>
      </div>
    </section>
  );
}
