// controllers/testVariant.js
require("dotenv").config({ path: "../.env" }); // <-- point to your .env file if outside backend
const mongoose = require("mongoose");
const Product = require("../models/Product"); // adjust path

const variantId = "68ada3463692154d42078dbd";

async function testVariant() {
  try {
    console.log("Connecting to MongoDB Atlas...");
    console.log("MONGO_URI:", process.env.MONGO_URI);

    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI is not defined");
    }

    // Connect to Atlas
    await mongoose.connect(process.env.MONGO_URI);

    // Search for the variant across all genders
    const product = await Product.findOne({
      $or: [
        { "genders.male.variants._id": variantId },
        { "genders.female.variants._id": variantId },
        { "genders.unisex.variants._id": variantId },
      ],
    });

    if (!product) {
      console.log("Variant not found");
      return;
    }

    // Loop to find product item and variant
    for (const genderKey of ["male", "female", "unisex"]) {
      const items = product.genders[genderKey] || [];
      for (const item of items) {
        const variant = item.variants.find(
          (v) => v._id.toString() === variantId
        );
        if (variant) {
          console.log("Product Item Name:", item.name);
          console.log("Variant Color:", variant.color);
          console.log(
            "Variant Sizes:",
            variant.sizes.map((s) => s.size).join(", ")
          );
          break;
        }
      }
    }

    await mongoose.disconnect();
    console.log("Disconnected from MongoDB");
  } catch (err) {
    console.error("Error:", err);
  }
}

testVariant();
