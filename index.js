import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import {
  errorResponseHandler,
  invalidPathHandler,
} from "./middlewares/errorHandlers.js";
import { connectDB } from "./configs/db.js";
import userRoutes from "./routes/userRoutes.js";
import hotelRoutes from "./routes/hotelRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const PORT = 8000;

const app = express();

//db connection
connectDB();

//middlewares
app.use(express.json());
app.use(cors());

app.use("/api/user", userRoutes);
app.use("/api/hotel", hotelRoutes);
app.use("/api/booking", bookingRoutes);

// Define __dirname using ES module approach
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Static assets
app.use("/uploads", express.static(path.join(__dirname, "/uploads")));

// error handlers
app.use(errorResponseHandler);
app.use(invalidPathHandler);

app.listen(PORT, () => {
  console.log(`Server started at port http://localhost:${PORT}!`);
});
