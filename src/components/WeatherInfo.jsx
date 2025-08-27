import React, { useEffect, useState } from "react";

const API_KEY = import.meta.env.VITE_WEATHER_KEY;

export default function WeatherInfo({ lat, lon }) {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchWeather = async () => {
      setLoading(true);
      try {
        let query = "";

        if (lat && lon) {
          // Use coordinates if available
          query = `${lat},${lon}`;
        } else {
          // Fallback: get public IP
          const ipRes = await fetch("https://api.ipify.org/?format=json");
          if (!ipRes.ok) throw new Error("Failed to fetch IP address");
          const { ip } = await ipRes.json();
          query = ip;
        }

        const url = `https://api.weatherapi.com/v1/current.json?q=${query}&key=${API_KEY}`;
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
  }, [lat, lon]);

  if (loading) {
    return <p className="text-blue-400 mt-4">Loading weather data...</p>;
  }

  if (error) {
    return <p className="text-red-500 mt-4">Error: {error}</p>;
  }

  if (!weather) {
    return <p className="text-gray-400 mt-4">No weather data available.</p>;
  }

  const {
    location: { name, region, country, localtime },
    current: {
      temp_c,
      condition: { text: conditionText, icon: conditionIcon },
      wind_kph,
      wind_dir,
      humidity,
      feelslike_c,
    },
  } = weather;

  return (
    <div className="max-w-md w-full bg-gray-800 text-white rounded-xl shadow-lg p-6 mt-6 border border-gray-700">
      <h2 className="text-2xl font-semibold mb-2">
        Weather in {name}, {region ? region + "," : ""} {country}
      </h2>
      <p className="text-sm text-gray-400 mb-4">Local time: {localtime}</p>

      <div className="flex items-center gap-4 mb-4">
        <img
          src={`https:${conditionIcon}`}
          alt={conditionText}
          className="w-16 h-16"
          loading="lazy"
        />
        <div>
          <p className="text-xl font-bold">{temp_c}°C</p>
          <p className="text-gray-300">{conditionText}</p>
          <p className="text-gray-400 text-sm">Feels like: {feelslike_c}°C</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <p className="font-semibold">Wind</p>
          <p>
            {wind_kph} kph {wind_dir}
          </p>
        </div>
        <div>
          <p className="font-semibold">Humidity</p>
          <p>{humidity}%</p>
        </div>
      </div>
    </div>
  );
}
