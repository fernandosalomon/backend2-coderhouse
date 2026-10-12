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
import { passportCall } from "../middlewares/passportCall.js";

const router = Router();

router.get("/", getEvents);

router.get("/:eid", getEventById);

router.post(
  "/",
  passportCall("current"),
  authorize("organizer", "admin"),
  createEvent,
);

router.put(
  "/:eid",
  passportCall("current"),
  authorize("organizer", "admin"),
  updateEvent,
);

router.patch(
  "/:eid",
  passportCall("current"),
  authorize("organizer", "admin"),
  updateEventStatus,
);

router.post("/:eid/tickets", passportCall("current"), registerToEvent);

router.get(
  "/:eid/tickets",
  passportCall("current"),
  authorize("organizer", "admin"),
  listTickets,
);

export default router;
