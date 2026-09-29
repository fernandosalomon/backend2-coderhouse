import UserRepository from "../repositories/UserRepository.js";
import UsersDAO from "../dao/Users.dao.js";

const userDAO = new UsersDAO();
export const userRepository = new UserRepository(userDAO);