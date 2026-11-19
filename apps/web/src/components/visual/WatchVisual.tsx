import type { CSSProperties } from "react";
import type {
  DialTone,
  ProductView,
  ProductVisual,
  StrapTone,
  WatchVisual as WatchVisualConfig,
} from "@oudyn/contracts";

type Props = {
  visual: ProductVisual;
  view?: ProductView;
  name?: string;
  ref?: string;
  label: string;
  className?: string;
  style?: CSSProperties;
};

type Palette = { base: string; ink: string; muted: string; subdial: string };

const DIAL_PALETTES: Record<DialTone, Palette> = {
  black: { base: "#000000", ink: "#f6f6f6", muted: "#d9d9d9", subdial: "#000000" },
  white: { base: "#ffffff", ink: "#000000", muted: "#505050", subdial: "#f6f6f6" },
  gray: { base: "#505050", ink: "#f6f6f6", muted: "#d9d9d9", subdial: "#000000" },
  cream: { base: "#f6f6f6", ink: "#000000", muted: "#505050", subdial: "#ffffff" },
  panda: { base: "#ffffff", ink: "#000000", muted: "#505050", subdial: "#000000" },
};

const STRAP_TONES: Record<StrapTone, { base: string; stitch: string; edge: string }> = {
  black: { base: "#000000", stitch: "#505050", edge: "#505050" },
  gray: { base: "#505050", stitch: "#d9d9d9", edge: "#000000" },
  steel: { base: "#d9d9d9", stitch: "#505050", edge: "#505050" },
};

function polar(cx: number, cy: number, radius: number, angle: number) {
  const radians = (angle * Math.PI) / 180;
  const round = (value: number) => Math.round(value * 1000) / 1000;
  return {
    x: round(cx + radius * Math.sin(radians)),
    y: round(cy - radius * Math.cos(radians)),
  };
}

function range(count: number) {
  return Array.from({ length: count }, (_, index) => index);
}

function steelGradient(id: string, finish: "steel" | "black") {
  if (finish === "black") {
    return (
      <linearGradient id={id} x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#505050" />
        <stop offset="0.32" stopColor="#000000" />
        <stop offset="0.66" stopColor="#000000" />
        <stop offset="1" stopColor="#505050" />
      </linearGradient>
    );
  }
  return (
    <linearGradient id={id} x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stopColor="#f6f6f6" />
      <stop offset="0.22" stopColor="#d9d9d9" />
      <stop offset="0.48" stopColor="#505050" />
      <stop offset="0.68" stopColor="#d9d9d9" />
      <stop offset="1" stopColor="#f6f6f6" />
    </linearGradient>
  );
}

