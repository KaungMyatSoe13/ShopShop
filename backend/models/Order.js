const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    orderId: { type: String, unique: true, required: true },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    items: [
      {
        productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
        itemName: String,
        size: String,
        color: String,
        price: Number,
        quantity: Number,
        image: String,
      },
    ],

    subtotal: { type: Number, required: true },
    shippingCost: { type: Number, required: true },
    total: { type: Number, required: true },

    shippingAddress: {
      email: { type: String, required: true },
      phone: { type: String, required: true },
      region: { type: String, required: true },
      city: { type: String, required: true },
      township: { type: String, required: true },
      fullAddress: { type: String, required: true },
      deliveryNotes: String,
    },

    payment: {
      method: { type: String, enum: ["cod", "kbzpay"], required: true },
      status: {
        type: String,
        enum: ["pending", "paid", "failed"],
        default: "pending",
      },
      paidAt: Date,
      transactionId: String,
    },

    status: {
      type: String,
      enum: [
        "pending",
        "confirmed",
        "processing",
        "shipped",
        "delivered",
        "cancelled",
      ],
      default: "pending",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Order", orderSchema);
