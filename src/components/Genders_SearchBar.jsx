import { NavLink } from "react-router-dom";

function Genders_SearchBar() {
  return (
    <div className="ml-7.5 sm:ml-13 flex flex-col font-playfair text-primary text-sm">
      <div className="flex flex-col mb-3 text-gray-500 w-[20%]">
        <NavLink
          to="/product-category/men"
          className="cursor-pointer hover:text-black transition-colors duration-300"
        >
          MEN
        </NavLink>

        <NavLink
          to="/product-category/women"
          className="cursor-pointer hover:text-black transition-colors duration-300"
        >
          WOMEN
        </NavLink>
        <NavLink
          to="/product-category/kids"
          className="cursor-pointer hover:text-black transition-colors duration-300"
        >
          KIDS
        </NavLink>
      </div>
    </div>
  );
}

export default Genders_SearchBar;
