import React from "react";
import places from "../filejsons/helo.json"; 

const Field = ({ label, value }) => (
  <div className="mb-1">
    <strong>{label}:</strong>{" "}
    {typeof value === "string" || typeof value === "number"
      ? value
      : value ?? "—"}
  </div>
);

const SocialMedia = ({ social_media }) => {
  if (!social_media) return null;
  const entries = Object.entries(social_media).filter(([, val]) => val);
  if (entries.length === 0) return null;

  return (
    <div className="mb-1">
      <strong>Social Media:</strong>{" "}
      {entries.map(([key, val]) => (
        <span key={key} className="mr-3">
          {key}: {val}
        </span>
      ))}
    </div>
  );
};

const Categories = ({ categories }) =>
  categories && categories.length ? (
    <div className="mb-2">
      <strong>Categories:</strong>{" "}
      {categories.map((cat) => (
        <span key={cat.fsq_category_id} className="mr-4 inline-flex items-center">
          <img
            src={cat.icon.prefix + "32" + cat.icon.suffix}
            alt={cat.short_name}
            className="inline-block mr-1"
          />
          {cat.name}
        </span>
      ))}
    </div>
  ) : null;

const Location = ({ location, place }) => (
  <div className="ml-3 space-y-1 mb-2 text-black">
    <Field label="Address" value={location.address} />
    <Field label="Locality" value={location.locality} />
    <Field label="Region" value={location.region} />
    <Field label="Postcode" value={location.postcode} />
    <Field label="Country" value={location.country} />
    <Field label="Formatted" value={location.formatted_address} />
    <Field label="Distance" value={place.distance ? `${place.distance}m` : "—"} />
    <Field
      label="Website"
      value={
        place.website ? (
          <a
            href={place.website}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline"
          >
            {place.website}
          </a>
        ) : (
          "—"
        )
      }
    />
    <Field label="Tel" value={place.tel} />
    <Field
      label="Link"
      value={
        place.link ? (
          <a
            href={place.link}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline"
          >
            {place.link}
          </a>
        ) : (
          "—"
        )
      }
    />
    <Field
      label="Placemaker"
      value={
        place.placemaker_url ? (
          <a
            href={place.placemaker_url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline"
          >
            Foursquare
          </a>
        ) : (
          "—"
        )
      }
    />
  </div>
);

const PlaceCard = ({ place }) => (
  <div className="border border-gray-300 rounded-lg p-5 shadow-sm mb-6 max-w-md">
    <h2 className="text-xl font-semibold mb-2">{place.name}</h2>

    <Field label="ID" value={place.fsq_place_id} />
    <Field label="Latitude" value={place.latitude} />
    <Field label="Longitude" value={place.longitude} />
    <Field label="Date Created" value={place.date_created} />
    <Field label="Date Refreshed" value={place.date_refreshed} />

    <Categories categories={place.categories} />
    <Location location={place.location} place={place} />
    <SocialMedia social_media={place.social_media} />

    {place.related_places && Object.keys(place.related_places).length > 0 && (
      <div className="mb-2">
        <strong>Related Places:</strong>
        <pre className="bg-gray-100 p-2 rounded text-sm overflow-auto">
          {JSON.stringify(place.related_places, null, 2)}
        </pre>
      </div>
    )}

    {place.chains && place.chains.length > 0 && (
      <div className="mb-2">
        <strong>Chains:</strong>
        <pre className="bg-gray-100 p-2 rounded text-sm overflow-auto">
          {JSON.stringify(place.chains, null, 2)}
        </pre>
      </div>
    )}

    {place.extended_location && Object.keys(place.extended_location).length > 0 && (
      <div className="mb-2">
        <strong>Extended Location:</strong>
        <pre className="bg-gray-100 p-2 rounded text-sm overflow-auto">
          {JSON.stringify(place.extended_location, null, 2)}
        </pre>
      </div>
    )}
  </div>
);

const PlacesList = () => (
  <div className="p-6 bg-gray-50 min-h-screen">
    <h1 className="text-3xl font-bold mb-6">Places List</h1>
    {places.map((place) => (
      <PlaceCard key={place.fsq_place_id} place={place} />
    ))}
  </div>
);

export default PlacesList;
