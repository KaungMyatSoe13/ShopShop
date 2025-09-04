import React from "react";
import { IoClipboardOutline } from "react-icons/io5";
import { BsBox2 } from "react-icons/bs";
import { BsPeople } from "react-icons/bs";
import { CiHeart } from "react-icons/ci";
import { CiLogout } from "react-icons/ci";
import { SlPeople } from "react-icons/sl";
import { MdOutlineInventory2 } from "react-icons/md";

import { useNavigate } from "react-router-dom";
import ProfileSideBar from "../adminComponents/ProfileSideBar";

function AdminHome() {
  const navigate = useNavigate();

  const handleCardClick = (item) => {
    if (item.name === "Logout") {
      localStorage.removeItem("token");
      navigate("/profile/loginPage");
    } else {
      navigate(`/admin/${item.path}`);
    }
  };

  const menuItems = [
    { name: "Dashboard", path: "dashboard" },
    { name: "Orders", path: "orders" },
    { name: "Products", path: "products" },
    { name: "Account Details", path: "details" },
    { name: "Customers", path: "customers" },
    // { name: "Inventory", path: "inventory" },
    { name: "Logout", path: "loginPage" },
  ];

  const cardItems = [
    { name: "Orders", icon: <IoClipboardOutline />, path: "orders" },
    { name: "Products", icon: <BsBox2 />, path: "products" },
    { name: "Account details", icon: <BsPeople />, path: "details" },
    { name: "Customers", icon: <SlPeople />, path: "customers" },
    // { name: "Inventory", icon: <MdOutlineInventory2 />, path: "inventory" },
    { name: "Logout", icon: <CiLogout />, path: "loginPage" },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex flex-1 justify-center h-full">
        <div className="flex flex-col sm:flex-row w-[95%] border my-4 ">
          <ProfileSideBar />

          <div className="flex-grow p-6 text-gray-700 bg-gray-50 w-full h-full">
            <div className="max-w-7xl mx-auto h-full">
              <div className="text-center flex justify-center">
                <p className="text-sm mt-2 max-w-xl">
                  Admin panel to manage products, orders, users, and store
                  operations.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-6 w-full h-[80%]">
                {cardItems.map((item) => (
                  <div
                    key={item.name}
                    onClick={() => handleCardClick(item)}
                    className="group border p-6 flex flex-col items-center justify-center text-center hover:shadow-md cursor-pointer bg-white hover:bg-gray-100"
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
    </div>
  );
}

export default AdminHome;
