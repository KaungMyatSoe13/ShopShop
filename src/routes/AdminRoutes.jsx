// src/routes/AdminRoutes.jsx
import React from "react";
import { Route } from "react-router-dom";
import AdminHome from "../adminPages/adminHome";
import Product from "../adminPages/Product";
import AddProduct from "../adminPages/AddProduct";
import AccountDetails from "../adminPages/AccountDetails";
// Later: import Orders, Customers, etc.

export const AdminRoutes = (
  <>
    <Route path="/admin/dashboard" element={<AdminHome />} />
    <Route path="/admin/products" element={<Product />} />
    <Route path="/admin/products/add" element={<AddProduct />} />
    <Route path="/admin/details" element={<AccountDetails />} />
  </>
);
