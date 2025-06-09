import express from "express";
import {
  createDireccion,
  getAllDirecciones,
  getDireccionById,
  updateDireccion,
  deleteDireccion
} from "../controllers/direccionController";
import { authenticateToken } from "../middleware/authMiddleware";
import { checkDireccionOwnership } from "../middleware/ownershipMiddleware";

const router = express.Router();

router.get("/", authenticateToken, getAllDirecciones); // ADMIN o filtrar por usuario dentro del controlador
router.get("/:id", authenticateToken, checkDireccionOwnership, getDireccionById);
router.post("/", authenticateToken, createDireccion);
router.put("/:id", authenticateToken, checkDireccionOwnership, updateDireccion);
router.delete("/:id", authenticateToken, checkDireccionOwnership, deleteDireccion);

export default router;
