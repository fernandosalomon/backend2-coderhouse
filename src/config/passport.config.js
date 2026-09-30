import passport from "passport";
import passportJWT from "passport-jwt";
import local from "passport-local";
import { JWT_SECRET } from "./env.config.js";
import { checkPassword, hashPassword } from "../utils/hash.js";
import UserDTO from "../dto/User.dto.js";
import { customError } from "../utils/customError.js";
import { userRepository } from "../repositories/index.js";
import { isValidEmail } from "../utils/validators.js";

const getToken = (req) => {
  let token = null;

  if (req.cookies.currentUser) {
    token = req.cookies.currentUser;
  }

  return token;
};

export const initPassport = async () => {
  passport.use(
    "current",
    new passportJWT.Strategy(
      {
        secretOrKey: JWT_SECRET,
        jwtFromRequest: passportJWT.ExtractJwt.fromExtractors([getToken]),
      },
      async (payload, done) => {
        try {
          return done(null, payload);
        } catch (error) {
          return done(error);
        }
      },
    ),
  );

  passport.use(
    "login",
    new local.Strategy(
      {
        usernameField: "email",
      },
      async (username, password, done) => {
        try {
          const user = await userRepository.getUserByEmail(
            username.toLowerCase().trim(),
          );

          if (user == null) {
            return done(new customError("Credenciales Inválidas", 401));
          }

          const isPasswordValid = checkPassword(password, user.password);

          if (!isPasswordValid) {
            return done(new customError("Credenciales Inválidas", 401));
          }

          return done(null, new UserDTO(user));
        } catch (error) {
          return done(error);
        }
      },
    ),
  );

  passport.use(
    "register",
    new local.Strategy(
      {
        usernameField: "email",
        passReqToCallback: true,
      },
      async (req, username, password, done) => {
        try {
          let { first_name, last_name } = req.body;

          if (!first_name || !last_name) {
            return done(new customError("Faltan campos obligatorios", 400));
          }

          if (!isValidEmail(username.toLowerCase().trim())) {
            return done(new customError("El email es inválido", 400));
          }

          if (password.length < 8) {
            return done(
              new customError(
                "La contraseña debe contener al menos 8 caracteres",
                400,
              ),
            );
          }

          const existingUser = await userRepository.getUserByEmail(
            username.toLowerCase().trim(),
          );

          if (existingUser != null) {
            return done(new customError("El email ya está registrado", 409));
          }

          const newUser = await userRepository.create({
            first_name,
            last_name,
            email: username.toLowerCase().trim(),
            password: hashPassword(password),
            role: "user",
          });

          done(null, new UserDTO(newUser));
        } catch (error) {
          return done(error);
        }
      },
    ),
  );
};
