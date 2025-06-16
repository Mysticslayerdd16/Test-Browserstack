import React, { useEffect, useState } from 'react';
import { useDebounce } from './hooks/useDebounce';

type WeatherData = {
  temperature: number;
  description: string;
  humidity: number | null;
  windspeed: number;
};

interface InfoBoxProps {
  city: { name: string; lat: number; lon: number } | null;
}

const DEFAULT_CITY = { name: 'Gurugram', lat: 28.4595, lon: 77.0266 };

// Simple in-memory cache
const weatherCache: Record<string, any> = {};

function InfoBox({ city }: InfoBoxProps) {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);

  // Debounce city name
  const debouncedCity = useDebounce(city?.name, 500);

  useEffect(() => {
    if (!city) return;
    const cityKey = debouncedCity || DEFAULT_CITY.name;

    // Check cache first
    if (weatherCache[cityKey]) {
      setWeather(weatherCache[cityKey]);
      setLoading(false);
      return;
    }

    setLoading(true);
    fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${city.lat}&longitude=${city.lon}&current_weather=true`
    )
      .then(res => res.json())
      .then(data => {
        setWeather({
          temperature: data.current_weather.temperature,
          description: `Windspeed ${data.current_weather.windspeed} km/h`,
          humidity: data.current_weather.relativehumidity ?? null,
          windspeed: data.current_weather.windspeed,
        });
        weatherCache[cityKey] = data; // Cache the result
        setLoading(false);
      })
      .catch(() => {
        setWeather(null);
        setLoading(false);
      });
  }, [debouncedCity, city]);

  if (!city) {
    return (
      <div className="flex-1 bg-white bg-opacity-80 p-3 border-r border-gray-300 flex flex-col rounded-xl shadow-md m-1">
        <h2 className="text-lg font-bold mb-2 text-pink-600 flex items-center gap-2">
          <span role="img" aria-label="info">
            ℹ️
          </span>{' '}
          City Weather
        </h2>
        <div style={{ fontSize: '0.95rem' }}>Enter a city to see weather info!</div>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-white bg-opacity-80 p-3 border-r border-gray-300 flex flex-col rounded-xl shadow-md m-1">
      <h2 className="text-lg font-bold mb-2 text-pink-600 flex items-center gap-2">
        <span role="img" aria-label="info">
          ℹ️
        </span>{' '}
        City Weather
      </h2>
      <ul className="space-y-1 text-base">
        <li>
          <b>📍 City:</b> {city.name}
        </li>
        {loading ? (
          <li>Loading weather...</li>
        ) : weather ? (
          <>
            <li>
              <b>🌡️ Temperature:</b> {weather.temperature}°C
            </li>
            <li>
              <b>🌬️ Forecast:</b> {weather.description}
            </li>
            <li>
              <b>💨 Wind Speed:</b> {weather.windspeed} km/h
            </li>
          </>
        ) : (
          <li>Weather data unavailable.</li>
        )}
      </ul>
    </div>
  );
}

export default InfoBox;