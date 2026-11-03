import UserDTO from "../dto/User.dto.js";
import { userRepository } from "../repositories/index.js";
import { customError } from "../utils/customError.js";

class UserService {
  getAllUsers = async () => {
    const users = await userRepository.getAllUsers();
    return users.map((user) => new UserDTO(user));
  };

  changeUserRole = async (uid, role) => {
    
    if (!role || typeof role !== "string") {
      throw new customError("El rol debe ser una cadena de texto válida", 400);
    }

    const availableRoles = ["admin", "user", "organizer"];
    const newRole = role.trim().toLowerCase();

    if (!availableRoles.includes(newRole)) {
      throw new customError(
        "Los roles disponibles para usuarios son: 'user', 'organizer', 'admin'",
        400,
      );
    }

    const user = await userRepository.getUserById(uid);
   
    if (!user) {
      throw new customError("Usuario no encontrado", 404);
    }
    
    if (user.role === newRole) {
      throw new customError(`El usuario ya posee el rol '${newRole}'`, 400);
    }
    
    const updatedUser = await userRepository.update(uid, { role: newRole });
    return new UserDTO(updatedUser);
  };
}

export const userService = new UserService();
