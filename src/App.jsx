import WeatherInfo from "./components/WeatherInfo";
import Starter2 from "./components/Form2";
import Starter from "./components/Form1";
import Globe from "./components/globe";
import { AppProvider } from "./context/AppContext";
import Location from "./components/location";
import IpInfo from "./components/IpLocation";
import Home from "./components/Home";
import Footer from "./components/Footer";
import FloatingMoods from "./components/FloatingMood";
import Maps from "./components/maps2";

export default function App() {
  return (
    <AppProvider>
      {/* <Maps /> */}

      <Globe />  
      <Home />
      <Starter2 />
      <Footer />
      {/* <Location /> */}
    </AppProvider>
  );
}
