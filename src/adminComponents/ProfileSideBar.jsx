import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { RiArrowDropDownLine } from "react-icons/ri";

function ProfileSideBar() {
  const navigate = useNavigate();
  const [showProductsMenu, setShowProductsMenu] = useState(false);

  const menuItems = [
    { name: "Dashboard", path: "dashboard" },
    { name: "Orders", path: "orders" },
    {
      name: "Products",
      dropdown: [
        { name: "Add Product", path: "products/add" },
        { name: "Product List", path: "products" },
      ],
    },
    { name: "Account Details", path: "details" },
    { name: "Customers", path: "customers" },
    { name: "Inventory", path: "inventory" },
    { name: "Logout", path: "loginPage" },
  ];

  return (
    <div className="flex flex-col sm:w-[20%] pl-4 py-6 items-center sm:items-start justify-center sm:justify-start h-full">
      <div className="text-xl font-playfair font-bold mb-4">Admin Panel</div>
      <hr className="border-t border-gray-300 w-[70%] my-2" />
      <div className="flex flex-col items-center sm:items-start w-full">
        {menuItems.map((item, idx) => (
          <div key={idx} className="w-full">
            {item.dropdown ? (
              <div className="">
                <div
                  onClick={() => setShowProductsMenu(!showProductsMenu)}
                  className="flex items-center justify-center sm:justify-start text-lg py-3 pl-2 hover:bg-gray-200 cursor-pointer sm:w-full text-center sm:text-left"
                >
                  <span>{item.name}</span>
                  <RiArrowDropDownLine
                    className={`transition-transform duration-200 ${
                      showProductsMenu ? "rotate-180" : "rotate-0"
                    }`}
                    size={24}
                  />
                </div>
                <div
                  className={`overflow-hidden transition-all duration-300 ${
                    showProductsMenu ? "max-h-40" : "max-h-0"
                  }`}
                >
                  {item.dropdown.map((subItem, subIdx) => (
                    <div
                      key={subIdx}
                      onClick={() => navigate(`/admin/${subItem.path}`)}
                      className="text-md py-2 pl-6 hover:bg-gray-100 cursor-pointer w-full text-center sm:text-left "
                    >
                      {subItem.name}
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div
                onClick={() =>
                  navigate(
                    item.name === "Logout"
                      ? "/profile/loginPage"
                      : `/admin/${item.path}`
                  )
                }
                className="text-lg py-3 pl-2 hover:bg-gray-200 cursor-pointer w-full text-center sm:text-left"
              >
                {item.name}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default ProfileSideBar;
