// import React, { useState, useEffect, useRef } from "react";
// import { useAppContext } from "../context/AppContext";
// import { Loader2 } from "lucide-react"; // spinner icon

// const API_KEY = import.meta.env.VITE_MAPS_KEY;

// export default function MapComponent({ places, selectedPlace = null }) {
//   const { coords } = useAppContext();
//   const [mapLoaded, setMapLoaded] = useState(false);
//   const [map, setMap] = useState(null);
//   const [directionsRenderer, setDirectionsRenderer] = useState(null);
//   const markersRef = useRef([]);

//   useEffect(() => {
//     if (!window.google && !document.querySelector(`script[src*="maps.googleapis.com"]`)) {
//       const script = document.createElement("script");
//       script.src = `https://maps.googleapis.com/maps/api/js?key=${API_KEY}&libraries=places`;
//       script.async = true;
//       script.onload = () => setMapLoaded(true);
//       document.body.appendChild(script);
//     } else {
//       setMapLoaded(true);
//     }
//   }, []);

//   useEffect(() => {
//     if (mapLoaded && coords.lat != null && coords.lon != null && !map && window.google?.maps) {
//       const center = { lat: coords.lat, lng: coords.lon };

//       const gMap = new window.google.maps.Map(document.getElementById("map"), {
//         center,
//         zoom: 14,
//       });
//       setMap(gMap);

//       const renderer = new window.google.maps.DirectionsRenderer();
//       renderer.setMap(gMap);
//       setDirectionsRenderer(renderer);

//       markersRef.current.forEach((marker) => marker.setMap(null));
//       markersRef.current = [];

//       new window.google.maps.Marker({
//         map: gMap,
//         position: center,
//         title: "You are here",
//         icon: {
//           path: window.google.maps.SymbolPath.CIRCLE,
//           scale: 10,
//           fillColor: "#3b82f6",
//           fillOpacity: 1,
//           strokeWeight: 2,
//           strokeColor: "#fff",
//         },
//       });

//       places.forEach((place) => {
//         const lat = place.latitude || place.geocodes?.main?.latitude;
//         const lng = place.longitude || place.geocodes?.main?.longitude;
//         if (lat && lng) {
//           const marker = new window.google.maps.Marker({
//             map: gMap,
//             position: { lat, lng },
//             title: place.name,
//           });
//           markersRef.current.push(marker);
//         }
//       });
//     }
//   }, [mapLoaded, coords, map, places]);

//   useEffect(() => {
//     if (
//       selectedPlace &&
//       directionsRenderer &&
//       coords.lat != null &&
//       coords.lon != null
//     ) {
//       const lat = selectedPlace.latitude || selectedPlace.geocodes?.main?.latitude;
//       const lng = selectedPlace.longitude || selectedPlace.geocodes?.main?.longitude;

//       if (lat && lng) {
//         const directionsService = new window.google.maps.DirectionsService();
//         directionsService.route(
//           {
//             origin: { lat: coords.lat, lng: coords.lon },
//             destination: { lat, lng },
//             travelMode: window.google.maps.TravelMode.DRIVING,
//           },
//           (result, status) => {
//             if (status === "OK") {
//               directionsRenderer.setDirections(result);
//             }
//           }
//         );
//       }
//     } else if (directionsRenderer) {
//       directionsRenderer.setDirections({ routes: [] });
//     }
//   }, [selectedPlace, directionsRenderer, coords]);

// return (
//   <div className="relative flex justify-center items-center w-full h-[500px]">
//     {!mapLoaded && (
//       <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#0B0B2B]/80 text-white z-10">
//         <Loader2 className="w-8 h-8 animate-spin mb-2 text-[#4A4CFF]" />
//         <p>Loading map...</p>
//       </div>
//     )}

//     {/* Map container at 3/4 width & height */}
//     <div id="map" className="w-3/4 h-3/4 rounded-xl shadow-lg" />
//   </div>
// );

// }



import React, { useState, useEffect, useRef } from "react";
import { useAppContext } from "../context/AppContext";
import { Loader2 } from "lucide-react"; // spinner icon

const API_KEY = import.meta.env.VITE_MAPS_KEY;