function Dial({
  cx,
  cy,
  radius,
  visual,
  uid,
  macro = false,
}: {
  cx: number;
  cy: number;
  radius: number;
  visual: WatchVisualConfig;
  uid: string;
  macro?: boolean;
}) {
  const palette = DIAL_PALETTES[visual.dial];
  const scale = radius / 196;
  const tickOuter = radius * 0.965;
  const tickInner = radius * 0.9;

  return (
    <g>
      <circle cx={cx} cy={cy} r={radius} fill={palette.base} />
      <circle cx={cx} cy={cy} r={radius * 0.985} fill="none" stroke={palette.ink} strokeOpacity="0.18" />

      {range(60).map((tick) => {
        const major = tick % 5 === 0;
        const outer = polar(cx, cy, tickOuter, tick * 6);
        const inner = polar(cx, cy, major ? tickInner - 3 * scale : tickOuter - 5 * scale, tick * 6);
        return (
          <line
            key={tick}
            x1={outer.x}
            y1={outer.y}
            x2={inner.x}
            y2={inner.y}
            stroke={palette.ink}
            strokeWidth={major ? 1.6 * scale : 0.7 * scale}
            strokeOpacity={major ? 0.9 : 0.5}
          />
        );
      })}

      {visual.indices === "baton" && (
        <g>
          {range(12).map((index) => {
            const hour = index + 1;
            if (visual.date && hour === 3) return null;
            if (hour === 12) {
              return (
                <g key={hour} transform={`rotate(0 ${cx} ${cy})`}>
                  <rect
                    x={cx - radius * 0.075}
                    y={cy - radius * 0.86}
                    width={radius * 0.06}
                    height={radius * 0.18}
                    rx={radius * 0.012}
                    fill={palette.ink}
                  />
                  <rect
                    x={cx + radius * 0.015}
                    y={cy - radius * 0.86}
                    width={radius * 0.06}
                    height={radius * 0.18}
                    rx={radius * 0.012}
                    fill={palette.ink}
                  />
                </g>
              );
            }
            return (
              <g key={hour} transform={`rotate(${hour * 30} ${cx} ${cy})`}>
                <rect
                  x={cx - radius * 0.032}
                  y={cy - radius * 0.87}
                  width={radius * 0.064}
                  height={radius * 0.19}
                  rx={radius * 0.012}
                  fill={palette.ink}
                />
                <rect
                  x={cx - radius * 0.018}
                  y={cy - radius * 0.82}
                  width={radius * 0.036}
                  height={radius * 0.1}
                  fill={palette.muted}
                  fillOpacity="0.55"
                />
              </g>
            );
          })}
        </g>
      )}

      {visual.indices === "arabic" && (
        <g>
          {range(12).map((index) => {
            const hour = index + 1;
            if (visual.date && hour === 3) return null;
            const point = polar(cx, cy, radius * 0.74, hour * 30);
            return (
              <text
                key={hour}
                x={point.x}
                y={point.y + radius * 0.05}
                textAnchor="middle"
                fill={palette.ink}
                fontFamily='"Helvetica Neue", Helvetica, Arial, sans-serif'
                fontSize={radius * (hour === 12 ? 0.16 : 0.13)}
                fontWeight={hour === 12 ? 700 : 400}
                letterSpacing={-1}
              >
                {hour}
              </text>
            );
          })}
        </g>
      )}

      {visual.indices === "dot" && (
        <g>
          {range(12).map((index) => {
            const hour = index + 1;
            if (visual.date && hour === 3) return null;
            const point = polar(cx, cy, radius * 0.8, hour * 30);
            return (
              <circle
                key={hour}
                cx={point.x}
                cy={point.y}
                r={radius * (hour % 3 === 0 ? 0.028 : 0.018)}
                fill={palette.ink}
              />
            );
          })}
        </g>
      )}

      {visual.subdials && (
        <g>
          {[
            { x: cx - radius * 0.45, y: cy, label: "30" },
            { x: cx + radius * 0.45, y: cy, label: "15" },
            { x: cx, y: cy + radius * 0.45, label: "60" },
          ].map((dial) => (
            <g key={dial.label}>
              <circle
                cx={dial.x}
                cy={dial.y}
                r={radius * 0.185}
                fill={palette.subdial}
                stroke={palette.ink}
                strokeOpacity="0.5"
                strokeWidth={0.8 * scale}
              />
              <circle
                cx={dial.x}
                cy={dial.y}
                r={radius * 0.155}
                fill="none"
                stroke={palette.subdial === "#000000" ? "#f6f6f6" : "#000000"}
                strokeOpacity="0.25"
                strokeWidth={0.7 * scale}
                strokeDasharray={`${scale * 1.5} ${scale * 4}`}
              />
              <line
                x1={dial.x}
                y1={dial.y}
                x2={dial.x}
                y2={dial.y - radius * 0.11}
                stroke={palette.subdial === "#000000" ? "#f6f6f6" : "#000000"}
                strokeWidth={1.4 * scale}
              />
            </g>
          ))}
        </g>
      )}

      {visual.gmt && (
        <g>
          <text
            x={cx}
            y={cy - radius * 0.33}
            textAnchor="middle"
            fill={palette.ink}
            fontFamily='"JetBrains Mono", monospace'
            fontSize={radius * 0.045}
            letterSpacing={radius * 0.02}
          >
            GMT
          </text>
        </g>
      )}

      <text
        x={cx}
        y={cy - radius * 0.46}
        textAnchor="middle"
        fill={palette.ink}
        fontFamily='"Helvetica Neue", Helvetica, Arial, sans-serif'
        fontSize={radius * 0.095}
        fontWeight={700}
        letterSpacing={radius * 0.038}
      >
        OUDYN
      </text>
      <text
        x={cx}
        y={cy - radius * 0.37}
        textAnchor="middle"
        fill={palette.ink}
        fillOpacity="0.75"
        fontFamily='"JetBrains Mono", monospace'
        fontSize={radius * 0.036}
        letterSpacing={radius * 0.016}
      >
        {visual.subdials ? "CHRONOGRAPH" : visual.gmt ? "AUTOMATIC" : "AUTOMATIC"}
      </text>

      {!visual.subdials && (
        <text
          x={cx}
          y={cy + radius * 0.5}
          textAnchor="middle"
          fill={palette.ink}
          fillOpacity="0.6"
          fontFamily='"JetBrains Mono", monospace'
          fontSize={radius * 0.034}
          letterSpacing={radius * 0.012}
        >
          {macro ? "300M / 1000FT · MILANO" : "300M / 1000FT"}
        </text>
      )}

      {visual.date && !visual.subdials && (
        <g>
          <rect
            x={cx + radius * 0.56}
            y={cy - radius * 0.095}
            width={radius * 0.23}
            height={radius * 0.19}
            fill="#ffffff"
            stroke={palette.ink}
            strokeWidth={0.9 * scale}
          />
          <text
            x={cx + radius * 0.675}
            y={cy + radius * 0.055}
            textAnchor="middle"
            fill="#000000"
            fontFamily='"JetBrains Mono", monospace'
            fontSize={radius * 0.115}
          >
            19
          </text>
        </g>
      )}

      <Hands cx={cx} cy={cy} radius={radius} ink={palette.ink} style={visual.hands} gmt={visual.gmt} />

      <circle
        cx={cx}
        cy={cy}
        r={radius * 0.045}
        fill={palette.base}
        stroke={palette.ink}
        strokeWidth={1.2 * scale}
      />
      <circle cx={cx} cy={cy} r={radius * 0.018} fill={palette.ink} />

      <ellipse
        cx={cx - radius * 0.28}
        cy={cy - radius * 0.32}
        rx={radius * 0.7}
        ry={radius * 0.34}
        fill="#ffffff"
        fillOpacity="0.045"
        transform={`rotate(-34 ${cx - radius * 0.28} ${cy - radius * 0.32})`}
      />
      <path
        d={`M ${cx - radius * 0.92} ${cy + radius * 0.12} A ${radius} ${radius} 0 0 1 ${cx - radius * 0.55} ${cy - radius * 0.82}`}
        fill="none"
        stroke="#ffffff"
        strokeOpacity="0.12"
        strokeWidth={radius * 0.018}
      />
      <defs>
        <clipPath id={`${uid}-dialclip`}>
          <circle cx={cx} cy={cy} r={radius} />
        </clipPath>
      </defs>
    </g>
  );
}

