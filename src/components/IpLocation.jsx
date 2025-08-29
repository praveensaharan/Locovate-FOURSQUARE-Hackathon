import { useEffect, useState } from "react";

function IpInfo() {
  const [ipData, setIpData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchIpData() {
      try {
        const locRes = await fetch("https://ipapi.co/json/");
        if (!locRes.ok) throw new Error("Failed to fetch location");
        const location = await locRes.json();

        setIpData({
          ip: location.ip,
          location: {
            city: location.city,
            region: location.region,
            country: location.country_name,
            latitude: location.latitude,
            longitude: location.longitude,
            timezone: location.timezone,
            org: location.org,
          },
        });
      } catch (err) {
        console.error("Error fetching IP/location:", err);
        setError("Could not fetch IP information");
      } finally {
        setLoading(false);
      }
    }

    fetchIpData();
  }, []);

  if (loading) return <p>Loading IP info...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (!ipData) return <p>No data available</p>;

  return (
    <div className="p-4 border rounded-lg shadow-md bg-gray-800 text-white max-w-md">
      <h2 className="text-lg font-bold mb-2">🌍 My IP Information</h2>
      <ul className="space-y-1">
        <li><strong>IP:</strong> {ipData.ip}</li>
        <li><strong>City:</strong> {ipData.location.city}</li>
        <li><strong>Region:</strong> {ipData.location.region}</li>
        <li><strong>Country:</strong> {ipData.location.country}</li>
        <li><strong>Latitude:</strong> {ipData.location.latitude}</li>
        <li><strong>Longitude:</strong> {ipData.location.longitude}</li>
        <li><strong>Timezone:</strong> {ipData.location.timezone}</li>
        <li><strong>ISP/Org:</strong> {ipData.location.org}</li>
      </ul>
    </div>
  );
}

export default IpInfo;
