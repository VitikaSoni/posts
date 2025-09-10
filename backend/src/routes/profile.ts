import express from "express";
import { authMiddleware } from "../middleware/auth";
import { profileController } from "../controllers/profileController";

const router = express.Router();

// Profile routes
router.get("/", authMiddleware, profileController.getProfile);
router.put("/", authMiddleware, profileController.updateProfile);

export default router;
