const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    orderId: { type: String, unique: true, required: true },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
      default: null,
    },

    items: [
      {
        productId: {
          type: mongoose.Schema.Types.Mixed, // Change from ObjectId to Mixed
          required: true,
        },
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
      name: { type: String, required: true },
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
    // Add these fields to your Order schema
    isGuestOrder: {
      type: Boolean,
      default: false,
    },
    guestEmail: {
      type: String,
      required: function () {
        return this.isGuestOrder;
      },
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Order", orderSchema);
