import { useCallback, useEffect, useMemo, useState } from "react";
import "../styles/components/weatherCard.css";

type Coordinates = { latitude: number; longitude: number };

type WeatherSnapshot = {
  temperature: number;
  humidity: number;
  windSpeed: number;
  apparentTemperature: number;
  pressure: number;
  weatherCode: number;
  aqi: number | null;
  location: string;
};

type ForecastResponse = {
  current?: {
    temperature_2m?: number;
    relative_humidity_2m?: number;
    wind_speed_10m?: number;
    apparent_temperature?: number;
    surface_pressure?: number;
    weather_code?: number;
  };
};

type AirQualityResponse = {
  current?: {
    us_aqi?: number;
  };
};

const REFRESH_MS = 1000 * 60 * 10;
const DEFAULT_LOCATION: Coordinates = {
  latitude: 32.0853,
  longitude: 34.7818,
};
const DEFAULT_LOCATION_LABEL = "Tel Aviv, Israel";
const FALLBACK_NOTICE = "Showing weather for a default location. Enable location for local weather.";

function weatherIconByCode(code: number): string {
  if (code === 0) return "☀️";
  if ([1, 2, 3].includes(code)) return "⛅";
  if ([45, 48].includes(code)) return "🌫️";
  if ([51, 53, 55, 56, 57].includes(code)) return "🌦️";
  if ([61, 63, 65, 66, 67, 80, 81, 82].includes(code)) return "🌧️";
  if ([71, 73, 75, 77, 85, 86].includes(code)) return "❄️";
  if ([95, 96, 99].includes(code)) return "⛈️";
  return "🌤️";
}

function aqiStatus(aqi: number | null): { label: string; tone: "good" | "mid" | "bad" } {
  if (aqi === null) return { label: "Unknown", tone: "mid" };
  if (aqi <= 50) return { label: "Healthy", tone: "good" };
  if (aqi <= 100) return { label: "Moderate", tone: "mid" };
  return { label: "Poor", tone: "bad" };
}

export default function WeatherCard() {
  const [coords, setCoords] = useState<Coordinates | null>(null);
  const [snapshot, setSnapshot] = useState<WeatherSnapshot | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [locationNotice, setLocationNotice] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchWeather = useCallback(async (latitude: number, longitude: number) => {
    const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,wind_speed_10m,surface_pressure,weather_code&timezone=auto`;
    const airQualityUrl = `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${latitude}&longitude=${longitude}&current=us_aqi&timezone=auto`;

    const [forecastRes, airRes] = await Promise.all([
      fetch(weatherUrl),
      fetch(airQualityUrl),
    ]);

    if (!forecastRes.ok) {
      throw new Error("Failed to fetch weather data");
    }

    const forecastJson = (await forecastRes.json()) as ForecastResponse;
    const airJson = airRes.ok
      ? ((await airRes.json()) as AirQualityResponse)
      : ({ current: {} } as AirQualityResponse);

    const current = forecastJson.current;
    if (!current) {
      throw new Error("Missing current weather");
    }

    const locationLabel = DEFAULT_LOCATION_LABEL;
    return {
      temperature: current.temperature_2m ?? 0,
      humidity: current.relative_humidity_2m ?? 0,
      windSpeed: current.wind_speed_10m ?? 0,
      apparentTemperature: current.apparent_temperature ?? 0,
      pressure: current.surface_pressure ?? 0,
      weatherCode: current.weather_code ?? 0,
      aqi:
        typeof airJson.current?.us_aqi === "number"
          ? Math.round(airJson.current.us_aqi)
          : null,
      location: locationLabel,
    } satisfies WeatherSnapshot;
  }, []);

  useEffect(() => {
    let mounted = true;

    if (!("geolocation" in navigator)) {
      setLocationNotice(FALLBACK_NOTICE);
      setCoords(DEFAULT_LOCATION);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        if (!mounted) return;
        setLocationNotice(null);
        setCoords({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      () => {
        if (!mounted) return;
        setLocationNotice(FALLBACK_NOTICE);
        setCoords(DEFAULT_LOCATION);
      },
      {
        enableHighAccuracy: true,
        timeout: 12000,
        maximumAge: 5 * 60 * 1000,
      }
    );

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (!coords) return;

    let cancelled = false;

    const load = async () => {
      try {
        const nextSnapshot = await fetchWeather(coords.latitude, coords.longitude);
        if (cancelled) return;
        setSnapshot(nextSnapshot);
        setError(null);
      } catch {
        if (cancelled) return;
        setError("Could not refresh weather right now.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();
    const intervalId = window.setInterval(load, REFRESH_MS);

    return () => {
      cancelled = true;
      window.clearInterval(intervalId);
    };
  }, [coords, fetchWeather]);

  const status = useMemo(() => aqiStatus(snapshot?.aqi ?? null), [snapshot?.aqi]);

  const temperatureText = snapshot ? `${Math.round(snapshot.temperature)} °C` : "-- °C";
  const locationText = snapshot?.location ?? DEFAULT_LOCATION_LABEL;
  const humidityText = snapshot ? `${Math.round(snapshot.humidity)}%` : "--";
  const windText = snapshot ? `${Math.round(snapshot.windSpeed)} Km/h` : "--";
  const aqiText = snapshot?.aqi !== null && snapshot?.aqi !== undefined ? String(snapshot.aqi) : "--";
  const realFeelText = snapshot ? `${Math.round(snapshot.apparentTemperature)} °C` : "--";
  const pressureText = snapshot ? `${Math.round(snapshot.pressure)} mbar` : "--";
  const weatherIcon = snapshot ? weatherIconByCode(snapshot.weatherCode) : "🌤️";

  return (
    <div className="weather-cardm" aria-live="polite">
      <div className="weather-stack">
        <div className="weather-card2">
          <div className="weather-upper">
            <div className="weather-humidity">
              <span className="weather-upper-icon" aria-hidden="true">💧</span>
              <div className="weather-humiditytext">Humidity<br />{humidityText}</div>
            </div>

            <div className="weather-air">
              <span className="weather-upper-icon" aria-hidden="true">🌬️</span>
              <div className="weather-airtext">Wind<br />{windText}</div>
            </div>
          </div>

          <hr className="weather-divider" />

          <div className="weather-lower">
            <div className="weather-aqi">
              <span className="weather-mini-icon" aria-hidden="true">🌿</span>
              <div>AQI<br />{aqiText}</div>
            </div>

            <div className="weather-realfeel">
              <span className="weather-mini-icon" aria-hidden="true">🌡️</span>
              <div>Real Feel<br />{realFeelText}</div>
            </div>

            <div className="weather-pressure">
              <span className="weather-mini-icon" aria-hidden="true">🧭</span>
              <div>Pressure<br />{pressureText}</div>
            </div>
          </div>

          <div className={`weather-card3 is-${status.tone}`}>{loading ? "Loading…" : status.label}</div>
        </div>

        <div className="weather-card">
          <span className="weather-icon" aria-hidden="true">{weatherIcon}</span>
          <div className="weather-main">{temperatureText}</div>
          <div className="weather-mainsub">{locationText}</div>
        </div>
      </div>

      {error ? (
        <div className="weather-error">{error}</div>
      ) : locationNotice ? (
        <div
          className="weather-error"
          style={{
            background: "rgba(15, 23, 42, 0.82)",
            border: "1px solid rgba(148, 163, 184, 0.35)",
            color: "#e2e8f0",
          }}
        >
          {locationNotice}
        </div>
      ) : null}
    </div>
  );
}
