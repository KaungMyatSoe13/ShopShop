// controllers/testAdminGetAllUsers.js
require("dotenv").config({ path: "../.env" });
const mongoose = require("mongoose");
const User = require("../models/User");
const jwt = require("jsonwebtoken");

async function testAdminGetAllUsers() {
  try {
    console.log("Connecting to MongoDB...");
    if (!process.env.MONGO_URI) throw new Error("MONGO_URI is not defined");

    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");

    // Find the admin user with the credentials you specified
    const admin = await User.findOne({
      email: "aa@gmail.com",
    });

    if (!admin) {
      console.log("Admin user not found. Creating admin user...");
      const bcrypt = require("bcryptjs");
      const hashedPassword = await bcrypt.hash("admin123", 10);

      const newAdmin = await User.create({
        name: "Admin",
        email: "aa@gmail.com",
        password: hashedPassword,
        type: "admin", // or role: "admin" depending on your schema
      });
      console.log("Created admin user:", newAdmin.email);
    } else {
      console.log("Found admin user:", admin.email);
    }

    // Test fetching all users (what your admin endpoint should do)
    console.log("\n=== TESTING GET ALL USERS ===");

    const allUsers = await User.find()
      .select("-password") // Exclude password field
      .sort({ createdAt: -1 }); // Most recent first

    console.log(`\nTotal users found: ${allUsers.length}`);
    console.log("\nUser details:");
    console.log("=" * 50);

    allUsers.forEach((user, index) => {
      console.log(`${index + 1}. Name: ${user.name}`);
      console.log(`   Email: ${user.email}`);
      console.log(`   Type/Role: ${user.type || user.role || "user"}`);
      console.log(`   Created: ${user.createdAt}`);
      console.log(`   Guest User: ${user.isGuest ? "Yes" : "No"}`);
      console.log(`   Verified: ${user.verified ? "Yes" : "No"}`);
      if (user.savedAddresses && user.savedAddresses.length > 0) {
        console.log(`   Addresses: ${user.savedAddresses.length}`);
      }
      console.log("   ---");
    });

    // Test user statistics
    console.log("\n=== USER STATISTICS ===");
    const totalUsers = allUsers.length;
    const adminUsers = allUsers.filter(
      (u) => u.type === "admin" || u.role === "admin"
    ).length;
    const regularUsers = totalUsers - adminUsers;
    const guestUsers = allUsers.filter((u) => u.isGuest).length;
    const verifiedUsers = allUsers.filter((u) => u.verified).length;

    console.log(`Total Users: ${totalUsers}`);
    console.log(`Admin Users: ${adminUsers}`);
    console.log(`Regular Users: ${regularUsers}`);
    console.log(`Guest Users: ${guestUsers}`);
    console.log(`Verified Users: ${verifiedUsers}`);

    // Test pagination simulation
    console.log("\n=== PAGINATION TEST ===");
    const page = 1;
    const limit = 5;
    const skip = (page - 1) * limit;

    const paginatedUsers = await User.find()
      .select("-password")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    console.log(
      `Page ${page} (showing ${paginatedUsers.length} of ${totalUsers}):`
    );
    paginatedUsers.forEach((user, index) => {
      console.log(`${skip + index + 1}. ${user.name} - ${user.email}`);
    });

    await mongoose.disconnect();
    console.log("\nDisconnected from MongoDB");
  } catch (err) {
    console.error("Error:", err);
    process.exit(1);
  }
}

testAdminGetAllUsers();
