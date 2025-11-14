import React, { useState } from "react";
import API from "../utils/api";

const registrationOptions = [
  {
    label: "Author Registration",
    price: 420000, // ₹4,200.00
    description: "Submit and present one paper. Includes presentation slot & proceedings access.",
  },
  {
    label: "Reviewer Registration",
    price: 300000, // ₹3,000.00
    description: "Review papers and provide feedback. Includes access to all sessions & reviewer privileges.",
  },
  {
    label: "Participant Pass",
    price: 250000, // ₹2,500.00
    description: "Attend all technical sessions and keynotes. Includes conference kit.",
  },
  {
    label: "Student Pass",
    price: 150000, // ₹1,500.00
    description: "Discounted access for enrolled students with valid ID.",
  },
];

export default function PaymentPage() {
  const [selectedOption, setSelectedOption] = useState(registrationOptions[0]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const formatCurrency = (amount) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 2,
    }).format(amount / 100);

  const startCheckout = async () => {
    setLoading(true);
    setError("");
    try {
      const { data } = await API.post("/payments/create-checkout-session", {
        registrationType: selectedOption.label,
        price: selectedOption.price,
      });
      if (data?.url) {
        window.location.href = data.url;
      } else {
        setError("Unable to start checkout. Please try again.");
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded-2xl shadow-lg">
      <h2 className="text-3xl font-semibold text-center text-blue-700 mb-6">
        Conference Registration
      </h2>
      <p className="text-center text-gray-600 mb-8">
        Choose the registration package that best fits your participation.
      </p>

      <div className="space-y-4">
        {registrationOptions.map((option) => (
          <button
            key={option.label}
            onClick={() => setSelectedOption(option)}
            className={`w-full text-left p-5 rounded-xl border transition ${
              selectedOption.label === option.label
                ? "border-blue-500 bg-blue-50"
                : "border-gray-200 hover:border-blue-300"
            }`}
            type="button"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-semibold text-gray-800">{option.label}</h3>
                <p className="text-gray-500">{option.description}</p>
              </div>
              <span className="text-lg font-bold text-blue-600">
                {formatCurrency(option.price)}
              </span>
            </div>
          </button>
        ))}
      </div>

      {error && (
        <div className="mt-6 rounded-lg bg-red-100 text-red-700 px-4 py-3">
          {error}
        </div>
      )}

      <button
        onClick={startCheckout}
        disabled={loading}
        className="mt-8 w-full bg-green-600 text-white py-3 rounded-lg text-lg font-semibold hover:bg-green-700 transition disabled:opacity-60"
        type="button"
      >
        {loading ? "Redirecting..." : `Pay ${formatCurrency(selectedOption.price)}`}
      </button>
    </div>
  );
}

