import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import { addToCart, getCart, removeFromCart } from "../controllers/cartController.js";

const router = express.Router();

// Add/Update Cart Item
router.post("/add", authMiddleware, addToCart);

// Get User Cart
router.get("/", authMiddleware, getCart);

// Remove Item From Cart
router.post("/remove", authMiddleware, removeFromCart);

export default router;
