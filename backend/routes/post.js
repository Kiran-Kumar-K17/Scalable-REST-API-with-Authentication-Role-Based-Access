import { Router } from "express";
import {
  getAllData,
  postData,
  getById,
  deleteData,
  updateData,
} from "../controllers/post.js";
import { protect } from "../controllers/authController.js";
import {
  uploadPostImage,
  resizePostImage,
} from "../controllers/postController.js";
const router = Router();

router.get("/", getAllData);
router.get("/:id", getById);

// Only logged-in users can Create, Update, or Delete!
router.post("/", protect, uploadPostImage, resizePostImage, postData);
router.patch("/:id", protect, updateData);
router.delete("/:id", protect, deleteData);

export default router;
