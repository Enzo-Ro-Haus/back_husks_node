import express, { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import {
  createProducto,
  deleteProducto,
  getAllProductos,
  getProductoById,
  updateProducto
} from "../controllers/productoController";

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'default-secret';

// Middleware de autenticación
const authenticateToken = (req: Request, res: Response, next: NextFunction): void => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    res.status(401).json({ error: "No autorizado" });
    return;
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      console.error("Error en la autenticación", err);
      res.status(403).json({ error: "Acceso denegado" });
      return;
    }
    next();
  });
};

// Rutas públicas
router.get("/", getAllProductos);
router.get("/:id", getProductoById);

// Rutas protegidas
router.post("/", authenticateToken, createProducto);
router.put("/:id", authenticateToken, updateProducto);
router.delete("/:id", authenticateToken, deleteProducto);

export default router;
