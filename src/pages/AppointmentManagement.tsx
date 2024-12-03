import React, { useEffect, useState } from "react";
import { supabase } from "../utils/supabaseClient";

interface Appointment {
  appointment_id: string;
  user_full_name: string;
  user_profile_image?: string;
  service_name: string;
  appointment_date: string;
  status: string;
  created_at: string;
}

const Appointments: React.FC = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [sortColumn, setSortColumn] = useState<keyof Appointment>("created_at");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  const statuses = [
    "pending for requirements",
    "pending",
    "approved",
    "cancelled",
    "completed",
  ];

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const { data, error } = await supabase
          .from("appointments")
          .select(
            `
            appointment_id,
            appointment_date,
            status,
            created_at,
            users (full_name, profile_image),
            services (service_name)
          `
          );

        if (error) throw error;

        // Map the data to ensure valid values
        const mappedAppointments = data.map((appointment: any) => ({
          appointment_id: appointment.appointment_id,
          user_full_name: appointment.users?.full_name || "Unknown User",
          user_profile_image:
            appointment.users?.profile_image || "/images/default-profile-icon.jpg", // Default profile image
          service_name: appointment.services?.service_name || "Unknown Service",
          appointment_date: appointment.appointment_date,
          status: appointment.status,
          created_at: appointment.created_at,
        }));

        setAppointments(mappedAppointments);
      } catch (err) {
        console.error("Error fetching appointments:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  const formatDate = (date: string) => {
    const options: Intl.DateTimeFormatOptions = {
      month: "2-digit",
      day: "2-digit",
      year: "numeric",
    };
    return new Date(date).toLocaleDateString("en-US", options);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query.toLowerCase());
  };

  const handleSort = (column: keyof Appointment) => {
    setSortColumn(column);
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
  };

  const handleStatusChange = async (
    appointmentId: string,
    newStatus: string
  ) => {
    try {
      const { error } = await supabase
        .from("appointments")
        .update({ status: newStatus })
        .eq("appointment_id", appointmentId);

      if (error) throw error;

      // Update the local state
      setAppointments((prevAppointments) =>
        prevAppointments.map((appointment) =>
          appointment.appointment_id === appointmentId
            ? { ...appointment, status: newStatus }
            : appointment
        )
      );
    } catch (err) {
      console.error("Error updating status:", err);
    }
  };

  const filteredAppointments = appointments.filter(
    (appointment) =>
      appointment.user_full_name.toLowerCase().includes(searchQuery) ||
      appointment.service_name.toLowerCase().includes(searchQuery) ||
      appointment.status.toLowerCase().includes(searchQuery)
  );

  const sortedAppointments = [...filteredAppointments].sort((a, b) => {
    const aValue = a[sortColumn];
    const bValue = b[sortColumn];

    if (typeof aValue === "string" && typeof bValue === "string") {
      return sortOrder === "asc"
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    }

    if (aValue && bValue) {
      return sortOrder === "asc"
        ? new Date(aValue).getTime() - new Date(bValue).getTime()
        : new Date(bValue).getTime() - new Date(aValue).getTime();
    }

    return 0;
  });

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6 text-gray-200">Appointments</h1>

      <div className="flex justify-between items-center mb-4">
        <span className="text-gray-200 font-semibold">
          Total Appointments: {appointments.length}
        </span>
        <div className="flex space-x-4">
          <input
            type="text"
            placeholder="Search Appointments..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="px-4 py-2 rounded-md bg-gray-700 text-gray-200 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-[#ffbd59]"
          />
          <select
            value={sortColumn}
            onChange={(e) => handleSort(e.target.value as keyof Appointment)}
            className="px-4 py-2 rounded-md bg-gray-700 text-gray-200 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-[#ffbd59]"
          >
            <option value="user_full_name">Sort by User</option>
            <option value="service_name">Sort by Service</option>
            <option value="status">Sort by Status</option>
            <option value="appointment_date">Sort by Appointment Date</option>
            <option value="created_at">Sort by Created At</option>
          </select>
        </div>
      </div>

      {loading ? (
        <p className="text-gray-400">Loading...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full bg-gray-800 text-gray-200 rounded-lg shadow">
            <thead>
              <tr>
                <th className="py-3 px-4 text-left">#</th>
                <th className="py-3 px-4 text-left">User</th>
                <th className="py-3 px-4 text-left">Service</th>
                <th className="py-3 px-4 text-left">Appointment Date</th>
                <th className="py-3 px-4 text-left">Status</th>
                <th className="py-3 px-4 text-left">Created At</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {sortedAppointments.map((appointment, index) => (
                <tr
                  key={appointment.appointment_id}
                  className="border-t border-gray-700 hover:bg-gray-700 transition"
                >
                  <td className="py-3 px-4">{index + 1}</td>
                  <td className="py-3 px-4 flex items-center space-x-4">
                    <img
                      src={appointment.user_profile_image}
                      alt="Profile"
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <span>{appointment.user_full_name}</span>
                  </td>
                  <td className="py-3 px-4">{appointment.service_name}</td>
                  <td className="py-3 px-4">
                    {formatDate(appointment.appointment_date)}
                  </td>
                  <td className="py-3 px-4">
                    <select
                      value={appointment.status}
                      onChange={(e) =>
                        handleStatusChange(
                          appointment.appointment_id,
                          e.target.value
                        )
                      }
                      className="px-2 py-1 bg-gray-700 text-gray-200 border border-gray-600 rounded focus:outline-none"
                    >
                      {statuses.map((statusOption) => (
                        <option key={statusOption} value={statusOption}>
                          {statusOption}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="py-3 px-4">
                    {new Date(appointment.created_at).toLocaleString()}
                  </td>
                  <td className="py-3 px-4 text-right space-x-2">
                    <button className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition">
                      Edit
                    </button>
                    <button className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition">
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Appointments;
