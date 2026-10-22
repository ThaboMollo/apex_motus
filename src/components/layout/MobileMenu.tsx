"use client";

import * as Dialog from "@radix-ui/react-dialog";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Logo } from "@/components/brand/Logo";
import { Button } from "@/components/ui/Button";
import { CONTACT_HREF, NAV, SITE } from "@/content/site";

/*
 * Full-height sheet, not a squeezed desktop nav.
 * Radix Dialog supplies the focus trap, Escape-to-close, scroll lock and
 * return-focus; links close the sheet so in-page anchors land cleanly.
 */
export function MobileMenu() {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  // Close first, navigate after the dialog's scroll-lock has released,
  // otherwise the browser scrolls to the anchor while the page is still locked.
  const go = (href: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    setOpen(false);
    window.setTimeout(() => router.push(href), 80);
  };

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <button
          type="button"
          aria-label="Open menu"
          className="inline-flex size-11 items-center justify-center border border-ink text-ink transition-colors duration-[var(--duration-fast)] hover:bg-ink hover:text-paper active:translate-y-px lg:hidden"
        >
          <Menu aria-hidden="true" className="size-5" strokeWidth={1.75} />
        </button>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Content
          aria-describedby={undefined}
          className="fixed inset-0 z-50 flex flex-col bg-paper outline-none data-[state=open]:animate-[fade_200ms_var(--ease-standard)]"
        >
          <Dialog.Title className="sr-only">Menu</Dialog.Title>

          <div className="flex h-16 items-center justify-between px-gutter">
            <Logo className="w-[6.75rem]" />
            <Dialog.Close asChild>
              <button
                type="button"
                aria-label="Close menu"
                className="inline-flex size-11 items-center justify-center border border-ink text-ink transition-colors duration-[var(--duration-fast)] hover:bg-ink hover:text-paper active:translate-y-px"
              >
                <X aria-hidden="true" className="size-5" strokeWidth={1.75} />
              </button>
            </Dialog.Close>
          </div>

          <nav aria-label="Mobile" className="flex-1 overflow-y-auto px-gutter pt-6">
            <ol className="border-t border-rule">
              {NAV.map((item, i) => (
                <li key={item.label} className="border-b border-rule">
                  <Link
                    href={item.href}
                    onClick={go(item.href)}
                    className="group flex items-baseline gap-5 py-5"
                  >
                    <span className="label text-ink-soft">0{i + 1}</span>
                    <span className="display text-[clamp(1.75rem,1.2rem+2.6vw,2.5rem)] leading-none transition-transform duration-[var(--duration-base)] ease-[var(--ease-out-quart)] group-hover:translate-x-1">
                      {item.label}
                    </span>
                  </Link>
                </li>
              ))}
            </ol>
          </nav>

          <div className="space-y-4 px-gutter pb-8 pt-6">
            <Button href={CONTACT_HREF} className="w-full">
              Discuss your challenge
            </Button>
            <p className="label text-ink-soft">{SITE.email}</p>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
