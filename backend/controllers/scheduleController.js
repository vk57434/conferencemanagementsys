// backend/controllers/scheduleController.js
import Schedule from "../models/Schedule.js";
import sendEmail from "../utils/mailer.js";

export const createSession = async (req, res) => {
  try {
    const { title, room, startTime, endTime, chairs, papers } = req.body;
    const session = await Schedule.create({ title, room, startTime, endTime, chairs, papers });

    // Optionally notify chairs / paper authors
    res.status(201).json(session);
  } catch (error) {
    res.status(500).json({ message: error.message || "Unable to create session" });
  }
};

export const getSessions = async (req, res) => {
  try {
    const sessions = await Schedule.find()
      .populate("chairs", "name email")
      .populate("papers", "title");
    res.json(sessions);
  } catch (error) {
    res.status(500).json({ message: error.message || "Unable to fetch sessions" });
  }
};
