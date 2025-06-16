import React from 'react';
import InfoBox from './InfoBox';
import MapBox from './MapBox';
import ChatBox from './ChatBox';

const App: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="w-full bg-blue-600 text-white p-4 text-2xl font-bold">
        My Responsive App
      </header>
      {/* Main Area */}
      <main className="flex-1 flex flex-row w-full">
        <div className="flex flex-1">
          <InfoBox />
          <MapBox />
          <ChatBox />
        </div>
      </main>
    </div>
  );
};

export default App;