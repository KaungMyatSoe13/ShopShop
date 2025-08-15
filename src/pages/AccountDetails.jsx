import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ProfileSideBar from "../components/ProfileSideBar";

function AccountDetails() {
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

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Email address *
                  </label>
                  <input
                    type="email"
                    defaultValue="kaungsoe132004@gmail.com"
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
