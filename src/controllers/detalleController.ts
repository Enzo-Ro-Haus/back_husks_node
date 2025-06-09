import { Request, Response } from "express";
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from "../middleware/authMiddleware";
const prisma = new PrismaClient(); 

export const createDetalle = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
  const user = req.user;
    const { ordenDeCompraId, productoId, cantidad } = req.body;
    const usuarioId = req.body.user.id;  // forzamos el userId

    // Validaciones básicas
    if (!ordenDeCompraId || !productoId || cantidad === undefined) {
      res.status(400).json({ message: "Faltan campos obligatorios" });
      return;
    }
    if (cantidad <= 0) {
      res.status(400).json({ message: "La cantidad debe ser mayor a cero" });
      return;
    }

    // Verificar que la orden exista y sea del usuario (o que sea ADMIN, si prefieres)
    const orden = await prisma.ordenDeCompra.findUnique({
      where: { id: ordenDeCompraId },
    });
    if (!orden) {
      res.status(404).json({ message: "Orden de compra no encontrada" });
      return;
    }
    if (orden.usuarioId !== usuarioId && req.user.rol !== "ADMIN") {
      res.status(403).json({ message: "No tienes permiso sobre esa orden" });
      return;
    }

    const detalle = await prisma.detalle.create({
      data: {
        ordenDeCompra: { connect: { id: ordenDeCompraId } },
        producto: { connect: { id: productoId } },
        cantidad,
      },
    });

    res.status(201).json(detalle);
  } catch (error: any) {
    if (error.code === "P2003") {
      res.status(400).json({ message: "Orden o producto no encontrado" });
    } else {
      console.error(error);
      res.status(500).json({ error: "Hubo un error, pruebe más tarde" });
    }
  }
};

export const getAllDetalles = async (req: Request, res: Response): Promise<void> => {
    try {
        const detalles = await prisma.detalle.findMany({
            include: {
                ordenDeCompra: true,
                producto: true
            }
        });
        res.status(200).json(detalles);
    } catch (error: any) {
        console.error(error);
        res.status(500).json({ error: 'Hubo un error, pruebe más tarde' });
    }
    return;
};

export const getDetalleById = async (req: Request, res: Response): Promise<void> => {
    const detalleId = parseInt(req.params.id);
    try {
        const detalle = await prisma.detalle.findUnique({
            where: { id: detalleId },
            include: {
                ordenDeCompra: true,
                producto: true
            }
        });
        
        if (!detalle) {
            res.status(404).json({ error: 'Detalle no encontrado' });
            return;
        }
        
        res.status(200).json(detalle);
    } catch (error: any) {
        console.error(error);
        res.status(500).json({ error: 'Hubo un error, pruebe más tarde' });
    }
    return;
};

export const updateDetalle = async (req: Request, res: Response): Promise<void> => {
    const detalleId = parseInt(req.params.id);
    const { cantidad } = req.body;
    
    try {
        if (cantidad === undefined || cantidad <= 0) {
            res.status(400).json({ message: 'Cantidad inválida' });
            return;
        }
        
        const detalle = await prisma.detalle.update({
            where: { id: detalleId },
            data: { cantidad }
        });
        
        res.status(200).json(detalle);
    } catch (error: any) {
        if (error?.code === 'P2025') {
            res.status(404).json('Detalle no encontrado');
        } else {
            console.error(error);
            res.status(500).json({ error: 'Hubo un error, pruebe más tarde' });
        }
    }
    return;
};

export const deleteDetalle = async (req: Request, res: Response): Promise<void> => {
    const detalleId = parseInt(req.params.id);
    
    try {
        await prisma.detalle.delete({
            where: { id: detalleId }
        });
        
        res.status(200).json({
            message: `Detalle ${detalleId} eliminado correctamente`
        });
    } catch (error: any) {
        if (error?.code === 'P2025') {
            res.status(404).json('Detalle no encontrado');
        } else {
            console.error(error);
            res.status(500).json({ error: 'Hubo un error, pruebe más tarde' });
        }
    }
    return;
};