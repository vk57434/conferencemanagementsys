import React, { useState, useEffect } from "react";
import API from "../utils/api";
import { useNavigate, Link, useSearchParams } from "react-router-dom";

export default function Register() {
  const [searchParams] = useSearchParams();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "Author",
  });
  const [loading, setLoading] = useState(false);
  const [isFromPayment, setIsFromPayment] = useState(false);
  const navigate = useNavigate();

  // Pre-fill form with payment details if coming from payment success
  useEffect(() => {
    const email = searchParams.get('email');
    const name = searchParams.get('name');
    const registrationType = searchParams.get('registrationType');
    
    if (email) {
      setForm(prev => ({
        ...prev,
        email: email,
        name: name || prev.name
      }));
    }

    // Auto-select role based on registration type
    if (registrationType) {
      setIsFromPayment(true);
      if (registrationType.includes('Author')) {
        setForm(prev => ({ ...prev, role: 'Author' }));
      } else if (registrationType.includes('Reviewer')) {
        setForm(prev => ({ ...prev, role: 'Reviewer' }));
      } else if (registrationType.includes('Participant') || registrationType.includes('Student')) {
        setForm(prev => ({ ...prev, role: 'Participant' }));
      }
    }
  }, [searchParams]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await API.post("/users/register", form);
      alert("Registration successful! Please login.");
      navigate("/login");
    } catch (err) {
      alert(err.response?.data?.message || "Registration failed!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
      <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md">
        <h2 className="text-3xl font-bold text-center text-blue-700 mb-6">
          Create an Account
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Full Name
            </label>
            <input
              type="text"
              name="name"
              placeholder="Enter your full name"
              value={form.name}
              onChange={handleChange}
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              placeholder="example@email.com"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              name="password"
              placeholder="********"
              value={form.password}
              onChange={handleChange}
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          {/* Role Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {isFromPayment ? "Your Role (Based on Payment)" : "Select Role"}
            </label>
            {isFromPayment ? (
              <div className="w-full p-3 border-2 border-blue-500 bg-blue-50 rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="text-blue-700 font-semibold">{form.role}</span>
                  <span className="text-xs text-blue-600">✓ Pre-selected from payment</span>
                </div>
              </div>
            ) : (
              <select
                name="role"
                value={form.role}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              >
                <option value="Author">Author</option>
                <option value="Reviewer">Reviewer</option>
                <option value="Participant">Participant</option>
              </select>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors duration-200 disabled:opacity-60"
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </form>

        <p className="text-sm text-center mt-6 text-gray-600">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-blue-600 font-medium hover:underline"
          >
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
}
