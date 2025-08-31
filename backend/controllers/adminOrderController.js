const Order = require("../models/Order");
const User = require("../models/User");

// Admin middleware function to check if user is admin
const checkAdminAccess = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    if (user.type !== "admin") {
      return res.status(403).json({ message: "Admin access required" });
    }

    req.adminUser = user; // Store admin user info for use in controller
    next();
  } catch (error) {
    console.error("Admin access check error:", error);
    res.status(500).json({ message: "Server error in admin verification" });
  }
};

// Get all orders (Admin only)
const getAllOrders = async (req, res) => {
  try {
    console.log("Admin getting all orders - Admin user:", req.adminUser.name);

    // Fetch all orders with user population for better admin view
    const orders = await Order.find()
      .populate("userId", "name email") // Populate user details if userId exists
      .sort({ createdAt: -1 });

    console.log(`Found ${orders.length} orders`);

    res.json(orders);
  } catch (error) {
    console.error("Get all orders error:", error);
    res.status(500).json({ message: error.message });
  }
};

// Get order statistics (Admin only)
const getOrderStats = async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments();
    const pendingOrders = await Order.countDocuments({ status: "pending" });
    const completedOrders = await Order.countDocuments({ status: "completed" });
    const cancelledOrders = await Order.countDocuments({ status: "cancelled" });

    // Calculate total revenue
    const revenueResult = await Order.aggregate([
      { $match: { status: "completed" } },
      { $group: { _id: null, totalRevenue: { $sum: "$total" } } },
    ]);

    const totalRevenue = revenueResult[0]?.totalRevenue || 0;

    // Get recent orders
    const recentOrders = await Order.find()
      .populate("userId", "name email")
      .sort({ createdAt: -1 })
      .limit(5);

    res.json({
      totalOrders,
      pendingOrders,
      completedOrders,
      cancelledOrders,
      totalRevenue,
      recentOrders,
    });
  } catch (error) {
    console.error("Get order stats error:", error);
    res.status(500).json({ message: error.message });
  }
};

// Update order status (Admin only)
const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = [
      "pending",
      "processing",
      "shipped",
      "delivered",
      "cancelled",
    ];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    let order;

    // Try to find by orderId first (string format like "ORD-...")
    if (id.startsWith("ORD-")) {
      order = await Order.findOneAndUpdate(
        { orderId: id },
        { status, updatedAt: new Date() },
        { new: true }
      );
    } else {
      // Try to find by MongoDB _id
      order = await Order.findByIdAndUpdate(
        id,
        { status, updatedAt: new Date() },
        { new: true }
      );
    }

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    console.log(
      `Admin ${req.adminUser.name} updated order ${order.orderId} status to ${status}`
    );

    res.json({
      message: "Order status updated successfully",
      order,
    });
  } catch (error) {
    console.error("Update order status error:", error);
    res.status(500).json({ message: error.message });
  }
};

// Get single order details (Admin only)
const getOrderDetails = async (req, res) => {
  try {
    const { id } = req.params;
    let order;

    // Try to find by orderId first (string format like "ORD-...")
    if (id.startsWith("ORD-")) {
      order = await Order.findOne({ orderId: id }).populate(
        "userId",
        "name email"
      );
    } else {
      // Try to find by MongoDB _id
      order = await Order.findById(id).populate("userId", "name email");
    }

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json(order);
  } catch (error) {
    console.error("Get order details error:", error);
    res.status(500).json({ message: error.message });
  }
};

// Search orders (Admin only)
const searchOrders = async (req, res) => {
  try {
    const { query, status, startDate, endDate } = req.query;

    let searchQuery = {};

    // Text search in order ID or customer email
    if (query) {
      searchQuery.$or = [
        { orderId: { $regex: query, $options: "i" } },
        { guestEmail: { $regex: query, $options: "i" } },
        { "shippingAddress.email": { $regex: query, $options: "i" } },
        { "shippingAddress.name": { $regex: query, $options: "i" } },
      ];
    }

    // Filter by status
    if (status && status !== "all") {
      searchQuery.status = status;
    }

    // Filter by date range
    if (startDate || endDate) {
      searchQuery.createdAt = {};
      if (startDate) {
        searchQuery.createdAt.$gte = new Date(startDate);
      }
      if (endDate) {
        searchQuery.createdAt.$lte = new Date(endDate + "T23:59:59.999Z");
      }
    }

    const orders = await Order.find(searchQuery)
      .populate("userId", "name email")
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    console.error("Search orders error:", error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  checkAdminAccess,
  getAllOrders,
  getOrderStats,
  updateOrderStatus,
  getOrderDetails,
  searchOrders,
};
