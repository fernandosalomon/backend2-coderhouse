import * as userService from "../services/sessions.service.js";
import jwt from "jsonwebtoken";
import { JWT_EXPIRES_IN, JWT_SECRET, NODE_ENV } from "../config/env.config.js";

export const register = async (req, res) => {
  // const userData = req.body;
  try {
    // const newUser = await userService.createUser(userData);
    const newUser = req.user;
    res.status(201).json({ status: "success", payload: newUser });
  } catch (error) {
    const statusCode = error.statusCode || 500;
    res.status(statusCode).json({ status: "error", message: error.message });
  }
};

export const login = async (req, res) => {
  //const userData = req.body;
  try {
    //const user = await userService.loginUser(userData);
    const user = req.user;
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role,
      },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN },
    );

    res.cookie("currentUser", token, {
      httpOnly: true,
      sameSite: "lax",
      maxAge: 3600000,
      secure: NODE_ENV == "PRODUCTION" ? true : false,
    });

    res.status(200).json({ status: "success", message: "Login correcto" });
  } catch (error) {
    const statusCode = error.statusCode || 500;
    res.status(statusCode).json({ status: "error", message: error.message });
  }
};

export const getCurrentUser = (req, res) => {
  const user = req.user;
  res.status(200).json({
    status: "success",
    payload: {
      id: user.id,
      email: user.email,
      role: user.role,
    },
  });
};

export const logoutUser = (req, res) => {
  if (!req.cookies.currentUser) {
    return res
      .status(400)
      .json({ status: "error", message: "No user to logout" });
  }
  res.clearCookie("currentUser");
  res.status(200).json({ status: "success", message: "Sesión cerrada" });
};
