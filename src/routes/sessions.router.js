import { Router } from "express";
import {
  register,
  login,
  getCurrentUser,
  logoutUser,
} from "../controllers/sessions.controller.js";
import { passportCall } from "../middlewares/passportCall.js";

const router = Router();

router.post("/register", passportCall("register"), register);

router.post("/login", passportCall("login"), login);

router.get("/current", passportCall("current"), getCurrentUser);

router.post("/logout", logoutUser);

export default router;
