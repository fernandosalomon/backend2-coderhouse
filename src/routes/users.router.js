import { Router } from "express";
import { authorize } from "../middlewares/authorize.middleware.js";
import {
  changeUserRole,
  getAllUsers,
} from "../controllers/users.controller.js";
import { passportCall } from "../middlewares/passportCall.js";

const router = Router();

router.get("/", passportCall("current"), authorize("admin"), getAllUsers);

router.patch(
  "/:uid/changeRole",
  passportCall("current"),
  authorize("admin"),
  changeUserRole,
);

export default router;
