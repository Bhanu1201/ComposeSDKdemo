import React, { useEffect, useRef } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import HighchartsMore from 'highcharts/highcharts-more';

// Initialize HighchartsMore
HighchartsMore(Highcharts);

const HighGaugeChart: React.FC = () => {
    const chartRef = useRef<HighchartsReact.RefObject>(null);

    useEffect(() => {
        const interval = setInterval(() => {
            const chart = chartRef.current?.chart;
            if (chart && !chart.renderer.forExport) {
                const point = chart.series[0].points[0];
                if (point && point.y !== undefined) { // Check if point and point.y are defined
                    const inc = Math.round((Math.random() - 0.5) * 20);

                    let newVal = point.y + inc;
                    if (newVal < 0 || newVal > 200) {
                        newVal = point.y - inc;
                    }

                    point.update(newVal);
                }
            }
        }, 3000);

        return () => clearInterval(interval);
    }, []);

    const options: Highcharts.Options = {
        chart: {
            type: 'gauge',
            plotBackgroundColor: '',
            plotBackgroundImage: '',
            plotBorderWidth: 0,
            plotShadow: false,
            height: '68%',
        },
        title: {
            text: 'Speedometer',
        },
        pane: {
            startAngle: -90,
            endAngle: 89.9,
            background: [], // Set as an empty array
            center: ['50%', '75%'],
            size: '110%',
        },
        yAxis: {
            min: 0,
            max: 200,
            tickPixelInterval: 72,
            tickPosition: 'inside',
            tickColor: Highcharts.defaultOptions.chart?.backgroundColor || '#FFFFFF',
            tickLength: 20,
            tickWidth: 2,
            minorTickInterval: undefined, // Set to undefined
            labels: {
                distance: 20,
                style: {
                    fontSize: '14px',
                },
            },
            lineWidth: 0,
            plotBands: [{
                from: 0,
                to: 130,
                color: '#55BF3B', // green
                thickness: 20,
                borderRadius: '50%',
            }, {
                from: 150,
                to: 200,
                color: '#DF5353', // red
                thickness: 20,
                borderRadius: '50%',
            }, {
                from: 120,
                to: 160,
                color: '#DDDF0D', // yellow
                thickness: 20,
            }],
        },
        series: [{
            type: 'gauge', // Specify the type
            name: 'Speed',
            data: [80],
            tooltip: {
                valueSuffix: ' km/h',
            },
            dataLabels: {
                format: '{y} km/h',
                borderWidth: 0,
                color: Highcharts.defaultOptions.title?.style?.color || '#333333',
                style: {
                    fontSize: '16px',
                },
            },
            dial: {
                radius: '80%',
                backgroundColor: 'gray',
                baseWidth: 12,
                baseLength: '0%',
                rearLength: '0%',
            },
            pivot: {
                backgroundColor: 'gray',
                radius: 6,
            },
        }],
    };

    return (
        <figure className="highcharts-figure">
            <HighchartsReact
                highcharts={Highcharts}
                options={options}
                ref={chartRef}
            />
        </figure>
    );
};

export default HighGaugeChart;
