import React from 'react';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

// Default coordinates for Gurgaon, Haryana, India
const DEFAULT_POSITION = { lat: 28.4595, lng: 77.0266 };

type MapBoxProps = {
  latitude?: number;
  longitude?: number;
};

const MapBox: React.FC<MapBoxProps> = ({ latitude, longitude }) => {
  const center = latitude && longitude
    ? { lat: latitude, lng: longitude }
    : DEFAULT_POSITION;

  return (
    <div className="flex-1 bg-gray-200 p-4 border-r border-gray-300">
      <h2 className="text-xl font-semibold mb-2">Interactive Map</h2>
      <MapContainer
        center={center}
        zoom={13}
        style={{ height: '400px', width: '100%' }}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={center} />
      </MapContainer>
    </div>
  );
};

export default MapBox;