// backend/routes/reviewRoutes.js
import express from "express";
import { assignReviewer, submitReview, getReviewsForPaper, getAllReviews } from "../controllers/reviewController.js";
import { protect, authorizeRoles } from "../middleware/auth.js";
const router = express.Router();

router.post("/assign", protect, authorizeRoles("Admin"), assignReviewer);
router.post("/submit", protect, authorizeRoles("Reviewer"), submitReview);
router.get("/paper/:paperId", protect, authorizeRoles("Admin","Author","Reviewer"), getReviewsForPaper);
router.get("/all", protect, authorizeRoles("Admin"), getAllReviews);

export default router;
