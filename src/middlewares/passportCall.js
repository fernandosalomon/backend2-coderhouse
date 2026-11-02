import passport from "passport";
import { customError } from "../utils/customError.js";

export const passportCall = (strategy) => {
  return (req, res, next) => {
    if (strategy == "register" || strategy == "login") {
      if (!req.body.email || !req.body.password) {
        return next(
          new customError("Username y password son obligatorios", 400),
        );
      }

      passport.authenticate(strategy, { session: false })(req, res, next);
    }

    if (strategy == "current") {
      passport.authenticate(
        "current",
        { session: false },
        (err, user, info) => {
          if (err) {
            return next(new customError("No autenticado", 401));
          }

          if (!user) {
            return next(new customError("No autenticado", 401));
          }

          req.user = user;
          next();
        },
      )(req, res, next);
    }
  };
};
