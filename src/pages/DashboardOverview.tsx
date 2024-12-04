import React, { useEffect, useState, useMemo } from "react";
import { supabase } from "../utils/supabaseClient";
import StatsCards from "../components/StatsCards";
import DoughnutChart from "../components/DoughnutChart";
import BarChart from "../components/BarChart";
import { FaBell, FaSignOutAlt } from "react-icons/fa"; // Import notification and logout icons
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
  cancelled: number;
  completed: number;
}

interface ServiceStats {
  name: string;
  count: number;
}

const DashboardOverview: React.FC = () => {
  const [stats, setStats] = useState<Stats>({
    total: 0,
    pending: 0,
    approved: 0,
    cancelled: 0,
    completed: 0,
  });
  const [serviceStats, setServiceStats] = useState<ServiceStats[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data: appointments, error } = await supabase
          .from("appointments")
          .select("status, services (name)");

        if (error) throw error;

        const serviceCounts: Record<string, number> = {};

        appointments?.forEach((appointment: any) => {
          const serviceName = appointment.services?.name || "Unknown Service";
          serviceCounts[serviceName] = (serviceCounts[serviceName] || 0) + 1;
        });

        setServiceStats(
          Object.entries(serviceCounts).map(([name, count]) => ({
            name,
            count,
          }))
        );

        setStats({
          total: appointments?.length || 0,
          pending: appointments?.filter((a: { status: string }) => a.status === "pending for requirements").length || 0,
          approved: appointments?.filter((a: { status: string }) => a.status === "approved").length || 0,
          cancelled: appointments?.filter((a: { status: string }) => a.status === "cancelled").length || 0,
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

  const handleLogout = () => {
    // Perform logout logic here
    supabase.auth.signOut();
    window.location.reload(); // Redirect to login after logout
  };

  const doughnutData = useMemo(() => {
    return {
      labels: ["Pending", "Approved", "Cancelled", "Completed"],
      datasets: [
        {
          data: [stats.pending, stats.approved, stats.cancelled, stats.completed],
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
          color: "#ffffff",
          font: {
            size: 14,
          },
          padding: 30,
          usePointStyle: true,
        },
        position: "bottom" as const,
        align: "center" as const,
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

  const barData = useMemo(() => {
    return {
      labels: serviceStats.map((stat) => stat.name),
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
      {/* Top-Right Navigation */}
      <div className="flex justify-end items-center mb-6 space-x-6">
        {/* Notification Icon */}
        <button className="relative text-gray-400 hover:text-white">
          <FaBell size={20} />
          {/* Example Notification Badge */}
          <span className="absolute -top-1 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">3</span>
        </button>

        {/* Profile Section */}
        <div className="flex items-center space-x-3">
          <img
            src="/images/default-profile-icon.jpg" // Path to the default profile picture
            alt="Profile"
            className="w-6 h-6 rounded-full object-cover"
          />
          <span className="text-gray-200">Admin</span>
          <button onClick={handleLogout} className="text-gray-400 hover:text-white">
            <FaSignOutAlt size={20} />
          </button>
        </div>
      </div>

      {/* Dashboard Content */}
      <h1 className="text-3xl font-bold mb-6">Dashboard Overview</h1>
      <StatsCards stats={stats} />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <DoughnutChart data={doughnutData} options={doughnutOptions} loading={loading} />
        <BarChart data={barData} options={barOptions} loading={loading} />
      </div>
    </div>
  );
};

export default DashboardOverview;
