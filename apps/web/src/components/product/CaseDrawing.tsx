export function CaseDrawing({
  diameter,
  lugWidth,
}: {
  diameter: string;
  lugWidth: string;
}) {
  return (
    <svg
      viewBox="0 0 520 360"
      role="img"
      aria-label={`Case drawing, ${diameter} diameter, ${lugWidth} lug width`}
      className="caseDrawing"
    >
      <g fill="none" stroke="#111" strokeWidth="1.1">
        <path d="M153 70h54v38h-54zM153 252h54v38h-54z" />
        <path d="M153 88c-18 12-30 34-30 62v60c0 28 12 50 30 62M207 88c18 12 30 34 30 62v60c0 28-12 50-30 62" />
        <circle cx="180" cy="180" r="82" />
        <circle cx="180" cy="180" r="64" />
        <circle cx="180" cy="180" r="44" strokeDasharray="1 5" />
        <path d="M262 164h13v32h-13z" />
        <path d="M275 172h7v16h-7z" />
        <path d="M180 70v16M180 274v16" />
        <path d="M290 70v-12M262 277v12" strokeDasharray="2 4" />

        <path d="M316 132h30v10h104v66H346v10h-30" />
        <path d="M316 142c-10 8-14 20-14 38s4 30 14 38" />
        <path d="M450 142c12 8 18 20 18 38s-6 30-18 38" />
        <path d="M320 174h22v12h-22z" />
        <path d="M342 146h108v68H342z" strokeDasharray="1 5" />
      </g>

      <g fill="#111" fontFamily="JetBrains Mono, ui-monospace, monospace" fontSize="8.5" letterSpacing="0.6">
        <text x="98" y="330">{diameter.toUpperCase()}</text>
        <text x="86" y="344">CASE DIAMETER</text>
        <text x="66" y="172" transform="rotate(-90 66 172)">
          {lugWidth.toUpperCase()}
        </text>
        <text x="430" y="330">{lugWidth.toUpperCase()}</text>
        <text x="404" y="344">LUG WIDTH</text>
        <text x="180" y="44" textAnchor="middle">
          FRONT
        </text>
        <text x="384" y="116" textAnchor="middle">
          PROFILE
        </text>
      </g>

      <g stroke="#111" strokeWidth="0.8">
        <path d="M96 300h168M96 296v8M264 296v8" />
        <path d="M92 70v220M88 70h8M88 290h8" />
      </g>
    </svg>
  );
}
