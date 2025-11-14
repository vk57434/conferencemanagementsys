// backend/models/Schedule.js
import mongoose from "mongoose";

const sessionSchema = new mongoose.Schema({
  title: String,
  room: String,
  startTime: Date,
  endTime: Date,
  chairs: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  papers: [{ type: mongoose.Schema.Types.ObjectId, ref: "Paper" }]
});

export default mongoose.model("Schedule", sessionSchema);
