const User = require("../models/Admin");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

// Get current user info
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password");
    if (!user) {
      return res.status(404).json({ message: "Current User not found" });
    }

    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update your getAllOrders function in orderController.js
exports.getAllOrders = async (req, res) => {
  try {
    console.log("getAllOrders called");
    console.log("User ID:", req.userId);

    // Check if user is admin
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    if (user.type !== "admin") {
      return res.status(403).json({ message: "Admin access required" });
    }

    // Fetch all orders for admin
    const orders = await Order.find().sort({ createdAt: -1 });
    console.log("Orders found:", orders.length);

    res.json(orders);
  } catch (error) {
    console.error("getAllOrders error:", error);
    res.status(500).json({ message: error.message });
  }
};
