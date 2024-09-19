import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardContent, Typography, IconButton } from '@mui/material';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import { useExecuteQuery } from '@sisense/sdk-ui';
import * as DM from '../sample-ecommerce';
import { measureFactory } from '@sisense/sdk-data';

const ColumnChart = () => {
  
  const { data, isLoading, isError } = useExecuteQuery({
    dataSource: DM.DataSource,
    dimensions: [DM.Commerce.Date.Years], 
    measures: [
      measureFactory.sum(DM.Commerce.Revenue, 'Revenue'),
    ],
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error loading data</div>;
  }

  // Transform the data for Recharts
  const chartData = data?.rows.map((row) => ({
    name: row[0].data,   
    revenue: row[1].data,
  })) || [];

  return (
    <Card elevation={2} sx={{ borderRadius: 4 }}>
      <CardContent>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6">Weekly Revenue</Typography>
          <IconButton>
            <ShowChartIcon />
          </IconButton>
        </div>
        <ResponsiveContainer width="100%" height={210}>
          <BarChart data={chartData} margin={{ top: 20, right: 20, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="revenue" fill="#8884d8" radius={[10, 10, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default ColumnChart;
