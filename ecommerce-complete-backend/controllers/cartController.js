import Cart from "../models/Cart.js";

// ===================================================================================
// ADD / UPDATE CART ITEM
// ===================================================================================
export const addToCart = async (req, res) => {
  try {
    const userId = req.user.id; // from JWT middleware
    const { productId, quantity } = req.body;

    let cart = await Cart.findOne({ userId });

    // If no cart exists → create new cart
    if (!cart) {
      cart = await Cart.create({
        userId,
        items: [{ productId, quantity }]
      });
      return res.json({ message: "Item added to cart", cart });
    }

    // If cart exists → check if product already present
    const itemIndex = cart.items.findIndex(
      (item) => item.productId.toString() === productId
    );

    if (itemIndex > -1) {
      // Product exists → update quantity
      cart.items[itemIndex].quantity += quantity;
    } else {
      // Product not in cart → add new item
      cart.items.push({ productId, quantity });
    }

    await cart.save();
    res.json({ message: "Cart updated", cart });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ===================================================================================
// GET USER CART
// ===================================================================================
export const getCart = async (req, res) => {
  try {
    const userId = req.user.id;

    const cart = await Cart.findOne({ userId }).populate("items.productId");

    if (!cart) {
      return res.json({ message: "Cart is empty", items: [] });
    }

    res.json(cart);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ===================================================================================
// REMOVE ITEM FROM CART
// ===================================================================================
export const removeFromCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId } = req.body;

    const cart = await Cart.findOne({ userId });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    // Remove matching product
    cart.items = cart.items.filter(
      (item) => item.productId.toString() !== productId
    );

    await cart.save();

    res.json({ message: "Item removed", cart });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
