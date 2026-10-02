import { Router } from "express";
import { getEvents } from "../controllers/events.controller.js";
import { authorize } from "../middlewares/authorize.middleware.js";
import passport from "passport";

const router = Router();

router.get(
  "/",
  passport.authenticate("current", { session: false }),
  authorize("organizer", "admin"),
  getEvents,
);

export default router;
