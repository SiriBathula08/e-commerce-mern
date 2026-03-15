import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import verifyAdmin from "../middleware/verifyAdmin.js";

import {
  getAdminStats,
  getMonthlySales,
  getTopProducts
} from "../controllers/adminController.js";

const router = express.Router();

// Only Admin Access
router.get("/stats", authMiddleware, verifyAdmin, getAdminStats);
router.get("/sales", authMiddleware, verifyAdmin, getMonthlySales);
router.get("/top-products", authMiddleware, verifyAdmin, getTopProducts);

export default router;
