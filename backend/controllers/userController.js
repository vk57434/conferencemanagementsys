import User from "../models/User.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import sendEmail from "../utils/mailer.js";

export const registerUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Prevent Admin role registration through public registration
    if (role === "Admin") {
      return res.status(403).json({ message: "Admin role cannot be registered through public registration" });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const user = await User.create({
      name,
      email,
      password,
      role: role && role.trim() ? role : undefined
    });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role
    });
  } catch (error) {
    res.status(500).json({ message: error.message || "Unable to register user" });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    if (!process.env.JWT_SECRET) {
      return res.status(500).json({ message: "JWT secret is not configured" });
    }

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: "7d"
    });
    res.json({
      token,
      role: user.role,
      user: { _id: user._id, name: user.name, email: user.email }
    });
  } catch (error) {
    res.status(500).json({ message: error.message || "Unable to login" });
  }
};

export const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if user is an admin
    if (user.role !== "Admin") {
      return res.status(403).json({ message: "Access denied. Admin privileges required." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    if (!process.env.JWT_SECRET) {
      return res.status(500).json({ message: "JWT secret is not configured" });
    }

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: "7d"
    });
    res.json({
      token,
      role: user.role,
      user: { _id: user._id, name: user.name, email: user.email }
    });
  } catch (error) {
    res.status(500).json({ message: error.message || "Unable to login" });
  }
};

export const getReviewers = async (req, res) => {
  try {
    const reviewers = await User.find({ role: "Reviewer" }).select("_id name email");
    res.json(reviewers);
  } catch (error) {
    res.status(500).json({ message: error.message || "Unable to fetch reviewers" });
  }
};

// Forgot Password - Send reset token via email
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const user = await User.findOne({ email });

    if (!user) {
      // Don't reveal if user exists or not for security
      return res.status(200).json({ 
        message: "If an account exists with this email, a password reset link has been sent." 
      });
    }

    // Prevent Admin from using forgot password
    if (user.role === "Admin") {
      return res.status(403).json({ 
        message: "Password reset is not available for admin accounts. Please contact system administrator." 
      });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto.createHash("sha256").update(resetToken).digest("hex");

    // Set token and expiration (1 hour from now)
    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpire = Date.now() + 60 * 60 * 1000; // 1 hour

    await user.save({ validateBeforeSave: false });

    // Create reset URL
    const resetUrl = `${process.env.FRONTEND_URL || "http://localhost:5173"}/reset-password/${resetToken}`;

    // Send email
    try {
      await sendEmail({
        to: user.email,
        subject: "Password Reset Request - Conference Management System",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #2563eb;">Password Reset Request</h2>
            <p>Hello ${user.name},</p>
            <p>You requested to reset your password. Click the button below to reset it:</p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${resetUrl}" 
                 style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
                Reset Password
              </a>
            </div>
            <p>Or copy and paste this link into your browser:</p>
            <p style="color: #666; word-break: break-all;">${resetUrl}</p>
            <p style="color: #999; font-size: 12px; margin-top: 30px;">
              This link will expire in 1 hour. If you didn't request this, please ignore this email.
            </p>
          </div>
        `
      });

      res.status(200).json({ 
        message: "If an account exists with this email, a password reset link has been sent." 
      });
    } catch (emailError) {
      // Reset token fields if email fails
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;
      await user.save({ validateBeforeSave: false });

      console.error("Email error:", emailError);
      return res.status(500).json({ 
        message: "Failed to send email. Please try again later." 
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message || "Unable to process password reset request" });
  }
};

// Reset Password - Update password with token
export const resetPassword = async (req, res) => {
  try {
    const { token, password } = req.body;

    if (!token || !password) {
      return res.status(400).json({ message: "Token and password are required" });
    }

    // Hash the token to compare with stored token
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    // Find user with valid token and not expired
    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpire: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired reset token" });
    }

    // Prevent Admin from resetting password through this method
    if (user.role === "Admin") {
      return res.status(403).json({ 
        message: "Password reset is not available for admin accounts." 
      });
    }

    // Update password
    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    res.status(200).json({ message: "Password has been reset successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message || "Unable to reset password" });
  }
};