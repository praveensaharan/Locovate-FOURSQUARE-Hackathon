// src/components/PlaceSelected.jsx
import React from "react";

export default function PlaceSelected({ place }) {
  if (!place) return null;

  return (
    <div className="p-4 rounded-xl bg-[#0F0F35]/70 backdrop-blur border border-[#4A4CFF]/30 text-gray-200 shadow-lg">
      <h2 className="text-2xl font-bold text-white mb-3">{place.name}</h2>

      <p className="text-sm text-[#B9B9FF] mb-2">
        {place.location?.formatted_address || "No address available"}
      </p>

      <p className="text-xs text-gray-400 mb-1">
        Distance: {(place.distance / 1000).toFixed(2)} km
      </p>

      <p className="text-xs text-gray-400 mb-1">
        {place.website || "No website"}
      </p>

      <p className="text-xs text-gray-400 mb-1">
        {place.categories?.map((c) => c.short_name).join(", ")}
      </p>

      <p className="text-xs text-gray-400 mb-1">
        Phone: {place.tel || "N/A"}
      </p>

      {/* Photos */}
      {place.photos?.length > 0 && (
        <div className="grid grid-cols-2 gap-2 mt-4">
          {place.photos.map((photo, idx) => (
            <img
              key={idx}
              src={`${photo.prefix}original${photo.suffix}`}
              alt={place.name}
              className="rounded-lg shadow"
            />
          ))}
        </div>
      )}
    </div>
  );
}
