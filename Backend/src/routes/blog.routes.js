import express from "express";
import {
  createBlog,
  getBlogs,
  getBlogById,
  getMyBlogs,
  updateBlog,
  deleteBlog,
} from "../controllers/blog.controller.js";

import { verifyToken } from "../middleware/auth.middleware.js";

const router = express.Router();

// ✅ Protected Routes (define before GET /:id to avoid route conflicts)
router.get("/user/my-blogs", verifyToken, getMyBlogs); // Get my blogs
router.post("/", verifyToken, createBlog); // Create blog
router.put("/:id", verifyToken, updateBlog); // Update blog
router.delete("/:id", verifyToken, deleteBlog); // Delete blog

// ✅ Public Routes (define after protected routes)
router.get("/", getBlogs); // Get all blogs
router.get("/:id", getBlogById); // Get single blog

export default router;