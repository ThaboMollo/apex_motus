import Link from "next/link";
import { Logo } from "@/components/brand/Logo";
import { Container } from "@/components/layout/Container";
import { FOOTER, NAV, PRODUCTS, SITE } from "@/content/site";
import { Period } from "@/components/brand/Period";

const YEAR = 2026; // static on purpose: no time-dependent render in a prerendered shell

export function Footer() {
  const products = PRODUCTS.items.filter((p) => p.published);
  return (
    <footer className="on-ink bg-ink text-paper">
      <Container className="pb-10 pt-20 lg:pt-28">
        <div className="grid gap-14 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-5">
            <Logo inverse className="w-44 lg:w-52" />
            <p className="mt-8 max-w-sm text-[0.9375rem] leading-relaxed text-grey">{FOOTER.description}</p>
          </div>

          <nav aria-label="Footer" className="grid grid-cols-2 gap-10 sm:grid-cols-3 lg:col-span-7">
            <div>
              <h2 className="label text-grey">Navigate</h2>
              <ul className="mt-5 space-y-3">
                {NAV.map((n) => (
                  <li key={n.label}>
                    <Link href={n.href} className="link-draw text-[0.9375rem]">
                      {n.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h2 className="label text-grey">Products</h2>
              <ul className="mt-5 space-y-3">
                {products.map((p) => (
                  <li key={p.slug}>
                    <Link href={`/products/${p.slug}`} className="link-draw text-[0.9375rem]">
                      {p.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div className="col-span-2 sm:col-span-1">
              <h2 className="label text-grey">Contact</h2>
              <ul className="mt-5 space-y-3 text-[0.9375rem]">
                <li>
                  <a href={`mailto:${SITE.email}`} className="link-draw break-all">
                    {SITE.email}
                  </a>
                </li>
                <li className="text-grey">South Africa</li>
              </ul>
            </div>
          </nav>
        </div>

        <div className="mt-20 flex flex-col gap-6 border-t border-paper/20 pt-8 lg:flex-row lg:items-center lg:justify-between">
          <p className="label text-grey">
            {FOOTER.rail.join("  /  ")}
          </p>
          <ul className="label flex flex-wrap gap-x-8 gap-y-2 text-grey">
            {FOOTER.legal.map((l) => (
              <li key={l}>
                {l} <span className="opacity-70">— in preparation</span>
              </li>
            ))}
          </ul>
          <p className="label text-grey">
            © {YEAR} Apex Motus. All rights reserved.
          </p>
        </div>

        <p className="display mt-16 text-[clamp(1.5rem,1rem+2.4vw,3rem)] leading-none text-paper">
          {FOOTER.signoff}
          <Period />
        </p>
      </Container>
    </footer>
  );
}
