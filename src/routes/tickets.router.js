import { Router } from "express";
import {
  cancelTicket,
  getUserTickets,
} from "../controllers/tickets.controller.js";
import { customError } from "../utils/customError.js";
import passport from "passport";
import { authorize } from "../middlewares/authorize.middleware.js";

const router = Router();

router.get(
  "/my-tickets",
  (req, res, next) => {
    passport.authenticate("current", { session: false }, (err, user, info) => {
      if (err) {
        return next(new customError("No autenticado", 401));
      }

      if (!user) {
        return next(new customError("No autenticado", 401));
      }

      req.user = user;
      next();
    })(req, res, next);
  },
  authorize("user", "organizer", "admin"),
  getUserTickets,
);

router.patch(
  "/:tid/cancel",
  (req, res, next) => {
    passport.authenticate("current", { session: false }, (err, user, info) => {
      if (err) {
        return next(new customError("No autenticado", 401));
      }

      if (!user) {
        return next(new customError("No autenticado", 401));
      }

      req.user = user;
      next();
    })(req, res, next);
  },
  authorize("organizer", "admin"),
  cancelTicket,
);

export default router;