function Hands({
  cx,
  cy,
  radius,
  ink,
  style,
  gmt,
}: {
  cx: number;
  cy: number;
  radius: number;
  ink: string;
  style: WatchVisualConfig["hands"];
  gmt?: boolean;
}) {
  const hourAngle = 305;
  const minuteAngle = 60;
  const secondAngle = 186;
  const hourLength = radius * 0.53;
  const minuteLength = radius * 0.8;

  return (
    <g>
      {gmt && (
        <g transform={`rotate(${minuteAngle + 42} ${cx} ${cy})`}>
          <line
            x1={cx}
            y1={cy + radius * 0.1}
            x2={cx}
            y2={cy - radius * 0.68}
            stroke={ink}
            strokeWidth={radius * 0.018}
          />
          <path
            d={`M ${cx} ${cy - radius * 0.73} l ${-radius * 0.035} ${radius * 0.08} l ${radius * 0.07} 0 Z`}
            fill={ink}
          />
        </g>
      )}

      <g transform={`rotate(${hourAngle} ${cx} ${cy})`}>
        {style === "pencil" ? (
          <rect
            x={cx - radius * 0.012}
            y={cy - hourLength}
            width={radius * 0.024}
            height={hourLength}
            fill={ink}
          />
        ) : (
          <>
            <path
              d={`M ${cx - radius * 0.035} ${cy} L ${cx - radius * 0.026} ${cy - hourLength + radius * 0.02} L ${cx} ${cy - hourLength} L ${cx + radius * 0.026} ${cy - hourLength + radius * 0.02} L ${cx + radius * 0.035} ${cy} Z`}
              fill={ink}
            />
            <rect
              x={cx - radius * 0.012}
              y={cy - hourLength + radius * 0.09}
              width={radius * 0.024}
              height={hourLength * 0.55}
              fill={ink === "#000000" ? "#d9d9d9" : "#000000"}
              fillOpacity="0.22"
            />
          </>
        )}
      </g>

      <g transform={`rotate(${minuteAngle} ${cx} ${cy})`}>
        {style === "pencil" ? (
          <rect
            x={cx - radius * 0.009}
            y={cy - minuteLength}
            width={radius * 0.018}
            height={minuteLength}
            fill={ink}
          />
        ) : (
          <>
            <path
              d={`M ${cx - radius * 0.028} ${cy} L ${cx - radius * 0.018} ${cy - minuteLength + radius * 0.03} L ${cx} ${cy - minuteLength} L ${cx + radius * 0.018} ${cy - minuteLength + radius * 0.03} L ${cx + radius * 0.028} ${cy} Z`}
              fill={ink}
            />
            <rect
              x={cx - radius * 0.009}
              y={cy - minuteLength + radius * 0.12}
              width={radius * 0.018}
              height={minuteLength * 0.55}
              fill={ink === "#000000" ? "#d9d9d9" : "#000000"}
              fillOpacity="0.22"
            />
          </>
        )}
      </g>

      <g transform={`rotate(${secondAngle} ${cx} ${cy})`}>
        <line
          x1={cx}
          y1={cy + radius * 0.18}
          x2={cx}
          y2={cy - radius * 0.9}
          stroke={ink}
          strokeWidth={radius * 0.011}
        />
        <circle cx={cx} cy={cy - radius * 0.64} r={radius * 0.024} fill="none" stroke={ink} strokeWidth={radius * 0.008} />
        <circle cx={cx} cy={cy + radius * 0.1} r={radius * 0.022} fill={ink} />
      </g>
    </g>
  );
}

