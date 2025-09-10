import express from "express";
import { authMiddleware } from "../middleware/auth";
import upload from "../middleware/upload";
import { postController } from "../controllers/postController";

const router = express.Router();

// Apply authentication middleware to all routes
router.use(authMiddleware);

// Post routes
router.get("/", postController.getPosts);
router.get("/:id", postController.getPostById);
router.post("/", upload.single("file"), postController.createPost);
router.put("/:id", upload.single("file"), postController.updatePost);
router.delete("/:id", postController.deletePost);

// Comment routes
router.get("/:postId/comments", postController.getComments);
router.post("/:postId/comments", postController.createComment);

export default router;