export default function MapComponent({ places, selectedPlace = null }) {
  const { coords } = useAppContext();
  const [mapLoaded, setMapLoaded] = useState(false);
  const [map, setMap] = useState(null);
  const [directionsRenderer, setDirectionsRenderer] = useState(null);
  const [routeInfo, setRouteInfo] = useState(null); 
  const markersRef = useRef([]);

  useEffect(() => {
    if (!window.google && !document.querySelector(`script[src*="maps.googleapis.com"]`)) {
      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=${API_KEY}&libraries=places`;
      script.async = true;
      script.onload = () => setMapLoaded(true);
      document.body.appendChild(script);
    } else {
      setMapLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (mapLoaded && coords.lat != null && coords.lon != null && !map && window.google?.maps) {
      const center = { lat: coords.lat, lng: coords.lon };

      const gMap = new window.google.maps.Map(document.getElementById("map"), {
        center,
        zoom: 14,
      });
      setMap(gMap);

      const renderer = new window.google.maps.DirectionsRenderer();
      renderer.setMap(gMap);
      setDirectionsRenderer(renderer);

      markersRef.current.forEach((marker) => marker.setMap(null));
      markersRef.current = [];

      new window.google.maps.Marker({
        map: gMap,
        position: center,
        title: "You are here",
        icon: {
          path: window.google.maps.SymbolPath.CIRCLE,
          scale: 10,
          fillColor: "#3b82f6",
          fillOpacity: 1,
          strokeWeight: 2,
          strokeColor: "#fff",
        },
      });

      // show places only if no destination selected
      if (!selectedPlace) {
        places.forEach((place) => {
          const lat = place.latitude || place.geocodes?.main?.latitude;
          const lng = place.longitude || place.geocodes?.main?.longitude;
          if (lat && lng) {
            const marker = new window.google.maps.Marker({
              map: gMap,
              position: { lat, lng },
              title: place.name,
            });
            markersRef.current.push(marker);
          }
        });
      }
    }
  }, [mapLoaded, coords, map, places, selectedPlace]);

  useEffect(() => {
    if (
      selectedPlace &&
      directionsRenderer &&
      coords.lat != null &&
      coords.lon != null
    ) {
      const lat = selectedPlace.latitude || selectedPlace.geocodes?.main?.latitude;
      const lng = selectedPlace.longitude || selectedPlace.geocodes?.main?.longitude;

      if (lat && lng) {
        const directionsService = new window.google.maps.DirectionsService();
        directionsService.route(
          {
            origin: { lat: coords.lat, lng: coords.lon },
            destination: { lat, lng },
            travelMode: window.google.maps.TravelMode.DRIVING,
          },
          (result, status) => {
            if (status === "OK") {
              directionsRenderer.setDirections(result);

              // extract time + distance
              const leg = result.routes[0].legs[0];
              setRouteInfo({
                name: selectedPlace.name,
                distance: leg.distance.text,
                duration: leg.duration.text,
              });

              // add destination marker
              new window.google.maps.Marker({
                map: map,
                position: { lat, lng },
                title: selectedPlace.name,
                icon: {
                  url: "http://maps.google.com/mapfiles/ms/icons/red-dot.png",
                },
              });
            }
          }
        );
      }
    } else if (directionsRenderer) {
      directionsRenderer.setDirections({ routes: [] });
      setRouteInfo(null); // clear info
    }
  }, [selectedPlace, directionsRenderer, coords, map]);

  return (
    <div className="relative flex justify-center items-center w-full h-[500px]">
      {!mapLoaded && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#0B0B2B]/80 text-white z-10">
          <Loader2 className="w-8 h-8 animate-spin mb-2 text-[#4A4CFF]" />
          <p>Loading map...</p>
        </div>
      )}

      {/* Map container at 3/4 width & height */}
      <div id="map" className="w-3/4 h-3/4 rounded-xl shadow-lg" />

      {/* Route info overlay */}
      {routeInfo && (
        <div className="absolute top-4 right-4 bg-[#0F0F35]/90 text-white p-3 rounded-lg shadow-lg text-sm">
          <p className="font-bold">{routeInfo.name}</p>
          <p>{routeInfo.distance} • {routeInfo.duration}</p>
        </div>
      )}
    </div>
  );
}

