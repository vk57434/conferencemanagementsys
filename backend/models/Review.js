import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
  paper: { type: mongoose.Schema.Types.ObjectId, ref: "Paper", required: true },
  reviewer: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  rating: { type: Number, min: 1, max: 10 },
  comments: String,
  recommendation: { type: String, enum: ["Accept","Minor Revision","Major Revision","Reject"] },
  createdAt: { type: Date, default: Date.now }
});

// Prevent duplicate reviews: one reviewer can only review a paper once
reviewSchema.index({ paper: 1, reviewer: 1 }, { unique: true });

export default mongoose.model("Review", reviewSchema);
