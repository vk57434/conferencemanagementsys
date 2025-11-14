// backend/controllers/paperController.js
import Paper from "../models/Paper.js";
import Review from "../models/Review.js";
import sendEmail from "../utils/mailer.js";

// 🧩 1. Author submits paper
export const submitPaper = async (req, res) => {
  try {
    const { title, abstract } = req.body;
    const authorId = req.user?._id;
    
    if (!authorId) {
      return res.status(401).json({ message: "Authentication required" });
    }
    
    // Validate input
    if (!title || !title.trim()) {
      return res.status(400).json({ message: "Paper title is required" });
    }
    
    if (!abstract || !abstract.trim()) {
      return res.status(400).json({ message: "Paper abstract is required" });
    }
    
    // Check for duplicate paper (same author, same title)
    const existingPaper = await Paper.findOne({ 
      author: authorId, 
      title: title.trim() 
    });
    
    if (existingPaper) {
      return res.status(400).json({ 
        message: "You have already submitted a paper with this title. Please use a different title or contact admin if you need to update your submission." 
      });
    }
    
    const paper = await Paper.create({ 
      title: title.trim(), 
      abstract: abstract.trim(), 
      author: authorId 
    });
    res.status(201).json(paper);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 🧩 2. Get all papers
export const getAllPapers = async (req, res) => {
  try {
    const papers = await Paper.find().populate("author reviewer", "name email");
    res.json(papers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 🧩 2.5. Get papers assigned to current reviewer (excluding already reviewed ones)
export const getMyAssignedPapers = async (req, res) => {
  try {
    const reviewerId = req.user?._id;
    if (!reviewerId) {
      return res.status(401).json({ message: "Authentication required" });
    }
    
    // Get all papers assigned to this reviewer
    const papers = await Paper.find({ reviewer: reviewerId }).populate("author", "name email");
    
    // Get all reviews submitted by this reviewer
    const reviews = await Review.find({ reviewer: reviewerId }).select("paper");
    const reviewedPaperIds = new Set(reviews.map(r => r.paper.toString()));
    
    // Filter out papers that have already been reviewed
    const unreviewedPapers = papers.filter(paper => !reviewedPaperIds.has(paper._id.toString()));
    
    res.json(unreviewedPapers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 🧩 2.6. Get papers by author
export const getMyPapers = async (req, res) => {
  try {
    const authorId = req.user?._id;
    if (!authorId) {
      return res.status(401).json({ message: "Authentication required" });
    }
    
    const papers = await Paper.find({ author: authorId })
      .populate("reviewer", "name email")
      .sort({ createdAt: -1 });
    
    res.json(papers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 🧩 3. Admin make decision (accept/reject)
export const makeDecision = async (req, res) => {
  try {
    const { paperId, decision, comments } = req.body;
    const paper = await Paper.findById(paperId).populate("author");

    if (!paper) return res.status(404).json({ message: "Paper not found" });

    paper.status = decision;
    await paper.save();

    // Try to send email notification to author (optional - don't fail if email fails)
    if (process.env.EMAIL_USER && process.env.EMAIL_PASS && paper.author?.email) {
      try {
        await sendEmail({
          to: paper.author.email,
          subject: `Decision on paper: ${paper.title}`,
          text: `Your paper has been ${decision}. Comments: ${comments || "No comments"}`,
        });
      } catch (emailError) {
        // Log email error but don't fail the decision
        console.error("Email notification failed:", emailError.message);
      }
    }

    res.json({ message: `Paper ${decision.toLowerCase()}`, paper });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
