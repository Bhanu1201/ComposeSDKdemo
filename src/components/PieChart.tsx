import { Box, Typography, Paper, Stack } from '@mui/material';
import { useExecuteQuery } from '@sisense/sdk-ui';
import Chart from 'react-apexcharts';
import * as DM from '../sample-ecommerce';
import { measureFactory } from '@sisense/sdk-data';
import { ApexOptions } from 'apexcharts';

const PieChart: React.FC = () => {
  const { data, isLoading, isError } = useExecuteQuery({
    dataSource: DM.DataSource,
    dimensions: [DM.Commerce.AgeRange],
    measures: [
      measureFactory.sum(DM.Commerce.Cost, 'Total Cost'),
      measureFactory.sum(DM.Commerce.Revenue, 'Total Revenue'),
    ],
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error</div>;
  }

  // Prepare the data for the ApexCharts pie chart
  const labels = data?.rows.map((row) => row[0].data) || [];
  const totalRevenueData = data?.rows.map((row) => row[2].data) || [];

  const chartOptions: ApexOptions = {
    chart: {
      type: 'pie',
    },
    labels: labels,
    title: {
      text: 'Sales Distribution',
      align: 'center',
    },
    responsive: [
      {
        breakpoint: 480,
        options: {
          chart: {
            width: 300,
          },
          legend: {
            position: 'bottom',
          },
        },
      },
    ],
  };

  const chartSeries = totalRevenueData; // Use Total Revenue or any relevant series

  return (
    <Paper elevation={3} sx={{ padding: 2, borderRadius: 4 }}>
      <Box sx={{ width: '100%' }}>
        <Stack
          direction={{ xs: 'column', sm: 'column' }}
          spacing={2}
          justifyContent="space-between"
          alignItems="start"
        >
          <Stack spacing={1}>
            <Typography variant="h5">Sales Distribution</Typography>
          </Stack>
          <Box sx={{ flexGrow: 1, minHeight: '250px' }}>
            <Chart
              options={chartOptions}
              series={chartSeries}
              type="pie"
              height="100%"
              width="100%"
            />
          </Box>
        </Stack>
      </Box>
    </Paper>
  );
};

export default PieChart;
