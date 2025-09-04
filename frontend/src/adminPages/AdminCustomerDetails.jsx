import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { IoMdArrowBack } from "react-icons/io";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

function AdminCustomerDetails() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [customer, setCustomer] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const fetchCustomerDetails = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/login");
          return;
        }

        // Fetch customer details
        const customerRes = await fetch(
          `${BACKEND_URL}api/admin/customers/${userId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (!customerRes.ok) {
          throw new Error(`Failed to fetch customer: ${customerRes.status}`);
        }

        const customerData = await customerRes.json();
        setCustomer(customerData);

        // Fetch customer's orders
        const ordersRes = await fetch(
          `${BACKEND_URL}api/admin/customers/${userId}/orders`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (ordersRes.ok) {
          const ordersData = await ordersRes.json();
          setOrders(
            Array.isArray(ordersData) ? ordersData : ordersData.orders || []
          );
        }
      } catch (err) {
        console.error("Fetch error:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchCustomerDetails();
    }
  }, [userId, navigate]);

  const handleDeleteCustomer = async () => {
    if (!deleteConfirm) return;

    setDeleting(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${BACKEND_URL}api/admin/customers/${userId}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.ok) {
        alert("Customer deleted successfully");
        navigate("/admin/customers");
      } else {
        const error = await response.json();
        alert("Failed to delete customer: " + error.message);
      }
    } catch (error) {
      console.error("Delete error:", error);
      alert("Error deleting customer: " + error.message);
    } finally {
      setDeleting(false);
      setDeleteConfirm(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin -full h-12 w-12 border-b-2 border-black mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading customer details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !customer) {
    return (
      <div className="flex flex-col min-h-screen">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-800 mb-2">
              Customer Not Found
            </h1>
            <p className="text-gray-600 mb-6">{error}</p>
            {/* <div className="">
              <button
                onClick={() => navigate("/admin/customers/")}
                className="text-gray-600 px-6 py-2  hover:cursor-pointer"
              >
                <IoMdArrowBack className="inline-block" />
                Back to Customers
              </button>
            </div> */}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <div className="flex flex-1 justify-center w-full">
        <div className="flex flex-col w-[95%] max-w-6xl mt-4 space-y-6">
          {/* Header */}
          <div className="flex justify-between items-center">
            <div className="">
              <button
                onClick={() => navigate("/admin/customers")}
                className="text-gray-600 hover:text-gray-800  hover:cursor-pointer"
              >
                <IoMdArrowBack className="inline-block" />
                Back to Customers
              </button>
            </div>
            <div></div>
          </div>

          {/* Customer Information Card */}
          <div className="bg-white -lg shadow-md p-6 border">
            <div className="flex justify-between items-start mb-6">
              <h2 className="text-2xl font-semibold">Customer Information</h2>
              <div className="space-x-2">
                <button
                  onClick={() => setDeleteConfirm(true)}
                  className="bg-red-400 text-white px-4 py-2  hover:bg-red-700 transition hover:cursor-pointer"
                >
                  Delete Account
                </button>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Basic Info */}
              <div>
                <h3 className="text-lg font-semibold mb-4 text-gray-700">
                  Basic Information
                </h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-600">
                      Full Name
                    </label>
                    <p className="text-gray-900 font-medium">{customer.name}</p>
                  </div>
                  {customer.displayName && (
                    <div>
                      <label className="block text-sm font-medium text-gray-600">
                        Display Name
                      </label>
                      <p className="text-gray-900">{customer.displayName}</p>
                    </div>
                  )}
                  <div>
                    <label className="block text-sm font-medium text-gray-600">
                      Email
                    </label>
                    <p className="text-gray-900">{customer.email}</p>
                  </div>
                  {customer.phone && (
                    <div>
                      <label className="block text-sm font-medium text-gray-600">
                        Phone
                      </label>
                      <p className="text-gray-900">{customer.phone}</p>
                    </div>
                  )}
                  <div>
                    <label className="block text-sm font-medium text-gray-600">
                      Account Status
                    </label>
                    <span
                      className={`px-2 py-1  text-xs font-medium ${
                        customer.verified
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {customer.verified ? "Verified" : "Unverified"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Account Details */}
              <div>
                <h3 className="text-lg font-semibold mb-4 text-gray-700">
                  Account Details
                </h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-600">
                      Customer ID
                    </label>
                    <p className="text-gray-900 font-mono text-sm">
                      {customer._id}
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-600">
                      Total Orders
                    </label>
                    <p className="text-gray-900 font-semibold">
                      {orders.length}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600">
                      Total Spent
                    </label>
                    <p className="text-gray-900 font-semibold">
                      {orders
                        .reduce((sum, order) => sum + (order.total || 0), 0)
                        .toLocaleString()}{" "}
                      MMK
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600">
                      Saved Addresses
                    </label>
                    <p className="text-gray-900">
                      {customer.savedAddresses?.length || 0}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Saved Addresses */}
          {customer.savedAddresses && customer.savedAddresses.length > 0 && (
            <div className="bg-white shadow-md p-6 border">
              <h2 className="text-2xl font-semibold mb-4">Saved Addresses</h2>
              <div className="space-y-4">
                {customer.savedAddresses.map((address, index) => (
                  <div key={index} className=" p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold">{address.label}</h3>
                      {address.isDefault && (
                        <span className="bg-blue-100 text-blue-800 px-2 py-1  text-xs">
                          Default
                        </span>
                      )}
                    </div>
                    <div className="grid md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <p>
                          <strong>Name:</strong> {address.name}
                        </p>
                        <p>
                          <strong>Email:</strong> {address.email}
                        </p>
                        <p>
                          <strong>Phone:</strong> {address.phone}
                        </p>
                      </div>
                      <div>
                        <p>
                          <strong>Township:</strong> {address.township}
                        </p>
                        <p>
                          <strong>Address:</strong> {address.fullAddress}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Orders History */}
          <div className="bg-white border shadow-md p-6">
            <h2 className="text-2xl font-semibold mb-4">
              Order History ({orders.length})
            </h2>
            {orders.length === 0 ? (
              <p className="text-gray-600 text-center py-8">No orders found</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="p-3 text-left font-medium">Order ID</th>
                      <th className="p-3 text-left font-medium">Date</th>
                      <th className="p-3 text-left font-medium">Items</th>
                      <th className="p-3 text-left font-medium">Total</th>
                      <th className="p-3 text-left font-medium">Status</th>
                      <th className="p-3 text-left font-medium">Payment</th>
                      <th className="p-3 text-left font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order) => (
                      <tr key={order._id} className="border-t hover:bg-gray-50">
                        <td className="p-3 font-mono text-xs">
                          {order.orderId}
                        </td>
                        <td className="p-3">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </td>
                        <td className="p-3">
                          {order.items?.length || 0} items
                        </td>
                        <td className="p-3 font-semibold">
                          {order.total?.toLocaleString()} MMK
                        </td>
                        <td className="p-3">
                          <span
                            className={`px-2 py-1  text-xs font-medium ${
                              order.status === "pending"
                                ? "bg-yellow-100 text-yellow-800"
                                : order.status === "completed"
                                ? "bg-green-100 text-green-800"
                                : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {order.status || "pending"}
                          </span>
                        </td>
                        <td className="p-3 capitalize">
                          {order.payment?.method || "N/A"}
                        </td>
                        <td className="p-3">
                          <button
                            className="bg-gray-500 text-white px-3 py-2 hover:bg-gray-600 transition text-xs hover:cursor-pointer"
                            onClick={() =>
                              navigate(`/admin/order/${order.orderId}`)
                            }
                          >
                            View Details
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Delete Confirmation Modal */}
          {deleteConfirm && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white -lg p-6 max-w-md w-full mx-4">
                <h3 className="text-xl font-semibold mb-4 text-red-600">
                  Delete Customer Account
                </h3>
                <p className="text-gray-700 mb-6">
                  Are you sure you want to delete{" "}
                  <strong>{customer.name}</strong>'s account? This action cannot
                  be undone and will remove all their data including orders.
                </p>
                <div className="flex space-x-4">
                  <button
                    onClick={handleDeleteCustomer}
                    disabled={deleting}
                    className="bg-red-600 text-white px-4 py-2  hover:bg-red-700 disabled:opacity-50 hover:cursor-pointer"
                  >
                    {deleting ? "Deleting..." : "Yes, Delete"}
                  </button>
                  <button
                    onClick={() => setDeleteConfirm(false)}
                    className="bg-gray-300 text-gray-700 px-4 py-2  hover:bg-gray-400 hover:cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminCustomerDetails;
