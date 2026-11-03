import mongoose from "mongoose";
import bcrypt from "bcrypt";
import { config } from "../src/config/env.config.js";
import { userRepository } from "../src/repositories/index.js";

const seedUsers = async () => {
  try {
    await mongoose.connect(config.db.mongoUri);

    console.log("Conectado a la base de datos para seeding...");

    const passwordHash = await bcrypt.hash("Coder1234", 10);
    const initialUsers = [
      {
        first_name: "Admin",
        last_name: "Sistema",
        email: "admin@mail.com",
        password: passwordHash,
        role: "admin",
      },
      {
        first_name: "Usuario",
        last_name: "Regular",
        email: "user@mail.com",
        password: passwordHash,
        role: "user",
      },
      {
        first_name: "Usuario",
        last_name: "Organizador",
        email: "organizer@mail.com",
        password: passwordHash,
        role: "organizer",
      },
    ];

    for (const userData of initialUsers) {
      const existingUser = await userRepository.getUserByEmail(userData.email);
      if (!existingUser) {
        await userRepository.createUser(userData);
        console.log(`Usuario creado: ${userData.email} (${userData.role})`);
      } else {
        console.log(`El usuario ${userData.email} ya existe, omitiendo...`);
      }
    }
    console.log("Seeding completado con éxito.");
    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error("Error durante el seeding:", error.message);
    process.exit(1);
  }
};

seedUsers();
