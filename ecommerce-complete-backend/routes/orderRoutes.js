import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import verifyAdmin from "../middleware/verifyAdmin.js";
import { placeOrder, getUserOrders, getAllOrders } from "../controllers/orderController.js";

const router = express.Router();

// USER: Place Order
router.post("/", authMiddleware, placeOrder);

// USER: Get Their Orders
router.get("/my-orders", authMiddleware, getUserOrders);

// ADMIN: Get All Orders
router.get("/", authMiddleware, verifyAdmin, getAllOrders);

export default router;
