import React from "react";
import { Bar } from "react-chartjs-2";

interface BarChartProps {
  data: any;
  options: any;
  loading: boolean;
}

const BarChart: React.FC<BarChartProps> = ({ data, options, loading }) => {
  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow">
      <h2 className="text-lg font-semibold mb-4 text-gray-200">Appointments by Service</h2>
      {loading ? (
        <p className="text-gray-400">Loading...</p>
      ) : (
        <Bar data={data} options={options} />
      )}
    </div>
  );
};

export default BarChart;
