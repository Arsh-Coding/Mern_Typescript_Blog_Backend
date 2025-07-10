"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const mongoose_1 = __importDefault(require("mongoose"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const postRoutes_1 = __importDefault(require("./routes/postRoutes"));
// Middlewares
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Simple Test Route
app.use((_, res) => {
    res.status(404).json({ message: "Route not found" });
});
app.get("/", (_, res) => {
    res.send("Blog API is running 🚀");
});
app.use("/api/auth", authRoutes_1.default);
app.use("/api/posts", postRoutes_1.default);
// MongoDB Connection
mongoose_1.default
    .connect(process.env.MONGO_URI)
    .then(() => console.log("✅ MongoDB connected"))
    .catch((err) => console.error("❌ MongoDB connection error:", err));
app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
});
