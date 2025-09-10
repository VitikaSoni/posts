import { Response } from "express";
import mongoose from "mongoose";
import Post from "../models/Post";
import { AuthRequest } from "../middleware/auth";
import {
  CreatePostRequest,
  UpdatePostRequest,
  PostQueryParams,
  PostResponse,
  IFileMetadata,
} from "../types/post";
import Comment from "../models/Comment";
import { CommentResponse, CreateCommentRequest } from "../types/comment";

export const postController = {
  async getPosts(req: AuthRequest, res: Response) {
    try {
      const {
        page = 1,
        limit = 10,
        filter = "all",
      } = req.query as PostQueryParams;

      const pageNum = parseInt(page.toString());
      const limitNum = parseInt(limit.toString());
      const skip = (pageNum - 1) * limitNum;

      let query: any = {};

      // Add filter functionality with admin restrictions
      if (filter === "my") {
        query.author = new mongoose.Types.ObjectId(req.user?.userId);
      } else if (filter === "all") {
        // Only admins can query all posts
        if (req.user?.role !== "admin") {
          return res.status(403).json({
            error: "Access denied. Only admins can view all posts.",
          });
        }
        // For admins, no additional filter is needed (query remains empty)
      }

      const posts = await Post.find(query)
        .populate("author", "username email")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum);

      const total = await Post.countDocuments(query);
      const totalPages = Math.ceil(total / limitNum);

      const response: PostResponse = {
        posts,
        totalPages,
        currentPage: pageNum,
        total,
      };

      return res.json(response);
    } catch (error) {
      console.error("Error fetching posts:", error);
      return res.status(500).json({ error: "Failed to fetch posts" });
    }
  },

  async getPostById(
    req: AuthRequest & { params: { id: string } },
    res: Response
  ) {
    try {
      const { id } = req.params;

      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: "Invalid post ID" });
      }

      const post = await Post.findById(id).populate("author", "username email");

      if (!post) {
        return res.status(404).json({ error: "Post not found" });
      }

      return res.json(post);
    } catch (error) {
      console.error("Error fetching post:", error);
      return res.status(500).json({ error: "Failed to fetch post" });
    }
  },

  async createPost(
    req: AuthRequest & { body: CreatePostRequest; file?: Express.Multer.File },
    res: Response
  ) {
    try {
      const { title, content, status = "draft" } = req.body;

      if (!title || !content) {
        return res
          .status(400)
          .json({ error: "Title and content are required" });
      }

      // Extract file metadata if file is uploaded
      let fileMetadata: IFileMetadata | undefined;
      if (req.file) {
        fileMetadata = {
          name: req.file.originalname,
          type: req.file.mimetype,
        };
      }

      const newPost = new Post({
        title,
        content,
        author: new mongoose.Types.ObjectId(req.user?.userId),
        status,
        fileMetadata,
      });

      const savedPost = await newPost.save();
      await savedPost.populate("author", "username");

      return res.status(201).json({
        ...savedPost.toObject(),
        message: "Post created successfully",
      });
    } catch (error) {
      console.error("Error creating post:", error);
      return res.status(500).json({ error: "Failed to create post" });
    }
  },

  async updatePost(
    req: AuthRequest & {
      params: { id: string };
      body: UpdatePostRequest;
      file?: Express.Multer.File;
    },
    res: Response
  ) {
    try {
      const { id } = req.params;
      const { title, content, status } = req.body;

      const post = await Post.findById(id);

      if (!post) {
        return res.status(404).json({ error: "Post not found" });
      }

      // Check if user is the author of the post or an admin
      if (
        post.author.toString() !== req.user?.userId &&
        req.user?.role !== "admin"
      ) {
        return res
          .status(403)
          .json({ error: "Not authorized to update this post" });
      }

      const updateData: any = {};
      if (title !== undefined) updateData.title = title;
      if (content !== undefined) updateData.content = content;
      if (status !== undefined) updateData.status = status;

      // Handle file upload for updates
      if (req.file) {
        updateData.fileMetadata = {
          name: req.file.originalname,
          type: req.file.mimetype,
        };
      }

      const updatedPost = await Post.findByIdAndUpdate(id, updateData, {
        new: true,
        runValidators: true,
      }).populate("author", "username");

      if (!updatedPost) {
        return res.status(500).json({ error: "Failed to update post" });
      }

      return res.json({
        ...updatedPost.toObject(),
        message: "Post updated successfully",
      });
    } catch (error) {
      console.error("Error updating post:", error);
      return res.status(500).json({ error: "Failed to update post" });
    }
  },

  async deletePost(
    req: AuthRequest & { params: { id: string } },
    res: Response
  ) {
    try {
      const { id } = req.params;

      const post = await Post.findById(id);

      if (!post) {
        return res.status(404).json({ error: "Post not found" });
      }

      // Check if user is the author of the post or an admin
      if (
        post.author.toString() !== req.user?.userId &&
        req.user?.role !== "admin"
      ) {
        return res
          .status(403)
          .json({ error: "Not authorized to delete this post" });
      }

      await Post.findByIdAndDelete(id);

      return res.json({ message: "Post deleted successfully" });
    } catch (error) {
      console.error("Error deleting post:", error);
      return res.status(500).json({ error: "Failed to delete post" });
    }
  },

  async getComments(
    req: AuthRequest & { params: { postId: string } },
    res: Response
  ) {
    try {
      const { postId } = req.params;

      if (!postId) {
        return res.status(400).json({ error: "Post ID is required" });
      }

      if (!mongoose.Types.ObjectId.isValid(postId)) {
        return res.status(400).json({ error: "Invalid post ID" });
      }

      // Verify that the post exists
      const post = await Post.findById(postId);
      if (!post) {
        return res.status(404).json({ error: "Post not found" });
      }

      const comments = await Comment.find({ post: postId })
        .populate("author", "username name")
        .sort({ createdAt: -1 });

      const response: CommentResponse = {
        comments,
      };

      return res.json(response);
    } catch (error) {
      console.error("Error fetching comments:", error);
      return res.status(500).json({ error: "Failed to fetch comments" });
    }
  },

  async createComment(
    req: AuthRequest & {
      body: CreateCommentRequest;
      params: { postId: string };
    },
    res: Response
  ) {
    try {
      const { content } = req.body;
      const { postId } = req.params;

      if (!content || !postId) {
        return res
          .status(400)
          .json({ error: "Content and post ID are required" });
      }

      if (!mongoose.Types.ObjectId.isValid(postId)) {
        return res.status(400).json({ error: "Invalid post ID" });
      }

      // Verify that the post exists
      const post = await Post.findById(postId);
      if (!post) {
        return res.status(404).json({ error: "Post not found" });
      }

      const newComment = new Comment({
        content,
        author: new mongoose.Types.ObjectId(req.user?.userId),
        post: new mongoose.Types.ObjectId(postId),
      });

      const savedComment = await newComment.save();
      await savedComment.populate("author", "username name");

      return res.status(201).json({
        ...savedComment.toObject(),
        message: "Comment created successfully",
      });
    } catch (error) {
      console.error("Error creating comment:", error);
      return res.status(500).json({ error: "Failed to create comment" });
    }
  },
};
