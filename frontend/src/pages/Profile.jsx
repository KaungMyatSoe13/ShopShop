import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { IoClipboardOutline } from "react-icons/io5";
import { IoLocationOutline } from "react-icons/io5";
import { BsPeople } from "react-icons/bs";
import { CiHeart } from "react-icons/ci";
import { CiLogout } from "react-icons/ci";
import { useNavigate } from "react-router-dom";
import ProfileSideBar from "../components/ProfileSideBar";

function Profile() {
  const navigate = useNavigate();

  const handleCardClick = (item) => {
    if (item.name === "Logout") {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("userRole");
      // After logout
      window.dispatchEvent(new CustomEvent("authStateChanged"));
      navigate("/");
    } else {
      navigate(`/profile/${item.path}`);
    }
  };

  const menuItems = [
    { name: "Dashboard", path: "dashboard" },
    { name: "Orders", path: "order" },
    { name: "Addresses", path: "addresses" },
    { name: "Account Details", path: "details" },
    { name: "Favourites", path: "favourites" },
    { name: "Logout", path: "loginPage" },
  ];

  const cardItems = [
    { name: "Orders", icon: <IoClipboardOutline />, path: "order" },
    { name: "Addresses", icon: <IoLocationOutline />, path: "addresses" },
    { name: "Account details", icon: <BsPeople />, path: "details" },
    { name: "Wishlist", icon: <CiHeart />, path: "favourites" },
    { name: "Logout", icon: <CiLogout />, path: "loginPage" },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="flex flex-1 justify-center h-full">
        <div className="flex flex-col sm:flex-row w-[95%] border ">
          <ProfileSideBar />

          <div className="flex-grow p-6 text-gray-700 bg-gray-50 w-full h-full">
            <div className="max-w-7xl mx-auto h-full">
              <div className="text-center flex justify-center">
                <p className="text-sm mt-2 max-w-xl">
                  From your account dashboard you can view your{" "}
                  <span className="font-semibold">recent orders</span>,{" "}
                  <span className="font-semibold">manage</span> your shipping
                  and billing addresses, and edit your password and account
                  details.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-6 w-full h-[80%]">
                {cardItems.map((item) => (
                  <div
                    key={item.name}
                    onClick={() => handleCardClick(item)}
                    className="group border p-6 flex flex-col items-center text-center hover:shadow-md cursor-pointer bg-white hover:bg-gray-100"
                  >
                    <div className="text-6xl mb-3 text-gray-500 group-hover:text-gray-900 transition-colors">
                      {item.icon}
                    </div>
                    <div className="font-semibold">{item.name}</div>
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

export default Profile;
