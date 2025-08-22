const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const authRoutes = require("./routes/auth");

dotenv.config();

const app = express();
const PORT = 5000;

// Middleware

app.use(
  cors({
    origin: "http://localhost:5173", // Your frontend URL
    credentials: true,
  })
);
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
// Backward-compatibility redirects for older emailed links without /api/auth prefix
app.get("/user/verify/:userId/:uniqueString", (req, res) => {
  const { userId, uniqueString } = req.params;
  res.redirect(`/api/auth/user/verify/${userId}/${uniqueString}`);
});
app.get("/user/verified", (req, res) => {
  res.redirect(
    `/api/auth/user/verified${
      req.url.includes("?") ? req.url.slice(req.url.indexOf("?")) : ""
    }`
  );
});
app.use("/uploads", express.static("uploads"));

app.get("/", (req, res) => {
  res.send("Backend API is running!");
});

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI, {})
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });
