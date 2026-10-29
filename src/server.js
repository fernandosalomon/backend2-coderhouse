import express from "express";
import { config } from "./config/env.config.js";
import { connectDB } from "./config/mongodb.config.js";

export const app = express();

connectDB();

app.listen(config.app.port, () => {
  console.log(`Servidor escuchando en el puerto ${config.app.port}`);
});
