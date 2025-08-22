// src/App.jsx
import React from "react";
import { Routes } from "react-router-dom";
import { UserRoutes } from "./routes/UserRoutes";
import { AdminRoutes } from "./routes/AdminRoutes";
import { PublicRoutes } from "./routes/PublicRoutes";

function App() {
  return (
    <Routes>
      {PublicRoutes}
      {UserRoutes}
      {AdminRoutes}
    </Routes>
  );
}

export default App;
