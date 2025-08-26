import React from "react";
import { Routes } from "react-router-dom";
import { UserRoutes } from "./routes/UserRoutes";
import { AdminRoutes } from "./routes/AdminRoutes";
import { PublicRoutes } from "./routes/PublicRoutes";
import { CartProvider } from "./context/CartContext";

function App() {
  return (
    <CartProvider>
      <Routes>
        {PublicRoutes}
        {UserRoutes}
        {AdminRoutes}
      </Routes>
    </CartProvider>
  );
}

export default App;
