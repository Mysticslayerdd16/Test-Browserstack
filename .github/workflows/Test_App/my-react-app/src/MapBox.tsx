import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const DEFAULT_POSITION = { lat: 28.4595, lng: 77.0266 };

type MapBoxProps = {
  latitude?: number | null;
  longitude?: number | null;
};

const RecenterMap = ({ lat, lng }: { lat: number; lng: number }) => {
  const map = useMap();
  useEffect(() => {
    map.setView([lat, lng]);
  }, [lat, lng, map]);
  return null;
};

const MapBox: React.FC<MapBoxProps> = ({ latitude, longitude }) => {
  const center =
    latitude != null && longitude != null
      ? { lat: latitude, lng: longitude }
      : DEFAULT_POSITION;

  return (
    <div className="flex-1 bg-gray-200 p-4 border-r border-gray-300 flex flex-col">
      <h2 className="text-xl font-semibold mb-2">Interactive Map</h2>
      <MapContainer
        center={center}
        zoom={13}
        style={{ height: '100%', minHeight: 400, width: '100%' }}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={center} />
        <RecenterMap lat={center.lat} lng={center.lng} />
      </MapContainer>
    </div>
  );
};

export default MapBox;