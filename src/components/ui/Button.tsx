import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/cn";

type Props = {
  href: string;
  variant?: "primary" | "outline" | "ink";
  arrow?: "right" | "up-right" | false;
  className?: string;
  children: React.ReactNode;
};

/*
 * Primary = lime fill + ink text (the controlled signal).
 * Outline = ink hairline. Ink = charcoal fill, for use on lime.
 * States: default · hover (arrow travels) · active (pressed) · focus-visible (global ring).
 */
const base =
  "group inline-flex min-h-12 items-center justify-between gap-6 border px-5 py-3 text-[0.9375rem] font-semibold leading-none tracking-[-0.01em] transition-[background-color,color,border-color,transform] duration-[var(--duration-base)] ease-[var(--ease-standard)] active:translate-y-px";

const variants = {
  primary: "border-ink bg-lime text-ink hover:bg-ink hover:text-lime active:bg-lime-deep",
  outline: "border-ink bg-transparent text-ink hover:bg-ink hover:text-paper active:bg-ink/90",
  ink: "border-ink bg-ink text-paper hover:bg-paper hover:text-ink active:bg-paper-deep",
} as const;

export function Button({ href, variant = "primary", arrow = "right", className, children }: Props) {
  const external = href.startsWith("mailto:") || href.startsWith("http");
  const Icon = arrow === "up-right" ? ArrowUpRight : ArrowRight;
  const content = (
    <>
      <span>{children}</span>
      {arrow && (
        <Icon
          aria-hidden="true"
          className="size-4 shrink-0 transition-transform duration-[var(--duration-base)] ease-[var(--ease-out-quart)] group-hover:translate-x-0.5"
          strokeWidth={2}
        />
      )}
    </>
  );
  const cls = cn(base, variants[variant], className);
  return external ? (
    <a href={href} className={cls}>
      {content}
    </a>
  ) : (
    <Link href={href} className={cls}>
      {content}
    </Link>
  );
}

/** Quiet text action with a drawn underline and a travelling arrow. */
export function ArrowLink({
  href,
  children,
  className,
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
}) {
  const external = href.startsWith("mailto:") || href.startsWith("http");
  const inner = (
    <>
      <span className="link-draw pb-0.5">{children}</span>
      <ArrowRight
        aria-hidden="true"
        className="size-4 transition-transform duration-[var(--duration-base)] ease-[var(--ease-out-quart)] group-hover:translate-x-1"
        strokeWidth={2}
      />
    </>
  );
  const cls = cn("group inline-flex items-center gap-2 text-[0.9375rem] font-semibold", className);
  return external ? (
    <a href={href} className={cls}>{inner}</a>
  ) : (
    <Link href={href} className={cls}>{inner}</Link>
  );
}
