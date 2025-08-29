
import WeatherInfo from "./components/WeatherInfo";
import Starter2 from "./components/Form2";
import Starter from "./components/Form1";
import Globe from "./components/globe";
import { AppProvider } from "./context/AppContext";

export default function App() {
  return (
    <AppProvider>
      {/* <Globe />   */}
      <Starter2 />
    </AppProvider>
  );
}
