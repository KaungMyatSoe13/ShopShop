import React from "react";
import { useNavigate } from "react-router-dom";

function ProfileSideBar() {
  const navigate = useNavigate();
  const menuItems = [
    { name: "Dashboard", path: "" },
    { name: "Orders", path: "order" },
    { name: "Addresses", path: "addresses" },
    { name: "Account Details", path: "details" },
    { name: "Favourites", path: "favourites" },
    { name: "Logout", path: "loginPage" },
  ];

  return (
    <div className="flex flex-col sm:w-[20%] pl-4 py-6 items-center sm:items-start justify-center sm:justify-start h-full">
      <div className="text-xl font-playfair font-bold mb-4">My Account</div>
      <hr className="border-t border-gray-300 w-[70%] my-2" />
      <div className="flex flex-col items-center sm:items-start w-full">
        {menuItems.map((item, idx) => (
          <div
            key={idx}
            onClick={() => navigate(`/profile/${item.path}`)}
            className="text-lg py-3 pl-2 hover:bg-gray-200 cursor-pointer w-full text-center sm:text-left"
          >
            {item.name}
          </div>
        ))}
      </div>
    </div>
  );
}

export default ProfileSideBar;
