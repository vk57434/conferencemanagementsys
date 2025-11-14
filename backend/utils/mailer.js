// backend/utils/mailer.js
import nodemailer from "nodemailer";

// Only create transporter if email credentials are provided
let transporter = null;

if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
  try {
    transporter = nodemailer.createTransport({
      service: "gmail",
      auth: { 
        user: process.env.EMAIL_USER, 
        pass: process.env.EMAIL_PASS 
      }
    });
  } catch (error) {
    console.error("Failed to create email transporter:", error.message);
  }
}

const sendEmail = async ({ to, subject, text, html }) => {
  if (!transporter) {
    throw new Error("Email service is not configured. Please set EMAIL_USER and EMAIL_PASS in .env file.");
  }
  
  const info = await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to,
    subject,
    text,
    html
  });
  return info;
};

export default sendEmail;
