import { isValidEmail } from "../utils/validators.js";
import { checkPassword, hashPassword } from "../utils/hash.js";
import UserDTO from "../dto/User.dto.js";
import { AppError } from "../utils/customError.js";
import { userRepository } from "../repositories/index.js";

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

  const existingUser = await userRepository.getUserByEmail(email);

  if (existingUser == null) {
    throw new AppError("El email ya está registrado", 409);
  }

  const newUser = await userRepository.create({
    first_name,
    last_name,
    email: email.toLowerCase().trim(),
    password: hashPassword(password),
    role: "user",
  });

  return new UserDTO(newUser);
};

export const loginUser = async (userData) => {
  let { email, password } = userData;

  if (!email || !password) {
    throw new AppError("Credenciales inválidas", 401);
  }

  const user = await userRepository.getUserByEmail(email.toLowerCase().trim());

  if (user == null) {
    throw new AppError("Credenciales inválidas", 401);
  }

  const isPasswordValid = checkPassword(password, user.password);

  if (!isPasswordValid) {
    throw new AppError("Credenciales inválidas", 401);
  }

  return new UserDTO(user);
};
