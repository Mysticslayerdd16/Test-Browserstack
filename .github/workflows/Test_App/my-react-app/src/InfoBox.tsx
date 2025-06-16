import React, { useEffect, useState } from 'react';

type WeatherData = {
  temperature: number;
  description: string;
  humidity: number | null;
  windspeed: number;
};

interface InfoBoxProps {
  city: { name: string; lat: number; lon: number } | null;
}

function InfoBox({ city }: InfoBoxProps) {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!city) return;
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
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [city]);

  if (!city) {
    return (
      <div className="flex-1 bg-gray-100 p-4 border-r border-gray-300 flex flex-col">
        <h2 className="text-xl font-semibold mb-2">Info Box</h2>
        <div>Enter a city to see info.</div>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-gray-100 p-4 border-r border-gray-300 flex flex-col">
      <h2 className="text-xl font-semibold mb-2">Info Box</h2>
      <ul>
        <li>
          <b>City:</b> {city.name}
        </li>
        {loading ? (
          <li>Loading weather...</li>
        ) : weather ? (
          <>
            <li>
              <b>Temperature:</b> {weather.temperature}°C
            </li>
            <li>
              <b>Forecast:</b> {weather.description}
            </li>
            <li>
              <b>Wind Speed:</b> {weather.windspeed} km/h
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