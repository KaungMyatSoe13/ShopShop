const Cart = require("../models/Cart");
const Product = require("../models/Product");

exports.addToCart = async (req, res) => {
  try {
    const { productId, quantity = 1, size } = req.body;
    const userId = req.userId;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Find the right variant and size
    let foundVariant = null;
    let foundSize = null;

    for (const variant of product.variants) {
      const sizeData = variant.sizes.find((s) => s.size === size);
      if (sizeData) {
        foundVariant = variant;
        foundSize = sizeData;
        break;
      }
    }

    if (!foundVariant || !foundSize) {
      return res.status(400).json({
        message: "Size not available",
      });
    }

    // Check if sufficient stock available
    if (foundSize.stock < quantity) {
      return res.status(400).json({
        message: `Only ${foundSize.stock} items available in stock`,
        availableStock: foundSize.stock,
      });
    }

    // Check existing cart item to prevent over-adding
    const existingCartItem = await Cart.findOne({
      userId,
      productId: product._id,
      variantId: foundVariant._id || foundVariant.color,
      size,
    });

    if (existingCartItem) {
      const totalQuantity = existingCartItem.quantity + parseInt(quantity);
      if (totalQuantity > foundSize.stock) {
        return res.status(400).json({
          message: `Cannot add ${quantity} more. Only ${
            foundSize.stock - existingCartItem.quantity
          } available (you already have ${existingCartItem.quantity} in cart)`,
          availableStock: foundSize.stock,
          currentInCart: existingCartItem.quantity,
        });
      }
      existingCartItem.quantity = totalQuantity;
      await existingCartItem.save();
    } else {
      const newCartItem = new Cart({
        userId,
        productId: product._id,
        variantId: foundVariant._id || foundVariant.color,
        quantity: parseInt(quantity),
        size,
        color: foundVariant.color,
        image: foundVariant.images?.[0] || "",
        price: product.price,
        itemName: product.itemName,
        categoryName: product.mainCategory,
      });
      await newCartItem.save();
    }

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
