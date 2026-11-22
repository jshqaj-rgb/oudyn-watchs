import type { CSSProperties } from "react";

function range(count: number) {
  return Array.from({ length: count }, (_, index) => index);
}

function polar(cx: number, cy: number, radius: number, angle: number) {
  const radians = (angle * Math.PI) / 180;
  return { x: cx + radius * Math.sin(radians), y: cy - radius * Math.cos(radians) };
}

type VisualProps = { className?: string; style?: CSSProperties };

export function PressureVisual({ className, style }: VisualProps) {
  return (
    <svg viewBox="0 0 800 600" className={className} style={style} role="img" aria-label="Diagram of a caseback tested to 300 metres">
      <rect width="800" height="600" fill="#d9d9d9" />
      <g stroke="#000000" fill="none">
        <circle cx="400" cy="300" r="196" strokeOpacity="0.85" />
        <circle cx="400" cy="300" r="178" strokeOpacity="0.4" />
        <circle cx="400" cy="300" r="142" strokeOpacity="0.55" strokeDasharray="1 6" />
        <circle cx="400" cy="300" r="92" strokeOpacity="0.25" />
        {range(8).map((index) => {
          const point = polar(400, 300, 172, index * 45 + 22.5);
          return <circle key={index} cx={point.x} cy={point.y} r="7" strokeOpacity="0.55" />;
        })}
        {range(12).map((index) => {
          const outer = polar(400, 300, 216, index * 30);
          const inner = polar(400, 300, 200, index * 30);
          return <line key={index} x1={outer.x} y1={outer.y} x2={inner.x} y2={inner.y} strokeOpacity="0.5" />;
        })}
      </g>
      <text x="400" y="260" textAnchor="middle" fill="#000000" fontFamily='"JetBrains Mono", monospace' fontSize="11" letterSpacing="4">
        PRESSURE TESTED
      </text>
      <text x="400" y="330" textAnchor="middle" fill="#000000" fontFamily='"Helvetica Neue", Helvetica, Arial, sans-serif' fontSize="72" fontWeight="700" letterSpacing="-4">
        300
      </text>
      <text x="400" y="360" textAnchor="middle" fill="#505050" fontFamily='"JetBrains Mono", monospace' fontSize="10" letterSpacing="3">
        METRES / 30 ATM
      </text>
      <text x="400" y="530" textAnchor="middle" fill="#505050" fontFamily='"JetBrains Mono", monospace' fontSize="9" letterSpacing="2">
        INDIVIDUALLY TESTED · CASE No. 014
      </text>
      <g stroke="#505050" fill="none" strokeWidth="0.8">
        <line x1="240" y1="470" x2="240" y2="506" />
        <line x1="560" y1="470" x2="560" y2="506" />
        <line x1="234" y1="470" x2="246" y2="470" />
        <line x1="554" y1="470" x2="566" y2="470" />
        <line x1="234" y1="506" x2="246" y2="506" />
        <line x1="554" y1="506" x2="566" y2="506" />
      </g>
    </svg>
  );
}

export function RegulationVisual({ className, style }: VisualProps) {
  return (
    <svg viewBox="0 0 800 600" className={className} style={style} role="img" aria-label="Regulation diagram of a mechanical movement">
      <rect width="800" height="600" fill="#f6f6f6" />
      <g stroke="#000000" fill="none">
        <circle cx="430" cy="300" r="190" strokeOpacity="0.6" />
        <circle cx="430" cy="300" r="156" strokeOpacity="0.35" />
        <circle cx="430" cy="300" r="126" strokeOpacity="0.8" />
        <circle cx="430" cy="300" r="112" strokeOpacity="0.3" />
        <circle cx="430" cy="300" r="46" strokeOpacity="0.6" />
        <path d="M430 300 C470 250 540 260 548 310 C556 360 500 392 462 372" strokeOpacity="0.45" />
        <path d="M430 300 C390 260 330 280 332 330 C334 378 392 398 424 368" strokeOpacity="0.25" />
        {range(20).map((index) => {
          const point = polar(430, 300, 140, index * 18);
          return <circle key={index} cx={point.x} cy={point.y} r="1.6" fill="#000000" stroke="none" />;
        })}
        {range(6).map((index) => {
          const point = polar(430, 300, 170, index * 60);
          return <line key={index} x1={point.x} y1={point.y} x2="430" y2="300" strokeOpacity="0.12" />;
        })}
      </g>
      <g stroke="#505050" fill="none">
        <line x1="130" y1="122" x2="238" y2="122" />
        <line x1="130" y1="132" x2="206" y2="132" strokeOpacity="0.5" />
        <line x1="130" y1="144" x2="220" y2="144" strokeOpacity="0.3" />
        <line x1="130" y1="156" x2="190" y2="156" strokeOpacity="0.3" />
      </g>
      <text x="130" y="104" fill="#000000" fontFamily='"JetBrains Mono", monospace' fontSize="10" letterSpacing="2.5">
        REGULATED IN-HOUSE
      </text>
      <text x="130" y="216" fill="#000000" fontFamily='"Helvetica Neue", Helvetica, Arial, sans-serif' fontSize="40" fontWeight="700" letterSpacing="-1.5">
        ±12 s/day
      </text>
      <text x="130" y="240" fill="#505050" fontFamily='"JetBrains Mono", monospace' fontSize="9" letterSpacing="2">
        FIVE POSITIONS · FIVE DAYS
      </text>
      <text x="130" y="500" fill="#505050" fontFamily='"JetBrains Mono", monospace' fontSize="9" letterSpacing="2">
        CALIBRE OD-01 · 28,800 VPH
      </text>
    </svg>
  );
}

