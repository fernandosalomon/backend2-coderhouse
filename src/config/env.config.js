import dotenv from "dotenv";
dotenv.config();

const requireEnv = (key, value) => {
  if (!value) {
    throw new Error(
      `[Config Error] Falta la variable de entorno obligatoria: ${key}`,
    );
  }
  return value;
};

export const config = {
  app: {
    port: parseInt(process.env.PORT, 10) || 8080,
    environment: process.env.NODE_ENV.toUpperCase() || "DEVELOPMENT",
  },

  db: {
    mongoUri: requireEnv("MONGO_URI", process.env.MONGO_URI),
  },

  jwt: {
    secret: requireEnv("JWT_SECRET", process.env.JWT_SECRET),
    expiresIn: process.env.JWT_EXPIRES_IN || "24h",
  },

  cookies: {
    secret: requireEnv("COOKIE_SECRET", process.env.COOKIE_SECRET),
  },

  mail: {
    host: requireEnv("MAIL_HOST", process.env.MAIL_HOST),
    port: requireEnv("MAIL_PORT", parseInt(process.env.MAIL_PORT, 10)),
    user: requireEnv("MAIL_USER", process.env.MAIL_USER),
    pass: requireEnv("MAIL_PASS", process.env.MAIL_PASS),
    from: requireEnv("MAIL_FROM", process.env.MAIL_FROM),
  },
};
