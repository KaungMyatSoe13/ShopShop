import React from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ProfileSideBar from "../components/ProfileSideBar";

function Order() {
  const navigate = useNavigate();
  const orders = [
    {
      id: "#2840",
      date: "July 8, 2025",
      status: "Processing",
      total: "57,000 MMK",
      items: [{ name: "Casual Polo Shirt", qty: 1 }],
    },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <div className="flex flex-1 justify-center h-full">
        <div className="flex flex-col sm:flex-row w-[95%] border">
          <ProfileSideBar />

          <div className="flex-grow p-6 text-gray-700 bg-gray-50 w-full h-full">
            <div className="max-w-7xl mx-auto h-full w-full">
              <h1 className="text-2xl font-bold mb-6 ml-6 font-playfair">
                My Orders
              </h1>

              {/* Desktop Table */}
              <div className="overflow-x-auto px-4 hidden sm:block">
                <table className="min-w-full text-sm border">
                  <thead className="bg-gray-200 text-left">
                    <tr>
                      <th className="p-2">Order</th>
                      <th className="p-2">Date</th>
                      <th className="p-2">Status</th>
                      <th className="p-2">Total</th>
                      <th className="p-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order) => (
                      <tr key={order.id} className="border-t">
                        <td className="p-2">{order.id}</td>
                        <td className="p-2">{order.date}</td>
                        <td className="p-2 text-yellow-600">{order.status}</td>
                        <td className="p-2">
                          {order.total} for {order.items.length} item
                        </td>
                        <td className="p-2">
                          <button
                            className="text-gray-500 underline hover:cursor-pointer"
                            onClick={() =>
                              navigate(`/order/${order.id.replace("#", "")}`)
                            }
                          >
                            View
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
                    key={order.id}
                    className="bg-white shadow-sm rounded px-1 border"
                  >
                    <div className="flex justify-between items-center ">
                      <span className="font-semibold">{order.id}</span>
                      <span className="text-yellow-600 text-sm">
                        {order.status}
                      </span>
                    </div>
                    <div className="text-sm text-gray-500 mb-2 mt-2">
                      {order.date}
                    </div>
                    <div className="text-sm mb-1">
                      {order.total} for {order.items.length} item
                    </div>
                    <button
                      onClick={() =>
                        navigate(`/order/${order.id.replace("#", "")}`)
                      }
                      className=" text-sm text-gray-500 underline mt-2"
                    >
                      View
                    </button>
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
