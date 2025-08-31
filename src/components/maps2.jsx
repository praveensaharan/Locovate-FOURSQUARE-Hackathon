// import React, { useState, useEffect, useRef } from "react";


// import rawPlaces from "../filejsons/helo.json";

// const places = rawPlaces.map((p) => ({
//   name: p.name,
//   latitude: p.latitude,
//   longitude: p.longitude,
//   formatted_address:
//     p.location?.formatted_address ||
//     `${p.location?.locality || ""}, ${p.location?.region || ""}, ${p.location?.country || ""}`,
//   tel: p.tel || null,
//   website: p.website || null,
//   distance: p.distance || null,
//   categories: p.categories?.map((c) => c.short_name).join(", "),
// }));

// const API_KEY = import.meta.env.VITE_MAPS_KEY;

// export default function MapDirections() {
//   const [mapLoaded, setMapLoaded] = useState(false);
//   const [currentPosition, setCurrentPosition] = useState(null);
//   const [selectedPlace, setSelectedPlace] = useState(null);
//   const [map, setMap] = useState(null);
//   const [directionsRenderer, setDirectionsRenderer] = useState(null);
//   const [travelTime, setTravelTime] = useState(null);
//   const [walkingInfo, setWalkingInfo] = useState({});
//   const markersRef = useRef([]);

//   // Load Google Maps API
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

//   // Get user location
//   useEffect(() => {
//     if (navigator.geolocation) {
//       navigator.geolocation.getCurrentPosition(
//         (pos) => setCurrentPosition({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
//         () => alert("Unable to retrieve your location")
//       );
//     } else {
//       alert("Geolocation is not supported by your browser.");
//     }
//   }, []);

//   // Initialize map and markers
//   useEffect(() => {
//     if (mapLoaded && currentPosition && !map && window.google?.maps) {
//       const gMap = new window.google.maps.Map(document.getElementById("map"), {
//         center: currentPosition,
//         zoom: 14,
//       });
//       setMap(gMap);

//       const renderer = new window.google.maps.DirectionsRenderer();
//       renderer.setMap(gMap);
//       setDirectionsRenderer(renderer);

//       // User marker
//       new window.google.maps.Marker({
//         map: gMap,
//         position: currentPosition,
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

//       // Place markers
//       markersRef.current = [];
//       places.forEach((place) => {
//         const marker = new window.google.maps.Marker({
//           map: gMap,
//           position: { lat: place.latitude, lng: place.longitude },
//           title: place.name,
//         });
//         marker.addListener("click", () => setSelectedPlace(place));
//         markersRef.current.push(marker);
//       });
//     }
//   }, [mapLoaded, currentPosition]);

//   // Show driving directions when selecting a place
//   useEffect(() => {
//     if (selectedPlace && directionsRenderer && currentPosition) {
//       const directionsService = new window.google.maps.DirectionsService();
//       directionsService.route(
//         {
//           origin: currentPosition,
//           destination: { lat: selectedPlace.latitude, lng: selectedPlace.longitude },
//           travelMode: window.google.maps.TravelMode.DRIVING,
//         },
//         (result, status) => {
//           if (status === "OK") {
//             directionsRenderer.setDirections(result);
//             const leg = result.routes[0].legs[0];
//             setTravelTime(`${leg.duration.text} (${leg.distance.text})`);
//           }
//         }
//       );
//     }
//   }, [selectedPlace, directionsRenderer, currentPosition]);

//   // Preload walking info
//   useEffect(() => {
//     if (currentPosition && map && window.google?.maps) {
//       const directionsService = new window.google.maps.DirectionsService();
//       places.forEach((place) => {
//         directionsService.route(
//           {
//             origin: currentPosition,
//             destination: { lat: place.latitude, lng: place.longitude },
//             travelMode: window.google.maps.TravelMode.WALKING,
//           },
//           (result, status) => {
//             if (status === "OK") {
//               const leg = result.routes[0].legs[0];
//               setWalkingInfo((prev) => ({
//                 ...prev,
//                 [place.name]: { duration: leg.duration.text, distance: leg.distance.text },
//               }));
//             }
//           }
//         );
//       });
//     }
//   }, [currentPosition, map]);

//   return (
//     <div className="flex h-screen">
//       {/* Sidebar */}
//       <aside className="w-80 p-4 border-r border-gray-300 overflow-auto bg-gray-50">
//         <h2 className="text-lg font-bold mb-4">Nearby Cafés</h2>
//         {places.map((place) => (
//           <div
//             key={place.name}
//             className={`group relative mb-4 p-3 rounded-lg cursor-pointer shadow-sm ring-1 transition-colors ${
//               selectedPlace?.name === place.name
//                 ? "ring-blue-600 bg-blue-100"
//                 : "ring-gray-300 bg-white hover:bg-blue-50"
//             }`}
//             onClick={() => setSelectedPlace(place)}
//           >
//             <h4 className="text-gray-900 font-medium">{place.name}</h4>
//             <p className="text-gray-600 text-sm">{place.formatted_address}</p>
//             {place.categories && (
//               <p className="text-xs text-gray-500">{place.categories}</p>
//             )}
//             {place.distance && (
//               <p className="text-xs text-gray-500">{(place.distance / 1000).toFixed(2)} km</p>
//             )}

//               {place.website && (
//               <p className="text-xs text-gray-500">{place.website}</p>
//             )}
          

