import { eventService } from "../services/events.services.js";

export const getEvents = async (req, res) => {
  try {
    const events = await eventService.getAll();
    res.status(200).json({ status: "success", payload: events });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      status: "error",
      message: error.message ? error.message : "Internal Server Error",
    });
  }
};

export const getEventById = async (req, res) => {
  const eid = req.params.eid;
  try {
    const event = await eventService.getById(eid);
    res.status(200).json({ status: "success", payload: event });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      status: "error",
      message: error.message ? error.message : "Internal Server Error",
    });
  }
};

export const createEvent = (req, res) => {
  const eventData = req.body;
  const user = req.user;
};
