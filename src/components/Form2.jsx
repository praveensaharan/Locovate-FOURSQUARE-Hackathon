import { useState } from "react";
import { motion } from "framer-motion";
import { MapPin, Compass, Loader2 } from "lucide-react";
import { useAppContext } from "../context/AppContext";
import { fetchActivitiesFromAI, fetchPlacesNearby } from "../services/api";
import AudioOrMoodChooser from "./Form1";
import MapComponent from "./maps2";
import PlaceSelected from "./PlaceSelected";

// Step 1: Intro after mood chosen
function ActivityIntro({ loading, weatherLoading, onStart, mood }) {
  return (
    <div className="flex flex-col items-center text-center space-y-4">
      <h1 className="text-3xl font-bold text-white drop-shadow-lg">
        Find Fun Activities
      </h1>
      <p className="text-[#B9B9FF]">
        Based on your mood (<span className="font-semibold text-[#4A4CFF]">{mood}</span>), weather, time, and location.
      </p>
      <button
        onClick={onStart}
        disabled={loading || weatherLoading}
        className="flex items-center px-6 py-3 text-lg rounded-xl bg-gradient-to-r from-[#4A4CFF] to-[#5865F2] text-white hover:shadow-[0_0_15px_rgba(74,76,255,0.6)] disabled:opacity-50 transition shadow-md"
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

// Step 2: Activity choices
function ActivityList({ activities, keywords, loading, onSelect, reasoning }) {
  return (
    <div>
      <h2 className="text-2xl font-semibold text-white mb-4 drop-shadow-md">
        Choose an activity:
      </h2>
     {reasoning && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="mb-6 p-4 rounded-xl bg-[#0F0F35]/70 border border-[#4A4CFF]/30 text-[#B9B9FF] italic text-sm shadow-[0_0_12px_rgba(74,76,255,0.25)]"
        >
          {reasoning}
        </motion.p>
      )}
      <div className="grid gap-3">
        {activities.map((act, i) => (
          <button
            key={i}
            onClick={() => onSelect(i)}
            disabled={loading}
            className="text-left w-full px-4 py-3 rounded-xl transition-all disabled:opacity-50 bg-[#0B0B2B]/70 backdrop-blur border border-[#4A4CFF]/30 text-gray-200 hover:bg-[#4A4CFF]/20 hover:shadow-[0_0_10px_rgba(74,76,255,0.5)]"
          >
            {act}
            {keywords?.[i] && (
              <span className="ml-2 text-xs bg-[#4A4CFF]/30 text-[#B9B9FF] rounded px-2 py-0.5">
                {keywords[i]}
              </span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}

// Step 3: Nearby places list
function PlacesList({ selected, places, loading, onPlaceClick }) {
  return (
    <div>
      <h2 className="text-2xl font-semibold text-white mb-4 drop-shadow-md">
        You choose: <span className="text-[#4A4CFF]">{selected}</span>
      </h2>
      <h3 className="text-lg font-medium text-[#B9B9FF] mb-3">Nearby options:</h3>
      {loading ? (
        <div className="flex justify-center py-6">
          <Loader2 className="animate-spin text-[#4A4CFF] w-6 h-6" />
        </div>
      ) : (
        <ul className="space-y-3">
          {places.length > 0 ? (
            places.map((place) => (
              <li
                key={place.fsq_place_id}
                className="cursor-pointer p-3 rounded-xl bg-[#0F0F35]/70 backdrop-blur border border-[#4A4CFF]/30 text-gray-200 flex items-start space-x-3 hover:shadow-[0_0_10px_rgba(74,76,255,0.4)]"
                onClick={() => onPlaceClick(place)}
              >
                <MapPin className="w-5 h-5 text-[#4A4CFF] mt-1" />
                <div>
                  <p className="font-semibold text-white">{place.name}</p>
                  <p className="text-sm text-[#B9B9FF]">
                    {place.location?.formatted_address || "No address available"}
                  </p>
              
                </div>
              </li>
            ))
          ) : (
            <p className="text-[#B9B9FF]">No places found.</p>
          )}
        </ul>
      )}
    </div>
  );
}


export default function ActivityFinder() {
  const { weather, loading: weatherLoading, coords } = useAppContext();

  const [step, setStep] = useState(0);
  const [mood, setMood] = useState("");
  const [activities, setActivities] = useState([]);
  const [keywords, setKeywords] = useState([]);
  const [selected, setSelected] = useState(null);
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(false);
  const [reasoning, setReasoning] = useState("");
  const [selectedPlace, setSelectedPlace] = useState(null);

  // Reset flow
  const handleReset = () => {
    setStep(0);
    setMood("");
    setActivities([]);
    setKeywords([]);
    setSelected(null);
    setPlaces([]);
    setLoading(false);
    setReasoning("");
    setSelectedPlace(null);
  };

    const handlePlaceClick = (place) => {
    setSelectedPlace(place);
    setStep(4);
  };

  // Step transitions
  const handleMoodChosen = (chosenMood) => {
    setMood(chosenMood);
    setStep(1);
  };

  const handleFetchActivities = async () => {
    if (!weather || !mood) return;
    setLoading(true);
    try {
      const {
        location: { name: city },
        current: { condition: { text: weatherCondition } },
      } = weather;
      const date = new Date().toLocaleDateString();
      const time = new Date().toLocaleTimeString();

      const result = await fetchActivitiesFromAI({
        mood,
        weather: weatherCondition,
        city,
        date,
        time,
      });

      setActivities(result.activities || []);
      setKeywords(result.keywords || []);
      setReasoning(result.reasoning || "");
      setStep(2);
    } catch (err) {
      console.error("Error fetching activities:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleFetchPlaces = async (activityIdx) => {
    const activity = activities?.[activityIdx];
    const keyword = keywords?.[activityIdx];
    setSelected(keyword || activity);
    setLoading(true);
    try {
      const result = await fetchPlacesNearby(keyword, coords.lat, coords.lon);
      setPlaces(result || []);
      setStep(3);
    } catch (err) {
      console.error("Error fetching places:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
       {places?.length > 0 && (
        <MapComponent places={places} selectedPlace={selectedPlace} />
        )}
    <div className="bg-gradient-to-b from-[#0B0B2B] via-[#0F0F35] to-[#0B0B2B] p-6 flex flex-col items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
        className="w-full max-w-xl"
      >
        <div className="rounded-2xl bg-[#0B0B2B]/70 backdrop-blur-lg p-6 space-y-6 border border-[#4A4CFF]/20 shadow-[0_0_20px_rgba(74,76,255,0.2)]">
          {step === 0 && (
            <AudioOrMoodChooser
              onTranscript={(txt) => handleMoodChosen(txt)}
              onMoodSelect={(m) => handleMoodChosen(m)}
            />
          )}
          {step === 1 && (
            <ActivityIntro
              loading={loading}
              weatherLoading={weatherLoading}
              onStart={handleFetchActivities}
              mood={mood}
            />
          )}
          {step === 2 && (
            <ActivityList
              reasoning={reasoning}
              activities={activities}
              keywords={keywords}
              loading={loading}
              onSelect={handleFetchPlaces}
            />
          )}
            {step === 3 && (
              <PlacesList
                selected={selected}
                places={places}
                loading={loading}
                onPlaceClick={handlePlaceClick} 
              />
            )}

            {step === 4 && (
              <PlaceSelected place={selectedPlace} />
            )}

          {step > 0 && (
       <div className="pt-4 flex justify-center">
        <button
          onClick={handleReset}
          className="px-4 py-2 rounded-lg border border-red-400/40 text-red-200 bg-red-500/20 hover:bg-red-900 hover:shadow-[0_0_10px_rgba(239,68,68,0.5)] transition"
        >
          Reset & Start Over
        </button>
      </div>

          )}
        </div>
      </motion.div>
      </div>
     
    </div>
  );
}
