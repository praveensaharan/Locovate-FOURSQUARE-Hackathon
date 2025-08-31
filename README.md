# Around Me AI ![alt text](public/PNG-favicon.png)

**Personalized Place Recommendations using Geospatial AI, Mood, and Weather**

---

## About the Project

Around Me AI is a next-generation web application that delivers personalized place recommendations based on your **mood**, **local weather**, **time of day**, and **location**. By combining AI, geospatial data, and real-time weather, we help users discover the best places and activities tailored just for them.

- **AI-powered suggestions**: Get activity ideas based on your mood and context.
- **Weather-aware**: Recommendations adapt to current weather conditions.
- **Location-based**: Uses your device's location or IP to find nearby places.
- **Interactive maps**: Visualize places and routes with Google Maps.
- **Modern UI**: Built with React, Tailwind CSS, and Framer Motion for a smooth experience.

---

## 🛠️ Tech Stack

- **Frontend**: [React](https://react.dev/), [Vite](https://vitejs.dev/), [Tailwind CSS](https://tailwindcss.com/), [Ant Design](https://ant.design/)
- **Maps**: [Google Maps JavaScript API](https://developers.google.com/maps/documentation/javascript), [react-globe.gl](https://github.com/vasturiano/react-globe.gl)
- **AI & Backend**: [OpenAI](https://openai.com/) (for activity suggestions), [WeatherAPI](https://www.weatherapi.com/), [Foursquare Places API](https://developer.foursquare.com/docs)
- **Other**: [Framer Motion](https://www.framer.com/motion/), [Lucide Icons](https://lucide.dev/)

---

## 💡 How It Works

1. **Location Detection**: The app tries to get your geolocation (with fallback to IP-based location).
2. **Weather Fetching**: Retrieves real-time weather for your location.
3. **Mood Input**: You can speak your mood or pick from animated mood bubbles.
4. **AI Activity Suggestions**: The app uses AI to suggest activities based on your mood, weather, and time.
5. **Nearby Places**: Finds relevant places nearby using Foursquare and Google Maps.
6. **Interactive Map**: Visualizes your location, suggested places, and driving directions.

---

## 🖥️ Getting Started

### 1. **Clone the Repository**

```sh
git clone https://github.com/praveensaharan/Locovate-FOURSQUARE-Hackathon.git
cd Locovate-FOURSQUARE-Hackathon
```

### 2. **Install Dependencies**

```sh
npm install
```

### 3. **Set Up Environment Variables**

Create a `.env` file in the root of the project and add your API keys:

```
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
VITE_OPENAI_API_KEY=your_openai_api_key
VITE_WEATHER_API_KEY=your_weather_api_key
VITE_FOURSQUARE_API_KEY=your_foursquare_api_key
```

### 4. **Run the Development Server**

```sh
npm run dev
```

Open your browser and go to `http://localhost:5173` to see the app in action.


---

## 🙏 Acknowledgments

- [OpenAI](https://openai.com/) for the amazing GPT-3.5 API.
- [WeatherAPI](https://www.weatherapi.com/) for reliable weather data.
- [Foursquare Places API](https://developer.foursquare.com/docs) for location data.
- [Google Maps JavaScript API](https://developers.google.com/maps/documentation/javascript) for interactive maps.
- [Vite](https://vitejs.dev/) for the fast and flexible frontend build tool.
- [Tailwind CSS](https://tailwindcss.com/) for the utility-first CSS framework.
- [Ant Design](https://ant.design/) for the React UI library.
- [Framer Motion](https://www.framer.com/motion/) for the animations.
- [Lucide Icons](https://lucide.dev/) for the beautiful icons.

---