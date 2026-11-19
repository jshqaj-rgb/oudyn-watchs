"use client";

import { useRomeClock } from "@/components/time/useRomeClock";

export function FooterClock({ className }: { className?: string }) {
  const { mounted, clock, weather } = useRomeClock();

  return (
    <p className={className} aria-label="Current time in Milan">
      <span>Milano</span>
      <span aria-hidden="true"> · </span>
      <time suppressHydrationWarning>{mounted && clock ? clock.time : "--:--:--"}</time>
      <span aria-hidden="true"> · </span>
      <span suppressHydrationWarning>
        {mounted && weather ? `${weather.temperature}°C ${weather.label.toUpperCase()}` : "LOCAL WEATHER"}
      </span>
    </p>
  );
}
