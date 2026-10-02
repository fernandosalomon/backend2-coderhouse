import EventDTO from "../dto/Event.dto.js";
import { eventRepository } from "../repositories/index.js";
import { customError } from "../utils/customError.js";

export const createNewEvent = async (eventData) => {
  const { title, description, date, location, capacity, price } = eventData;
  if (!title || !description || !date || !location || !capacity || !price) {
    throw new customError("Faltan campos obligatorios", 400);
  }

  const parsedCapacity = Number(capacity);
  if (isNaN(parsedCapacity) || parsedCapacity <= 0) {
    throw new customError(
      "La capacidad debe ser un número entero mayor a 0",
      400,
    );
  }

  const eventDate = new Date(date);
  if (isNaN(eventDate.getTime()) || eventDate <= new Date()) {
    throw new customError(
      "La fecha del evento debe ser posterior a la fecha actual",
      400,
    );
  }

  const newEventPayload = {
    title: title.trim(),
    description: description?.trim(),
    date: eventDate,
    capacity: parsedCapacity,
    availableSeats: parsedCapacity,
    price: Number(price) || 0,
    location: location?.trim(),
    status: "active",
    createdBy: userId,
  };

  const createdEvent = await eventRepository.create(newEventPayload);

  return new EventDTO(createdEvent);
};
