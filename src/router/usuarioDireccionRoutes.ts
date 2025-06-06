import {
  createUsuarioDireccion,
  deleteUsuarioDireccion,
  getAllUsuarioDirecciones,
  getUsuarioDireccionById,
  updateUsuarioDireccion
} from "../controllers/usuarioDireccionController";

import express, { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
// Importar controladores correspondientes

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'default-secret';

// Middleware de autenticación (común para todos)
const authenticateToken = (req: Request, res: Response, next: NextFunction): void => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  
  if (!token) {
    res.status(401).json({ error: "No autorizado" });
    return;
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if(err) {
      console.error("Error en la autenticación", err);
      res.status(403).json({error: "Acceso denegado"});
      return;
    }
    next();
  });
};

// Rutas públicas
router.get("/", getAllUsuarioDirecciones);
router.get("/:id", getUsuarioDireccionById);

// Rutas privadas
router.post("/", authenticateToken, createUsuarioDireccion);
router.put("/:id", authenticateToken, updateUsuarioDireccion);
router.delete("/:id", authenticateToken, deleteUsuarioDireccion);

export default router;