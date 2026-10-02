import UserRepository from "../repositories/UserRepository.js";
import EventRepository from "../repositories/EventRepository.js";
import UsersDAO from "../dao/Users.dao.js";
import EventsDAO from "../dao/Events.dao.js";

const userDAO = new UsersDAO();
const eventDAO = new EventsDAO();
export const userRepository = new UserRepository(userDAO);
export const eventRepository = new EventRepository(eventDAO);
