import { Router } from "express";
import {
  createEvent,
  getEventById,
  getEvents,
} from "../controllers/events.controller.js";
import { authorize } from "../middlewares/authorize.middleware.js";
import passport from "passport";

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
  createEvent,
);

export default router;
