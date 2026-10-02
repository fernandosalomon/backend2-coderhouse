import { Router } from "express";
import { getEventById, getEvents } from "../controllers/events.controller.js";
import { authorize } from "../middlewares/authorize.middleware.js";
import passport from "passport";

const router = Router();

router.get("/", getEvents);
router.get("/:eid", getEventById);

export default router;
