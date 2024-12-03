import React, { useEffect, useState, useMemo } from "react";
import { supabase } from "../utils/supabaseClient";
import { Bar, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
} from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

interface Stats {
  total: number;
  pending: number;
  approved: number;
  canceled: number;
  completed: number;
}

interface ServiceStats {
  service_name: string;
  count: number;
}

const DashboardOverview: React.FC = () => {
  const [stats, setStats] = useState<Stats>({
    total: 0,
    pending: 0,
    approved: 0,
    canceled: 0,
    completed: 0,
  });
  const [serviceStats, setServiceStats] = useState<ServiceStats[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data: appointments, error } = await supabase
          .from("appointments")
          .select("status, services (service_name)");

        if (error) throw error;

        const serviceCounts: Record<string, number> = {};

        appointments?.forEach((appointment: any) => {
          const serviceName = appointment.services?.service_name || "Unknown Service";
          serviceCounts[serviceName] = (serviceCounts[serviceName] || 0) + 1;
        });

        setServiceStats(
          Object.entries(serviceCounts).map(([service_name, count]) => ({
            service_name,
            count,
          }))
        );

        setStats({
          total: appointments?.length || 0,
          pending: appointments?.filter((a: { status: string }) => a.status === "pending for requirements").length || 0,
          approved: appointments?.filter((a: { status: string }) => a.status === "approved").length || 0,
          canceled: appointments?.filter((a: { status: string }) => a.status === "cancelled").length || 0,
          completed: appointments?.filter((a: { status: string }) => a.status === "completed").length || 0,
        });
      } catch (err) {
        console.error("Error fetching stats:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  // Doughnut Chart Data
  const doughnutData = useMemo(() => {
    return {
      labels: ["Pending", "Approved", "Canceled", "Completed"],
      datasets: [
        {
          data: [stats.pending, stats.approved, stats.canceled, stats.completed],
          backgroundColor: ["#FFCE56", "#36A2EB", "#FF6384", "#4BC0C0"],
          hoverBackgroundColor: ["#FFC34D", "#3591E0", "#FF4E70", "#3ABEBE"],
          borderWidth: 0,
        },
      ],
    };
  }, [stats]);

  const doughnutOptions = {
    plugins: {
      legend: {
        labels: {
          color: "#ffffff", // Text color for labels
          font: {
            size: 14,
          },
          padding: 30, // Add spacing between legend items
          usePointStyle: true, // Use circular points
        },
        position: "bottom" as const, // Use the literal type "bottom"
        align: "center" as const, // Align the legend to the center
      },
      tooltip: {
        backgroundColor: "#2c3e50",
        bodyColor: "#ecf0f1",
        titleColor: "#ecf0f1",
        borderColor: "#34495e",
        borderWidth: 1,
      },
    },
    maintainAspectRatio: false,
  };
  
  

  // Bar Chart Data
  const barData = useMemo(() => {
    return {
      labels: serviceStats.map((stat) => stat.service_name),
      datasets: [
        {
          label: "Appointments per Service",
          data: serviceStats.map((stat) => stat.count),
          backgroundColor: "#36A2EB",
        },
      ],
    };
  }, [serviceStats]);

  const barOptions = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      x: {
        ticks: { color: "#ffffff" },
        grid: { display: false },
      },
      y: {
        ticks: { color: "#ffffff" },
        grid: { color: "#555555" },
      },
    },
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Dashboard Overview</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-6 mb-8">
        <div className="bg-gray-800 p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold">Total Appointments</h2>
          <p className="text-2xl font-bold">{stats.total}</p>
        </div>
        <div className="bg-gray-800 p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold">Pending</h2>
          <p className="text-2xl font-bold">{stats.pending}</p>
        </div>
        <div className="bg-gray-800 p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold">Approved</h2>
          <p className="text-2xl font-bold">{stats.approved}</p>
        </div>
        <div className="bg-gray-800 p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold">Canceled</h2>
          <p className="text-2xl font-bold">{stats.canceled}</p>
        </div>
        <div className="bg-gray-800 p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold">Completed</h2>
          <p className="text-2xl font-bold">{stats.completed}</p>
        </div>
      </div>

      {/* Graphs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Doughnut Chart */}
        <div className="bg-gray-800 p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-9 text-gray-200">Appointment Status Distribution</h2>
          {loading ? (
            <p className="text-gray-400">Loading...</p>
          ) : (
            <div className="relative">
              <Doughnut data={doughnutData} options={doughnutOptions} />
            </div>
          )}
        </div>

        {/* Bar Chart */}
        <div className="bg-gray-800 p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4 text-gray-200">Appointments by Service</h2>
          {loading ? (
            <p className="text-gray-400">Loading...</p>
          ) : (
            <Bar data={barData} options={barOptions} />
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;
