import React from "react";
import { Doughnut } from "react-chartjs-2";

interface DoughnutChartProps {
  data: any;
  options: any;
  loading: boolean;
}

const DoughnutChart: React.FC<DoughnutChartProps> = ({ data, options, loading }) => {
  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow">
      <h2 className="text-lg font-semibold mb-5 text-gray-200">Appointment Status Distribution</h2>
      {loading ? (
        <p className="text-gray-400">Loading...</p>
      ) : (
        <div className="relative h-0">
          <Doughnut data={data} options={options} />
        </div>
      )}
    </div>
  );
};

export default DoughnutChart;
