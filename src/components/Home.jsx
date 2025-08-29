import React, { useState, useEffect } from "react";

export default function HeroSection() {
  const [locationEnabled, setLocationEnabled] = useState(true);

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

  return (
    <div className="relative flex flex-col md:flex-row items-center justify-between min-h-screen text-white px-6 py-12 md:px-16 md:py-20 overflow-hidden mt-10 gap-10 md:gap-24">
      <div className="relative max-w-xl w-full md:w-auto space-y-6 z-20 text-center md:text-left">
        <h1 className="text-3xl sm:text-4xl md:text-6xl font-extrabold leading-tight">
          The <span className="text-indigo-400">future</span> of <br />
          geospatial technology, <br />
          built by <span className="text-indigo-400">Foursquare</span>
        </h1>
        <p className="text-gray-300 text-base sm:text-lg max-w-md mx-auto md:mx-0">
          We’re the industry-leading platform for all things geospatial, from
          foundational building blocks to turnkey solutions, from marketers to
          developers.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 max-w-xs mx-auto md:mx-0">
          <button className="px-6 py-3 rounded-2xl bg-indigo-500 hover:bg-indigo-600 shadow-lg text-base">
            Speak to sales
          </button>
          <button className="px-6 py-3 rounded-2xl border border-gray-400 hover:bg-gray-800 text-base">
            Try for free
          </button>
        </div>
      </div>

      {!locationEnabled && (
        <div className="max-w-sm w-full bg-gray-900 bg-opacity-90 border border-indigo-600 rounded-lg p-6 shadow-lg text-center text-white z-20">
          <h2 className="text-xl font-semibold mb-2">Location Not Enabled</h2>
          <p className="mb-4 text-gray-300">
            Without location access, we cannot provide the best experience. Please enable location services in your browser or device settings.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-5 py-3 rounded-2xl bg-indigo-500 hover:bg-indigo-600 shadow-md"
          >
            Try Again
          </button>
        </div>
      )}
    </div>
  );
}
