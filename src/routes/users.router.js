import { Router } from "express";
import { authorize } from "../middlewares/authorize.middleware.js";
import { getAllUsers } from "../controllers/users.controller.js";
import { passportCall } from "../middlewares/passportCall.js";

const router = Router();

router.get(
  "/",
  passportCall("current"),
  authorize("admin"),
  getAllUsers
);

export default router;
