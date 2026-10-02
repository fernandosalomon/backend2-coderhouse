import { createNewEvent } from "../services/events.services.js";

export const getEvents = (req, res) => {
  res.status(200).json({ status: "success", payload: [] });
};

export const createEvent = (req, res) => {
  const eventData = req.body;
  const userID = req.user.id;
  try {
    const newEvent = createNewEvent(eventData);
    res.status(201).json({ status: "success", payload: newEvent });
  } catch (error) {
    return res
      .status(500)
      .json({ status: "error", message: "Internal Server Error" });
  }
};
