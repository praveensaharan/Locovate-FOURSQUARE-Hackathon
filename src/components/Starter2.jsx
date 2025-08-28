import { useState } from "react";
import { motion } from "framer-motion";
import { MapPin, Compass, Loader2 } from "lucide-react";
import { useAppContext } from "../context/AppContext";
import { fetchActivitiesFromAI, fetchPlacesNearby } from "../services/api";

// Step 0: Intro Screen
function ActivityIntro({ loading, weatherLoading, onStart }) {
  return (
    <div className="flex flex-col items-center text-center space-y-4">
      <h1 className="text-2xl font-bold text-gray-800">Find Fun Activities</h1>
      <p className="text-gray-600">
        Discover exciting activities around you based on mood, weather, and time.
      </p>
      <button
        onClick={onStart}
        className="flex items-center px-6 py-3 text-lg rounded-xl bg-sky-600 text-white hover:bg-sky-700 disabled:opacity-50 transition"
        disabled={loading || weatherLoading}
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

// Step 1: Activities List
function ActivityList({ activities, keywords, loading, onSelect }) {
  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-800 mb-4">
        Choose an activity:
      </h2>
      <div className="grid gap-3 text-black">
        {activities.map((act, i) => (
          <button
            key={i}
            onClick={() => onSelect(i)}
            disabled={loading}
            className="text-left w-full px-4 py-3 border rounded-xl hover:bg-sky-50 transition disabled:opacity-50"
          >
            {act}
            {keywords?.[i] && (
              <span className="ml-2 text-xs bg-sky-100 text-sky-700 rounded px-2 py-0.5">
                {keywords[i]}
              </span>
            )}
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
        <div className="flex justify-center py-6">
          <Loader2 className="animate-spin text-sky-600 w-6 h-6" />
        </div>
      ) : (
        <ul className="space-y-3">
          {places.length > 0 ? (
            places.map((place) => (
              <li
                key={place.fsq_place_id}
                className="p-3 border rounded-xl shadow-sm bg-sky-50 flex items-start space-x-3"
              >
                <MapPin className="w-5 h-5 text-sky-600 mt-1" />
                <div>
                  <p className="font-semibold text-gray-800">{place.name}</p>
                  <p className="text-sm text-gray-600">
                    {place.location?.address || "No address available"}
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
export default function ActivityFinder() {
  const { weather, loading: weatherLoading, coords } = useAppContext();

  const [step, setStep] = useState(0);
  const [activities, setActivities] = useState([]);
  const [keywords, setKeywords] = useState([]);
  const [selected, setSelected] = useState(null);
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch activity suggestions from AI
  const handleFetchActivities = async () => {
    if (!weather) return;
    setLoading(true);

    try {
      const {
        location: { name: city },
        current: { condition: { text: weatherCondition } },
      } = weather;
      const date = new Date().toLocaleDateString();
      const time = new Date().toLocaleTimeString();

      const result = await fetchActivitiesFromAI({
        mood: "Good",
        weather: weatherCondition,
        city,
        date,
        time,
      });

      setActivities(result.activities || []);
      setKeywords(result.keywords || []);
      setStep(1);
    } catch (err) {
      console.error("Error fetching activities:", err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch nearby places for selected activity
  const handleFetchPlaces = async (activityIdx) => {
    const activity = activities?.[activityIdx];
    const keyword = keywords?.[activityIdx];
    setSelected(keyword || activity);
    setLoading(true);
    try {
      const result = await fetchPlacesNearby(keyword, coords.lat, coords.lon);
      setPlaces(result || []);
      setStep(2);
    } catch (err) {
      console.error("Error fetching places:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 to-sky-100 p-6 flex flex-col items-center">
      {/* Smooth transition in and out */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
        className="w-full max-w-xl"
      >
        <div className="shadow-lg rounded-2xl border-0 bg-white p-6 space-y-6">
          {step === 0 && (
            <ActivityIntro
              loading={loading}
              weatherLoading={weatherLoading}
              onStart={handleFetchActivities}
            />
          )}
          {step === 1 && (
            <ActivityList
              activities={activities}
              keywords={keywords}
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
