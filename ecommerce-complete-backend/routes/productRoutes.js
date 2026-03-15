import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import verifyAdmin from "../middleware/verifyAdmin.js";
import {
  addProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct
} from "../controllers/productController.js";

const router = express.Router();

// ADMIN CAN ADD PRODUCTS
router.post("/", authMiddleware, verifyAdmin, addProduct);

// GET ALL PRODUCTS
router.get("/", getProducts);

// GET SINGLE PRODUCT
router.get("/:id", getProductById);

// 🔥 UPDATE PRODUCT (PUT)
router.put("/:id", authMiddleware, verifyAdmin, updateProduct);

// 🔥 DELETE PRODUCT
router.delete("/:id", authMiddleware, verifyAdmin, deleteProduct);

export default router;