//             {selectedPlace?.name === place.name && travelTime && (
//               <p className="mt-1 font-semibold text-green-600">
//                 🚗 {travelTime}
//               </p>
//             )}
//             <div className="pointer-events-none absolute left-full top-1/2 z-20 ml-3 w-52 -translate-y-1/2 rounded border border-gray-300 bg-white p-3 shadow-lg opacity-0 transition-opacity group-hover:opacity-100">
//               {walkingInfo[place.name] ? (
//                 <p className="text-green-700 text-sm">
//                   🚶 {walkingInfo[place.name].duration} ({walkingInfo[place.name].distance})
//                 </p>
//               ) : (
//                 <p className="text-gray-500 text-sm italic">Loading walk info…</p>
//               )}
//               {place.tel && <p className="mt-1 text-xs">📞 {place.tel}</p>}
//               {place.website && (
//                 <a
//                   href={place.website}
//                   target="_blank"
//                   rel="noreferrer"
//                   className="text-xs text-blue-600 underline"
//                 >
//                   Website
//                 </a>
//               )}
//             </div>
//           </div>
//         ))}
//       </aside>

//       {/* Map */}
//       <main id="map" className="flex-1" />
//     </div>
//   );
// }


// import React, { useState, useEffect, useRef } from "react";
// import { useAppContext } from "../context/AppContext";

// const API_KEY = import.meta.env.VITE_MAPS_KEY;

// export default function MapComponent({ places, selectedPlace = null }) {
//   const { weather, loading, coords } = useAppContext();
//   const [mapLoaded, setMapLoaded] = useState(false);
//   const [currentPosition, setCurrentPosition] = useState(null);
//   const [map, setMap] = useState(null);
//   const [directionsRenderer, setDirectionsRenderer] = useState(null);
//   const markersRef = useRef([]);

//   // Load Google Maps API
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

//   // Get user location
//   useEffect(() => {
//     if (navigator.geolocation) {
//       navigator.geolocation.getCurrentPosition(
//         (pos) => setCurrentPosition({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
//         () => alert("Unable to retrieve your location")
//       );
//     } else {
//       alert("Geolocation is not supported by your browser.");
//     }
//   }, []);

//   // Initialize map and markers
//   useEffect(() => {
//     if (mapLoaded && currentPosition && !map && window.google?.maps) {
//       const gMap = new window.google.maps.Map(document.getElementById("map"), {
//         center: currentPosition,
//         zoom: 14,
//       });
//       setMap(gMap);

//       const renderer = new window.google.maps.DirectionsRenderer();
//       renderer.setMap(gMap);
//       setDirectionsRenderer(renderer);

//       // User marker
//       new window.google.maps.Marker({
//         map: gMap,
//         position: currentPosition,
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

//       // Place markers
//       markersRef.current = [];
//       places.forEach((place) => {
//         const marker = new window.google.maps.Marker({
//           map: gMap,
//           position: { lat: place.latitude, lng: place.longitude },
//           title: place.name,
//         });
//         markersRef.current.push(marker);
//       });
//     }
//   }, [mapLoaded, currentPosition]);

//   // Show route if selectedPlace is passed
//   useEffect(() => {
//     if (selectedPlace && directionsRenderer && currentPosition) {
//       const directionsService = new window.google.maps.DirectionsService();
//       directionsService.route(
//         {
//           origin: currentPosition,
//           destination: { lat: selectedPlace.latitude, lng: selectedPlace.longitude },
//           travelMode: window.google.maps.TravelMode.DRIVING,
//         },
//         (result, status) => {
//           if (status === "OK") {
//             directionsRenderer.setDirections(result);
//           }
//         }
//       );
//     } else if (directionsRenderer) {
//       // Clear previous route if no selectedPlace
//       directionsRenderer.setDirections({ routes: [] });
//     }
//   }, [selectedPlace, directionsRenderer, currentPosition]);

//   return <div id="map" className="w-full h-screen" />;
// }



import React, { useState, useEffect, useRef } from "react";
import { useAppContext } from "../context/AppContext";

const API_KEY = import.meta.env.VITE_MAPS_KEY;

export default function MapComponent({ places, selectedPlace = null }) {
  const { coords } = useAppContext();
  const [mapLoaded, setMapLoaded] = useState(false);
  const [map, setMap] = useState(null);
  const [directionsRenderer, setDirectionsRenderer] = useState(null);
  const markersRef = useRef([]);

  // Load Google Maps API script
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

      places.forEach((place) => {
        if (place.latitude && place.longitude) {
          const marker = new window.google.maps.Marker({
            map: gMap,
            position: { lat: place.latitude, lng: place.longitude },
            title: place.name,
          });
          markersRef.current.push(marker);
        }
      });
    }
  }, [mapLoaded, coords, map, places]);

  useEffect(() => {
    if (
      selectedPlace &&
      directionsRenderer &&
      coords.lat != null &&
      coords.lon != null &&
      selectedPlace.latitude != null &&
      selectedPlace.longitude != null
    ) {
      const directionsService = new window.google.maps.DirectionsService();
      directionsService.route(
        {
          origin: { lat: coords.lat, lng: coords.lon },
          destination: { lat: selectedPlace.latitude, lng: selectedPlace.longitude },
          travelMode: window.google.maps.TravelMode.DRIVING,
        },
        (result, status) => {
          if (status === "OK") {
            directionsRenderer.setDirections(result);
          }
        }
      );
    } else if (directionsRenderer) {
      // Clear previous route if no selectedPlace
      directionsRenderer.setDirections({ routes: [] });
    }
  }, [selectedPlace, directionsRenderer, coords]);

  return <div id="map" className="w-full h-screen" />;
}


