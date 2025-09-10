import { Request, Response } from "express";
import bcrypt from "bcrypt";
import User from "../models/User";
import { CreateUserRequest, LoginRequest } from "../types/user";
import {
  createAccessToken,
  createRefreshToken,
  verifyRefreshToken,
} from "../utils/jwt";

export const authController = {
  async register(req: Request, res: Response) {
    try {
      const { name, username, password, role }: CreateUserRequest = req.body;
      const hashedPassword = await bcrypt.hash(password, 10);

      const user = await User.create({
        name,
        username,
        password: hashedPassword,
        role,
      });

      res.status(201).json({
        message: "User registered successfully",
        userId: user._id,
      });
    } catch (err: any) {
      if (err.code === 11000) {
        // MongoDB duplicate key error
        res.status(400).json({ message: "Username already exists" });
      } else {
        res.status(400).json({
          message: "Error creating user",
          error: err.message,
        });
      }
    }
  },

  async login(req: Request, res: Response) {
    try {
      const { username, password }: LoginRequest = req.body;
      const user = await User.findOne({ username });

      if (!user) {
        return res.status(400).json({ message: "Invalid credentials" });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: "Invalid credentials" });
      }

      const accessToken = createAccessToken(user);
      const refreshToken = createRefreshToken(user);

      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: false, // must be false for localhost http
        sameSite: "lax", // "lax" works for localhost
        path: "/", // cookie accessible from all endpoints
      });

      return res.json({
        accessToken,
        message: "Login successful",
      });
    } catch (error) {
      return res.status(500).json({ message: "Internal server error" });
    }
  },

  async refreshToken(req: Request, res: Response) {
    const token = req.cookies.refreshToken;
    if (!token) {
      return res.status(401).json({ message: "Refresh token not provided" });
    }

    try {
      const payload = verifyRefreshToken(token) as {
        userId: string;
        role: string;
      };
      const user = await User.findById(payload.userId);

      if (!user) {
        return res.status(401).json({ message: "Invalid refresh token" });
      }

      const accessToken = createAccessToken(user);
      return res.json({ accessToken });
    } catch (err) {
      return res.status(401).json({ message: "Invalid refresh token" });
    }
  },

  async logout(req: Request, res: Response) {
    res.clearCookie("refreshToken", {
      httpOnly: true,
      sameSite: "lax",
      secure: false,
      path: "/",
    });
    res.json({ message: "Logged out successfully" });
  },
};
