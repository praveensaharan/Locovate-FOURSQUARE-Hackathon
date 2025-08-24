import { useState, useEffect } from "react";
import LocationMap from "./components/location";
import WeatherInfo from "./components/WeatherInfo";
import IPGeoLocation from "./components/IpLocation";

export default function App() {
  const [coords, setCoords] = useState({ lat: null, lon: null });

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((pos) => {
        setCoords({
          lat: pos.coords.latitude,
          lon: pos.coords.longitude,
        });
      });
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center">
      <h1 className="text-3xl font-bold mt-6">My Weather</h1>

      <LocationMap />
      <WeatherInfo lat={coords.lat} lon={coords.lon} />
      <IPGeoLocation />
    </div>
  );
}
