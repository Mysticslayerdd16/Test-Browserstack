export async function getCityCoordinates(city: string) {
  const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(city)}`;
  const res = await fetch(url, {
    headers: {
      'Accept-Language': 'en',
      'User-Agent': 'Test-Browserstack/1.0 (test@example.com)', // Replace with your info
    },
  });
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