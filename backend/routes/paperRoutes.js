// backend/routes/paperRoutes.js
import express from "express";
import { protect, authorizeRoles } from "../middleware/auth.js";
import {
  submitPaper,
  getAllPapers,
  getMyAssignedPapers,
  getMyPapers,
  makeDecision
} from "../controllers/paperController.js";

const router = express.Router();

// ✅ Author submits a paper
router.post("/submit", protect, authorizeRoles("Author"), submitPaper);

// ✅ Admin/Reviewer can view all papers
router.get("/", protect, authorizeRoles("Admin", "Reviewer"), getAllPapers);

// ✅ Reviewer can view their assigned papers
router.get("/my-assigned", protect, authorizeRoles("Reviewer"), getMyAssignedPapers);

// ✅ Author can view their own papers
router.get("/my-papers", protect, authorizeRoles("Author"), getMyPapers);

// ✅ Admin make acceptance or rejection decisions
router.post("/decision", protect, authorizeRoles("Admin"), makeDecision);

export default router;
