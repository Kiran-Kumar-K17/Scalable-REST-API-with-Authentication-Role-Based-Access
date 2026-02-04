import Post from "../models/post.js";
import path from "path"; // This is the one you are missing!
import fs from "fs"; // Needed for fs.unlink and fs.existsSync
import { asyncHandler } from "../utils/asyncHandler.js";

const getAllData = asyncHandler(async (req, res, next) => {
  const queryObj = { ...req.query };
  const excludedFields = ["page", "sort", "limit", "field"];
  excludedFields.forEach((el) => delete queryObj[el]);
  let query = Post.find(queryObj).populate({
    path: "author",
    select: "name email", // Only get the public info
  });

  const sortBy = req.query.sort || "-createdAt";
  query = query.sort(sortBy);

  if (req.query.field) {
    const fields = req.query.field.split(",").join(" ");
    query = query.select(fields);
  } else {
    query = query.select("-__v");
  }
  const page = req.query.page * 1 || 1;
  const limit = req.query.limit * 1 || 10;
  const skip = (page - 1) * limit;
  query = query.skip(skip).limit(limit);

  const posts = await query;
  const totalPosts = await Post.countDocuments(queryObj);
  res.status(200).json({
    success: true,
    results: posts.length,
    data: posts,
    pagination: {
      totalPosts,
      currentPage: page,
    },
  });
});

const postData = asyncHandler(async (req, res, next) => {
  if (req.file && !req.body.coverImage) req.body.coverImage = req.file.filename;
  const newPost = await Post.create({
    ...req.body,
    author: req.user._id, // req.user was set by your 'protect' middleware!
  });
  res.status(201).json({ success: true, data: newPost });
});

const getById = asyncHandler(async (req, res, next) => {
  const post = await Post.findById(req.params.id);
  if (!post) {
    return res.status(404).json({ success: false, message: "Post not found" });
  }
  res.status(200).json({ success: true, data: post });
});

const deleteData = asyncHandler(async (req, res, next) => {
  console.log("1. Delete request received for ID:", req.params.id);

  const post = await Post.findById(req.params.id);

  if (!post) {
    console.log("2. Error: Post not found in database");
    return res.status(404).json({ success: false, message: "Post not found" });
  }

  console.log("3. Post found. CoverImage value is:", post.coverImage);

  // Ownership Check
  if (post.author.toString() !== req.user._id.toString()) {
    console.log("4. Error: User is not the owner");
    return res
      .status(403)
      .json({ success: false, message: "Permission denied" });
  }

  // THE DELETION LOGIC
  if (post.coverImage) {
    console.log("5. Entering Image Deletion Block...");

    const imagePath = path.join(
      process.cwd(),
      "public",
      "image",
      "posts",
      post.coverImage,
    );
    console.log("6. Target path:", imagePath);

    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
      console.log("7. ✅ File physically deleted!");
    } else {
      console.log("7. ❌ File does NOT exist at that path.");
    }
  } else {
    console.log("5. ⚠️ Skip: No coverImage field found on this post document.");
  }

  await Post.findByIdAndDelete(req.params.id);
  console.log("8. Post deleted from Database. Sending response.");

  res.status(200).json({ success: true, message: "Post deleted successfully" });
});

const updateData = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const data = req.body;
  const updatedPost = await Post.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  });
  if (!updatedPost) {
    return res.status(404).json({ success: false, message: "Post not found" });
  }
  res.status(200).json({ success: true, data: updatedPost });
});

export { getAllData, postData, getById, deleteData, updateData };
