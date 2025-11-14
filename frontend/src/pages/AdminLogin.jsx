import React, { useState } from "react";
import API from "../utils/api";
import { useNavigate, Link } from "react-router-dom";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await API.post("/users/admin/login", { email, password });
      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.role);
      if (data.user?.name) {
        localStorage.setItem("userName", data.user.name);
      }
      if (data.user?.email) {
        localStorage.setItem("userEmail", data.user.email);
      }
      alert("Admin login successful!");
      navigate("/");
    } catch (err) {
      alert(err.response?.data?.message || "Admin login failed!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-purple-50 to-purple-100">
      <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md">
        <h2 className="text-3xl font-bold text-center text-purple-700 mb-2">
          Admin Login 🔐
        </h2>
        <p className="text-center text-gray-600 text-sm mb-6">
          Access restricted to administrators only
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <input
              type="email"
              placeholder="admin@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              placeholder="********"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-purple-600 text-white py-3 rounded-lg text-lg font-semibold hover:bg-purple-700 transition-colors duration-200 disabled:opacity-60"
          >
            {loading ? "Logging in..." : "Login as Admin"}
          </button>
        </form>

        <p className="text-sm text-center mt-6 text-gray-600">
          Not an admin?{" "}
          <Link
            to="/login"
            className="text-purple-600 font-medium hover:underline"
          >
            Regular login
          </Link>
        </p>
      </div>
    </div>
  );
}

