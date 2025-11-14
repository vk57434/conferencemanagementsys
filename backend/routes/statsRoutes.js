// backend/routes/statsRoutes.js
import express from "express";
import { getDashboardStats, getReviewerStats, getAuthorStats, getParticipantStats } from "../controllers/statsController.js";
import { protect, authorizeRoles } from "../middleware/auth.js";

const router = express.Router();

router.get("/dashboard", protect, authorizeRoles("Admin"), getDashboardStats);
router.get("/reviewer", protect, authorizeRoles("Reviewer"), getReviewerStats);
router.get("/author", protect, authorizeRoles("Author"), getAuthorStats);
router.get("/participant", protect, authorizeRoles("Participant"), getParticipantStats);

export default router;

