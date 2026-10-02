import { eventRepository } from "../repositories/index.js";
import { customError } from "../utils/customError.js";

class EventService {
  getAll() {
    const events = eventRepository.getAll();
    return events;
  }

  getById(eid) {
    const event = eventRepository.getById(eid);
    if (!event) {
      throw new customError("El evento no existe", 400);
    }
    return event;
  }
}

export const eventService = new EventService();
