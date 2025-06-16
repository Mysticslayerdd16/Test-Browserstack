import React, { useState } from 'react';
import ChatBox from './ChatBox';
import InfoBox from './InfoBox';
import MapBox from './MapBox';
import { getCityCoordinates } from './utils';

const INITIAL_CITY = {
  name: 'Gurugram',
  lat: 28.4595,
  lon: 77.0266,
};

function App() {
  const [city, setCity] = useState(INITIAL_CITY);

  const handleCityChange = async (cityName: string) => {
    if (!cityName || cityName.trim().toLowerCase() === 'hello') return; // Do nothing if no city
    try {
      const cityData = await getCityCoordinates(cityName);
      setCity(cityData);
    } catch (e) {
      // Do nothing if city not found
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <header className="w-full bg-blue-600 text-white p-4 text-2xl font-bold">
        My Responsive App
      </header>
      <main className="flex-1 flex flex-row w-full">
        <div className="flex-1"><InfoBox city={city} /></div>
        <div className="flex-1"><MapBox latitude={city.lat} longitude={city.lon} /></div>
        <div className="flex-1"><ChatBox onCityChange={handleCityChange} /></div>
      </main>
    </div>
  );
}

export default App;