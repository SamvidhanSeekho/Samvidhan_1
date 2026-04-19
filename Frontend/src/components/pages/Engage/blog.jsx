import React, { useState, useEffect } from "react";
import { getToken, isAuthenticated } from "../../../utils/authUtils";

const API_BASE_URL = "http://localhost:3000/api/blogs";

// Helper function to get user ID from localStorage
const getCurrentUserId = () => {
  return localStorage.getItem("userId");
};

const BlogPage = () => {
  const [blogs, setBlogs] = useState([]);
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [newBlog, setNewBlog] = useState({
    title: "",
    author: "",
    content: "",
    image: "",
  });
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingBlogId, setEditingBlogId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [token, setToken] = useState(null);

  // Get token from localStorage on page load
  useEffect(() => {
    const storedToken = getToken();
    setToken(storedToken);
  }, []);

  // Fetch all blogs
  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      if (data.success) {
        setBlogs(data.data);
      } else {
        setError("Failed to fetch blogs");
      }
    } catch (error) {
      console.error("Error fetching blogs:", error);
      setError("Error fetching blogs");
    } finally {
      setLoading(false);
    }
  };

  // Fetch blogs on page load
  useEffect(() => {
    fetchBlogs();
  }, []);

  // Add or Update blog
  const handleAddBlog = async () => {
    // Get fresh token each time (important!)
    const freshToken = getToken();
    
    if (!freshToken) {
      setError("Please login to add a blog");
      return;
    }

    if (!newBlog.title || !newBlog.content) {
      setError("Title and content are required");
      return;
    }

    try {
      setLoading(true);
      const method = isEditing ? "PUT" : "POST";
      const url = isEditing ? `${API_BASE_URL}/${editingBlogId}` : API_BASE_URL;

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${freshToken}`,
        },
        body: JSON.stringify(newBlog),
      });

      const data = await response.json();

      if (data.success) {
        setError("");
        if (isEditing) {
          // Update blog in state
          setBlogs(blogs.map((blog) => (blog._id === editingBlogId ? data.data : blog)));
          setIsEditing(false);
          setEditingBlogId(null);
        } else {
          // Add new blog to state
          setBlogs([data.data, ...blogs]);
        }
        setNewBlog({ title: "", author: "", content: "", image: "" });
        setIsPopupVisible(false);
        await fetchBlogs(); // Refresh blogs
      } else {
        setError(data.message || "Failed to save blog");
      }
    } catch (error) {
      console.error("Error saving blog:", error);
      setError("Error saving blog");
    } finally {
      setLoading(false);
    }
  };

  // Delete blog
  const handleDeleteBlog = async (blogId) => {
    // Get fresh token each time
    const freshToken = getToken();
    
    if (!freshToken) {
      setError("Please login to delete a blog");
      return;
    }

    if (!window.confirm("Are you sure you want to delete this blog?")) {
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/${blogId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${freshToken}`,
        },
      });

      const data = await response.json();

      if (data.success) {
        setBlogs(blogs.filter((blog) => blog._id !== blogId));
        setSelectedBlog(null);
        setError("");
      } else {
        setError(data.message || "Failed to delete blog");
      }
    } catch (error) {
      console.error("Error deleting blog:", error);
      setError("Error deleting blog");
    } finally {
      setLoading(false);
    }
  };

  // Start editing
  const handleEditBlog = (blog) => {
    setNewBlog({
      title: blog.title,
      author: blog.author,
      content: blog.content,
      image: blog.image,
    });
    setEditingBlogId(blog._id);
    setIsEditing(true);
    setIsPopupVisible(true);
    setSelectedBlog(null);
  };

  // Cancel editing
  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditingBlogId(null);
    setNewBlog({ title: "", author: "", content: "", image: "" });
    setIsPopupVisible(false);
    setError("");
  };

  return (
    <div className="flex flex-col h-screen bg-white dark:bg-gray-900 md:flex-row">
      {/* Error Message */}
      {error && (
        <div className="fixed top-0 left-0 right-0 p-4 bg-red-500 text-white z-40 flex justify-between items-center">
          <span>{error}</span>
          <button
            onClick={() => setError("")}
            className="font-bold text-lg hover:opacity-80"
          >
            ×
          </button>
        </div>
      )}

      {/* Left Panel: Blog List */}
      <div
        className={`p-6 bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 md:w-1/3 overflow-y-auto border-r border-gray-200 dark:border-gray-700 ${
          selectedBlog ? "hidden md:block" : "block w-full"
        }`}
      >
        {/* Header Section */}
        <div className="mb-8 pb-8 border-b-2 border-yellow-400 dark:border-yellow-500">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-4xl">📚</span>
            <h1 className="text-4xl font-black bg-gradient-to-r from-yellow-500 to-yellow-600 dark:from-yellow-400 dark:to-yellow-500 bg-clip-text text-transparent leading-tight">
              Blogs
            </h1>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 ml-14">
            Discover stories and insights
          </p>
        </div>
        
        {loading && (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-500"></div>
            <p className="ml-3 text-gray-600 dark:text-gray-400">Loading blogs...</p>
          </div>
        )}

        <div className="space-y-3">
          {blogs.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-2xl mb-2">✨</p>
              <p className="text-gray-600 dark:text-gray-400 font-medium">No blogs available yet</p>
              <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">Be the first to share your story!</p>
            </div>
          ) : (
            blogs.map((blog) => (
              <div
                key={blog._id}
                onClick={() => setSelectedBlog(blog)}
                className="group flex items-center p-4 space-x-4 bg-white dark:bg-gray-700 rounded-xl shadow-md cursor-pointer hover:shadow-2xl hover:shadow-yellow-500/20 transition-all duration-300 border-l-4 border-yellow-500 hover:border-yellow-600 hover:-translate-y-1"
              >
                {/* Image with Placeholder */}
                <div className="relative overflow-hidden rounded-lg flex-shrink-0 w-20 h-20">
                  {blog.image && blog.image.trim() ? (
                    <>
                      <img
                        src={blog.image}
                        alt={blog.title}
                        className="object-cover w-full h-full rounded-lg group-hover:scale-110 transition-transform duration-300"
                        onError={(e) => {
                          e.target.style.display = "none";
                          e.target.nextElementSibling.style.display = "flex";
                        }}
                      />
                      <div 
                        className="hidden absolute inset-0 bg-gradient-to-br from-yellow-400 to-yellow-600 dark:from-yellow-500 dark:to-yellow-700 rounded-lg items-center justify-center"
                      >
                        <span className="text-3xl">📖</span>
                      </div>
                    </>
                  ) : (
                    <div className="flex items-center justify-center w-full h-full bg-gradient-to-br from-blue-400 to-blue-600 dark:from-blue-500 dark:to-blue-700 rounded-lg">
                      <span className="text-3xl">📝</span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </div>
                
                <div className="flex-1 min-w-0">
                  <h2 className="text-base font-bold text-gray-900 dark:text-white truncate group-hover:text-yellow-500 transition-colors">
                    {blog.title}
                  </h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-1">
                    By {blog.author}
                  </p>
                  <div className="flex items-center justify-between mt-2">
                    <p className="text-xs text-gray-500 dark:text-gray-500">
                      📅 {new Date(blog.createdAt).toLocaleDateString()}
                    </p>
                    {blog.userId && (
                      <span className="px-2 py-1 text-xs font-semibold text-yellow-700 dark:text-yellow-400 bg-yellow-100 dark:bg-yellow-900/30 rounded-full">
                        ✍️ {blog.userId.name}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Right Panel: Blog Details */}
      <div
        className={`p-8 bg-white dark:bg-gray-800 md:w-2/3 overflow-y-auto flex flex-col ${
          selectedBlog ? "block" : "hidden md:block"
        }`}
      >
        {selectedBlog ? (
          <>
            {/* Blog Image with Placeholder */}
            <div className="relative overflow-hidden rounded-lg shadow-lg mb-6 h-80 bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800">
              {selectedBlog.image && selectedBlog.image.trim() ? (
                <>
                  <img
                    src={selectedBlog.image}
                    alt={selectedBlog.title}
                    className="object-cover w-full h-full rounded-lg"
                    onError={(e) => {
                      e.target.style.display = "none";
                      e.target.nextElementSibling.style.display = "flex";
                    }}
                  />
                  <div 
                    className="hidden absolute inset-0 bg-gradient-to-br from-yellow-300 via-yellow-400 to-yellow-500 dark:from-yellow-500 dark:via-yellow-600 dark:to-yellow-700 rounded-lg items-center justify-center flex-col"
                  >
                    <span className="text-8xl mb-4">📖</span>
                    <p className="text-sm font-semibold text-yellow-900 dark:text-yellow-100">Image Not Available</p>
                  </div>
                </>
              ) : (
                <div className="flex items-center justify-center w-full h-full bg-gradient-to-br from-blue-300 via-blue-400 to-blue-500 dark:from-blue-600 dark:via-blue-700 dark:to-blue-800 rounded-lg flex-col">
                  <span className="text-8xl mb-4">📝</span>
                  <p className="text-sm font-semibold text-blue-900 dark:text-blue-100">No Image Provided</p>
                </div>
              )}
            </div>
            
            {/* Blog Title Section */}
            <div className="mb-6 pb-6 border-b-2 border-yellow-200 dark:border-yellow-900">
              <h2 className="text-5xl font-black text-gray-900 dark:text-white mb-4 leading-tight">
                {selectedBlog.title}
              </h2>
              
              <div className="flex flex-wrap gap-3 text-sm">
                <div className="flex items-center gap-2 bg-blue-100 dark:bg-blue-900/30 px-4 py-2 rounded-lg">
                  <span>✍️</span>
                  <span className="font-semibold text-blue-700 dark:text-blue-300">{selectedBlog.author}</span>
                </div>
                <div className="flex items-center gap-2 bg-purple-100 dark:bg-purple-900/30 px-4 py-2 rounded-lg">
                  <span>📅</span>
                  <span className="font-semibold text-purple-700 dark:text-purple-300">{new Date(selectedBlog.createdAt).toLocaleDateString()}</span>
                </div>
                {selectedBlog.userId && (
                  <div className="flex items-center gap-2 bg-yellow-100 dark:bg-yellow-900/30 px-4 py-2 rounded-lg">
                    <span>👤</span>
                    <span className="font-semibold text-yellow-700 dark:text-yellow-300">{selectedBlog.userId.name}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Blog Content Section */}
            <div className="mb-8">
              <div className="prose dark:prose-invert prose-lg max-w-none">
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-lg whitespace-pre-wrap font-medium">
                  {selectedBlog.content}
                </p>
              </div>
            </div>

            {/* Edit and Delete buttons - ONLY show if current user is the author */}
            {getToken() && selectedBlog.userId && (() => {
              const currentUserId = getCurrentUserId();
              const blogUserId = selectedBlog.userId._id ? String(selectedBlog.userId._id) : selectedBlog.userId;
              return currentUserId === blogUserId;
            })() && (
              <div className="flex gap-4 mt-auto pt-6 border-t-2 border-gray-300 dark:border-gray-600">
                <button
                  onClick={() => handleEditBlog(selectedBlog)}
                  className="flex-1 px-6 py-3 text-white font-bold bg-gradient-to-r from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-700 rounded-xl hover:from-blue-600 hover:to-blue-700 dark:hover:from-blue-700 dark:hover:to-blue-800 transition-all duration-200 shadow-lg hover:shadow-xl hover:shadow-blue-500/50 dark:hover:shadow-blue-700/50 transform hover:-translate-y-1 flex items-center justify-center gap-2"
                >
                  <span className="text-xl">✏️</span>
                  <span>Edit</span>
                </button>
                <button
                  onClick={() => handleDeleteBlog(selectedBlog._id)}
                  className="flex-1 px-6 py-3 text-white font-bold bg-gradient-to-r from-red-500 to-red-600 dark:from-red-600 dark:to-red-700 rounded-xl hover:from-red-600 hover:to-red-700 dark:hover:from-red-700 dark:hover:to-red-800 transition-all duration-200 shadow-lg hover:shadow-xl hover:shadow-red-500/50 dark:hover:shadow-red-700/50 transform hover:-translate-y-1 flex items-center justify-center gap-2"
                >
                  <span className="text-xl">🗑️</span>
                  <span>Delete</span>
                </button>
              </div>
            )}
            
            {/* Message if not author */}
            {getToken() && selectedBlog.userId && (() => {
              const currentUserId = getCurrentUserId();
              const blogUserId = selectedBlog.userId._id ? String(selectedBlog.userId._id) : selectedBlog.userId;
              return currentUserId !== blogUserId;
            })() && (
              <div className="mt-auto pt-6 text-center bg-blue-50 dark:bg-blue-900/20 px-6 py-4 rounded-lg border-2 border-blue-200 dark:border-blue-800">
                <p className="text-blue-700 dark:text-blue-300 font-semibold">
                  🔒 Only the author can edit or delete this blog
                </p>
              </div>
            )}
          </>
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-2xl text-gray-400 dark:text-gray-600">
              👈 Select a blog to view details
            </p>
          </div>
        )}
      </div>

      {/* Add Blog Button */}
      {getToken() && (
        <button
          onClick={() => {
            setIsEditing(false);
            setEditingBlogId(null);
            setNewBlog({ title: "", author: "", content: "", image: "" });
            setIsPopupVisible(true);
          }}
          className="fixed p-4 text-white font-bold bg-yellow-500 dark:bg-yellow-600 rounded-full shadow-lg bottom-10 right-10 hover:bg-yellow-600 dark:hover:bg-yellow-500 transition-all duration-200 hover:scale-110"
          title="Add a new blog"
        >
          <span className="text-2xl">➕</span>
        </button>
      )}

      {/* Login Prompt */}
      {!getToken() && (
        <div className="fixed bottom-10 right-10 p-4 bg-yellow-500 dark:bg-yellow-600 text-white rounded-lg shadow-lg font-semibold">
          🔐 Login to add blogs
        </div>
      )}

      {/* Add/Edit Blog Popup */}
      {isPopupVisible && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-md p-8 bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-h-96 overflow-y-auto">
            <h2 className="mb-6 text-3xl font-bold text-yellow-500 dark:text-yellow-400">
              {isEditing ? "✏️ Edit Blog" : "📝 Add New Blog"}
            </h2>
            
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Title"
                className="w-full p-3 border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:border-yellow-500 focus:outline-none"
                value={newBlog.title}
                onChange={(e) => setNewBlog({ ...newBlog, title: e.target.value })}
              />
              
              <input
                type="text"
                placeholder="Author Name"
                className="w-full p-3 border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:border-yellow-500 focus:outline-none"
                value={newBlog.author}
                onChange={(e) => setNewBlog({ ...newBlog, author: e.target.value })}
              />
              
              <textarea
                placeholder="Content"
                className="w-full p-3 border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:border-yellow-500 focus:outline-none h-32 resize-none"
                value={newBlog.content}
                onChange={(e) => setNewBlog({ ...newBlog, content: e.target.value })}
              />
              
              <input
                type="text"
                placeholder="Image URL (optional)"
                className="w-full p-3 border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:border-yellow-500 focus:outline-none"
                value={newBlog.image}
                onChange={(e) => setNewBlog({ ...newBlog, image: e.target.value })}
              />
            </div>
            
            <div className="flex gap-4 mt-8">
              <button
                onClick={handleCancelEdit}
                className="flex-1 px-4 py-3 bg-gray-400 dark:bg-gray-600 text-white font-bold rounded-lg hover:bg-gray-500 dark:hover:bg-gray-500 transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                onClick={handleAddBlog}
                disabled={loading}
                className="flex-1 px-4 py-3 bg-yellow-500 dark:bg-yellow-600 text-white font-bold rounded-lg hover:bg-yellow-600 dark:hover:bg-yellow-500 transition-colors duration-200 disabled:opacity-50"
              >
                {loading ? "Saving..." : isEditing ? "Update Blog" : "Add Blog"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BlogPage;
