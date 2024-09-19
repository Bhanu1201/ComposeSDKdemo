import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

const FirstmapChart = () => {
    const mapContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        mapboxgl.accessToken = 'pk.eyJ1IjoiYmhhbnVkdmsiLCJhIjoiY20wa3YyZGZmMTl0eTJqc2doYXNtejRjZSJ9.XqjfzMT-RJCrwmP_8DFtFw';
        const map = new mapboxgl.Map({
            container: mapContainerRef.current!,
            style: 'mapbox://styles/mapbox/outdoors-v11',  // Use a style with 3D terrain
            projection: 'mercator',
            zoom: 2,
            center: [30, 15]
        });

        map.addControl(new mapboxgl.NavigationControl());
        map.scrollZoom.disable();

        // Function to generate a parabolic 3D path
        const create3DPath = (
            start: [number, number], 
            end: [number, number], 
            height: number = 50000, 
            segments: number = 50
        ): [number, number][] => {
            const path: [number, number][] = [];
            const midLat = (start[1] + end[1]) / 2;
            const midLng = (start[0] + end[0]) / 2;
            
            for (let i = 0; i <= segments; i++) {
                const t = i / segments;
                const lon = start[0] * (1 - t) + end[0] * t;
                const lat = start[1] * (1 - t) + end[1] * t;
                const altitude = height * Math.sin(Math.PI * t) * 0.01;  // Adjust the height scaling
                path.push([lon, lat]);
            }

            return path;
        };

        // Sample flight paths data
        const flightPaths = {
            "type": "FeatureCollection",
            "features": [
                {
                    "type": "Feature",
                    "geometry": {
                        "type": "LineString",
                        "coordinates": create3DPath(
                            [-74.006, 40.7128],  // New York
                            [2.3522, 48.8566]   // Paris
                        )
                    },
                    "properties": {
                        "from": "New York",
                        "to": "Paris"
                    }
                },
                {
                    "type": "Feature",
                    "geometry": {
                        "type": "LineString",
                        "coordinates": create3DPath(
                            [103.8198, 1.3521],   // Singapore
                            [139.6917, 35.6895]  // Tokyo
                        )
                    },
                    "properties": {
                        "from": "Singapore",
                        "to": "Tokyo"
                    }
                }
            ]
        };

        map.on('load', () => {
            map.addSource('flightPaths', {
                "type": "geojson",
                "data": flightPaths
            });

            map.addLayer({
                "id": "flightPathsLayer",
                "type": "line",
                "source": "flightPaths",
                "layout": {
                    "line-join": "round",
                    "line-cap": "round"
                },
                "paint": {
                    "line-color": "#ff0000",  // Bright red for visibility
                    "line-width": {
                        "base": 1,
                        "stops": [
                            [5, 2],
                            [10, 4]
                        ]
                    },
                    "line-opacity": 0.8
                }
            });

            // Add hover interaction
            map.on('mousemove', 'flightPathsLayer', (e) => {
                map.getCanvas().style.cursor = 'pointer';
                
                const coordinates = e.features[0].geometry.coordinates.slice();
                const description = `From: ${e.features[0].properties.from} To: ${e.features[0].properties.to}`;
                
                while (Math.abs(e.lngLat.lng - coordinates[0][0]) > 180) {
                    coordinates[0][0] += e.lngLat.lng > coordinates[0][0] ? 360 : -360;
                }
                
                new mapboxgl.Popup()
                    .setLngLat(e.lngLat)
                    .setHTML(description)
                    .addTo(map);
            });

            map.on('mouseleave', 'flightPathsLayer', () => {
                map.getCanvas().style.cursor = '';
            });
        });

        return () => map.remove();
    }, []);

    return (
        <div
            ref={mapContainerRef}
            style={{
                position: 'absolute',
                top: 0,
                bottom: 0,
                width: '100%',
            }}
        />
    );
};

export default FirstmapChart;
