export const ROME_TIME_ZONE = "Asia/Hong_Kong";

const timeFormatter = new Intl.DateTimeFormat("en-GB", {
  timeZone: ROME_TIME_ZONE,
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  hourCycle: "h23",
});

const dateFormatter = new Intl.DateTimeFormat("en-GB", {
  timeZone: ROME_TIME_ZONE,
  weekday: "short",
  day: "2-digit",
  month: "short",
});

export type RomeClock = {
  hour: number;
  minute: number;
  second: number;
  time: string;
  date: string;
  hourAngle: number;
  minuteAngle: number;
  secondAngle: number;
};

export function getRomeClock(date: Date): RomeClock {
  const parts = timeFormatter.formatToParts(date);
  const value = (type: Intl.DateTimeFormatPartTypes) =>
    Number(parts.find((part) => part.type === type)?.value ?? 0);

  const hour = value("hour") % 24;
  const minute = value("minute");
  const second = value("second");

  return {
    hour,
    minute,
    second,
    time: `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}:${String(second).padStart(2, "0")}`,
    date: dateFormatter.format(date).toUpperCase(),
    hourAngle: (hour % 12) * 30 + minute * 0.5,
    minuteAngle: minute * 6 + second * 0.1,
    secondAngle: second * 6,
  };
}

const SYNODIC_MONTH = 29.530588853;
const NEW_MOON_EPOCH = Date.UTC(2000, 0, 6, 18, 14, 0);

const MOON_NAMES = [
  "New moon",
  "Waxing crescent",
  "First quarter",
  "Waxing gibbous",
  "Full moon",
  "Waning gibbous",
  "Last quarter",
  "Waning crescent",
] as const;

export function getMoonPhase(date: Date): { name: string; fraction: number } {
  const days = (date.getTime() - NEW_MOON_EPOCH) / 86_400_000;
  const age = ((days % SYNODIC_MONTH) + SYNODIC_MONTH) % SYNODIC_MONTH;
  const fraction = age / SYNODIC_MONTH;
  const index = Math.floor(fraction * 8 + 0.5) % 8;
  return { name: MOON_NAMES[index], fraction };
}

const WEATHER_LABELS: Record<number, string> = {
  0: "Clear",
  1: "Mainly clear",
  2: "Partly cloudy",
  3: "Overcast",
  45: "Fog",
  48: "Rime fog",
  51: "Light drizzle",
  53: "Drizzle",
  55: "Heavy drizzle",
  61: "Light rain",
  63: "Rain",
  65: "Heavy rain",
  66: "Freezing rain",
  67: "Freezing rain",
  71: "Light snow",
  73: "Snow",
  75: "Heavy snow",
  77: "Snow grains",
  80: "Light showers",
  81: "Showers",
  82: "Heavy showers",
  85: "Snow showers",
  86: "Snow showers",
  95: "Thunderstorm",
  96: "Thunderstorm",
  99: "Thunderstorm",
};

export type MilanWeather = {
  temperature: number;
  code: number;
  label: string;
};

let weatherCache: { value: MilanWeather; at: number } | null = null;
let weatherRequest: Promise<MilanWeather | null> | null = null;

export function weatherLabel(code: number): string {
  return WEATHER_LABELS[code] ?? "Hong Kong";
}

export async function fetchMilanWeather(): Promise<MilanWeather | null> {
  if (weatherCache && Date.now() - weatherCache.at < 15 * 60 * 1000) {
    return weatherCache.value;
  }
  if (weatherRequest) return weatherRequest;

  weatherRequest = (async () => {
    try {
      const response = await fetch(
        "https://api.open-meteo.com/v1/forecast?latitude=22.3193&longitude=114.1694&current=temperature_2m,weather_code&timezone=Asia%2FHong_Kong",
        { cache: "no-store" },
      );
      if (!response.ok) return null;
      const data = (await response.json()) as {
        current?: { temperature_2m?: number; weather_code?: number };
      };
      const temperature = Math.round(data.current?.temperature_2m ?? 0);
      const code = data.current?.weather_code ?? 0;
      const value = { temperature, code, label: weatherLabel(code) };
      weatherCache = { value, at: Date.now() };
      return value;
    } catch {
      return null;
    } finally {
      weatherRequest = null;
    }
  })();

  return weatherRequest;
}
