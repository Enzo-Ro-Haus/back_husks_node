import jwt from "jsonwebtoken"
import { JwtPayload } from "../models/jwt.interface"

const JWT_SECRET = process.env.JWT_SECRET || "Default-secret"

export const generateToken = (user: JwtPayload): string => {
  return jwt.sign(
    {
      id: user.id,
      nombre: user.nombre,
      email: user.email,
      rol: user.rol,
    },
    JWT_SECRET,
    { expiresIn: "1h" }
  );
};