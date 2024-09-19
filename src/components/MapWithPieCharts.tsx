import { useEffect, useState } from 'react';
import Highcharts from 'highcharts';
import HighchartsMap from 'highcharts/modules/map';
import dataModule from 'highcharts/modules/data';
import exportingModule from 'highcharts/modules/exporting';
import offlineExportingModule from 'highcharts/modules/offline-exporting';
import seriesOnPoint from 'highcharts/modules/series-on-point';
import accessibilityModule from 'highcharts/modules/accessibility';
import { useExecuteQuery } from '@sisense/sdk-ui';
import * as AV from '../Aviation';
import { filterFactory, measureFactory } from '@sisense/sdk-data';

// Initialize required modules
HighchartsMap(Highcharts);
dataModule(Highcharts);
exportingModule(Highcharts);
offlineExportingModule(Highcharts);
seriesOnPoint(Highcharts);
accessibilityModule(Highcharts);

const FlightStatusMap = () => {
  const [mapData, setMapData] = useState([]);
  const [flightData, setFlightData] = useState([]);
  const [flightStatusCounts, setFlightStatusCounts] = useState({});
  const [chart, setChart] = useState(null);

  const { data } = useExecuteQuery({
    dataSource: AV.DataSource,
    dimensions: [AV.DimLocations.OriginState, AV.Fact.OntimePerformance],
    measures: [measureFactory.sum(AV.Fact.Passengers), measureFactory.count(AV.Fact.FlightNumber)],
    filters: [
      filterFactory.contains(AV.Fact.OriginState, 'Washington'),

    ]
  });

  useEffect(() => {
    const initChart = async () => {
      // Fetch map data
      const mapData = await fetch(
        'https://code.highcharts.com/mapdata/countries/us/us-all.topo.json'
      ).then(response => response.json());

      // Process and aggregate flight data
      const processedFlightData = data.rows.reduce((acc, row) => {
        const state = row[0].data;
        const performance = row[1].data;
        const totalFlights = row[2].data;

        if (!acc[state]) {
          acc[state] = {
            totalFlights: 0,
            statusCounts: { Delayed: 0, OnTime: 0, Cancelled: 0 }
          };
        }

        acc[state].totalFlights += totalFlights;
        acc[state].statusCounts[performance] = (acc[state].statusCounts[performance] || 0) + totalFlights;

        return acc;
      }, {});

      // Log the processed flight data


      // Extract flight status counts and total flights for Texas
      const texasData = processedFlightData['Texas'] || {
        totalFlights: 0,
        statusCounts: { Delayed: 0, OnTime: 0, Cancelled: 0 }
      };

      // Log the flight status counts for Texas


      setFlightData(processedFlightData);
      setFlightStatusCounts(texasData.statusCounts);

      const mapDataFormatted = Object.keys(processedFlightData).map(stateId => {
        const { totalFlights } = processedFlightData[stateId];
        return {
          id: stateId,
          value: totalFlights
        };
      });

      setMapData(mapData);


      const mapChart = Highcharts.mapChart('CONTAINER-MAP', {
        chart: {
          animation: true,
        },
        accessibility: {
          description: 'Map showing flight status with pies for each state.',
        },
        colorAxis: {
          dataClasses: [
            { from: 0, to: 1, color: '	rgb(0, 255, 0, 0.3)', name: 'On Time' },
            { from: 2, to: 3, name: 'Delayed', color: 'rgba(240,190,50,0.80)' },
            { from: 4, to: 5, color: 'rgba(244,91,91,0.5)', name: 'Cancelled' },
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
            mapData,
            data: mapDataFormatted,
            name: 'States',
            joinBy: ['name', 'id'],
            keys: ['id', 'value'],
            borderColor: '#FFF',
            tooltip: {
              pointFormatter: function () {
                const stateData = processedFlightData[this.id];
                return `<b>${this.id}</b><br/>
                        Total Flights: ${stateData.totalFlights}<br/>
                        On Time: ${stateData.statusCounts.OnTime}<br/>
                        Delayed: ${stateData.statusCounts.Delayed}<br/>
                        Cancelled: ${stateData.statusCounts.Cancelled}`;
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

      setChart(mapChart);

      // Add pies after chart load
      if (mapChart) {
        mapChart.series[0].points.forEach((state) => {
          const flightState = processedFlightData[state.id];

          if (flightState) {
            mapChart.addSeries({
              type: 'pie',
              name: state.name,
              zIndex: 6,
              minSize: 15,
              maxSize: 55,
              visible: true,
              onPoint: {
                id: state.id,
                z: (() => {
                  const zoomFactor = mapChart.mapView.zoom / mapChart.mapView.minZoom;
                  return Math.max(
                    mapChart.chartWidth / 45 * zoomFactor,
                    mapChart.chartWidth / 11 * zoomFactor * flightState.totalFlights / Math.max(...Object.values(processedFlightData).map(d => d.totalFlights))
                  );
                })(),
              },
              tooltip: {
                pointFormatter() {
                  const performance = flightState.statusCounts;
                  return `
                    <b>${state.id}</b><br/>
                    Total Flights: ${flightState.totalFlights}<br/>
                    Performance: ${Object.entries(performance).map(([key, value]) => `${key}: ${value}`).join('<br/>')}
                  `;
                },
              },
              data: [
                { name: 'On Time', y: flightState.statusCounts['On Time'] || 0, color: '	rgb(0, 255, 0, 0.8)' },
                { name: 'Delayed', y: flightState.statusCounts['Delayed'] || 0, color: 'rgba(240,190,50,0.80)' },
                { name: 'Cancelled', y: flightState.statusCounts['Cancelled'] || 0, color: 'rgba(244,91,91,0.5)' },
              ],
            }, false);
          } else {
            console.warn(`No flight data for state: ${state.id}`);
          }
        });

        mapChart.redraw();
      }
    };

    initChart();
  }, [data]);

  return (
    <div className=''>
      <div className='rounded-4' id="CONTAINER-MAP" style={{ minWidth: '100%', maxWidth: '800px', height: '400px'}} />
    </div>
  );
};

export default FlightStatusMap;
