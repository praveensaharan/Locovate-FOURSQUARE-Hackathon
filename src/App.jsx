import Starter2 from "./components/Form2";
import Globe from "./components/globe";
import { AppProvider } from "./context/AppContext";
import Home from "./components/Home";
import Footer from "./components/Footer";

export default function App() {
  return (
    <AppProvider>
      <Globe />  
      <Home />
      <Starter2 />
      <Footer />
    </AppProvider>
  );
}
