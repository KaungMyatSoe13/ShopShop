const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  displayName: { type: String },
  phone: { type: String, default: "" },
  verified: { type: Boolean, default: false },
  googleId: { type: String }, // Add this field
  authMethod: {
    type: String,
    enum: ["manual", "google", "both"],
    default: "manual",
  }, // Track auth method
  type: { type: String, enum: ["user", "admin"], default: "user" },

  savedAddresses: [
    {
      name: String,
      email: { type: String, required: true },
      phone: { type: String, required: true },
      label: { type: String, default: "Default" },
      township: String,
      fullAddress: String,
      isDefault: { type: Boolean, default: false },
    },
  ],

  // Add these fields to your User schema
  isGuest: {
    type: Boolean,
    default: false,
  },
  // Make password optional for guest users
  password: {
    type: String,
    required: function () {
      return !this.isGuest;
    },
  },
});

module.exports = mongoose.model("User", UserSchema);
