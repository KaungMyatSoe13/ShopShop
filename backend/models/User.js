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
  // In User.js
  cart: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
      quantity: { type: Number, default: 0 },
      size: { type: String },
      color: { type: String }, // Add this line

      image: { type: String }, // Add this line
      price: { type: Number }, // Add this line
      subCategory: { type: String }, // Add this line
      addedAt: { type: Date, default: Date.now },
    },
  ],
});

module.exports = mongoose.model("User", UserSchema);
