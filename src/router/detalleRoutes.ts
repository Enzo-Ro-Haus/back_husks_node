import express from "express";
import {
  createDetalle,
  getAllDetalles,
  getDetalleById,
  updateDetalle,
  deleteDetalle
} from "../controllers/detalleController";
import { authenticateToken, AuthRequest } from "../middleware/authMiddleware";
import { checkDetalleOwnership } from "../middleware/ownershipMiddleware";

const router = express.Router();

// Sólo ADMIN lista todos
router.get("/", authenticateToken, (req, res, next) => {
  const user = (req as any).user;
  if (user.rol !== "ADMIN") {
    res.status(403).json({ error: "Requiere rol ADMIN" });
    return;
  }
  next();
}, getAllDetalles);

// ADMIN o dueño ve su detalle
router.get("/:id", authenticateToken, checkDetalleOwnership, getDetalleById);

// Crear: cualquier usuario autenticado crea detalle en su orden
// (en el controlador, fuerza detalle.ordenDeCompraId y no permitas IDs arbitrarios)
router.post(
  "/",
  authenticateToken,
  (req, res) => createDetalle(req as AuthRequest, res)
);


// ADMIN o dueño puede actualizar o borrar
router.put("/:id", authenticateToken, checkDetalleOwnership, updateDetalle);
router.delete("/:id", authenticateToken, checkDetalleOwnership, deleteDetalle);

export default router;
