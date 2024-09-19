import React from 'react';
import { PieChart, Pie, Cell } from 'recharts';

interface SimpleDonutChartProps {
  percentage: number; // Specify the type for percentage
  color: string;      // Specify the type for color
}

const SimpleDonutChart: React.FC<SimpleDonutChartProps> = ({ percentage, color }) => {
  const data = [
    { name: 'Used', value: percentage },
    { name: 'Remaining', value: 100 - percentage },
  ];

  return (
    <PieChart width={100} height={100}>
      <Pie
        data={data}
        cx="50%"
        cy="50%"
        innerRadius={30}
        outerRadius={40}
        startAngle={90}
        endAngle={450}
        paddingAngle={5}
        dataKey="value"
      >
        <Cell key="cell-0" fill={color} />
        <Cell key="cell-1" fill="#ecf0f1" />
      </Pie>
    </PieChart>
  );
};

export default SimpleDonutChart;
