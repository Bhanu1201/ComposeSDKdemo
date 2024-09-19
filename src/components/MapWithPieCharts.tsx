import { useEffect } from 'react';
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

interface FlightStatus {
  totalFlights: number;
  statusCounts: {
    Delayed: number;
    'On Time': number;
    Cancelled: number;
  };
}

const FlightStatusMap = () => {


  const { data } = useExecuteQuery({
    dataSource: AV.DataSource,
    dimensions: [AV.DimLocations.OriginState, AV.Fact.OntimePerformance],
    measures: [measureFactory.sum(AV.Fact.Passengers), measureFactory.count(AV.Fact.FlightNumber)],
    filters: [filterFactory.contains(AV.Fact.OriginState, 'Washington')],
  });

  useEffect(() => {
    const initChart = async () => {
      if (!data || !data.rows) {
        console.warn("No data available for processing.");
        return; // Exit if data is undefined
      }

      const mapData = await fetch('https://code.highcharts.com/mapdata/countries/us/us-all.topo.json').then(response => response.json());

      const processedFlightData: Record<string, FlightStatus> = data.rows.reduce((acc: Record<string, FlightStatus>, row: any) => {
        const state = row[0].data;
        const performance = row[1].data;
        const totalFlights = row[2].data;

        if (!acc[state]) {
          acc[state] = { totalFlights: 0, statusCounts: { Delayed: 0, 'On Time': 0, Cancelled: 0 } };
        }

        acc[state].totalFlights += totalFlights;
        acc[state].statusCounts[performance as keyof FlightStatus['statusCounts']] =
          (acc[state].statusCounts[performance as keyof FlightStatus['statusCounts']] || 0) + totalFlights;

        return acc;
      }, {});



      const mapDataFormatted = Object.keys(processedFlightData).map(stateId => ({
        id: stateId,
        value: processedFlightData[stateId].totalFlights,
      }));



      const mapChart = Highcharts.mapChart('CONTAINER-MAP', {
        chart: { animation: true },
        accessibility: { description: 'Map showing flight status with pies for each state.' },
        colorAxis: {
          dataClasses: [
            { from: 0, to: 1, color: 'rgba(0, 255, 0, 0.3)', name: 'On Time' },
            { from: 2, to: 3, name: 'Delayed', color: 'rgba(240,190,50,0.80)' },
            { from: 4, to: 5, color: 'rgba(244,91,91,0.5)', name: 'Cancelled' },
          ],
        },
        mapNavigation: { enabled: true },
        title: { text: 'US Flight Status', align: 'left' },
        plotOptions: {
          pie: {
            borderColor: 'rgba(246,296,296,0.4)',
            borderWidth: 1,
            dataLabels: { enabled: false },
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
                const stateData = processedFlightData[this.name];
                return `<b>${this.name}</b><br/>
                        Total Flights: ${stateData.totalFlights}<br/>
                        On Time: ${stateData.statusCounts['On Time']}<br/>
                        Delayed: ${stateData.statusCounts.Delayed}<br/>
                        Cancelled: ${stateData.statusCounts.Cancelled}`;
              },
            },
          } as Highcharts.SeriesMapOptions,
          {
            name: 'Connectors',
            type: 'mapline',
            color: 'rgba(130, 130, 130, 0.5)',
            zIndex: 5,
            showInLegend: false,
            enableMouseTracking: false,
            accessibility: { enabled: false },
          },
        ],
      });



      // Add pies after chart load
      if (mapChart) {
        mapChart.series[0].points.forEach((state) => {
          const flightState = processedFlightData[state.name];

          if (flightState) {
            const zoomFactor = (mapChart.mapView?.zoom || 1) / (mapChart.mapView?.zoomBy(0.2) || 1);
            const pieSize = Math.max(
              mapChart.chartWidth / 45 * zoomFactor,
              mapChart.chartWidth / 11 * zoomFactor * flightState.totalFlights / Math.max(...Object.values(processedFlightData).map(d => d.totalFlights))
            );

            mapChart.addSeries({
              type: 'pie',
              name: state.name,
              zIndex: 6,
              minSize: 15,
              visible: true,
              onPoint: {
                id: state.name,
                z: pieSize,
              },
              tooltip: {
                pointFormatter() {
                  const performance = flightState.statusCounts;
                  return `
                          <b>${state.name}</b><br/>
                          Total Flights: ${flightState.totalFlights}<br/>
                          Performance: ${Object.entries(performance).map(([key, value]) => `${key}: ${value}`).join('<br/>')}`;
                },
              },
              data: [
                { name: 'On Time', y: flightState.statusCounts['On Time'] || 0, color: 'rgba(0, 255, 0, 0.8)' },
                { name: 'Delayed', y: flightState.statusCounts['Delayed'] || 0, color: 'rgba(240,190,50,0.80)' },
                { name: 'Cancelled', y: flightState.statusCounts['Cancelled'] || 0, color: 'rgba(244,91,91,0.5)' },
              ],
            }, false);
          } else {
            console.warn(`No flight data for state: ${state.name}`);
          }
        });

        mapChart.redraw();
      }

    };

    initChart();
  }, [data]);

  return (
    <div>
      <div className='rounded-4' id="CONTAINER-MAP" style={{ minWidth: '100%', maxWidth: '800px', height: '400px' }} />
    </div>
  );
};

export default FlightStatusMap;
