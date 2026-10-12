import mongoose from "mongoose";
import { eventRepository } from "../repositories/index.js";
import { customError } from "../utils/customError.js";

class EventService {
  getAll = (query) => {
    const {
      category,
      status,
      location,
      fromDate,
      toDate,
      page = 1,
      limit = 10,
      sort = "date",
    } = query;

    const filters = {};

    if (category) {
      filters.category = category;
    }

    if (status) {
      filters.status = status;
    }

    if (location) {
      filters.location = {
        $regex: location,
        $options: "i",
      };
    }

    if (fromDate || toDate) {
      filters.date = {};
      if (fromDate) {
        filters.date.$gte = new Date(fromDate);
      }
      if (toDate) {
        filters.date.$lte = new Date(toDate);
      }
    }

    const pagination = {};
    const pageNumber = Number(page);
    pagination.page = pageNumber;

    const limitNumber = Number(limit);
    pagination.limit = limitNumber;

    const skip = (pageNumber - 1) * limitNumber;
    pagination.skip = skip;

    pagination.sort = { date: 1 };

    const events = eventRepository.getAll(filters, pagination);
    return events;
  };

  getById = (eid) => {
    const event = eventRepository.getById(eid);
    if (!event) {
      throw new customError("El evento no existe", 400);
    }
    return event;
  };

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
  };

  update = async (eid, updateData, user) => {
    const event = await eventRepository.getById(eid);

    if (!event) {
      throw new customError("Evento no encontrado", 400);
    }

    // 1. Un organizer solo puede modificar sus propios eventos.
    if (
      user.role === "organizer" &&
      event.organizer.toString() !== user.id.toString()
    ) {
      throw new customError(
        "No tienes permisos para modificar este evento",
        403,
      );
    }

    // 2. Los eventos cancelados no pueden modificarse.
    if (event.status === "cancelled") {
      throw new customError(
        "Los eventos cancelados no pueden modificarse",
        400,
      );
    }

    // 3. Validar fecha si se está modificando.
    if (updateData.date !== undefined) {
      const newDate = new Date(updateData.date);

      if (Number.isNaN(newDate.getTime())) {
        throw new customError("La fecha proporcionada no es válida", 400);
      }

      if (newDate <= new Date()) {
        throw new customError("La fecha del evento debe ser futura", 400);
      }

      updateData.date = newDate;
    }

    // 4. Validar capacity si se está modificando.
    if (updateData.capacity !== undefined) {
      if (updateData.capacity <= 0) {
        throw new customError("La capacidad debe ser mayor a 0", 400);
      }
    }

    // 5. Validar price si se está modificando.
    if (updateData.price !== undefined) {
      if (updateData.price < 0) {
        throw new customError("El precio no puede ser negativo");
      }
    }

    const updatedEvent = await eventRepository.update(eid, updateData);
    return updatedEvent;
  };

  updateStatus = async (eid, newStatus, user) => {
    const event = await eventRepository.getById(eid);

    if (!event) {
      throw new customError("Evento no encontrado", 400);
    }

    // 1. Un organizer solo puede modificar sus propios eventos.
    if (
      user.role === "organizer" &&
      event.organizer.toString() !== user.id.toString()
    ) {
      throw new customError(
        "No tienes permisos para modificar este evento",
        401,
      );
    }

    if (newStatus === "cancelled" && event.date <= new Date()) {
      return res.status(400).json({
        status: "error",
        message: "No se puede cancelar un evento que ya finalizó",
      });
    }

    const updatedEvent = await eventRepository.update(eid, {
      status: newStatus,
    });
    return updatedEvent;
  };
}

export const eventService = new EventService();
