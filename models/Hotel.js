import mongoose from "mongoose";

const hotelSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    type: { type: String, required: true },
    city: { type: String, required: true },
    address: { type: String, required: true },
    description: { type: String, required: true },
    rating: {
      type: Number,
      min: 0,
      max: 5,
      default: 0,
    },
    rooms: [
      {
        type: String,
        required: true,
      },
    ],
    cheapestPrice: { type: Number, required: true },
    featured: { type: Boolean, default: false },
    photos: { type: String },
    reservationStatus: {
      type: String,
      enum: ["confirmed", "available"],
      default: "available",
    },
  },
  { timestamps: true }
);

export const HotelModel = mongoose.model("Hotel", hotelSchema);
