import { createReservationCode } from "../utils/createTicketCode.js";
import {
  eventRepository,
  ticketRepository,
  userRepository,
} from "../repositories/index.js";
import { customError } from "../utils/customError.js";
import { sendMail } from "../utils/mailer.js";
import { TicketDTO } from "../dto/Ticket.dto.js";

class TicketService {
  async register(eid, uid, quantity = 1) {
    const seats = Number(quantity);

    if (!Number.isFinite(seats) || seats <= 0) {
      throw new customError("La cantidad de asientos debe ser mayor a 0", 400);
    }

    const event = await eventRepository.getEventById(eid);
    if (!event) {
      throw new customError("Evento no encontrado", 404);
    }

    if (event.date <= new Date() || event.status === "cancelled") {
      throw new customError(
        "No es posible inscribirse a un evento finalizado o cancelado",
        400,
      );
    }

    if (event.status !== "published") {
      throw new customError("El evento no se encuentra publicado", 400);
    }

    const active = await ticketRepository.getTicketByUserAndEvent(uid, eid);

    if (active !== null) {
      throw new customError(
        "Ya tienes un ticket confirmado o pendiente para este evento",
        400,
      );
    }

    const occupied = await this.occupiedSeats(eid);

    if (occupied + seats > event.capacity) {
      throw new customError(
        "No hay mas cupos disponibles para este evento",
        400,
      );
    }

    const ticket = await ticketRepository.createTicket({
      event: eid,
      user: uid,
      quantity: seats,
      reservationCode: createReservationCode(),
      status: "pending",
    });

    const user = await userRepository.getUserById(uid);

    await sendMail({
      to: user.email,
      subject: `Inscripción a ${event.title} confirmada`,
      text: `Hola ${user.first_name}, tu inscripción al evento ${event.title} ha sido confirmada. El código de reserva es ${ticket.reservationCode}.`,
    });

    return new TicketDTO(ticket);
  }

  async ownTickets(user) {
    const tickets = await ticketRepository.getTicketByUser(user.id);
    return tickets.map((p) => new TicketDTO(p));
  }

  async listByEvent(eid, actor, options) {
    const event = await eventRepository.getEventById(eid);
    if (!event) {
      throw new customError("El evento no existe", 404);
    }
    const isAdmin = actor.role === "admin";
    const isOwner = event.organizer._id.toString() === actor.id.toString();

    if (!isAdmin && !isOwner) {
      throw new customError("No tiene permisos para ver este evento", 403);
    }

    const { sort = "createdAt", skip = 0, limit = 10 } = options;
    const tickets = await ticketRepository.getTicketByEvent(eid, {
      sort,
      skip,
      limit,
    });
    return tickets;
  }

  async cancel(tid, actor) {
    const ticket = await ticketRepository.getTicketById(tid);
    if (!ticket) {
      throw new customError("Ticket no encontrado", 404);
    }

    const isAdmin = actor.role === "admin";
    const isOwner = ticket.user._id.toString() === actor.id.toString();

    if (!isAdmin && !isOwner) {
      throw new customError(
        "No tiene permisos para modificar este evento",
        403,
      );
    }

    if (ticket.status === "cancelled") {
      throw new customError("Este ticket ya ha sido cancelado", 400);
    }

    if (new Date(ticket.event.date) <= new Date()) {
      throw new customError(
        "No es posible cancelar un ticket de un evento que ya empezó",
        400,
      );
    }

    const cancelledTicket = await ticketRepository.updateTicket(tid, {
      status: "cancelled",
      cancelledAt: new Date(),
    });

    await sendMail({
      to: ticket.user.email || actor.email,
      subject: `Cancelación de tu inscripción a ${ticket.event.title} (${ticket.reservationCode})`,
      text: `Hola ${ticket.user.first_name}, tu inscripción a ${ticket.event.title} ha sido cancelada`,
    });

    return new TicketDTO(cancelledTicket);
  }

  async occupiedSeats(eid) {
    const tickets = await ticketRepository.getReservedQuantity(eid);
    return tickets;
  }
}

const ticketService = new TicketService();
export default ticketService;
