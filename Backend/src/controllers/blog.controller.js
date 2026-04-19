import { BlogService } from "../services/blog.service.js";

export const createBlog = async (req, res) => {
  try {
    const { title, content, author, image } = req.body;
    const userId = req.userId;

    if (!title || !content) {
      return res.status(400).json({
        success: false,
        message: "Title and content are required",
      });
    }

    const blogData = {
      title,
      content,
      author: author || "Anonymous",
      image: image || "https://via.placeholder.com/150",
      userId,
    };

    const blog = await BlogService.createBlog(blogData);
    res.status(201).json({
      success: true,
      message: "Blog created successfully",
      data: blog,
    });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

export const getBlogs = async (req, res) => {
  try {
    const blogs = await BlogService.getAllBlogs();
    res.status(200).json({
      success: true,
      data: blogs,
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

export const getBlogById = async (req, res) => {
  try {
    const blog = await BlogService.getBlog(req.params.id);
    res.status(200).json({
      success: true,
      data: blog,
    });
  } catch (err) {
    res.status(404).json({ success: false, error: err.message });
  }
};

export const getMyBlogs = async (req, res) => {
  try {
    const userId = req.userId;
    const blogs = await BlogService.getMyBlogs(userId);
    res.status(200).json({
      success: true,
      data: blogs,
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

export const updateBlog = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId;
    const { title, content, author, image } = req.body;

    const updateData = {};
    if (title) updateData.title = title;
    if (content) updateData.content = content;
    if (author) updateData.author = author;
    if (image) updateData.image = image;

    const updatedBlog = await BlogService.updateBlog(id, userId, updateData);
    res.status(200).json({
      success: true,
      message: "Blog updated successfully",
      data: updatedBlog,
    });
  } catch (err) {
    const status = err.message.includes("Unauthorized") ? 403 : 500;
    res.status(status).json({ success: false, error: err.message });
  }
};

export const deleteBlog = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId;
    await BlogService.deleteBlog(id, userId);
    res.status(200).json({
      success: true,
      message: "Blog deleted successfully",
    });
  } catch (err) {
    const status = err.message.includes("Unauthorized") ? 403 : 500;
    res.status(status).json({ success: false, error: err.message });
  }
};