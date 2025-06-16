import React, { useEffect, useState } from "react";
import { useDebounce } from "./hooks/useDebounce";

type Props = {
  city: string;
  count?: number;
};

const DEFAULT_CITY = "Gurugram";
const PLACEHOLDER_IMG = "https://placehold.co/200x125?text=No+Image";

// Simple in-memory cache
const imageCache: Record<string, string[]> = {};

const CityImagesBox: React.FC<Props> = ({ city, count = 4 }) => {
  const [photos, setPhotos] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  // Debounce the city name to avoid rapid API calls
  const debouncedCity = useDebounce(city, 500);

  useEffect(() => {
    const cityToShow = debouncedCity?.split(",")[0].trim() || DEFAULT_CITY;

    // Check cache first
    if (imageCache[cityToShow]) {
      setPhotos(imageCache[cityToShow]);
      setLoading(false);
      return;
    }

    setLoading(true);
    fetch(
      `https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrsearch=${encodeURIComponent(
        cityToShow
      )}&gsrlimit=${count}&gsrnamespace=6&prop=imageinfo&iiprop=url&format=json&origin=*`
    )
      .then((res) => res.json())
      .then((data) => {
        const pages = data.query?.pages || {};
        const urls = Object.values(pages)
          .map((p: any) => p.imageinfo?.[0]?.url)
          .filter(Boolean);
        setPhotos(urls);
        imageCache[cityToShow] = urls; // Cache the result
        setLoading(false);
      })
      .catch(() => {
        setPhotos([]);
        setLoading(false);
      });
  }, [debouncedCity, count]);

  if (loading) {
    return (
      <div style={{ marginTop: 16, textAlign: "center" }}>
        <span
          style={{
            fontSize: 24,
            display: "inline-block",
            marginBottom: 8,
          }}
        >
          ⏳
        </span>
        <div>Loading images...</div>
      </div>
    );
  }

  if (!photos.length) {
    return (
      <div style={{ marginTop: 16, textAlign: "center" }}>
        <img src={PLACEHOLDER_IMG} alt="No images found" />
        <div>
          No images found for "{debouncedCity?.split(",")[0].trim() || DEFAULT_CITY}"
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        display: "flex",
        gap: "1rem",
        marginTop: 16,
        flexWrap: "wrap",
        justifyContent: "center",
      }}
    >
      {photos.map((url, i) => (
        <img
          key={i}
          src={url}
          alt={`View of ${debouncedCity} #${i + 1}`}
          loading="lazy" // <-- Optimize image loading
          style={{
            borderRadius: 8,
            width: 200,
            height: 125,
            objectFit: "cover",
            border: "1px solid #eee",
            background: "#f3f3f3",
          }}
        />
      ))}
    </div>
  );
};

export default CityImagesBox;