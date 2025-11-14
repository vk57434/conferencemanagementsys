import React from "react";
import { Link } from "react-router-dom";

export default function PaymentCancel() {
  return (
    <div className="max-w-xl mx-auto bg-white rounded-xl shadow-md p-8 text-center">
      <h2 className="text-3xl font-bold text-red-600 mb-4">Payment Cancelled</h2>
      <p className="text-gray-600 mb-6">
        It looks like you cancelled the payment process. You can restart it at any time.
      </p>
      <div className="flex justify-center gap-4">
        <Link
          to="/payment"
          className="px-6 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
        >
          Try Again
        </Link>
        <Link
          to="/"
          className="px-6 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 transition"
        >
          Back Home
        </Link>
      </div>
    </div>
  );
}

