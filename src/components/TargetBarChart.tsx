import React, { useEffect } from 'react';
import Highcharts from 'highcharts';
import { useExecuteQuery } from '@sisense/sdk-ui';
import * as DM from '../sample-test';
import { filterFactory, measureFactory } from '@sisense/sdk-data';

const TargetBarChart: React.FC = () => {
  const { data, isLoading, isError } = useExecuteQuery({ dataSource: DM.DataSource, dimensions: [DM.Fact_Logistics.ShipmentType, DM.Fact_Logistics.Status], measures: [measureFactory.count(DM.Fact_Logistics.ROWID)],  filters: [filterFactory.contains(DM.Dim_Drop_Locations.Drop_Location, 'Chennai')]});

  console.log("data", data);

  useEffect(() => {
    if (!isLoading && !isError && data) {
      const categories = [...new Set(data.rows.map(row => row[0].data))];

      const shipmentStatusData = {};
      categories.forEach((category) => {
        shipmentStatusData[category] = { Cancelled: 0, Delivered: 0, Pending: 0, Shipped: 0 };
      });

      data.rows.forEach(row => {
        const shipmentType = row[0].data;
        const status = row[1].data;
        const count = row[2].data;
        shipmentStatusData[shipmentType][status] = count;
      });

      const cancelledShipments = categories.map(category => shipmentStatusData[category].Cancelled || 0);
      const deliveredShipments = categories.map(category => shipmentStatusData[category].Delivered || 0);
      const pendingShipments = categories.map(category => shipmentStatusData[category].Pending || 0);
      const shippedShipments = categories.map(category => shipmentStatusData[category].Shipped || 0);

      Highcharts.chart('target', {
        chart: {
          type: 'column',
        },
        title: {
          text: 'Shipment Status Comparison',
        },
        xAxis: {
          categories,
        },
        yAxis: [{
          min: 0,
          title: {
            text: 'Number of Shipments',
          },
        }],
        legend: {
          shadow: false,
        },
        tooltip: {
          shared: true,
          valueSuffix: ' Shipments',
        },
        plotOptions: {
          column: {
            grouping: false, // Enable grouping for better spacing
            shadow: false,
            borderWidth: 0,
          },
        },
        series: [

          {
            name: 'Pending',
            color: 'rgba(0,0,0,0.2)',
            data: pendingShipments,
            pointPlacement: -0.2,
            pointPadding: 0.3,

          },
          {
            name: 'Shipped',
            color: 'rgba(68,119,206,0.8)',
            data: shippedShipments,
            pointPlacement: -0.2,
            pointPadding: 0.4,

          },
        ],
      });
    }
  }, [data, isLoading, isError]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error loading data</div>;
  }

  return <div id="target" className='rounded-4' style={{ width: '100%', height: '400px' }}></div>;
};

export default TargetBarChart;
