import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import { getProfile, updateProfile } from "../controllers/profileController.js";

const router = express.Router();

// GET LOGGED-IN USER PROFILE
router.get("/", authMiddleware, getProfile);

// UPDATE PROFILE
router.put("/", authMiddleware, updateProfile);

export default router;
