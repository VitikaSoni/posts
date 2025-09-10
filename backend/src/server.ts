import dotenv from "dotenv";

// Load environment variables first
dotenv.config();

import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import mongoose from "mongoose";
import { createClient } from "redis";
import authRoutes from "./routes/auth";
import postsRoutes from "./routes/posts";
import profileRoutes from "./routes/profile";
import cookieParser from "cookie-parser";

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(helmet());
app.use(
  cors({
    origin: process.env.FRONTEND_URL, // Vite default port
    credentials: true, // Allow cookies and credentials
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Cookie"],
  })
);
app.use(morgan("combined"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  throw new Error("MONGODB_URI is not defined");
}

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log("Connected to MongoDB successfully");
  })
  .catch((error) => {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  });

// Redis connection
// const REDIS_URL = process.env.REDIS_URL;
// const REDIS_PASSWORD = process.env.REDIS_PASSWORD;

// if (!REDIS_URL) {
//   throw new Error("REDIS_URL is not defined");
// }

// if (!REDIS_PASSWORD) {
//   throw new Error("REDIS_PASSWORD is not defined");
// }

// const redisClient = createClient({
//   url: REDIS_URL,
//   password: REDIS_PASSWORD,
// });

// redisClient.on("error", (error) => {
//   console.error("Redis connection error:", error);
// });

// redisClient.on("connect", () => {
//   console.log("Connected to Redis successfully");
// });

// redisClient.on("ready", () => {
//   console.log("Redis client ready");
// });

// redisClient.on("end", () => {
//   console.log("Redis connection ended");
// });

// // Connect to Redis
// redisClient.connect().catch((error) => {
//   console.error("Failed to connect to Redis:", error);
// });

// // Graceful shutdown
// process.on("SIGINT", async () => {
//   console.log("Shutting down gracefully...");
//   await redisClient.quit();
//   process.exit(0);
// });

// process.on("SIGTERM", async () => {
//   console.log("Shutting down gracefully...");
//   await redisClient.quit();
//   process.exit(0);
// });

// Routes
app.use("/auth", authRoutes);
app.use("/posts", postsRoutes);
app.use("/profile", profileRoutes);

// Health check
app.get("/health", (req: Request, res: Response) => {
  res.json({ status: "OK", message: "Posts Dashboard API is running" });
});

// Error handling middleware
app.use((error: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(error.stack);
  res.status(500).json({ error: "Something went wrong!" });
});

// 404 handler
app.use("*", (req: Request, res: Response) => {
  res.status(404).json({ error: "Route not found" });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Export Redis client for use in other modules
// export { redisClient };
