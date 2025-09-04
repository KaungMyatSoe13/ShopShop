import React from "react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ProfileSideBar from "../components/ProfileSideBar";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

function Order() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("token");
        let url = `${BACKEND_URL}/api/auth/orders`;
        let options = { headers: {} };

        if (token) {
          options.headers.Authorization = `Bearer ${token}`;
        } else {
          // Guest orders - you might need to implement this endpoint
          const guestEmail = localStorage.getItem("guestEmail");
          if (guestEmail) {
            url += `?email=${guestEmail}`;
          }
        }

        const res = await fetch(url, options);
        if (!res.ok) {
          throw new Error(`Failed to fetch orders: ${res.status}`);
        }

        const data = await res.json();
        console.log("API Response:", data);

        // Handle different response structures
        if (Array.isArray(data)) {
          setOrders(data);
        } else if (data.orders && Array.isArray(data.orders)) {
          setOrders(data.orders);
        } else if (data.length !== undefined) {
          setOrders([data]);
        } else {
          setOrders([]);
        }
      } catch (err) {
        console.error("Fetch error:", err);
        setError(err.message);
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  // Loading state
  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin  h-12 w-12 border-b-2 border-black mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading orders...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <div className="flex flex-1 justify-center h-full">
          <div className="flex flex-col sm:flex-row w-[95%] border">
            <ProfileSideBar />
            <div className="flex-grow p-6 text-gray-700 bg-gray-50 w-full h-full">
              <div className="max-w-7xl mx-auto h-full w-full text-center">
                <h1 className="text-2xl font-bold mb-6 font-playfair">
                  My Orders
                </h1>
                <div className="text-red-500">
                  <p>Error loading orders: {error}</p>
                  <button
                    onClick={() => window.location.reload()}
                    className="mt-4 bg-black text-white px-4 py-2   hover:bg-gray-800"
                  >
                    Try Again
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // No orders state
  if (orders.length === 0) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <div className="flex flex-1 justify-center h-full">
          <div className="flex flex-col sm:flex-row w-[95%] border">
            <ProfileSideBar />
            <div className="flex-grow p-6 text-gray-700 bg-gray-50 w-full h-full">
              <div className="max-w-7xl mx-auto h-full w-full text-center">
                <h1 className="text-2xl font-bold mb-6 font-playfair">
                  My Orders
                </h1>
                <div className="text-gray-500">
                  <p className="text-lg mb-4">No orders found</p>
                  <p className="mb-6">You haven't placed any orders yet.</p>
                  <button
                    onClick={() => navigate("/")}
                    className="bg-black text-white px-6 py-2   hover:bg-gray-800"
                  >
                    Start Shopping
                  </button>
                </div>
              </div>
            </div>
          </div>
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
            <div className="max-w-7xl mx-auto h-full w-full">
              <h1 className="text-2xl font-bold mb-6 ml-6 font-playfair">
                My Orders ({orders.length})
              </h1>

              {/* Desktop Table */}
              <div className="overflow-x-auto px-4 hidden sm:block">
                <table className="min-w-full text-sm border bg-white">
                  <thead className="bg-gray-200 text-left">
                    <tr>
                      <th className="p-3 font-medium">Order ID</th>
                      <th className="p-3 font-medium">Date</th>
                      <th className="p-3 font-medium">Status</th>
                      <th className="p-3 font-medium">Total</th>
                      <th className="p-3 font-medium">Items</th>
                      <th className="p-3 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order) => (
                      <tr key={order._id} className="border-t hover:bg-gray-50">
                        <td className="p-3 font-mono text-xs">
                          {order.orderId}
                        </td>
                        <td className="p-3">
                          {new Date(order.createdAt).toLocaleDateString(
                            "en-US",
                            {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            }
                          )}
                        </td>
                        <td className="p-3">
                          <span
                            className={`px-2 py-1 text-xs font-medium ${
                              order.status === "pending"
                                ? "bg-yellow-100 text-yellow-800"
                                : order.status === "completed"
                                ? "bg-green-100 text-green-800"
                                : order.status === "cancelled"
                                ? "bg-red-100 text-red-800"
                                : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {order.status || "Pending"}
                          </span>
                        </td>
                        <td className="p-3 font-medium">
                          {order.total?.toLocaleString() || 0} MMK
                        </td>
                        <td className="p-3">
                          {order.items?.length || 0} item
                          {order.items?.length !== 1 ? "s" : ""}
                        </td>
                        <td className="p-3">
                          <button
                            className="bg-gray-500 text-white px-3 py-2 hover:bg-gray-600 transition text-xs hover:cursor-pointer"
                            onClick={() => navigate(`/order/${order.orderId}`)}
                          >
                            View Details
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Card Layout */}
              <div className="sm:hidden space-y-4 px-4">
                {orders.map((order) => (
                  <div
                    key={order._id}
                    className="bg-white shadow-sm  -lg p-4 border"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-mono text-xs text-gray-500">
                          Order ID
                        </p>
                        <p className="font-medium text-sm">{order.orderId}</p>
                      </div>
                      <span
                        className={`px-2 py-1  text-xs font-medium ${
                          order.status === "pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : order.status === "completed"
                            ? "bg-green-100 text-green-800"
                            : order.status === "cancelled"
                            ? "bg-red-100 text-red-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {order.status || "Pending"}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-sm text-gray-600 mb-3">
                      <div>
                        <span className="font-medium">Date:</span>{" "}
                        {new Date(order.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                        })}
                      </div>
                      <div>
                        <span className="font-medium">Items:</span>{" "}
                        {order.items?.length || 0}
                      </div>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-lg font-semibold">
                        {order.total?.toLocaleString() || 0} MMK
                      </span>
                      <button
                        onClick={() => navigate(`/order/${order.orderId}`)}
                        className="bg-gray-500 text-white px-3 py-2 hover:bg-gray-600 transition text-xs hover:cursor-pointer"
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default Order;
