import { Router } from "express";
import {
  registerUser,
  loginUser,
  deleteUser,
  restrictTo,
} from "../controllers/authController.js";
import { protect } from "../controllers/authController.js";
const router = Router();

router.post("/signup", registerUser);
router.post("/login", loginUser);
router.delete("/:id", protect, restrictTo("admin"), deleteUser);
export default router;
