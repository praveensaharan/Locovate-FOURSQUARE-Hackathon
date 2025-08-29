import React, { useState, useEffect, useRef } from "react";

// Your JSON places
const places = [
  {
    name: "Cafe Restaurant NAKAICHI",
    latitude: 35.6902716242296,
    longitude: 139.83905375003815,
    formatted_address: "大島7-1-12, 江東区, 東京都, 136-0072",
  },
  {
    name: "kn.cafe",
    latitude: 35.689533675893315,
    longitude: 139.83038453842227,
    formatted_address: "江東区, 東京都, JP",
  },
  {
    name: "Red Wood Cafe (レッドウッドカフェ)",
    latitude: 35.688863511644016,
    longitude: 139.81656468970513,
    formatted_address: "住吉2-27-10, 江東区, 東京都, 135-0002",
  },
];

const API_KEY = import.meta.env.VITE_MAPS_KEY;

export default function MapDirections() {
  const [mapLoaded, setMapLoaded] = useState(false);
  const [currentPosition, setCurrentPosition] = useState(null);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [map, setMap] = useState(null);
  const [directionsRenderer, setDirectionsRenderer] = useState(null);
  const [travelTime, setTravelTime] = useState(null);
  const markersRef = useRef([]);

  // Load Google Maps API
  useEffect(() => {
    if (
      !window.google &&
      !document.querySelector(`script[src*="maps.googleapis.com"]`)
    ) {
      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=${API_KEY}&libraries=places`;
      script.async = true;
      script.onload = () => setMapLoaded(true);
      document.body.appendChild(script);
    } else {
      setMapLoaded(true);
    }
  }, []);

  // Get user location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        setCurrentPosition({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      });
    } else {
      alert("Geolocation is not supported by your browser.");
    }
  }, []);

  // Initialize map and markers
  useEffect(() => {
    if (
      mapLoaded &&
      currentPosition &&
      !map &&
      window.google &&
      window.google.maps
    ) {
      const gMap = new window.google.maps.Map(document.getElementById("map"), {
        center: currentPosition,
        zoom: 14,
      });
      setMap(gMap);

      const renderer = new window.google.maps.DirectionsRenderer();
      renderer.setMap(gMap);
      setDirectionsRenderer(renderer);

      // User location marker
      new window.google.maps.Marker({
        map: gMap,
        position: currentPosition,
        title: "Your Location",
        icon: {
          path: window.google.maps.SymbolPath.CIRCLE,
          scale: 8,
          fillColor: "#007bff",
          fillOpacity: 1,
          strokeWeight: 2,
          strokeColor: "#fff",
        },
      });

      // Place markers
      markersRef.current = [];
      places.forEach((place) => {
        const marker = new window.google.maps.Marker({
          map: gMap,
          position: { lat: place.latitude, lng: place.longitude },
          title: place.name,
        });
        marker.addListener("click", () => setSelectedPlace(place));
        markersRef.current.push(marker);
      });
    }
  }, [mapLoaded, currentPosition]);

  // Render directions and travel time
  useEffect(() => {
    if (selectedPlace && directionsRenderer && currentPosition) {
      const directionsService = new window.google.maps.DirectionsService();
      directionsService.route(
        {
          origin: currentPosition,
          destination: {
            lat: selectedPlace.latitude,
            lng: selectedPlace.longitude,
          },
          travelMode: window.google.maps.TravelMode.DRIVING,
        },
        (result, status) => {
          if (status === "OK") {
            directionsRenderer.setDirections(result);
            const leg = result.routes[0].legs[0];
            setTravelTime(`${leg.duration.text} (${leg.distance.text})`);
          } else {
            alert("Could not display directions: " + status);
          }
        }
      );
    }
  }, [selectedPlace, directionsRenderer, currentPosition]);

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      {/* Sidebar */}
      <div
        style={{
          width: "300px",
          overflowY: "auto",
          padding: "10px",
          borderRight: "1px solid #ccc",
        }}
      >
        <h3>Places</h3>
        {places.map((place) => (
          <div
            key={place.name}
            style={{
              padding: "10px",
              cursor: "pointer",
              borderBottom: "1px solid #eee",
            }}
            onClick={() => setSelectedPlace(place)}
          >
            <strong>{place.name}</strong>
            <p>{place.formatted_address}</p>
            {selectedPlace?.name === place.name && travelTime && (
              <p style={{ color: "green" }}>Estimated Time: {travelTime}</p>
            )}
          </div>
        ))}
      </div>
      {/* Map */}
      <div id="map" style={{ flex: 1 }}></div>
    </div>
  );
}
