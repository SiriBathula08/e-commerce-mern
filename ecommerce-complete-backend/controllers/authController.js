import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// ------------------ REGISTER ------------------
export const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // check if email already exists
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: "Email already exists" });
        }

        // hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // create new user
        const user = await User.create({
            name,
            email,
            password: hashedPassword
        });

        res.json({ message: "User registered successfully", user });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ------------------ LOGIN ------------------
export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // find user
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Invalid email" });
        }

        // check password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid password" });
        }

        // generate JWT
        const token = jwt.sign(
            { id: user._id, isAdmin: user.isAdmin },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        res.json({ message: "Login successful", token });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
