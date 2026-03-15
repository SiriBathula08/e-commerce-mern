import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import { addToWishlist, removeFromWishlist, getWishlist } from "../controllers/wishlistController.js";

const router = express.Router();

router.post("/", authMiddleware, addToWishlist);
router.delete("/", authMiddleware, removeFromWishlist);
router.get("/", authMiddleware, getWishlist);

export default router;
