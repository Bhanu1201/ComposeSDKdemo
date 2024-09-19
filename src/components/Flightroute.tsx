import React, { useEffect, useState, useMemo } from 'react';
import Highcharts from 'highcharts';
import HighchartsMap from 'highcharts/modules/map';
import HighchartsFlowmap from 'highcharts/modules/flowmap';
import HighchartsExporting from 'highcharts/modules/exporting';
import HighchartsOfflineExporting from 'highcharts/modules/offline-exporting';
import HighchartsAccessibility from 'highcharts/modules/accessibility';
import { useExecuteQuery } from '@sisense/sdk-ui';
import * as Dm from '../sample-test';
import { filterFactory } from '@sisense/sdk-data';

// Initialize Highcharts modules
HighchartsMap(Highcharts);
HighchartsFlowmap(Highcharts);
HighchartsExporting(Highcharts);
HighchartsOfflineExporting(Highcharts);
HighchartsAccessibility(Highcharts);

interface TestProps {
    selectedLocations: { value: string; label: string }[];
    additionalFilters?: any[]; // Optional additional filters
}

const FlightRoute: React.FC<TestProps> = ({ selectedLocations, additionalFilters = [] }) => {
    const [mapData, setMapData] = useState<{ pickupLocations: any[], dropLocations: any[], flowData: any[] } | null>(null);
    const [topology, setTopology] = useState(null);

    // Ensure location values are in string format and unique
    const locationValues = useMemo(() => 
        Array.from(new Set(selectedLocations.map(location => location.value).filter(value => typeof value === 'string')))
    , [selectedLocations]);

    // Convert selected locations to filter conditions
    const pickupLocationFilter = useMemo(() => filterFactory.members(Dm.Dim_Pickup_Locations.Pickup_Location, locationValues), [locationValues]);

    // Combine location filters with additional filters
    const combinedFilters = useMemo(() => [pickupLocationFilter, ...(additionalFilters || [])], [pickupLocationFilter, additionalFilters]);

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
        filters: combinedFilters // Apply only pickup location filters
    });

    useEffect(() => {
        if (data) {
            console.log("Filtered Data:", data.rows);

            // Transform data into Highcharts-compatible format
            const pickupLocations = data.rows.map(row => ({
                id: `pickup-${row[4].text}`,  // Unique ID for pickup locations
                lat: row[0].data,
                lon: row[1].data,
                name: row[4].text // Location name
            }));

            const dropLocations = data.rows.map(row => ({
                id: `drop-${row[5].text}`,  // Unique ID for drop locations
                lat: row[2].data,
                lon: row[3].data,
                name: row[5].text // Location name
            }));

            // Generate flow data for all drop locations from selected pickup locations
            const flowData = pickupLocations.flatMap(pickup => 
                dropLocations.map(drop => [
                    pickup.id, // 'from' location
                    drop.id    // 'to' location
                ])
            );

            setMapData({
                pickupLocations,
                dropLocations,
                flowData
            });
        }
    }, [data]);

    useEffect(() => {
        const fetchTopology = async () => {
            const response = await fetch('https://code.highcharts.com/mapdata/countries/in/in-all.topo.json');
            const topology = await response.json();
            setTopology(topology);
        };

        fetchTopology();
    }, []);

    useEffect(() => {
        if (topology && mapData) {
            Highcharts.mapChart('test-map', {
                chart: {
                    map: topology
                },
                title: {
                    text: 'Pickup and Drop Locations in India',
                    align: 'left'
                },
                mapNavigation: {
                    enabled: true
                },
                mapView: {
                    fitToGeometry: {
                        type: 'MultiPoint',
                        coordinates:[
                            [85.08, 26.61], // Example coordinates for Delhi
                            [60.27, 13.08], // Example coordinates for Chennai
                            [70.84, 18.52], // Example coordinates for Mumbai
                            [98.36, 22.57]
                        ]
                    }
                },
                accessibility: {
                    point: {
                        valueDescriptionFormat: '{xDescription}.'
                    }
                },
                plotOptions: {
                    flowmap: {
                        tooltip: {
                            headerFormat: null,
                            pointFormat: `{point.options.from} \u2192 {point.options.to}`
                        }
                    },
                    mappoint: {
                        tooltip: {
                            headerFormat: '{point.point.id}<br>',
                            pointFormat: 'Location: {point.name}'
                        },
                        showInLegend: false
                    }
                },
                series: [{
                    name: 'Basemap',
                    showInLegend: false,
                    states: {
                        inactive: {
                            enabled: false
                        }
                    },
                    data: [
                        ['in', 1]
                    ]
                }, {
                    type: 'mappoint',
                    name: 'Pickup Locations',
                    color: '#add8e6',
                    dataLabels: {
                        format: '{point.id}'
                    },
                    data: mapData.pickupLocations
                }, {
                    type: 'mappoint',
                    name: 'Drop Locations',
                    color: '#ff6347',
                    dataLabels: {
                        format: '{point.id}'
                    },
                    data: mapData.dropLocations
                }, {
                    type: 'flowmap',
                    name: 'Flowmap Series',
                    fillOpacity: 1,
                    width: 0.2,
                    color: '#550d6566',
                    data: mapData.flowData
                }]
            });
        }
    }, [topology, mapData]);

    return <div id="test-map" style={{ height: '600px', width: '100%', margin: '0 auto' }}></div>;
};

export default FlightRoute;
