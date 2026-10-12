import UserRepository from "./UserRepository.js";
import EventRepository from "./EventRepository.js";
import UsersDAO from "../dao/Users.dao.js";
import EventsDAO from "../dao/Events.dao.js";
import TicketsDAO from "../dao/Tickets.dao.js";
import TicketRepository from "./TicketRepository.js";

const eventDAO = new EventsDAO();
const userDAO = new UsersDAO();
const ticketDAO = new TicketsDAO();
export const userRepository = new UserRepository(userDAO);
export const eventRepository = new EventRepository(eventDAO);
export const ticketRepository = new TicketRepository(ticketDAO);
