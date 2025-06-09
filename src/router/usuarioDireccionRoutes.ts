// src/router/usuarioDireccionRoutes.ts
import express from "express";
import {
  createUsuarioDireccion,
  getAllUsuarioDirecciones,
  getUsuarioDireccionById,
  updateUsuarioDireccion,
  deleteUsuarioDireccion
} from "../controllers/usuarioDireccionController";
import { authenticateToken, AuthRequest } from "../middleware/authMiddleware";
import { checkUsuarioDireccionOwnership } from "../middleware/ownershipMiddleware";

const router = express.Router();

router.get(
  "/",
  authenticateToken,
  (req, res, next) => {
    const user = (req as AuthRequest).user;
    if (user.rol !== "ADMIN") {
      res.status(403).json({ error: "Requiere rol ADMIN" });
      return;
    }
    next();
  },
  getAllUsuarioDirecciones
);


router.get(
  "/:id",
  authenticateToken,
  checkUsuarioDireccionOwnership,
  getUsuarioDireccionById
);

router.post(
  "/",
  authenticateToken,
  (req, res, next) => {
    next();
  },
  createUsuarioDireccion
);

router.put(
  "/:id",
  authenticateToken,
  checkUsuarioDireccionOwnership,
  updateUsuarioDireccion
);


router.delete(
  "/:id",
  authenticateToken,
  checkUsuarioDireccionOwnership,
  deleteUsuarioDireccion
);

export default router;
