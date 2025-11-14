// backend/routes/scheduleRoutes.js
import express from "express";
import { createSession, getSessions } from "../controllers/scheduleController.js";
import { protect, authorizeRoles } from "../middleware/auth.js";
const router = express.Router();

router.post("/", protect, authorizeRoles("Admin"), createSession);
router.get("/", protect, getSessions); // All authenticated users can view schedules

export default router;
