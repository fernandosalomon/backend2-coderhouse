import express from "express";
import { PORT } from "./config/env.config.js";
import { connectDB } from "./config/mongodb.config.js";

export const app = express();

connectDB();

app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});
