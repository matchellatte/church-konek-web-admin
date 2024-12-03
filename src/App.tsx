import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import AdminLayout from "./pages/AdminLayout";
import Dashboard from "./pages/DashboardOverview";
import Appointments from "./pages/AppointmentManagement";
import Users from "./pages/Users";

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleLogin = (email: string, password: string) => {
    // Mock authentication logic
    if (email && password) {
      setIsAuthenticated(true);
    }
  };

  return (
    <Router>
      <Routes>
        {/* Login Route */}
        <Route
          path="/"
          element={
            isAuthenticated ? <Navigate to="/admin/dashboard" /> : <LoginPage onLogin={handleLogin} />
          }
        />

        {/* Admin Routes */}
        <Route
          path="/admin"
          element={isAuthenticated ? <AdminLayout /> : <Navigate to="/" />}
        >
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="appointments" element={<Appointments />} />
          <Route path="users" element={<Users />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
