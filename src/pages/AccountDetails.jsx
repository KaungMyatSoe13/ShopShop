import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ProfileSideBar from "../components/ProfileSideBar";

function AccountDetails() {
  const [user, setUser] = useState({
    email: "kaungsoe132004@gmail.com",
    verified: false,
  });
  const [resendLoading, setResendLoading] = useState(false);
  const [resendMessage, setResendMessage] = useState("");

  // Example: fetch user info from backend
  useEffect(() => {
    async function fetchUser() {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch("http://localhost:5000/api/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();
        if (response.ok) {
          setUser({
            email: data.email,
            verified: data.verified,
          });
        }
      } catch (err) {
        console.error("Failed to fetch user:", err);
      }
    }
    fetchUser();
  }, []);

  //handle resend
  const handleResend = async () => {
    try {
      const response = await fetch(
        "http://localhost:5000/api/auth/user/resend-verification",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: "kaungsoe132004@gmail.com" }),
        }
      );
      const data = await response.json(); // will succeed now
      alert(data.message);
    } catch (err) {
      alert("Failed to resend verification email: " + err.message);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="flex flex-1 justify-center h-full">
        <div className="flex flex-col sm:flex-row w-[95%] border">
          <ProfileSideBar />
          <div className="flex-grow p-6 text-gray-700 bg-gray-50 w-full h-full">
            <div className="max-w-4xl px-4">
              <h1 className="text-2xl font-bold mb-6 font-playfair">
                Account Details
              </h1>
              <form className="space-y-6">
                <h2 className="text-lg font-semibold">User Informations</h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      First name *
                    </label>
                    <input
                      type="text"
                      defaultValue="Kaung Myat"
                      className="w-full border rounded px-3 py-2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Last name *
                    </label>
                    <input
                      type="text"
                      defaultValue="Soe"
                      className="w-full border rounded px-3 py-2"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Display name *
                  </label>
                  <input
                    type="text"
                    defaultValue="kaungsoe132004"
                    className="w-full border rounded px-3 py-2"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    This will be how your name will be displayed in the account
                    section and in reviews
                  </p>
                </div>

                {/* Email + Verification */}
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Email address *
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="email"
                      value={user.email}
                      className="flex-grow border rounded px-3 py-2"
                      disabled
                    />
                    {user.verified ? (
                      <span className="text-green-600 font-semibold">
                        Verified ✅
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={handleResend}
                        className="bg-blue-500 text-white px-3 py-2 rounded hover:bg-blue-600"
                        disabled={resendLoading}
                      >
                        {resendLoading ? "Sending..." : "Resend Verification"}
                      </button>
                    )}
                  </div>
                  {!user.verified && resendMessage && (
                    <p className="text-xs text-gray-500 mt-1">
                      {resendMessage}
                    </p>
                  )}
                  {!user.verified && !resendMessage && (
                    <p className="text-xs text-gray-500 mt-1">
                      Your email hasn't been verified yet.
                    </p>
                  )}
                </div>

                <hr className="my-4" />

                <h2 className="text-lg font-semibold">Password Change</h2>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Current password (leave blank to leave unchanged)
                  </label>
                  <input
                    type="password"
                    className="w-full border rounded px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    New password (leave blank to leave unchanged)
                  </label>
                  <input
                    type="password"
                    className="w-full border rounded px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Confirm new password
                  </label>
                  <input
                    type="password"
                    className="w-full border rounded px-3 py-2"
                  />
                </div>

                <button
                  type="submit"
                  className="bg-black text-white px-4 py-2 rounded hover:opacity-90"
                >
                  Save changes
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default AccountDetails;
