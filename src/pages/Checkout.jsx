import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import BillingDetailForm from "../components/BillingDetailForm";
import OrderDetail from "../components/OrderDetail";

function Checkout() {
  return (
    <div className="flex flex-col h-screen">
      <Navbar />
      <div className="flex flex-col items-center mb-10 mt-10">
        <div className="w-[95%] flex flex-col sm:flex-row gap-5">
          <BillingDetailForm />
          <OrderDetail />
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default Checkout;
