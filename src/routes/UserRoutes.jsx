// src/routes/UserRoutes.jsx
import React from "react";
import { Route } from "react-router-dom";
import Profile from "../pages/Profile";
import Favourite from "../pages/Favourite";
import Order from "../pages/Order";
import Addresses from "../pages/Addresses";
import AccountDetails from "../pages/AccountDetails";
import OrderDetail from "../pages/OrderDetail";

export const UserRoutes = (
  <>
    <Route path="/profile" element={<Profile />} />
    <Route path="/profile/favourite" element={<Favourite />} />
    <Route path="/profile/order" element={<Order />} />
    <Route path="/profile/addresses" element={<Addresses />} />
    <Route path="/profile/details" element={<AccountDetails />} />
    <Route path="/order/:orderId" element={<OrderDetail />} />
  </>
);
