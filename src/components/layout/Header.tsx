"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Logo } from "@/components/brand/Logo";
import { Button } from "@/components/ui/Button";
import { MobileMenu } from "@/components/layout/MobileMenu";
import { CONTACT_HREF, NAV } from "@/content/site";
import { cn } from "@/lib/cn";

export function Header() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-40 border-b transition-[background-color,border-color,backdrop-filter] duration-[var(--duration-base)] ease-[var(--ease-standard)]",
        scrolled
          ? "border-rule bg-paper/92 backdrop-blur-md supports-[not(backdrop-filter:blur(1px))]:bg-paper"
          : "border-transparent bg-paper",
      )}
    >
      <div className="mx-auto flex h-16 w-full max-w-page items-center justify-between px-gutter lg:h-[4.5rem]">
        <Link href="/" aria-label="Apex Motus — home" className="block shrink-0">
          <Logo priority className="w-[6.75rem] lg:w-[7.5rem]" />
        </Link>

        <nav aria-label="Primary" className="hidden lg:block">
          <ul className="flex items-center gap-9">
            {NAV.map((item) => (
              <li key={item.label}>
                <Link
                  href={item.href}
                  className="link-draw py-2 text-[0.9375rem] font-medium text-ink"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-3">
          <div className="hidden lg:block">
            <Button href={CONTACT_HREF} className="min-h-11 py-2.5">
              Discuss your challenge
            </Button>
          </div>
          <MobileMenu />
        </div>
      </div>
    </header>
  );
}
