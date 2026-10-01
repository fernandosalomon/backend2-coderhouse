import { Router } from "express";
import { getEvents } from "../controllers/events.controller.js";
import { auth } from "../middlewares/auth.js";
import passport from "passport";

const router = Router();

router.get(
  "/",
  passport.authenticate("current", { session: false }),
  auth("organizer", "admin"),
  getEvents,
);

export default router;
