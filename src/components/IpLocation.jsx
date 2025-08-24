import React, { useEffect, useState } from "react";

const IPGeoLocation = () => {
  const [locationData, setLocationData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch geolocation data from ip-api
    fetch("http://ip-api.com/json/")
      .then((res) => res.json())
      .then((data) => {
        if (data.status === "success") {
          setLocationData(data);
        } else {
          setError("Failed to fetch location data");
        }
      })
      .catch((err) => {
        setError(err.message || "Unknown error");
      });
  }, []);

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h2>Your IP Geolocation Info</h2>
      {error && <p style={{ color: "red" }}>Error: {error}</p>}

      {locationData ? (
        <ul>
          {Object.entries(locationData).map(([key, value]) => (
            <li key={key}>
              <strong>{key}:</strong> {value.toString()}
            </li>
          ))}
        </ul>
      ) : (
        !error && <p>Loading...</p>
      )}
    </div>
  );
};

export default IPGeoLocation;
