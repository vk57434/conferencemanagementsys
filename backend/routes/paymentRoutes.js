// backend/routes/paymentRoutes.js
import express from "express";
import { createCheckoutSession, getCheckoutSession } from "../controllers/paymentController.js";
const router = express.Router();

router.post("/create-checkout-session", createCheckoutSession);
router.get("/session/:sessionId", getCheckoutSession);

export default router;