export function CertificateVisual({ className, style }: VisualProps) {
  return (
    <svg viewBox="0 0 800 600" className={className} style={style} role="img" aria-label="Inspection record illustration">
      <rect width="800" height="600" fill="#d9d9d9" />
      <g transform="rotate(-2 400 300)">
        <rect x="190" y="86" width="420" height="440" fill="#ffffff" stroke="#000000" strokeOpacity="0.2" />
        <rect x="204" y="100" width="392" height="412" fill="none" stroke="#000000" strokeOpacity="0.25" />
        <text x="232" y="150" fill="#000000" fontFamily='"Helvetica Neue", Helvetica, Arial, sans-serif' fontSize="20" fontWeight="700" letterSpacing="5">
          OUDYN
        </text>
        <text x="232" y="168" fill="#505050" fontFamily='"JetBrains Mono", monospace' fontSize="8" letterSpacing="2.5">
          WATCHS · MILANO
        </text>
        <line x1="232" y1="192" x2="568" y2="192" stroke="#000000" strokeOpacity="0.35" />
        <text x="232" y="232" fill="#000000" fontFamily='"JetBrains Mono", monospace' fontSize="9" letterSpacing="2">
          CERTIFICATE OF REGULATION
        </text>
        <text x="232" y="262" fill="#505050" fontFamily='"Helvetica Neue", Helvetica, Arial, sans-serif' fontSize="12">
          Movement inspected, regulated and pressure tested
        </text>
        <text x="232" y="282" fill="#505050" fontFamily='"Helvetica Neue", Helvetica, Arial, sans-serif' fontSize="12">
          before the watch is released.
        </text>
        {range(5).map((index) => (
          <line
            key={index}
            x1="232"
            y1={320 + index * 24}
            x2={index === 4 ? 430 : 568}
            y2={320 + index * 24}
            stroke="#000000"
            strokeOpacity="0.16"
          />
        ))}
        <circle cx="500" cy="408" r="58" fill="none" stroke="#000000" strokeOpacity="0.5" />
        <circle cx="500" cy="408" r="48" fill="none" stroke="#000000" strokeOpacity="0.25" strokeDasharray="2 4" />
        <text x="500" y="400" textAnchor="middle" fill="#000000" fontFamily='"JetBrains Mono", monospace' fontSize="9" letterSpacing="2">
          OUDYN
        </text>
        <text x="500" y="418" textAnchor="middle" fill="#000000" fontFamily='"JetBrains Mono", monospace' fontSize="9" letterSpacing="2">
          TESTED
        </text>
        <text x="500" y="434" textAnchor="middle" fill="#505050" fontFamily='"JetBrains Mono", monospace' fontSize="7" letterSpacing="1.5">
          26 · 02
        </text>
        <text x="232" y="478" fill="#505050" fontFamily='"JetBrains Mono", monospace' fontSize="8" letterSpacing="1.5">
          SERIAL ODN-01-STA-014
        </text>
      </g>
      <text x="130" y="552" fill="#505050" fontFamily='"JetBrains Mono", monospace' fontSize="9" letterSpacing="2">
        SIGNED BY HAND · FILED BY SERIAL
      </text>
    </svg>
  );
}

