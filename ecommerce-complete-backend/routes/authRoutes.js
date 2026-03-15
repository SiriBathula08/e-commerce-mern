import express from "express";
import { registerUser, loginUser } from "../controllers/authController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);

// Protected Route Test
router.get("/me", authMiddleware, (req, res) => {
    res.json({
        message: "Token valid",
        user: req.user
    });
});

export default router;
