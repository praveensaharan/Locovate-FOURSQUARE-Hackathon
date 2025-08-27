import React, { useState } from "react";
import { motion } from "framer-motion";
import { MapPin, Compass, Loader2 } from "lucide-react";
import { fetchActivitiesFromAI, fetchPlacesNearby } from "../services/api";

// Step 0: Intro Screen
function ActivityIntro({ loading, onStart }) {
  return (
    <div className="flex flex-col items-center text-center space-y-4">
      <h1 className="text-2xl font-bold text-gray-800">Find Fun Activities</h1>
      <p className="text-gray-600">
        Discover exciting activities around you based on mood, weather, and time.
      </p>
      <button
        onClick={onStart}
        className="flex items-center px-6 py-3 text-lg rounded-xl bg-sky-600 text-white hover:bg-sky-700 disabled:opacity-50"
        disabled={loading}
      >
        {loading ? (
          <Loader2 className="animate-spin w-5 h-5" />
        ) : (
          <>
            <Compass className="w-5 h-5 mr-2" /> Start Exploring
          </>
        )}
      </button>
    </div>
  );
}

// Step 1: Activity Selection
function ActivityList({ activities, loading, onSelect }) {
  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-800 mb-4">
        Choose an activity:
      </h2>
      <div className="grid gap-3 text-black">
        {activities.map((act, i) => (
          <button
            key={i}
            onClick={() => onSelect(act)}
            disabled={loading}
            className="text-left w-full px-4 py-3 border rounded-xl hover:bg-sky-50 transition disabled:opacity-50"
          >
            {act}
          </button>
        ))}
      </div>
    </div>
  );
}

// Step 2: Places List
function PlacesList({ selected, places, loading }) {
  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-800 mb-4">
        You chose: <span className="text-sky-600">{selected}</span>
      </h2>
      <h3 className="text-lg font-medium text-gray-700 mb-3">Nearby options:</h3>
      {loading ? (
        <div className="flex justify-center">
          <Loader2 className="animate-spin text-sky-600 w-6 h-6" />
        </div>
      ) : (
        <ul className="space-y-3">
          {places.length > 0 ? (
            places.map((place) => (
              <li
                key={place.fsq_id}
                className="p-3 border rounded-xl shadow-sm bg-sky-50 flex items-start space-x-3"
              >
                <MapPin className="w-5 h-5 text-sky-600 mt-1" />
                <div>
                  <p className="font-semibold text-gray-800">{place.name}</p>
                  <p className="text-sm text-gray-600">
                    {place.location.address || "No address"}
                  </p>
                </div>
              </li>
            ))
          ) : (
            <p className="text-gray-500">No places found.</p>
          )}
        </ul>
      )}
    </div>
  );
}

// Main Component
export default function ActivityFinder({ lat, lon }) {
  const [step, setStep] = useState(0);
  const [activities, setActivities] = useState([]);
  const [selected, setSelected] = useState(null);
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleFetchActivities = async () => {
    setLoading(true);
    try {
      const result = await fetchActivitiesFromAI();
      setActivities(result.activities);
      setStep(1);
    } catch (err) {
      console.error("Error fetching activities:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleFetchPlaces = async (activity) => {
    setSelected(activity);
    setLoading(true);
    try {
      const result = await fetchPlacesNearby(activity, lat, lon);
      setPlaces(result);
      setStep(2);
    } catch (err) {
      console.error("Error fetching places:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 to-sky-100 p-6 flex flex-col items-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-xl"
      >
        <div className="shadow-lg rounded-2xl border-0 bg-white p-6 space-y-6">
          {step === 0 && (
            <ActivityIntro loading={loading} onStart={handleFetchActivities} />
          )}
          {step === 1 && (
            <ActivityList
              activities={activities}
              loading={loading}
              onSelect={handleFetchPlaces}
            />
          )}
          {step === 2 && (
            <PlacesList selected={selected} places={places} loading={loading} />
          )}
        </div>
      </motion.div>
    </div>
  );
}
