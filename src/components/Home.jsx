import React, { useState, useEffect } from "react";
import LoadingScreen from "./loading";
import { useAppContext } from "../context/AppContext";

export default function HeroSection() {
  const [locationEnabled, setLocationEnabled] = useState(true);
  const { loading, weather } = useAppContext();

  useEffect(() => {
    if (navigator.permissions) {
      navigator.permissions.query({ name: "geolocation" }).then((result) => {
        if (result.state === "granted") {
          setLocationEnabled(true);
        } else if (result.state === "prompt") {
          navigator.geolocation.getCurrentPosition(
            () => setLocationEnabled(true),
            () => setLocationEnabled(false)
          );
        } else {
          setLocationEnabled(false);
        }
      });
    } else {
      navigator.geolocation.getCurrentPosition(
        () => setLocationEnabled(true),
        () => setLocationEnabled(false)
      );
    }
  }, []);

  if (loading) return <LoadingScreen />;

  return (
    <section className="relative flex flex-col md:flex-row items-center justify-between min-h-screen text-white px-6 py-12 md:px-16 md:py-20 overflow-hidden mt-10 gap-10 md:gap-16">
      {/* Left Content */}
      <div className="relative max-w-xl w-full md:w-1/2 space-y-6 z-20 text-center md:text-left">
        <h1 className="text-3xl sm:text-4xl md:text-6xl font-extrabold leading-tight">
          The <span className="text-indigo-400">future</span> of <br />
          geospatial technology, <br />
          built with <span className="text-indigo-400">Around me AI</span>
        </h1>
        <p className="text-gray-300 text-base sm:text-lg max-w-md mx-auto md:mx-0">
          Get Personalized place recommendations based on your current mood,
          local weather, time of day, and even the day of the week.
        </p>
      </div>

      {/* Right Content */}
      <div className="flex flex-col items-center md:items-end gap-6 w-full md:w-auto">
        {!locationEnabled && (
          <div className="max-w-sm w-full bg-gray-900 bg-opacity-90 border border-indigo-600 rounded-xl p-6 shadow-lg text-center z-20">
            <h2 className="text-xl font-semibold mb-2">Location Not Enabled</h2>
            <p className="mb-4 text-gray-300 text-sm leading-relaxed">
              Without location access, we cannot provide the best experience.
              Please enable location services in your browser or device settings.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-5 py-3 rounded-2xl bg-indigo-500 hover:bg-indigo-600 transition-colors shadow-md"
            >
              Try Again
            </button>
          </div>
        )}

        {locationEnabled && weather && (
          <div className="flex items-center gap-4 max-w-sm w-full bg-gray-900 bg-opacity-95 border border-indigo-600 rounded-xl shadow-xl p-6 z-20">
            <img
              src={weather.current.condition.icon}
              alt={weather.current.condition.text}
              className="w-20 h-20 sm:w-24 sm:h-24 flex-shrink-0"
              loading="lazy"
            />
            <div className="space-y-1">
              <p className="text-xl sm:text-2xl font-extrabold">
                {weather.current.temp_c}°C
              </p>
              <p className="text-indigo-400 text-sm font-medium">
                {weather.current.condition.text}
              </p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
