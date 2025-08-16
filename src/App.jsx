import React from "react";
import { Route, Routes } from "react-router-dom";
import Home from "/src/pages/Home.jsx"; // ✅ Correct casing for file import
import Login from "./pages/Login.jsx"; // ✅ Correct casing for file import
import Shop from "./pages/Shop.jsx"; // ✅ Correct casing for file import
import Cart from "./pages/Cart.jsx"; // ✅ Correct casing for file import
import Checkout from "./pages/Checkout.jsx"; // ✅ Correct casing for file import
import Favourite from "./pages/Favourite.jsx";
import Order from "./pages/Order.jsx"; // ✅ Correct casing for file import
import OrderDetail from "./pages/OrderDetail.jsx"; // ✅ Correct casing for file import
import Profile from "./pages/Profile.jsx"; // ✅ Correct casing for file import
import Addresses from "./pages/Addresses.jsx"; // ✅ Correct casing for file import
import AccountDetails from "./pages/AccountDetails.jsx";
import ForgotPassword from "./pages/ForgotPassword.jsx";
import ResetPassword from "./pages/ResetPassword.jsx";
import { Navigate } from "react-router-dom";
import CategoryPage from "./pages/CategoryPage"; // You will create this
import ProductPage from "./pages/ProductPage"; // You will create this

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Home />}></Route>
        <Route path="/profile/loginPage" element={<Login />}></Route>
        <Route path="/forgot-password" element={<ForgotPassword />}></Route>
        <Route
          path="/reset-password/:userId/:resetToken"
          element={<ResetPassword />}
        ></Route>
        <Route path="/shop" element={<Navigate to="/shop/page/1" />} />
        <Route path="/shop/page/:pageNum" element={<Shop />} />

        <Route path="cart" element={<Cart />}></Route>
        <Route path="checkout" element={<Checkout />}></Route>
        <Route path="profile" element={<Profile />}></Route>
        <Route path="/profile/favourite" element={<Favourite />}></Route>
        <Route path="/profile/order" element={<Order />}></Route>
        <Route path="/profile/addresses" element={<Addresses />}></Route>
        <Route path="/profile/Details" element={<AccountDetails />}></Route>
        <Route path="/product-category/:category" element={<CategoryPage />} />
        <Route
          path="/product-category/:category/page/:pageNum"
          element={<CategoryPage />}
        />
        <Route path="/order/:orderId" element={<OrderDetail />} />
        <Route path="/product/:id" element={<ProductPage />} />
      </Routes>
    </div>
  );
}

export default App;
