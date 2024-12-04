import React, { useEffect, useState } from "react";
import { supabase } from "../utils/supabaseClient";

interface CommunionForm {
  child_name: string;
  birthday: string;
  guardian_name: string;
  contact_number: string;
  communion_date: string;
}

const FirstCommunion: React.FC = () => {
  const [forms, setForms] = useState<CommunionForm[]>([]);
  const [selectedForm, setSelectedForm] = useState<CommunionForm | null>(null);

  useEffect(() => {
    const fetchForms = async () => {
      const { data, error } = await supabase.from("firstcommunionforms").select("*");
      if (error) {
        console.error("Error fetching forms:", error);
      } else {
        setForms(data || []);
      }
    };
    fetchForms();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">First Communion</h1>
      <div className="bg-gray-800 text-white p-4 rounded-md shadow-md">
        <table className="w-full border-collapse border border-gray-700">
          <thead>
            <tr>
              <th className="border border-gray-700 p-2">#</th>
              <th className="border border-gray-700 p-2">User Details</th>
              <th className="border border-gray-700 p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {forms.map((form, index) => (
              <tr key={index} className="hover:bg-gray-700">
                <td className="border border-gray-700 p-2">{index + 1}</td>
                <td className="border border-gray-700 p-2 flex items-center">
                  <img
                    src="/src/assets/default-profile-icon.png" // Replace with the actual profile image path
                    alt="Profile"
                    className="w-10 h-10 rounded-full mr-4"
                  />
                  <div>
                    <p className="font-bold">{form.guardian_name}</p>
                    <p className="text-sm text-gray-400">{form.contact_number}</p>
                  </div>
                </td>
                <td className="border border-gray-700 p-2">
                  <button
                    onClick={() => setSelectedForm(form)}
                    className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                  >
                    View Form
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal for Viewing Form Details */}
      {selectedForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-md shadow-lg w-1/3 p-6 relative">
            <button
              onClick={() => setSelectedForm(null)}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
            >
              ✖
            </button>
            <h2 className="text-xl font-bold mb-4">First Communion Form</h2>
            <p>
              <strong>Child Name:</strong> {selectedForm.child_name}
            </p>
            <p>
              <strong>Birthday:</strong> {selectedForm.birthday}
            </p>
            <p>
              <strong>Guardian Name:</strong> {selectedForm.guardian_name}
            </p>
            <p>
              <strong>Contact Number:</strong> {selectedForm.contact_number}
            </p>
            <p>
              <strong>Communion Date:</strong> {selectedForm.communion_date}
            </p>
            <button
              onClick={() => setSelectedForm(null)}
              className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FirstCommunion;
