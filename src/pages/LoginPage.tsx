import React, { useState } from "react";
import HashLoader from "react-spinners/HashLoader";

interface LoginPageProps {
  onLogin: (email: string, password: string) => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [rememberMe, setRememberMe] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true); // Show loader

    // Simulate a 3-second loading process
    setTimeout(() => {
      setLoading(false); // Hide loader after 3 seconds
      onLogin(email, password); // Call the onLogin function
    }, 3000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-dark animate-moving-gradient font-inter">
      {loading ? (
        // Loader
        <div className="flex flex-col justify-center items-center">
          <HashLoader size={60} color="#ffbd59" />
          <p className="text-gray-200 mt-4">Loading, please wait...</p>
        </div>
      ) : (
        // Login Form
        <div className="w-[28rem] bg-gray-800 bg-opacity-90 p-10 rounded-lg shadow-lg animate-fade-in-up">
          <div className="mb-6 text-center">
            <img
              src="/src/assets/church_konek_logo.png"
              alt="Church Logo"
              className="w-16 h-16 mx-auto"
            />
          </div>
          <h1 className="text-3xl font-bold text-gray-200 mb-2 text-center">
            Church Konek Admin
          </h1>
          <p className="text-gray-400 mb-8 text-center">
            Sign in and manage your admin activities!
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Input */}
            <div>
              <label htmlFor="email" className="text-gray-300 block mb-2">
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 rounded-md bg-gray-700 text-gray-300 border border-gray-600 focus:outline-none focus:border-[#ffbd59] focus:ring-2 focus:ring-[#ffbd59]"
                placeholder="Enter your email"
                required
              />
            </div>

            {/* Password Input */}
            <div>
              <label htmlFor="password" className="text-gray-300 block mb-2">
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 rounded-md bg-gray-700 text-gray-300 border border-gray-600 focus:outline-none focus:border-[#ffbd59] focus:ring-2 focus:ring-[#ffbd59]"
                placeholder="Enter your password"
                required
              />
            </div>

            {/* Remember Me and Forgot Password */}
            <div className="flex items-center justify-between text-sm text-gray-400">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="remember"
                  checked={rememberMe}
                  onChange={() => setRememberMe(!rememberMe)}
                  className="w-4 h-4 text-[#ffbd59] bg-gray-700 border-gray-600 rounded focus:ring-[#ffbd59]"
                />
                <label htmlFor="remember" className="ml-2">
                  Remember me
                </label>
              </div>
              <a href="#" className="hover:text-gray-300">
                Forgot password?
              </a>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              className="w-full py-3 bg-[#ffbd59] text-gray-900 font-semibold rounded-md hover:bg-[#e6ab50] transition duration-300 transform hover:scale-105"
            >
              Login
            </button>
          </form>

          {/* Footer */}
          <div className="mt-8 text-gray-400 text-sm text-center">
            <p>© 2024 Church Konek Admin. All rights reserved.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoginPage;
