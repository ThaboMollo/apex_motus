import Image from "next/image";
import { cn } from "@/lib/cn";

type Variant = "wordmark" | "monogram";

/*
 * Approved artwork only — never re-set in a font. Intrinsic sizes keep the
 * aspect ratio locked so the logo can't stretch or cause layout shift.
 * `inverse` is the off-white version for dark (charcoal) backgrounds.
 */
const ART = {
  wordmark: { src: "/brand/apex-motus-wordmark.png", inv: "/brand/apex-motus-wordmark-inverse.png", w: 2058, h: 576 },
  monogram: { src: "/brand/px-monogram.png", inv: "/brand/px-monogram-inverse.png", w: 1713, h: 585 },
} as const;

export function Logo({
  variant = "wordmark",
  inverse = false,
  priority = false,
  className,
}: {
  variant?: Variant;
  inverse?: boolean;
  priority?: boolean;
  className?: string;
}) {
  const a = ART[variant];
  return (
    <Image
      src={inverse ? a.inv : a.src}
      width={a.w}
      height={a.h}
      alt="Apex Motus"
      priority={priority}
      sizes="(min-width: 1024px) 220px, 160px"
      className={cn("h-auto select-none", className)}
    />
  );
}
