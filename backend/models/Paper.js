import mongoose from "mongoose";

const paperSchema = new mongoose.Schema({
  title: String,
  abstract: String,
  author: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  fileUrl: String,
  status: { type: String, enum: ["Submitted", "Under Review", "Accepted", "Rejected", "Minor Revision", "Major Revision"], default: "Submitted" },
  reviewer: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
});

// Add compound index to prevent duplicate submissions (same author, same title)
paperSchema.index({ author: 1, title: 1 }, { unique: true });

export default mongoose.model("Paper", paperSchema);
