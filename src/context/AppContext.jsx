// context/AppContext.jsx
import { createContext, useContext, useEffect, useState } from "react";

const AppContext = createContext();

const API_KEY = import.meta.env.VITE_WEATHER_KEY;

export function AppProvider({ children }) {
  const [coords, setCoords] = useState({ lat: null, lon: null });
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Get user location
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

  // Fetch weather when coords change
  useEffect(() => {
    const fetchWeather = async () => {
      if (!coords.lat || !coords.lon) return;
      setLoading(true);
      try {
        const url = `https://api.weatherapi.com/v1/current.json?q=${coords.lat},${coords.lon}&key=${API_KEY}`;
        const res = await fetch(url);
        if (!res.ok) throw new Error("Failed to fetch weather data");

        const data = await res.json();
        setWeather(data);
        setError("");
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
  }, [coords]);

  return (
    <AppContext.Provider value={{ coords, setCoords, weather, loading, error }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  return useContext(AppContext);
}
