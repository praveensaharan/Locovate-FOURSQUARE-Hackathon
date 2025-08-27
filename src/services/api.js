const API_KEY = import.meta.env.VITE_OPENAI_KEY;

// Fetch activity suggestions from AI
export async function fetchActivitiesFromAI({ mood, weather, city, date, time }) {
  const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `${API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "gpt-oss-20b",
      temperature: 0.2,
      max_tokens: 600,
      messages: [
        {
          role: "system",
          content: `You are an activity suggestion generator. Always return only valid JSON.
          Keys:
          1. activities: 3–5 short, vivid activity suggestions for the given mood, weather, location, date, and time.
          2. keywords: one-word or very short phrases matching each activity’s main theme; must match the number of activities.
          3. reasoning: friendly 2–3 sentence explanation for why these activities fit.`,
        },
        {
          role: "user",
          content: `mood: ${mood}, weather: ${weather}, location: ${city}, date: ${date}, time: ${time}`,
        },
      ],
    }),
  });

  const data = await res.json();
  return JSON.parse(data.choices[0].message.content);
}

// Fetch nearby places based on activity
export async function fetchPlacesNearby(activity, lat, lon) {
  const res = await fetch(
    `http://localhost:3001/api/places?query=${encodeURIComponent(
      activity
    )}&ll=${lat},${lon}`
  );

  const data = await res.json();
  return data.results || [];
}
