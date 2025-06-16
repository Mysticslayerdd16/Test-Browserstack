import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

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
    <div className="flex-1 bg-white bg-opacity-80 p-3 border-r border-gray-300 flex flex-col rounded-xl shadow-md m-1">
      <h2 className="text-lg font-bold mb-2 text-blue-600 flex items-center gap-2">
        <span role="img" aria-label="map">🗺️</span> City Adventure Map
      </h2>
      <MapContainer
        center={center}
        zoom={13}
        style={{ height: '260px', width: '100%', borderRadius: '0.75rem' }}
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

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: '/marker-icon-2x.png',
  iconUrl: '/marker-icon.png',
  shadowUrl: '/marker-shadow.png',
});

console.log('markerIcon', markerIcon);

export default MapBox;