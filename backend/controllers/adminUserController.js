const User = require("../models/User");

const getAllUsers = async (req, res) => {
  try {
    // Get the admin user first to verify permissions
    const adminUser = await User.findById(req.userId);

    if (!adminUser) {
      return res.status(401).json({ message: "Admin user not found" });
    }

    // Check if user is actually an admin
    if (adminUser.type !== "admin") {
      return res
        .status(403)
        .json({ message: "Access denied. Admin privileges required." });
    }

    console.log("Admin getting all users - Admin user:", adminUser.name);

    // Fetch all users
    const users = await User.find().sort({ createdAt: -1 });
    console.log(`Found ${users.length} users`);

    res.json(users);
  } catch (error) {
    console.error("Get all users error:", error);
    res.status(500).json({ message: error.message });
  }
};

// Get single customer details
const getCustomerDetails = async (req, res) => {
  try {
    const { userId } = req.params;

    // Verify admin permissions
    const adminUser = await User.findById(req.userId);
    if (!adminUser || adminUser.type !== "admin") {
      return res
        .status(403)
        .json({ message: "Access denied. Admin privileges required." });
    }

    // Get customer details (excluding password)
    const customer = await User.findById(userId).select("-password");
    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    res.json(customer);
  } catch (error) {
    console.error("Get customer details error:", error);
    res.status(500).json({ message: error.message });
  }
};

// Get customer's orders
const getCustomerOrders = async (req, res) => {
  try {
    const { userId } = req.params;
    const Order = require("../models/Order");

    // Verify admin permissions
    const adminUser = await User.findById(req.userId);
    if (!adminUser || adminUser.type !== "admin") {
      return res
        .status(403)
        .json({ message: "Access denied. Admin privileges required." });
    }

    // Get customer's orders
    const orders = await Order.find({ userId }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    console.error("Get customer orders error:", error);
    res.status(500).json({ message: error.message });
  }
};

// Delete customer account
const deleteCustomer = async (req, res) => {
  try {
    const { userId } = req.params;
    const Order = require("../models/Order");

    // Verify admin permissions
    const adminUser = await User.findById(req.userId);
    if (!adminUser || adminUser.type !== "admin") {
      return res
        .status(403)
        .json({ message: "Access denied. Admin privileges required." });
    }

    // Check if trying to delete another admin
    const customerToDelete = await User.findById(userId);
    if (!customerToDelete) {
      return res.status(404).json({ message: "Customer not found" });
    }

    if (customerToDelete.type === "admin") {
      return res.status(403).json({ message: "Cannot delete admin accounts" });
    }

    // Delete customer's orders first
    await Order.deleteMany({ userId });

    // Delete the customer
    await User.findByIdAndDelete(userId);

    res.json({ message: "Customer and associated data deleted successfully" });
  } catch (error) {
    console.error("Delete customer error:", error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllUsers,
  getCustomerDetails,
  getCustomerOrders,
  deleteCustomer,
};
