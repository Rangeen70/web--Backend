import { imageUpload } from "../middlewares/imageUpload.js";
import { HotelModel } from "../models/Hotel.js";

export const createHotel = async (req, res, next) => {
  try {
    const upload = imageUpload.single("hotelImage"); // Allow only one image
    upload(req, res, async function (err) {
      const {
        name,
        type,
        city,
        address,
        description,
        rating,
        rooms,
        cheapestPrice,
      } = req.body;

      // Validate required fields
      if (
        !name ||
        !type ||
        !city ||
        !address ||
        !description ||
        !rating ||
        !rooms ||
        !cheapestPrice
      ) {
        return res.status(400).json({ message: "All fields are required!" });
      }

      // Assuming req.user is set by authentication middleware
      const user = req.user._id;

      if (err) {
        const error = new Error(
          "An unknown error occurred while uploading the image! " + err.message
        );
        return next(error);
      } else {
        if (!req.file) {
          const error = new Error("You must upload a hotel image!");
          return next(error);
        }

        // Use the uploaded filename as a string
        const photo = req.file.filename;

        // Create new hotel document
        const newHotel = new HotelModel({
          name,
          type,
          city,
          address,
          description,
          rating,
          rooms,
          cheapestPrice,
          photos:photo, 
          user,
        });

        const savedHotel = await newHotel.save();
        return res
          .status(201)
          .json({ message: "Hotel created!", data: savedHotel });
      }
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
};


export const updateHotel = async (req, res, next) => {
  try {
    const {
      name,
      type,
      city,
      address,
      description,
      rating,
      rooms,
      cheapestPrice,
    } = req.body;
    if (
      !name ||
      !type ||
      !city ||
      !address ||
      !description ||
      !rating ||
      !rooms ||
      !cheapestPrice
    ) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const updatedHotel = await HotelModel.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    res.status(200).json(updatedHotel);
  } catch (error) {
    next(error);
  }
};

export const deleteHotel = async (req, res, next) => {
  try {
    await HotelModel.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Hotel has been deleted." });
  } catch (error) {
    next(error);
  }
};

export const getHotel = async (req, res, next) => {
  try {
    const hotel = await HotelModel.findById(req.params.id);
    res.status(200).json(hotel);
  } catch (error) {
    next(error);
  }
};

// Get all hotels with filters
export const getHotels = async (req, res, next) => {
  try {
    const { min, max, ...others } = req.query;
    const hotels = await HotelModel.find({
      ...others,
      cheapestPrice: { $gt: min || 1, $lt: max || 999999 },
    }).limit(req.query.limit);
    res.status(200).json(hotels);
  } catch (error) {
    next(error);
  }
};
