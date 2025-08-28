const Cart = require("../models/Cart");
const Product = require("../models/Product");

exports.addToCart = async (req, res) => {
  try {
    const { productId, quantity = 1, size } = req.body;
    const userId = req.userId;

    // Find the product by ID (using the new Product schema)
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // For the new Product schema, we need to find the right variant and size
    // Since your current implementation sends the main product ID, we'll work with that

    // Check if the requested size exists in any variant
    let foundVariant = null;
    let foundSize = null;

    for (const variant of product.variants) {
      const sizeData = variant.sizes.find((s) => s.size === size);
      if (sizeData && sizeData.stock >= quantity) {
        foundVariant = variant;
        foundSize = sizeData;
        break;
      }
    }

    if (!foundVariant || !foundSize) {
      return res.status(400).json({
        message: "Size not available or insufficient stock",
      });
    }

    // Create a unique identifier for this specific variant + size combination
    const variantId = foundVariant._id || foundVariant.color; // Use variant ID or color as fallback

    // Check if item already exists in cart
    const existingCartItem = await Cart.findOne({
      userId,
      productId: product._id,
      variantId: variantId,
      size,
    });

    if (existingCartItem) {
      // Update quantity
      existingCartItem.quantity += parseInt(quantity);
      await existingCartItem.save();
    } else {
      // Create new cart item
      const newCartItem = new Cart({
        userId,
        productId: product._id,
        variantId: variantId,
        quantity: parseInt(quantity),
        size,
        color: foundVariant.color,
        image: foundVariant.images?.[0] || "",
        price: product.price, // Use product price
        itemName: product.itemName,
        categoryName: product.mainCategory,
      });

      await newCartItem.save();
    }

    // Return updated cart
    const updatedCart = await Cart.find({ userId }).sort({ createdAt: -1 });
    res.json({
      message: "Item added to cart successfully",
      cart: updatedCart,
    });
  } catch (err) {
    console.error("Cart error:", err);
    res.status(500).json({ message: err.message });
  }
};

exports.getCart = async (req, res) => {
  try {
    const userId = req.userId;

    const cartItems = await Cart.find({ userId })
      .populate("productId")
      .sort({ createdAt: -1 });

    res.json({ cart: cartItems });
  } catch (err) {
    console.error("Get cart error:", err);
    res.status(500).json({ message: err.message });
  }
};

exports.updateCartItem = async (req, res) => {
  try {
    const { quantity } = req.body;
    const userId = req.userId;
    const cartItemId = req.params.itemId;

    const cartItem = await Cart.findOne({ _id: cartItemId, userId });

    if (!cartItem) {
      return res.status(404).json({ message: "Cart item not found" });
    }

    if (quantity <= 0) {
      await Cart.findByIdAndDelete(cartItemId);
      const updatedCart = await Cart.find({ userId }).sort({ createdAt: -1 });
      return res.json({
        message: "Item removed from cart",
        cart: updatedCart,
      });
    }

    cartItem.quantity = parseInt(quantity);
    await cartItem.save();

    const updatedCart = await Cart.find({ userId }).sort({ createdAt: -1 });
    res.json({
      message: "Cart updated",
      cart: updatedCart,
    });
  } catch (err) {
    console.error("Update cart error:", err);
    res.status(500).json({ message: err.message });
  }
};

exports.removeFromCart = async (req, res) => {
  try {
    const userId = req.userId;
    const cartItemId = req.params.itemId;

    const deletedItem = await Cart.findOneAndDelete({
      _id: cartItemId,
      userId,
    });

    if (!deletedItem) {
      return res.status(404).json({ message: "Cart item not found" });
    }

    const updatedCart = await Cart.find({ userId }).sort({ createdAt: -1 });
    res.json({
      message: "Item removed from cart",
      cart: updatedCart,
    });
  } catch (err) {
    console.error("Remove cart error:", err);
    res.status(500).json({ message: err.message });
  }
};

exports.clearCart = async (req, res) => {
  try {
    const userId = req.userId;

    await Cart.deleteMany({ userId });

    res.json({ message: "Cart cleared successfully" });
  } catch (err) {
    console.error("Clear cart error:", err);
    res.status(500).json({ message: err.message });
  }
};
