import UserRepository from "../repositories/UserRepository.js";
import UsersDAO from "../dao/Users.dao.js";
import { isValidEmail } from "../utils/validators.js";
import { hashPassword } from "../utils/hash.js";
import UserDTO from "../dto/User.dto.js";
import { AppError } from "../utils/customError.js";

const Users = new UserRepository(new UsersDAO());

export const createUser = async (userData) => {
  let { first_name, last_name, email, password } = userData;

  if (!first_name || !last_name || !email || !password) {
    throw new AppError("Faltan campos obligatorios", 400);
  }

  if (!isValidEmail(email.toLowerCase().trim())) {
    throw new AppError("El email es inválido", 400);
  }

  if (password.length < 8) {
    throw new AppError(
      "La contraseña debe contener al menos 8 caracteres",
      400,
    );
  }

  const userExists = await Users.getUserByEmail(email);

  if (userExists == null) {
    throw new AppError("El email ya está registrado", 409);
  }

  const newUser = await Users.create({
    first_name,
    last_name,
    email: email.toLowerCase().trim(),
    password: hashPassword(password),
    role: "user",
  });

  return new UserDTO(newUser);
};
