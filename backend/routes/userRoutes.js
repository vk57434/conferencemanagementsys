import express from "express";
import { registerUser, loginUser, adminLogin, getReviewers, forgotPassword, resetPassword } from "../controllers/userController.js";
import { protect, authorizeRoles } from "../middleware/auth.js";
const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/admin/login", adminLogin);
router.get("/reviewers", protect, authorizeRoles("Admin"), getReviewers);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

export default router;
