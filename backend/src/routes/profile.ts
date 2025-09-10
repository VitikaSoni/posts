import express from "express";
import User from "../models/User";
import { authMiddleware, AuthRequest } from "../middleware/auth";
import { UpdateProfileRequest } from "../types/user";

const router = express.Router();

// Get user profile endpoint
router.get("/", authMiddleware, async (req: AuthRequest, res) => {
  try {
    const user = await User.findById(req.user!.userId).select(
      "name username role"
    );
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.json({
      name: user.name,
      username: user.username,
      role: user.role,
    });
  } catch (err) {
    return res.status(500).json({ message: "Internal server error" });
  }
});

// Update user profile endpoint
router.put("/", authMiddleware, async (req: AuthRequest, res) => {
  try {
    const { name }: UpdateProfileRequest = req.body;

    // Validate name
    if (!name || !name.trim()) {
      return res.status(400).json({ message: "Name is required" });
    }

    if (name.length > 20) {
      return res
        .status(400)
        .json({ message: "Name must be at most 20 characters" });
    }

    const user = await User.findByIdAndUpdate(
      req.user!.userId,
      { name: name.trim() },
      { new: true, select: "name username role" }
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.json({
      name: user.name,
      username: user.username,
      role: user.role,
    });
  } catch (err) {
    return res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
