import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

mapboxgl.accessToken = 'pk.eyJ1IjoiYmhhbnVkdmsiLCJhIjoiY20wa3YyZGZmMTl0eTJqc2doYXNtejRjZSJ9.XqjfzMT-RJCrwmP_8DFtFw';

// Define GeoJSON types
interface GeoJSONFeature {
  type: 'Feature';
  geometry: {
    type: 'LineString';
    coordinates: [number, number][];
  };
  properties: Record<string, unknown>; // You can add specific properties if needed
}

interface GeoJSONFeatureCollection {
  type: 'FeatureCollection';
  features: GeoJSONFeature[];
}

const Parabolamapchart: React.FC = () => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const map = new mapboxgl.Map({
      container: mapContainerRef.current!,
      style: 'mapbox://styles/mapbox/light-v10',
      center: [0, 0],
      zoom: 1.5,
      pitch: 60,
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

      const routes: GeoJSONFeature[] = [
        createParabolaCurve([-74.005974, 40.712776], [2.352222, 48.856613]),
        createParabolaCurve([139.691711, 35.689487], [-0.127647, 51.507351]),
      ];

      map.addSource('flightRoutes', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: routes,
        } as GeoJSONFeatureCollection,
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

    return () => map.remove();
  }, []);

  const getMidpoint = ([lon1, lat1]: [number, number], [lon2, lat2]: [number, number]): [number, number] => {
    const midpointLon = (lon1 + lon2) / 2;
    const midpointLat = (lat1 + lat2) / 2 + 10; // Adjust the curvature
    return [midpointLon, midpointLat];
  };

  const createParabolaCurve = (start: [number, number], end: [number, number]): GeoJSONFeature => {
    const midpoint = getMidpoint(start, end);
    return {
      type: 'Feature',
      geometry: {
        type: 'LineString',
        coordinates: [start, midpoint, end],
      },
      properties: {}, // Ensure properties are included
    };
  };

  return (
    <div>
      <div ref={mapContainerRef} style={{ width: '100%', height: '100vh' }} />
    </div>
  );
};

export default Parabolamapchart;
