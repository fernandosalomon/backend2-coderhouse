import express from "express";
import { PORT } from "./config/env.config.js";

export const app = express();

app.listen(PORT,() => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
})