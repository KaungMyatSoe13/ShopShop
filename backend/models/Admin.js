const mongoose = require("mongoose");

const AdminSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  phone: { type: String, default: "" },
  type: { type: String, enum: ["user", "admin"], default: "user" },
});

module.exports = mongoose.model("Admin", AdminSchema);
