import mongoose from "mongoose";
import { eventRepository } from "../repositories/index.js";
import { customError } from "../utils/customError.js";
import { EventDTO } from "../dto/Event.dto.js";

class EventService {
  getEvents = async ({ pagination, rawFilters }) => {
    const filterQuery = {};

    if (rawFilters.category) {
      filterQuery.category = rawFilters.category;
    }

    if (rawFilters.status) {
      filterQuery.status = rawFilters.status;
    }

    if (rawFilters.title) {
      filterQuery.title = { $regex: rawFilters.title.trim(), $options: "i" };
    }

    if (rawFilters.location) {
      filterQuery.location = {
        $regex: rawFilters.location.trim(),
        $options: "i",
      };
    }

    if (rawFilters.fromDate || rawFilters.toDate) {
      filterQuery.date = {};
      if (fromDate) {
        filterQuery.date.$gte = new Date(fromDate);
      }
      if (toDate) {
        filterQuery.date.$lte = new Date(toDate);
      }
    }

    filterQuery.status = "published";

    return await eventRepository.getPaginatedEvents(filterQuery, pagination);
  };

  getById = async (eid) => {
    const event = await eventRepository.getEventById(eid);

    if (!event) {
      throw new customError("El evento no existe", 404);
    }
    return new EventDTO(event);
  };

  create = async (event, uid) => {
    const { title, description, category, date, location, capacity, price } =
      event;
    if (
      !title ||
      !description ||
      !category ||
      !date ||
      !location ||
      capacity === undefined ||
      capacity === null
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

    const newEvent = await eventRepository.createEvent(eventDTO);
    return new EventDTO(newEvent);
  };

  update = async (eid, updateData, user) => {
    //TODO: Check if capacity is not full
    const event = await eventRepository.getEventById(eid);

    if (!event) {
      throw new customError("Evento no encontrado", 404);
    }

    if (
      user.role === "organizer" &&
      event.organizer._id.toString() !== user.id.toString()
    ) {
      throw new customError(
        "No tienes permisos para modificar este evento",
        403,
      );
    }

    if (event.status === "cancelled") {
      throw new customError(
        "Los eventos cancelados no pueden modificarse",
        400,
      );
    }

    const { title, description, category, date, location, capacity, price } =
      updateData;

    const newEventData = {};

    if (title) {
      newEventData.title = title.trim();
    }

    if (description) {
      newEventData.description = description.trim();
    }

    if (category) {
      newEventData.category = category.trim();
    }

    if (date !== undefined) {
      const newDate = new Date(date);

      if (Number.isNaN(newDate.getTime())) {
        throw new customError("La fecha proporcionada no es válida", 400);
      }

      if (newDate <= new Date()) {
        throw new customError("La fecha del evento debe ser futura", 400);
      }

      newEventData.date = newDate;
    }

    if (location) {
      newEventData.location = location.trim();
    }

    if (capacity !== undefined) {
      if (capacity <= 0) {
        throw new customError("La capacidad debe ser mayor a 0", 400);
      } else {
        newEventData.capacity = capacity;
      }
    }

    if (price !== undefined) {
      if (price < 0) {
        throw new customError("El precio no puede ser negativo");
      } else {
        newEventData.price = price;
      }
    }

    const updatedEvent = await eventRepository.updateEvent(eid, newEventData);
    return new EventDTO(updatedEvent);
  };

  updateStatus = async (eid, newStatus, user) => {
    const STATUS_LIST = ["draft", "published", "cancelled", "finished"];
    const event = await eventRepository.getEventById(eid);

    if (!event) {
      throw new customError("Evento no encontrado", 404);
    }

    if (
      user.role === "organizer" &&
      event.organizer._id.toString() !== user.id.toString()
    ) {
      throw new customError(
        "No tienes permisos para modificar este evento",
        403,
      );
    }

    if (!STATUS_LIST.includes(newStatus.trim().toLowerCase())) {
      throw new customError(
        "El estado de un evento solo puede ser: 'draft', 'published', 'cancelled' o 'finished'",
        400,
      );
    }

    if (
      event.date <= new Date() ||
      event.status.toLowerCase() === "cancelled" ||
      event.status.toLowerCase() === "finished"
    ) {
      throw new customError(
        "No se puede cambiar el estado de eventos cancelados o finalizados",
        400,
      );
    }

    const updatedEvent = await eventRepository.updateEvent(eid, {
      status: newStatus.trim().toLowerCase(),
    });
    return new EventDTO(updatedEvent);
  };
}

export const eventService = new EventService();
