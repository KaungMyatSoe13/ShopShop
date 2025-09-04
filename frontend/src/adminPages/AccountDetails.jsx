import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ProfileSideBar from "../adminComponents/ProfileSideBar";
import { FaEyeSlash } from "react-icons/fa6";
import { FaEye } from "react-icons/fa";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

function AccountDetails() {
  const [user, setUser] = useState({
    email: "",
    name: "",
    phone: "",
  });
  const [loading, setLoading] = useState(true);
  const [resendLoading, setResendLoading] = useState(false);
  const [resendMessage, setResendMessage] = useState("");

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordMessage, setPasswordMessage] = useState("");

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [name, setName] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [phone, setPhone] = useState("");

  const [profileMessage, setProfileMessage] = useState(""); // for success/error
  const [profileMessageType, setProfileMessageType] = useState("error"); // "error" or "success"

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true); // start loading
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.warn("No token found");
          setLoading(false);
          return;
        }
        const response = await fetch(`${BACKEND_URL}/api/auth/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          console.error("Failed to fetch user", response.status);
          setLoading(false);
          return;
        }

        const data = await response.json();

        setUser(data);
        setName(data.name || "");
        setDisplayName(data.displayName || data.name || "");
        setPhone(data.phone || "");
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false); // end loading
      }
    };

    fetchUser();
  }, []);

  const handleProfileSave = async (e) => {
    e.preventDefault();

    // Clear previous message
    setProfileMessage("");

    // Frontend validation
    if (!name || !displayName || !phone) {
      setProfileMessage("Please fill in all required fields.");
      setProfileMessageType("error");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${BACKEND_URL}/api/auth/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name, displayName, phone }),
      });

      const data = await response.json();

      if (response.ok) {
        setProfileMessage(data.message || "Profile updated successfully ✅");
        setProfileMessageType("success");
        setUser(data.user); // update local user state
      } else {
        setProfileMessage(data.message || "Failed to update profile.");
        setProfileMessageType("error");
      }
    } catch (err) {
      console.error(err);
      setProfileMessage("Something went wrong. Please try again.");
      setProfileMessageType("error");
    }
  };

  //handle resend
  const handleResend = async () => {
    setResendLoading(true);
    try {
      const response = await fetch(
        `${BACKEND_URL}/api/auth/user/resend-verification`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: user.email }),
        }
      );
      const data = await response.json();
      if (response.ok) {
        setPasswordMessage("Password changed successfully");

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

  const handlePasswordChange = async (e) => {
    e.preventDefault();

    // Client-side validation
    if (!currentPassword && !newPassword && !confirmPassword) {
      setPasswordMessage(
        "Please fill at least one field to change your password"
      );
      return;
    }

    if (newPassword && newPassword !== confirmPassword) {
      setPasswordMessage("New password and confirm password do not match");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      setPasswordMessage("You must be logged in to change password");
      return;
    }

    try {
      const response = await fetch(`${BACKEND_URL}/api/auth/change-password`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          currentPassword,
          newPassword,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setPasswordMessage("Password changed successfully ✅");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        // Display backend error (e.g., wrong current password, weak password)
        setPasswordMessage(data.message || "Password change failed");
      }
    } catch (err) {
      setPasswordMessage("Something went wrong. Please try again.");
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
              <form className="space-y-6" onSubmit={handlePasswordChange}>
                <h2 className="text-lg font-semibold">User Informations</h2>

                <div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Surname *
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full border rounded px-3 py-2"
                    />
                  </div>
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
                        className="bg-gray-500 text-white px-3 py-2 rounded hover:bg-gray-600 hover:cursor-pointer"
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
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/, ""))} // remove non-digit chars
                    placeholder="Your Number"
                    className="w-full border rounded px-3 py-2"
                  />
                  {profileMessage && (
                    <p
                      className={`text-sm mt-2 ${
                        profileMessageType === "success"
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {profileMessage}
                    </p>
                  )}
                  <button
                    type="button"
                    onClick={handleProfileSave}
                    className="bg-black text-white px-4 py-2 rounded hover:opacity-90 hover:cursor-pointer hover:bg-gray-800 mt-4"
                  >
                    Save changes
                  </button>
                </div>

                <hr className="my-4" />

                <h2 className="text-lg font-semibold">Password Change</h2>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Current password (leave blank to leave unchanged)
                  </label>
                  <div className="relative w-full">
                    <input
                      type={showCurrentPassword ? "text" : "password"}
                      className="w-full border rounded px-3 py-2 pr-10" // pr-10 adds space for the icon
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                    />
                    <div className="absolute inset-y-0 right-3 flex items-center cursor-pointer">
                      {showCurrentPassword ? (
                        <FaEyeSlash
                          onClick={() => setShowCurrentPassword(false)}
                        />
                      ) : (
                        <FaEye onClick={() => setShowCurrentPassword(true)} />
                      )}
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    New password (leave blank to leave unchanged)
                  </label>
                  <div className="relative w-full">
                    <input
                      type={showNewPassword ? "text" : "password"}
                      className="w-full border rounded px-3 py-2 pr-10" // pr-10 adds space for the icon
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                    />
                    <div className="absolute inset-y-0 right-3 flex items-center cursor-pointer">
                      {showNewPassword ? (
                        <FaEyeSlash onClick={() => setShowNewPassword(false)} />
                      ) : (
                        <FaEye onClick={() => setShowNewPassword(true)} />
                      )}
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Confirm new password
                  </label>
                  <div className="relative w-full">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      className="w-full border rounded px-3 py-2 pr-10" // pr-10 adds space for the icon
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                    <div className="absolute inset-y-0 right-3 flex items-center cursor-pointer">
                      {showConfirmPassword ? (
                        <FaEyeSlash
                          onClick={() => setShowConfirmPassword(false)}
                        />
                      ) : (
                        <FaEye onClick={() => setShowConfirmPassword(true)} />
                      )}
                    </div>
                  </div>
                </div>
                <div>
                  {/* Display password messages */}
                  {passwordMessage && (
                    <p
                      className={`text-sm mt-2 ${
                        passwordMessage.includes("successfully")
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {passwordMessage}
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  className="bg-black text-white px-4 py-2 rounded hover:opacity-90 hover:cursor-pointer hover:bg-gray-800"
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