function StrapFront({
  visual,
  uid,
}: {
  visual: WatchVisualConfig;
  uid: string;
}) {
  const tone = STRAP_TONES[visual.strapTone];
  const isBracelet = visual.strap === "bracelet";
  const isLeather = visual.strap === "leather" || visual.strap === "suede";
  const isRibbed = visual.strap === "rubber" || visual.strap === "tpu";

  return (
    <g>
      <path d="M318 0 H482 L468 512 H332 Z" fill={isBracelet ? `url(#${uid}-steel)` : tone.base} />
      <path d="M318 0 H482 L468 512 H332 Z" fill="none" stroke={tone.edge} strokeOpacity="0.6" />
      <path d="M332 512 H468 L482 1000 H318 Z" fill={isBracelet ? `url(#${uid}-steel)` : tone.base} />
      <path d="M332 512 H468 L482 1000 H318 Z" fill="none" stroke={tone.edge} strokeOpacity="0.6" />

      {isBracelet &&
        range(34).map((index) => {
          const y = index * 30;
          return (
            <g key={index}>
              <line x1="318" y1={y} x2="482" y2={y + 4} stroke="#000000" strokeOpacity="0.28" strokeWidth="1.5" />
              <line x1="318" y1={y + 4} x2="482" y2={y + 8} stroke="#ffffff" strokeOpacity="0.28" strokeWidth="1" />
            </g>
          );
        })}

      {isRibbed &&
        range(38).map((index) => {
          const y = index * 27 + 8;
          return (
            <path
              key={index}
              d={`M330 ${y} Q400 ${y + 10} 470 ${y}`}
              fill="none"
              stroke={tone.stitch}
              strokeOpacity="0.22"
              strokeWidth="2"
            />
          );
        })}

      {isLeather && (
        <>
          <path d="M327 0 L340 512 L336 1000" fill="none" stroke={tone.stitch} strokeOpacity="0.45" strokeDasharray="3 7" />
          <path d="M473 0 L460 512 L464 1000" fill="none" stroke={tone.stitch} strokeOpacity="0.45" strokeDasharray="3 7" />
          {[812, 858, 904, 950].map((y) => (
            <circle key={y} cx="400" cy={y} r="7" fill="#000000" fillOpacity="0.55" stroke={tone.stitch} strokeOpacity="0.35" />
          ))}
        </>
      )}

      {isBracelet && (
        <rect x="318" y="488" width="164" height="24" fill="#000000" fillOpacity="0.12" />
      )}
    </g>
  );
}

