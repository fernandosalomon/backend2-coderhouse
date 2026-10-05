import { Router } from "express";
import {
  createEvent,
  getEventById,
  getEvents,
  listTickets,
  registerToEvent,
  updateEvent,
  updateEventStatus,
} from "../controllers/events.controller.js";
import { authorize } from "../middlewares/authorize.middleware.js";
import passport from "passport";
import { customError } from "../utils/customError.js";

const router = Router();

router.get("/", getEvents);
router.get("/:eid", getEventById);
router.post(
  "/",
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
  createEvent,
);

router.put(
  "/:eid",
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
  updateEvent,
);

router.patch(
  "/:eid",
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
  updateEventStatus,
);

router.post(
  "/:eid/tickets",
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
  registerToEvent,
);

router.get(
  "/:eid/tickets",
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
  listTickets,
);

export default router;
