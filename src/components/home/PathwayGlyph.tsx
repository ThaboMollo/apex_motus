/* Four purpose-drawn glyphs from the same capsule / chevron grammar. Decorative. */
export function PathwayGlyph({ slug, className }: { slug: string; className?: string }) {
  const common = {
    viewBox: "0 0 48 48",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 2,
    strokeLinejoin: "round" as const,
    strokeLinecap: "round" as const,
    "aria-hidden": true,
    className,
  };
  switch (slug) {
    case "systems-platforms":
      return (
        <svg {...common}>
          <rect x="4" y="8" width="26" height="12" rx="6" />
          <rect x="18" y="28" width="26" height="12" rx="6" />
          <path d="M17 20v4a4 4 0 0 0 4 4h0" />
        </svg>
      );
    case "process-engineering":
      return (
        <svg {...common}>
          <path d="M8 10l10 14L8 38" />
          <path d="M20 10l10 14-10 14" />
          <path d="M32 10l10 14-10 14" />
        </svg>
      );
    case "data-automation":
      return (
        <svg {...common}>
          <path d="M8 40V28M20 40V20M32 40V12" />
          <path d="M6 40h38" />
          <circle cx="40" cy="12" r="3" />
        </svg>
      );
    default:
      return (
        <svg {...common}>
          <circle cx="24" cy="24" r="16" />
          <circle cx="24" cy="24" r="6" />
          <path d="M24 2v6M24 40v6" />
        </svg>
      );
  }
}
