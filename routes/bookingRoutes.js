import express from "express";
import {
  cancelBooking,
  createBooking,
  getUserBookings,
} from "../controllers/bookingController.js";
import { authGuard } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/book-hotel", authGuard, createBooking);
router.patch("/book-cancel/:id", authGuard, cancelBooking);
router.get("/", authGuard, getUserBookings);

export default router;
