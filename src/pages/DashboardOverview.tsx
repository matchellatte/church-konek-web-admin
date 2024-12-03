import React, { useEffect, useState, useMemo } from "react";
import { supabase } from "../utils/supabaseClient";
import StatsCards from "../components/StatsCards";
import DoughnutChart from "../components/DoughnutChart";
import BarChart from "../components/BarChart";

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
      <StatsCards stats={stats} />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <DoughnutChart data={doughnutData} options={doughnutOptions} loading={loading} />
        <BarChart data={barData} options={barOptions} loading={loading} />
      </div>
    </div>
  );
};

export default DashboardOverview;
