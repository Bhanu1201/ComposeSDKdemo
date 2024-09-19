import { useEffect, useState, useMemo } from 'react';
import Highcharts from 'highcharts';
import HighchartsMap from 'highcharts/modules/map';
import dataModule from 'highcharts/modules/data';
import exportingModule from 'highcharts/modules/exporting';
import offlineExportingModule from 'highcharts/modules/offline-exporting';
import seriesOnPoint from 'highcharts/modules/series-on-point';
import accessibilityModule from 'highcharts/modules/accessibility';
import { useExecuteQuery } from '@sisense/sdk-ui';
import * as AV from '../Aviation';
import { measureFactory } from '@sisense/sdk-data';

// Initialize required modules
HighchartsMap(Highcharts);
dataModule(Highcharts);
exportingModule(Highcharts);
offlineExportingModule(Highcharts);
seriesOnPoint(Highcharts);
accessibilityModule(Highcharts);

// Define types
interface FlightData {
    totalFlights: number;
    statusCounts: {
        Male: number;
        Female: number;
    };
}

interface ProcessedFlightData {
    [key: string]: FlightData;
}

const WorldSalesByGender = () => {
    const [mapData, setMapData] = useState<any[]>([]);
    

    const { data } = useExecuteQuery({
        dataSource: AV.DataSource,
        dimensions: [AV.CountrySales.Country, AV.CountrySales.Category],
        measures: [measureFactory.sum(AV.CountrySales.Sales)],
        filters: []
    });

    // Memoize processed flight data to avoid redundant calculations
    const processedFlightData = useMemo<ProcessedFlightData>(() => {
        if (!data?.rows) return {};
        return data.rows.reduce((acc: ProcessedFlightData, row: any) => {
            const state = row[0].data;
            const performance = row[1].data;
            const totalFlights = row[2].data;

            if (!acc[state]) {
                acc[state] = {
                    totalFlights: 0,
                    statusCounts: { Male: 0, Female: 0 }
                };
            }

            acc[state].totalFlights += totalFlights;
            acc[state].statusCounts[performance] = (acc[state].statusCounts[performance] || 0) + totalFlights;

            return acc;
        }, {} as ProcessedFlightData);
    }, [data]);

    useEffect(() => {
        const initChart = async () => {
            // Fetch and set map data once
            if (mapData.length === 0) {
                const fetchedMapData = await fetch(
                    'https://code.highcharts.com/mapdata/custom/world.topo.json'
                ).then(response => response.json());
                setMapData(fetchedMapData);
            }

            // Prepare formatted data for Highcharts
            const mapDataFormatted = Object.keys(processedFlightData).map(stateId => {
                const { totalFlights } = processedFlightData[stateId];
                return {
                    id: stateId,
                    value: totalFlights
                };
            });

            const mapChart = Highcharts.mapChart('container', {
                chart: {
                    animation: true,
                },
                accessibility: {
                    description: 'Map showing flight status with pies for each state.',
                },
                colorAxis: {
                    dataClasses: [
                        { from: 0, to: 1, color: 'rgb(0, 255, 0, 0.3)', name: 'Male' },
                        { from: 2, to: 3, name: 'Female', color: 'rgba(240,190,50,0.80)' },
                    ],
                },
                mapNavigation: {
                    enabled: true,
                },
                title: {
                    text: 'US Flight Status',
                    align: 'left',
                },
                plotOptions: {
                    pie: {
                        borderColor: 'rgba(246,296,296,0.4)',
                        borderWidth: 1,
                        dataLabels: {
                            enabled: false,
                        },
                    },
                },
                series: [
                    {
                        type:'map',
                        mapData: mapData,
                        data: mapDataFormatted,
                        name: 'States',
                        joinBy: ['name', 'id'],
                        keys: ['id', 'value'],
                        borderColor: '#FFF',
                        tooltip: {
                            pointFormatter: function () {
                                const stateData = processedFlightData[this.name];
                                if (!stateData) return 'No data available';
                                return `<b>${this.name}</b><br/>
                                    Total Flights: ${stateData.totalFlights}<br/>
                                    Male: ${stateData.statusCounts.Male}<br/>
                                    Female: ${stateData.statusCounts.Female}`;
                            },
                        },
                    },
                    {
                        name: 'Connectors',
                        type: 'mapline',
                        color: 'rgba(130, 130, 130, 0.5)',
                        zIndex: 5,
                        showInLegend: false,
                        enableMouseTracking: false,
                        accessibility: {
                            enabled: false,
                        },
                    },
                ],
            });

            // Add pies after chart load
            if (mapChart) {
                mapChart.series[0].points.forEach((state) => {
                    const flightState = processedFlightData[state.name];

                    if (flightState) {
                        mapChart.addSeries({
                            type: 'pie',
                            name: state.name,
                            zIndex: 6,
                            minSize: 8,
                            visible: true,
                            onPoint: {
                                id: state.name,
                                z: (() => {
                                    const zoomFactor = mapChart.mapView.zoom / mapChart.mapView.minZoom;
                                    return Math.max(
                                        mapChart.chartWidth / 25 * zoomFactor,
                                        mapChart.chartWidth / 9 * zoomFactor * flightState.totalFlights / Math.max(...Object.values(processedFlightData).map(d => d.totalFlights))
                                    );
                                })(),
                            },
                            tooltip: {
                                pointFormatter() {
                                    const performance = flightState.statusCounts;
                                    return `
                                        <b>${state.name}</b><br/>
                                        Total Flights: ${flightState.totalFlights}<br/>
                                        Performance: ${Object.entries(performance).map(([key, value]) => `${key}: ${value}`).join('<br/>')}
                                    `;
                                },
                            },
                            data: [
                                { name: 'Male', y: flightState.statusCounts['Male'] || 0, color: 'rgb(0, 255, 0, 0.8)' },
                                { name: 'Female', y: flightState.statusCounts['Female'] || 0, color: 'rgba(240,190,50,0.80)' }
                            ],
                        }, false);
                    }
                });

                mapChart.redraw();
            }
        };

        initChart();
    }, [processedFlightData, mapData]);

    return (
        <div>
            <div id="pie" style={{ minWidth: '100%', maxWidth: '100%', height: '400px', padding: '2px', marginTop: '12px', borderRadius: '25px' }} />
        </div>
    );
};

export default WorldSalesByGender;
