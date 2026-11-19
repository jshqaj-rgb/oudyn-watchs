"use client";

import { useEffect, useState } from "react";
import { getRomeClock } from "@/lib/time";

const TICKS = Array.from({ length: 60 }, (_, index) => index);

export function LiveHeroDial({ className = "" }: { className?: string }) {
  const [clock, setClock] = useState<ReturnType<typeof getRomeClock> | null>(null);

  useEffect(() => {
    const tick = () => setClock(getRomeClock(new Date()));
    tick();
    const timer = window.setInterval(tick, 1000);
    return () => window.clearInterval(timer);
  }, []);

  const hour = clock?.hour ?? 10;
  const minute = clock?.minute ?? 8;
  const second = clock?.second ?? 37;
  const timeLabel = clock?.time ?? "10:08:37";
  const hourAngle = ((hour % 12) + minute / 60) * 30;
  const minuteAngle = (minute + second / 60) * 6;
  const secondAngle = second * 6;

  return (
    <svg
      viewBox="0 0 1000 1000"
      className={className}
      role="img"
      aria-label={`OUDYN instrument dial showing ${timeLabel} in Milan`}
    >
      <title>{`Milano ${timeLabel}`}</title>
      <circle cx="500" cy="500" r="500" fill="var(--color-black)" />
      <circle cx="500" cy="500" r="478" fill="var(--color-steel-gray)" />
      <circle cx="500" cy="500" r="462" fill="var(--color-black)" />
      <circle cx="500" cy="500" r="446" fill="none" stroke="var(--color-graphite)" strokeWidth="1" />

      {TICKS.map((tick) => {
        const angle = tick * 6;
        const major = tick % 5 === 0;
        return (
          <line
            key={tick}
            x1="500"
            y1={major ? 74 : 78}
            x2="500"
            y2={major ? 94 : 88}
            stroke="var(--color-white)"
            strokeWidth={major ? 2.2 : 1}
            transform={`rotate(${angle} 500 500)`}
            opacity={major ? 1 : 0.55}
          />
        );
      })}

      {Array.from({ length: 12 }, (_, index) => {
        const angle = index * 30;
        const isTwelve = index === 0;
        return (
          <g key={index} transform={`rotate(${angle} 500 500)`}>
            {isTwelve ? (
              <>
                <rect x="490" y="132" width="7" height="92" fill="var(--color-white)" />
                <rect x="503" y="132" width="7" height="92" fill="var(--color-white)" />
              </>
            ) : (
              <rect
                x="495"
                y="132"
                width="10"
                height={index % 3 === 0 ? 84 : 70}
                fill="var(--color-white)"
              />
            )}
          </g>
        );
      })}

      <text
        x="500"
        y="308"
        textAnchor="middle"
        className="dialBrand"
        fill="var(--color-white)"
        fontSize="30"
        fontWeight="700"
        letterSpacing="12"
      >
        OUDYN
      </text>
      <text
        x="500"
        y="336"
        textAnchor="middle"
        className="dialMono"
        fill="var(--color-graphite)"
        fontSize="11"
        letterSpacing="4"
      >
        WATCHS · MILANO
      </text>
      <text
        x="500"
        y="650"
        textAnchor="middle"
        className="dialMono"
        fill="var(--color-white)"
        fontSize="12"
        letterSpacing="5"
      >
        AUTOMATIC
      </text>
      <text
        x="500"
        y="674"
        textAnchor="middle"
        className="dialMono"
        fill="var(--color-graphite)"
        fontSize="10"
        letterSpacing="4"
      >
        300 M · 40 MM
      </text>

      <g transform={`rotate(${hourAngle} 500 500)`}>
        <path d="M500 250 L511 330 L507 500 L500 512 L493 500 L489 330 Z" fill="var(--color-white)" />
      </g>
      <g transform={`rotate(${minuteAngle} 500 500)`}>
        <path d="M500 160 L508 300 L505 500 L500 512 L495 500 L492 300 Z" fill="var(--color-white)" />
      </g>
      <g transform={`rotate(${secondAngle} 500 500)`} className="heroSecondHand">
        <rect x="499" y="176" width="2" height="410" fill="var(--color-white)" />
        <rect x="495" y="586" width="10" height="48" fill="var(--color-white)" />
        <circle cx="500" cy="500" r="12" fill="var(--color-white)" />
        <circle cx="500" cy="500" r="5" fill="var(--color-black)" />
      </g>
    </svg>
  );
}
