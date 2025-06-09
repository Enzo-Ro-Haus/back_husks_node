import { Request, Response } from "express";
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient(); 
import { MetodoPagoEnum } from '../enums/MetodoPagoEnum';
import { EstadoOrdenEnum } from '../enums/EstadoOrdenEnum';
import { AuthRequest } from "../middleware/authMiddleware";

export const createOrdenDeCompra = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { usuarioDireccionId, precioTotal, metodoPago, estado, detalles } = req.body;
    const usuarioId = req.user.id;  // ← aquí forzamos el userId del token

    // Validaciones básicas
    if (!usuarioDireccionId || precioTotal === undefined || !metodoPago || !estado) {
      res.status(400).json({ message: "Faltan campos obligatorios" });
      return;
    }

    // (Opcional, si quieres verificar que la dirección pertenece al usuario)
    const dir = await prisma.usuarioDireccion.findFirst({
      where: { id: usuarioDireccionId, usuarioId },
    });
    if (!dir) {
      res.status(403).json({ message: "No tienes permiso sobre esa dirección" });
      return;
    }

    const orden = await prisma.ordenDeCompra.create({
      data: {
        usuario: { connect: { id: usuarioId } },            // ← usamos solo este
        usuarioDireccion: { connect: { id: usuarioDireccionId } },
        fecha: new Date(),
        precioTotal,
        metodoPago,
        estado,
        detalles: {
          create: detalles.map((d: any) => ({
            producto: { connect: { id: d.productoId } },
            cantidad: d.cantidad,
          })),
        },
      },
      include: { detalles: true },
    });

    res.status(201).json(orden);
  } catch (error: any) {
    if (error.code === "P2003") {
      res.status(400).json({ message: "Dirección o producto no encontrado" });
    } else {
      console.error(error);
      res.status(500).json({ error: "Hubo un error, pruebe más tarde" });
    }
  }
};

export const getAllOrdenesDeCompra = async (req: Request, res: Response): Promise<void> => {
    try {
        const ordenes = await prisma.ordenDeCompra.findMany({
            include: {
                usuario: true,
                usuarioDireccion: true,
                detalles: {
                    include: {
                        producto: true
                    }
                }
            }
        });
        res.status(200).json(ordenes);
    } catch (error: any) {
        console.error(error);
        res.status(500).json({ error: 'Hubo un error, pruebe más tarde' });
    }
    return;
};

export const getOrdenDeCompraById = async (req: Request, res: Response): Promise<void> => {
    const ordenId = parseInt(req.params.id);
    try {
        const orden = await prisma.ordenDeCompra.findUnique({
            where: { id: ordenId },
            include: {
                usuario: true,
                usuarioDireccion: true,
                detalles: {
                    include: {
                        producto: true
                    }
                }
            }
        });
        
        if (!orden) {
            res.status(404).json({ error: 'Orden de compra no encontrada' });
            return;
        }
        
        res.status(200).json(orden);
    } catch (error: any) {
        console.error(error);
        res.status(500).json({ error: 'Hubo un error, pruebe más tarde' });
    }
    return;
};

export const updateOrdenDeCompra = async (req: Request, res: Response): Promise<void> => {
    const ordenId = parseInt(req.params.id);
    const { estado } = req.body;
    
    try {
        // Solo permitimos actualizar el estado
        const orden = await prisma.ordenDeCompra.update({
            where: { id: ordenId },
            data: { estado }
        });
        
        res.status(200).json(orden);
    } catch (error: any) {
        if (error?.code === 'P2025') {
            res.status(404).json('Orden de compra no encontrada');
        } else {
            console.error(error);
            res.status(500).json({ error: 'Hubo un error, pruebe más tarde' });
        }
    }
    return;
};

export const deleteOrdenDeCompra = async (req: Request, res: Response): Promise<void> => {
    const ordenId = parseInt(req.params.id);
    
    try {
        // Primero eliminar los detalles asociados
        await prisma.detalle.deleteMany({
            where: { ordenDeCompraId: ordenId }
        });
        
        // Luego eliminar la orden
        await prisma.ordenDeCompra.delete({
            where: { id: ordenId }
        });
        
        res.status(200).json({
            message: `Orden de compra ${ordenId} eliminada correctamente`
        });
    } catch (error: any) {
        if (error?.code === 'P2025') {
            res.status(404).json('Orden de compra no encontrada');
        } else {
            console.error(error);
            res.status(500).json({ error: 'Hubo un error, pruebe más tarde' });
        }
    }
    return;
};