function Case({
  visual,
  uid,
  cx,
  cy,
  radius,
}: {
  visual: WatchVisualConfig;
  uid: string;
  cx: number;
  cy: number;
  radius: number;
}) {
  const isCushion = visual.bezel === "cushion";
  const caseFill = `url(#${uid}-case)`;
  const dialRadius = isCushion ? radius * 0.76 : radius * 0.79;
  const bezelInner = dialRadius + 10;

  return (
    <g>
      {!isCushion && (
        <g fill={caseFill}>
          <path d="M318 350 C300 305 310 260 338 242 C362 226 392 236 406 264 L416 330 Z" />
          <path d="M482 350 C500 305 490 260 462 242 C438 226 408 236 394 264 L384 330 Z" />
          <path d="M318 650 C300 695 310 740 338 758 C362 774 392 764 406 736 L416 670 Z" />
          <path d="M482 650 C500 695 490 740 462 758 C438 774 408 764 394 736 L384 670 Z" />
        </g>
      )}

      <rect x={cx + radius - 4} y={cy - 30} width="44" height="60" rx="8" fill={caseFill} stroke="#000000" strokeOpacity="0.45" />
      {range(7).map((index) => (
        <line
          key={index}
          x1={cx + radius + 2}
          y1={cy - 24 + index * 8}
          x2={cx + radius + 38}
          y2={cy - 24 + index * 8}
          stroke="#000000"
          strokeOpacity="0.35"
        />
      ))}

      {visual.subdials && (
        <g>
          <rect x={cx + radius * 0.55} y={cy - radius * 0.72} width="26" height="54" rx="8" fill={caseFill} stroke="#000000" strokeOpacity="0.4" transform={`rotate(-36 ${cx + radius * 0.55} ${cy - radius * 0.72})`} />
          <rect x={cx + radius * 0.55} y={cy + radius * 0.46} width="26" height="54" rx="8" fill={caseFill} stroke="#000000" strokeOpacity="0.4" transform={`rotate(36 ${cx + radius * 0.55} ${cy + radius * 0.46})`} />
        </g>
      )}

      {isCushion ? (
        <>
          <rect x={cx - radius - 8} y={cy - radius - 8} width={(radius + 8) * 2} height={(radius + 8) * 2} rx={radius * 0.58} fill={caseFill} stroke="#000000" strokeOpacity="0.5" />
          <rect x={cx - radius * 0.9} y={cy - radius * 0.9} width={radius * 1.8} height={radius * 1.8} rx={radius * 0.5} fill={caseFill} stroke="#000000" strokeOpacity="0.35" />
          <circle cx={cx} cy={cy} r={bezelInner + 18} fill="#000000" />
          <Dial cx={cx} cy={cy} radius={dialRadius} visual={visual} uid={uid} />
        </>
      ) : (
        <>
          <circle cx={cx} cy={cy} r={radius + 8} fill={caseFill} stroke="#000000" strokeOpacity="0.45" />
          <circle cx={cx} cy={cy} r={radius} fill="none" stroke="#000000" strokeOpacity="0.35" strokeWidth="2" />
          <circle cx={cx} cy={cy} r={radius * 0.93} fill={visual.bezel === "dive" ? "#000000" : caseFill} stroke="#000000" strokeOpacity="0.4" />
          {visual.bezel === "dive" && (
            <g>
              {range(60).map((index) => {
                const outer = polar(cx, cy, radius * 0.93, index * 6);
                const inner = polar(cx, cy, radius * 0.87, index * 6);
                return (
                  <line
                    key={index}
                    x1={outer.x}
                    y1={outer.y}
                    x2={inner.x}
                    y2={inner.y}
                    stroke="#f6f6f6"
                    strokeOpacity={index % 5 === 0 ? 0.9 : 0.32}
                    strokeWidth={index % 5 === 0 ? 2 : 0.8}
                  />
                );
              })}
              <path
                d={`M ${cx} ${cy - radius * 0.9} l ${-radius * 0.045} ${radius * 0.08} l ${radius * 0.09} 0 Z`}
                fill="#f6f6f6"
              />
              {[15, 30, 45].map((minute) => {
                const point = polar(cx, cy, radius * 0.81, minute * 6);
                return (
                  <text
                    key={minute}
                    x={point.x}
                    y={point.y + 4}
                    textAnchor="middle"
                    fill="#f6f6f6"
                    fontFamily='"JetBrains Mono", monospace'
                    fontSize={radius * 0.055}
                  >
                    {minute}
                  </text>
                );
              })}
            </g>
          )}
          {visual.bezel === "coin" &&
            range(72).map((index) => {
              const point = polar(cx, cy, radius * 0.965, index * 5);
              return (
                <rect
                  key={index}
                  x={point.x - 1.4}
                  y={point.y - 4}
                  width="2.8"
                  height="8"
                  fill="#000000"
                  fillOpacity="0.35"
                  transform={`rotate(${index * 5} ${point.x} ${point.y})`}
                />
              );
            })}
          {visual.bezel === "smooth" && (
            <circle cx={cx} cy={cy} r={radius * 0.9} fill="none" stroke="#000000" strokeOpacity="0.28" />
          )}
          <Dial cx={cx} cy={cy} radius={dialRadius} visual={visual} uid={uid} />
        </>
      )}

      <circle
        cx={cx}
        cy={cy}
        r={radius + 2}
        fill="none"
        stroke="#ffffff"
        strokeOpacity="0.24"
        strokeWidth="1"
      />
    </g>
  );
}