export function AtelierVisual({ className, style }: VisualProps) {
  return (
    <svg viewBox="0 0 1600 900" className={className} style={style} role="img" aria-label="Technical drawing of an OUDYN movement">
      <rect width="1600" height="900" fill="#000000" />
      <g stroke="#f6f6f6" fill="none">
        <circle cx="980" cy="470" r="400" strokeOpacity="0.2" />
        <circle cx="980" cy="470" r="330" strokeOpacity="0.35" />
        <circle cx="980" cy="470" r="252" strokeOpacity="0.5" />
        <circle cx="980" cy="470" r="120" strokeOpacity="0.35" />
        <path d="M980 470 C1080 350 1260 380 1284 510 C1308 640 1160 720 1060 668" strokeOpacity="0.55" />
        <path d="M980 470 C880 370 720 410 716 540 C712 668 860 724 950 654" strokeOpacity="0.3" />
        <path d="M980 138 A332 332 0 0 1 1312 470" strokeOpacity="0.55" strokeWidth="2" />
        <path d="M980 802 A332 332 0 0 1 648 470" strokeOpacity="0.2" />
        {range(36).map((index) => {
          const outer = polar(980, 470, 330, index * 10);
          const inner = polar(980, 470, 300, index * 10);
          return <line key={index} x1={outer.x} y1={outer.y} x2={inner.x} y2={inner.y} strokeOpacity="0.4" />;
        })}
        {range(12).map((index) => {
          const point = polar(980, 470, 190, index * 30);
          return <circle key={index} cx={point.x} cy={point.y} r="4" fill="#f6f6f6" stroke="none" fillOpacity="0.5" />;
        })}
        {range(6).map((index) => {
          const point = polar(980, 470, 270, index * 60 + 15);
          return (
            <g key={index}>
              <line x1={point.x - 12} y1={point.y} x2={point.x + 12} y2={point.y} strokeOpacity="0.55" />
              <line x1={point.x} y1={point.y - 12} x2={point.x} y2={point.y + 12} strokeOpacity="0.55" />
            </g>
          );
        })}
      </g>
      <g fill="#f6f6f6" fillOpacity="0.55">
        {range(22).map((index) => (
          <rect key={index} x={120 + index * 4} y={700 - index * 6} width="1" height={120 + index * 6} />
        ))}
      </g>
      <text x="120" y="160" fill="#f6f6f6" fontFamily='"JetBrains Mono", monospace' fontSize="12" letterSpacing="4">
        CALIBRE OD-01
      </text>
      <text x="120" y="196" fill="#f6f6f6" fillOpacity="0.55" fontFamily='"JetBrains Mono", monospace' fontSize="10" letterSpacing="2.5">
        AUTOMATIC · 28,800 VPH · 41 H
      </text>
      <line x1="120" y1="230" x2="420" y2="230" stroke="#f6f6f6" strokeOpacity="0.3" />
      <text x="120" y="270" fill="#f6f6f6" fillOpacity="0.4" fontFamily='"JetBrains Mono", monospace' fontSize="9" letterSpacing="2">
        EXPLODED VIEW / PLATE 01
      </text>
      <g stroke="#f6f6f6" strokeOpacity="0.25">
        <line x1="120" y1="820" x2="1480" y2="820" />
        <line x1="120" y1="814" x2="120" y2="826" />
        <line x1="1480" y1="814" x2="1480" y2="826" />
      </g>
      <text x="800" y="846" fill="#f6f6f6" fillOpacity="0.4" textAnchor="middle" fontFamily='"JetBrains Mono", monospace' fontSize="9" letterSpacing="2">
        MILANO · 45.4642° N / 9.1900° E
      </text>
    </svg>
  );
}

export function DialBand({ className, style }: VisualProps) {
  return (
    <svg viewBox="0 0 1600 320" className={className} style={style} role="img" aria-label="Macro detail of an OUDYN dial">
      <rect width="1600" height="320" fill="#000000" />
      <circle cx="800" cy="470" r="480" fill="none" stroke="#505050" strokeOpacity="0.5" />
      <circle cx="800" cy="470" r="430" fill="none" stroke="#f6f6f6" strokeOpacity="0.2" />
      {range(72).map((index) => {
        const outer = polar(800, 470, 432, index * 5);
        const inner = polar(800, 470, index % 6 === 0 ? 400 : 414, index * 5);
        return (
          <line
            key={index}
            x1={outer.x}
            y1={outer.y}
            x2={inner.x}
            y2={inner.y}
            stroke="#f6f6f6"
            strokeOpacity={index % 6 === 0 ? 0.55 : 0.25}
            strokeWidth={index % 6 === 0 ? 2 : 1}
          />
        );
      })}
      <circle cx="800" cy="470" r="350" fill="#000000" />
      <circle cx="800" cy="470" r="350" fill="none" stroke="#f6f6f6" strokeOpacity="0.18" />
      <text x="800" y="180" textAnchor="middle" fill="#f6f6f6" fillOpacity="0.18" fontFamily='"Helvetica Neue", Helvetica, Arial, sans-serif' fontSize="120" fontWeight="700" letterSpacing="34">
        OUDYN
      </text>
      <text x="800" y="220" textAnchor="middle" fill="#f6f6f6" fillOpacity="0.32" fontFamily='"JetBrains Mono", monospace' fontSize="12" letterSpacing="8">
        WATCHS · MILANO
      </text>
      <g stroke="#f6f6f6" strokeOpacity="0.35">
        <line x1="800" y1="30" x2="800" y2="250" />
        <line x1="800" y1="30" x2="760" y2="120" />
        <line x1="800" y1="30" x2="840" y2="120" />
      </g>
      <line x1="0" y1="300" x2="1600" y2="300" stroke="#505050" />
    </svg>
  );
}
