import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ProfileSideBar from "../components/ProfileSideBar";

function AccountDetails() {
  const [user, setUser] = useState({
    email: "",
    verified: false,
    name: "",
    phone: "",
  });
  const [loading, setLoading] = useState(true);
  const [resendLoading, setResendLoading] = useState(false);
  const [resendMessage, setResendMessage] = useState("");

  // Fetch user info from backend
  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true); // optional: ensure loading is true at start
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.warn("No token found");
          return;
        }

        const response = await fetch("http://localhost:5000/api/auth/me", {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          console.error(
            "Failed to fetch user:",
            response.status,
            await response.text()
          );
          return;
        }

        const data = await response.json();
        console.log("Data received from backend:", data);

        setUser({
          email: data.email ?? "",
          verified: data.verified ?? false,
          name: data.name ?? "",
          phone: data.phone ?? "",
        });
      } catch (err) {
        console.error("Error fetching user:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  //handle resend
  const handleResend = async () => {
    setResendLoading(true);
    try {
      const response = await fetch(
        "http://localhost:5000/api/auth/user/resend-verification",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: user.email }),
        }
      );
      const data = await response.json();
      if (response.ok) {
        setResendMessage(data.message);
        alert(data.message);
      } else {
        alert(data.message || "Failed to resend verification email");
      }
    } catch (err) {
      alert("Failed to resend verification email: " + err.message);
    } finally {
      setResendLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <div className="flex flex-1 justify-center items-center">
          <div className="text-lg">Loading...</div>
        </div>
        <Footer />
      </div>
    );
  }

  // Split name into first and last name
  const nameParts = user.name ? user.name.split(" ") : ["", ""];
  const firstName = nameParts[0] || "";
  const lastName = nameParts.slice(1).join(" ") || "";

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
                      defaultValue={firstName}
                      className="w-full border rounded px-3 py-2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Last name *
                    </label>
                    <input
                      type="text"
                      defaultValue={lastName}
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
                    defaultValue={user.name || ""}
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
                      <span className="text-green-600 font-semibold"></span>
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

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Phone number
                  </label>
                  <input
                    type="tel"
                    defaultValue={"09" || user.phone} // pre-fill if user.phone exists
                    placeholder="Your Number" // show this when empty
                    className="w-full border rounded px-3 py-2"
                  />
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
