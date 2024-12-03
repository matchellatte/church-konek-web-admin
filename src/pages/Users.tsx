import React, { useEffect, useState } from "react";
import { supabase } from "../utils/supabaseClient";

interface User {
  user_id: string;
  email: string;
  full_name?: string;
  profile_image?: string;
  created_at: string;
}

const Users: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [sortBy, setSortBy] = useState<string>("name"); // Default sorting by name

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const { data, error } = await supabase
          .from("users")
          .select("user_id, email, full_name, profile_image, created_at");

        if (error) throw error;
        setUsers(data || []);
      } catch (err) {
        console.error("Error fetching users:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const filteredUsers = users.filter((user) => {
    const lowerQuery = searchQuery.toLowerCase();
    return (
      user.full_name?.toLowerCase().includes(lowerQuery) ||
      user.email.toLowerCase().includes(lowerQuery)
    );
  });

  const sortedUsers = [...filteredUsers].sort((a, b) => {
    if (sortBy === "name") {
      return (a.full_name || "").localeCompare(b.full_name || "");
    }
    if (sortBy === "date") {
      return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
    }
    return 0;
  });

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6 text-gray-200">Users</h1>
      <div className="flex justify-between items-center mb-4">
        <div>
          <p className="text-gray-400">
            Total Users: <span className="text-gray-200">{users.length}</span>
          </p>
        </div>
        <div className="flex space-x-4">
          {/* Search */}
          <input
            type="text"
            placeholder="Search users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="px-4 py-2 rounded-md bg-gray-700 text-gray-300 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-[#ffbd59]"
          />
          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-2 rounded-md bg-gray-700 text-gray-300 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-[#ffbd59]"
          >
            <option value="name">Sort by Name</option>
            <option value="date">Sort by Date Created</option>
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
                <th className="py-3 px-4 text-left">Profile</th>
                <th className="py-3 px-4 text-left">Email</th>
                <th className="py-3 px-4 text-left">Created At</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {sortedUsers.map((user, index) => (
                <tr
                  key={user.user_id}
                  className="border-t border-gray-700 hover:bg-gray-700 transition"
                >
                  {/* Numbering */}
                  <td className="py-3 px-4">{index + 1}</td>
                  {/* Profile */}
                  <td className="py-3 px-4 flex items-center space-x-4">
                    <img
                      src={
                        user.profile_image
                          ? user.profile_image
                          : "/public/images/default-profile-icon.jpg" // Default profile icon
                      }
                      alt="Profile"
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div>
                      <p className="text-sm font-semibold">
                        {user.full_name || "Unknown User"}
                      </p>
                    </div>
                  </td>
                  {/* Email */}
                  <td className="py-3 px-4">{user.email}</td>
                  {/* Created At */}
                  <td className="py-3 px-4">
                    {new Date(user.created_at).toLocaleDateString()}
                  </td>
                  {/* Actions */}
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

export default Users;
