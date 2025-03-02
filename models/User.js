import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    profilePicture: { type: String },
    role: {
      type: String,
      enum: ["admin", "normal"],
      default: "normal",
    },
  },
  { timestamps: true }
);

export const UserModel = mongoose.model("User", userSchema);
