import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";

// Import routes only once
import userRoutes from "./routes/userRoutes.js";
import paperRoutes from "./routes/paperRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";
import scheduleRoutes from "./routes/scheduleRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import statsRoutes from "./routes/statsRoutes.js";

// Load environment variables
dotenv.config();

// Initialize app
const app = express();

// Middleware
app.use(cors({
  origin: "*", // Allow all origins for development (adjust in production)
  credentials: true
}));
app.use(express.json());

// Connect MongoDB (non-blocking - server will continue even if DB fails initially)
connectDB().catch(err => {
  console.error("❌ MongoDB connection failed, but server will continue running");
  console.error("⚠️  Some features may not work until MongoDB is connected");
});

// Default route
app.get("/", (req, res) => res.send("Conference Management API running ✅"));

// Use routes
app.use("/api/users", userRoutes);
app.use("/api/papers", paperRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/schedules", scheduleRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/stats", statsRoutes);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
