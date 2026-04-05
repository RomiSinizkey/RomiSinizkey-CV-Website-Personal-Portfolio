import { useCallback, useEffect, useState } from "react";
import "../styles/weatherCard.css";

type Coordinates = { latitude: number; longitude: number };

type WeatherSnapshot = {
  temperature: number;
  minTemperature: number;
  maxTemperature: number;
  weatherCode: number;
  weatherLabel: string;
  location: string;
};

type ForecastResponse = {
  current?: {
    temperature_2m?: number;
    weather_code?: number;
  };
  daily?: {
    temperature_2m_max?: number[];
    temperature_2m_min?: number[];
  };
};

const REFRESH_MS = 1000 * 60 * 10;
const DEFAULT_LOCATION: Coordinates = {
  latitude: 32.0853,
  longitude: 34.7818,
};
const DEFAULT_LOCATION_LABEL = "Tel Aviv, Israel";

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

function weatherLabelByCode(code: number): string {
  if (code === 0) return "Clear sky";
  if ([1, 2, 3].includes(code)) return "Partly cloudy";
  if ([45, 48].includes(code)) return "Foggy";
  if ([51, 53, 55, 56, 57].includes(code)) return "Drizzle";
  if ([61, 63, 65, 66, 67, 80, 81, 82].includes(code)) return "Rainy";
  if ([71, 73, 75, 77, 85, 86].includes(code)) return "Snow";
  if ([95, 96, 99].includes(code)) return "Thunderstorm";
  return "Mild";
}

export default function WeatherCard() {
  const [coords, setCoords] = useState<Coordinates | null>(null);
  const [snapshot, setSnapshot] = useState<WeatherSnapshot | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [usingCurrentLocation, setUsingCurrentLocation] = useState(false);
  const [loading, setLoading] = useState(true);
  const [hidden, setHidden] = useState(false);

  const resolveLocationLabel = useCallback(async (latitude: number, longitude: number) => {
    try {
      const geoUrl = `https://geocode.maps.co/reverse?lat=${latitude}&lon=${longitude}`;
      const geoRes = await fetch(geoUrl);
      if (!geoRes.ok) return null;
      const geoJson = (await geoRes.json()) as {
        address?: {
          city?: string;
          town?: string;
          village?: string;
          county?: string;
          state?: string;
          country?: string;
        };
      };
      const city =
        geoJson.address?.city ??
        geoJson.address?.town ??
        geoJson.address?.village ??
        geoJson.address?.county;
      const country = geoJson.address?.country ?? geoJson.address?.state;
      if (city && country) return `${city}, ${country}`;
      if (city) return city;
      if (country) return country;
      return null;
    } catch {
      return null;
    }
  }, []);

  const fetchWeather = useCallback(
    async (latitude: number, longitude: number, preferCurrentLocationLabel: boolean) => {
      const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,wind_speed_10m,surface_pressure,weather_code&daily=temperature_2m_max,temperature_2m_min&forecast_days=1&timezone=auto`;
      const forecastRes = await fetch(weatherUrl);

      if (!forecastRes.ok) {
        throw new Error("Failed to fetch weather data");
      }

      const forecastJson = (await forecastRes.json()) as ForecastResponse;

      const current = forecastJson.current;
      if (!current) {
        throw new Error("Missing current weather");
      }

      const daily = forecastJson.daily;
      const weatherCode = current.weather_code ?? 0;
      const locationLabel = preferCurrentLocationLabel
        ? (await resolveLocationLabel(latitude, longitude)) ?? DEFAULT_LOCATION_LABEL
        : DEFAULT_LOCATION_LABEL;

      return {
        temperature: current.temperature_2m ?? 0,
        minTemperature: daily?.temperature_2m_min?.[0] ?? current.temperature_2m ?? 0,
        maxTemperature: daily?.temperature_2m_max?.[0] ?? current.temperature_2m ?? 0,
        weatherCode,
        weatherLabel: weatherLabelByCode(weatherCode),
        location: locationLabel,
      } satisfies WeatherSnapshot;
    },
    [resolveLocationLabel]
  );

  const setDefaultLocation = useCallback(() => {
    setUsingCurrentLocation(false);
    setCoords(DEFAULT_LOCATION);
  }, []);

  const requestCurrentLocation = useCallback(() => {
    if (!("geolocation" in navigator)) {
      setDefaultLocation();
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUsingCurrentLocation(true);
        setCoords({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      () => {
        setDefaultLocation();
      },
      {
        enableHighAccuracy: true,
        timeout: 12000,
        maximumAge: 5 * 60 * 1000,
      }
    );
  }, [setDefaultLocation]);

  useEffect(() => {
    requestCurrentLocation();
  }, [requestCurrentLocation]);

  useEffect(() => {
    if (!coords) return;

    let cancelled = false;
    setLoading(true);

    const load = async () => {
      try {
        const nextSnapshot = await fetchWeather(coords.latitude, coords.longitude, usingCurrentLocation);
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
  }, [coords, fetchWeather, usingCurrentLocation]);

  const temperatureText = snapshot ? `${Math.round(snapshot.temperature)}°` : "--°";
  const locationText = snapshot?.location ?? DEFAULT_LOCATION_LABEL;
  const weatherText = snapshot?.weatherLabel ?? "Partly cloudy";
  const minTempText = snapshot ? `${Math.round(snapshot.minTemperature)}°` : "--°";
  const maxTempText = snapshot ? `${Math.round(snapshot.maxTemperature)}°` : "--°";
  const weatherIcon = snapshot ? weatherIconByCode(snapshot.weatherCode) : "🌤️";

  if (hidden) {
    return (
      <div className="weather-cardm weather-cardm--hidden" aria-live="polite">
        <button
          type="button"
          className="weather-restore-btn"
          onClick={() => setHidden(false)}
          aria-label="Show weather"
        >
          <span className="weather-restore-text">Weather</span>
          <span className="weather-restore-blob" />
          <span className="weather-restore-blob" />
          <span className="weather-restore-blob" />
          <span className="weather-restore-blob" />
        </button>
      </div>
    );
  }

  return (
    <div className="weather-cardm" aria-live="polite">
      <div className="cardContainer">
        <div className="card">
          <button
            type="button"
            className="weather-visibility-btn"
            onClick={() => setHidden(true)}
            aria-label="Hide weather"
          >
            HIDE
          </button>

          <p className="city">{locationText.toUpperCase()}</p>
          <p className="weather">{loading ? "LOADING..." : weatherText.toUpperCase()}</p>
          <div className="weather-icon-wrap" aria-hidden="true">
            {weatherIcon}
          </div>
          <p className="temp">{temperatureText}</p>

          <div className="minmaxContainer">
            <div className="min">
              <p className="minHeading">Min</p>
              <p className="minTemp">{minTempText}</p>
            </div>
            <div className="max">
              <p className="maxHeading">Max</p>
              <p className="maxTemp">{maxTempText}</p>
            </div>
          </div>
        </div>
      </div>

      {error ? <div className="weather-error">{error}</div> : null}
    </div>
  );
}
