import { EventDTO } from "../dto/Event.dto.js";
import { eventService } from "../services/events.services.js";
import ticketService from "../services/tickets.services.js";

export const getEvents = async (req, res) => {
  const filters = req.query;

  try {
    const events = await eventService.getAll(filters);

    res.status(200).json({
      status: "success",
      payload: {
        data: events.docs.map((e) => new EventDTO(e)),
        page: events.page,
        limit: events.limit,
        total: events.totalDocs,
        totalPages: events.totalPages,
      },
    });
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

export const createEvent = async (req, res) => {
  const eventData = req.body;
  const user = req.user;
  try {
    const newEvent = await eventService.create(eventData, user.id);
    res.status(201).json({ status: "success", payload: newEvent });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      status: "error",
      message: error.message ? error.message : "Internal Server Error",
    });
  }
};

export const updateEvent = async (req, res) => {
  const eid = req.params.eid;
  const updateData = req.body;
  const user = req.user;
  try {
    const updatedEvent = await eventService.update(eid, updateData, user);
    res.status(200).json({ status: "success", payload: updatedEvent });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      status: "error",
      message: error.message ? error.message : "Internal Server Error",
    });
  }
};

export const updateEventStatus = async (req, res) => {
  const eid = req.params.eid;
  const { status } = req.body;
  const user = req.user;

  try {
    const updatedStatus = await eventService.updateStatus(eid, status, user);
    res.status(200).json({ status: "success", payload: updatedStatus });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      status: "error",
      message: error.message ? error.message : "Internal Server Error",
    });
  }
};

export const registerToEvent = async (req, res) => {
  const user = req.user;
  const eid = req.params.eid;
  const { quantity } = req.body;
  try {
    const registration = await ticketService.register(eid, user.id, quantity);
    res.status(201).json({ status: "success", payload: registration });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      status: "error",
      message: error.message ? error.message : "Internal Server Error",
    });
  }
};

export const listTickets = async (req, res) => {
  const user = req.user;
  const eid = req.params.eid;
  try {
    const tickets = await ticketService.listByEvent(eid, user);
    res.status(200).json({ status: "success", payload: tickets });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      status: "error",
      message: error.message ? error.message : "Internal Server Error",
    });
  }
};
