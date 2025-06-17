import React, { useState } from 'react';
import ChatBox from './ChatBox';
import InfoBox from './InfoBox';
import MapBox from './MapBox';
import { getCityCoordinates } from './utils';
import CityImagesBox from './CityImagesBox';


const INITIAL_CITY = {
  name: 'Gurugram',
  lat: 28.4595,
  lon: 77.0266,
};

function App() {
  const [city, setCity] = useState(INITIAL_CITY);

  const handleCityChange = async (cityName: string) => {
    if (!cityName || cityName.trim().toLowerCase() === 'hello') return;
    try {
      const cityData = await getCityCoordinates(cityName);
      setCity(cityData);
    } catch (e) {
      // Do nothing if city not found
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-yellow-100 via-pink-100 to-blue-100">
      <header className="w-full bg-gradient-to-r from-pink-500 via-yellow-400 to-blue-500 text-white p-4 text-2xl font-extrabold shadow-lg tracking-wider flex items-center justify-center gap-4" style={{ fontSize: '1.5rem' }}>
        <span role="img" aria-label="globe">🌏</span>
        City Explorer Playground
        <span role="img" aria-label="party">🎉</span>
      </header>
      <main className="flex-1 flex flex-col w-full gap-2 p-2" style={{ fontSize: '0.95rem' }}>
        <div className="flex flex-col md:flex-row w-full gap-2">
          <div className="flex-1 flex flex-col min-w-0">
            <InfoBox city={city} />
          </div>
          <div className="flex-1 flex flex-col min-w-0">
            <MapBox latitude={city.lat} longitude={city.lon} />
          </div>
          <div className="flex-1 flex flex-col min-w-0">
            <ChatBox onCityChange={handleCityChange} />
          </div>
        </div>
        {/* --- City images section --- */}
        <div className="w-full mt-4 flex flex-col items-center">
          <CityImagesBox city={city.name} count={4} />
        </div>
      </main>
      <footer className="w-full text-center py-1 text-gray-500 bg-white bg-opacity-80 text-xs">
        Made with <span role="img" aria-label="sparkles">✨</span> for curious explorers!
      </footer>
    </div>
  );
}

export default App;