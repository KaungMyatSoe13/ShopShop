import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ProfileSideBar from "../components/ProfileSideBar";

function Addresses() {
  const billingAddress = {
    name: "Kaung Myat Soe",
    address: "Phone Gyi Kygg Bus stop myt sgg htoe, Kaung Su Store",
    region: "Yangon",
    city: "Yangon",
    township: "Shwe Pyi Thar",
    phone: "09790686797",
    email: "kaungsoe132004@gmail.com",
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
                <h2 className="text-lg font-semibold mb-2">Billing Address</h2>
                <p className="text-sm leading-relaxed">
                  <strong>{billingAddress.name}</strong>
                  <br />
                  {billingAddress.address}
                  <br />
                  {billingAddress.township}, {billingAddress.city}
                  <br />
                  {billingAddress.region}
                  <br />
                  {billingAddress.phone}
                  <br />
                  {billingAddress.email}
                </p>
                <div className="mt-4 text-right">
                  <button className="text-gray-400 text-sm underline hover:text-gray-800 hover:cursor-pointer">
                    Edit Billing Address
                  </button>
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
