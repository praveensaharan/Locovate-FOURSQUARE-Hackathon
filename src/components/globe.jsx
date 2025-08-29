// GlobeComponent.jsx
import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import Globe from 'three-globe';

export default function GlobeComponent() {
  const mountRef = useRef(null);

  useEffect(() => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);

    if (mountRef.current) {
      mountRef.current.appendChild(renderer.domElement);
    }

    // Blue Marble texture from NASA, marker at New York City
    const globe = new Globe()
      .globeImageUrl('https://unpkg.com/three-globe/example/img/earth-blue-marble.jpg')
      .bumpImageUrl('https://unpkg.com/three-globe/example/img/earth-topology.png')
      .pointsData([
        {
          lat: 40.7128,        // latitude; change as needed
          lng: -74.0060,       // longitude; change as needed
          size: 0.5,           // marker height
          color: 'red',        // marker color; customize as needed
        }
      ])
      .pointColor(d => d.color)
      .pointAltitude(d => d.size)
      .pointRadius(0.7);

    scene.add(globe);
    camera.position.z = 400;

    // Animation loop
    let animationId;
    const animate = () => {
      animationId = requestAnimationFrame(animate);
      globe.rotation.y += 0.002;
      renderer.render(scene, camera);
    };
    animate();

    // Responsive resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', handleResize);
      if (
        mountRef.current &&
        renderer.domElement.parentNode === mountRef.current
      ) {
        mountRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return <div ref={mountRef} className="w-full h-screen" />;
}
