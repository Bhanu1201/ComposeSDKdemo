import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import { useExecuteQuery } from '@sisense/sdk-ui';
import * as Dm from '../../sample-test';
import { filterFactory } from '@sisense/sdk-data';

mapboxgl.accessToken = 'pk.eyJ1IjoiYmhhbnVkdmsiLCJhIjoiY20wa3YyZGZmMTl0eTJqc2doYXNtejRjZSJ9.XqjfzMT-RJCrwmP_8DFtFw'; // Update with your Mapbox access token

interface ParabolachartProps {
  selectedLocations: { value: string; label: string }[];
  additionalFilters?: any[]; // Optional additional filters
}

const Parabolachart: React.FC<ParabolachartProps> = ({ selectedLocations, additionalFilters = [] }) => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const [routes, setRoutes] = useState<any[]>([]);

  // Convert selected locations to filter conditions
  const locationValues = Array.from(new Set(selectedLocations.map(location => location.value).filter(value => typeof value === 'string')));
  const pickupLocationFilter = filterFactory.members(Dm.Dim_Pickup_Locations.Pickup_Location, locationValues);

  // Combine location filters with additional filters
  const combinedFilters = [
    pickupLocationFilter,
    ...(additionalFilters || [])
  ];

  const { data } = useExecuteQuery({
    dataSource: Dm.DataSource, // Replace with your actual data source
    dimensions: [
      Dm.Dim_Pickup_Locations.Pickup_Lat,
      Dm.Dim_Pickup_Locations.Pickup_Lon,
      Dm.Dim_Drop_Locations.Drop_Lat,
      Dm.Dim_Drop_Locations.Drop_Lon,
      Dm.Dim_Pickup_Locations.Pickup_Location,
      Dm.Dim_Drop_Locations.Drop_Location
    ],
    filters: combinedFilters // Apply filters based on selectedLocations
  });

  useEffect(() => {
    if (data && data.rows) {
      const features = data.rows.map(row => {
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
        center: [78.9629, 20.5937], // Longitude and latitude of the center of India
        zoom: 5, // Adjust zoom level to focus on India
        pitch: 45,
        antialias: true,
      });

      const popup = new mapboxgl.Popup({
        closeButton: false,
        closeOnClick: false
      });

      map.on('style.load', () => {
        map.on('load', () => {
          // Ensure Threebox is loaded
          if (window.Threebox) {
            const tb = new window.Threebox(map, map.getCanvas().getContext('webgl'), {
              defaultLights: true,
            });

            routes.forEach(route => {
              const [start, end] = route.geometry.coordinates;
              const maxElevation = route.properties.totalFlights * 20000; // Scale height based on totalFlights

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
                color: (route.properties.totalFlights / 150) * 0xefefe, // color based on totalFlights
                width: Math.min(Math.log(route.properties.totalFlights) + 1, 2), // width based on totalFlights
              };

              const lineMesh = tb.line(lineOptions);
              tb.add(lineMesh);

              // Add interaction data to lineMesh
              lineMesh.userData = route.properties;
            });

            map.addLayer({
              id: 'custom_layer',
              type: 'custom',
              renderingMode: '3d',
              onAdd: function() {},
              render: function(gl, matrix) {
                tb.update();
              },
            });

            // Handle mouse events
            map.getCanvas().addEventListener('mousemove', (event) => {
              const rect = map.getCanvas().getBoundingClientRect();
              const x = event.clientX - rect.left;
              const y = event.clientY - rect.top;

              const features = map.queryRenderedFeatures([x, y], { layers: ['custom_layer'] });

              if (features.length > 0) {
                const feature = features[0];
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

      return () => map.remove(); // Clean up map on component unmount
    }
  }, [routes]);

  return (
  <div className='rounded-4' >  <div id="map" className='rounded-4' style={{ width: '100%', height: '70vh', position: 'relative' }} ref={mapContainerRef}></div></div>
  );
};

export default Parabolachart;
