import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ProfileSideBar from "../components/ProfileSideBar";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

function Addresses() {
  const [billingAddress, setBillingAddress] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [hasAddresses, setHasAddresses] = useState(false);

  useEffect(() => {
    const fetchAddress = async () => {
      try {
        const token = localStorage.getItem("token");
        const url = new URL("/api/auth/addresses", BACKEND_URL);
        const res = await fetch(url.toString(), {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Failed to fetch addresses");
        const data = await res.json();

        if (data.addresses && data.addresses.length > 0) {
          setHasAddresses(true);
          const defaultAddress =
            data.addresses.find((a) => a.isDefault) || data.addresses[0];

          setBillingAddress({
            name: defaultAddress.name || "",
            email: defaultAddress.email || "", // Changed from region
            phone: defaultAddress.phone || "", // Changed from city
            township: defaultAddress.township,
            address: defaultAddress.fullAddress,
          });
          setIsEditing(false);
        } else {
          setHasAddresses(false);
          setBillingAddress({
            name: "", // Start with empty address name
            address: "",
            region: "",
            city: "",
            township: "",
          });
          setIsEditing(true);
        }
      } catch (err) {
        console.error(err);
        setHasAddresses(false);
        setBillingAddress({
          name: "",
          address: "",
          region: "",
          city: "",
          township: "",
        });
        setIsEditing(true);
      } finally {
        setLoading(false);
      }
    };

    fetchAddress();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBillingAddress((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem("token");
      const url = new URL("/api/auth/save-address", BACKEND_URL);
      const res = await fetch(url.toString(), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: billingAddress.name,
          email: billingAddress.email, // Changed from region
          phone: billingAddress.phone, // Changed from city
          township: billingAddress.township,
          fullAddress: billingAddress.address,
          label: "Default",
          isDefault: true,
        }),
      });

      if (!res.ok) throw new Error("Failed to save address");
      alert("Address saved successfully!");
      setIsEditing(false);
      setHasAddresses(true);
    } catch (err) {
      console.error(err);
      alert("Could not save address");
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <p>Loading...</p>
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
            <div className="max-w-7xl mx-auto h-full">
              <h1 className="text-2xl font-bold mb-6 ml-6 font-playfair">
                Addresses
              </h1>
              <div className="bg-white border p-6 mx-4 mb-2">
                <h2 className="text-lg font-semibold mb-4">My Address</h2>
                <label className="text-sm font-medium capitalize">
                  <div>{billingAddress.name}</div>
                  <div>{billingAddress.address}</div>
                  <div>{billingAddress.township}</div>
                  <div>{billingAddress.city}</div>
                  <div>{billingAddress.region}</div>
                </label>
              </div>

              <div className="bg-white border p-6 mx-4">
                <h2 className="text-lg font-semibold mb-4">
                  {hasAddresses
                    ? "Edit Your Address"
                    : "Add Your First Address"}
                </h2>

                {!hasAddresses && !isEditing && (
                  <div className="text-center py-8">
                    <p className="text-gray-500 mb-4">No addresses found</p>
                    <button
                      onClick={() => setIsEditing(true)}
                      className="bg-black text-white px-6 py-2 rounded hover:bg-gray-800 transition"
                    >
                      Add Full Address
                    </button>
                  </div>
                )}

                {(hasAddresses || isEditing) && (
                  <>
                    <div className="space-y-3">
                      {["name", "email", "phone", "township", "address"].map(
                        (field) => (
                          <div key={field}>
                            <label className="text-sm font-medium capitalize">
                              {field.replace(/([A-Z])/g, " $1")}
                            </label>
                            <input
                              type={field === "email" ? "email" : "text"}
                              name={field}
                              value={billingAddress[field] || ""}
                              onChange={handleChange}
                              disabled={!isEditing}
                              className={`w-full border px-3 py-2 text-sm mt-1 focus:outline-none focus:ring-2 focus:ring-gray-400 ${
                                isEditing ? "bg-white" : "bg-gray-100"
                              }`}
                              placeholder={isEditing ? `Enter ${field}` : ""}
                            />
                          </div>
                        )
                      )}
                    </div>

                    <div className="mt-4 text-right">
                      {isEditing ? (
                        <>
                          <button
                            onClick={handleSave}
                            className="bg-black text-white px-4 py-2 hover:bg-gray-800 transition mr-2 hover:cursor-pointer"
                          >
                            {hasAddresses ? "Save" : "Add Address"}
                          </button>
                          {hasAddresses && (
                            <button
                              onClick={() => setIsEditing(false)}
                              className="text-gray-500 px-4 py-2 hover:text-gray-800 transition"
                            >
                              Cancel
                            </button>
                          )}
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
                  </>
                )}
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