function StrapProduct({ visual, uid }: { visual: Extract<ProductVisual, { kind: "strap" }>; uid: string }) {
  const tone = STRAP_TONES[visual.strapTone];
  const isSteel = visual.strapTone === "steel";
  const fill = isSteel ? `url(#${uid}-steel)` : tone.base;
  const ribbed = visual.strap === "rubber" || visual.strap === "tpu";
  const leather = visual.strap === "leather" || visual.strap === "suede";

  return (
    <g>
      <path d="M300 56 H500 L482 348 H318 Z" fill={fill} stroke={tone.edge} strokeOpacity="0.6" />
      <path d="M318 452 H482 L500 744 H300 Z" fill={fill} stroke={tone.edge} strokeOpacity="0.6" />

      <rect x="292" y="48" width="216" height="16" rx="8" fill={fill} stroke={tone.edge} strokeOpacity="0.5" />
      <rect x="292" y="736" width="216" height="16" rx="8" fill={fill} stroke={tone.edge} strokeOpacity="0.5" />
      <rect x="378" y="52" width="44" height="4" fill={tone.stitch} fillOpacity="0.65" />
      <rect x="378" y="744" width="44" height="4" fill={tone.stitch} fillOpacity="0.65" />

      {ribbed &&
        range(20).map((index) => {
          const y = 70 + index * 32;
          return (
            <path
              key={index}
              d={`M312 ${y} Q400 ${y + 12} 488 ${y}`}
              fill="none"
              stroke={tone.stitch}
              strokeOpacity="0.2"
              strokeWidth="3"
            />
          );
        })}

      {leather && (
        <>
          <path d="M310 60 L324 348 M490 60 L476 348" stroke={tone.stitch} strokeOpacity="0.45" strokeDasharray="3 7" fill="none" />
          <path d="M324 452 L310 740 M476 452 L490 740" stroke={tone.stitch} strokeOpacity="0.45" strokeDasharray="3 7" fill="none" />
        </>
      )}

      <g>
        <rect x="324" y="640" width="148" height="76" rx="10" fill="none" stroke="#505050" strokeWidth="10" />
        <rect x="336" y="652" width="124" height="52" rx="6" fill="none" stroke="#000000" strokeOpacity="0.35" strokeWidth="1.5" />
        <line x1="390" y1="648" x2="412" y2="708" stroke="#505050" strokeWidth="8" strokeLinecap="round" />
        {[500, 534, 568, 602].map((y) => (
          <circle key={y} cx="398" cy={y} r="7" fill="#000000" fillOpacity="0.5" stroke={tone.stitch} strokeOpacity="0.4" />
        ))}
      </g>
    </g>
  );
}

