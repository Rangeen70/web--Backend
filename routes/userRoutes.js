import express from "express";
import {
  getMe,
  login,
  register,
  updateProfile,
} from "../controllers/userController.js";
import { authGuard } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/profile/:userId", authGuard, getMe);
router.put("/profile/edit/:userId", authGuard, updateProfile);
export default router;
