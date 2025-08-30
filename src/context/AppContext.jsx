import { createContext, useContext, useEffect, useState } from "react";

const AppContext = createContext();
const API_KEY = import.meta.env.VITE_WEATHER_KEY;

export function AppProvider({ children }) {
  const [coords, setCoords] = useState({ lat: null, lon: null });
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Get location (geolocation or fallback to IP after 5s)
  useEffect(() => {
    let canceled = false;
    let timeoutId;

    async function fallbackToIP() {
      try {
        const locRes = await fetch("https://ipapi.co/json/");
        if (!locRes.ok) throw new Error("Failed to fetch location from IP");
        const location = await locRes.json();
        if (!canceled) {
          setCoords({
            lat: location.latitude,
            lon: location.longitude,
          });
        }
      } catch (ipErr) {
        if (!canceled) setError("Could not determine location");
      }
    }

    if ("geolocation" in navigator) {
      setLoading(true);
      timeoutId = setTimeout(() => {
        if (!canceled) {
          fallbackToIP();
        }
      }, 1000);

      navigator.geolocation.getCurrentPosition(
        (pos) => {
          if (!canceled) {
            clearTimeout(timeoutId);
            setCoords({
              lat: pos.coords.latitude,
              lon: pos.coords.longitude,
            });
          }
        },
        () => {
          if (!canceled) {
            clearTimeout(timeoutId);
            fallbackToIP();
          }
        }
      );
    } else {
      fallbackToIP();
    }

    return () => {
      canceled = true;
      clearTimeout(timeoutId);
    };
  }, []);

  // Fetch weather when coords are ready
  useEffect(() => {
    if (coords.lat == null || coords.lon == null) return;

    let canceled = false;
    setLoading(true);

    const fetchWeather = async () => {
      try {
        const url = `https://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${coords.lat},${coords.lon}`;
        const res = await fetch(url);
        if (!res.ok) throw new Error("Failed to fetch weather data");
        const data = await res.json();
        if (!canceled) {
          setWeather(data);
          setError("");
        }
      } catch (err) {
        if (!canceled) setError(err.message);
      } finally {
        if (!canceled) setLoading(false);
      }
    };

    fetchWeather();

    return () => {
      canceled = true;
    };
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
