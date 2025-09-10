import express from "express";
import cookieParser from "cookie-parser";
import { authController } from "../controllers/authController";

const router = express.Router();
router.use(cookieParser());

router.post("/register", authController.register);
router.post("/login", authController.login);
router.post("/refresh_token", authController.refreshToken);
router.post("/logout", authController.logout);

export default router;
