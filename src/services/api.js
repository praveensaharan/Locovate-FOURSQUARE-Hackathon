const API_KEY = import.meta.env.VITE_OPENAI_KEY;

// --------------------------
// Fetch activity suggestions from OpenRouter AI
// --------------------------
export async function fetchActivitiesFromAI({ mood, weather, city, date, time }) {
  const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `${API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "gpt-4o-mini", // ✅ more realistic than "gpt-oss-20b"
      temperature: 0.2,
      max_tokens: 600,
      messages: [
        {
          role: "system",
          content: `You are an activity suggestion generator. Always return ONLY raw JSON (no text outside JSON).
Keys:
- activities: 3–5 short, vivid activity suggestions for the given mood, weather, location, date, and time.
- keywords: one-word or very short phrases matching each activity’s main theme; must match the number of activities.
- reasoning: friendly 2–3 sentence explanation for why these activities fit.`,
        },
        {
          role: "user",
          content: `mood: ${mood}, weather: ${weather}, location: ${city}, date: ${date}, time: ${time}`,
        },
      ],
    }),
  });

  if (!res.ok) {
    throw new Error(`AI request failed: ${res.status} ${res.statusText}`);
  }

  const data = await res.json();
  let content = data.choices?.[0]?.message?.content || "";

  // Strip possible Markdown code fences like ``````
  content = content.replace(/``````/g, "").trim();
  console.log("AI raw content:", content);

  try {
    return JSON.parse(content);
  } catch (err) {
    console.error("Failed to parse AI JSON:", content);
    throw new Error("Invalid JSON returned from AI");
  }
}

// --------------------------
// Fetch nearby places (proxy through your backend)
// --------------------------
export async function fetchPlacesNearby(activity, lat, lon) {
  console.log("Fetching places for activity:", activity, "at", lat, lon);
  const res = await fetch(
    `http://localhost:3001/api/places?query=${encodeURIComponent(activity)}&ll=${lat},${lon}`
  );
console.log("Places API response:", res);
  if (!res.ok) {
    throw new Error(`Places API failed: ${res.status} ${res.statusText}`);
  }

  const data = await res.json();
  console.log("Places API data:", data);
  return data.results || [];
}
