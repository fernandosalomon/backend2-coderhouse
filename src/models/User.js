import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    first_name: {
      type: String,
      required: [true, "El campo first_name es requerido"],
    },
    last_name: {
      type: String,
      required: [true, "El campo last_name es requerido"],
    },
    email: {
      type: String,
      required: [true, "El campo email es requerido"],
      unique: [true, "El email ya está registrado"],
    },
    password: {
      type: String,
      min: [8, "La contraseña debe contener al menos 8 caracteres"],
      required: [true, "El campo password es requerido"],
    },
    role: {
      type: String,
      enum: ["user", "admin", "organizer"],
      default: "user",
    },
  },
  { timestamps: true },
);

const UserModel = mongoose.model("User", userSchema);
export default UserModel;
