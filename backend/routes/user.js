import { Router } from "express";
import {
  registerUser,
  loginUser,
  deleteUser,
  restrictTo,
  getAllUsers,
} from "../controllers/authController.js";
import { protect } from "../controllers/authController.js";
const router = Router();

router.post("/signup", registerUser);
router.post("/login", loginUser);
router.get("/", protect, restrictTo("admin"), getAllUsers);
router.delete("/:id", protect, restrictTo("admin"), deleteUser);
export default router;
