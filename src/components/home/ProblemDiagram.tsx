/*
 * Purpose-built diagram: six operational "nodes" with broken connections.
 * The lime square marks the missing link — the gap Apex Motus closes.
 * Nodes light up when the matching challenge in the list is hovered (CSS :has).
 */
const NODES = [
  { n: 1, x: 36, y: 56, w: 132, h: 56 },
  { n: 2, x: 300, y: 36, w: 150, h: 56 },
  { n: 3, x: 200, y: 160, w: 120, h: 56 },
  { n: 4, x: 36, y: 250, w: 150, h: 56 },
  { n: 5, x: 330, y: 270, w: 130, h: 56 },
  { n: 6, x: 170, y: 370, w: 150, h: 56 },
];

export function ProblemDiagram({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 520 450"
      role="img"
      aria-label="Diagram of six operational blocks joined by connections that are broken in several places, with one missing link highlighted."
      className={className}
      fill="none"
    >
      {/* Connections */}
      <g stroke="var(--color-paper)" strokeWidth="1.5" opacity="0.7">
        {/* solid */}
        <path d="M150 112 L200 180" />
        <path d="M186 270 L225 216" />
        <path d="M130 306 L170 392" />
        {/* broken (two halves) */}
        <path d="M320 176 L326 148" />
        <path d="M334 120 L340 92" />
        <path d="M270 216 L290 242" />
        <path d="M310 264 L330 290" />
        <path d="M320 398 L342 378" />
        <path d="M368 350 L390 326" />
      </g>

      {/* break marks */}
      <g stroke="var(--color-paper)" strokeWidth="1.5" opacity="0.9">
        {[
          [300, 253],
          [355, 364],
        ].map(([x, y]) => (
          <g key={`${x}${y}`}>
            <line x1={x - 4} y1={y - 4} x2={x + 4} y2={y + 4} />
            <line x1={x - 4} y1={y + 4} x2={x + 4} y2={y - 4} />
          </g>
        ))}
      </g>

      {/* The missing link */}
      <rect x="324" y="128" width="12" height="12" fill="var(--color-lime)" />
      <circle cx="330" cy="134" r="16" stroke="var(--color-lime)" strokeWidth="1.25" strokeDasharray="3 4" />

      {/* Nodes */}
      {NODES.map((nd) => (
        <g key={nd.n} className="problem-node" data-node={nd.n}>
          <rect
            className="node-body"
            x={nd.x}
            y={nd.y}
            width={nd.w}
            height={nd.h}
            rx={nd.h / 2}
            stroke="var(--color-paper)"
            strokeWidth="1.5"
            fill="transparent"
          />
          <text
            className="node-num"
            x={nd.x + nd.w / 2}
            y={nd.y + nd.h / 2 + 6}
            textAnchor="middle"
            fontFamily="var(--font-mono)"
            fontSize="18"
            letterSpacing="2"
          >
            0{nd.n}
          </text>
        </g>
      ))}
    </svg>
  );
}
