// src/routes/AdminRoutes.jsx
import React from "react";
import { Route } from "react-router-dom";
import AdminHome from "../adminPages/AdminHome";
import AdminProduct from "../adminPages/AdminProducts";
import AddProduct from "../adminPages/AddProduct";
import AccountDetails from "../adminPages/AccountDetails";
import AdminOrders from "../adminPages/AdminOrders";
import AdminOrderDetails from "../adminPages/AdminOrderDetails";
import AdminCustomers from "../adminPages/AdminCustomers";
import AdminCustomerDetails from "../adminPages/AdminCustomerDetails";
import AdminEditProduct from "../adminPages/AdminEditProduct";

// Later: import Orders, Customers, etc.

export const AdminRoutes = (
  <>
    <Route path="/admin/dashboard" element={<AdminHome />} />
    <Route path="/admin/products" element={<AdminProduct />} />
    <Route path="/admin/products/add" element={<AddProduct />} />
    <Route path="/admin/details" element={<AccountDetails />} />
    <Route path="/admin/orders" element={<AdminOrders />} />
    <Route path="/admin/order/:orderId" element={<AdminOrderDetails />} />
    <Route path="/admin/customers" element={<AdminCustomers />} />
    <Route path="/admin/customers/:userId" element={<AdminCustomerDetails />} />
    <Route
      path="/admin/products/:productId/edit"
      element={<AdminEditProduct />}
    />
  </>
);
