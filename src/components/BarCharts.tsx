import { useExecuteQuery } from '@sisense/sdk-ui';
import * as DM from '../sample-ecommerce';
import { measureFactory } from '@sisense/sdk-data';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

// Function to format the y-axis labels
const formatYAxis = (tickItem) => {
  if (tickItem >= 1000000) {
    return `${(tickItem / 1000000).toFixed(1)}m`;
  } else if (tickItem >= 1000) {
    return `${(tickItem / 1000).toFixed(1)}k`;
  }
  return tickItem;
};

const BarCharts = () => {
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

  // Transform the data for Recharts
  const chartData = data?.rows.map((row) => ({
    ageRange: row[0].data,
    totalCost: row[1].data,
    totalRevenue: row[2].data,
  })) || [];

  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="ageRange" label={{ value: 'Age Range', position: 'insideBottomRight', offset: 0 }} />
        <YAxis 
          label={{ value: 'Cost and Revenue ($)', angle: -90, position: 'insideLeft' }}
          tickFormatter={formatYAxis}  // Apply custom formatting
        />
        <Tooltip />
        <Legend />
        <Bar dataKey="totalCost" fill="#8884d8" name="Total Cost" />
        <Bar dataKey="totalRevenue" fill="#82ca9d" name="Total Revenue" />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default BarCharts;
