import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  role: { type: String, enum: ["Admin", "Reviewer", "Author", "Participant"], default: "Author" },
  resetPasswordToken: String,
  resetPasswordExpire: Date
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
});

export default mongoose.model("User", userSchema);
