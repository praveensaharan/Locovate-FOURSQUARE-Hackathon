import WeatherInfo from "./components/WeatherInfo";
import Starter2 from "./components/Form2";
import Starter from "./components/Form1";
import Globe from "./components/globe";
import { AppProvider } from "./context/AppContext";
import IpInfo from "./components/IpLocation";
import Home from "./components/Home";

export default function App() {
  return (
    <AppProvider>
      <Globe />  
      <Home />
      {/* <IpInfo /> */}
      <Starter2 />
    </AppProvider>
  );
}
