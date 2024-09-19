import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

mapboxgl.accessToken = 'pk.eyJ1IjoiYmhhbnVkdmsiLCJhIjoiY20wa3YyZGZmMTl0eTJqc2doYXNtejRjZSJ9.XqjfzMT-RJCrwmP_8DFtFw';

const Parabolamapchart: React.FC = () => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const map = new mapboxgl.Map({
      container: mapContainerRef.current!,
      style: 'mapbox://styles/mapbox/light-v10',
      center: [0, 0],
      zoom: 1.5,
      pitch: 60, // for 3D effect
      bearing: 0,
      antialias: true,
    });

    map.on('load', () => {
      map.addLayer({
        id: 'sky',
        type: 'sky',
        paint: {
          'sky-type': 'atmosphere',
          'sky-atmosphere-sun-intensity': 15,
        },
      });

      // Example flight routes
      const routes = [
        createParabolaCurve([-74.005974, 40.712776], [2.352222, 48.856613]), // NYC to Paris
        createParabolaCurve([139.691711, 35.689487], [-0.127647, 51.507351]),  // Tokyo to London
      ];

      map.addSource('flightRoutes', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: routes,
        },
      });

      map.addLayer({
        id: 'routes',
        type: 'line',
        source: 'flightRoutes',
        paint: {
          'line-color': '#ff5500',
          'line-width': 2,
        },
      });
    });

    // Cleanup on unmount
    return () => map.remove();
  }, []);

  // Function to calculate midpoint for parabolic curves
  const getMidpoint = ([lon1, lat1]: [number, number], [lon2, lat2]: [number, number]): [number, number] => {
    const midpointLon = (lon1 + lon2) / 2;
    const midpointLat = (lat1 + lat2) / 2 + 10; // Adjust the curvature by modifying this value
    return [midpointLon, midpointLat];
  };

  // Function to create a parabola curve between two points
  const createParabolaCurve = (start: [number, number], end: [number, number]) => {
    const midpoint = getMidpoint(start, end);
    return {
      type: 'Feature',
      geometry: {
        type: 'LineString',
        coordinates: [start, midpoint, end],
      },
    };
  };

  return (
    <div>
      <div ref={mapContainerRef} style={{ width: '100%', height: '100vh' }} />
    </div>
  );
};

export default Parabolamapchart;
