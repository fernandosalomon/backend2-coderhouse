import jwt from "jsonwebtoken";
import { JWT_EXPIRES_IN, JWT_SECRET, NODE_ENV } from "../config/env.config.js";

export const register = async (req, res) => {
    const user = req.user;
    res.status(201).json({ status: "success", payload: user });
};

export const login = async (req, res) => {
  try {
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
    res.status(500).json({ status: "error", message: "Internal Server Error" });
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
