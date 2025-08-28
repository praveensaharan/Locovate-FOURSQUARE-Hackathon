// components/WeatherInfo.jsx
import { useAppContext } from "../context/AppContext";

export default function WeatherInfo() {
  const { weather, loading, error } = useAppContext();

  if (loading) return <p className="text-blue-400 mt-4">Loading weather data...</p>;
  if (error) return <p className="text-red-500 mt-4">Error: {error}</p>;
  if (!weather) return <p className="text-gray-400 mt-4">No weather data available.</p>;

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
        <img src={`https:${conditionIcon}`} alt={conditionText} className="w-16 h-16" />
        <div>
          <p className="text-xl font-bold">{temp_c}°C</p>
          <p className="text-gray-300">{conditionText}</p>
          <p className="text-gray-400 text-sm">Feels like: {feelslike_c}°C</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <p className="font-semibold">Wind</p>
          <p>{wind_kph} kph {wind_dir}</p>
        </div>
        <div>
          <p className="font-semibold">Humidity</p>
          <p>{humidity}%</p>
        </div>
      </div>
    </div>
  );
}
