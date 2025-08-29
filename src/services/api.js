

const URL = "https://locovate-backend.vercel.app/api"
export async function fetchActivitiesFromAI({ mood, weather, city, date, time }) {
  const res = await fetch(`${URL}/ai-activities`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ mood, weather, city, date, time }),
  });

  if (!res.ok) {
    throw new Error(`Backend request failed: ${res.status} ${res.statusText}`);
  }

  const data = await res.json();
  return data;
}

export async function fetchPlacesNearby(activity, lat, lon) {
  console.log("Fetching places for activity:", activity, "at", lat, lon);
  const res = await fetch(
    `${URL}/places?query=${encodeURIComponent(activity)}&ll=${lat},${lon}`
  );
console.log("Places API response:", res);
  if (!res.ok) {
    throw new Error(`Places API failed: ${res.status} ${res.statusText}`);
  }

  const data = await res.json();
  console.log("Places API data:", data);
  return data.results || [];
}
