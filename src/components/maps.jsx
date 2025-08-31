import React, { useState, useEffect, useRef } from "react";

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
  const [walkingInfo, setWalkingInfo] = useState({});
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
      navigator.geolocation.getCurrentPosition(
        (position) =>
          setCurrentPosition({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          }),
        () => alert("Unable to retrieve your location")
      );
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

      // Marker for user location
      new window.google.maps.Marker({
        map: gMap,
        position: currentPosition,
        title: "Me",
        icon: {
          path: window.google.maps.SymbolPath.CIRCLE,
          scale: 10,
          fillColor: "#3b82f6", // Tailwind blue-500
          fillOpacity: 1,
          strokeWeight: 2,
          strokeColor: "#fff",
        },
      });

      // Markers for places
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

  // Render driving directions and travel time on click selection
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

  // Prefetch walking info for hover display
  useEffect(() => {
    if (currentPosition && map && window.google && window.google.maps) {
      const directionsService = new window.google.maps.DirectionsService();
      places.forEach((place) => {
        directionsService.route(
          {
            origin: currentPosition,
            destination: { lat: place.latitude, lng: place.longitude },
            travelMode: window.google.maps.TravelMode.WALKING,
          },
          (result, status) => {
            if (status === "OK") {
              const leg = result.routes[0].legs[0];
              setWalkingInfo((prev) => ({
                ...prev,
                [place.name]: {
                  duration: leg.duration.text,
                  distance: leg.distance.text,
                },
              }));
            }
          }
        );
      });
    }
  }, [currentPosition, map]);

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <aside className="w-80 p-4 border-r border-gray-300 overflow-auto bg-gray-50">

       

        {/* Places cards */}
        {places.map((place) => (
          <div
            key={place.name}
            className={`group relative mb-4 p-3 rounded-lg cursor-pointer shadow-sm ring-1 transition-colors ${
              selectedPlace?.name === place.name
                ? "ring-blue-600 bg-blue-100"
                : "ring-gray-300 bg-white hover:bg-blue-50"
            }`}
            onClick={() => setSelectedPlace(place)}
            tabIndex={0}
            aria-label={`Select place ${place.name}`}
          >
            <h4 className="text-gray-900 font-medium">{place.name}</h4>
            <p className="text-gray-600 text-sm">{place.formatted_address}</p>
            {selectedPlace?.name === place.name && travelTime && (
              <p className="mt-1 font-semibold text-green-600">
                Estimated Drive Time: {travelTime}
              </p>
            )}

            {/* Hover info box */}
            <div className="pointer-events-none absolute left-full top-1/2 z-20 ml-3 w-52 -translate-y-1/2 rounded border border-gray-300 bg-white p-3 shadow-lg opacity-0 transition-opacity group-hover:opacity-100">
              <p className="font-semibold text-sm mb-1">{place.formatted_address}</p>
              {walkingInfo[place.name] ? (
                <p className="text-green-700 text-sm">
                  Walk: {walkingInfo[place.name].duration} ({walkingInfo[place.name].distance})
                </p>
              ) : (
                <p className="text-gray-500 text-sm italic">Loading walk info...</p>
              )}
            </div>
          </div>
        ))}
      </aside>

      {/* Map */}
      <main id="map" className="h-1/2 w-1/2" />
    </div>
  );
}
