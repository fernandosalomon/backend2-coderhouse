import UserRepository from "./UserRepository.js";
import EventRepository from "./EventRepository.js";
import UsersDAO from "../dao/Users.dao.js";
import EventsDAO from "../dao/Events.dao.js";

const eventDAO = new EventsDAO();
const userDAO = new UsersDAO();
export const userRepository = new UserRepository(userDAO);
export const eventRepository = new EventRepository(eventDAO);
