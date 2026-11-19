"use client";

import { useEffect, useState } from "react";
import { fetchMilanWeather, getMoonPhase, getRomeClock, type MilanWeather, type RomeClock } from "@/lib/time";

export type LiveTime = {
  mounted: boolean;
  clock: RomeClock | null;
  moon: string;
  weather: MilanWeather | null;
};

export function useRomeClock(): LiveTime {
  const [mounted, setMounted] = useState(false);
  const [clock, setClock] = useState<RomeClock | null>(null);
  const [moon, setMoon] = useState("—");
  const [weather, setWeather] = useState<MilanWeather | null>(null);

  useEffect(() => {
    setMounted(true);

    const tick = () => {
      const now = new Date();
      setClock(getRomeClock(now));
      setMoon(getMoonPhase(now).name.toUpperCase());
    };

    tick();
    const interval = window.setInterval(tick, 1000);

    let cancelled = false;
    fetchMilanWeather().then((value) => {
      if (!cancelled) setWeather(value);
    });

    return () => {
      cancelled = true;
      window.clearInterval(interval);
    };
  }, []);

  return { mounted, clock, moon, weather };
}
