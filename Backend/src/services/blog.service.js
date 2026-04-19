import { Blog } from "../models/blog.model.js";

export const BlogService = {
  createBlog: async (data) => {
    if (!data.title || !data.content || !data.author || !data.userId) {
      throw new Error("All fields are required");
    }

    const blog = await Blog.create(data);
    return await blog.populate("userId", "name email");
  },

  getAllBlogs: async () => {
    return await Blog.find().populate("userId", "name email").sort({ createdAt: -1 });
  },

  getBlog: async (id) => {
    const blog = await Blog.findById(id).populate("userId", "name email");

    if (!blog) {
      throw new Error("Blog not found");
    }

    return blog;
  },

  getMyBlogs: async (userId) => {
    return await Blog.find({ userId }).sort({ createdAt: -1 });
  },

  updateBlog: async (id, userId, updateData) => {
    const blog = await Blog.findById(id);

    if (!blog) {
      throw new Error("Blog not found");
    }

    if (blog.userId.toString() !== userId.toString()) {
      throw new Error("Unauthorized: You can only edit your own blogs");
    }

    Object.assign(blog, updateData);
    await blog.save();
    return await blog.populate("userId", "name email");
  },

  deleteBlog: async (id, userId) => {
    const blog = await Blog.findById(id);

    if (!blog) {
      throw new Error("Blog not found");
    }

    if (blog.userId.toString() !== userId.toString()) {
      throw new Error("Unauthorized: You can only delete your own blogs");
    }

    await Blog.findByIdAndDelete(id);
    return { message: "Blog deleted successfully" };
  },
};