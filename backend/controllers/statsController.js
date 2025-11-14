// backend/controllers/statsController.js
import Paper from "../models/Paper.js";
import Review from "../models/Review.js";
import User from "../models/User.js";
import Schedule from "../models/Schedule.js";

export const getParticipantStats = async (req, res) => {
  try {
    const participantId = req.user?._id;
    if (!participantId) {
      return res.status(401).json({ message: "Authentication required" });
    }

    // Get conference schedule
    const sessions = await Schedule.find()
      .populate("chairs", "name email")
      .populate("papers", "title status author")
      .sort({ startTime: 1 })
      .limit(10);

    // Get accepted papers (for viewing)
    const acceptedPapers = await Paper.find({ status: "Accepted" })
      .populate("author", "name email")
      .select("title abstract author")
      .limit(5);

    res.json({
      overview: {
        totalSessions: sessions.length,
        upcomingSessions: sessions.filter(s => new Date(s.startTime) > new Date()).length,
        acceptedPapers: acceptedPapers.length
      },
      upcomingSessions: sessions.filter(s => new Date(s.startTime) > new Date()).slice(0, 5),
      acceptedPapers
    });
  } catch (error) {
    res.status(500).json({ message: error.message || "Unable to fetch participant statistics" });
  }
};

export const getAuthorStats = async (req, res) => {
  try {
    const authorId = req.user?._id;
    if (!authorId) {
      return res.status(401).json({ message: "Authentication required" });
    }

    // Get all papers by this author
    const myPapers = await Paper.find({ author: authorId })
      .populate("reviewer", "name email")
      .sort({ createdAt: -1 });

    // Get reviews for author's papers (only if there are papers)
    let reviews = [];
    if (myPapers.length > 0) {
      const paperIds = myPapers.map(p => p._id);
      reviews = await Review.find({ paper: { $in: paperIds } })
        .populate("reviewer", "name email")
        .populate("paper", "title")
        .sort({ createdAt: -1 })
        .limit(5);
    }

    // Count papers by status
    const submittedCount = myPapers.filter(p => p.status === "Submitted").length;
    const underReviewCount = myPapers.filter(p => p.status === "Under Review").length;
    const acceptedCount = myPapers.filter(p => p.status === "Accepted").length;
    const rejectedCount = myPapers.filter(p => p.status === "Rejected").length;
    const minorRevisionCount = myPapers.filter(p => p.status === "Minor Revision").length;
    const majorRevisionCount = myPapers.filter(p => p.status === "Major Revision").length;

    // Recent papers (last 5)
    const recentPapers = myPapers.slice(0, 5);

    res.json({
      overview: {
        totalPapers: myPapers.length,
        submitted: submittedCount,
        underReview: underReviewCount,
        accepted: acceptedCount,
        rejected: rejectedCount,
        minorRevision: minorRevisionCount,
        majorRevision: majorRevisionCount
      },
      recentPapers,
      recentReviews: reviews
    });
  } catch (error) {
    res.status(500).json({ message: error.message || "Unable to fetch author statistics" });
  }
};

export const getReviewerStats = async (req, res) => {
  try {
    const reviewerId = req.user?._id;
    if (!reviewerId) {
      return res.status(401).json({ message: "Authentication required" });
    }

    // Get all papers assigned to this reviewer
    const assignedPapers = await Paper.find({ reviewer: reviewerId })
      .populate("author", "name email")
      .select("title status author createdAt");

    // Get all reviews submitted by this reviewer
    const myReviews = await Review.find({ reviewer: reviewerId })
      .populate("paper", "title status")
      .sort({ createdAt: -1 })
      .limit(5);

    // Get reviewed paper IDs
    const reviewedPaperIds = new Set(myReviews.map(r => r.paper?._id?.toString() || r.paper?.toString()));

    // Separate assigned papers into pending and reviewed
    const pendingPapers = assignedPapers.filter(paper => !reviewedPaperIds.has(paper._id.toString()));
    const reviewedPapers = assignedPapers.filter(paper => reviewedPaperIds.has(paper._id.toString()));

    // Count by status
    const pendingCount = pendingPapers.length;
    const reviewedCount = reviewedPapers.length;
    const totalAssigned = assignedPapers.length;

    res.json({
      overview: {
        totalAssigned,
        pendingReviews: pendingCount,
        completedReviews: reviewedCount
      },
      pendingPapers: pendingPapers.slice(0, 5), // Show first 5 pending
      recentReviews: myReviews
    });
  } catch (error) {
    res.status(500).json({ message: error.message || "Unable to fetch reviewer statistics" });
  }
};

export const getDashboardStats = async (req, res) => {
  try {
    // Get total counts
    const totalPapers = await Paper.countDocuments();
    const totalUsers = await User.countDocuments();
    const totalReviews = await Review.countDocuments();
    const totalSessions = await Schedule.countDocuments();

    // Get paper status counts
    const submittedPapers = await Paper.countDocuments({ status: "Submitted" });
    const underReviewPapers = await Paper.countDocuments({ status: "Under Review" });
    const acceptedPapers = await Paper.countDocuments({ status: "Accepted" });
    const rejectedPapers = await Paper.countDocuments({ status: "Rejected" });
    const minorRevisionPapers = await Paper.countDocuments({ status: "Minor Revision" });
    const majorRevisionPapers = await Paper.countDocuments({ status: "Major Revision" });

    // Get papers without reviewers
    const unassignedPapers = await Paper.countDocuments({ 
      $or: [
        { reviewer: { $exists: false } },
        { reviewer: null }
      ]
    });

    // Get user role counts
    const totalAuthors = await User.countDocuments({ role: "Author" });
    const totalReviewers = await User.countDocuments({ role: "Reviewer" });
    const totalAdmins = await User.countDocuments({ role: "Admin" });
    const totalParticipants = await User.countDocuments({ role: "Participant" });

    // Get recent papers (last 5)
    const recentPapers = await Paper.find()
      .populate("author", "name email")
      .sort({ createdAt: -1 })
      .limit(5)
      .select("title status author createdAt");

    // Get papers pending decision (under review)
    const pendingDecisions = await Paper.find({ status: "Under Review" })
      .populate("author reviewer", "name email")
      .limit(5)
      .select("title status author reviewer");

    res.json({
      overview: {
        totalPapers,
        totalUsers,
        totalReviews,
        totalSessions
      },
      papers: {
        submitted: submittedPapers,
        underReview: underReviewPapers,
        accepted: acceptedPapers,
        rejected: rejectedPapers,
        minorRevision: minorRevisionPapers,
        majorRevision: majorRevisionPapers,
        unassigned: unassignedPapers
      },
      users: {
        authors: totalAuthors,
        reviewers: totalReviewers,
        admins: totalAdmins,
        participants: totalParticipants
      },
      recentPapers,
      pendingDecisions
    });
  } catch (error) {
    res.status(500).json({ message: error.message || "Unable to fetch statistics" });
  }
};

