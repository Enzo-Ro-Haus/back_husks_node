import express, { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";


import {
  createCategoria,
  deleteCategoria,
  getAllCategorias,
  getCategoriaById,
  updateCategoria
} from "../controllers/categoriaController";


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


// ... código común de autenticación ...

// Rutas públicas (solo lectura)
router.get("/", getAllCategorias);
router.get("/:id", getCategoriaById);

// Rutas privadas (requieren autenticación)
router.post("/", authenticateToken, createCategoria);
router.put("/:id", authenticateToken, updateCategoria);
router.delete("/:id", authenticateToken, deleteCategoria);

export default router;