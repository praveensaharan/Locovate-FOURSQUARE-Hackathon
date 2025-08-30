import React, { useRef, useEffect, useState } from "react";
import Globe from "react-globe.gl";
import { useAppContext } from "../context/AppContext";

function MyGlobeComponent() {
  const { coords } = useAppContext();
  const globeEl = useRef();
  const [location, setLocation] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const [dimensions, setDimensions] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    // Load Google font
    const link = document.createElement("link");
    link.href = "https://fonts.googleapis.com/css2?family=Doto:wght@900&display=swap";
    link.rel = "stylesheet";
    document.head.appendChild(link);
    const handleResize = () => {
      setIsMobile(window.innerWidth < 640); 
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

useEffect(() => {
  if (coords.lat && coords.lon) {
    setLocation({ lat: coords.lat, lng: coords.lon });
  }
}, [coords]);


  useEffect(() => {
    if (globeEl.current && location) {
      globeEl.current.pointOfView(
        { lat: location.lat, lng: location.lng + 10, altitude: isMobile ? 2.5 : 1.8 },
        3000
      );

      // disable controls
      const controls = globeEl.current.controls();
      controls.enableZoom = false;
      controls.enableRotate = false;
      controls.enablePan = false;
    }
  }, [location, isMobile]);

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        fontFamily: "'Doto', sans-serif",
        color: "darkblue",
        zIndex: 0,
        pointerEvents: "none",
        overflow: "hidden", // ensures no scrollbars
      }}
    >
      <div className="absolute top-4 left-4 z-30 pointer-events-auto opacity-70">
        <img src="/PNG-favicon.png" alt="Logo" className="w-16 h-16 object-contain" />
      </div>

      {location && (
        <Globe
          ref={globeEl}
          globeImageUrl="https://unpkg.com/three-globe/example/img/earth-night.jpg"
          bumpImageUrl="https://unpkg.com/three-globe/example/img/earth-topology.png"
          showGraticules={true}
          showAtmosphere={true}
          pointsData={[
            { lat: location.lat, lng: location.lng, size: isMobile ? 0.005 : 0.01, color: "white" },
          ]}
          pointAltitude="size"
          pointColor="color"
          labelsData={[
            {
              lat: location.lat,
              lng: location.lng,
              text: `${location.lat.toFixed(2)}, ${location.lng.toFixed(2)}`,
            },
          ]}
          labelLat="lat"
          labelLng="lng"
          labelText="text"
          labelSize={isMobile ? 0.5 : 0.8}
          labelDotRadius={isMobile ? 0.05 : 0.1}
          labelColor={() => "skyblue"}
          labelResolution={8}
          width={dimensions.width}
          height={dimensions.height}
        />
      )}
    </div>
  );
}

export default MyGlobeComponent;
