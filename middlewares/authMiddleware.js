import JWT from "jsonwebtoken";
import { UserModel } from "../models/User.js";

export const authGuard = async (req, res, next) => {
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      const token = req.headers.authorization.split(" ")[1];
      const { id } = JWT.verify(token, process.env.JWT_SECRET);
      req.user = await UserModel.findById(id).select("-password");
      next();
    } catch (error) {
      let err = new Error("Not authorized. Invalid token!");
      err.statusCode = 401;
      next(err);
    }
  }
};

export const adminGuard = async (req, res, next) => {
  try {
    if (req.user && req.user.role === "admin") {
      return next();
    }
    const err = new Error("Not authorized. Admin access required!");
    err.statusCode = 403;
    throw err;
  } catch (error) {
    next(error);
  }
};
