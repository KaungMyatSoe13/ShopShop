// controllers/testGetAllUsers.js
require("dotenv").config({ path: "../.env" }); // adjust path if needed
const mongoose = require("mongoose");
const User = require("../models/User"); // adjust path
const jwt = require("jsonwebtoken");

async function testGetAllUsers() {
  try {
    console.log("Connecting to MongoDB...");
    if (!process.env.MONGO_URI) throw new Error("MONGO_URI is not defined");

    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");

    // Optional: create an admin user if none exists for testing
    let admin = await User.findOne({ type: "admin" });
    if (!admin) {
      admin = await User.create({
        name: "Admin",
        email: "aa@gmail.com",
        password: "admin123",
        type: "admin",
      });
      console.log("Created test admin user");
    }

    // Simulate admin authentication by creating a token
    const token = jwt.sign(
      { id: admin._id, type: "admin" },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );
    console.log("Generated JWT token for admin:", token);

    // Fetch all users (simulate controller logic)
    const users = await User.find().sort({ createdAt: -1 });
    console.log(`Found ${users.length} users:`);
    users.forEach((u) => {
      console.log(`- ${u.name} | ${u.email} | role: ${u.role}`);
    });

    await mongoose.disconnect();
    console.log("Disconnected from MongoDB");
  } catch (err) {
    console.error("Error:", err);
  }
}

testGetAllUsers();
