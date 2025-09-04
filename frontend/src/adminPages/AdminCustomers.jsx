import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { IoMdArrowBack } from "react-icons/io";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

function AdminCustomers() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/login");
          return;
        }

        const url = `${BACKEND_URL}/api/admin/customers`; // Admin endpoint
        const res = await fetch(url, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok)
          throw new Error(`Failed to fetch customers: ${res.status}`);
        const data = await res.json();

        if (Array.isArray(data)) setCustomers(data);
        else if (data.customers && Array.isArray(data.customers))
          setCustomers(data.customers);
        else setCustomers([]);
      } catch (err) {
        console.error("Fetch error:", err);
        setError(err.message);
        setCustomers([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCustomers();
  }, [navigate]);

  //   return (
  //     <div>
  //       <h1>Admin Customers</h1>
  //       {loading && <p>Loading...</p>}
  //       {error && <p>Error: {error}</p>}
  //       <ul>
  //         {customers
  //           .filter((customer) => customer.type === "user")
  //           .map((customer) => (
  //             <li key={customer.id}>
  //               <span>User: {customer.name}</span>
  //             </li>
  //           ))}
  //       </ul>
  //     </div>
  //   );
  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex flex-1 justify-center w-full">
        <div className="flex flex-col sm:flex-row w-[95%] border mt-4">
          <div className="flex-grow p-6 text-gray-700 bg-gray-50 w-full">
            <div className="">
              <button
                onClick={() => navigate("/admin/dashboard/")}
                className="text-gray-600 px-6 py-2  hover:cursor-pointer"
              >
                <IoMdArrowBack className="inline-block" />
                Back to Admin Panel
              </button>
            </div>
            <h1 className="text-2xl font-bold mb-6 ml-0 sm:ml-6 font-playfair">
              My Customers ({customers.filter((c) => c.type !== "admin").length}
              )
            </h1>

            {/* Loading state */}
            {loading && (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin h-12 w-12 border-b-2 border-black"></div>
                <p className="ml-4 text-gray-600">Loading customers...</p>
              </div>
            )}

            {/* Error state */}
            {error && (
              <div className="text-red-500 text-center">
                <p>Error loading customers: {error}</p>
                <button
                  onClick={() => window.location.reload()}
                  className="mt-4 bg-black text-white px-4 py-2 hover:bg-gray-800"
                >
                  Try Again
                </button>
              </div>
            )}

            {/* No customers (after filtering out admins) */}
            {!loading &&
              !error &&
              customers.filter((c) => c.type !== "admin").length === 0 && (
                <div className="text-center text-gray-500">
                  <p className="text-lg mb-4">No customers found</p>
                  <p className="mb-6">
                    There are no customers in the system yet.
                  </p>
                  <button
                    onClick={() => navigate("/admin/dashboard")}
                    className="bg-black text-white px-6 py-2 hover:bg-gray-800"
                  >
                    Go Home
                  </button>
                </div>
              )}

            {/* Customers table/cards */}
            {!loading &&
              !error &&
              customers.filter((c) => c.type !== "admin").length > 0 && (
                <>
                  {/* Desktop Table */}
                  <div className="overflow-x-auto px-0 sm:px-4 hidden sm:block">
                    <table className="min-w-full text-sm border bg-white">
                      <thead className="bg-gray-200 text-left">
                        <tr>
                          <th className="p-3 font-medium">Name</th>
                          <th className="p-3 font-medium">ID</th>
                          <th className="p-3 font-medium">Email</th>
                          <th className="p-3 font-medium">Phone Number</th>
                          <th className="p-3 font-medium">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {customers
                          .filter((c) => c.type !== "admin")
                          .map((customer) => (
                            <tr
                              key={customer._id}
                              className="border-t hover:bg-gray-50"
                            >
                              <td className="p-3 font-mono text-xs">
                                {customer.name}
                              </td>
                              <td className="p-3">{customer._id}</td>
                              <td className="p-3">{customer.email}</td>
                              <td className="p-3">{customer.phone}</td>
                              <td className="p-3">
                                <button
                                  className="bg-gray-500 text-white px-3 py-2 hover:bg-gray-600 transition text-xs hover:cursor-pointer"
                                  onClick={() =>
                                    navigate(`/admin/customers/${customer._id}`)
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

                  {/* Mobile Cards */}
                  <div className="sm:hidden space-y-4 px-2">
                    {customers
                      .filter((c) => c.type !== "admin")
                      .map((customer) => (
                        <div
                          key={customer._id}
                          className="bg-white shadow-sm -lg p-4 border"
                        >
                          <div className="flex justify-between items-start mb-2">
                            <div className="flex flex-row">
                              <p className="font-mono text-xs text-gray-500">
                                Customer ID:
                              </p>
                              <p className="font-medium text-xs">
                                {customer._id}
                              </p>
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-2 text-sm text-gray-600 mb-3">
                            <div>
                              <span className="font-medium">Name:</span>{" "}
                              {customer.name}
                            </div>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-xs font-semibold">
                              {customer.email}
                              {customer.phone ? `  ${customer.phone}` : ""}
                            </span>
                            <button
                              onClick={() =>
                                navigate(`/admin/customers/${customer._id}`)
                              }
                              className="bg-gray-500 text-white px-3 py-2 hover:bg-gray-600 transition text-[8px] hover:cursor-pointer"
                            >
                              View Details
                            </button>
                          </div>
                        </div>
                      ))}
                  </div>
                </>
              )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminCustomers;
