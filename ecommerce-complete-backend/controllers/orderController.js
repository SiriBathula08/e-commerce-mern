import Order from "../models/Order.js";
import Cart from "../models/Cart.js";
import Product from "../models/Product.js";

// ===============================================
// PLACE ORDER
// ===============================================
export const placeOrder = async (req, res) => {
  try {
    const userId = req.user.id;
    const { address } = req.body;

    // 1. Fetch user cart
    const cart = await Cart.findOne({ userId });

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    // 2. Calculate total amount
    let totalAmount = 0;

    for (let item of cart.items) {
      const product = await Product.findById(item.productId);
      if (!product) return res.status(404).json({ message: "Product not found" });

      totalAmount += product.price * item.quantity;

      // 3. Reduce product stock
      product.stock -= item.quantity;
      if (product.stock < 0) {
        return res.status(400).json({ message: "Product out of stock" });
      }
      await product.save();
    }

    // 4. Create order
    const order = await Order.create({
      userId,
      items: cart.items,
      amount: totalAmount,
      address,
      status: "Pending"
    });

    // 5. Empty cart
    cart.items = [];
    await cart.save();

    res.json({
      message: "Order placed successfully",
      order
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ===============================================
// GET USER ORDERS
// ===============================================
export const getUserOrders = async (req, res) => {
  try {
    const userId = req.user.id;
    const orders = await Order.find({ userId }).sort({ createdAt: -1 });

    res.json(orders);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ===============================================
// ADMIN: GET ALL ORDERS
// ===============================================
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate("userId").sort({ createdAt: -1 });

    res.json(orders);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
