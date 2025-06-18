// Intro to app: This is a simple React application that allows users to explore cities by fetching their coordinates and displaying relevant information, maps, and images. It includes a chat interface for user interaction.

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

  console.log("VITE_API_URL:", import.meta.env.VITE_API_URL);

  return (
    <div className="flex flex-col min-h-screen bg-hero-gradient font-sans">
      <header className="w-full bg-gradient-to-r from-navy via-gradient-mid to-gradient-light text-mint p-4 text-2xl font-extrabold shadow-lg tracking-wider flex items-center justify-center gap-4" style={{ fontSize: '1.5rem' }}>
        City Explorer Playground
      </header>
      <main className="flex-1 flex flex-col w-full gap-2 p-2 text-black" style={{ fontSize: '0.95rem' }}>
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
      <footer className="w-full text-center py-1 text-black bg-navy bg-opacity-80 text-xs font-sans">
        Made with <span role="img" aria-label="sparkles">✨</span> for curious explorers!
      </footer>
    </div>
  );
}

export default App;