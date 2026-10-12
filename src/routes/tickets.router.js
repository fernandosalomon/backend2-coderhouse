import { Router } from "express";
import {
  cancelTicket,
  getUserTickets,
} from "../controllers/tickets.controller.js";
import { authorize } from "../middlewares/authorize.middleware.js";
import { passportCall } from "../middlewares/passportCall.js";

const router = Router();

router.get(
  "/my-tickets",
  passportCall("current"),
  authorize("user", "organizer", "admin"),
  getUserTickets,
);

router.patch(
  "/:tid/cancel",
  passportCall("current"),
  authorize("user", "organizer", "admin"),
  cancelTicket,
);

export default router;
