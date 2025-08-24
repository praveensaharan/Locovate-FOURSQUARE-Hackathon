import React, { useEffect, useRef, useState } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";

export default function LocationMap() {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const apiKey = import.meta.env.VITE_OLA_KEY;

  useEffect(() => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser.");
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;

        // Create the map centered on user's location
        mapRef.current = new maplibregl.Map({
          container: mapContainerRef.current,
          center: [lng, lat],
          zoom: 14,
          style:
            "https://api.olamaps.io/tiles/vector/v1/styles/default-light-standard/style.json",
          transformRequest: (url, resourceType) => {
            if (!url.includes("?")) {
              url += `?api_key=${apiKey}`;
            } else {
              url += `&api_key=${apiKey}`;
            }
            return { url, resourceType };
          },
        });

        // Add marker at user's location
        new maplibregl.Marker({ color: "#00FF00" })
          .setLngLat([lng, lat])
          .setPopup(new maplibregl.Popup().setText(`You are here`))
          .addTo(mapRef.current);

        setLoading(false);
      },
      (err) => {
        setError(err.message);
        setLoading(false);
      }
    );

    return () => {
      if (mapRef.current) mapRef.current.remove();
    };
  }, []);

  return (
    <div className="relative w-[90%] h-[80vh] m-auto mt-8 border rounded-lg overflow-hidden">
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-70 z-10">
          <span className="text-blue-500 font-bold">Loading map...</span>
        </div>
      )}
      {error && <p className="absolute top-2 left-2 text-red-500">{error}</p>}
      <div ref={mapContainerRef} className="h-full w-full" />
    </div>
  );
}
