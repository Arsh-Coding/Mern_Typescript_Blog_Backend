import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

import authRoutes from "./routes/authRoutes";
import postRoutes from "./routes/postRoutes";

// Middlewares
app.use(cors());
app.use(express.json());

// Simple Test Route
app.use((_: any, res: any) => {
  res.status(404).json({ message: "Route not found" });
});
app.get("/", (_, res) => {
  res.send("Blog API is running 🚀");
});
app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);
// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI!)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
