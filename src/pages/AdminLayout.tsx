import React from "react";
import { NavLink, Outlet } from "react-router-dom";
import { useTheme } from "../ThemeContext";
import { FaMoon, FaSun } from "react-icons/fa";

const serviceList = [
  "First Communion",
  "Kumpil",
  "Special Mass",
  "Wedding",
  "House Blessing",
  "Prayer Intention",
  "Baptism",
  "Funeral Mass",
];

const AdminLayout: React.FC = () => {
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <div className={`min-h-screen flex ${isDarkMode ? "bg-gray-900 text-gray-200" : "bg-gray-100 text-gray-900"}`}>
      {/* Sidebar */}
      <div
        className={`w-64 ${
          isDarkMode ? "bg-gray-800" : "bg-gray-200"
        } p-6 fixed top-0 bottom-0 flex flex-col justify-between`}
      >
        {/* Header */}
        <div>
          <div className="flex items-center mb-8">
            <img src="/src/assets/church_konek_logo.png" alt="Church Konek Logo" className="w-8 h-8 mr-2" />
            <h1 className={`text-2xl font-bold ${isDarkMode ? "text-[#ffbd59]" : "text-yellow-500"}`}>Admin Panel</h1>
          </div>

          {/* Main Navigation */}
          <nav className="space-y-4">
            <NavLink
              to="/admin/dashboard"
              className={({ isActive }) =>
                `block px-4 py-2 rounded-md ${
                  isActive
                    ? isDarkMode
                      ? "bg-[#ffbd59] text-gray-900"
                      : "bg-yellow-400 text-gray-800"
                    : isDarkMode
                    ? "hover:text-[#ffbd59]"
                    : "hover:text-yellow-500"
                }`
              }
            >
              Dashboard
            </NavLink>
            <NavLink
              to="/admin/appointments"
              className={({ isActive }) =>
                `block px-4 py-2 rounded-md ${
                  isActive
                    ? isDarkMode
                      ? "bg-[#ffbd59] text-gray-900"
                      : "bg-yellow-400 text-gray-800"
                    : isDarkMode
                    ? "hover:text-[#ffbd59]"
                    : "hover:text-yellow-500"
                }`
              }
            >
              Appointments
            </NavLink>
            <NavLink
              to="/admin/users"
              className={({ isActive }) =>
                `block px-4 py-2 rounded-md ${
                  isActive
                    ? isDarkMode
                      ? "bg-[#ffbd59] text-gray-900"
                      : "bg-yellow-400 text-gray-800"
                    : isDarkMode
                    ? "hover:text-[#ffbd59]"
                    : "hover:text-yellow-500"
                }`
              }
            >
              Manage Users
            </NavLink>
          </nav>

          {/* Separator */}
          <div className="border-t border-gray-600 my-6"></div>

          {/* Services Section */}
          <div>
            <h2 className="px-4 text-sm font-bold uppercase tracking-wide text-gray-400">Services</h2>
            <nav className="mt-4 space-y-2">
              {serviceList.map((service) => (
                <NavLink
                  key={service}
                  to={`/admin/services/${service.replace(" ", "-").toLowerCase()}`}
                  className={({ isActive }) =>
                    `block px-4 py-2 rounded-md ${
                      isActive
                        ? isDarkMode
                          ? "bg-[#ffbd59] text-gray-900"
                          : "bg-yellow-400 text-gray-800"
                        : isDarkMode
                        ? "hover:text-[#ffbd59]"
                        : "hover:text-yellow-500"
                    }`
                  }
                >
                  {service}
                </NavLink>
              ))}
            </nav>
          </div>
        </div>

        {/* Toggle Button */}
        <button
          onClick={toggleTheme}
          className={`p-3 rounded-full flex items-center justify-center mx-auto ${
            isDarkMode ? "bg-gray-700 text-white" : "bg-gray-300 text-gray-700"
          } hover:opacity-80 transition`}
        >
          {isDarkMode ? <FaSun size={20} /> : <FaMoon size={20} />}
        </button>
      </div>

      {/* Main Content */}
      <div className="ml-64 flex-1 p-8">
        <Outlet />
      </div>
    </div>
  );
};

export default AdminLayout;
