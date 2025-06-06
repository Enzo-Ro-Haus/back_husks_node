// src/services/ordenDeCompra.service.ts
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient(); 
import { MetodoPagoEnum } from "../enums/MetodoPagoEnum";
import { EstadoOrdenEnum } from "../enums/EstadoOrdenEnum";

/**
 * Para crear una orden de compra necesitas:
 * - usuarioId (number)
 * - usuarioDireccionId (number)
 * - precioTotal (number)
 * - metodoPago (MetodoPagoEnum)
 * - estado (EstadoOrdenEnum)
 * - detalles: Array<{ productoId: number; cantidad: number }>
 */
export const createOrdenDeCompraService = async (data: {
  usuarioId: number;
  usuarioDireccionId: number;
  precioTotal: number;
  metodoPago: MetodoPagoEnum;
  estado: EstadoOrdenEnum;
  detalles: { productoId: number; cantidad: number }[];
}) => {
  return prisma.create({
    data: {
      usuario: { connect: { id: data.usuarioId } },
      usuarioDireccion: { connect: { id: data.usuarioDireccionId } },
      fecha: new Date(),
      precioTotal: data.precioTotal,
      metodoPago: data.metodoPago,
      estado: data.estado,
      detalles: {
        create: data.detalles.map((detalle) => ({
          producto: { connect: { id: detalle.productoId } },
          cantidad: detalle.cantidad,
        })),
      },
    },
    include: {
      usuario: true,
      usuarioDireccion: true,
      detalles: {
        include: {
          producto: true,
        },
      },
    },
  });
};

export const getAllOrdenesDeCompraService = async () => {
  return prisma.findMany({
    include: {
      usuario: true,
      usuarioDireccion: true,
      detalles: {
        include: {
          producto: true,
        },
      },
    },
  });
};

export const getOrdenDeCompraByIdService = async (id: number) => {
  return prisma.findUnique({
    where: { id },
    include: {
      usuario: true,
      usuarioDireccion: true,
      detalles: {
        include: {
          producto: true,
        },
      },
    },
  });
};

/**
 * Solo se permite actualizar el estado de la orden.
 */
export const updateOrdenDeCompraService = async (
  id: number,
  nuevoEstado: EstadoOrdenEnum
) => {
  return prisma.update({
    where: { id },
    data: { estado: nuevoEstado },
  });
};

export const deleteOrdenDeCompraService = async (id: number) => {
  // Primero eliminamos los detalles asociados
  await prisma.detalle.deleteMany({
    where: { ordenDeCompraId: id },
  });
  // Luego borramos la orden
  return prisma.delete({ where: { id } });
};
