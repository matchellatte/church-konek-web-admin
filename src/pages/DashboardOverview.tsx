import React, { useEffect, useState } from "react";
import { supabase } from "../utils/supabaseClient";

interface Stats {
  total: number;
  pending: number;
  approved: number;
  canceled: number;
  completed: number;
}

const DashboardOverview: React.FC = () => {
  const [stats, setStats] = useState<Stats>({
    total: 0,
    pending: 0,
    approved: 0,
    canceled: 0,
    completed: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      const { data: appointments } = await supabase.from("appointments").select("*");

      if (appointments) {
        setStats({
          total: appointments.length,
          pending: appointments.filter((a: { status: string }) => a.status === "pending for requirements").length,
          approved: appointments.filter((a: { status: string }) => a.status === "approved").length,
          canceled: appointments.filter((a: { status: string }) => a.status === "cancelled").length,
          completed: appointments.filter((a: { status: string }) => a.status === "completed").length,
        });
      }
    };

    fetchStats();
  }, []);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Dashboard Overview</h1>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
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
    </div>
  );
};

export default DashboardOverview;
