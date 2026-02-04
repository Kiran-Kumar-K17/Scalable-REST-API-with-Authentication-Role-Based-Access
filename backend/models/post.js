import mongoose, { Schema } from "mongoose";

const postSchema = Schema(
  {
    title: {
      type: String,
      required: true,
      maxlength: [150, "Title is too long"],
    },
    content: {
      type: String,
      required: [true, "Content cannot be empty"],
    },
    author: {
      type: mongoose.Schema.ObjectId,
      ref: "User", // This MUST match the name in your User model: mongoose.model("User", ...)
      required: [true, "A post must belong to a user"],
    },
    tags: {
      type: [String],
      required: true,
    },
    category: {
      type: String,
      required: true,
      lowercase: true,
    },
    status: {
      type: String,
      required: true,
      enum: ["draft", "published", "archived"],
      default: "draft",
    },
    coverImage: {
      type: String,
      default: "default-cover.jpg",
    },
  },
  {
    timestamps: true,
  },
);

const Post = mongoose.model("Post", postSchema);

export default Post;
