const mongoose = require("mongoose");

const PasswordResetSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  resetToken: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  expiresAt: { type: Date, required: true },
});

module.exports = mongoose.model("PasswordReset", PasswordResetSchema);
