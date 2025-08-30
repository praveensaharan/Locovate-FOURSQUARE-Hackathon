import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react"; // optional, nice spinner icon

export default function LoadingScreen() {



  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-black/90 text-white z-50">
      {/* Spinning globe-like loader */}
      <div className="relative w-24 h-24 mb-6">
        <div className="absolute inset-0 rounded-full border-4 border-blue-500 border-t-transparent animate-spin"></div>
        <div className="absolute inset-4 rounded-full border-4 border-sky-400 border-b-transparent animate-spin-slow"></div>
      </div>

      {/* Text */}
      <h2 className="text-2xl font-bold mb-2">Detecting your location...</h2>
      <p className="text-gray-300">Trying GPS first, falling back to IP in</p>
    </div>
  );
}
