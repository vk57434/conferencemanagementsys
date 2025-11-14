// config/db.js
import mongoose from "mongoose";

const connectDB = async () => {
  const uri = process.env.MONGO_URI || process.env.MONGODB_URI;
  if (!uri) {
    throw new Error(
      "Missing Mongo URI. Set MONGO_URI or MONGODB_URI in your .env"
    );
  }

  try {
    await mongoose.connect(uri, {
      // modern mongoose: no need for useNewUrlParser/useUnifiedTopology
      serverSelectionTimeoutMS: 10000,
    });
    console.log("✅ MongoDB connected:", mongoose.connection.host);
  } catch (err) {
    console.error("❌ MongoDB connection error:", err.message);
    throw err; // let caller decide whether to exit
  }
};

export default connectDB;
