import mongoose from "mongoose";
import { MONGO_URI } from "./env.config.js"

export const connectDB = async () => {
  try {
    const mongoUri = MONGO_URI;
    await mongoose.connect(mongoUri);
    console.log("Conectado a la base de datos");
  } catch (error) {
    console.error("Error al conectar con la base de datos: ", error.message);
    process.exit(1);
  }
};