import React from 'react';
import Highcharts from 'highcharts';
import Highcharts3D from 'highcharts/highcharts-3d';
import HighchartsReact from 'highcharts-react-official';
import styles from '../../Style/DonutChart.module.css';
import { useExecuteQuery } from '@sisense/sdk-ui';
import * as SM from '../../sample-ecommerce';
import { measureFactory } from '@sisense/sdk-data';

// Initialize the 3D module
Highcharts3D(Highcharts);

const DonutChart: React.FC = () => {
    // Execute the query to fetch data
    const { data } = useExecuteQuery({
        dataSource: SM.DataSource,
        dimensions: [SM.Category.Category],
        measures: [measureFactory.sum(SM.Commerce.Revenue)],
    });

    // Transform the data into the format required by Highcharts
    const chartData = data?.rows.map((row: any) => [
        row[0].text, // Category
        row[1].data // Value
    ]) || [];

    const options: Highcharts.Options = {
        chart: {
            type: 'pie', // Type is set here
            options3d: {
                enabled: true,
                alpha: 45
            }
        },
        title: {
            text: 'Revenue by Category',
            align: 'left'
        },
        subtitle: {
            text: '3D donut chart with dynamic data',
            align: 'left'
        },
        plotOptions: {
            pie: {
                innerSize: 100,
                depth: 45,
                dataLabels: {
                    enabled: true,
                    format: '{point.name}: {point.y:.1f}%'
                }
            }
        },
        series: [{
            type: 'pie', // Specify type for the series
            name: 'Revenue',
            data: chartData
        }]
    };

    return (
        <div className="">
            <figure className={styles.highchartsFigure}>
                <div className="rounded-4 w-100">
                    <HighchartsReact
                        highcharts={Highcharts}
                        options={options}
                    />
                </div>
            </figure>
        </div>
    );
};

export default DonutChart;
