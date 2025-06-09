import express from "express";
import {
createOrdenDeCompra,  getAllOrdenesDeCompra,
  getOrdenDeCompraById,
  updateOrdenDeCompra,
  deleteOrdenDeCompra
} from "../controllers/ordenDeCompraController";
import { authenticateToken, AuthRequest } from "../middleware/authMiddleware";
import { checkOrdenOwnership } from "../middleware/ownershipMiddleware";

const router = express.Router();

// Sólo ADMIN lista todas
router.get("/", authenticateToken, (req, res, next) => {
  const user = (req as any).user;
  if (user.rol !== "ADMIN") {
    res.status(403).json({ error: "Requiere rol ADMIN" });
    return;
  }
  next();
}, getAllOrdenesDeCompra);

// ADMIN o dueño ve su orden
router.get("/:id", authenticateToken, checkOrdenOwnership, getOrdenDeCompraById);

// Crear: cualquier usuario autenticado crea su propia orden
router.post("/", authenticateToken, (req, res) => createOrdenDeCompra(req as AuthRequest, res)); // ✅


// ADMIN o dueño puede actualizar o borrar
router.put("/:id", authenticateToken, checkOrdenOwnership, updateOrdenDeCompra);
router.delete("/:id", authenticateToken, checkOrdenOwnership, deleteOrdenDeCompra);

export default router;
