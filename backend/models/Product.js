const mongoose = require("mongoose");
const productItemSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: String,
    mainCategory: String,
    subCategory: String,
    // images: [String], // Remove this line
    variants: [
      {
        color: {
          type: String,
          required: true,
        },
        images: [String], // Add images here in each variant
        sizes: [
          {
            size: {
              type: String,
              required: true,
            },
            stock: {
              type: Number,
              required: true,
              default: 0,
            },
          },
        ],
      },
    ],
    price: Number,
  },
  { _id: true }
);

const productSchema = new mongoose.Schema(
  {
    batchName: {
      type: String,
      required: true,
    },
    genders: {
      male: [productItemSchema],
      female: [productItemSchema],
      unisex: [productItemSchema], // You might want this too
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);
