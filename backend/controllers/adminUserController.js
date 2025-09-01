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

module.exports = {
  getAllUsers,
};
