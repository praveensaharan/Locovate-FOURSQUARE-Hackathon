import WeatherInfo from "./components/WeatherInfo";
import Starter2 from "./components/Starter2";
import Starter from "./components/Starter";
import Maps from "./components/maps2";
import { AppProvider } from "./context/AppContext";

export default function App() {
  return (
    <AppProvider>
      <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center">
        <h1 className="text-3xl font-bold mt-6">My Weather</h1>
        <WeatherInfo />
        <Maps />
        {/* <Starter /> */}
      </div>
    </AppProvider>
  );
}
