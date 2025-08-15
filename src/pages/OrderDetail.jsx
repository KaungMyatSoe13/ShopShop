import React from "react";
import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function OrderDetail() {
  const { orderId } = useParams();

  const order = {
    id: "#2840",
    date: "July 8, 2025",
    status: "Processing",
    subtotal: "54,000 MMK",
    shipping: "3,000 MMK",
    total: "57,000 MMK",
    items: [
      {
        name: "MINUSX POSTAGE T-SHIRT BROWN",
        size: "MEDIUM",
        qty: 1,
        price: "54,000 MMK",
      },
    ],
    shippingDetails: {
      region: "YANGON",
      city: "YANGON",
      township: "Shwe Pyi Thar",
      payment: "Cash on Delivery",
      name: "Kaung Myat Soe",
      address: "Phone Gyi Kygg Bus stop myt sgg htoe, Kaung Su Store",
      phone: "09790686797",
      email: "kaungsoe132004@gmail.com",
    },
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100 text-sm">
      <Navbar />

      <div className="flex-grow">
        <div className="max-w-4xl mx-auto bg-white p-6 mt-6 shadow-md rounded">
          <h2 className="text-lg font-bold mb-4">
            Order {order.id} was placed on {order.date} and is currently{" "}
            <span className="text-yellow-600">{order.status}</span>.
          </h2>

          <h3 className="text-md font-semibold border-b pb-2 mb-4">
            Order Details
          </h3>
          {order.items.map((item, index) => (
            <div key={index} className="mb-4 border-b pb-2">
              <p className="font-medium">
                {item.name} × {item.qty}
              </p>
              <p className="text-gray-500">Size: {item.size}</p>
              <p className="font-semibold mt-1">{item.price}</p>
            </div>
          ))}

          <div className="mt-4 space-y-1 text-right">
            <p>
              Subtotal: <span className="font-medium">{order.subtotal}</span>
            </p>
            <p>
              Deliver to City (YANGON):{" "}
              <span className="font-medium">{order.shipping}</span>
            </p>
            <p className="text-md font-bold mt-2">Total: {order.total}</p>
          </div>

          <h3 className="text-md font-semibold border-b pb-2 mt-6 mb-4">
            Billing Details
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <p>
                <strong>Region:</strong> {order.shippingDetails.region}
              </p>
              <p>
                <strong>Deliver to City:</strong> {order.shippingDetails.city}
              </p>
              <p>
                <strong>Township:</strong> {order.shippingDetails.township}
              </p>
              <p>
                <strong>Payment Method:</strong> {order.shippingDetails.payment}
              </p>
            </div>
            <div>
              <p>
                <strong>Name:</strong> {order.shippingDetails.name}
              </p>
              <p>
                <strong>Address:</strong> {order.shippingDetails.address}
              </p>
              <p>
                <strong>Phone:</strong> {order.shippingDetails.phone}
              </p>
              <p>
                <strong>Email:</strong> {order.shippingDetails.email}
              </p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default OrderDetail;
