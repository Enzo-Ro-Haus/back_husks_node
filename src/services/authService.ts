import { Usuario } from "../models/usuario.inteface"
import jwt from "jsonwebtoken"

const JWT_SECRET = process.env.JWT_SECRET || "Default-secret"

export const generateToken = (usuario : Usuario): string => {
    return jwt.sign({
        id: usuario.id,
        nombre: usuario.nombre,
        email: usuario.email,
        password: usuario.password
    },
    JWT_SECRET,
    {expiresIn : '1h'}
)}