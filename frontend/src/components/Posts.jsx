import { useState, useEffect } from "react";

function Posts({ apiBase, token, user, showMessage }) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingPost, setEditingPost] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    category: "",
    tags: "",
  });
  const [imageFile, setImageFile] = useState(null);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${apiBase}/posts`);
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to fetch posts");
      }

      setPosts(data.data || []);
      showMessage(`Loaded ${data.results} posts`, "success");
    } catch (error) {
      showMessage(error.message, "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  const resetForm = () => {
    setFormData({ title: "", content: "", category: "", tags: "" });
    setImageFile(null);
    setShowForm(false);
    setEditingPost(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const isEditing = !!editingPost;
      const url = isEditing
        ? `${apiBase}/posts/${editingPost._id}`
        : `${apiBase}/posts`;

      let options = {
        method: isEditing ? "PATCH" : "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      // Use FormData for POST (with image), JSON for PATCH
      if (!isEditing && imageFile) {
        const formDataObj = new FormData();
        formDataObj.append("title", formData.title);
        formDataObj.append("content", formData.content);
        formDataObj.append("category", formData.category);
        if (formData.tags) {
          formDataObj.append("tags", formData.tags);
        }
        formDataObj.append("coverImage", imageFile);
        options.body = formDataObj;
      } else {
        options.headers["Content-Type"] = "application/json";
        options.body = JSON.stringify({
          title: formData.title,
          content: formData.content,
          category: formData.category,
          tags: formData.tags
            ? formData.tags.split(",").map((t) => t.trim())
            : [],
        });
      }

      const res = await fetch(url, options);
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || data.error || "Operation failed");
      }

      showMessage(isEditing ? "Post updated!" : "Post created!", "success");
      resetForm();
      fetchPosts();
    } catch (error) {
      showMessage(error.message, "error");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (post) => {
    setEditingPost(post);
    setFormData({
      title: post.title,
      content: post.content,
      category: post.category || "",
      tags: post.tags?.join(", ") || "",
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this post?")) return;

    setLoading(true);
    try {
      const res = await fetch(`${apiBase}/posts/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to delete post");
      }

      showMessage("Post deleted!", "success");
      fetchPosts();
    } catch (error) {
      showMessage(error.message, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="posts-container">
      <div className="posts-header">
        <h2>📚 Blog Posts</h2>
        <div className="posts-actions">
          <button
            onClick={fetchPosts}
            className="btn btn-secondary"
            disabled={loading}
          >
            🔄 Refresh
          </button>
          <button
            onClick={() => {
              resetForm();
              setShowForm(!showForm);
            }}
            className="btn btn-primary"
          >
            {showForm ? "✖ Cancel" : "➕ New Post"}
          </button>
        </div>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="post-form">
          <h3>{editingPost ? "✏️ Edit Post" : "📝 Create New Post"}</h3>

          <div className="form-group">
            <label>Title *</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Post title"
              required
            />
          </div>

          <div className="form-group">
            <label>Content *</label>
            <textarea
              name="content"
              value={formData.content}
              onChange={handleChange}
              placeholder="Write your post content..."
              rows="5"
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Category</label>
              <input
                type="text"
                name="category"
                value={formData.category}
                onChange={handleChange}
                placeholder="e.g. Technology"
              />
            </div>

            <div className="form-group">
              <label>Tags (comma-separated)</label>
              <input
                type="text"
                name="tags"
                value={formData.tags}
                onChange={handleChange}
                placeholder="e.g. react, javascript"
              />
            </div>
          </div>

          {!editingPost && (
            <div className="form-group">
              <label>Cover Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
              />
            </div>
          )}

          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading
              ? "Saving..."
              : editingPost
                ? "Update Post"
                : "Create Post"}
          </button>
        </form>
      )}

      {loading && !showForm && <div className="loading">Loading posts...</div>}

      <div className="posts-grid">
        {posts.map((post) => (
          <div key={post._id} className="post-card">
            {post.coverImage && (
              <img
                src={`http://localhost:8000/image/posts/${post.coverImage}`}
                alt={post.title}
                className="post-image"
              />
            )}
            <div className="post-content">
              <h3>{post.title}</h3>
              <p>{post.content?.substring(0, 150)}...</p>

              <div className="post-meta">
                {post.category && (
                  <span className="category">📁 {post.category}</span>
                )}
                {post.author?.name && (
                  <span className="author">👤 {post.author.name}</span>
                )}
              </div>

              {post.tags?.length > 0 && (
                <div className="tags">
                  {post.tags.map((tag, i) => (
                    <span key={i} className="tag">
                      #{tag}
                    </span>
                  ))}
                </div>
              )}

              {user &&
                (post.author?._id === user._id || post.author === user._id) && (
                  <div className="post-actions">
                    <button
                      onClick={() => handleEdit(post)}
                      className="btn btn-small"
                    >
                      ✏️ Edit
                    </button>
                    <button
                      onClick={() => handleDelete(post._id)}
                      className="btn btn-small btn-danger"
                    >
                      🗑️ Delete
                    </button>
                  </div>
                )}
            </div>
          </div>
        ))}

        {!loading && posts.length === 0 && (
          <div className="no-posts">
            <p>No posts yet. Create your first post!</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Posts;