export function WatchVisual({ visual, view = "front", name = "", ref = "", label, className, style }: Props) {
  const uid = `${visual.kind}-${visual.strapTone}-${visual.strap}-${view}-${name.replace(/\s+/g, "") || "oudyn"}`;
  const shared = {
    role: "img" as const,
    "aria-label": label,
    className,
    style,
    preserveAspectRatio: "xMidYMid meet" as const,
  };

  if (visual.kind === "strap" || view === "strap") {
    return (
      <svg viewBox="0 0 800 800" {...shared}>
        <defs>{steelGradient(`${uid}-steel`, "steel")}</defs>
        <StrapProduct visual={visual.kind === "strap" ? visual : { kind: "strap", strap: visual.strap, strapTone: visual.strapTone }} uid={uid} />
      </svg>
    );
  }

  if (view === "dial") {
    return (
      <svg viewBox="0 0 800 800" {...shared}>
        <defs>
          {steelGradient(`${uid}-case`, visual.caseFinish)}
          <filter id={`${uid}-shadow`} x="-30%" y="-30%" width="160%" height="160%">
            <feDropShadow dx="0" dy="16" stdDeviation="18" floodColor="#000000" floodOpacity="0.18" />
          </filter>
        </defs>
        <g filter={`url(#${uid}-shadow)`}>
          <circle cx="400" cy="400" r="382" fill="none" stroke="#000000" strokeOpacity="0.12" />
          <circle cx="400" cy="400" r="366" fill="none" stroke={`url(#${uid}-case)`} strokeWidth="22" />
          <circle cx="400" cy="400" r="348" fill={`url(#${uid}-case)`} />
          <circle cx="400" cy="400" r="332" fill={visual.bezel === "dive" ? "#000000" : `url(#${uid}-case)`} />
          {range(60).map((index) => {
            const outer = polar(400, 400, 330, index * 6);
            const inner = polar(400, 400, 314, index * 6);
            return (
              <line
                key={index}
                x1={outer.x}
                y1={outer.y}
                x2={inner.x}
                y2={inner.y}
                stroke={visual.bezel === "dive" ? "#f6f6f6" : "#000000"}
                strokeOpacity={index % 5 === 0 ? 0.8 : 0.3}
                strokeWidth={index % 5 === 0 ? 2.4 : 1}
              />
            );
          })}
          <Dial cx={400} cy={400} radius={312} visual={visual} uid={uid} macro />
          <circle cx="400" cy="400" r="336" fill="none" stroke="#000000" strokeOpacity="0.35" />
          <circle cx="400" cy="400" r="366" fill="none" stroke="#ffffff" strokeOpacity="0.2" strokeWidth="2" />
        </g>
      </svg>
    );
  }

  if (view === "caseback") {
    return (
      <svg viewBox="0 0 800 800" {...shared}>
        <defs>
          {steelGradient(`${uid}-case`, visual.caseFinish)}
          <filter id={`${uid}-shadow`} x="-30%" y="-30%" width="160%" height="160%">
            <feDropShadow dx="0" dy="14" stdDeviation="18" floodColor="#000000" floodOpacity="0.16" />
          </filter>
          <path
            id={`${uid}-ringpath`}
            d="M400,400 m-286,0 a286,286 0 1,1 572,0 a286,286 0 1,1 -572,0"
            fill="none"
          />
        </defs>
        <g filter={`url(#${uid}-shadow)`}>
          <circle cx="400" cy="400" r="366" fill={`url(#${uid}-case)`} stroke="#000000" strokeOpacity="0.4" />
          {range(8).map((index) => {
            const point = polar(400, 400, 330, index * 45 + 22.5);
            return (
              <g key={index}>
                <circle cx={point.x} cy={point.y} r="10" fill="#000000" fillOpacity="0.08" stroke="#000000" strokeOpacity="0.35" />
                <line x1={point.x - 5} y1={point.y} x2={point.x + 5} y2={point.y} stroke="#000000" strokeOpacity="0.45" />
              </g>
            );
          })}
          <circle cx="400" cy="400" r="300" fill="none" stroke="#000000" strokeOpacity="0.3" />
          <circle cx="400" cy="400" r="292" fill="none" stroke="#ffffff" strokeOpacity="0.22" />
          <circle cx="400" cy="400" r="244" fill={`url(#${uid}-case)`} stroke="#000000" strokeOpacity="0.25" />
          <circle cx="400" cy="400" r="232" fill="none" stroke="#000000" strokeOpacity="0.2" strokeDasharray="1 5" />
          <text fill="#000000" fillOpacity="0.62" fontFamily='"JetBrains Mono", monospace' fontSize="10" letterSpacing="2.4">
            <textPath href={`#${uid}-ringpath`} startOffset="1%">
              OUDYN WATCHS · 316L STAINLESS STEEL · INDIVIDUALLY TESTED · MILANO · 300M
            </textPath>
          </text>
          <text
            x="400"
            y="355"
            textAnchor="middle"
            fill="#000000"
            fillOpacity="0.72"
            fontFamily='"Helvetica Neue", Helvetica, Arial, sans-serif'
            fontWeight={700}
            fontSize="34"
            letterSpacing="9"
          >
            OUDYN
          </text>
          <line x1="330" y1="374" x2="470" y2="374" stroke="#000000" strokeOpacity="0.32" />
          <text
            x="400"
            y="406"
            textAnchor="middle"
            fill="#000000"
            fillOpacity="0.68"
            fontFamily='"JetBrains Mono", monospace'
            fontSize="12"
            letterSpacing="2"
          >
            {name || "OUDYN WATCH"}
          </text>
          <text
            x="400"
            y="436"
            textAnchor="middle"
            fill="#000000"
            fillOpacity="0.5"
            fontFamily='"JetBrains Mono", monospace'
            fontSize="9"
            letterSpacing="1.6"
          >
            {ref || "ODN-000"}
          </text>
          <text
            x="400"
            y="470"
            textAnchor="middle"
            fill="#000000"
            fillOpacity="0.5"
            fontFamily='"JetBrains Mono", monospace'
            fontSize="9"
            letterSpacing="1.6"
          >
            No. 014 / 250
          </text>
          <line x1="352" y1="490" x2="448" y2="490" stroke="#000000" strokeOpacity="0.22" />
          <text
            x="400"
            y="514"
            textAnchor="middle"
            fill="#000000"
            fillOpacity="0.45"
            fontFamily='"JetBrains Mono", monospace'
            fontSize="8"
            letterSpacing="2"
          >
            MADE IN ITALY · SAPPHIRE
          </text>
        </g>
      </svg>
    );
  }

  if (view === "profile") {
    return (
      <svg viewBox="0 0 800 520" {...shared}>
        <defs>
          {steelGradient(`${uid}-case`, visual.caseFinish)}
          <filter id={`${uid}-shadow`} x="-30%" y="-30%" width="160%" height="160%">
            <feDropShadow dx="0" dy="14" stdDeviation="16" floodColor="#000000" floodOpacity="0.16" />
          </filter>
        </defs>
        <g filter={`url(#${uid}-shadow)`}>
          <path
            d="M240 250 Q240 206 300 206 H520 Q580 206 580 250 V262 H600 Q640 262 640 284 Q640 306 600 306 H580 V318 Q580 358 520 358 H300 Q240 358 240 318 Z"
            fill={`url(#${uid}-case)`}
            stroke="#000000"
            strokeOpacity="0.38"
          />
          <path
            d="M250 250 Q250 222 310 222 H555 Q570 222 570 250 L570 262 H250 Z"
            fill={`url(#${uid}-case)`}
            stroke="#000000"
            strokeOpacity="0.3"
          />
          <path
            d="M286 224 Q286 176 400 176 Q514 176 514 224 L514 240 L286 240 Z"
            fill="#ffffff"
            fillOpacity="0.1"
            stroke="#000000"
            strokeOpacity="0.35"
          />
          <path
            d="M296 224 Q296 188 400 188 Q504 188 504 224"
            fill="none"
            stroke="#ffffff"
            strokeOpacity="0.4"
            strokeWidth="2"
          />
          <path
            d="M300 346 Q300 378 400 378 Q500 378 500 346"
            fill={`url(#${uid}-case)`}
            stroke="#000000"
            strokeOpacity="0.3"
          />
          {range(9).map((index) => (
            <line
              key={index}
              x1="600"
              y1={266 + index * 4}
              x2="640"
              y2={266 + index * 4}
              stroke="#000000"
              strokeOpacity="0.35"
            />
          ))}
          <path d="M232 248 L196 232 L196 252 L232 264 Z" fill={`url(#${uid}-case)`} stroke="#000000" strokeOpacity="0.35" />
          <path d="M232 316 L196 332 L196 312 L232 300 Z" fill={`url(#${uid}-case)`} stroke="#000000" strokeOpacity="0.35" />
          <path d="M568 248 L604 232 L604 252 L568 264 Z" fill={`url(#${uid}-case)`} stroke="#000000" strokeOpacity="0.35" />
          <path d="M568 316 L604 332 L604 312 L568 300 Z" fill={`url(#${uid}-case)`} stroke="#000000" strokeOpacity="0.35" />
          <line x1="250" y1="270" x2="570" y2="270" stroke="#ffffff" strokeOpacity="0.3" />
        </g>

        <g stroke="#505050" strokeWidth="0.8" fill="none">
          <line x1="180" y1="176" x2="180" y2="378" />
          <line x1="174" y1="176" x2="186" y2="176" />
          <line x1="174" y1="378" x2="186" y2="378" />
          <line x1="240" y1="412" x2="640" y2="412" />
          <line x1="240" y1="406" x2="240" y2="418" />
          <line x1="640" y1="406" x2="640" y2="418" />
        </g>
        <text
          x="164"
          y="277"
          fill="#505050"
          fontFamily='"JetBrains Mono", monospace'
          fontSize="9"
          letterSpacing="1.5"
          transform="rotate(-90 164 277)"
          textAnchor="middle"
        >
          11.8 MM
        </text>
        <text
          x="440"
          y="434"
          fill="#505050"
          textAnchor="middle"
          fontFamily='"JetBrains Mono", monospace'
          fontSize="9"
          letterSpacing="1.5"
        >
          40.0 MM
        </text>
        <text
          x="400"
          y="476"
          fill="#505050"
          textAnchor="middle"
          fontFamily='"JetBrains Mono", monospace'
          fontSize="9"
          letterSpacing="2"
        >
          CASE PROFILE — SCALE 1:1
        </text>
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 800 1000" {...shared}>
      <defs>
        {steelGradient(`${uid}-case`, visual.caseFinish)}
        {steelGradient(`${uid}-steel`, "steel")}
        <filter id={`${uid}-shadow`} x="-30%" y="-30%" width="160%" height="160%">
          <feDropShadow dx="0" dy="18" stdDeviation="16" floodColor="#000000" floodOpacity="0.2" />
        </filter>
      </defs>
      <g filter={`url(#${uid}-shadow)`}>
        <StrapFront visual={visual} uid={uid} />
        <Case visual={visual} uid={uid} cx={400} cy={500} radius={252} />
      </g>
    </svg>
  );
}
