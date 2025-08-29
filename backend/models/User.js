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
      label: String, // "Home", "Office", etc.
      region: String,
      city: String,
      township: String,
      fullAddress: String,
      isDefault: { type: Boolean, default: false },
    },
  ],

  // Keep recent contact info
  phone: String,
  email: String,
});

module.exports = mongoose.model("User", UserSchema);
