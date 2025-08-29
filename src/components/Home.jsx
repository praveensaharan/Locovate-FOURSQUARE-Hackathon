import React from "react";
import MyGlobeComponent from "./globe";

export default function HeroSection() {
  return (
    <div className="relative flex flex-col md:flex-row items-center justify-between min-h-screen text-white px-6 py-12 md:px-16 md:py-20 overflow-hidden mt-10">
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
    </div>
  );
}
