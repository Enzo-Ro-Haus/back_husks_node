import express from "express";
import {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser
} from "../controllers/userController";
import { authenticateToken, isAdmin, isSelfOrAdmin } from "../middleware/authMiddleware";

const router = express.Router();
router.get("/", authenticateToken, isAdmin, getAllUsers);          // ← SOLO ADMIN
router.get("/:id", authenticateToken, isSelfOrAdmin("id"), getUserById);
router.put("/:id", authenticateToken, isSelfOrAdmin("id"), updateUser);
router.delete("/:id", authenticateToken, isSelfOrAdmin("id"), deleteUser);

export default router;