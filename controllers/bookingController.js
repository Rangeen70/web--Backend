import { BookingModel } from "../models/Booking.js";
import { HotelModel } from "../models/Hotel.js";

export const createBooking = async (req, res, next) => {
  try {
    const { hotelId, checkInDate, checkOutDate, guests, room } = req.body;

    if (!hotelId || !checkInDate || !checkOutDate || !guests || !room) {
      return res.status(400).json({ message: "All fields are required!" });
    }

    const hotel = await HotelModel.findById(hotelId);
    if (!hotel) {
      return res.status(404).json({ message: "Hotel not found" });
    }

    const nights = Math.ceil(
      (new Date(checkOutDate) - new Date(checkInDate)) / (1000 * 60 * 60 * 24)
    );
    const totalPrice = nights * hotel.cheapestPrice;

    const newBooking = new BookingModel({
      hotel: hotelId,
      user: req.user._id,
      room,
      checkInDate,
      checkOutDate,
      totalPrice,
      guests,
      status: "confirmed",
    });

    await HotelModel.findByIdAndUpdate(hotelId, {
      reservationStatus: "confirmed",
    });

    const savedBooking = await newBooking.save();
    res.status(201).json({
      message: "Booking created successfully",
      booking: savedBooking,
    });
  } catch (error) {
    next(error);
  }
};

// Cancel a booking
export const cancelBooking = async (req, res, next) => {
  try {
    const { hotelId } = req.body;

    const booking = await BookingModel.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    const hotel = await HotelModel.findById(hotelId);
    if (!hotel) {
      return res.status(404).json({ message: "Hotel not found!" });
    }

    if (booking.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "You can only cancel your own bookings" });
    }
    

    // ✅ Update reservation status and booking status
    await HotelModel.findByIdAndUpdate(hotelId, {
      reservationStatus: "available",
    });

    booking.status = "cancelled";
    await booking.save();

    res.status(200).json({ message: "Booking cancelled successfully" });
  } catch (error) {
    next(error);
  }
};

// Get user's bookings
export const getUserBookings = async (req, res, next) => {
  try {
    const bookings = await BookingModel.find({ user: req.user.id })
      .populate("hotel", "name address photos")
      .sort({ createdAt: -1 });
    res.status(200).json(bookings);
  } catch (error) {
    next(error);
  }
};

// Get all bookings (admin only)
export const getAllBookings = async (req, res, next) => {
  try {
    const bookings = await BookingModel.find()
      .populate("hotel", "name")
      .populate("user", "name email");
    res.status(200).json(bookings);
  } catch (error) {
    next(error);
  }
};
