import { Router } from "express";
import {
  register,
  login,
  getCurrentUser,
  logoutUser,
} from "../controllers/sessions.controller.js";
import passport from "passport";
import { passportCall } from "../middlewares/passportCall.js";

const router = Router();

router.post(
  "/register",
  passport.authenticate("register", { session: false }),
  register,
);

router.post(
  "/login",
  passport.authenticate("login", { session: false }),
  login,
);

router.get("/current", passportCall("current"), getCurrentUser);

router.post("/logout", logoutUser);

export default router;
