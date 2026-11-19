"use client";

import { useRomeClock } from "@/components/time/useRomeClock";
import styles from "./Hero.module.css";

export function RomeReadout() {
  const { mounted, clock, moon, weather } = useRomeClock();

  return (
    <p className={styles.readout} aria-label="Live time, moon phase and weather in Milan">
      <span className={styles.readoutPlace}>Milano</span>
      <span aria-hidden="true" className={styles.dot} />
      <time suppressHydrationWarning>{mounted && clock ? clock.time : "--:--:--"}</time>
      <span aria-hidden="true" className={styles.dot} />
      <span suppressHydrationWarning>{mounted && moon && moon !== "—" ? moon : "MOON —"}</span>
      <span aria-hidden="true" className={styles.dot} />
      <span suppressHydrationWarning>
        {mounted && weather ? `${weather.temperature}°C ${weather.label.toUpperCase()}` : "WEATHER —"}
      </span>
    </p>
  );
}
