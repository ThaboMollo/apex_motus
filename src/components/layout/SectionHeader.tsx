import { cn } from "@/lib/cn";

/** Mono section identifier — `[ 03 ]  THE PROBLEM` — sitting on a hairline. */
export function SectionLabel({
  index,
  children,
  className,
}: {
  index: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <p className={cn("label flex items-center gap-4 text-ink-soft", className)}>
      <span className="text-ink">[ {index} ]</span>
      <span>{children}</span>
    </p>
  );
}
