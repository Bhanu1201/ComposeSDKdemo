import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import { useExecuteQuery } from '@sisense/sdk-ui';
import * as Dm from '../../sample-test';
import { filterFactory } from '@sisense/sdk-data';

mapboxgl.accessToken = 'pk.eyJ1IjoiYmhhbnVkdmsiLCJhIjoiY20wa3YyZGZmMTl0eTJqc2doYXNtejRjZSJ9.XqjfzMT-RJCrwmP_8DFtFw';

interface ParabolachartProps {
  selectedLocations: { value: string; label: string }[];
  additionalFilters?: any[]; // Optional additional filters
}

interface RouteFeature {
  type: 'Feature';
  geometry: {
    type: 'LineString';
    coordinates: [number, number][];
  };
  properties: {
    from: string;
    to: string;
    totalFlights: number;
  };
}

declare global {
  interface Window {
    Threebox: any; // Declare Threebox on the window object
  }
}

const Parabolachart: React.FC<ParabolachartProps> = ({ selectedLocations, additionalFilters = [] }) => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const [routes, setRoutes] = useState<RouteFeature[]>([]);

  const locationValues = Array.from(new Set(selectedLocations.map(location => location.value).filter(value => typeof value === 'string')));
  const pickupLocationFilter = filterFactory.members(Dm.Dim_Pickup_Locations.Pickup_Location, locationValues);
  
  const combinedFilters = [
    pickupLocationFilter,
    ...(additionalFilters || [])
  ];

  const { data } = useExecuteQuery({
    dataSource: Dm.DataSource,
    dimensions: [
      Dm.Dim_Pickup_Locations.Pickup_Lat,
      Dm.Dim_Pickup_Locations.Pickup_Lon,
      Dm.Dim_Drop_Locations.Drop_Lat,
      Dm.Dim_Drop_Locations.Drop_Lon,
      Dm.Dim_Pickup_Locations.Pickup_Location,
      Dm.Dim_Drop_Locations.Drop_Location
    ],
    filters: combinedFilters
  });

  useEffect(() => {
    if (data && data.rows) {
      const features: RouteFeature[] = data.rows.map(row => {
        const pickupLat = row[0].data;
        const pickupLon = row[1].data;
        const dropLat = row[2].data;
        const dropLon = row[3].data;
        const from = row[4].data;
        const to = row[5].data;

        return {
          type: 'Feature',
          geometry: {
            type: 'LineString',
            coordinates: [
              [pickupLon, pickupLat],
              [dropLon, dropLat]
            ]
          },
          properties: {
            from,
            to,
            totalFlights: 100 // Modify this or get it from your data
          }
        };
      });

      setRoutes(features);
    }
  }, [data]);

  useEffect(() => {
    if (mapContainerRef.current) {
      const map = new mapboxgl.Map({
        container: mapContainerRef.current,
        style: 'mapbox://styles/mapbox/dark-v9',
        center: [78.9629, 20.5937],
        zoom: 5,
        pitch: 45,
        antialias: true,
      });

      const popup = new mapboxgl.Popup({
        closeButton: false,
        closeOnClick: false
      });

      map.on('style.load', () => {
        map.on('load', () => {
          if (window.Threebox) {
            const tb = new window.Threebox(map, map.getCanvas().getContext('webgl'), {
              defaultLights: true,
            });

            routes.forEach(route => {
              const [start, end] = route.geometry.coordinates;
              const maxElevation = route.properties.totalFlights * 20000;

              const line = [];
              const arcSegments = 20;
              const increment = start.map((s, i) => (end[i] - s) / arcSegments);

              for (let l = 0; l <= arcSegments; l++) {
                const waypoint = start.map((s, i) => s + increment[i] * l);
                const waypointElevation = Math.sin(Math.PI * l / arcSegments) * maxElevation;
                waypoint.push(waypointElevation);
                line.push(waypoint);
              }

              const lineOptions = {
                geometry: line,
                color: (route.properties.totalFlights / 150) * 0xefefe,
                width: Math.min(Math.log(route.properties.totalFlights) + 1, 2),
              };

              const lineMesh = tb.line(lineOptions);
              tb.add(lineMesh);
              lineMesh.userData = route.properties; // Ensure userData is correctly set
            });

            map.addLayer({
              id: 'custom_layer',
              type: 'custom',
              renderingMode: '3d',
              onAdd: function() {},
              render: function() {
                tb.update();
              },
            });

            map.getCanvas().addEventListener('mousemove', (event) => {
              const rect = map.getCanvas().getBoundingClientRect();
              const x = event.clientX - rect.left;
              const y = event.clientY - rect.top;

              const features = map.queryRenderedFeatures([x, y], { layers: ['custom_layer'] });

              if (features.length > 0) {
                const feature = features[0] as any; // Cast to 'any' to access userData
                const properties = feature.userData;

                popup.setLngLat([feature.geometry.coordinates[0], feature.geometry.coordinates[1]])
                  .setHTML(
                    `<strong>From:</strong> ${properties.from}<br>
                     <strong>To:</strong> ${properties.to}<br>
                     <strong>Total Flights:</strong> ${properties.totalFlights}`
                  )
                  .addTo(map);
              } else {
                popup.remove();
              }
            });

            map.getCanvas().addEventListener('mouseleave', () => {
              popup.remove();
            });
          } else {
            console.error('Threebox is not available on the window object');
          }
        });
      });

      return () => map.remove();
    }
  }, [routes]);

  return (
    <div className='rounded-4'>
      <div id="map" className='rounded-4' style={{ width: '100%', height: '70vh', position: 'relative' }} ref={mapContainerRef}></div>
    </div>
  );
};

export default Parabolachart;
