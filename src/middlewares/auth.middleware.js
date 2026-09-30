import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config/env.config.js";

const auth = (req, res, next) => {
  const token = req.cookies["currentUser"];

  if (!token) {
    return res.status(401).json({ status: "error", message: "No autenticado" });
  }

  const user = jwt.verify(token, JWT_SECRET);

  if (!user) {
    return res.status(401).json({ status: "error", message: "No autenticado" });
  }

  req.user = user;
  next();
};

export default auth;
