import mongoose from "mongoose";
import { eventRepository } from "../repositories/index.js";
import { customError } from "../utils/customError.js";

class EventService {
  getAll = () => {
    const events = eventRepository.getAll();
    return events;
  }

  getById = (eid) => {
    const event = eventRepository.getById(eid);
    if (!event) {
      throw new customError("El evento no existe", 400);
    }
    return event;
  }

  create = (event, uid) => {
    const { title, description, category, date, location, capacity, price } =
      event;

    if (
      !title ||
      !description ||
      !category ||
      !date ||
      !location ||
      !capacity
    ) {
      throw new customError("Faltan campos obligatorios", 400);
    }

    const eventDate = new Date(date);
    const now = new Date();
    if (eventDate <= now) {
      throw new customError("La fecha del evento debe ser futura", 400);
    }

    const parsedCapacity = Number(capacity);
    if (capacity <= 0) {
      throw new customError("La capacidad debe ser mayor a cero", 400);
    }

    const parsedPrice = Number(price) || 0;
    if (price && price < 0) {
      throw new customError(
        "El precio debe ser un número positivo o cero",
        400,
      );
    }

    const eventDTO = {
      title,
      description,
      category,
      date: eventDate,
      location,
      capacity: parsedCapacity,
      price: parsedPrice,
      status: "draft",
      organizer: new mongoose.Types.ObjectId(uid),
    };

    const newEvent = eventRepository.create(eventDTO);
    return newEvent;
  }
}

export const eventService = new EventService();
