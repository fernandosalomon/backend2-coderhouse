import { Router } from "express";
import {
  register,
  login,
  getCurrentUser,
  logoutUser,
} from "../controllers/sessions.controller.js";
import passport from "passport";
import { customError } from "../utils/customError.js";

const router = Router();

router.post(
  "/register",
  passport.authenticate("register", { session: false }),
  register
);

router.post(
  "/login",
  passport.authenticate("login", { session: false }),
  login,
);

router.get(
  "/current",
  (req, res, next) => {
    passport.authenticate(
      "current",
      { session: false },
      (err, user, info) => {
        if (err) {
          return next(new customError("No autenticado", 401));
        }

        if (!user) {
          return next(new customError("No autenticado", 401));
        }

        req.user = user;
        next();
      },
    )(req, res, next);
  },
  getCurrentUser,
);

router.post("/logout", logoutUser);

export default router;
