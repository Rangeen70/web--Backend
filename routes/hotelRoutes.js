import express from "express";
import {
  createHotel,
  deleteHotel,
  getHotel,
  getHotels,
  updateHotel,
} from "../controllers/hotelController.js";
import { adminGuard, authGuard } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/", getHotels);
router.get("/single/:id", getHotel);
router.post("/create-hotel",authGuard,adminGuard ,createHotel);
router.put("/update-hotel", authGuard,adminGuard,updateHotel);
router.delete("/:id",authGuard,adminGuard ,deleteHotel);

export default router;
