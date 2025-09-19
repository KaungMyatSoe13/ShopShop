// src/components/ProtectedRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, requiredRole = "admin" }) => {
  const token = localStorage.getItem("token");
  const userRole = localStorage.getItem("userRole");

  if (!token) {
    return <Navigate to="/profile/loginPage" replace />;
  }

  if (requiredRole && userRole !== requiredRole) {
    return <Navigate to="/profile/loginPage" replace />;
  }

  return children;
};

export default ProtectedRoute;
