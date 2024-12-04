import React from "react";

interface Stats {
  total: number;
  pending: number;
  approved: number;
  cancelled: number;
  completed: number;
}

const StatsCards: React.FC<{ stats: Stats }> = ({ stats }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-6 mb-8">
      {Object.entries(stats).map(([key, value]) => (
        <div key={key} className="bg-gray-800 p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold capitalize">{key}</h2>
          <p className="text-2xl font-bold">{value}</p>
        </div>
      ))}
    </div>
  );
};

export default StatsCards;
