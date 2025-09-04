import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

function ResetPassword() {
  const { userId, resetToken } = useParams();
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isValidToken, setIsValidToken] = useState(true);

  // Password validation: min 8 chars, at least one letter and one number
  function isPasswordValid(password) {
    return /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/.test(password);
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isPasswordValid(newPassword)) {
      setError(
        "Password must be at least 8 characters long and contain at least one letter and one number."
      );
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    setMessage("");
    setError("");

    try {
      const response = await fetch(`${BACKEND_URL}/api/auth/reset-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          resetToken,
          newPassword,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(data.message);
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      } else {
        setError(data.message || "Failed to reset password");
        if (
          data.message === "Invalid reset token" ||
          data.message === "Reset token has expired"
        ) {
          setIsValidToken(false);
        }
      }
    } catch (err) {
      setError("Failed to reset password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!isValidToken) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <div className="flex flex-1 justify-center items-center bg-gray-50">
          <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8 text-center">
            <h1 className="text-2xl font-bold text-red-600 mb-4">
              Invalid Reset Link
            </h1>
            <p className="text-gray-600 mb-6">
              This password reset link is invalid or has expired. Please request
              a new one.
            </p>
            <Link
              to="/forgot-password"
              className="bg-gray-600 text-white py-2 px-4 rounded-md hover:bg-gray-700"
            >
              Request New Reset Link
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="flex flex-1 justify-center items-center bg-gray-50">
        <div className="max-w-md w-full bg-white border shadow-md p-8">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-2 font-playfair">
              Reset Password
            </h1>
            <p className="text-gray-600 font-playfair">
              Enter your new password below.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="newPassword"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                New Password
              </label>
              <input
                type="password"
                id="newPassword"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300  focus:outline-none focus:ring-2 focus:ring-gray-600 focus:border-transparent"
                placeholder="Enter new password"
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                Password must be at least 8 characters long and contain at least
                one letter and one number.
              </p>
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Confirm New Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300  focus:outline-none focus:ring-2 focus:ring-gray-600 focus:border-transparent"
                placeholder="Confirm new password"
                required
              />
            </div>

            {message && (
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">
                {message}
              </div>
            )}

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-white border text-black py-2 px-4 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Resetting..." : "Reset Password"}
            </button>
          </form>

          <div className="mt-6 text-center">
            <Link
              to="/profile/loginPage"
              className="text-gray-600 hover:text-gray-400 text-sm"
            >
              Back to Login
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default ResetPassword;
