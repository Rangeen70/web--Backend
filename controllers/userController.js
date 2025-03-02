import JWT from "jsonwebtoken";
import { UserModel } from "../models/User.js";
import bcrypt from "bcryptjs";
import { imageUpload } from "./../middlewares/imageUpload.js";

export const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({
        message: "All fields are required!",
      });
    }

    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        message: "User already exists with the provided email address!",
      });
    }

    const hashedPassword = await bcrypt.hash(
      password,
      parseInt(process.env.SALT_ROUNDS || 10)
    );

    const newUser = new UserModel({
      name,
      email,
      password: hashedPassword,
    });

    const savedUser = await newUser.save();
    const userWithoutPassword = {
      _id: savedUser._id,
      name: savedUser.name,
      email: savedUser.email,
    };

    const token = JWT.sign({ id: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: "30d",
    });

    return res.status(201).json({
      user: userWithoutPassword,
      token,
      message: "User registered successfully!",
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        message: "All fields are required!",
      });
    }

    const existingUser = await UserModel.findOne({ email });
    if (!existingUser) {
      return res.status(400).json({
        message: "User not found!",
      });
    }

    const isValidPassword = await bcrypt.compare(
      password,
      existingUser.password
    );
    if (!isValidPassword) {
      return res.status(400).json({
        message: "Invalid credentials. Please try again!",
      });
    }

    const token = JWT.sign({ id: existingUser._id }, process.env.JWT_SECRET, {
      expiresIn: "30d",
    });

    const userWithoutPassword = {
      id: existingUser._id,
      name: existingUser.name,
      email: existingUser.email,
      role: existingUser.role,
    };

    return res.status(200).json({
      user: userWithoutPassword,
      token,
      message: "Logged in successfully!",
    });
  } catch (error) {
    next(error);
  }
};

export const getMe = async (req, res, next) => {
  try {
    const user = req.user._id;
    if (!user) {
      return res.status(404).json({
        message: "User does not exist!",
      });
    }

    const me = await UserModel.findById(user).select("-password");
    return res.status(200).json({ me });
  } catch (error) {
    next(error);
  }
};

export const updateProfile = async (req, res, next) => {
  try {
    const upload = imageUpload.single("profilePicture");
    upload(req, res, async function (err) {
      const userId = req.params.userId;
      console.log(userId)
      const { name } = req.body;

      if (err) {
        const error = new Error(
          "An unknown error occurred while uploading the image! " + err.message
        );
        return next(error);
      }

      // Prepare update data
      const updatedData = {};
      
      // Add name if provided
      if (name) {
        updatedData.name = name;
      }
      
      // Add profile picture if file was uploaded
      if (req.file) {
        updatedData.profilePicture = req.file.filename;
        // updatedData.profilePicture = `/uploads/${req.file.filename}`;
      }

      // Only proceed with update if there's something to update
      if (Object.keys(updatedData).length === 0) {
        return res.status(400).json({ message: "No update data provided" });
      }

      const user = await UserModel.findByIdAndUpdate(
        userId,
        { $set: updatedData },
        { new: true, runValidators: true }
      ).select("-password");

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      console.log("Profile updated successfully");
      return res.status(200).json({ me: user });
    });
  } catch (error) {
    console.error(error);
    return next(error);
  }
};
