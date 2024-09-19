import { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { useExecuteQuery } from '@sisense/sdk-ui';
import * as DM from '../sample-ecommerce';
import { measureFactory } from '@sisense/sdk-data';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const RevenuePerCountry = () => {
  const [chartData, setChartData] = useState(null);
  const [chartOptions, setChartOptions] = useState({
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  });

  // Define query parameters
  const queryParams = {
    dataSource: DM.DataSource,
    dimensions: [DM.Country.Country, DM.Commerce.Date.Years],
    measures: [measureFactory.sum(DM.Commerce.Revenue, 'Total Revenue')],
    filters: [],
    sortBy: [{ field: DM.Commerce.Date.Years, desc: false }],
  };

  const { data, error, isLoading } = useExecuteQuery(queryParams);

  useEffect(() => {
    if (!isLoading && !error && data) {
      const labels = data.rows.map(row => row[DM.Country.Country.as]);
      const revenueData = data.rows.map(row => row['Total Revenue']);

      setChartData({
        datasets: [
          {
            label: 'Revenue',
            data: revenueData,
            backgroundColor: 'rgba(75, 192, 192, 0.6)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1,
          },
        ],
      });
    }
  }, [data, isLoading, error]);

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error loading data: {error.message}</p>;

  return (
    <div>
      <h2>Revenue Per Country Per Year</h2>
      {/* Display data in a table */}
      

      {/* Display data in a column chart */}
      {chartData && <Bar data={chartData} options={chartOptions} />}
    </div>
  );
};

export default RevenuePerCountry;
