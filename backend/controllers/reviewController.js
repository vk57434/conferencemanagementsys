import Review from "../models/Review.js";
import Paper from "../models/Paper.js";
import User from "../models/User.js";
import mongoose from "mongoose";
import sendEmail from "../utils/mailer.js";

export const assignReviewer = async (req, res) => {
  try {
    const { paperId, reviewerId } = req.body;
    
    // Validate paperId
    if (!paperId || !mongoose.Types.ObjectId.isValid(paperId)) {
      return res.status(400).json({ message: "Invalid paper ID" });
    }
    
    // Validate reviewerId
    if (!reviewerId || !mongoose.Types.ObjectId.isValid(reviewerId)) {
      return res.status(400).json({ message: "Invalid reviewer ID. Please provide a valid MongoDB ObjectId." });
    }
    
    const paper = await Paper.findById(paperId);
    if (!paper) {
      return res.status(404).json({ message: "Paper not found" });
    }
    
    // Check if reviewer exists
    const reviewer = await User.findById(reviewerId);
    if (!reviewer) {
      return res.status(404).json({ message: "Reviewer not found" });
    }
    
    // Optionally verify reviewer has Reviewer role
    if (reviewer.role !== "Reviewer") {
      return res.status(400).json({ message: `User ${reviewer.email} does not have Reviewer role. Current role: ${reviewer.role}` });
    }
    
    paper.reviewer = reviewerId;
    paper.status = "Under Review";
    await paper.save();
    res.json({ message: "Reviewer assigned", paper });
  } catch (error) {
    res.status(500).json({ message: error.message || "Unable to assign reviewer" });
  }
};

export const submitReview = async (req, res) => {
  try {
    const { paperId, rating, comments, recommendation } = req.body;
    const reviewerId = req.user?._id;

    if (!reviewerId) {
      return res.status(401).json({ message: "Authentication required" });
    }

    // Check if this reviewer has already reviewed this paper
    const existingReview = await Review.findOne({ 
      paper: paperId, 
      reviewer: reviewerId 
    });

    if (existingReview) {
      return res.status(400).json({ 
        message: "You have already submitted a review for this paper. You can only submit one review per paper." 
      });
    }

    const review = await Review.create({
      paper: paperId,
      reviewer: reviewerId,
      rating,
      comments,
      recommendation
    });

    await Paper.findByIdAndUpdate(paperId, { status: "Under Review" });

    // Try to send email notification (optional - don't fail if email fails)
    if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
      try {
        await sendEmail({
          to: process.env.EMAIL_USER,
          subject: `New review submitted for paper ${paperId}`,
          text: `Reviewer ${req.user?.email || reviewerId} submitted a review. Recommendation: ${recommendation}`
        });
      } catch (emailError) {
        // Log email error but don't fail the review submission
        console.error("Email notification failed:", emailError.message);
      }
    }

    res.status(201).json(review);
  } catch (error) {
    res.status(500).json({ message: error.message || "Unable to submit review" });
  }
};

export const getReviewsForPaper = async (req, res) => {
  try {
    const { paperId } = req.params;
    const reviews = await Review.find({ paper: paperId }).populate("reviewer", "name email");
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message || "Unable to fetch reviews" });
  }
};

export const getAllReviews = async (req, res) => {
  try {
    const reviews = await Review.find()
      .populate("paper", "title abstract status author")
      .populate("reviewer", "name email")
      .sort({ createdAt: -1 }); // Most recent first
    
    // Remove duplicates based on paper + reviewer combination (keep most recent)
    const uniqueReviews = [];
    const seen = new Map();
    
    for (const review of reviews) {
      const key = `${review.paper?._id || review.paper}-${review.reviewer?._id || review.reviewer}`;
      if (!seen.has(key)) {
        seen.set(key, true);
        uniqueReviews.push(review);
      }
    }
    
    res.json(uniqueReviews);
  } catch (error) {
    res.status(500).json({ message: error.message || "Unable to fetch reviews" });
  }
};
