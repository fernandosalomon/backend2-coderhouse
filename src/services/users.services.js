import UserDTO from "../dto/User.dto.js";
import { userRepository } from "../repositories/index.js";

class UserService {
  getAllUsers = async () => {
    const users = await userRepository.getAll();
    return users.map((user) => new UserDTO(user));
  };
}

export const userService = new UserService();
