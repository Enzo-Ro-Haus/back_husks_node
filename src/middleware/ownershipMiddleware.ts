import { RequestHandler } from "express";
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient(); 
import { UsuarioDireccion } from "@prisma/client"; 
import { AuthRequest } from "./authMiddleware";

export const checkDireccionOwnership: RequestHandler = async (req, res, next) => {
  const user = (req as AuthRequest).user;
  const direccionId = Number(req.params.id);

  const direccion = await prisma.direccion.findUnique({
    where: { id: direccionId },
    include: { usuarioDirecciones: true },
  });

  if (!direccion) {
    res.status(404).json({ error: "Dirección no existe" });
    return;
  }

  const esPropietario = direccion.usuarioDirecciones.some(
    (ud: UsuarioDireccion) => ud.usuarioId === user.id
  );

  if (user.rol !== "ADMIN" && !esPropietario) {
    res.status(403).json({ error: "No tiene permiso" });
    return;
  }

  next();
};

export const checkUsuarioDireccionOwnership: RequestHandler = async (req, res, next) => {
  const user = (req as AuthRequest).user;
  const udId = Number(req.params.id);

  const ud = await prisma.usuarioDireccion.findUnique({
    where: { id: udId }
  });
  if (!ud) {
    res.status(404).json({ error: "Relación no encontrada" });
    return;
  }

  if (user.rol !== "ADMIN" && ud.usuarioId !== user.id) {
    res.status(403).json({ error: "No tienes permiso" });
    return;
  }

  next();
};

export const checkOrdenOwnership: RequestHandler = async (req, res, next) => {
  const user = (req as AuthRequest).user;
  const ordenId = Number(req.params.id);

  const orden = await prisma.ordenDeCompra.findUnique({
    where: { id: ordenId },
    include: { detalles: true }                // si quieres verificar también por detalle
  });

  if (!orden) {
    res.status(404).json({ error: "Orden no encontrada" });
    return;
  }

  // Sólo ADMIN o dueño de la orden
  if (user.rol !== "ADMIN" && orden.usuarioId !== user.id) {
    res.status(403).json({ error: "No tienes permiso sobre esta orden" });
    return;
  }

  next();
};

// src/middleware/ownershipMiddleware.ts (continúa)
export const checkDetalleOwnership: RequestHandler = async (req, res, next) => {
  const user = (req as AuthRequest).user;
  const detalleId = Number(req.params.id);

  const detalle = await prisma.detalle.findUnique({
    where: { id: detalleId },
    include: { ordenDeCompra: true }
  });

  if (!detalle) {
    res.status(404).json({ error: "Detalle no encontrado" });
    return;
  }

  // ADMIN o dueño de la orden a la que pertenece el detalle
  if (user.rol !== "ADMIN" && detalle.ordenDeCompra.usuarioId !== user.id) {
    res.status(403).json({ error: "No tienes permiso sobre este detalle" });
    return;
  }

  next();
};
