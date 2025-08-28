// MapWithWalkingDirections.jsx
import React, { useState, useEffect } from "react";
import GoogleMapReact from "google-map-react";

const API_KEY = import.meta.env.VITE_MAPS_KEY;

// Simple marker component
const Marker = ({ text }) => (
  <div
    style={{
      color: "white",
      background: "red",
      padding: "5px 10px",
      borderRadius: "50%",
      textAlign: "center",
    }}
  >
    {text}
  </div>
);

// List of places
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

const MapWithWalkingDirections = () => {
  const [currentLocation, setCurrentLocation] = useState({
    lat: 35.6895,
    lng: 139.6917,
  });
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [route, setRoute] = useState(null);
  const [duration, setDuration] = useState(null);

  // Get user location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (err) => console.error("Error getting location:", err)
      );
    }
  }, []);

  // Fetch walking directions from Google Maps Directions API
  useEffect(() => {
    if (selectedPlace) {
      const directionsUrl = `https://maps.googleapis.com/maps/api/directions/json?origin=${currentLocation.lat},${currentLocation.lng}&destination=${selectedPlace.latitude},${selectedPlace.longitude}&mode=walking&key=${API_KEY}`;

      // Use fetch with CORS proxy because Google Directions API doesn't allow direct client-side requests
      fetch(
        `https://api.allorigins.win/get?url=${encodeURIComponent(
          directionsUrl
        )}`
      )
        .then((res) => res.json())
        .then((data) => {
          const json = JSON.parse(data.contents);
          if (json.routes.length > 0) {
            const points = json.routes[0].overview_polyline.points;
            const path = decodePolyline(points);
            setRoute(path);
            setDuration(json.routes[0].legs[0].duration.text);
          }
        });
    }
  }, [selectedPlace, currentLocation]);

  // Decode polyline function
  const decodePolyline = (t, e) => {
    let points = [];
    let index = 0,
      lat = 0,
      lng = 0;

    while (index < t.length) {
      let b,
        shift = 0,
        result = 0;
      do {
        b = t.charCodeAt(index++) - 63;
        result |= (b & 0x1f) << shift;
        shift += 5;
      } while (b >= 0x20);
      const dlat = result & 1 ? ~(result >> 1) : result >> 1;
      lat += dlat;

      shift = 0;
      result = 0;
      do {
        b = t.charCodeAt(index++) - 63;
        result |= (b & 0x1f) << shift;
        shift += 5;
      } while (b >= 0x20);
      const dlng = result & 1 ? ~(result >> 1) : result >> 1;
      lng += dlng;

      points.push({ lat: lat / 1e5, lng: lng / 1e5 });
    }
    return points;
  };

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      {/* Sidebar */}
      <div
        style={{
          width: "300px",
          padding: "10px",
          overflowY: "auto",
          borderRight: "1px solid #ccc",
        }}
      >
        <h2>Places</h2>
        {places.map((place, idx) => (
          <div
            className="bg-black text-white"
            key={idx}
            style={{
              marginBottom: "10px",
              padding: "10px",
              border: "1px solid #ddd",
              borderRadius: "5px",
              cursor: "pointer",
              backgroundColor:
                selectedPlace?.name === place.name ? "#f0f0f0" : "white",
            }}
            onClick={() => setSelectedPlace(place)}
          >
            <strong>{place.name}</strong>
            <br />
            <small>{place.formatted_address}</small>
          </div>
        ))}
        {duration && <p>Estimated walking time: {duration}</p>}
      </div>

      {/* Map */}
      <div style={{ flex: 1 }}>
        <GoogleMapReact
          bootstrapURLKeys={{ key: API_KEY }}
          center={currentLocation}
          zoom={14}
          yesIWantToUseGoogleMapApiInternals
        >
          <Marker
            lat={currentLocation.lat}
            lng={currentLocation.lng}
            text="You"
          />
          {places.map((place, idx) => (
            <Marker
              key={idx}
              lat={place.latitude}
              lng={place.longitude}
              text="📍"
            />
          ))}
          {route &&
            route.map((point, idx) => (
              <div
                key={idx}
                lat={point.lat}
                lng={point.lng}
                style={{
                  width: "5px",
                  height: "5px",
                  backgroundColor: "blue",
                  borderRadius: "50%",
                }}
              />
            ))}
        </GoogleMapReact>
      </div>
    </div>
  );
};

export default MapWithWalkingDirections;
