import Image from "next/image";

/*
 * Hero visual: architectural photograph with the brand's forward chevron laid
 * over it (the "progress" signal moving through a built structure).
 * The chevron is an original motif derived from the PX grammar, not the logo.
 * Offsets sit on wrapper <g>s so the entrance animation can't override them.
 */
const CHEVRON = "M150 120 H225 L345 250 L225 380 H150 L270 250 Z";

export function HeroVisual({ className }: { className?: string }) {
  return (
    <div className={className}>
      <div className="relative aspect-[4/3] overflow-hidden border border-ink bg-paper-deep sm:aspect-[16/10] lg:aspect-[4/5]">
        <Image
          src="/images/hero-concrete-curves.jpg"
          alt="Sweeping curved concrete forms against a pale sky."
          fill
          priority
          sizes="(min-width: 1024px) 42vw, 100vw"
          className="object-cover object-[68%_50%]"
        />
        {/* keeps the overlay readable on the lightest parts of the sky */}
        <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-ink/25 via-transparent to-transparent" />

        <svg
          aria-hidden="true"
          viewBox="0 0 400 500"
          preserveAspectRatio="xMidYMid slice"
          className="absolute inset-0 size-full"
          fill="none"
        >
          <g stroke="var(--color-paper)" strokeWidth="1.5">
            <g transform="translate(-120 0)" opacity="0.35">
              <path d={CHEVRON} className="anim-slide" style={{ "--i": 0 } as React.CSSProperties} />
            </g>
            <g transform="translate(-60 0)" opacity="0.7">
              <path d={CHEVRON} className="anim-slide" style={{ "--i": 1 } as React.CSSProperties} />
            </g>
          </g>
          <path
            d={CHEVRON}
            fill="var(--color-lime)"
            className="anim-slide"
            style={{ "--i": 2 } as React.CSSProperties}
          />
          <circle
            cx="270"
            cy="250"
            r="84"
            stroke="var(--color-paper)"
            strokeWidth="1.25"
            strokeDasharray="3 6"
            className="anim-fade"
            style={{ "--i": 6 } as React.CSSProperties}
          />
        </svg>
      </div>
    </div>
  );
}
