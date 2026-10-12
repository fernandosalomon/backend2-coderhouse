import passport from "passport";
import { customError } from "../utils/customError.js";

export const passportCall = (strategy) => {
  return (req, res, next) => {
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
  };
};
