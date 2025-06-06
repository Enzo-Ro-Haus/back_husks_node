// src/services/detalle.service.ts
import prisma from "../models/detalle/detalle";
import { IDetalle } from "../models/detalle/detalle.interface";

/**
 * Para crear un detalle necesitas:
 * - data.ordenDeCompraId (number)
 * - data.productoId (number)
 * - data.cantidad (number)
 */
export const createDetalleService = async (data: {
  ordenDeCompraId: number;
  productoId: number;
  cantidad: number;
}) => {
  return prisma.create({
    data: {
      ordenDeCompra: { connect: { id: data.ordenDeCompraId } },
      producto: { connect: { id: data.productoId } },
      cantidad: data.cantidad,
    },
  });
};

export const getAllDetallesService = async () => {
  return prisma.findMany({
    include: {
      ordenDeCompra: true,
      producto: true,
    },
  });
};

export const getDetalleByIdService = async (id: number) => {
  return prisma.findUnique({
    where: { id },
    include: {
      ordenDeCompra: true,
      producto: true,
    },
  });
};

/**
 * Para actualizar solo cambias la cantidad.
 */
export const updateDetalleService = async (id: number, cantidad: number) => {
  return prisma.update({
    where: { id },
    data: { cantidad },
  });
};

export const deleteDetalleService = async (id: number) => {
  return prisma.delete({ where: { id } });
};
