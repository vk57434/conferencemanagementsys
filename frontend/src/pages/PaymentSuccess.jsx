import React, { useEffect, useState } from "react";
import { useSearchParams, Link, useNavigate } from "react-router-dom";
import API from "../utils/api";

export default function PaymentSuccess() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState(null);
  const [error, setError] = useState("");
  const [amountPaid, setAmountPaid] = useState("");
  const [registrationType, setRegistrationType] = useState("");
  const token = localStorage.getItem('token');

  useEffect(() => {
    const sessionId = searchParams.get("session_id");
    if (!sessionId) {
      setError("Missing payment session information.");
      setLoading(false);
      return;
    }

    const fetchSession = async () => {
      try {
        const { data } = await API.get(`/payments/session/${sessionId}`);
        setSession(data);
        if (data?.amount_total) {
          setAmountPaid(
            new Intl.NumberFormat("en-IN", {
              style: "currency",
              currency: "INR",
              minimumFractionDigits: 2,
            }).format(data.amount_total / 100)
          );
        }
        // Extract registration type from line items
        if (data?.line_items?.data?.[0]?.description) {
          setRegistrationType(data.line_items.data[0].description);
        } else if (data?.line_items?.data?.[0]?.price?.product?.name) {
          setRegistrationType(data.line_items.data[0].price.product.name);
        } else if (data?.line_items?.data?.[0]?.price_data?.product_data?.name) {
          setRegistrationType(data.line_items.data[0].price_data.product_data.name);
        }
      } catch (err) {
        setError(err.response?.data?.message || err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSession();
  }, [searchParams]);

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg p-8 text-center">
      {loading ? (
        <div className="py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Verifying payment...</p>
        </div>
      ) : error ? (
        <>
          <div className="mb-6">
            <div className="text-6xl mb-4">❌</div>
            <h2 className="text-2xl font-semibold text-red-600 mb-4">
              Payment Verification Failed
            </h2>
            <p className="text-gray-600 mb-6">{error}</p>
          </div>
          <div className="flex justify-center gap-4">
            <Link
              to="/"
              className="px-6 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
            >
              Back to Home
            </Link>
            <Link
              to="/payment"
              className="px-6 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 transition"
            >
              Try Again
            </Link>
          </div>
        </>
      ) : (
        <>
          <div className="mb-6">
            <div className="text-6xl mb-4">✅</div>
            <h2 className="text-3xl font-bold text-green-600 mb-4">
              Payment Successful!
            </h2>
            <p className="text-gray-600 mb-6 text-lg">
              Thank you for completing your conference registration.
            </p>
          </div>

          <div className="bg-gray-50 rounded-lg p-6 mb-6 text-left">
            <h3 className="font-semibold text-gray-800 mb-4">Registration Details:</h3>
            <div className="space-y-2">
              {registrationType && (
                <p className="text-gray-700">
                  <span className="font-medium">Package:</span> {registrationType}
                </p>
              )}
              {amountPaid && (
                <p className="text-gray-700">
                  <span className="font-medium">Amount Paid:</span> {amountPaid}
                </p>
              )}
              {session?.customer_details?.email && (
                <p className="text-gray-700">
                  <span className="font-medium">Email:</span> {session.customer_details.email}
                </p>
              )}
              {session?.customer_details?.name && (
                <p className="text-gray-700">
                  <span className="font-medium">Name:</span> {session.customer_details.name}
                </p>
              )}
            </div>
            {session?.customer_details?.email && (
              <p className="text-sm text-gray-500 mt-4">
                📧 A receipt has been sent to {session.customer_details.email}
              </p>
            )}
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-blue-800 mb-2">Next Steps:</h3>
            <ul className="text-left text-sm text-blue-700 space-y-1">
              {!token && (
                <>
                  <li>• <strong>Create an account</strong> using the email you used for payment ({session?.customer_details?.email || 'your email'})</li>
                  <li>• Your registration details will be pre-filled for easy account creation</li>
                  <li>• After creating account, you can submit papers, access materials, and more</li>
                </>
              )}
              {token && (
                <>
                  <li>• You can now submit papers and access all features</li>
                  <li>• Check your dashboard for conference updates</li>
                </>
              )}
            </ul>
          </div>

          <div className="flex flex-col sm:flex-row justify-center gap-4">
            {!token ? (
              <>
                {session?.customer_details?.email && (
                  <Link
                    to={`/register?email=${encodeURIComponent(session.customer_details.email)}&name=${encodeURIComponent(session.customer_details.name || '')}&registrationType=${encodeURIComponent(registrationType || '')}`}
                    className="px-6 py-3 rounded-lg bg-green-600 text-white hover:bg-green-700 transition font-semibold"
                  >
                    Create Account (Recommended)
                  </Link>
                )}
                {!session?.customer_details?.email && (
                  <Link
                    to="/register"
                    className="px-6 py-3 rounded-lg bg-green-600 text-white hover:bg-green-700 transition font-semibold"
                  >
                    Create Account
                  </Link>
                )}
              </>
            ) : (
              <Link
                to="/"
                className="px-6 py-3 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition font-semibold"
              >
                Go to Dashboard
              </Link>
            )}
            <Link
              to="/"
              className="px-6 py-3 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 transition"
            >
              Back to Home
            </Link>
          </div>
        </>
      )}
    </div>
  );
}

