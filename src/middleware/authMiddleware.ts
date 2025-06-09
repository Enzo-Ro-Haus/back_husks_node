// src/middleware/authMiddleware.ts
import { Request, Response, NextFunction, RequestHandler } from "express";
import jwt from "jsonwebtoken";
import { JwtPayload } from "../models/jwt.interface";

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error("Falta configurar JWT_SECRET en el .env");
}


export interface AuthRequest extends Request {
  user: JwtPayload;
}

/**
 * Middleware de autenticación
 */
export const authenticateToken: RequestHandler = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader?.split(" ")[1];

  if (!token) {
    res.status(401).json({ error: "No autorizado" });
    return;
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err || !decoded) {
      res.status(403).json({ error: "Acceso denegado" });
      return;
    }
    // Asumimos decoded coincide con JwtPayload
    (req as AuthRequest).user = decoded as JwtPayload;
    next();
  });
};

/**
 * Solo ADMIN
 */
export const isAdmin: RequestHandler = (req, res, next) => {
  const user = (req as AuthRequest).user;
  if (user.rol !== "ADMIN") {
    res.status(403).json({ error: "Requiere rol ADMIN" });
    return;
  }
  next();
};

/**
 * ADMIN o el mismo usuario (según parámetro de ruta)
 */
export const isSelfOrAdmin = (paramIdName: string): RequestHandler => {
  return (req, res, next) => {
    const user = (req as AuthRequest).user;
    const paramId = Number(req.params[paramIdName]);
    if (user.rol === "ADMIN" || user.id === paramId) {
      next();
      return;
    }
    res.status(403).json({ error: "No tiene permiso" });
  };
};
