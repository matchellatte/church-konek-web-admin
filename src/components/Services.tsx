import React, { useState } from "react";
import { NavLink, Outlet } from "react-router-dom";

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

const Services: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>(serviceList[0]);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Services</h1>
      <div className="flex space-x-4 mb-6">
        {serviceList.map((service) => (
          <button
            key={service}
            onClick={() => setActiveTab(service)}
            className={`px-4 py-2 rounded-md ${
              activeTab === service
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-gray-800"
            }`}
          >
            {service}
          </button>
        ))}
      </div>
      <div className="bg-gray-800 p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4 text-gray-200">{activeTab}</h2>
        {/* Render service-specific content here */}
        <p className="text-gray-400">Details for {activeTab} will appear here.</p>
      </div>
    </div>
  );
};

export default Services;
