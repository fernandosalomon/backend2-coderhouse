import { Router } from "express";
import { authorize } from "../middlewares/authorize.middleware.js";
import { getAllUsers } from "../controllers/users.controller.js";
import passport from "passport";

const router = Router();

router.get(
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
  authorize("admin"),
  getAllUsers,
);

export default router;
