// src/routes/AdminRoutes.jsx
import React from "react";
import { Route } from "react-router-dom";
import ProtectedRoute from "../components/ProtectedRoute";
import AdminHome from "../adminPages/AdminHome";
import AdminProduct from "../adminPages/AdminProducts";
import AddProduct from "../adminPages/AddProduct";
import AccountDetails from "../adminPages/AccountDetails";
import AdminOrders from "../adminPages/AdminOrders";
import AdminOrderDetails from "../adminPages/AdminOrderDetails";
import AdminCustomers from "../adminPages/AdminCustomers";
import AdminCustomerDetails from "../adminPages/AdminCustomerDetails";
import AdminEditProduct from "../adminPages/AdminEditProduct";

export const AdminRoutes = (
  <>
    <Route
      path="/admin/dashboard"
      element={
        <ProtectedRoute>
          <AdminHome />
        </ProtectedRoute>
      }
    />
    <Route
      path="/admin/products"
      element={
        <ProtectedRoute>
          <AdminProduct />
        </ProtectedRoute>
      }
    />
    <Route
      path="/admin/products/add"
      element={
        <ProtectedRoute>
          <AddProduct />
        </ProtectedRoute>
      }
    />
    <Route
      path="/admin/details"
      element={
        <ProtectedRoute>
          <AccountDetails />
        </ProtectedRoute>
      }
    />
    <Route
      path="/admin/orders"
      element={
        <ProtectedRoute>
          <AdminOrders />
        </ProtectedRoute>
      }
    />
    <Route
      path="/admin/order/:orderId"
      element={
        <ProtectedRoute>
          <AdminOrderDetails />
        </ProtectedRoute>
      }
    />
    <Route
      path="/admin/customers"
      element={
        <ProtectedRoute>
          <AdminCustomers />
        </ProtectedRoute>
      }
    />
    <Route
      path="/admin/customers/:userId"
      element={
        <ProtectedRoute>
          <AdminCustomerDetails />
        </ProtectedRoute>
      }
    />
    <Route
      path="/admin/products/:productId/edit"
      element={
        <ProtectedRoute>
          <AdminEditProduct />
        </ProtectedRoute>
      }
    />
  </>
);
