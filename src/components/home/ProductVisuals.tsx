/*
 * Schematic product visuals: abstractions of the *idea* of each product,
 * not fake interface screenshots. Replace with real product imagery once approved.
 */

/** BabyBlue: a scheduling grid; one lime slot = the booking being made. */
export function ClinicVisual({ className }: { className?: string }) {
  const cols = 5;
  const rows = 5;
  const days = ["MON", "TUE", "WED", "THU", "FRI"];
  const filled = new Set(["0-1", "0-3", "1-0", "1-2", "2-1", "2-4", "3-0", "3-3", "4-2"]);
  return (
    <svg
      viewBox="0 0 480 300"
      fill="none"
      role="img"
      aria-label="Abstract scheduling grid with one highlighted booking slot."
      className={className}
    >
      {days.map((d, c) => (
        <text
          key={d}
          x={64 + c * 84 + 36}
          y="24"
          textAnchor="middle"
          fontFamily="var(--font-mono)"
          fontSize="11"
          letterSpacing="1.5"
          fill="var(--color-ink-soft)"
        >
          {d}
        </text>
      ))}
      {Array.from({ length: rows }).map((_, r) => (
        <text
          key={`t${r}`}
          x="8"
          y={62 + r * 50}
          fontFamily="var(--font-mono)"
          fontSize="11"
          letterSpacing="1"
          fill="var(--color-ink-soft)"
        >
          {`${8 + r}:00`}
        </text>
      ))}
      {Array.from({ length: rows }).flatMap((_, r) =>
        Array.from({ length: cols }).map((__, c) => {
          const key = `${r}-${c}`;
          const isLime = key === "2-2";
          return (
            <rect
              key={key}
              x={64 + c * 84}
              y={40 + r * 50}
              width="72"
              height="34"
              rx="17"
              fill={isLime ? "var(--color-lime)" : filled.has(key) ? "var(--color-grey)" : "transparent"}
              stroke={isLime ? "var(--color-ink)" : "var(--color-grey)"}
              strokeWidth={isLime ? 1.75 : 1.25}
            />
          );
        }),
      )}
    </svg>
  );
}

/** ScanYa: a QR-style matrix inside scan brackets with a lime scan line. */
export function ScanVisual({ className }: { className?: string }) {
  const N = 11;
  const cell = 16;
  const ox = 240 - (N * cell) / 2;
  const oy = 150 - (N * cell) / 2;
  // deterministic pseudo-pattern (deliberately not a real, scannable QR code)
  const on = (r: number, c: number) => ((r * 7 + c * 13 + r * c) % 5 < 2) !== ((r + c) % 7 === 0);
  const finder = (x: number, y: number) => (
    <g key={`${x}-${y}`}>
      <rect x={x} y={y} width={cell * 3 - 3} height={cell * 3 - 3} stroke="var(--color-ink)" strokeWidth="2.5" />
      <rect x={x + cell} y={y + cell} width={cell - 3} height={cell - 3} fill="var(--color-ink)" />
    </g>
  );
  return (
    <svg
      viewBox="0 0 480 300"
      fill="none"
      role="img"
      aria-label="Abstract QR-style pattern inside scanning brackets with a highlighted scan line."
      className={className}
    >
      <g stroke="var(--color-ink)" strokeWidth="2.5" strokeLinecap="square">
        <path d="M150 30 H120 V60" />
        <path d="M330 30 H360 V60" />
        <path d="M150 270 H120 V240" />
        <path d="M330 270 H360 V240" />
      </g>
      {Array.from({ length: N }).flatMap((_, r) =>
        Array.from({ length: N }).map((__, c) => {
          const inFinder = (r < 3 && c < 3) || (r < 3 && c >= N - 3) || (r >= N - 3 && c < 3);
          if (inFinder || !on(r, c)) return null;
          return (
            <rect
              key={`${r}-${c}`}
              x={ox + c * cell}
              y={oy + r * cell}
              width={cell - 3}
              height={cell - 3}
              fill="var(--color-ink)"
            />
          );
        }),
      )}
      {finder(ox, oy)}
      {finder(ox + (N - 3) * cell, oy)}
      {finder(ox, oy + (N - 3) * cell)}
      <rect x="104" y="146" width="272" height="8" fill="var(--color-lime)" stroke="var(--color-ink)" strokeWidth="1.25" />
    </svg>
  );
}
