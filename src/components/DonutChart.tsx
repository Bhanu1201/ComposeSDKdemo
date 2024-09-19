import React from "react";
import { Doughnut } from "react-chartjs-2";

const DonutChart = ({ percentage, color }) => {
  const data = {
    datasets: [
      {
        data: [percentage, 100 - percentage],
        backgroundColor: [color, "#e6e6e6"],
        borderWidth: 0,
      },
    ],
  };

  const options = {
    cutout: "70%",
    plugins: {
      legend: { display: false },
      tooltip: { enabled: false },
    },
  };

  return <Doughnut data={data} options={options} />;
};

export default DonutChart;
