// src/routes/PublicRoutes.jsx
import React from "react";
import { Route, Navigate } from "react-router-dom";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Shop from "../pages/Shop";
import Cart from "../pages/Cart";
import Checkout from "../pages/Checkout";
import ForgotPassword from "../pages/ForgotPassword";
import ResetPassword from "../pages/ResetPassword";
import CategoryPage from "../pages/CategoryPage";
import ProductPage from "../pages/ProductPage";
import OrderSuccess from "../pages/OrderSuccess";

export const PublicRoutes = (
  <>
    <Route path="/" element={<Home />} />
    <Route path="/profile/loginPage" element={<Login />} />
    <Route path="/forgot-password" element={<ForgotPassword />} />
    <Route
      path="/reset-password/:userId/:resetToken"
      element={<ResetPassword />}
    />
    <Route path="/shop" element={<Navigate to="/shop/page/1" />} />
    <Route path="/shop/page/:pageNum" element={<Shop />} />
    <Route path="/cart" element={<Cart />} />
    <Route path="/checkout" element={<Checkout />} />
    <Route path="/product-category/:category" element={<CategoryPage />} />
    <Route
      path="/product-category/:category/page/:pageNum"
      element={<CategoryPage />}
    />
    <Route path="/product/:id" element={<ProductPage />} />
    <Route path="/order-success/:orderId" element={<OrderSuccess />} />
  </>
);
