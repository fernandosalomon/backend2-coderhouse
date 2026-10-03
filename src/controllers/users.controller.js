import { userService } from "../services/users.services.js";

export const getAllUsers = async (req, res) => {
  try {
    const users = await userService.getAllUsers();
    res.status(200).json({ status: "success", payload: users });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      status: "error",
      message: error.message ? error.message : "Internal Server Error",
    });
  }
};
