// backend/controllers/paymentController.js
import Stripe from "stripe";
import dotenv from "dotenv";

dotenv.config();

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
const stripe = stripeSecretKey
  ? new Stripe(stripeSecretKey, { apiVersion: "2023-10-16" })
  : null;

export const createCheckoutSession = async (req, res) => {
  try {
    if (!stripe) {
      return res.status(500).json({ message: "Stripe is not configured" });
    }

    const { registrationType, price } = req.body; // price in smallest currency unit (e.g. cents)

    if (!registrationType || typeof registrationType !== "string") {
      return res.status(400).json({ message: "Registration type is required" });
    }

    const unitAmount = Number(price);
    if (!Number.isInteger(unitAmount) || unitAmount <= 0) {
      return res.status(400).json({ message: "Price must be a positive integer" });
    }

    if (!process.env.FRONTEND_URL) {
      return res.status(500).json({ message: "FRONTEND_URL is not configured" });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "inr",
            product_data: { name: registrationType },
            unit_amount: unitAmount
          },
          quantity: 1
        }
      ],
      success_url: `${process.env.FRONTEND_URL}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL}/payment-cancel`
    });

    res.json({ url: session.url });
  } catch (error) {
    res.status(500).json({ message: error.message || "Unable to create payment session" });
  }
};

export const getCheckoutSession = async (req, res) => {
  try {
    if (!stripe) {
      return res.status(500).json({ message: "Stripe is not configured" });
    }

    const { sessionId } = req.params;
    if (!sessionId) {
      return res.status(400).json({ message: "Session ID is required" });
    }

    // Retrieve session with expanded line items to get product details
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['line_items']
    });
    res.json(session);
  } catch (error) {
    res.status(500).json({ message: error.message || "Unable to retrieve payment session" });
  }
};
