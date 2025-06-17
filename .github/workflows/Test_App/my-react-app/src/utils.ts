export async function getCityCoordinates(city: string) {
  const url = `/api/geocode?city=${encodeURIComponent(city)}`;
  const res = await fetch(url);
  const data = await res.json();
  if (data && data.length > 0) {
    return {
      name: data[0].display_name,
      lat: parseFloat(data[0].lat),
      lon: parseFloat(data[0].lon),
    };
  }
  throw new Error('City not found');
}