import * as userService from "../services/sessions.service.js"

export const register = async (req, res) => {
  const userData = req.body;
  try {
    const newUser = await userService.createUser(userData);
    res.status(201).json({status: "success", payload: newUser})
  } catch (error) {
    const statusCode = error.statusCode || 500;
    res.status(statusCode).json({ status: "error", message: error.message })
  }
};

export const login = (req, res) => {
  res.status(200).json({
    status: "success",
    message: "Endpoint de login (en construcción)"
  });
};