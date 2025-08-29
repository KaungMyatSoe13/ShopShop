import React, { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ProfileSideBar from "../components/ProfileSideBar";

function Addresses() {
  const [billingAddress, setBillingAddress] = useState({
    name: "Kaung Myat Soe",
    address: "Phone Gyi Kygg Bus stop myt sgg htoe, Kaung Su Store",
    region: "Yangon",
    city: "Yangon",
    township: "Shwe Pyi Thar",
    phone: "09790686797",
    email: "kaungsoe132004@gmail.com",
  });

  const [isEditing, setIsEditing] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBillingAddress((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    // Here you can call API to save the updated address
    console.log("Saved address:", billingAddress);
    setIsEditing(false);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <div className="flex flex-1 justify-center h-full">
        <div className="flex flex-col sm:flex-row w-[95%] border">
          <ProfileSideBar />

          <div className="flex-grow p-6 text-gray-700 bg-gray-50 w-full h-full">
            <div className="max-w-7xl mx-auto h-full">
              <h1 className="text-2xl font-bold mb-6 ml-6 font-playfair">
                Addresses
              </h1>

              <div className="bg-white border rounded-md p-6 mx-4">
                <h2 className="text-lg font-semibold mb-4">Billing Address</h2>

                <div className="space-y-3">
                  {[
                    "name",
                    "address",
                    "township",
                    "city",
                    "region",
                    "phone",
                    "email",
                  ].map((field) => (
                    <div key={field}>
                      <label className="text-sm font-medium capitalize">
                        {field.replace(/([A-Z])/g, " $1")}
                      </label>
                      <input
                        type="text"
                        name={field}
                        value={billingAddress[field]}
                        onChange={handleChange}
                        disabled={!isEditing}
                        className={`w-full border rounded px-3 py-2 text-sm mt-1 focus:outline-none focus:ring-2 focus:ring-gray-400 ${
                          isEditing ? "bg-white" : "bg-gray-100"
                        }`}
                      />
                    </div>
                  ))}
                </div>

                <div className="mt-4 text-right">
                  {isEditing ? (
                    <>
                      <button
                        onClick={handleSave}
                        className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 transition mr-2"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setIsEditing(false)}
                        className="text-gray-500 px-4 py-2 rounded hover:text-gray-800 transition"
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="text-gray-400 text-sm underline hover:text-gray-800 hover:cursor-pointer"
                    >
                      Edit Billing Address
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default Addresses;
